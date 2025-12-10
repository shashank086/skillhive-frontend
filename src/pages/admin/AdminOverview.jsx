import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, GraduationCap, TrendingUp, BookOpen, Briefcase } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const AdminOverview = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    totalPlacements: 0,
  })
  const [growthData, setGrowthData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingGrowth, setLoadingGrowth] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchGrowthData()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/users/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      setStats({
        totalStudents: data.totalStudents || 0,
        totalTeachers: data.totalTeachers || 0,
        activeCourses: data.activeCourses || 0,
        totalEnrollments: data.totalEnrollments || 0,
        totalPlacements: data.totalPlacements || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats({
        totalStudents: 0,
        totalTeachers: 0,
        activeCourses: 0,
        totalEnrollments: 0,
        totalPlacements: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchGrowthData = async () => {
    try {
      setLoadingGrowth(true)
      const response = await fetch(`${API_BASE_URL}/api/users/growth`)
      if (!response.ok) throw new Error('Failed to fetch growth data')

      const data = await response.json()
      setGrowthData(data)
    } catch (error) {
      console.error('Error fetching growth data:', error)
      setGrowthData([])
    } finally {
      setLoadingGrowth(false)
    }
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: GraduationCap,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers.toLocaleString(),
      icon: Users,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Active Courses',
      value: stats.activeCourses.toLocaleString(),
      icon: BookOpen,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Total Enrollments',
      value: stats.totalEnrollments.toLocaleString(),
      icon: TrendingUp,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      title: 'Placement Drives',
      value: stats.totalPlacements.toLocaleString(),
      icon: Briefcase,
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading statistics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform statistics and activities</p>
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

      {/* Growth and Activity Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Growth and Activity */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Student Growth & Activity</h2>
          {loadingGrowth ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">Loading graph data...</div>
            </div>
          ) : growthData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 text-sm">No data available</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStudentActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value, name) => {
                    if (name === 'Student Activity') {
                      return [`${value} activities`, name];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="students.total"
                  name="Total Students"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorStudents)"
                />
                <Area
                  type="monotone"
                  dataKey="students.activity.totalActivity"
                  name="Student Activity"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorStudentActivity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {!loadingGrowth && growthData.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-600">New Students (Last Month)</div>
                  <div className="text-lg font-semibold text-blue-700">
                    {growthData[growthData.length - 1]?.students.new || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Active Students (Last Month)</div>
                  <div className="text-lg font-semibold text-green-700">
                    {growthData[growthData.length - 1]?.students.active || 0}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs pt-2 border-t border-gray-100">
                <div>
                  <div className="text-gray-500">Video Views</div>
                  <div className="font-semibold text-gray-800">
                    {growthData[growthData.length - 1]?.students.activity.videoViews || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Downloads</div>
                  <div className="font-semibold text-gray-800">
                    {growthData[growthData.length - 1]?.students.activity.resourceDownloads || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Syllabus Access</div>
                  <div className="font-semibold text-gray-800">
                    {growthData[growthData.length - 1]?.students.activity.syllabusAccess || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Total Activity</div>
                  <div className="font-semibold text-green-700">
                    {growthData[growthData.length - 1]?.students.activity.totalActivity || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Teacher Growth and Activity */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Teacher Growth & Activity</h2>
          {loadingGrowth ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">Loading graph data...</div>
            </div>
          ) : growthData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 text-sm">No data available</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTeacherActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value, name) => {
                    if (name === 'Teacher Activity') {
                      return [`${value} activities`, name];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="teachers.total"
                  name="Total Teachers"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorTeachers)"
                />
                <Area
                  type="monotone"
                  dataKey="teachers.activity.totalActivity"
                  name="Teacher Activity"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorTeacherActivity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {!loadingGrowth && growthData.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-600">New Teachers (Last Month)</div>
                  <div className="text-lg font-semibold text-green-700">
                    {growthData[growthData.length - 1]?.teachers.new || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Active Teachers (Last Month)</div>
                  <div className="text-lg font-semibold text-purple-700">
                    {growthData[growthData.length - 1]?.teachers.active || 0}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs pt-2 border-t border-gray-100">
                <div>
                  <div className="text-gray-500">Videos Uploaded</div>
                  <div className="font-semibold text-gray-800">
                    {growthData[growthData.length - 1]?.teachers.activity.videosUploaded || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Resources Uploaded</div>
                  <div className="font-semibold text-gray-800">
                    {growthData[growthData.length - 1]?.teachers.activity.resourcesUploaded || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Syllabus Created</div>
                  <div className="font-semibold text-gray-800">
                    {growthData[growthData.length - 1]?.teachers.activity.syllabusCreated || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Total Activity</div>
                  <div className="font-semibold text-purple-700">
                    {growthData[growthData.length - 1]?.teachers.activity.totalActivity || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/students')}
              className="w-full btn-primary text-left px-4 py-3 hover:bg-primary-700 transition-colors"
            >
              View All Students
            </button>
            <button
              onClick={() => navigate('/admin/teachers')}
              className="w-full btn-primary text-left px-4 py-3 hover:bg-primary-700 transition-colors"
            >
              View All Teachers
            </button>
          </div>
        </div>

        {/* Platform Summary */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Total Users</span>
              <span className="font-semibold text-gray-800">
                {(stats.totalStudents + stats.totalTeachers).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Students</span>
              <span className="font-semibold text-gray-800">
                {stats.totalStudents.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600">Teachers</span>
              <span className="font-semibold text-gray-800">
                {stats.totalTeachers.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Platform Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
