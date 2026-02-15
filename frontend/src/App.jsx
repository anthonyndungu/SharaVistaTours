import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Tours from './pages/Tours'
import Destinations from './pages/Destinations'
import Gallery from './pages/Gallery'
import TravelTips from './pages/TravelTips'
import Contact from './pages/Contact'
import SingleTour from './pages/SingleTour'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ CORRECT: MainLayout as parent route with nested children */}
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route index element={<Home />} />
          <Route path="tours" element={<Tours />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="travel-tips" element={<TravelTips />} />
          <Route path="contact" element={<Contact />} />
          <Route path="tours/:tourId" element={<SingleTour />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App