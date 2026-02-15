// import { useState, useRef, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import Login from '../pages/auth/Login'
// import Register from '../pages/auth/Register'

// export default function Header() {
//   const [showLogin, setShowLogin] = useState(false)
//   const [showRegister, setShowRegister] = useState(false)
//   const popupRef = useRef(null)

//   // Close popups when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setShowLogin(false)
//         setShowRegister(false)
//       }
//     }

//     if (showLogin || showRegister) {
//       document.addEventListener('mousedown', handleClickOutside)
//     }
    
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [showLogin, showRegister])

//   const closePopups = () => {
//     setShowLogin(false)
//     setShowRegister(false)
//   }

//   return (
//     <header id="masthead" className="site-header sticky_header affix-top">
//       <div className="header_top_bar">
//         <div className="container">
//           <div className="row">
//             <div className="col-sm-4">
//               <aside id="text-15" className="widget_text">
//                 <div className="textwidget">
//                   <ul className="top_bar_info clearfix">
//                     <li><i className="fa fa-clock-o"></i> Mon - Sat 8.00 - 18.00. Sunday CLOSED</li>
//                   </ul>
//                 </div>
//               </aside>
//             </div>
//             <div className="col-sm-8 topbar-right">
//               <aside id="text-7" className="widget widget_text">
//                 <div className="textwidget">
//                   <ul className="top_bar_info clearfix">
//                     <li><i className="fa fa-phone"></i> +254 769859091</li>
//                     <li className="hidden-info">
//                       <i className="fa fa-map-marker"></i> Applewood Adams, Ngong Road.5th Floor, Office No. 507 Nairobi, Kenya
//                     </li>
//                   </ul>
//                 </div>
//               </aside>
              
//               {/* Login/Register Popup Container */}
//               <aside id="travel_login_register_from-2" className="widget widget_login_form">
//                 {/* Login Trigger */}
//                 <span 
//                   className="show_from login"
//                   onClick={() => {
//                     setShowLogin(true)
//                     setShowRegister(false)
//                   }}
//                 >
//                   <i className="fa fa-user"></i>Login
//                 </span>

//                 {/* Login Popup */}
//                 {showLogin && (
//                   <div className="form_popup from_login" tabIndex="-1" ref={popupRef}>
//                     <div className="inner-form">
//                       <div 
//                         className="closeicon"
//                         onClick={closePopups}
//                       ></div>
//                       <Login />
//                     </div>
//                   </div>
//                 )}

//                 {/* Register Trigger */}
//                 <span 
//                   className="register_btn"
//                   onClick={() => {
//                     setShowRegister(true)
//                     setShowLogin(false)
//                   }}
//                 >
//                   Register
//                 </span>

//                 {/* Register Popup */}
//                 {showRegister && (
//                   <div className="form_popup from_register" tabIndex="-1" ref={popupRef}>
//                     <div className="inner-form">
//                       <div 
//                         className="closeicon"
//                         onClick={closePopups}
//                       ></div>
//                       <Register />
//                     </div>
//                   </div>
//                 )}

//                 {/* Background Overlay */}
//                 {(showLogin || showRegister) && (
//                   <div 
//                     className="background-overlay"
//                     onClick={closePopups}
//                   ></div>
//                 )}
//               </aside>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Navigation Menu */}
//       <div className="navigation-menu">
//         <div className="container">
//           <div className="menu-mobile-effect navbar-toggle button-collapse" data-activates="mobile-demo">
//             <span className="icon-bar"></span>
//             <span className="icon-bar"></span>
//             <span className="icon-bar"></span>
//           </div>
//           <div className="width-logo sm-logo">
//             <Link to="/" title="Travel" rel="home">
//               <img src="/assets/img/logo_sticky.png" alt="Logo" width="100" height="25" className="logo_transparent_static" />
//             </Link>
//           </div>
//           <nav className="width-navigation">
//             <ul className="nav navbar-nav menu-main-menu side-nav" id="mobile-demo">
//               <li>
//                 <Link to="/">Home</Link>
//               </li>
//               <li className="menu-item-has-children">
//                 <Link to="/tours">Tours</Link>
//               </li>
//               <li><Link to="/destinations">Destinations</Link></li>
//               <li><Link to="/gallery">Gallery</Link></li>
//               <li><Link to="/travel-tips">Travel Tips</Link></li>
//               <li><Link to="/contact">Contact</Link></li>
//               <li className="menu-right">
//                 <ul>
//                   <li id="travel_social_widget-2" className="widget travel_search">
//                     <div className="search-toggler-unit">
//                       <div className="search-toggler">
//                         <i className="fa fa-search"></i>
//                       </div>
//                     </div>
//                     <div className="search-menu search-overlay search-hidden">
//                       <div className="closeicon"></div>
//                       <form role="search" method="get" className="search-form" action="#">
//                         <input type="search" className="search-field" placeholder="Search ..." value="" name="s" title="Search for:" />
//                         <input type="submit" className="search-submit font-awesome" value="&#xf002;" />
//                       </form>
//                       <div className="background-overlay"></div>
//                     </div>
//                   </li>
//                 </ul>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </header>
//   )
// }



// src/components/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const loginModalRef = useRef(null);
  const registerModalRef = useRef(null);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const closeAll = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  // 🔥 INTERCEPT LINK CLICKS INSIDE MODALS
  useEffect(() => {
    const handleModalClick = (e) => {
      // Only act if click is inside an open modal
      const inLoginModal = showLogin && loginModalRef.current?.contains(e.target);
      const inRegisterModal = showRegister && registerModalRef.current?.contains(e.target);

      if (!inLoginModal && !inRegisterModal) return;

      // Find if a <a> tag with specific href was clicked
      const link = e.target.closest('a[href="/auth/register"]');
      const backLink = e.target.closest('a[href="/auth/login"]');

      if (link) {
        e.preventDefault();
        openRegister();
      } else if (backLink) {
        e.preventDefault();
        openLogin();
      }
    };

    // Use CAPTURE phase to intercept before React Router
    document.addEventListener('click', handleModalClick, true);
    return () => document.removeEventListener('click', handleModalClick, true);
  }, [showLogin, showRegister]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLogin && loginModalRef.current && !loginModalRef.current.contains(event.target)) {
        closeAll();
        return;
      }
      if (showRegister && registerModalRef.current && !registerModalRef.current.contains(event.target)) {
        closeAll();
      }
    };

    if (showLogin || showRegister) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogin, showRegister]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent background scroll
  useEffect(() => {
    if (showLogin || showRegister) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLogin, showRegister]);

  return (
    <header id="masthead" className="site-header sticky_header affix-top">
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

              {/* Login/Register Popup Container */}
              <aside id="travel_login_register_from-2" className="widget widget_login_form">
                {/* Login Trigger */}
                <span
                  className="show_from login"
                  onClick={openLogin}
                >
                  <i className="fa fa-user"></i>Login
                </span>

                {/* Login Popup */}
                {showLogin && (
                  <div className="form_popup from_login" tabIndex="-1" ref={loginModalRef}>
                    <div className="inner-form">
                      <div className="closeicon" onClick={closeAll}></div>
                      <Login />
                    </div>
                  </div>
                )}

                {/* Register Trigger */}
                <span
                  className="register_btn"
                  onClick={openRegister}
                >
                  Register
                </span>

                {/* Register Popup */}
                {showRegister && (
                  <div className="form_popup from_register" tabIndex="-1" ref={registerModalRef}>
                    <div className="inner-form">
                      <div className="closeicon" onClick={closeAll}></div>
                      <Register />
                    </div>
                  </div>
                )}

                {/* Background Overlay */}
                {(showLogin || showRegister) && (
                  <div className="background-overlay" onClick={closeAll}></div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="navigation-menu">
        <div className="container">
          <div className="menu-mobile-effect navbar-toggle button-collapse" data-activates="mobile-demo">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </div>
          <div className="width-logo sm-logo">
            <Link to="/" title="Travel" rel="home">
              <img src="/assets/img/logo_sticky.png" alt="Logo" width="100" height="25" className="logo_transparent_static" />
            </Link>
          </div>
          <nav className="width-navigation">
            <ul className="nav navbar-nav menu-main-menu side-nav" id="mobile-demo">
              <li><Link to="/">Home</Link></li>
              <li className="menu-item-has-children"><Link to="/tours">Tours</Link></li>
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/travel-tips">Travel Tips</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li className="menu-right">
                <ul>
                  <li id="travel_social_widget-2" className="widget travel_search">
                    <div className="search-toggler-unit">
                      <div className="search-toggler"><i className="fa fa-search"></i></div>
                    </div>
                    <div className="search-menu search-overlay search-hidden">
                      <div className="closeicon"></div>
                      <form role="search" method="get" className="search-form" action="#">
                        <input type="search" className="search-field" placeholder="Search ..." name="s" />
                        <input type="submit" className="search-submit font-awesome" value="&#xf002;" />
                      </form>
                      <div className="background-overlay"></div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}