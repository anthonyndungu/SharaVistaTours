import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages, fetchPackageStats } from '../../features/packages/packageSlice';
import { getAllBookings } from '../../features/bookings/bookingSlice';
import { Link, useLocation } from 'react-router-dom';
import Spinner from '../../components/Spinner';

// Brand colors
const COLORS = {
  primary: '#1976d2',
  primaryDark: '#1565c0',
  primaryLight: '#e3f2fd',
  text: '#000',
  textSecondary: '#555',
  background: '#fff',
  sidebarBg: '#ffffff',
  border: '#e0e0e0',
  cardShadow: '0 2px 8px rgba(0,0,0,0.1)',
  hoverBg: '#f8f9fa'
};

// Navigation items
const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: '📊' },
  { name: 'Packages', path: '/admin/packages', icon: '🧳' },
  { name: 'Bookings', path: '/admin/bookings', icon: '📅' },
  { name: 'Clients', path: '/admin/clients', icon: '👥' },
  { name: 'Reviews', path: '/admin/reviews', icon: '⭐' },
  { name: 'Settings', path: '/admin/settings', icon: '⚙️' }
];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { stats: packageStats, loading: packageLoading } = useSelector((state) => state.packages);
  const { bookings: allBookings, loading: bookingLoading } = useSelector((state) => state.bookings);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768); // Open by default on desktop

  useEffect(() => {
    dispatch(fetchPackages()); 
    dispatch(fetchPackageStats());
    dispatch(getAllBookings());
  }, [dispatch]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const totalBookings = allBookings?.length || 0;
  const confirmedBookings = allBookings?.filter(b => b.status === 'confirmed').length || 0;
  const completedBookings = allBookings?.filter(b => b.status === 'completed').length || 0;
  const totalRevenue = allBookings?.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0) || 0;

  const loading = packageLoading || bookingLoading;

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f7fa' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'completed': return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
      case 'cancelled': return { backgroundColor: '#ffebee', color: '#c62828' };
      default: return { backgroundColor: '#fff3e0', color: '#e65100' };
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          style={{
            width: '260px',
            backgroundColor: COLORS.sidebarBg,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
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
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 24px',
                  textDecoration: 'none',
                  color: location.pathname === item.path ? COLORS.primary : COLORS.textSecondary,
                  backgroundColor: location.pathname === item.path ? COLORS.primaryLight : 'transparent',
                  fontWeight: location.pathname === item.path ? '600' : 'normal',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.backgroundColor = COLORS.hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout/Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: `1px solid ${COLORS.border}`,
            color: COLORS.textSecondary,
            fontSize: '14px'
          }}>
            <button
              onClick={() => {
                // Add logout logic here
                console.log('Logout clicked');
              }}
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
              <span style={{ marginRight: '12px' }}>🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '260px' : '0',
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: COLORS.background,
          padding: '16px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!sidebarOpen && (
              <button
                onClick={toggleSidebar}
                style={{
                  marginRight: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: COLORS.text
                }}
              >
                ☰
              </button>
            )}
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: COLORS.text
            }}>
              Dashboard
            </h1>
          </div>
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
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main style={{ padding: '24px', flex: 1 }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: COLORS.text,
            marginBottom: '24px'
          }}>
            Admin Dashboard
          </h1>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
          }}>
            {[
              { title: 'Total Bookings', value: totalBookings, icon: '📅', color: COLORS.primary },
              { title: 'Confirmed', value: confirmedBookings, icon: '✅', color: '#2e7d32' },
              { title: 'Completed', value: completedBookings, icon: '🏁', color: '#7b1fa2' },
              { title: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, icon: '💰', color: '#e65100' }
            ].map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: COLORS.background,
                borderRadius: '12px',
                boxShadow: COLORS.cardShadow,
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: COLORS.textSecondary,
                    marginBottom: '4px'
                  }}>{item.title}</p>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: COLORS.text
                  }}>{item.value}</p>
                </div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: `${item.color}15`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  fontSize: '18px'
                }}>
                  {item.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Package Categories */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            boxShadow: COLORS.cardShadow,
            padding: '24px',
            marginBottom: '28px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: COLORS.text
              }}>Package Categories</h2>
              <Link
                to="/admin/packages"
                style={{
                  color: COLORS.primary,
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                View All →
              </Link>
            </div>

            {packageStats && packageStats.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      {['Category', 'Packages', 'Avg Price', 'Min Price', 'Max Price'].map((header, idx) => (
                        <th
                          key={idx}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: COLORS.textSecondary,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {packageStats.map((stat) => (
                      <tr
                        key={stat.category}
                        style={{ borderBottom: `1px solid ${COLORS.border}` }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: '600', color: COLORS.text }}>
                          {stat.category.charAt(0).toUpperCase() + stat.category.slice(1)}
                        </td>
                        <td style={{ padding: '12px 16px', color: COLORS.textSecondary }}>{stat.count}</td>
                        <td style={{ padding: '12px 16px', color: COLORS.textSecondary }}>
                          KES {parseFloat(stat.avgPrice).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 16px', color: COLORS.textSecondary }}>
                          KES {parseFloat(stat.minPrice).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 16px', color: COLORS.textSecondary }}>
                          KES {parseFloat(stat.maxPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: COLORS.textSecondary }}>
                No package statistics available
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            boxShadow: COLORS.cardShadow,
            padding: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: COLORS.text
              }}>Recent Bookings</h2>
              <Link
                to="/admin/bookings"
                style={{
                  color: COLORS.primary,
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                View All →
              </Link>
            </div>

            {allBookings && allBookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    style={{
                      paddingBottom: '16px',
                      borderBottom: `1px solid ${COLORS.border}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div>
                      <h3 style={{ fontWeight: '600', color: COLORS.text, marginBottom: '4px' }}>
                        {booking.TourPackage?.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: COLORS.textSecondary }}>
                        {booking.User?.name} • {booking.booking_number}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '600', color: COLORS.text, marginBottom: '4px' }}>
                        KES {booking.total_amount.toLocaleString()}
                      </p>
                      <span style={{
                        ...getStatusStyle(booking.status),
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: COLORS.textSecondary }}>
                No bookings found
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 99,
            display: 'block'
          }}
        ></div>
      )}
    </div>
  );
}