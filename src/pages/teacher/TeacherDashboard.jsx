import { Routes, Route } from 'react-router-dom'
import Layout from '../../components/Layout'
import TeacherOverview from './TeacherOverview'
import SyllabusManagement from './SyllabusManagement'
import StudyContent from './StudyContent'
import VideoManagement from './VideoManagement'
import PlacementManagement from './PlacementManagement'

const TeacherDashboard = () => {
  return (
    <Layout role="teacher">
      <Routes>
        <Route index element={<TeacherOverview />} />
        <Route path="syllabus" element={<SyllabusManagement />} />
        <Route path="content" element={<StudyContent />} />
        <Route path="videos" element={<VideoManagement />} />
        <Route path="placements" element={<PlacementManagement />} />
      </Routes>
    </Layout>
  )
}

export default TeacherDashboard
