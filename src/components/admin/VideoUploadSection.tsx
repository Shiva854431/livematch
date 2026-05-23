import { useState, useRef } from 'react'
import { Upload, X, Video, Trash2, Play, Check, AlertCircle } from 'lucide-react'
import { api } from '../../api/client'

interface VideoUploadSectionProps {
  sport: string
  onSave: (videos: VideoHighlight[]) => Promise<void>
  existingVideos?: VideoHighlight[]
}

interface VideoHighlight {
  id: string
  title: string
  description: string
  category: 'goal' | 'wicket' | 'amazing' | 'interview' | 'analysis'
  thumbnail: string
  videoUrl: string
  duration: string
  uploadedAt: number
}

export function VideoUploadSection({ sport, onSave, existingVideos = [] }: VideoUploadSectionProps) {
  const [videos, setVideos] = useState<VideoHighlight[]>(existingVideos)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setError('Please select a video file')
      return
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      setError('Video file must be less than 500MB')
      return
    }

    await uploadVideo(file)
  }

  const uploadVideo = async (file: File) => {
    setUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      // Get video duration before upload
      const video = document.createElement('video')
      const videoUrl = URL.createObjectURL(file)
      video.src = videoUrl
      
      const duration = await new Promise<number>((resolve) => {
        video.onloadedmetadata = () => resolve(video.duration)
      })
      
      const formattedDuration = formatDuration(duration)

      // Upload to server
      const result = await api.uploadVideo(file, {
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        category: 'amazing',
        sport,
      })

      setUploadProgress(100)

      const newVideo: VideoHighlight = {
        id: result.id,
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        category: 'amazing',
        thumbnail: result.thumbnail,
        videoUrl: result.url,
        duration: formattedDuration,
        uploadedAt: Date.now(),
      }

      setVideos(prev => [...prev, newVideo])
      
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (err) {
      setError('Failed to upload video')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id))
  }

  const updateVideo = (id: string, updates: Partial<VideoHighlight>) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
  }

  const handleSave = async () => {
    try {
      await onSave(videos)
    } catch (err) {
      setError('Failed to save videos')
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="font-bold text-slate-200">Video Highlights — {sport}</h2>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Upload Button */}
      <div className="glass rounded-xl p-6 border-2 border-dashed border-white/10 hover:border-emerald-500/30 transition-all">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center gap-3 py-8"
        >
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            {uploading ? (
              <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-emerald-400" />
            )}
          </div>
          <div className="text-center">
            <p className="text-white font-medium">
              {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Match Highlight'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              MP4, WebM, or MOV (max 500MB)
            </p>
          </div>
        </button>
      </div>

      {/* Video List */}
      <div className="space-y-3">
        {videos.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No videos uploaded yet</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="glass rounded-xl p-4">
              <div className="flex gap-4">
                <div className="relative aspect-video w-48 rounded-lg overflow-hidden bg-black flex-shrink-0">
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs">
                    {video.duration}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={video.title}
                    onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                    className="w-full bg-transparent text-white font-medium focus:outline-none focus:bg-white/5 rounded px-2 py-1 mb-2"
                    placeholder="Video title"
                  />
                  
                  <textarea
                    value={video.description}
                    onChange={(e) => updateVideo(video.id, { description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                    rows={2}
                    placeholder="Video description"
                  />

                  <div className="flex items-center gap-3 mt-3">
                    <select
                      value={video.category}
                      onChange={(e) => updateVideo(video.id, { category: e.target.value as any })}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                      <option value="goal">Goal/Six</option>
                      <option value="wicket">Wicket</option>
                      <option value="amazing">Amazing Play</option>
                      <option value="interview">Interview</option>
                      <option value="analysis">Analysis</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => deleteVideo(video.id)}
                      className="ml-auto p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Save Button */}
      {videos.length > 0 && (
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
        >
          Save Videos
        </button>
      )}
    </section>
  )
}
