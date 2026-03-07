import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, clearAuthState, clearLoginMessage } from '../features/auth/authSlice';
import { Snackbar, Alert } from '@mui/material';

export default function Header() {
  const dispatch = useDispatch();
  // ✅ Removed navigate import since we aren't redirecting here

  const { isAuthenticated, user, loginMessage, loginMessageSeverity } = useSelector((state) => state.auth);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const userMenuRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);
  const closeMobileDrawer = () => setMobileOpen(false);

  // ✅ Logout: Only clears state, NO redirect
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearAuthState());
    setShowUserMenu(false);
    closeMobileDrawer();
    // No navigate('/') here
  };

  // ✅ Dashboard Click: Only closes menu, NO redirect
  const handleGoToDashboard = () => {
    setShowUserMenu(false);
    closeMobileDrawer();
    // No navigate logic here
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) { 
        setShowUserMenu(false); 
        return; 
      }
      if (mobileOpen && mobileDrawerRef.current && !mobileDrawerRef.current.contains(event.target)) {
        const toggleBtn = document.querySelector('.navbar-toggle');
        if (!toggleBtn || !toggleBtn.contains(event.target)) { 
          closeMobileDrawer(); 
        }
      }
    };
    
    if (showUserMenu || mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, mobileOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => { 
      if (e.key === 'Escape') { 
        setShowUserMenu(false);
        closeMobileDrawer(); 
      } 
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (mobileOpen) { 
      document.body.style.overflow = 'hidden'; 
    } else { 
      document.body.style.overflow = ''; 
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ✅ Snackbar Logic: No timeouts, no session storage
  useEffect(() => {
    if (loginMessage) {
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(false);
    }
  }, [loginMessage]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    // Clear message immediately upon closing
    dispatch(clearLoginMessage());
  };

  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header id="masthead" className="site-header sticky_header affix-top">
      <style>{`
        @media (max-width: 991px) {
          .desktop-logo-img { display: none !important; }
          .mobile-logo-text { display: flex !important; }
        }
        @media (min-width: 992px) {
          .desktop-logo-img { display: block !important; }
          .mobile-logo-text { display: none !important; }
        }

        @media (max-width: 991px) {
          #mobile-demo {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            width: 280px !important;
            background-color: #ffffff !important;
            z-index: 999999 !important;
            box-shadow: 2px 0 10px rgba(0,0,0,0.3) !important;
            overflow-y: auto !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 0 !important;
            margin: 0 !important;
            list-style: none !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }

          #mobile-demo.active,
          #mobile-demo.in,
          #mobile-demo.show,
          #mobile-demo.collapsing {
            transform: translateX(0) !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: flex !important;
          }

          #mobile-demo li {
            display: block !important;
            width: 100% !important;
            border-bottom: 1px solid #f0f0f0 !important;
          }
          
          #mobile-demo li a {
            display: block !important;
            padding: 15px 20px !important;
            color: #333 !important;
            text-decoration: none !important;
            font-weight: 500 !important;
          }

          .mobile-only-section {
            display: block !important;
          }
        }
        
        @media (min-width: 992px) {
          .mobile-only-section {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Bar */}
      <div className="header_top_bar">
        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <aside id="text-15" className="widget_text">
                <div className="textwidget">
                  <ul className="top_bar_info clearfix">
                    <li><i className="fa fa-clock-o"></i> Mon - Sat 8.00 - 18.00. Sunday CLOSED</li>
                  </ul>
                </div>
              </aside>
            </div>
            <div className="col-sm-8 topbar-right">
              <aside id="text-7" className="widget widget_text">
                <div className="textwidget">
                  <ul className="top_bar_info clearfix">
                    <li><i className="fa fa-phone"></i> +254 769859091</li>
                    <li className="hidden-info">
                      <i className="fa fa-map-marker"></i> Applewood Adams, Ngong Road.5th Floor, Office No. 507 Nairobi, Kenya
                    </li>
                  </ul>
                </div>
              </aside>

              {/* ✅ Desktop Auth: Hidden/Shown based on isAuthenticated */}
              <aside id="travel_login_register_from-2" className="widget widget_login_form hidden-xs">
                {!isAuthenticated ? (
                  <>
                    <Link 
                      to="/auth/login" 
                      style={{ cursor: 'pointer', color: '#fff', textDecoration: 'none', marginRight: '15px' }}
                    >
                      <i className="fa fa-user"></i> Login
                    </Link>
                    <Link 
                      to="/auth/register" 
                      style={{ cursor: 'pointer', color: '#fff', textDecoration: 'none' }}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <div className="user-dropdown-container" style={{ position: 'relative', display: 'inline-block' }} ref={userMenuRef}>
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: '#fff', 
                        fontWeight: '600' 
                      }}
                    >
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: '#1976d2', 
                        color: '#fff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 'bold', 
                        fontSize: '14px' 
                      }}>
                        {userInitials}
                      </div>
                      <span>{user?.name || 'User'}</span>
                      <i className={`fa fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
                    </button>
                    {showUserMenu && (
                      <div style={{ 
                        position: 'absolute', 
                        right: 0, 
                        top: '40px', 
                        backgroundColor: '#fff', 
                        minWidth: '180px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                        borderRadius: '8px', 
                        zIndex: 1000, 
                        overflow: 'hidden', 
                        border: '1px solid #eee' 
                      }}>
                        <button 
                          onClick={handleGoToDashboard} 
                          style={{ 
                            width: '100%', 
                            padding: '12px 16px', 
                            textAlign: 'left', 
                            background: 'none', 
                            border: 'none', 
                            borderBottom: '1px solid #f5f5f5', 
                            cursor: 'pointer', 
                            fontSize: '14px', 
                            color: '#333' 
                          }}
                        >
                          <i className="fa fa-tachometer" style={{ marginRight: '8px' }}></i>
                          {user?.role === 'admin' || user?.role === 'super_admin' ? 'Admin Panel' : 'My Dashboard'}
                        </button>
                        <button 
                          onClick={handleLogout} 
                          style={{ 
                            width: '100%', 
                            padding: '12px 16px', 
                            textAlign: 'left', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '14px', 
                            color: '#d32f2f' 
                          }}
                        >
                          <i className="fa fa-sign-out" style={{ marginRight: '8px' }}></i>Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="navigation-menu">
        <div className="container">
          {/* Mobile Toggle */}
          <div 
            className={`menu-mobile-effect navbar-toggle button-collapse ${mobileOpen ? 'active' : ''}`} 
            data-activates="mobile-demo"
            onClick={toggleMobileDrawer}
            style={{ cursor: 'pointer', float: 'right', marginTop: '15px', zIndex: 1000000 }}
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </div>

          {/* Logo Section */}
          <div className="width-logo sm-logo" style={{ float: 'left', paddingTop: '10px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div className="mobile-logo-text" style={{ display: 'none', flexDirection: 'column', lineHeight: '1.2', color: '#333' }}>
                <span style={{ fontSize: '20px', fontWeight: '800', textTransform: 'uppercase', color: '#1976d2' }}>
                  Sharavista
                </span>
                <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1px', color: '#555' }}>
                  TOURS & TRAVEL
                </span>
              </div>
              <img 
                className="desktop-logo-img" 
                src="/assets/img/logo_sticky.png" 
                alt="Logo" 
                width="100" 
                height="10" 
                style={{ display: 'block' }}
              />
            </Link>
          </div>

          <nav className="width-navigation">
            <ul 
              className={`nav navbar-nav menu-main-menu side-nav ${mobileOpen ? 'active' : ''}`}
              id="mobile-demo" 
              ref={mobileDrawerRef}
            >
              {/* User Profile Section (Mobile Only) */}
              <li className="mobile-only-section" style={{ 
                padding: '20px 15px', 
                backgroundColor: '#f8f9fa', 
                borderBottom: '1px solid #eee',
                marginBottom: '10px'
              }}>
                {isAuthenticated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      backgroundColor: '#1976d2', 
                      color: '#fff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '20px' 
                    }}>
                      {userInitials}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: '700', color: '#333', fontSize: '16px' }}>{user?.name}</div>
                      <div style={{ fontSize: '13px', color: '#666', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ fontWeight: '700', color: '#333', fontSize: '18px' }}>Welcome</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>Please login to continue</div>
                  </div>
                )}
              </li>

              {/* Navigation Links */}
              <li><Link to="/" onClick={closeMobileDrawer}>Home</Link></li>
              <li><Link to="/tours" onClick={closeMobileDrawer}>Tours</Link></li>
              <li><Link to="/destinations" onClick={closeMobileDrawer}>Destinations</Link></li>
              <li><Link to="/gallery" onClick={closeMobileDrawer}>Gallery</Link></li>
              <li><Link to="/travel-tips" onClick={closeMobileDrawer}>Travel Tips</Link></li>
              <li><Link to="/about" onClick={closeMobileDrawer}>About Us</Link></li>
              <li><Link to="/contact" onClick={closeMobileDrawer}>Contact</Link></li>

              {/* Auth Actions (Mobile Only) - Hidden/Shown based on isAuthenticated */}
              <li className="mobile-only-section" style={{ 
                padding: '15px', 
                borderTop: '1px solid #eee', 
                backgroundColor: '#fff', 
                marginTop: 'auto'
              }}>
                {isAuthenticated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                      onClick={handleGoToDashboard} 
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: '#1976d2', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '6px', 
                        fontWeight: '600', 
                        cursor: 'pointer' 
                      }}
                    >
                      My Dashboard
                    </button>
                    <button 
                      onClick={handleLogout} 
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: '#fff', 
                        color: '#d32f2f', 
                        border: '1px solid #d32f2f', 
                        borderRadius: '6px', 
                        fontWeight: '600', 
                        cursor: 'pointer' 
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <Link 
                      to="/auth/login" 
                      onClick={closeMobileDrawer}
                      style={{ 
                        display: 'block',
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: '#1976d2', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '6px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        textAlign: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/auth/register" 
                      onClick={closeMobileDrawer}
                      style={{ 
                        display: 'block',
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: '#fff', 
                        color: '#1976d2', 
                        border: '1px solid #1976d2', 
                        borderRadius: '6px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        textAlign: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* ✅ GLOBAL LOGIN MESSAGE SNACKBAR - No Timeouts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={loginMessageSeverity || 'info'} 
          onClose={handleSnackbarClose}
          sx={{ width: '100%' }}
        >
          {loginMessage}
        </Alert>
      </Snackbar>
    </header>
  );
}