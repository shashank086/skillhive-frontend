import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Users, Video, FileText, TrendingUp } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const TeacherOverview = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalVideos: 0,
    totalContent: 0,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await fetch(`${API_BASE_URL}/api/teacher/overview`)
        if (!res.ok) {
          throw new Error('Failed to load teacher overview')
        }

        const data = await res.json()
        if (data.stats) setStats(data.stats)
        if (data.recentActivities) setRecentActivities(data.recentActivities)
      } catch (err) {
        console.error(err)
        setError('Unable to load dashboard data.')
        // No fallback data - show empty state
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [])

  const statCards = [
    {
      title: 'My Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Videos Uploaded',
      value: stats.totalVideos,
      icon: Video,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Study Materials',
      value: stats.totalContent,
      icon: FileText,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Manage your courses, content, and students</p>
        {loading && <p className="text-sm text-gray-500 mt-1">Loading dashboard...</p>}
        {error && !loading && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/teacher/syllabus')}
              className="w-full btn-primary text-left px-4 py-3"
            >
              Create New Course
            </button>
            <button
              onClick={() => navigate('/teacher/videos')}
              className="w-full btn-secondary text-left px-4 py-3"
            >
              Upload Video
            </button>
            <button
              onClick={() => navigate('/teacher/content')}
              className="w-full btn-secondary text-left px-4 py-3"
            >
              Add Study Material
            </button>
            <button
              onClick={() => navigate('/teacher/syllabus')}
              className="w-full btn-secondary text-left px-4 py-3"
            >
              Update Syllabus
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.length === 0 && !loading ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No recent activities yet. Start by creating courses, uploading videos, or adding study materials.
              </p>
            ) : (
              recentActivities.map((activity) => {
                const getIcon = () => {
                  switch (activity.type) {
                    case 'course':
                      return <BookOpen className="w-5 h-5 text-blue-600" />
                    case 'video':
                      return <Video className="w-5 h-5 text-purple-600" />
                    case 'content':
                      return <FileText className="w-5 h-5 text-orange-600" />
                    default:
                      return <TrendingUp className="w-5 h-5 text-gray-600" />
                  }
                }
                return (
                  <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-200 last:border-0">
                    <div className="flex-shrink-0 mt-1">{getIcon()}</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherOverview
