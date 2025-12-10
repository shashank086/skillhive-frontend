import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    Home,
    Users,
    BookOpen,
    Video,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Briefcase,
    Code
} from 'lucide-react'
import { useState } from 'react'
// Using public folder for logo to ensure it loads
const logo = '/skill-hive-icon.svg'

const Layout = ({ role, children }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const getNavItems = () => {
        switch (role) {
            case 'admin':
                return [
                    { path: '/admin', label: 'Dashboard', icon: Home },
                    { path: '/admin/students', label: 'Students', icon: Users },
                    { path: '/admin/teachers', label: 'Teachers', icon: Users },
                    { path: '/admin/placements', label: 'Placements', icon: Briefcase },
                ]
            case 'teacher':
                return [
                    { path: '/teacher', label: 'Dashboard', icon: Home },
                    { path: '/teacher/syllabus', label: 'Syllabus', icon: BookOpen },
                    { path: '/teacher/content', label: 'Study Content', icon: FileText },
                    { path: '/teacher/videos', label: 'Videos', icon: Video },
                    { path: '/teacher/placements', label: 'Placements', icon: Briefcase },
                ]
            case 'student':
                return [
                    { path: '/student', label: 'Dashboard', icon: Home },
                    { path: '/student/syllabus', label: 'Syllabus', icon: BookOpen },
                    { path: '/student/resources', label: 'Resources', icon: FileText },
                    { path: '/student/videos', label: 'Videos', icon: Video },
                    { path: '/student/placements', label: 'Placements', icon: Briefcase },
                    { path: '/student/playground', label: 'Playground', icon: Code },
                ]
            default:
                return []
        }
    }

    const navItems = getNavItems()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-md mr-2">
                                <img src={logo} alt="SkillHive Logo" className="w-full h-full object-cover" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800">Skill Hive</h1>
                            <span className="ml-4 px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 capitalize">
                                {role}
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block">
                                <span className="text-sm text-gray-600">Welcome, </span>
                                <span className="text-sm font-medium text-gray-800">{user?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden md:inline">Logout</span>
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden text-gray-600 hover:text-gray-800"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`bg-white shadow-sm w-64 min-h-[calc(100vh-4rem)] fixed md:static inset-y-0 top-16 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    } transition-transform duration-300 ease-in-out z-40`}>
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname === item.path ||
                                    (item.path !== `/${role}` && location.pathname.startsWith(item.path))

                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </aside>

                {/* Overlay for mobile */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-6 md:ml-0">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    )
}

export default Layout
