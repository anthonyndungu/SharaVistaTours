import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'


export default function MainLayout() {
  return (
    <div className="wrapper-container">
      <Header />
      <div className="site wrapper-content" style={{
        paddingTop: '25px',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}