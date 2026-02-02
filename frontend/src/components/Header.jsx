export default function Header() {
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
                    <li><i className="fa fa-phone"></i> 0123456789</li>
                    <li className="hidden-info">
                      <i className="fa fa-map-marker"></i> 1010 Moon ave, New York, NY US
                    </li>
                  </ul>
                </div>
              </aside>
              <aside id="travel_login_register_from-2" className="widget widget_login_form">
                <span className="show_from login"><i className="fa fa-user"></i>Login</span>
                <div className="form_popup from_login" tabIndex="-1">
                  <div className="inner-form">
                    <div className="closeicon"></div>
                    <h3>Login</h3>
                    <form name="loginform" id="loginform" action="#" method="post">
                      <p className="login-username">
                        <label htmlFor="user_login">Username or Email Address</label>
                        <input type="text" name="log" id="user_login" className="input" value="" size="20" />
                      </p>
                      <p className="login-password">
                        <label htmlFor="user_pass">Password</label>
                        <input type="password" name="pwd" id="user_pass" className="input" value="" size="20" />
                      </p>
                      <p className="login-remember">
                        <label><input name="rememberme" type="checkbox" id="rememberme" value="forever" /> Remember Me</label>
                      </p>
                      <p className="login-submit">
                        <input type="submit" name="wp-submit" id="wp-submit" className="button button-primary" value="Log In" />
                        <input type="hidden" name="redirect_to" value="" />
                      </p>
                    </form>
                    <a href="#" title="Lost your password?" className="lost-pass">Lost your password?</a>
                  </div>
                </div>
                <span className="register_btn">Register</span>
                <div className="form_popup from_register" tabIndex="-1">
                  <div className="inner-form">
                    <div className="closeicon"></div>
                    <h3>Register</h3>
                    <form method="post" className="register">
                      <p className="form-row">
                        <label htmlFor="reg_username">Username <span className="required">*</span></label>
                        <input type="text" className="input" name="username" id="reg_username" value="" autoComplete="off" />
                      </p>
                      <p className="form-row">
                        <label htmlFor="reg_email">Email address <span className="required">*</span></label>
                        <input type="email" className="input" name="email" id="reg_email" value="" />
                      </p>
                      <p className="form-row">
                        <label htmlFor="reg_password">Password <span className="required">*</span></label>
                        <input type="password" className="input" name="password" id="reg_password" />
                      </p>
                      <div style={{left: '-999em', position: 'absolute'}}>
                        <label htmlFor="trap">Anti-spam</label>
                        <input type="text" name="email_2" id="trap" tabIndex="-1" autoComplete="off" />
                      </div>
                      <p className="form-row">
                        <input type="submit" className="button" name="register" value="Register" />
                      </p>
                    </form>
                  </div>
                </div>
                <div className="background-overlay"></div>
              </aside>
            </div>
          </div>
        </div>
      </div>
      <div className="navigation-menu">
        <div className="container">
          <div className="menu-mobile-effect navbar-toggle button-collapse" data-activates="mobile-demo">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </div>
          <div className="width-logo sm-logo">
            <a href="/" title="Travel" rel="home">
              <img src="/assets/img/logo_sticky.png" alt="Logo" width="100" height="25" className="logo_transparent_static" />
              {/* <img src="/assets/img/logo_sticky.png" alt="Sticky logo" width="474" height="130" className="logo_sticky" /> */}
            </a>
          </div>
          <nav className="width-navigation">
            <ul className="nav navbar-nav menu-main-menu side-nav" id="mobile-demo">
              <li>
                <a href="/">Home</a>
              </li>
              <li className="menu-item-has-children">
                <a href="/tours">Tours</a>
                <ul className="sub-menu">
                  <li className="current-menu-ancestor current-menu-parent">
                    <a href="/single-tour">Single Tour</a>
                  </li>
                  <li><a href="#">Layout</a>
                    <ul className="sub-menu">
                      <li><a href="/tours-list">Tour List</a></li>
                      <li><a href="/tours-2-cols">Grid – 2 cols</a></li>
                      <li><a href="/tours">Grid – 3 cols(width sidebar)</a></li>
                      <li><a href="/tours-3-cols">Grid – 3 cols (no sidebar)</a></li>
                      <li><a href="/tours-4-cols">Grid – 4 cols</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li><a href="/destinations">Destinations</a></li>
              <li><a href="/gallery">Gallery</a></li>
                <li><a href="/travel-tips">Travel Tips</a></li>
              {/* <li className="menu-item-has-children">
                <a href="#">Pages</a>
                <ul className="sub-menu">
                  <li><a href="/gallery">Gallery</a></li>
                  <li><a href="/travel-tips">Travel Tips</a></li>
                  <li><a href="/typography">Typography</a></li>
                  <li><a href="/checkout">Checkout</a></li>
                </ul>
              </li> */}
              <li><a href="/contact">Contact</a></li>
              <li className="menu-right">
                <ul>
                  <li id="travel_social_widget-2" className="widget travel_search">
                    <div className="search-toggler-unit">
                      <div className="search-toggler">
                        <i className="fa fa-search"></i>
                      </div>
                    </div>
                    <div className="search-menu search-overlay search-hidden">
                      <div className="closeicon"></div>
                      <form role="search" method="get" className="search-form" action="#">
                        <input type="search" className="search-field" placeholder="Search ..." value="" name="s" title="Search for:" />
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
  )
}