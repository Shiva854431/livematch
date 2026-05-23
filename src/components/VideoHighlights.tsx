import { useState, useEffect } from 'react'
import { Play, X, Clock, Eye, Download, Share2 } from 'lucide-react'
import { api } from '../api/client'
import type { Sport } from '../types'

export interface VideoHighlight {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
  views: number
  timestamp: number
  category: 'goal' | 'wicket' | 'amazing' | 'interview' | 'analysis'
}

interface VideoHighlightsProps {
  isOpen: boolean
  onClose: () => void
  sport?: Sport
  matchId?: string
}

export function VideoHighlights({ isOpen, onClose, sport = 'cricket', matchId }: VideoHighlightsProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoHighlight | null>(null)
  const [category, setCategory] = useState<'all' | 'goal' | 'wicket' | 'amazing' | 'interview' | 'analysis'>('all')
  const [highlights, setHighlights] = useState<VideoHighlight[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchVideos()
    }
  }, [isOpen, sport])

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const videos = await api.getVideos(sport)
      // Transform API response to match our interface
      const transformedVideos: VideoHighlight[] = videos.map(v => ({
        id: v.id,
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnail,
        videoUrl: v.videoUrl,
        duration: v.duration,
        views: Math.floor(Math.random() * 200000), // Mock views since API doesn't provide
        timestamp: v.uploadedAt,
        category: v.category as any,
      }))
      setHighlights(transformedVideos)
    } catch (error) {
      console.error('Failed to fetch videos:', error)
      // Fallback to mock data if API fails
      setHighlights(getMockHighlights())
    } finally {
      setLoading(false)
    }
  }

  const getMockHighlights = (): VideoHighlight[] => [
    {
      id: '1',
      title: 'Amazing Six by Kohli - Final Over',
      description: 'Incredible six in the final over',
      thumbnail: '/api/placeholder/320/180',
      videoUrl: '',
      duration: '0:45',
      views: 125000,
      timestamp: Date.now() - 3600000,
      category: 'goal',
    },
    {
      id: '2',
      title: 'Perfect Yorker - Wicket!',
      description: 'Perfect delivery to get the wicket',
      thumbnail: '/api/placeholder/320/180',
      videoUrl: '',
      duration: '0:30',
      views: 89000,
      timestamp: Date.now() - 7200000,
      category: 'wicket',
    },
    {
      id: '3',
      title: 'Best Catch of the Match',
      description: 'Spectacular catch in the outfield',
      thumbnail: '/api/placeholder/320/180',
      videoUrl: '',
      duration: '0:25',
      views: 156000,
      timestamp: Date.now() - 10800000,
      category: 'amazing',
    },
    {
      id: '4',
      title: 'Post-Match Interview',
      description: 'Captain speaks after the match',
      thumbnail: '/api/placeholder/320/180',
      videoUrl: '',
      duration: '5:20',
      views: 45000,
      timestamp: Date.now() - 18000000,
      category: 'interview',
    },
    {
      id: '5',
      title: 'Match Analysis - Key Moments',
      description: 'Analysis of the turning points',
      thumbnail: '/api/placeholder/320/180',
      videoUrl: '',
      duration: '8:15',
      views: 67000,
      timestamp: Date.now() - 21600000,
      category: 'analysis',
    },
  ]

  const filteredHighlights = category === 'all'
    ? highlights
    : highlights.filter(h => h.category === category)

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!isOpen) return null

  if (selectedVideo) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="aspect-video bg-black rounded-2xl flex items-center justify-center border border-white/10">
            <div className="text-center">
              <Play className="h-16 w-16 text-white mx-auto mb-4" />
              <p className="text-white">Video Player</p>
              <p className="text-slate-400 text-sm mt-2">Duration: {selectedVideo.duration}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Eye className="h-4 w-4" />
              <span>{formatViews(selectedVideo.views)} views</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4" />
              <span>{formatTime(selectedVideo.timestamp)}</span>
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
      <div className="w-full max-w-4xl glass-strong rounded-2xl border border-white/10 overflow-hidden max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-white">Video Highlights</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

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
            onClick={() => setCategory('goal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'goal'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Goals/Sixes
          </button>
          <button
            type="button"
            onClick={() => setCategory('wicket')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'wicket'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Wickets
          </button>
          <button
            type="button"
            onClick={() => setCategory('amazing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'amazing'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Amazing Plays
          </button>
          <button
            type="button"
            onClick={() => setCategory('interview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'interview'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Interviews
          </button>
          <button
            type="button"
            onClick={() => setCategory('analysis')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              category === 'analysis'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Analysis
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredHighlights.map((highlight) => (
              <button
                key={highlight.id}
                type="button"
                onClick={() => setSelectedVideo(highlight)}
                className="group text-left"
              >
                <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden mb-3">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                    <Play className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium">
                    {highlight.duration}
                  </div>
                </div>
                <h4 className="text-white font-medium mb-2 line-clamp-2">{highlight.title}</h4>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{formatViews(highlight.views)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(highlight.timestamp)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
