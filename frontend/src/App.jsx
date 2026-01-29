import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile } from './features/auth/authSlice'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Pages - Public
import Home from './pages/Home'
import PackageList from './pages/PackageList'
import PackageDetails from './pages/PackageDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

// Pages - Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Pages - Booking Flow
import BookingForm from './pages/booking/BookingForm'
import BookingSuccess from './pages/booking/BookingSuccess'
import BookingConfirmation from './pages/booking/BookingConfirmation'

// Pages - Dashboard
import Dashboard from './pages/dashboard/Dashboard'
import MyBookings from './pages/dashboard/MyBookings'
import BookingDetails from './pages/dashboard/BookingDetails'
import Profile from './pages/dashboard/Profile'
import PaymentHistory from './pages/dashboard/PaymentHistory'

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import ManagePackages from './pages/admin/ManagePackages'
import ManageBookings from './pages/admin/ManageBookings'
import ManageUsers from './pages/admin/ManageUsers'
import PackageForm from './pages/admin/PackageForm'
import Reports from './pages/admin/Reports'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import PageNotFound from './pages/PageNotFound'
import Unauthorized from './pages/Unauthorized'

function App() {
  const dispatch = useDispatch()
  const { token, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, token])

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/tours" element={<MainLayout><PackageList /></MainLayout>} />
        <Route path="/tours/:packageId" element={<MainLayout><PackageDetails /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><Privacy /></MainLayout>} />
        
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>
        
        {/* Booking Flow */}
        <Route path="/tours/:packageId/book" element={
          <ProtectedRoute>
            <MainLayout><BookingForm /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/booking/:bookingId/success" element={
          <ProtectedRoute>
            <MainLayout><BookingSuccess /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/booking/:bookingId/confirm" element={
          <ProtectedRoute>
            <MainLayout><BookingConfirmation /></MainLayout>
          </ProtectedRoute>
        } />
        
        {/* User Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout><Dashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/bookings" element={
          <ProtectedRoute>
            <DashboardLayout><MyBookings /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/bookings/:bookingId" element={
          <ProtectedRoute>
            <DashboardLayout><BookingDetails /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute>
            <DashboardLayout><Profile /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/payments" element={
          <ProtectedRoute>
            <DashboardLayout><PaymentHistory /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </AdminRoute>
        } />
        <Route path="/admin/packages" element={
          <AdminRoute>
            <DashboardLayout><ManagePackages /></DashboardLayout>
          </AdminRoute>
        } />
        <Route path="/admin/packages/new" element={
          <AdminRoute>
            <DashboardLayout><PackageForm /></DashboardLayout>
          </AdminRoute>
        } />
        <Route path="/admin/packages/:packageId/edit" element={
          <AdminRoute>
            <DashboardLayout><PackageForm /></DashboardLayout>
          </AdminRoute>
        } />
        <Route path="/admin/bookings" element={
          <AdminRoute>
            <DashboardLayout><ManageBookings /></DashboardLayout>
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <DashboardLayout><ManageUsers /></DashboardLayout>
          </AdminRoute>
        } />
        <Route path="/admin/reports" element={
          <AdminRoute>
            <DashboardLayout><Reports /></DashboardLayout>
          </AdminRoute>
        } />
        
        {/* Error Pages */}
        <Route path="/unauthorized" element={<MainLayout><Unauthorized /></MainLayout>} />
        <Route path="/404" element={<MainLayout><PageNotFound /></MainLayout>} />
        
        {/* Redirects */}
        <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  )
}

export default App