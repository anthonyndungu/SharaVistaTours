import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, clearAuthState } from '../features/auth/authSlice';
import { 
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
  BuildingOfficeIcon,
  UserIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { UserIcon as UserSolidIcon } from '@heroicons/react/24/solid';

// Admin navigation items
const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Packages', href: '/admin/packages', icon: '🧳' },
  { name: 'Bookings', href: '/admin/bookings', icon: '📅' },
  { name: 'Clients', href: '/admin/clients', icon: '👥' },
  { name: 'Reviews', href: '/admin/reviews', icon: '⭐' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' }
];

const COLORS = {
  primary: '#1976d2',
  primaryLight: '#e3f2fd',
  text: '#000',
  textSecondary: '#555',
  background: '#f5f7fa',
  sidebarBg: '#ffffff',
  border: '#e0e0e0',
  hoverBg: '#f8f9fa'
};

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ State for dropdown
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const dropdownRef = useRef(null); // ✅ Ref to detect clicks outside

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      if (!newIsMobile) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) setMobileSidebarOpen(false);
  }, [location.pathname, isMobile]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    dispatch(clearAuthState());
    navigate('/');
  };

  const handleGoToProfile = () => {
    setDropdownOpen(false);
    navigate('/admin/profile');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      
      {/* --- MOBILE SIDEBAR --- */}
      {mobileSidebarOpen && isMobile && (
        <>
          <div onClick={() => setMobileSidebarOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 99 }} />
          <div style={{ width: '260px', backgroundColor: COLORS.sidebarBg, boxShadow: '2px 0 10px rgba(0,0,0,0.1)', zIndex: 100, position: 'fixed', height: '100vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: COLORS.primary, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <BuildingOfficeIcon style={{ width: '20px', height: '20px' }} />
                </div>
                <span style={{ fontWeight: '700', fontSize: '16px' }}>Admin Panel</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              </button>
            </div>
            <nav style={{ padding: '10px 0' }}>
              {adminNavigation.map((item) => (
                <Link key={item.name} to={item.href} onClick={() => setMobileSidebarOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', textDecoration: 'none', color: location.pathname === item.href ? COLORS.primary : COLORS.textSecondary, backgroundColor: location.pathname === item.href ? COLORS.primaryLight : 'transparent', fontWeight: location.pathname === item.href ? '600' : '400' }}>
                  <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>{item.name}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      {!isMobile && (
        <div style={{ width: '260px', backgroundColor: COLORS.sidebarBg, boxShadow: '2px 0 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', overflowY: 'auto', zIndex: 100 }}>
          <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: COLORS.primary, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <BuildingOfficeIcon style={{ width: '20px', height: '20px' }} />
            </div>
            <span style={{ fontWeight: '700', fontSize: '16px' }}>Admin Panel</span>
          </div>
          <nav style={{ padding: '10px 0', flex: 1 }}>
            {adminNavigation.map((item) => (
              <Link key={item.name} to={item.href}
                style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', textDecoration: 'none', color: location.pathname === item.href ? COLORS.primary : COLORS.textSecondary, backgroundColor: location.pathname === item.href ? COLORS.primaryLight : 'transparent', fontWeight: location.pathname === item.href ? '600' : '400', transition: 'all 0.2s' }}>
                <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>{item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, marginLeft: !isMobile ? '260px' : '0', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <header style={{
          backgroundColor: '#fff',
          padding: '16px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <button onClick={() => setMobileSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.text, display: 'flex', alignItems: 'center' }}>
              <Bars3Icon style={{ width: '24px', height: '24px' }} />
            </button>
          )}
          
          {/* Title (Hidden on very small screens if needed) */}
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.text, marginLeft: isMobile ? '12px' : '0' }}>
            {adminNavigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
          </h1>

          {/* ✅ USER DROPDOWN SECTION */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: COLORS.primaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.primary,
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <ChevronDownIcon style={{ width: '16px', height: '16px', color: COLORS.textSecondary }} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '50px',
                width: '280px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: `1px solid ${COLORS.border}`,
                zIndex: 100,
                overflow: 'hidden'
              }}>
                {/* User Info Header */}
                <div style={{ padding: '16px', borderBottom: `1px solid ${COLORS.border}`, backgroundColor: '#fafafa' }}>
                  <p style={{ margin: 0, fontWeight: '700', color: COLORS.text, fontSize: '15px' }}>
                    {user?.name || 'Admin User'}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: COLORS.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email || 'admin@example.com'}
                  </p>
                  {user?.role && (
                    <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', backgroundColor: COLORS.primaryLight, color: COLORS.primary, padding: '2px 8px', borderRadius: '12px', fontWeight: '600', textTransform: 'capitalize' }}>
                      {user.role.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* Menu Items */}
                <div style={{ padding: '8px 0' }}>
                  <button
                    onClick={handleGoToProfile}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: COLORS.text,
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.hoverBg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <UserIcon style={{ width: '18px', height: '18px', color: COLORS.textSecondary }} />
                    Profile
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#dc3545',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <ArrowLeftOnRectangleIcon style={{ width: '18px', height: '18px' }} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '24px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}