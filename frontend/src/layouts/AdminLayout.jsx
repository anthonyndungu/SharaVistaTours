// src/layouts/AdminLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, clearAuthState } from '../features/auth/authSlice';
import { 
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

// Admin navigation items
const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Packages', href: '/admin/packages', icon: '🧳' },
  { name: 'Bookings', href: '/admin/bookings', icon: '📅' },
  { name: 'Clients', href: '/admin/clients', icon: '👥' },
  { name: 'Reviews', href: '/admin/reviews', icon: '⭐' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' }
];

// Brand colors (matching your AdminDashboard)
const COLORS = {
  primary: '#1976d2',
  primaryLight: '#e3f2fd',
  text: '#000',
  textSecondary: '#555',
  background: '#fff',
  sidebarBg: '#ffffff',
  border: '#e0e0e0',
  cardShadow: '0 2px 8px rgba(0,0,0,0.1)',
  hoverBg: '#f8f9fa'
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearAuthState());
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 99
            }}
          ></div>
          <div
            style={{
              width: '260px',
              backgroundColor: COLORS.sidebarBg,
              boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
              zIndex: 100,
              position: 'fixed',
              height: '100vh',
              overflowY: 'auto'
            }}
          >
            {/* Logo/Header */}
            <div style={{
              padding: '24px 20px',
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: COLORS.primary,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  T
                </div>
                <h1 style={{
                  marginLeft: '12px',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: COLORS.text
                }}>
                  SharaVista Admin
                </h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: COLORS.text
                }}
              >
                <XMarkIcon style={{ height: '20px', width: '20px' }} />
              </button>
            </div>

            {/* Navigation */}
            <nav style={{ padding: '20px 0', flex: 1 }}>
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 24px',
                    textDecoration: 'none',
                    color: COLORS.textSecondary,
                    fontWeight: 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <div style={{
              padding: '16px 24px',
              borderTop: `1px solid ${COLORS.border}`,
              color: COLORS.textSecondary,
              fontSize: '14px'
            }}>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '500'
                }}
              >
                <ArrowLeftOnRectangleIcon style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <div
        style={{
          width: '260px',
          backgroundColor: COLORS.sidebarBg,
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 100
        }}
      >
        {/* Logo/Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: COLORS.primary,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            T
          </div>
          <h1 style={{
            marginLeft: '12px',
            fontSize: '18px',
            fontWeight: '700',
            color: COLORS.text
          }}>
            SharaVista Admin
          </h1>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '20px 0', flex: 1 }}>
          {adminNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 24px',
                textDecoration: 'none',
                color: COLORS.textSecondary,
                fontWeight: 'normal',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${COLORS.border}`,
          color: COLORS.textSecondary,
          fontSize: '14px'
        }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontWeight: '500'
            }}
          >
            <ArrowLeftOnRectangleIcon style={{ height: '16px', width: '16px', marginRight: '8px' }} />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: '260px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top mobile header */}
        <header style={{
          backgroundColor: COLORS.background,
          padding: '16px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          display: 'none'
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: COLORS.text
            }}
          >
            <Bars3Icon style={{ height: '20px', width: '20px' }} />
          </button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: COLORS.primaryLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.primary,
              fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '24px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}