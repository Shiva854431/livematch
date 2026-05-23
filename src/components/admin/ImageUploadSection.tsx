import { useState, useRef } from 'react'
import { Upload, Trash2, AlertCircle } from 'lucide-react'
import { api } from '../../api/client'

interface MatchImage {
  id: string
  url: string
  caption: string
  category: 'action' | 'celebration' | 'award' | 'team' | 'stadium' | 'other'
  uploadedAt: number
}

interface ImageUploadSectionProps {
  sport: string
  matchId?: string
  onSave: (images: MatchImage[]) => Promise<void>
  existingImages?: MatchImage[]
}

export function ImageUploadSection({ sport, matchId, onSave, existingImages = [] }: ImageUploadSectionProps) {
  const [images, setImages] = useState<MatchImage[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Please select image files only')
        return
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit per image
        setError('Image file must be less than 10MB')
        return
      }

      await uploadImage(file)
    }
  }

  const uploadImage = async (file: File) => {
    setUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload to server
      const result = await api.uploadImage(file, {
        caption: file.name.replace(/\.[^/.]+$/, ''),
        category: 'action',
        sport,
        matchId,
      })

      clearInterval(interval)
      setUploadProgress(100)

      const newImage: MatchImage = {
        id: result.id,
        url: result.url,
        caption: file.name.replace(/\.[^/.]+$/, ''),
        category: 'action',
        uploadedAt: Date.now(),
      }

      setImages(prev => [...prev, newImage])
      
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (err) {
      setError('Failed to upload image')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const updateImage = (id: string, updates: Partial<MatchImage>) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img))
  }

  const handleSave = async () => {
    try {
      await onSave(images)
    } catch (err) {
      setError('Failed to save images')
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="font-bold text-slate-200">Match Images — {sport}</h2>

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
          accept="image/*"
          multiple
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
              {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Match Images'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              JPG, PNG, WebP (max 10MB each, multiple files allowed)
            </p>
          </div>
        </button>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="glass rounded-xl overflow-hidden group">
            <div className="relative aspect-square">
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => deleteImage(image.id)}
                className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3">
              <input
                type="text"
                value={image.caption}
                onChange={(e) => updateImage(image.id, { caption: e.target.value })}
                className="w-full bg-transparent text-white text-sm focus:outline-none focus:bg-white/5 rounded px-2 py-1 mb-2"
                placeholder="Add caption..."
              />
              <select
                value={image.category}
                onChange={(e) => updateImage(image.id, { category: e.target.value as any })}
                className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="action">Action Shot</option>
                <option value="celebration">Celebration</option>
                <option value="award">Award</option>
                <option value="team">Team Photo</option>
                <option value="stadium">Stadium</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="text-center text-slate-500 py-8">No images uploaded yet</p>
      )}

      {/* Save Button */}
      {images.length > 0 && (
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
        >
          Save Images
        </button>
      )}
    </section>
  )
}
