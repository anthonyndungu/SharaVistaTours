// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import MainLayout from './layouts/MainLayout'
// import Home from './pages/Home'
// import Tours from './pages/Tours'
// import Destinations from './pages/Destinations'
// import Gallery from './pages/Gallery'
// import TravelTips from './pages/TravelTips'
// import Contact from './pages/Contact'
// import SingleTour from './pages/SingleTour'
// import AdminDashboard from './pages/admin/AdminDashboard'

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* ✅ CORRECT: MainLayout as parent route with nested children */}
//         <Route path="/" element={<MainLayout />}>
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route index element={<Home />} />
//           <Route path="tours" element={<Tours />} />
//           <Route path="destinations" element={<Destinations />} />
//           <Route path="gallery" element={<Gallery />} />
//           <Route path="travel-tips" element={<TravelTips />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="tours/:tourId" element={<SingleTour />} />
//         </Route>
//       </Routes>
//     </Router>
//   )
// }

// export default App


// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// Admin routes
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPackages from './pages/admin/ManagePackages';
import AdminBookings from './pages/admin/ManageBookings';
import AdminClients from './pages/admin/ManageUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 PUBLIC SITE */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="tours" element={<Tours />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="travel-tips" element={<TravelTips />} />
          <Route path="contact" element={<Contact />} />
          <Route path="tours/:tourId" element={<SingleTour />} />
        </Route>

        {/* 👤 CLIENT DASHBOARD */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payments" element={<Payments />} />
        </Route>

        {/* 👨‍💼 ADMIN PANEL */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Page Not Found</h2>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;