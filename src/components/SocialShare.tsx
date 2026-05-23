import { useState } from 'react'
import { Share2, Twitter, Facebook, Link, Check, X } from 'lucide-react'

interface SocialShareProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url?: string
}

export function SocialShare({ isOpen, onClose, title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async (platform: string) => {
    if (navigator.share && platform === 'native') {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-strong rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-white">Share</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-400 mb-6 text-center">{title}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {navigator.share && (
              <button
                type="button"
                onClick={() => handleShare('native')}
                className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all"
              >
                <Share2 className="h-5 w-5 text-emerald-400" />
                <span className="text-white font-medium">More Options</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all"
            >
              <Twitter className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">Twitter</span>
            </button>

            <button
              type="button"
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-600/30 transition-all"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span className="text-white font-medium">Facebook</span>
            </button>

            <button
              type="button"
              onClick={() => handleShare('whatsapp')}
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 transition-all"
            >
              <span className="h-5 w-5 text-green-500 font-bold">W</span>
              <span className="text-white font-medium">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => handleShare('telegram')}
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/30 transition-all"
            >
              <span className="h-5 w-5 text-sky-500 font-bold">T</span>
              <span className="text-white font-medium">Telegram</span>
            </button>

            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all"
            >
              {copied ? (
                <Check className="h-5 w-5 text-emerald-400" />
              ) : (
                <Link className="h-5 w-5 text-slate-400" />
              )}
              <span className="text-white font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-slate-500 break-all">{shareUrl}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
