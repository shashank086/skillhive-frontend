import { useState, useEffect } from 'react'
import { Briefcase, Calendar, MapPin, Clock, ExternalLink, Building, FileText, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const PlacementView = () => {
    const { user } = useAuth()
    const [placements, setPlacements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchPlacements()
    }, [])

    const fetchPlacements = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/placements`)
            if (!response.ok) {
                throw new Error('Failed to fetch placements')
            }
            const data = await response.json()
            setPlacements(data)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching placements:', err)
            setError('Failed to load placement drives. Please try again later.')
            setLoading(false)
        }
    }

    const handleRegister = async (placementId) => {
        const userId = user?._id || user?.id

        if (!user || !userId) {
            alert('You must be logged in to register.')
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/placements/${placementId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to register')
            }

            const result = await response.json()
            alert(result.message)

            // Refresh placements to update UI
            fetchPlacements()
        } catch (err) {
            console.error('Error registering for placement:', err)
            alert(err.message || 'Failed to register for placement')
        }
    }

    if (loading) {
        return <div className="text-center py-10">Loading placement drives...</div>
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Placement Drives</h2>
                    <p className="text-gray-600 mt-1">Stay updated with upcoming campus interviews and opportunities.</p>
                </div>
            </div>

            {placements.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No placement drives found.</div>
            ) : (
                <div className="grid gap-6">
                    {placements.map((drive) => {
                        const currentUserId = user?._id || user?.id;
                        const isRegistered = drive.registeredStudents && currentUserId && drive.registeredStudents.includes(currentUserId);

                        return (
                            <div key={drive.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${drive.status === 'Completed' ? 'border-gray-200 opacity-75' : 'border-primary-100'}`}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${drive.status === 'Completed' ? 'bg-gray-100 text-gray-500' : 'bg-primary-50 text-primary-600'}`}>
                                                <Building className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{drive.company}</h3>
                                                <p className="text-gray-600 font-medium">{drive.role}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${drive.status === 'Upcoming'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {drive.status}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center text-gray-600">
                                                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="font-medium mr-2">Package:</span> {drive.package}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="font-medium mr-2">Date:</span> {drive.date}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="font-medium mr-2">Time:</span> {drive.time}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="font-medium mr-2">Location:</span> {drive.location}
                                            </div>
                                            <div className="flex items-start text-gray-600">
                                                <div className="mt-1 mr-2"><ExternalLink className="w-4 h-4 text-gray-400" /></div>
                                                <div>
                                                    <span className="font-medium">Eligibility:</span>
                                                    <p className="text-sm mt-0.5">{drive.eligibility}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-700 mb-2">Description</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{drive.description}</p>
                                        </div>

                                        {drive.procedure && (
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-700 mb-2">Selection Procedure</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{drive.procedure}</p>
                                            </div>
                                        )}

                                        {drive.attachments && drive.attachments.length > 0 && (
                                            <div className="pt-4 border-t border-gray-200">
                                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Attachments</h5>
                                                <div className="flex flex-wrap gap-3">
                                                    {drive.attachments.map((file, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={file.url}
                                                            download={file.name}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-200 transition-all text-sm text-gray-700 shadow-sm"
                                                        >
                                                            {file.type.startsWith('image/') ? (
                                                                <ImageIcon className="w-4 h-4 text-purple-500" />
                                                            ) : (
                                                                <FileText className="w-4 h-4 text-blue-500" />
                                                            )}
                                                            <span className="font-medium">{file.name}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {drive.status === 'Upcoming' && (
                                        <div className="flex justify-end items-center pt-4 border-t border-gray-100 mt-4">
                                            {isRegistered ? (
                                                <button
                                                    disabled
                                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm opacity-80 cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <span>✓</span> Registered
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRegister(drive.id)}
                                                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                                                >
                                                    Register Now
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default PlacementView
