import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

export default function Tours() {
  // Initialize template JS plugins after component mounts
  useEffect(() => {
    // Reinitialize any jQuery plugins if needed
    if (window.$ && window.$.fn.tooltip) {
      $('[data-toggle="tooltip"]').tooltip()
    }
  }, [])

   const { loading, packages } = useSelector((state) => state.packages);

   console.warn("Packages",packages)

  return (
    <div className="archive travel_tour travel_tour-page">
      {/* Breadcrumb */}
      <div className="top_site_main" style={{backgroundImage: 'url(/assets/img/banner/top-heading.jpg)'}}>
        <div className="banner-wrapper container article_heading">
          <div className="breadcrumbs-wrapper">
            <ul className="phys-breadcrumb">
              <li><Link to="/" className="home">Home</Link></li>
              <li>Tours</li>
            </ul>
          </div>
          <h1 className="heading_primary">Tours</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-area">
        <div className="container">
          <div className="row">
            {/* Tour Grid */}
            <div className="site-main col-sm-9 alignright">
              <ul className="tours products wrapper-tours-slider">
                {/* Tour 1 */}
                <li className="item-tour col-md-4 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/1">
                        <span className="price">$93.00</span>
                        <img 
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
                <li className="item-tour col-md-4 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/2">
                        <span className="price">
                          <del>$87.00</del>
                          <ins>$82.00</ins>
                        </span>
                        <span className="onsale">Sale!</span>
                        <img 
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
                <li className="item-tour col-md-4 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/3">
                        <span className="price">$64.00</span>
                        <img 
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
                <li className="item-tour col-md-4 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/4">
                        <span className="price">$434.00</span>
                        <img 
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
                <li className="item-tour col-md-4 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/5">
                        <span className="price">$345.00</span>
                        <img 
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
                <li className="item-tour col-md-4 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/6">
                        <span className="price">$78.00</span>
                        <img 
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
                <li className="item-tour col-md-4 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/7">
                        <span className="price">$104.00</span>
                        <img 
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
                <li className="item-tour col-md-4 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/8">
                        <span className="price">$99.00</span>
                        <img 
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

                {/* Tour 9 */}
                <li className="item-tour col-md-4 col-sm-6 product">
                  <div className="item_border item-product">
                    <div className="post_images">
                      <Link to="/tours/9">
                        <span className="price">$610.00</span>
                        <img 
                          src="/assets/img/tour/430x305/tour-9.jpg" 
                          alt="Banff to Anchorage" 
                          title="Banff to Anchorage"
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
                          <Link to="/tours/9" rel="bookmark">Banff to Anchorage</Link>
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
                      <Link to="/tours/9" className="button product_type_tour_phys add_to_cart_button">
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

            {/* Sidebar */}
            <div className="widget-area align-left col-sm-3">
              {/* Search Form */}
              <div className="search_tour">
                <div className="form-block block-after-indent">
                  <h3 className="form-block_title">Search Tour</h3>
                  <div className="form-block__description">Find your dream tour today!</div>
                  <form method="get" action="#">
                    <input type="hidden" name="tour_search" value="1" />
                    <input 
                      type="text" 
                      placeholder="Search Tour" 
                      name="name_tour" 
                      className="mb-3 w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <select 
                      name="tourtax[tour_phys]" 
                      className="mb-3 w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="0">Tour Type</option>
                      <option value="escorted-tour">Escorted Tour</option>
                      <option value="rail-tour">Rail Tour</option>
                      <option value="river-cruise">River Cruise</option>
                      <option value="tour-cruise">Tour &amp; Cruise</option>
                      <option value="wildlife">Wildlife</option>
                    </select>
                    <select 
                      name="tourtax[pa_destination]" 
                      className="mb-3 w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="0">Destination</option>
                      <option value="brazil">Brazil</option>
                      <option value="canada">Canada</option>
                      <option value="cuba">Cuba</option>
                      <option value="italy">Italy</option>
                      <option value="philippines">Philippines</option>
                      <option value="usa">USA</option>
                    </select>
                    <select 
                      name="tourtax[pa_month]" 
                      className="mb-3 w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="0">Month</option>
                      {['January','February','March','April','May','June','July','August','September','October','November','December'].map((month) => (
                        <option key={month} value={month.toLowerCase()}>{month}</option>
                      ))}
                    </select>
                    <button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition"
                    >
                      Find Tours
                    </button>
                  </form>
                </div>
              </div>

              {/* Special Tours Widget */}
              <aside className="widget widget_travel_tour">
                <div className="wrapper-special-tours">
                  <div className="inner-special-tours">
                    <Link to="/tours/1">
                      <img 
                        src="/assets/img/tour/430x305/tour-1.jpg" 
                        alt="Discover Brazil" 
                        title="Discover Brazil"
                        onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                      />
                    </Link>
                    <div className="item_rating">
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star-o"></i>
                    </div>
                    <div className="post_title">
                      <h3>
                        <Link to="/tours/1" rel="bookmark">Discover Brazil</Link>
                      </h3>
                    </div>
                    <div className="item_price">
                      <span className="price">$93.00</span>
                    </div>
                  </div>
                  
                  <div className="inner-special-tours">
                    <Link to="/tours/2">
                      <span className="onsale">Sale!</span>
                      <img 
                        src="/assets/img/tour/430x305/tour-2.jpg" 
                        alt="Kiwiana Panorama" 
                        title="Kiwiana Panorama"
                        onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                      />
                    </Link>
                    <div className="item_rating">
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star-o"></i>
                      <i className="fa fa-star-o"></i>
                    </div>
                    <div className="post_title">
                      <h3>
                        <Link to="/tours/2" rel="bookmark">Kiwiana Panorama</Link>
                      </h3>
                    </div>
                    <div className="item_price">
                      <span className="price">
                        <del>$87.00</del>
                        <ins>$82.00</ins>
                      </span>
                    </div>
                  </div>
                  
                  <div className="inner-special-tours">
                    <Link to="/tours/3">
                      <img 
                        src="/assets/img/tour/430x305/tour-3.jpg" 
                        alt="Anchorage to Quito" 
                        title="Anchorage to Quito"
                        onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                      />
                    </Link>
                    <div className="item_rating">
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star-o"></i>
                      <i className="fa fa-star-o"></i>
                      <i className="fa fa-star-o"></i>
                    </div>
                    <div className="post_title">
                      <h3>
                        <Link to="/tours/3" rel="bookmark">Anchorage to Quito</Link>
                      </h3>
                    </div>
                    <div className="item_price">
                      <span className="price">$64.00</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}