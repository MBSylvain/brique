import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
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
      if (userType === 'staff') {
        const staffData = JSON.parse(localStorage.getItem('staff_data'))
        if (allowedType === 'admin' && staffData.role !== 'admin') return <Navigate to="/" replace />
        if (allowedType === 'teacher' && staffData.role !== 'teacher') return <Navigate to="/" replace />
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
