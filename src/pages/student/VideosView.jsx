import { useState, useEffect } from 'react'
import { Video, Play, Clock, Eye, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

const VideosView = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError('')

        const url = new URL('/api/videos', API_BASE_URL)
        if (searchTerm) {
          url.searchParams.set('search', searchTerm)
        }

        const res = await fetch(url.toString())
        if (!res.ok) {
          throw new Error('Failed to load videos')
        }

        const data = await res.json()

        // Map backend data to include watched/progress defaults
        const mapped = data.map((v) => ({
          ...v,
          watched: false,
          progress: 0,
        }))

        setVideos(mapped)
      } catch (err) {
        console.error(err)
        setError('Unable to load videos. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [searchTerm])

  // Track video view when student clicks on video
  const handleVideoClick = async (videoId) => {
    try {
      await fetch(`${API_BASE_URL}/api/videos/${videoId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user?.id
        })
      })

      // Update local state to increment view count
      setVideos(prevVideos =>
        prevVideos.map(v =>
          v.id === videoId ? { ...v, views: v.views + 1, watched: true } : v
        )
      )
    } catch (err) {
      console.error('Error tracking video view:', err)
    }
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCourses = () => {
    return [...new Set(videos.map((v) => v.course))]
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
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Video Library</h1>
        <p className="text-gray-600">Access all your course videos and track your learning progress</p>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search videos by title, course, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="card hover:shadow-xl transition-all duration-200 cursor-pointer group"
          >
            {/* Video Thumbnail */}
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleVideoClick(video.id)}
              className="block"
            >
              <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden">
                <Video className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all">
                  <div className="bg-white rounded-full p-4 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                    <Play className="w-8 h-8 text-primary-600 fill-current" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {video.duration}
                </div>

                {/* Progress Bar (dummy for now) */}
                {video.watched && video.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30">
                    <div
                      className="h-full bg-white transition-all"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </a>

            {/* Video Info */}
            <div className="mb-2">
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                {video.course}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {video.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>

            {/* Video Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center text-xs text-gray-500">
                <Eye className="w-4 h-4 mr-1" />
                {video.views} views
              </div>
              {video.watched ? (
                <span className="text-xs font-medium text-green-600">
                  {video.progress === 100 ? 'Completed' : `${video.progress}% watched`}
                </span>
              ) : (
                <span className="text-xs font-medium text-gray-400">Not started</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Uploaded: {video.uploadDate}</p>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="card text-center py-12">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No videos found matching your search.</p>
        </div>
      )}
    </div>
  )
}

export default VideosView
