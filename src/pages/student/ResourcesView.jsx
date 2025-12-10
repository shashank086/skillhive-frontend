import { useEffect, useState } from 'react'
import { FileText, Download, Search, Filter, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const ResourcesView = () => {
    const { user } = useAuth()
    const [resources, setResources] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('All')
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [expandedResources, setExpandedResources] = useState(new Set())

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const url = new URL('/api/resources', API_BASE_URL)
                const res = await fetch(url.toString())
                if (!res.ok) throw new Error('Failed to load resources')
                const data = await res.json()
                setResources(data)
            } catch (err) {
                console.error('Error loading resources', err)
            }
        }

        fetchResources()
    }, [])

    // Get unique subjects for filtering
    const subjects = ['All', ...new Set(resources.map(r => r.subject).filter(Boolean))]

    // Check if URL is an external link (Google Drive, Dropbox, etc.) or direct file
    const isExternalLink = (url) => {
        if (!url) return false
        const lowerUrl = url.toLowerCase()
        return lowerUrl.includes('drive.google.com') ||
            lowerUrl.includes('dropbox.com') ||
            lowerUrl.includes('docs.google.com') ||
            lowerUrl.includes('onedrive.live.com') ||
            url.startsWith('http')
    }

    // Handle download with tracking
    const handleDownload = async (resource) => {
        try {
            // Track download count and activity
            await fetch(`${API_BASE_URL}/api/resources/${resource.id}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: user?.id
                })
            })

            // Trigger download - force download instead of opening in browser
            const fileUrl = resource.url.startsWith('http') ? resource.url : `${API_BASE_URL}${resource.url}`

            // Fetch the file as a blob to force download
            const response = await fetch(fileUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `${resource.title}.pdf` || 'download.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up the blob URL
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Error downloading resource', err)
            alert('Failed to download file. Please try again.')
        }
    }

    // Handle opening external link
    const handleOpenLink = async (resource) => {
        try {
            // Track as download/access
            await fetch(`${API_BASE_URL}/api/resources/${resource.id}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: user?.id
                })
            })

            // Open in new tab
            window.open(resource.url, '_blank', 'noopener,noreferrer')
        } catch (err) {
            console.error('Error opening resource', err)
        }
    }

    // Toggle content display
    const toggleContent = (resourceId) => {
        setExpandedResources(prev => {
            const newSet = new Set(prev)
            if (newSet.has(resourceId)) {
                newSet.delete(resourceId)
            } else {
                newSet.add(resourceId)
            }
            return newSet
        })
    }

    // Handle PDF download
    const handlePDFDownload = async (resource) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/resources/${resource.id}/pdf`)
            if (!response.ok) throw new Error('Failed to generate PDF')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Error downloading PDF', err)
            alert('Failed to download PDF. Please try again.')
        }
    }

    // Filter resources by search term and selected subject
    const filteredResources = resources.filter((r) => {
        const matchesSearch =
            (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.notes || '').toLowerCase().includes(searchTerm.toLowerCase())

        const matchesSubject = selectedSubject === 'All' || r.subject === selectedSubject

        return matchesSearch && matchesSubject
    })

    // Group resources by subject
    const groupedResources = filteredResources.reduce((acc, resource) => {
        const subject = resource.subject || 'Other'
        if (!acc[subject]) {
            acc[subject] = []
        }
        acc[subject].push(resource)
        return acc
    }, {})

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Learning Resources</h2>
                    <p className="text-gray-600 mt-1">Access study materials, notes, and reference documents.</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                    >
                        <Filter className="w-5 h-5 mr-2" />
                        {selectedSubject === 'All' ? 'Filter by Topic' : selectedSubject}
                    </button>
                    {showFilterDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-2">
                                {subjects.map((subject) => (
                                    <button
                                        key={subject}
                                        onClick={() => {
                                            setSelectedSubject(subject)
                                            setShowFilterDropdown(false)
                                        }}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${selectedSubject === subject ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                                            }`}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {filteredResources.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No resources found matching your criteria.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedResources).map(([subject, subjectResources]) => (
                        <div key={subject}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="w-1 h-6 bg-primary-600 mr-3 rounded"></span>
                                {subject}
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({subjectResources.length} {subjectResources.length === 1 ? 'resource' : 'resources'})
                                </span>
                            </h3>
                            <div className="grid gap-4">
                                {subjectResources.map((resource) => {
                                    const isExternal = isExternalLink(resource.url)

                                    return (
                                        <div key={resource.id} className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 text-lg mb-1">{resource.title}</h4>

                                                        {/* Topic badge */}
                                                        {resource.topic && (
                                                            <div className="mb-2">
                                                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                                    {resource.topic}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Description */}
                                                        {resource.description && (
                                                            <p className="text-sm text-gray-600 mb-3">
                                                                {resource.description}
                                                            </p>
                                                        )}

                                                        {/* Resource metadata */}
                                                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3 flex-wrap">
                                                            <span className="font-medium">{resource.type}</span>
                                                            {resource.size && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{resource.size}</span>
                                                                </>
                                                            )}
                                                            {resource.author && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>By {resource.author}</span>
                                                                </>
                                                            )}
                                                            {resource.uploadDate && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>Uploaded {resource.uploadDate}</span>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Resource description/notes */}
                                                        {resource.notes && (
                                                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                                    {resource.notes}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Educational Content Section */}
                                                        {(resource.explanation || resource.examples?.length > 0 || resource.bulletPoints?.length > 0 || resource.questions?.length > 0) && (
                                                            <div className="mt-3">
                                                                <button
                                                                    onClick={() => toggleContent(resource.id)}
                                                                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                                                                >
                                                                    {expandedResources.has(resource.id) ? '▼' : '▶'}
                                                                    {expandedResources.has(resource.id) ? 'Hide Educational Content' : 'View Educational Content'}
                                                                </button>

                                                                {expandedResources.has(resource.id) && (
                                                                    <div className="mt-3 space-y-4">
                                                                        {/* Explanation */}
                                                                        {resource.explanation && (
                                                                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                                                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                                                    <span>📖</span> Explanation
                                                                                </h5>
                                                                                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                                                    {resource.explanation}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Examples */}
                                                                        {resource.examples && resource.examples.length > 0 && (
                                                                            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                                                                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                                                    <span>💡</span> Examples
                                                                                </h5>
                                                                                <div className="space-y-2">
                                                                                    {resource.examples.map((example, idx) => (
                                                                                        <div key={idx} className="text-sm text-gray-700">
                                                                                            <span className="font-medium text-green-700">Example {idx + 1}:</span>
                                                                                            <p className="ml-4 mt-1 whitespace-pre-wrap">{example}</p>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Key Points */}
                                                                        {resource.bulletPoints && resource.bulletPoints.length > 0 && (
                                                                            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                                                                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                                                    <span>🔑</span> Key Points
                                                                                </h5>
                                                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                                                                    {resource.bulletPoints.map((point, idx) => (
                                                                                        <li key={idx}>{point}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}

                                                                        {/* Questions */}
                                                                        {resource.questions && resource.questions.length > 0 && (
                                                                            <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                                                                                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                                                    <span>❓</span> Questions & Answers
                                                                                </h5>
                                                                                <div className="space-y-4">
                                                                                    {/* Group by marks */}
                                                                                    {[2, 4, 8].map(marks => {
                                                                                        const questionsForMarks = resource.questions.filter(q => q.marks === marks)
                                                                                        if (questionsForMarks.length === 0) return null

                                                                                        return (
                                                                                            <div key={marks}>
                                                                                                <h6 className="font-semibold text-purple-700 mb-2">{marks} Marks Questions</h6>
                                                                                                <div className="space-y-3">
                                                                                                    {questionsForMarks.map((q, idx) => (
                                                                                                        <div key={idx} className="bg-white p-3 rounded border border-purple-200">
                                                                                                            <p className="text-sm font-medium text-gray-800 mb-2">
                                                                                                                <span className="text-red-600">Q{idx + 1}.</span> {q.question}
                                                                                                            </p>
                                                                                                            <p className="text-sm text-gray-700 ml-4">
                                                                                                                <span className="font-medium text-green-600">Answer:</span> {q.answer}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}



                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex-shrink-0 flex gap-2">
                                                    {/* Download button for uploaded files */}
                                                    {resource.url && !isExternal && (
                                                        <button
                                                            onClick={() => handleDownload(resource)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                            title="Download PDF"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            <span className="font-medium">Download</span>
                                                        </button>
                                                    )}

                                                    {/* Open button for external links */}
                                                    {resource.url && isExternal && (
                                                        <button
                                                            onClick={() => handleOpenLink(resource)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                                            title="Open in new tab"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            <span className="font-medium">Open</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ResourcesView
