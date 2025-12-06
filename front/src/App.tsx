import { Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services/auth'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminInventory from './pages/admin/AdminInventory'
import AdminFileUpload from './pages/admin/AdminFileUpload'
import AdminLogs from './pages/admin/AdminLogs'

import UserHome from './pages/user/UserHome'
import UserAuth from './pages/user/UserAuth'
import UserBlog from './pages/user/UserBlog'
import UserBlogPost from './pages/user/UserBlogPost'
import UserInventory from './pages/user/UserInventory'
import UserCheckout from './pages/user/UserCheckout'

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const isAuthenticated = authService.isAuthenticated()
  const isAdmin = authService.isAdmin()

  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/auth'} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/auth" element={<UserAuth />} />
      <Route path="/blog" element={<UserBlog />} />
      <Route path="/blog/:id" element={<UserBlogPost />} />
      <Route path="/inventory" element={<UserInventory />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <UserCheckout />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/inventory"
        element={
          <ProtectedRoute requireAdmin>
            <AdminInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/files"
        element={
          <ProtectedRoute requireAdmin>
            <AdminFileUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLogs />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
