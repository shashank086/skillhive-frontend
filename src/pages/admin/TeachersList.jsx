import { useState, useEffect } from 'react'
import { Search, Users, Mail, BookOpen, Calendar } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const TeachersList = () => {
  const [teachers, setTeachers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/users?role=teacher`)
      if (!response.ok) throw new Error('Failed to fetch teachers')

      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading teachers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Teachers</h1>
          <p className="text-gray-600">Manage and view all registered teachers</p>
        </div>
        <div className="text-2xl font-bold text-green-600">
          {teachers.length} Total
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search teachers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm ? 'No teachers found matching your search.' : 'No teachers registered yet.'}
            </p>
          </div>
        ) : (
          filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-800">{teacher.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {teacher.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                {teacher.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Phone</span>
                    <span className="text-sm font-medium text-gray-800">{teacher.phone}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Join Date
                  </span>
                  <span className="text-sm font-medium text-gray-800">{teacher.joinDate}</span>
                </div>
                <div className="pt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {teacher.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TeachersList
