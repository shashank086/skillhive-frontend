import { Routes, Route } from 'react-router-dom'
import Layout from '../../components/Layout'
import AdminOverview from './AdminOverview'
import StudentsList from './StudentsList'
import TeachersList from './TeachersList'
import PlacementsList from './PlacementsList'

const AdminDashboard = () => {
  return (
    <Layout role="admin">
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="teachers" element={<TeachersList />} />
        <Route path="placements" element={<PlacementsList />} />
      </Routes>
    </Layout>
  )
}

export default AdminDashboard
