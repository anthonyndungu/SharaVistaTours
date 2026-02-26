import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const contactPhone = "254769859091"; // Format for WhatsApp (no +)

  return (
    <div className="wrapper-footer wrapper-footer-newsletter">
      {/* Main Footer Top */}
      <div className="main-top-footer">
        <div className="container">
          <div className="row">
            
            {/* Column 1: Contact Info */}
            <aside className="col-sm-3 widget_text">
              <h3 className="widget-title">CONTACT US</h3>
              <div className="footer-info">
                <p style={{ marginBottom: '20px', lineHeight: '1.6', color: '#ccc' }}>
                  Your trusted partner for unforgettable travel experiences across Kenya and beyond. Let us plan your next adventure.
                </p>
                <ul className="contact-info" style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '15px', color: '#ccc' }}>
                    <i className="fa fa-map-marker fa-fw" style={{ color: '#ffb300', width: '20px' }}></i> 
                    <strong>Head Office:</strong><br/>
                    Nairobi, Kenya
                  </li>
                  <li style={{ marginBottom: '15px', color: '#ccc' }}>
                    <i className="fa fa-phone fa-fw" style={{ color: '#ffb300', width: '20px' }}></i> 
                    <a href={`tel:+${contactPhone}`} style={{ color: '#ccc', textDecoration: 'none' }}>++254 769 859 091</a>
                  </li>
                  <li style={{ color: '#ccc' }}>
                    <i className="fa fa-envelope fa-fw" style={{ color: '#ffb300', width: '20px' }}></i> 
                    <a href="mailto:info@sharavistatours.com" style={{ color: '#ccc', textDecoration: 'none' }}>info@sharavistatours.com</a>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Column 2: Company Information */}
            <aside className="col-sm-3 widget_text">
              <h3 className="widget-title">COMPANY</h3>
              <ul className="menu list-arrow" style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ color: '#ccc', textDecoration: 'none' }}>About Us</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/tours" style={{ color: '#ccc', textDecoration: 'none' }}>Our Tours</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/destinations" style={{ color: '#ccc', textDecoration: 'none' }}>Destinations</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/contact" style={{ color: '#ccc', textDecoration: 'none' }}>Contact Us</Link></li>
              </ul>
            </aside>

            {/* Column 3: Quick Links */}
            <aside className="col-sm-3 widget_text">
              <h3 className="widget-title">QUICK LINKS</h3>
              <ul className="menu list-arrow" style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}><Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Home</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/tours" style={{ color: '#ccc', textDecoration: 'none' }}>Search Tours</Link></li>
              </ul>
            </aside>

            {/* Column 4: Follow Us (Social Media) */}
            <aside className="col-sm-3 widget_text">
              <h3 className="widget-title">FOLLOW US</h3>
              <p style={{ marginBottom: '20px', color: '#ccc' }}>
                Stay updated with our latest offers and travel inspiration.
              </p>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                
                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/people/Sharavista-Tours/61582686912041/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#fff', fontSize: '24px', transition: 'color 0.3s' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#1877F2'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#fff'}
                  title="Facebook"
                >
                  <i className="fa fa-facebook-square"></i>
                </a>

                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/sharavistatours/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#fff', fontSize: '24px', transition: 'color 0.3s' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#E4405F'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#fff'}
                  title="Instagram"
                >
                  <i className="fa fa-instagram"></i>
                </a>

                {/* YouTube */}
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#fff', fontSize: '24px', transition: 'color 0.3s' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#FF0000'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#fff'}
                  title="YouTube"
                >
                  <i className="fa fa-youtube-play"></i>
                </a>

                {/* TikTok */}
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#fff', fontSize: '24px', transition: 'color 0.3s' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#00f2ea'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#fff'}
                  title="TikTok"
                >
                  <i className="fa-brands fa-tiktok"></i>
                </a>

                {/* WhatsApp - Linked to Phone Number */}
                <a 
                  href={`https://wa.me/${contactPhone}?text=Hello%20Sharavista%20Tours,%20I%20would%20like%20to%20inquire%20about%20a%20tour.`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#fff', fontSize: '24px', transition: 'color 0.3s' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#25D366'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#fff'}
                  title="Chat on WhatsApp"
                >
                  <i className="fa fa-whatsapp"></i>
                </a>

              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container wrapper-copyright">
        <div className="row">
          <div className="col-sm-6">
            <div>
              <p style={{ margin: 0, color: '#ccc' }}>
                Copyright © {currentYear} <strong>Sharavista Tours</strong>. All Rights Reserved.
              </p>
            </div>
          </div>
          <div className="col-sm-6">
            <aside id="text-5" className="widget_text">
              <div className="textwidget">
                <ul className="footer_menu" style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'right' }}>
                  <li style={{ display: 'inline-block' }}><Link to="/terms" style={{ color: '#ccc', textDecoration: 'none' }}>Terms of Use</Link></li>
                  <li style={{ display: 'inline-block', margin: '0 10px', color: '#666' }}>|</li>
                  <li style={{ display: 'inline-block' }}><Link to="/privacy" style={{ color: '#ccc', textDecoration: 'none' }}>Privacy Policy</Link></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}