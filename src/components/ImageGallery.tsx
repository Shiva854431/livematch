import { useState, useEffect } from 'react'
import { X, Image as ImageIcon, Download, Share2, ZoomIn } from 'lucide-react'
import { api } from '../api/client'
import type { Sport } from '../types'

export interface MatchImage {
  id: string
  url: string
  caption: string
  category: 'action' | 'celebration' | 'award' | 'team' | 'stadium' | 'other'
  uploadedAt: number
}

interface ImageGalleryProps {
  isOpen: boolean
  onClose: () => void
  sport?: Sport
  matchId?: string
}

export function ImageGallery({ isOpen, onClose, sport = 'cricket', matchId }: ImageGalleryProps) {
  const [images, setImages] = useState<MatchImage[]>([])
  const [selectedImage, setSelectedImage] = useState<MatchImage | null>(null)
  const [category, setCategory] = useState<'all' | 'action' | 'celebration' | 'award' | 'team' | 'stadium' | 'other'>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen, sport, matchId])

  const fetchImages = async () => {
    setLoading(true)
    try {
      const fetchedImages = await api.getImages(sport, matchId)
      setImages(fetchedImages as MatchImage[])
    } catch (error) {
      console.error('Failed to fetch images:', error)
      // Fallback to mock data if API fails
      setImages(getMockImages())
    } finally {
      setLoading(false)
    }
  }

  const getMockImages = (): MatchImage[] => [
    {
      id: '1',
      url: '/api/placeholder/400/400',
      caption: 'Amazing action shot',
      category: 'action',
      uploadedAt: Date.now() - 3600000,
    },
    {
      id: '2',
      url: '/api/placeholder/400/400',
      caption: 'Team celebration',
      category: 'celebration',
      uploadedAt: Date.now() - 7200000,
    },
    {
      id: '3',
      url: '/api/placeholder/400/400',
      caption: 'Award ceremony',
      category: 'award',
      uploadedAt: Date.now() - 10800000,
    },
    {
      id: '4',
      url: '/api/placeholder/400/400',
      caption: 'Team photo',
      category: 'team',
      uploadedAt: Date.now() - 18000000,
    },
  ]

  const filteredImages = category === 'all'
    ? images
    : images.filter(img => img.category === category)

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!isOpen) return null

  if (selectedImage) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{selectedImage.caption}</h3>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="aspect-video bg-black rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
            <img
              src={selectedImage.url}
              alt={selectedImage.caption}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ImageIcon className="h-4 w-4" />
              <span>{formatTime(selectedImage.uploadedAt)}</span>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl glass-strong rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white">Match Images</h3>
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium capitalize">
              {sport}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-white/10 flex gap-2 overflow-x-auto scrollbar-thin">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setCategory('action')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'action'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Action
          </button>
          <button
            type="button"
            onClick={() => setCategory('celebration')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'celebration'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Celebration
          </button>
          <button
            type="button"
            onClick={() => setCategory('award')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'award'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Awards
          </button>
          <button
            type="button"
            onClick={() => setCategory('team')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'team'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Team Photos
          </button>
          <button
            type="button"
            onClick={() => setCategory('stadium')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'stadium'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Stadium
          </button>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {loading ? (
            <p className="text-center text-slate-500 py-12">Loading images...</p>
          ) : filteredImages.length === 0 ? (
            <div className="p-8 text-center">
              <ImageIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No images available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800 hover:ring-2 hover:ring-emerald-500/50 transition-all"
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium line-clamp-2">{image.caption}</p>
                      <p className="text-slate-300 text-xs mt-1">{formatTime(image.uploadedAt)}</p>
                    </div>
                    <div className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center text-xs text-slate-400">
          {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
        </div>
      </div>
    </div>
  )
}
