import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function ProtectedRoute() {
  const { user } = useAuth()

  if (user === undefined) return null  // auth state still resolving
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
