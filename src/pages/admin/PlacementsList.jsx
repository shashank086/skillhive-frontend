import { useState, useEffect } from 'react'
import { Briefcase, Calendar, MapPin, Clock, Building, Users, CheckCircle } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const PlacementsList = () => {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading placement drives...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600">{error}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Placement Drives Management</h2>
                    <p className="text-gray-600 mt-1">View and manage all placement drives and student registrations</p>
                </div>
            </div>

            {placements.length === 0 ? (
                <div className="card text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No placement drives found.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {placements.map((drive) => {
                        const registeredCount = drive.registeredStudents?.length || 0

                        return (
                            <div
                                key={drive.id}
                                className={`card hover:shadow-lg transition-all ${drive.status === 'Completed'
                                        ? 'border-gray-200 opacity-75'
                                        : 'border-primary-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${drive.status === 'Completed'
                                                ? 'bg-gray-100 text-gray-500'
                                                : 'bg-primary-50 text-primary-600'
                                            }`}>
                                            <Building className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{drive.company}</h3>
                                            <p className="text-gray-600 font-medium text-lg">{drive.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${drive.status === 'Upcoming'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {drive.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-700">
                                            <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                                            <span className="font-semibold mr-2">Package:</span> {drive.package}
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                                            <span className="font-semibold mr-2">Date:</span> {drive.date}
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <Clock className="w-5 h-5 mr-3 text-gray-400" />
                                            <span className="font-semibold mr-2">Time:</span> {drive.time}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-700">
                                            <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                                            <span className="font-semibold mr-2">Location:</span> {drive.location}
                                        </div>
                                        <div className="flex items-start text-gray-700">
                                            <CheckCircle className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                                            <div>
                                                <span className="font-semibold">Eligibility:</span>
                                                <p className="text-sm mt-0.5">{drive.eligibility}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">Description</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{drive.description}</p>

                                    {drive.procedure && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-bold text-gray-700 mb-2">Selection Procedure</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{drive.procedure}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Admin-only: Student Registration Count */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-primary-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Students Registered</p>
                                                <p className="text-2xl font-bold text-primary-700">{registeredCount}</p>
                                            </div>
                                        </div>
                                        {registeredCount > 0 && (
                                            <div className="text-sm text-gray-500">
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    Active registrations
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default PlacementsList
