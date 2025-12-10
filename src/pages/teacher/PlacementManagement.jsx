import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, Upload, FileText, Image as ImageIcon, Calendar, Clock, MapPin, Briefcase, DollarSign } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const PlacementManagement = () => {
    const [showForm, setShowForm] = useState(false)
    const [placements, setPlacements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        company: '',
        role: '',
        package: '',
        date: '',
        time: '',
        location: '',
        description: '',
        procedure: '',
        eligibility: '',
        attachments: []
    })

    useEffect(() => {
        fetchPlacements()
    }, [])

    const fetchPlacements = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_BASE_URL}/api/placements`)
            if (!response.ok) {
                const errorText = await response.text()
                try {
                    const errorJson = JSON.parse(errorText)
                    throw new Error(errorJson.message || 'Failed to fetch placements')
                } catch (e) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`)
                }
            }
            const data = await response.json()
            setPlacements(data)
        } catch (err) {
            console.error('Error fetching placements:', err)
            setError(err.message || 'Failed to load placements')
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            const filePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        resolve({
                            name: file.name,
                            type: file.type,
                            url: reader.result, // Base64 Data URI
                            size: (file.size / 1024).toFixed(2) + ' KB'
                        })
                    }
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })
            })

            try {
                const newAttachments = await Promise.all(filePromises)
                setFormData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, ...newAttachments]
                }))
            } catch (err) {
                console.error('Error reading files:', err)
                alert('Failed to process some files')
            }
        }
    }

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${API_BASE_URL}/api/placements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    status: 'Upcoming'
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create placement')
            }

            await fetchPlacements()
            setShowForm(false)
            setFormData({
                company: '',
                role: '',
                package: '',
                date: '',
                time: '',
                location: '',
                description: '',
                procedure: '',
                eligibility: '',
                attachments: []
            })
            alert('Placement drive created successfully!')
        } catch (err) {
            console.error('Error creating placement:', err)
            alert('Failed to create placement drive')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this placement drive?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/placements/${id}`, {
                    method: 'DELETE',
                })

                if (!response.ok) {
                    throw new Error('Failed to delete placement')
                }

                await fetchPlacements()
                alert('Placement drive deleted successfully!')
            } catch (err) {
                console.error('Error deleting placement:', err)
                alert('Failed to delete placement drive')
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading placements...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Placement Management</h2>
                    <p className="text-gray-600">Manage upcoming placement drives and interview schedules.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Drive
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 relative">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                                <h3 className="text-xl font-bold text-gray-800">Add New Placement Drive</h3>
                                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Package (LPA)</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                            value={formData.package}
                                            onChange={e => setFormData({ ...formData, package: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                            value={formData.eligibility}
                                            onChange={e => setFormData({ ...formData, eligibility: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                            value={formData.time}
                                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location / Venue</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Selection Procedure</label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder="Step 1: Online Assessment...&#10;Step 2: Technical Interview..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                        value={formData.procedure}
                                        onChange={e => setFormData({ ...formData, procedure: e.target.value })}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (PDF/Images)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600">Click to upload files</span>
                                            <span className="text-xs text-gray-400 mt-1">PDF, PNG, JPG up to 10MB</span>
                                        </label>
                                    </div>

                                    {formData.attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {formData.attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        {file.type.startsWith('image/') ? (
                                                            <ImageIcon className="w-5 h-5 text-purple-500" />
                                                        ) : (
                                                            <FileText className="w-5 h-5 text-blue-500" />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                                                            <p className="text-xs text-gray-500">{file.size}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                                    >
                                        Create Drive
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6">
                {placements.map((drive) => (
                    <div key={drive.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{drive.company}</h3>
                                <p className="text-primary-600 font-medium">{drive.role}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDelete(drive.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                <span>{drive.package}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{drive.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{drive.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{drive.time}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</h4>
                                <p className="text-sm text-gray-600">{drive.description}</p>
                            </div>
                            {drive.procedure && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Selection Procedure</h4>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{drive.procedure}</p>
                                </div>
                            )}
                            {drive.attachments && drive.attachments.length > 0 && (
                                <div className="pt-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Attachments</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {drive.attachments.map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={file.url}
                                                download={file.name}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
                                            >
                                                {file.type.startsWith('image/') ? (
                                                    <ImageIcon className="w-4 h-4 text-purple-500" />
                                                ) : (
                                                    <FileText className="w-4 h-4 text-blue-500" />
                                                )}
                                                {file.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {placements.length === 0 && !loading && (
                <div className="card text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No placement drives yet. Create your first one!</p>
                    <button onClick={() => setShowForm(true)} className="btn-primary">
                        Add New Drive
                    </button>
                </div>
            )}
        </div>
    )
}

export default PlacementManagement
