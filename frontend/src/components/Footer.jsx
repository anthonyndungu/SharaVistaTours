export default function Footer() {
  return (
    <div className="wrapper-footer wrapper-footer-newsletter">
      <div className="main-top-footer">
        <div className="container">
          <div className="row">
            <aside className="col-sm-3 widget_text">
              <h3 className="widget-title">CONTACT</h3>
              <div className="footer-info">
                <p>Lorem ipsum dolor sit amet, cons ectetueradipiscing elit, sed diam nonu my nibh euis motincidunt ut laoreetd</p>
                <ul className="contact-info">
                  <li><i className="fa fa-map-marker fa-fw"></i> 1945 Washington, San Francisco</li>
                  <li><i className="fa fa-phone fa-fw"></i> +1 234 456 7890</li>
                  <li>
                    <i className="fa fa-envelope fa-fw"></i>
                    <a href="mailto:info@sharavistatours.com">info@sharavistatours.com</a>
                  </li>
                </ul>
              </div>
            </aside>
            <aside className="col-sm-3 widget_text">
              <h3 className="widget-title">INFORMATION</h3>
              <ul className="menu list-arrow">
                <li><a href="#">Press Centre</a></li>
                <li><a href="#">Travel News</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </aside>
            <aside className="col-sm-3 widget_text">
              <h3 className="widget-title">Our Menu</h3>
              <ul className="menu list-arrow">
                <li><a href="#">About us</a></li>
                <li><a href="#">Career</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </aside>
            <aside className="col-sm-3 custom-instagram widget_text">
              <h3 className="widget-title">Instagram</h3>
              <ul>
                <li><img src="/assets/img/instagram/1.jpg" alt="Instagram" /></li>
                <li><img src="/assets/img/instagram/2.jpg" alt="Instagram" /></li>
                <li><img src="/assets/img/instagram/3.jpg" alt="Instagram" /></li>
                <li><img src="/assets/img/instagram/4.jpg" alt="Instagram" /></li>
                <li><img src="/assets/img/instagram/5.jpg" alt="Instagram" /></li>
                <li><img src="/assets/img/instagram/6.jpg" alt="Instagram" /></li>
              </ul>
            </aside>
          </div>
        </div>
      </div>
      <div className="container wrapper-copyright">
        <div className="row">
          <div className="col-sm-6">
            <div><p>Copyright © 2024 Sharavista Tours. All Rights Reserved.</p></div>
          </div>
          <div className="col-sm-6">
            <aside id="text-5" className="widget_text">
              <div className="textwidget">
                <ul className="footer_menu">
                  <li><a href="/terms">Terms of Use</a></li>
                  <li>|</li>
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li>|</li>
                  <li><a href="https://twitter.com/sharavista" target="blank"><i className="fa fa-twitter"></i></a></li>
                  <li><a href="https://www.facebook.com/people/Sharavista-Tours/61582686912041/#" target="blank"><i className="fa fa-facebook"></i></a></li>
                  <li><a href="https://www.instagram.com/sharavistatours/" target="blank"><i className="fa fa-instagram"></i></a></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}