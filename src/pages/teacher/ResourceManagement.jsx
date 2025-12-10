import { useEffect, useState } from 'react'
import { FileText, Download, Plus, Edit, Trash2, Eye, X, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const ResourceManagement = () => {
    const { user } = useAuth()
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        type: 'PDF',
        topic: '',
        description: '',
        url: '',
        author: '',
        notes: ''
    })

    useEffect(() => {
        fetchResources()
    }, [])

    const fetchResources = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/resources`)
            if (!response.ok) throw new Error('Failed to fetch resources')
            const data = await response.json()
            setResources(data)
        } catch (error) {
            console.error('Error fetching resources:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddResource = async () => {
        if (!formData.title || !formData.type || !formData.url) {
            alert('Please fill in Title, Type, and URL')
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/resources`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    teacherId: user?.id
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create resource')
            }

            await fetchResources()
            setFormData({
                title: '',
                subject: '',
                type: 'PDF',
                topic: '',
                description: '',
                url: '',
                author: '',
                notes: ''
            })
            setIsAdding(false)
            alert('Resource added successfully!')
        } catch (error) {
            console.error('Error adding resource:', error)
            alert(`Failed to add resource: ${error.message}`)
        }
    }

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
        } catch (error) {
            console.error('Error downloading PDF:', error)
            alert('Failed to download PDF. Please try again.')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this resource?')) return

        try {
            const response = await fetch(`${API_BASE_URL}/api/resources/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error('Failed to delete resource')

            setResources(resources.filter(r => r.id !== id))
            alert('Resource deleted successfully')
        } catch (error) {
            console.error('Error deleting resource:', error)
            alert('Failed to delete resource')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading resources...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Resource Management</h2>
                    <p className="text-gray-600 mt-1">Manage educational resources and study materials</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Resource
                    </button>
                )}
            </div>

            {/* Add Resource Form */}
            {isAdding && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Resource</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Resource title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="e.g., DBMS, OS"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="PDF">PDF</option>
                                <option value="Video">Video</option>
                                <option value="Document">Document</option>
                                <option value="Link">Link</option>
                                <option value="Tutorial">Tutorial</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                            <input
                                type="text"
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Topic name"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="https://drive.google.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Author name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Brief description"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Additional notes"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleAddResource}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            <Save className="w-4 h-4" />
                            Add Resource
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Content
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Upload Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {resources.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No resources found. Click "Add New Resource" to create one.
                                    </td>
                                </tr>
                            ) : (
                                resources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <FileText className="w-5 h-5 text-primary-600 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {resource.title}
                                                    </div>
                                                    {resource.topic && (
                                                        <div className="text-xs text-gray-500">
                                                            {resource.topic}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {resource.subject || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                {resource.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex flex-col gap-1">
                                                {resource.explanation && (
                                                    <span className="text-xs text-green-600">✓ Explanation</span>
                                                )}
                                                {resource.examples?.length > 0 && (
                                                    <span className="text-xs text-green-600">✓ {resource.examples.length} Examples</span>
                                                )}
                                                {resource.bulletPoints?.length > 0 && (
                                                    <span className="text-xs text-green-600">✓ {resource.bulletPoints.length} Key Points</span>
                                                )}
                                                {resource.questions?.length > 0 && (
                                                    <span className="text-xs text-green-600">✓ {resource.questions.length} Questions</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {resource.uploadDate}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* PDF Download Button */}
                                                {(resource.explanation || resource.examples?.length > 0 || resource.bulletPoints?.length > 0 || resource.questions?.length > 0) && (
                                                    <button
                                                        onClick={() => handlePDFDownload(resource)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Download PDF"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {/* View Button */}
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                {/* Edit Button */}
                                                <button
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit Resource"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Resource"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">Total Resources</div>
                    <div className="text-2xl font-bold text-gray-900">{resources.length}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">With Educational Content</div>
                    <div className="text-2xl font-bold text-green-600">
                        {resources.filter(r => r.explanation || r.examples?.length || r.bulletPoints?.length || r.questions?.length).length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">Total Questions</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {resources.reduce((sum, r) => sum + (r.questions?.length || 0), 0)}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">Total Examples</div>
                    <div className="text-2xl font-bold text-purple-600">
                        {resources.reduce((sum, r) => sum + (r.examples?.length || 0), 0)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResourceManagement
