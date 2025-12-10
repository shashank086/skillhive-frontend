import { useState, useEffect } from 'react'
import { Plus, BookOpen, Edit, Trash2, Save, X, FileText, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const SyllabusManagement = () => {
  const { user } = useAuth()
  const [syllabi, setSyllabi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [activeTab, setActiveTab] = useState('list') // list, ia, semester

  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    semester: '',
    academicYear: '',
    status: 'Draft',
    iaSyllabus: [],
    semesterSyllabus: [],
    materials: []
  })

  const [currentIA, setCurrentIA] = useState({
    examType: 'IA1',
    examDate: '',
    units: []
  })

  const [currentIAUnit, setCurrentIAUnit] = useState({
    unitNumber: '',
    unitName: '',
    topics: [''],
    marksWeightage: '',
    importantQuestions: [],
    questionPattern: '',
    estimatedHours: ''
  })

  const [currentSemUnit, setCurrentSemUnit] = useState({
    unitNumber: '',
    unitName: '',
    chapters: [],
    totalMarks: '',
    estimatedHours: ''
  })

  useEffect(() => {
    fetchSyllabi()
  }, [])

  const fetchSyllabi = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/syllabus`)
      if (!response.ok) throw new Error('Failed to fetch syllabi')
      const data = await response.json()
      setSyllabi(data)
    } catch (err) {
      console.error('Error fetching syllabi:', err)
      setError('Failed to load syllabi')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSyllabus = async () => {
    if (!formData.courseId || !formData.courseName || !formData.semester || !formData.academicYear) {
      alert('Please fill in all required fields (Course ID, Name, Semester, Academic Year)')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/syllabus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          teacherId: user?.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create syllabus')
      }

      await fetchSyllabi()
      resetForm()
      setIsAdding(false)
      alert('Syllabus created successfully!')
    } catch (err) {
      console.error('Error creating syllabus:', err)
      alert(`Failed to create syllabus: ${err.message}`)
    }
  }

  const handleUpdateSyllabus = async () => {
    if (!editingId) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/syllabus/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to update syllabus')

      await fetchSyllabi()
      resetForm()
      setEditingId(null)
      alert('Syllabus updated successfully!')
    } catch (err) {
      console.error('Error updating syllabus:', err)
      alert('Failed to update syllabus')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this syllabus?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/syllabus/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete syllabus')

      await fetchSyllabi()
      alert('Syllabus deleted successfully!')
    } catch (err) {
      console.error('Error deleting syllabus:', err)
      alert('Failed to delete syllabus')
    }
  }

  const handleEdit = (syllabus) => {
    setFormData({
      courseId: syllabus.courseId || '',
      courseName: syllabus.courseName || '',
      semester: syllabus.semester || '',
      academicYear: syllabus.academicYear || '',
      status: syllabus.status || 'Draft',
      iaSyllabus: syllabus.iaSyllabus || [],
      semesterSyllabus: syllabus.semesterSyllabus || [],
      materials: syllabus.materials || []
    })
    setEditingId(syllabus.id)
    setIsAdding(false)
    setActiveTab('ia')
  }

  const addIAUnit = () => {
    if (!currentIAUnit.unitNumber || !currentIAUnit.unitName) {
      alert('Please fill unit number and name')
      return
    }

    const newUnit = {
      ...currentIAUnit,
      topics: currentIAUnit.topics.filter(t => t.trim() !== ''),
      marksWeightage: Number(currentIAUnit.marksWeightage) || 0,
      estimatedHours: Number(currentIAUnit.estimatedHours) || 0
    }

    let iaSection = formData.iaSyllabus.find(ia => ia.examType === currentIA.examType)
    if (!iaSection) {
      iaSection = { examType: currentIA.examType, examDate: currentIA.examDate, units: [] }
      setFormData({ ...formData, iaSyllabus: [...formData.iaSyllabus, iaSection] })
    }

    iaSection.units.push(newUnit)
    setFormData({ ...formData })

    // Reset unit form
    setCurrentIAUnit({
      unitNumber: '',
      unitName: '',
      topics: [''],
      marksWeightage: '',
      importantQuestions: [],
      questionPattern: '',
      estimatedHours: ''
    })

    alert('IA Unit added!')
  }

  const addSemesterUnit = () => {
    if (!currentSemUnit.unitNumber || !currentSemUnit.unitName) {
      alert('Please fill unit number and name')
      return
    }

    const newUnit = {
      ...currentSemUnit,
      totalMarks: Number(currentSemUnit.totalMarks) || 0,
      estimatedHours: Number(currentSemUnit.estimatedHours) || 0
    }

    setFormData({
      ...formData,
      semesterSyllabus: [...formData.semesterSyllabus, newUnit]
    })

    // Reset unit form
    setCurrentSemUnit({
      unitNumber: '',
      unitName: '',
      chapters: [],
      totalMarks: '',
      estimatedHours: ''
    })

    alert('Semester Unit added!')
  }

  const resetForm = () => {
    setFormData({
      courseId: '',
      courseName: '',
      semester: '',
      academicYear: '',
      status: 'Draft',
      iaSyllabus: [],
      semesterSyllabus: [],
      materials: []
    })
    setCurrentIA({ examType: 'IA1', examDate: '', units: [] })
    setCurrentIAUnit({
      unitNumber: '',
      unitName: '',
      topics: [''],
      marksWeightage: '',
      importantQuestions: [],
      questionPattern: '',
      estimatedHours: ''
    })
    setCurrentSemUnit({
      unitNumber: '',
      unitName: '',
      chapters: [],
      totalMarks: '',
      estimatedHours: ''
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    resetForm()
    setActiveTab('list')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading syllabi...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Syllabus Management</h1>
          <p className="text-gray-600">Create and manage IA & Semester exam syllabi</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); setActiveTab('ia') }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Syllabus</span>
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
        <div className="card bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId ? 'Edit Syllabus' : 'Create New Syllabus'}
          </h2>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course ID *</label>
              <input
                type="text"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g., CS501"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
              <input
                type="text"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g., Database Management Systems"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
              <input
                type="number"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g., 2024-25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('ia')}
                className={`px-4 py-2 font-medium ${activeTab === 'ia' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
              >
                IA Syllabus ({formData.iaSyllabus.length})
              </button>
              <button
                onClick={() => setActiveTab('semester')}
                className={`px-4 py-2 font-medium ${activeTab === 'semester' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
              >
                Semester Syllabus ({formData.semesterSyllabus.length})
              </button>
            </div>
          </div>

          {/* IA Syllabus Tab */}
          {activeTab === 'ia' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Add IA Exam Unit</h3>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <select
                    value={currentIA.examType}
                    onChange={(e) => setCurrentIA({ ...currentIA, examType: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="IA1">IA1</option>
                    <option value="IA2">IA2</option>
                    <option value="IA3">IA3</option>
                  </select>
                  <input
                    type="number"
                    value={currentIAUnit.unitNumber}
                    onChange={(e) => setCurrentIAUnit({ ...currentIAUnit, unitNumber: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Unit Number"
                  />
                  <input
                    type="text"
                    value={currentIAUnit.unitName}
                    onChange={(e) => setCurrentIAUnit({ ...currentIAUnit, unitName: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Unit Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="number"
                    value={currentIAUnit.marksWeightage}
                    onChange={(e) => setCurrentIAUnit({ ...currentIAUnit, marksWeightage: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Marks Weightage"
                  />
                  <input
                    type="number"
                    value={currentIAUnit.estimatedHours}
                    onChange={(e) => setCurrentIAUnit({ ...currentIAUnit, estimatedHours: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Estimated Hours"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Topics (one per line)</label>
                  <textarea
                    value={currentIAUnit.topics.join('\n')}
                    onChange={(e) => setCurrentIAUnit({ ...currentIAUnit, topics: e.target.value.split('\n') })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter topics, one per line"
                  />
                </div>
                <button onClick={addIAUnit} className="btn-primary text-sm">
                  <Plus className="w-4 h-4 inline mr-1" /> Add Unit to {currentIA.examType}
                </button>
              </div>

              {/* Display Added IA Units */}
              {formData.iaSyllabus.map((ia, iaIdx) => (
                <div key={iaIdx} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-2">{ia.examType}</h4>
                  {ia.units.map((unit, unitIdx) => (
                    <div key={unitIdx} className="bg-gray-50 p-3 rounded mb-2">
                      <div className="font-medium">Unit {unit.unitNumber}: {unit.unitName}</div>
                      <div className="text-sm text-gray-600">Marks: {unit.marksWeightage} | Hours: {unit.estimatedHours}</div>
                      <div className="text-sm text-gray-600">Topics: {unit.topics.join(', ')}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Semester Syllabus Tab */}
          {activeTab === 'semester' && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">Add Semester Exam Unit</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="number"
                    value={currentSemUnit.unitNumber}
                    onChange={(e) => setCurrentSemUnit({ ...currentSemUnit, unitNumber: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Unit Number"
                  />
                  <input
                    type="text"
                    value={currentSemUnit.unitName}
                    onChange={(e) => setCurrentSemUnit({ ...currentSemUnit, unitName: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Unit Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="number"
                    value={currentSemUnit.totalMarks}
                    onChange={(e) => setCurrentSemUnit({ ...currentSemUnit, totalMarks: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Total Marks"
                  />
                  <input
                    type="number"
                    value={currentSemUnit.estimatedHours}
                    onChange={(e) => setCurrentSemUnit({ ...currentSemUnit, estimatedHours: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Estimated Hours"
                  />
                </div>
                <button onClick={addSemesterUnit} className="btn-primary text-sm">
                  <Plus className="w-4 h-4 inline mr-1" /> Add Semester Unit
                </button>
              </div>

              {/* Display Added Semester Units */}
              {formData.semesterSyllabus.map((unit, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                  <div className="font-medium">Unit {unit.unitNumber}: {unit.unitName}</div>
                  <div className="text-sm text-gray-600">Marks: {unit.totalMarks} | Hours: {unit.estimatedHours}</div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6 pt-6 border-t">
            <button onClick={editingId ? handleUpdateSyllabus : handleCreateSyllabus} className="btn-primary flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Update Syllabus' : 'Create Syllabus'}</span>
            </button>
            <button onClick={handleCancel} className="btn-secondary flex items-center space-x-2">
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Syllabus List */}
      {!isAdding && !editingId && (
        <div className="grid grid-cols-1 gap-4">
          {syllabi.map((syllabus) => (
            <div key={syllabus.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-800">{syllabus.courseName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${syllabus.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {syllabus.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Course ID: {syllabus.courseId} | Semester: {syllabus.semester} | Year: {syllabus.academicYear}</div>
                    <div className="flex gap-4">
                      <span>📝 IA Exams: {syllabus.iaCount}</span>
                      <span>📚 Semester Units: {syllabus.semUnitsCount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(syllabus)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(syllabus.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {syllabi.length === 0 && !loading && !isAdding && !editingId && (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No syllabi yet. Create your first one!</p>
          <button onClick={() => { setIsAdding(true); setActiveTab('ia') }} className="btn-primary">
            Create Syllabus
          </button>
        </div>
      )}
    </div>
  )
}

export default SyllabusManagement
