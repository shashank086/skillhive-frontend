import { useState, useEffect } from 'react'
import { Plus, Video, Edit, Trash2, Save, X, Upload, Play } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const VideoManagement = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    course: '',
    url: '',
    status: 'Draft',
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/videos`)
      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }
      const data = await response.json()
      setVideos(data)
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (formData.title && formData.description && formData.duration && formData.course && formData.url) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/videos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            teacherId: user?.id
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create video')
        }

        await fetchVideos()
        setFormData({ title: '', description: '', duration: '', course: '', url: '', status: 'Draft' })
        setIsAdding(false)
        alert('Video added successfully!')
      } catch (err) {
        console.error('Error adding video:', err)
        alert('Failed to add video')
      }
    }
  }

  const handleEdit = (video) => {
    setFormData({
      title: video.title,
      description: video.description,
      duration: video.duration,
      course: video.course,
      url: video.url,
      status: 'Published', // Default to published for existing videos
    })
    setEditingId(video.id)
    setIsAdding(false)
  }

  const handleSave = async () => {
    if (editingId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/videos/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to update video')
        }

        await fetchVideos()
        setEditingId(null)
        setFormData({ title: '', description: '', duration: '', course: '', url: '', status: 'Draft' })
        alert('Video updated successfully!')
      } catch (err) {
        console.error('Error updating video:', err)
        alert('Failed to update video')
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete video')
        }

        await fetchVideos()
        alert('Video deleted successfully!')
      } catch (err) {
        console.error('Error deleting video:', err)
        alert('Failed to delete video')
      }
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ title: '', description: '', duration: '', course: '', url: '', status: 'Draft' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading videos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Video Management</h1>
          <p className="text-gray-600">Upload and manage educational videos for your students</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Video</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="card bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Video' : 'Add New Video'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter video title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="e.g., React Development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo, or direct video link</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter video description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (MM:SS)
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="15:30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={editingId ? handleSave : handleAdd} className="btn-primary flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Save Changes' : 'Add Video'}</span>
              </button>
              <button onClick={handleCancel} className="btn-secondary flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Video Thumbnail */}
            <div className="relative bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden">
              <Video className="w-16 h-16 text-gray-400" />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity cursor-pointer">
                <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex-1">{video.title}</h3>
              {!isAdding && !editingId && (
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-primary-600 font-medium mb-2">{video.course}</p>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">{video.views} views</span>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Watch Video →
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-2">Uploaded: {video.uploadDate}</p>
          </div>
        ))}
      </div>

      {videos.length === 0 && !loading && (
        <div className="card text-center py-12">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No videos uploaded yet. Upload your first video!</p>
          <button onClick={() => setIsAdding(true)} className="btn-primary">
            Add Video
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoManagement
