import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Clock, CheckCircle, Award, FileText, ChevronDown, ChevronUp } from 'lucide-react'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

const SyllabusView = () => {
  const [syllabi, setSyllabi] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedSyllabus, setExpandedSyllabus] = useState(null)
  const [activeTab, setActiveTab] = useState('ia') // ia or semester

  useEffect(() => {
    fetchSyllabi()
  }, [])

  const fetchSyllabi = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/syllabus/student`)

      if (!response.ok) {
        throw new Error('Failed to fetch syllabi')
      }

      const data = await response.json()
      setSyllabi(data)
    } catch (error) {
      console.error('Error fetching syllabi:', error)
      setSyllabi([])
    } finally {
      setLoading(false)
    }
  }

  const toggleSyllabus = (id) => {
    setExpandedSyllabus(expandedSyllabus === id ? null : id)
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
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Syllabus</h1>
        <p className="text-gray-600">View IA and Semester exam syllabus for your courses</p>
      </div>

      <div className="space-y-4">
        {syllabi.map((syllabus) => {
          const isExpanded = expandedSyllabus === syllabus._id
          const totalIAUnits = syllabus.iaSyllabus?.reduce((sum, ia) => sum + (ia.units?.length || 0), 0) || 0
          const totalSemUnits = syllabus.semesterSyllabus?.length || 0

          return (
            <div key={syllabus._id} className="card">
              {/* Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSyllabus(syllabus._id)}
              >
                <div className="flex items-center flex-1">
                  <BookOpen className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{syllabus.courseName}</h2>
                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                      <span>Semester: {syllabus.semester}</span>
                      <span>Year: {syllabus.academicYear}</span>
                      <span className="text-primary-600">📝 {totalIAUnits} IA Units</span>
                      <span className="text-green-600">📚 {totalSemUnits} Sem Units</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {/* Tabs */}
                  <div className="flex space-x-4 mb-6 border-b border-gray-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab('ia') }}
                      className={`px-4 py-2 font-medium ${activeTab === 'ia' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
                    >
                      IA Exams ({syllabus.iaSyllabus?.length || 0})
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveTab('semester') }}
                      className={`px-4 py-2 font-medium ${activeTab === 'semester' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
                    >
                      Semester Exam ({totalSemUnits} Units)
                    </button>
                  </div>

                  {/* IA Syllabus Tab */}
                  {activeTab === 'ia' && (
                    <div className="space-y-4">
                      {syllabus.iaSyllabus && syllabus.iaSyllabus.length > 0 ? (
                        syllabus.iaSyllabus.map((ia, iaIdx) => (
                          <div key={iaIdx} className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-bold text-blue-900">{ia.examType}</h3>
                              {ia.examDate && (
                                <div className="flex items-center text-sm text-blue-700">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(ia.examDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>

                            {/* Units */}
                            <div className="space-y-3">
                              {ia.units && ia.units.map((unit, unitIdx) => (
                                <div key={unitIdx} className="bg-white rounded-lg p-4 border border-blue-200">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-gray-800">
                                      Unit {unit.unitNumber}: {unit.unitName}
                                    </h4>
                                    <div className="flex gap-3 text-sm">
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        {unit.marksWeightage} marks
                                      </span>
                                      {unit.estimatedHours > 0 && (
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {unit.estimatedHours}h
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Topics */}
                                  {unit.topics && unit.topics.length > 0 && (
                                    <div className="mb-3">
                                      <div className="text-sm font-medium text-gray-700 mb-2">Topics:</div>
                                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                        {unit.topics.map((topic, topicIdx) => (
                                          <li key={topicIdx}>{topic}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Important Questions */}
                                  {unit.importantQuestions && unit.importantQuestions.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <div className="text-sm font-medium text-gray-700 mb-2">
                                        <Award className="w-4 h-4 inline mr-1" />
                                        Important Questions:
                                      </div>
                                      <div className="space-y-2">
                                        {unit.importantQuestions.map((q, qIdx) => (
                                          <div key={qIdx} className="text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
                                            <div className="flex items-start justify-between">
                                              <span className="text-gray-700">{q.question}</span>
                                              <div className="flex gap-2 ml-2">
                                                <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs">
                                                  {q.marks}m
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-xs ${q.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                                                  q.difficulty === 'Hard' ? 'bg-red-200 text-red-800' :
                                                    'bg-orange-200 text-orange-800'
                                                  }`}>
                                                  {q.difficulty}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Question Pattern */}
                                  {unit.questionPattern && (
                                    <div className="mt-2 text-sm text-gray-600 italic">
                                      Pattern: {unit.questionPattern}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          No IA syllabus available yet
                        </div>
                      )}
                    </div>
                  )}

                  {/* Semester Syllabus Tab */}
                  {activeTab === 'semester' && (
                    <div className="space-y-4">
                      {syllabus.semesterSyllabus && syllabus.semesterSyllabus.length > 0 ? (
                        syllabus.semesterSyllabus.map((unit, unitIdx) => (
                          <div key={unitIdx} className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-bold text-lg text-gray-800">
                                Unit {unit.unitNumber}: {unit.unitName}
                              </h4>
                              <div className="flex gap-3 text-sm">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                  {unit.totalMarks} marks
                                </span>
                                {unit.estimatedHours > 0 && (
                                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {unit.estimatedHours}h
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Chapters */}
                            {unit.chapters && unit.chapters.length > 0 && (
                              <div className="space-y-3">
                                {unit.chapters.map((chapter, chapterIdx) => (
                                  <div key={chapterIdx} className="bg-white rounded-lg p-3 border border-green-100">
                                    <div className="flex items-start justify-between mb-2">
                                      <h5 className="font-medium text-gray-800">
                                        Chapter {chapter.chapterNumber}: {chapter.chapterName}
                                      </h5>
                                      <div className="flex gap-2">
                                        {chapter.priority && (
                                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${chapter.priority === 'High' ? 'bg-red-100 text-red-700' :
                                            chapter.priority === 'Low' ? 'bg-gray-100 text-gray-700' :
                                              'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {chapter.priority}
                                          </span>
                                        )}
                                        {chapter.repeatedInPreviousYears && (
                                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                                            ⭐ Repeated
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Topics */}
                                    {chapter.topics && chapter.topics.length > 0 && (
                                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mb-2">
                                        {chapter.topics.map((topic, topicIdx) => (
                                          <li key={topicIdx}>{topic}</li>
                                        ))}
                                      </ul>
                                    )}

                                    {/* Reference Books */}
                                    {chapter.referenceBooks && chapter.referenceBooks.length > 0 && (
                                      <div className="mt-2 text-xs text-gray-500">
                                        <span className="font-medium">References:</span> {chapter.referenceBooks.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          No semester syllabus available yet
                        </div>
                      )}
                    </div>
                  )}

                  {/* Study Materials */}
                  {syllabus.materials && syllabus.materials.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-3">📚 Study Materials</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {syllabus.materials.map((material, idx) => (
                          <a
                            key={idx}
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-colors"
                          >
                            <FileText className="w-5 h-5 text-primary-600 mr-2" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-800">{material.title}</div>
                              <div className="text-xs text-gray-500">{material.type}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {syllabi.length === 0 && (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No syllabus available yet.</p>
          <p className="text-sm text-gray-500 mt-2">Your teachers will publish the syllabus soon.</p>
        </div>
      )}
    </div>
  )
}

export default SyllabusView
