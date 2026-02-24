import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // ✅ Import hooks
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { initializeAuth } from './features/auth/authSlice';

// Public routes
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Tours from './pages/Tours';
import Destinations from './pages/Destinations';
import Gallery from './pages/Gallery';
import TravelTips from './pages/TravelTips';
import Contact from './pages/Contact';
import SingleTour from './pages/SingleTour';

// Client dashboard
import DashboardLayout from './layouts/DashboardLayout';
import MyBookings from './pages/dashboard/MyBookings';
import Profile from './pages/dashboard/Profile';
import Payments from './pages/dashboard/PaymentHistory';
import Dashboard from './pages/dashboard/Dashboard';
import BookingDetails from './pages/dashboard/BookingDetails'; // ✅ Added missing import

// Admin routes
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPackages from './pages/admin/ManagePackages';
import AdminBookings from './pages/admin/ManageBookings';
import AdminClients from './pages/admin/ManageUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';
import CreatePackage from './pages/admin/CreatePackage';
import EditPackage from './pages/admin/EditPackage';
import UserProfile from './pages/admin/UserProfile';
import AdminProfile from './pages/admin/AdminProfile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { fetchPackages } from './features/packages/packageSlice';
import ForgotPassword from './pages/auth/ForgotPassword';
import About from './pages/About';

function App() {
  // ✅ 1. ALL HOOKS MUST BE AT THE TOP
  const dispatch = useDispatch();

  // Select all needed state variables here
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(fetchPackages())
  }, [dispatch]);


  // ✅ 2. NOW USE THE VARIABLES IN CONDITIONS
  // Check if we are still loading AND don't have a user yet
  if (loading && !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  // Determine default redirect based on role
  let defaultRedirect = '/login';

  if (isAuthenticated) {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      defaultRedirect = '/admin';
    } else {
      defaultRedirect = '/dashboard';
    }
  }

  return (
    <Router>
      <Routes>
        {/* 🌐 PUBLIC SITE */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="tours" element={<Tours />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="travel-tips" element={<TravelTips />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="tours/:tourId" element={<SingleTour />} />
        </Route>

        {/* 👤 CLIENT DASHBOARD (Protected) */}
        <Route
          path="/dashboard"
          element={isAuthenticated && user?.role === 'client' ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="bookings/:bookingId" element={<BookingDetails />} /> {/* ✅ Added Dynamic Route */}
          <Route path="profile" element={<Profile />} />
          <Route path="payments" element={<Payments />} />
        </Route>

        {/* 👨‍💼 ADMIN PANEL (Protected) */}
        <Route
          path="/admin"
          element={isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin') ? <AdminLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="packages/new" element={<CreatePackage />} />
          <Route path="packages/edit/:id" element={<EditPackage />} /> {/* ✅ Fixed Path */}
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} /> {/* ✅ Fixed Path */}
        </Route>

        {/* Auth Routes (Optional: Redirect if already logged in) */}
        <Route path="/login" element={isAuthenticated ? <Navigate to={defaultRedirect} /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to={defaultRedirect} /> : <Register />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to={defaultRedirect} />} />
      </Routes>
    </Router>
  );
}

export default App;