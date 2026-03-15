import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, clearAuthState, clearLoginMessage } from '../features/auth/authSlice';
import { Snackbar, Alert } from '@mui/material';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, loginMessage, loginMessageSeverity } = useSelector((state) => state.auth);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const userMenuRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);
  const closeMobileDrawer = () => setMobileOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearAuthState());
    setShowUserMenu(false);
    closeMobileDrawer();
    navigate('/');
  };

  const handleGoToDashboard = () => {
    setShowUserMenu(false);
    closeMobileDrawer();
    
    if (!isAuthenticated || !user) {
      navigate('/auth/login');
      return;
    }

    if (user.role === 'admin' || user.role === 'super_admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
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

  // ✅ Snackbar Logic
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
    dispatch(clearLoginMessage());
  };

  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header id="masthead" className="site-header sticky_header affix-top">
      <style>{`
        /* Logo Visibility */
        @media (max-width: 991px) {
          .desktop-logo-img { display: none !important; }
          .mobile-logo-text { display: flex !important; }
        }
        @media (min-width: 992px) {
          .desktop-logo-img { display: block !important; }
          .mobile-logo-text { display: none !important; }
        }

        /* ✅ MOBILE DRAWER - NATURAL SCROLL FIX */
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
            
            display: flex !important;
            flex-direction: column !important;
            
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            
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
          #mobile-demo.show {
            transform: translateX(0) !important;
            visibility: visible !important;
            opacity: 1 !important;
          }

          #mobile-demo li {
            display: block !important;
            width: 100% !important;
            border-bottom: 1px solid #f0f0f0 !important;
            flex-shrink: 0;
          }
          
          #mobile-demo li a, 
          #mobile-demo li button {
            display: block !important;
            padding: 15px 20px !important;
            color: #333 !important;
            text-decoration: none !important;
            font-weight: 500 !important;
            width: 100% !important;
            text-align: left !important;
            background: none !important;
            border: none !important;
            font-size: 15px !important;
            cursor: pointer !important;
          }

          /* ✅ User Profile (Top) */
          .mobile-user-profile {
            background-color: #1976d2 !important;
            color: #ffffff !important;
            border-bottom: 1px solid #1565c0 !important;
            padding: 20px 15px !important;
            flex-shrink: 0 !important;
          }
          .mobile-user-profile * {
            color: #ffffff !important;
          }

          /*Auth Actions (Bottom of List - NOT Fixed) */
          .mobile-auth-actions {
            border-top: 1px solid #1976d2 !important;
            background-color: #fff !important;
            padding: 10px 15px !important;
            margin-top:40px;
            /* REMOVED: margin-top: auto (This was fixing it to bottom) */
            flex-shrink: 0 !important;
            
            /* CRITICAL: Extra padding at bottom so last item isn't hidden by gesture bar */
            padding-bottom: 40px !important; 
            width: 100% !important;
            box-sizing: border-box !important;
            
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
          }

          /* Professional Button Styles */
          .mobile-auth-actions .btn-professional {
            display: block !important;
            width: 100% !important;
            padding: 14px 10px !important;
            border-radius: 8px !important;
            font-weight: 700 !important;
            font-size: 15px !important;
            text-align: center !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
            border: 2px solid transparent !important;
            cursor: pointer !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }

          .btn-primary-blue {
            background-color: #1976d2 !important;
            color: #ffffff !important;
          }
          .btn-primary-blue:hover {
            background-color: #1565c0 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3) !important;
          }

          .btn-secondary-blue {
            background-color: #ffffff !important;
            color: #1976d2 !important;
            border-color: #1976d2 !important;
          }
          .btn-secondary-blue:hover {
            background-color: #e3f2fd !important;
            transform: translateY(-1px);
          }

          .btn-danger-outline {
            background-color: #ffffff !important;
            color: #d32f2f !important;
            border-color: #d32f2f !important;
          }
          .btn-danger-outline:hover {
            background-color: #ffebee !important;
            transform: translateY(-1px);
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

              {/* Desktop Auth */}
              <aside id="travel_login_register_from-2" className="widget widget_login_form hidden-xs">
                {!isAuthenticated ? (
                  <>
                    <Link to="/auth/login" style={{ cursor: 'pointer', color: '#fff', textDecoration: 'none', marginRight: '15px' }}>
                      <i className="fa fa-user"></i> Login
                    </Link>
                    <Link to="/auth/register" style={{ cursor: 'pointer', color: '#fff', textDecoration: 'none' }}>
                      Register
                    </Link>
                  </>
                ) : (
                  <div className="user-dropdown-container" style={{ position: 'relative', display: 'inline-block' }} ref={userMenuRef}>
                    <button onClick={() => setShowUserMenu(!showUserMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: '600' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff', color: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                        {userInitials}
                      </div>
                      <span>{user?.name || 'User'}</span>
                      <i className={`fa fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
                    </button>
                    {showUserMenu && (
                      <div style={{ position: 'absolute', right: 0, top: '40px', backgroundColor: '#fff', minWidth: '180px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', zIndex: 1000, overflow: 'hidden', border: '1px solid #eee' }}>
                        <button onClick={handleGoToDashboard} style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', fontSize: '14px', color: '#333' }}>
                          <i className="fa fa-tachometer" style={{ marginRight: '8px' }}></i>
                          {user?.role === 'admin' || user?.role === 'super_admin' ? 'Admin Panel' : 'My Dashboard'}
                        </button>
                        <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#d32f2f' }}>
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
                <span style={{ fontSize: '20px', fontWeight: '800', textTransform: 'uppercase', color: '#1976d2' }}>Sharavista</span>
                <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1px', color: '#555' }}>TOURS & TRAVEL</span>
              </div>
              <img className="desktop-logo-img" src="/assets/img/logo_sticky.png" alt="Logo" width="100" height="10" style={{ display: 'block' }} />
            </Link>
          </div>

          <nav className="width-navigation">
            <ul 
              className={`nav navbar-nav menu-main-menu side-nav ${mobileOpen ? 'active' : ''}`}
              id="mobile-demo" 
              ref={mobileDrawerRef}
            >
              {/* ✅ 1. User Profile (Always Top) */}
              <li className="mobile-only-section mobile-user-profile">
                {isAuthenticated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ffffff', 
                      color: '#1976d2',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '22px',
                      flexShrink: 0
                    }}>
                      {userInitials}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: '700', fontSize: '16px' }}>{user?.name}</div>
                      <div style={{ fontSize: '13px', opacity: 0.9, textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ fontWeight: '700', fontSize: '18px' }}>Welcome</div>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>Please login to continue</div>
                  </div>
                )}
              </li>

              {/* ✅ 2. Navigation Links (Middle) */}
              <li><Link to="/" onClick={closeMobileDrawer}>Home</Link></li>
              <li><Link to="/tours" onClick={closeMobileDrawer}>Tours</Link></li>
              <li><Link to="/destinations" onClick={closeMobileDrawer}>Destinations</Link></li>
              <li><Link to="/gallery" onClick={closeMobileDrawer}>Gallery</Link></li>
              <li><Link to="/travel-tips" onClick={closeMobileDrawer}>Travel Tips</Link></li>
              <li><Link to="/about" onClick={closeMobileDrawer}>About Us</Link></li>
              <li><Link to="/contact" onClick={closeMobileDrawer}>Contact</Link></li>

              {/* ✅ 3. Auth Actions (End of List - Scrollable) */}
              <li className="mobile-only-section mobile-auth-actions" style={{marginTop:"60px !important"}}>
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={handleGoToDashboard} 
                      className="btn-professional btn-primary-blue"
                    >
                      My Dashboard
                    </button>
                    <button 
                      onClick={handleLogout} 
                      className="btn-professional btn-danger-outline"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/auth/login" 
                      onClick={closeMobileDrawer}
                      className="btn-professional btn-primary-blue"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/auth/register" 
                      onClick={closeMobileDrawer}
                      className="btn-professional btn-secondary-blue"
                    >
                      Register
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* GLOBAL LOGIN MESSAGE SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={loginMessageSeverity || 'info'} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          {loginMessage}
        </Alert>
      </Snackbar>
    </header>
  );
}