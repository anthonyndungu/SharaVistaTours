// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux'; // ✅ Import hooks
// import { useEffect } from 'react';
// import { CircularProgress } from '@mui/material';
// import { fetchAllUsers, initializeAuth } from './features/auth/authSlice';

// // Public routes
// import MainLayout from './layouts/MainLayout';
// import Home from './pages/Home';
// import Tours from './pages/Tours';
// import Destinations from './pages/Destinations';
// import Gallery from './pages/Gallery';
// import TravelTips from './pages/TravelTips';
// import Contact from './pages/Contact';
// import SingleTour from './pages/SingleTour';
// import BookingSuccess from './pages/booking/BookingSuccess';
// import BookingConfirmation from './pages/booking/BookingConfirmation';

// // Client dashboard
// import DashboardLayout from './layouts/DashboardLayout';
// import MyBookings from './pages/dashboard/MyBookings';
// import Profile from './pages/dashboard/Profile';
// import Payments from './pages/dashboard/PaymentHistory';
// import Dashboard from './pages/dashboard/Dashboard';
// import BookingDetails from './pages/dashboard/BookingDetails';

// // Admin routes
// import AdminLayout from './layouts/AdminLayout';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminPackages from './pages/admin/ManagePackages';
// import AdminBookings from './pages/admin/ManageBookings';
// import AdminClients from './pages/admin/ManageUsers';
// import AdminReviews from './pages/admin/AdminReviews';
// import AdminSettings from './pages/admin/AdminSettings';
// import CreatePackage from './pages/admin/CreatePackage';
// import EditPackage from './pages/admin/EditPackage';
// import UserProfile from './pages/admin/UserProfile';
// import AdminProfile from './pages/admin/AdminProfile';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import { fetchPackages } from './features/packages/packageSlice';
// import ForgotPassword from './pages/auth/ForgotPassword';
// import About from './pages/About';
// import Terms from './pages/Terms';
// import Privacy from './pages/Privacy';
// import AdminBookingDetails from './pages/admin/AdminBookingDetails';

// function App() {
//   // ✅ 1. ALL HOOKS MUST BE AT THE TOP
//   const dispatch = useDispatch();
//   const location = useLocation();

//   // Select all needed state variables here
//   const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(initializeAuth());
//     dispatch(fetchPackages());
//     //dispatch(fetchAllUsers());
//   }, [dispatch]);


//   // ✅ 2. NOW USE THE VARIABLES IN CONDITIONS
//   // Check if we are still loading AND don't have a user yet
//   if (loading && !user) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </div>
//     );
//   }

//   // Determine default redirect based on role
//   let defaultRedirect = '/login';

//   if (isAuthenticated) {
//     if (user?.role === 'admin' || user?.role === 'super_admin') {
//       defaultRedirect = '/admin';
//     } else {
//       defaultRedirect = '/dashboard';
//     }
//   }

//   return (
//     <Routes>
//       {/* 🌐 PUBLIC SITE */}
//       <Route path="/" element={<MainLayout />}>
//         <Route index element={<Home />} />
//         <Route path="/auth/login" element={<Login />} />
//         <Route path="/auth/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="tours" element={<Tours />} />
//         <Route path="terms" element={<Terms />} />
//         <Route path="privacy" element={<Privacy />} />
//         <Route path="destinations" element={<Destinations />} />
//         <Route path="gallery" element={<Gallery />} />
//         <Route path="travel-tips" element={<TravelTips />} />
//         <Route path="about" element={<About />} />
//         <Route path="contact" element={<Contact />} />
//         <Route path="tours/:tourId" element={<SingleTour />} />
//         <Route path="bookings/success/:bookingId" element={<BookingSuccess />} />
//         <Route path="bookings/confirmation/:bookingId" element={<BookingConfirmation />} />
//       </Route>

//       {/* 👤 CLIENT DASHBOARD (Protected) */}
//       <Route
//         path="/dashboard"
//         element={isAuthenticated && user?.role === 'client' ? <DashboardLayout /> : <Navigate to="/login" />}
//       >
//         <Route index element={<Dashboard />} />
//         <Route path="bookings" element={<MyBookings />} />
//         <Route path="bookings/:bookingId" element={<BookingDetails />} /> {/* ✅ Added Dynamic Route */}
//         <Route path="profile" element={<Profile />} />
//         <Route path="payments" element={<Payments />} />
//       </Route>

//       {/* 👨‍💼 ADMIN PANEL (Protected) */}
//       <Route
//         path="/admin"
//         element={isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin') ? <AdminLayout /> : <Navigate to="/login" />}
//       >
//         <Route index element={<AdminDashboard />} />
//         <Route path="packages" element={<AdminPackages />} />
//         <Route path="packages/new" element={<CreatePackage />} />
//         <Route path="packages/edit/:id" element={<EditPackage />} /> {/* ✅ Fixed Path */}
//         <Route path="bookings" element={<AdminBookings />} />
//         <Route path="bookings/:bookingId" element={<AdminBookingDetails />} /> {/* ✅ Reuse AdminBookingDetails for admin view */}
//         <Route path="clients" element={<AdminClients />} />
//         <Route path="users/:id" element={<UserProfile />} />
//         <Route path="reviews" element={<AdminReviews />} />
//         <Route path="settings" element={<AdminSettings />} />
//         <Route path="profile" element={<AdminProfile />} /> {/* ✅ Fixed Path */}
//       </Route>

//       {/* 404 */}
//       <Route path="*" element={<Navigate to={defaultRedirect} />} />
//     </Routes>
//   );
// }

// export default App;



import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// Actions
import { initializeAuth } from './features/auth/authSlice';
import { fetchPackages } from './features/packages/packageSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Tours from './pages/Tours';
import Destinations from './pages/Destinations';
import Gallery from './pages/Gallery';
import TravelTips from './pages/TravelTips';
import Contact from './pages/Contact';
import SingleTour from './pages/SingleTour';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import BookingSuccess from './pages/booking/BookingSuccess';
import BookingConfirmation from './pages/booking/BookingConfirmation';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Client Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyBookings from './pages/dashboard/MyBookings';
import BookingDetails from './pages/dashboard/BookingDetails';
import Profile from './pages/dashboard/Profile';
import Payments from './pages/dashboard/PaymentHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPackages from './pages/admin/ManagePackages';
import CreatePackage from './pages/admin/CreatePackage';
import EditPackage from './pages/admin/EditPackage';
import AdminBookings from './pages/admin/ManageBookings';
import AdminBookingDetails from './pages/admin/AdminBookingDetails';
import AdminClients from './pages/admin/ManageUsers';
import UserProfile from './pages/admin/UserProfile';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';
import VerifyOTP from './pages/auth/VerifyOTP';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  const dispatch = useDispatch();

  // Initialize Auth & Fetch Data once on load
  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(fetchPackages());
  }, [dispatch]);

  return (
    <>
    <Routes>
      {/* 🌐 PUBLIC SITE (MainLayout) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tours" element={<Tours />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="travel-tips" element={<TravelTips />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="tours/:tourId" element={<SingleTour />} />
        <Route path="bookings/success/:bookingId" element={<BookingSuccess />} />
        <Route path="bookings/confirmation/:bookingId" element={<BookingConfirmation />} />

        {/* Auth Routes */}
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />
        <Route path="auth/verify-otp" element={<VerifyOTP />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="auth/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* 👤 CLIENT DASHBOARD (No Protection Logic Here) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="bookings/:bookingId" element={<BookingDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="payments" element={<Payments />} />
      </Route>

      {/* 👨‍💼 ADMIN PANEL (No Protection Logic Here) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="packages/new" element={<CreatePackage />} />
        <Route path="packages/edit/:id" element={<EditPackage />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="bookings/:bookingId" element={<AdminBookingDetails />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="users/:id" element={<UserProfile />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* 404 Fallback - Redirects to Home */}
      <Route path="*" element={<Home />} />
    </Routes>

     <ToastContainer 
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
    </>
    
  );
}

export default App;