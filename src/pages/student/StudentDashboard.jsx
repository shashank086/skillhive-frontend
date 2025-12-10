import { Routes, Route } from 'react-router-dom'
import Layout from '../../components/Layout'
import StudentOverview from './StudentOverview'
import SyllabusView from './SyllabusView'
import VideosView from './VideosView'
import ResourcesView from './ResourcesView'
import PlacementView from './PlacementView'
import CodingPlayground from './CodingPlayground'

const StudentDashboard = () => {
  return (
    <Layout role="student">
      <Routes>
        <Route index element={<StudentOverview />} />
        <Route path="syllabus" element={<SyllabusView />} />
        <Route path="videos" element={<VideosView />} />
        <Route path="resources" element={<ResourcesView />} />
        <Route path="placements" element={<PlacementView />} />
        <Route path="playground" element={<CodingPlayground />} />
      </Routes>
    </Layout>
  )
}

export default StudentDashboard
