import { useState, useEffect } from 'react'
import { BookOpen, Video, FileText, TrendingUp, Clock, Activity } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// Use backend on port 8000 by default; allow override via env
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')) ||
  'http://localhost:8000'

const StudentOverview = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    watchedVideos: 0,
    completedLessons: 0,
    studyHours: 0,
  })
  const [recentCourses, setRecentCourses] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true)
        setError('')

        // Build URL with studentId if available
        const url = new URL(`${API_BASE_URL}/api/student/overview`)
        if (user?.id) {
          url.searchParams.set('studentId', user.id)
        }

        const res = await fetch(url.toString())
        if (!res.ok) {
          throw new Error('Failed to load overview')
        }

        const data = await res.json()
        if (data.stats) setStats(data.stats)
        if (data.recentCourses) setRecentCourses(data.recentCourses)
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
  }, [user])

  const statCards = [
    {
      title: 'Enrolled Courses',
      value: stats.enrolledCourses,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Watched Videos',
      value: stats.watchedVideos,
      icon: Video,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Completed Lessons',
      value: stats.completedLessons,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Study Hours',
      value: stats.studyHours.toFixed(1),
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back! Continue your learning journey</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Continue Learning</h2>
          <div className="space-y-4">
            {recentCourses.length === 0 && !loading ? (
              <p className="text-gray-500 text-center py-8">
                No videos yet. Start watching videos to see them here!
              </p>
            ) : (
              recentCourses.map((course) => (
                <a
                  key={course.id}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-primary-300 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600">{course.instructor}</p>
                    </div>
                    <span className="text-xs text-gray-500">{course.lastAccessed}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-primary-600">{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-600" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-center py-4">Loading activities...</p>
            ) : recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No recent activity. Start watching videos, downloading resources, or accessing syllabus to see your activity here!
              </p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-200 last:border-0">
                  <div className="flex-shrink-0 mt-1 text-2xl">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentOverview
