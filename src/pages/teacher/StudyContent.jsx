import { useState, useEffect } from 'react'
import { Plus, FileText, Edit, Trash2, Save, X, Upload } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const StudyContent = () => {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadMethod, setUploadMethod] = useState('file') // 'file' or 'url'
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'PDF',
    subject: '',
    author: '',
    notes: '',
    url: '',
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/resources`)
      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }
      const data = await response.json()
      setContent(data)
    } catch (err) {
      console.error('Error fetching resources:', err)
      setError('Failed to load study content')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      setError('')
    } else {
      setSelectedFile(null)
      setError('Please select a valid PDF file')
    }
  }

  const handleFileUpload = async () => {
    if (!formData.title || !selectedFile) {
      alert('Please provide a title and select a PDF file')
      return
    }

    try {
      setUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('subject', formData.subject)
      uploadFormData.append('author', formData.author)
      uploadFormData.append('notes', formData.notes)
      uploadFormData.append('type', formData.type)

      const response = await fetch(`${API_BASE_URL}/api/resources/upload`, {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      await fetchContent()
      setFormData({ title: '', type: 'PDF', subject: '', author: '', notes: '', url: '' })
      setSelectedFile(null)
      setIsAdding(false)
      alert('PDF uploaded successfully!')
    } catch (err) {
      console.error('Error uploading file:', err)
      alert('Failed to upload PDF')
    } finally {
      setUploading(false)
    }
  }

  const handleAdd = async () => {
    if (uploadMethod === 'file') {
      await handleFileUpload()
    } else {
      // URL method
      if (formData.title && formData.type && formData.url) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/resources`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })

          if (!response.ok) {
            throw new Error('Failed to create resource')
          }

          await fetchContent()
          setFormData({ title: '', type: 'PDF', subject: '', author: '', notes: '', url: '' })
          setIsAdding(false)
          alert('Study content added successfully!')
        } catch (err) {
          console.error('Error adding resource:', err)
          alert('Failed to add study content')
        }
      }
    }
  }

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      type: item.type,
      subject: item.subject || '',
      author: item.author || '',
      notes: item.notes || '',
      url: item.url || '',
    })
    setEditingId(item.id)
    setIsAdding(false)
  }

  const handleSave = async () => {
    if (editingId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resources/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to update resource')
        }

        await fetchContent()
        setEditingId(null)
        setFormData({ title: '', type: 'PDF', subject: '', author: '', notes: '', url: '' })
        alert('Study content updated successfully!')
      } catch (err) {
        console.error('Error updating resource:', err)
        alert('Failed to update study content')
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resources/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete resource')
        }

        await fetchContent()
        alert('Study content deleted successfully!')
      } catch (err) {
        console.error('Error deleting resource:', err)
        alert('Failed to delete study content')
      }
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setSelectedFile(null)
    setUploadMethod('file')
    setFormData({ title: '', type: 'PDF', subject: '', author: '', notes: '', url: '' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading study content...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Study Content Management</h1>
          <p className="text-gray-600">Upload and manage study materials for your students</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Content</span>
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
        <div className="card bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Content' : 'Add New Content'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter content title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="PDF">PDF</option>
                  <option value="Document">Document</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Image">Image</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="e.g., Mathematics"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author (Optional)
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter author name"
              />
            </div>

            {/* Upload Method Toggle - Only show when adding new content */}
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Method
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${uploadMethod === 'file'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    <Upload className="w-5 h-5 inline mr-2" />
                    Upload PDF File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${uploadMethod === 'url'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    <FileText className="w-5 h-5 inline mr-2" />
                    Provide URL
                  </button>
                </div>
              </div>
            )}

            {/* File Upload Section */}
            {uploadMethod === 'file' && !editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select PDF File
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
                      <div className="flex items-center justify-center space-x-2">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {selectedFile ? selectedFile.name : 'Click to select PDF file'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedFile && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ File selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
              </div>
            )}

            {/* URL Input Section */}
            {(uploadMethod === 'url' || editingId) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://drive.google.com/file/..."
                />
                <p className="text-xs text-gray-500 mt-1">Google Drive, Dropbox, or direct file link</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes / Description
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter description or notes"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={editingId ? handleSave : handleAdd}
                className="btn-primary flex items-center space-x-2"
                disabled={uploading}
              >
                <Save className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : (editingId ? 'Save Changes' : 'Add Content')}</span>
              </button>
              <button onClick={handleCancel} className="btn-secondary flex items-center space-x-2" disabled={uploading}>
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <div key={item.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-3">
                  <span className="text-xs font-medium text-gray-500">{item.type}</span>
                </div>
              </div>
              {!isAdding && !editingId && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
            {item.subject && <p className="text-xs text-primary-600 font-medium mb-2">{item.subject}</p>}
            {item.notes && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.notes}</p>}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500">Uploaded: {item.uploadDate}</span>
              {item.url && (
                <a
                  href={item.url.startsWith('http') ? item.url : `${API_BASE_URL}${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  View→
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {content.length === 0 && !loading && (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No study content yet. Upload your first material!</p>
          <button onClick={() => setIsAdding(true)} className="btn-primary">
            Add Content
          </button>
        </div>
      )}
    </div>
  )
}

export default StudyContent
