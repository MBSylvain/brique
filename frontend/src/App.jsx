import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'

function App() {
  const ProtectedRoute = ({ children, allowedType }) => {
    const userType = localStorage.getItem('user_type')

    if (!userType) {
      return <Navigate to="/" replace />
    }

    if (allowedType && userType !== allowedType) {
      // Logic for staff role sub-types
      if (userType === 'staff' || userType === 'teacher') {
        const staffData = JSON.parse(localStorage.getItem('staff_data'))
        // Pour les professeurs
        if (allowedType === 'teacher') return children
        // Pour les admins
        if (allowedType === 'admin' && staffData.role !== 'admin') return <Navigate to="/" replace />
      } else if (allowedType !== 'eleve') {
        return <Navigate to="/" replace />
      }
    }

    return children
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedType="eleve">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedType="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
