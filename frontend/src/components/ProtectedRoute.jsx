import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import { fetchUserProfile } from '../features/auth/authSlice'
import Spinner from './Spinner'

export default function ProtectedRoute({ children, allowedRoles = ['client', 'admin', 'super_admin'] }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, isAuthenticated])

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}