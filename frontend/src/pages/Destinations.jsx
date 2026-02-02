import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Destinations() {
  // Initialize template JS plugins after component mounts
  useEffect(() => {
    if (window.$ && window.$.fn.tooltip) {
      $('[data-toggle="tooltip"]').tooltip()
    }
  }, [])

  return (
    <div className="archive travel_tour travel_tour-page">
      {/* Hero Section */}
      <div 
        className="top_site_main" 
        style={{ 
          color: 'rgb(255, 255, 255)', 
          backgroundColor: 'rgb(0, 0, 0)', 
          backgroundImage: 'url(/assets/img/destinations/brazil.jpg)' 
        }}
      >
        <div className="banner-wrapper-destination container article_heading text-center">
          <h1 className="heading_primary">Tourist Brazil</h1>
          <div className="desc">
            <p>Discover the Brazil with our special tours</p>
          </div>
          <div className="breadcrumbs-wrapper">
            <ul className="phys-breadcrumb">
              <li><Link to="/" className="home">Home</Link></li>
              <li><Link to="/tours" title="Tours">Tours</Link></li>
              <li>Brazil</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-area">
        <div className="container">
          <div className="row">
            <div className="site-main col-sm-12 full-width">
              <ul className="tours products wrapper-tours-slider">
                {/* Tour 1 */}
                <li className="item-tour col-md-3 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/1">
                        <span className="price">$93.00</span>
                        <img 
                          width="430" 
                          height="305" 
                          src="/assets/img/tour/430x305/tour-1.jpg" 
                          alt="Discover Brazil" 
                          title="Discover Brazil"
                          onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                        />
                      </Link>
                      <div className="group-icon">
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist">
                          <i className="flaticon-airplane-4"></i>
                        </a>
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="Rail Tour">
                          <i className="flaticon-cart-1"></i>
                        </a>
                      </div>
                    </div>
                    <div className="wrapper_content">
                      <div className="post_title">
                        <h4>
                          <Link to="/tours/1" rel="bookmark">Discover Brazil</Link>
                        </h4>
                      </div>
                      <span className="post_date">5 DAYS 4 NIGHTS</span>
                      <div className="description">
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                      </div>
                      <Link to="/tours/1" className="button product_type_tour_phys add_to_cart_button">
                        Read more
                      </Link>
                    </div>
                  </div>
                </li>

                {/* Tour 2 - Sale */}
                <li className="item-tour col-md-3 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/2">
                        <span className="price">
                          <del>$87.00</del>
                          <ins>$82.00</ins>
                        </span>
                        <span className="onsale">Sale!</span>
                        <img 
                          width="430" 
                          height="305" 
                          src="/assets/img/tour/430x305/tour-2.jpg" 
                          alt="Kiwiana Panorama" 
                          title="Kiwiana Panorama"
                          onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                        />
                      </Link>
                      <div className="group-icon">
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="River Cruise" className="frist">
                          <i className="flaticon-transport-2"></i>
                        </a>
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="Wildlife">
                          <i className="flaticon-island"></i>
                        </a>
                      </div>
                    </div>
                    <div className="wrapper_content">
                      <div className="post_title">
                        <h4>
                          <Link to="/tours/2" rel="bookmark">Kiwiana Panorama</Link>
                        </h4>
                      </div>
                      <span className="post_date">5 DAYS 4 NIGHTS</span>
                      <div className="description">
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                      </div>
                      <Link to="/tours/2" className="button product_type_tour_phys add_to_cart_button">
                        Read more
                      </Link>
                    </div>
                  </div>
                </li>

                {/* Tour 3 */}
                <li className="item-tour col-md-3 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/3">
                        <span className="price">$64.00</span>
                        <img 
                          width="430" 
                          height="305" 
                          src="/assets/img/tour/430x305/tour-3.jpg" 
                          alt="Anchorage to Quito" 
                          title="Anchorage to Quito"
                          onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                        />
                      </Link>
                      <div className="group-icon">
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist">
                          <i className="flaticon-airplane-4"></i>
                        </a>
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="River Cruise">
                          <i className="flaticon-transport-2"></i>
                        </a>
                      </div>
                    </div>
                    <div className="wrapper_content">
                      <div className="post_title">
                        <h4>
                          <Link to="/tours/3" rel="bookmark">Anchorage to Quito</Link>
                        </h4>
                      </div>
                      <span className="post_date">5 DAYS 4 NIGHTS</span>
                      <div className="description">
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                      </div>
                      <Link to="/tours/3" className="button product_type_tour_phys add_to_cart_button">
                        Read more
                      </Link>
                    </div>
                  </div>
                </li>

                {/* Tour 4 */}
                <li className="item-tour col-md-3 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/4">
                        <span className="price">$434.00</span>
                        <img 
                          width="430" 
                          height="305" 
                          src="/assets/img/tour/430x305/tour-4.jpg" 
                          alt="Anchorage to La Paz" 
                          title="Anchorage to La Paz"
                          onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                        />
                      </Link>
                      <div className="group-icon">
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist">
                          <i className="flaticon-airplane-4"></i>
                        </a>
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="River Cruise">
                          <i className="flaticon-transport-2"></i>
                        </a>
                      </div>
                    </div>
                    <div className="wrapper_content">
                      <div className="post_title">
                        <h4>
                          <Link to="/tours/4" rel="bookmark">Anchorage to La Paz</Link>
                        </h4>
                      </div>
                      <span className="post_date">5 DAYS 4 NIGHTS</span>
                      <div className="description">
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                      </div>
                      <Link to="/tours/4" className="button product_type_tour_phys add_to_cart_button">
                        Read more
                      </Link>
                    </div>
                  </div>
                </li>

                {/* Tour 5 */}
                <li className="item-tour col-md-3 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/5">
                        <span className="price">$345.00</span>
                        <img 
                          width="430" 
                          height="305" 
                          src="/assets/img/tour/430x305/tour-5.jpg" 
                          alt="Cuzco to Anchorage" 
                          title="Cuzco to Anchorage"
                          onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                        />
                      </Link>
                      <div className="group-icon">
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist">
                          <i className="flaticon-airplane-4"></i>
                        </a>
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="River Cruise">
                          <i className="flaticon-transport-2"></i>
                        </a>
                      </div>
                    </div>
                    <div className="wrapper_content">
                      <div className="post_title">
                        <h4>
                          <Link to="/tours/5" rel="bookmark">Cuzco to Anchorage</Link>
                        </h4>
                      </div>
                      <span className="post_date">5 DAYS 4 NIGHTS</span>
                      <div className="description">
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                      </div>
                      <Link to="/tours/5" className="button product_type_tour_phys add_to_cart_button">
                        Read more
                      </Link>
                    </div>
                  </div>
                </li>

                {/* Tour 6 */}
                <li className="item-tour col-md-3 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/6">
                        <span className="price">$78.00</span>
                        <img 
                          width="430" 
                          height="305" 
                          src="/assets/img/tour/430x305/tour-6.jpg" 
                          alt="Anchorage to Ushuaia" 
                          title="Anchorage to Ushuaia"
                          onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                        />
                      </Link>
                      <div className="group-icon">
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist">
                          <i className="flaticon-airplane-4"></i>
                        </a>
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="River Cruise">
                          <i className="flaticon-transport-2"></i>
                        </a>
                      </div>
                    </div>
                    <div className="wrapper_content">
                      <div className="post_title">
                        <h4>
                          <Link to="/tours/6" rel="bookmark">Anchorage to Ushuaia</Link>
                        </h4>
                      </div>
                      <span className="post_date">5 DAYS 4 NIGHTS</span>
                      <div className="description">
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                      </div>
                      <Link to="/tours/6" className="button product_type_tour_phys add_to_cart_button">
                        Read more
                      </Link>
                    </div>
                  </div>
                </li>

                {/* Tour 7 */}
                <li className="item-tour col-md-3 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/7">
                        <span className="price">$104.00</span>
                        <img 
                          width="430" 
                          height="305" 
                          src="/assets/img/tour/430x305/tour-7.jpg" 
                          alt="Anchorage to Santiago" 
                          title="Anchorage to Santiago"
                          onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                        />
                      </Link>
                      <div className="group-icon">
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist">
                          <i className="flaticon-airplane-4"></i>
                        </a>
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="River Cruise">
                          <i className="flaticon-transport-2"></i>
                        </a>
                      </div>
                    </div>
                    <div className="wrapper_content">
                      <div className="post_title">
                        <h4>
                          <Link to="/tours/7" rel="bookmark">Anchorage to Santiago</Link>
                        </h4>
                      </div>
                      <span className="post_date">5 DAYS 4 NIGHTS</span>
                      <div className="description">
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                      </div>
                      <Link to="/tours/7" className="button product_type_tour_phys add_to_cart_button">
                        Read more
                      </Link>
                    </div>
                  </div>
                </li>

                {/* Tour 8 */}
                <li className="item-tour col-md-3 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/8">
                        <span className="price">$99.00</span>
                        <img 
                          width="430" 
                          height="305" 
                          src="/assets/img/tour/430x305/tour-8.jpg" 
                          alt="LA Explorer" 
                          title="LA Explorer"
                          onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                        />
                      </Link>
                      <div className="group-icon">
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist">
                          <i className="flaticon-airplane-4"></i>
                        </a>
                        <a href="/tours" data-toggle="tooltip" data-placement="top" title="River Cruise">
                          <i className="flaticon-transport-2"></i>
                        </a>
                      </div>
                    </div>
                    <div className="wrapper_content">
                      <div className="post_title">
                        <h4>
                          <Link to="/tours/8" rel="bookmark">LA Explorer</Link>
                        </h4>
                      </div>
                      <span className="post_date">5 DAYS 4 NIGHTS</span>
                      <div className="description">
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star-o"></i>
                      </div>
                      <Link to="/tours/8" className="button product_type_tour_phys add_to_cart_button">
                        Read more
                      </Link>
                    </div>
                  </div>
                </li>
              </ul>

              {/* Pagination */}
              <div className="navigation paging-navigation" role="navigation">
                <ul className="page-numbers">
                  <li><span className="page-numbers current">1</span></li>
                  <li><a className="page-numbers" href="#">2</a></li>
                  <li><a className="next page-numbers" href="#"><i className="fa fa-long-arrow-right"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}