import { useEffect } from 'react'

export default function Home() {
  // Initialize template JS plugins after component mounts
  useEffect(() => {
    // Reinitialize Owl Carousel for destination section
    if (window.$ && window.$.fn.owlCarousel) {
      $('.tours-type-slider').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        responsive: {
          0: { items: 1 },
          480: { items: 2 },
          768: { items: 2 },
          992: { items: 3 },
          1200: { items: 4 }
        }
      });
      
      $('.wrapper-tours-type-slider').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        responsive: {
          0: { items: 1 },
          480: { items: 2 },
          768: { items: 3 },
          992: { items: 4 },
          1200: { items: 5 }
        }
      });
    }
  }, []);

  return (
    <div className="home-content" role="main">
      {/* Hero Video Slider */}
      <div className="wrapper-bg-video">
        <video poster="/assets/img/video_slider.jpg" playsInline autoPlay muted loop>
          <source src="https://physcode.com/video/330149744.mp4" type="video/mp4" />
        </video>
        <div className="content-slider">
          <p>Find your special tour today</p>
          <h2>With Sharavista Tours</h2>
          <p><a href="/tours" className="btn btn-slider">VIEW TOURS</a></p>
        </div>
      </div>

      {/* Search Form */}
      <div className="slider-tour-booking">
        <div className="container">
          <div className="travel-booking-search hotel-booking-search travel-booking-style_1">
            <form name="hb-search-form" action="/tours" id="tourBookingForm">
              <ul className="hb-form-table">
                <li className="hb-form-field">
                  <div className="hb-form-field-input hb_input_field">
                    <input type="text" name="name_tour" placeholder="Tour name" />
                  </div>
                </li>
                <li className="hb-form-field">
                  <div className="hb-form-field-input hb_input_field">
                    <select name="tourtax[tour_phys]">
                      <option value="0">Tour Type</option>
                      <option value="escorted-tour">Escorted Tour</option>
                      <option value="rail-tour">Rail Tour</option>
                      <option value="river-cruise">River Cruise</option>
                      <option value="tour-cruise">Tour & Cruise</option>
                      <option value="wildlife">Wildlife</option>
                    </select>
                  </div>
                </li>
                <li className="hb-form-field">
                  <div className="hb-form-field-input hb_input_field">
                    <select name="tourtax[pa_destination]">
                      <option value="0">Destination</option>
                      <option value="brazil">Brazil</option>
                      <option value="canada">Canada</option>
                      <option value="cuba">Cuba</option>
                      <option value="italy">Italy</option>
                      <option value="philippines">Philippines</option>
                      <option value="usa">USA</option>
                    </select>
                  </div>
                </li>
                <li className="hb-form-field">
                  <div className="hb-form-field-input hb_input_field">
                    <select name="tourtax[pa_month]">
                      <option value="0">Month</option>
                      {['January','February','March','April','May','June','July','August','September','October','November','December'].map((month) => (
                        <option key={month} value={month.toLowerCase()}>{month}</option>
                      ))}
                    </select>
                  </div>
                </li>
                <li className="hb-submit">
                  <button type="submit">Search Tours</button>
                </li>
              </ul>
              <input type="hidden" name="lang" value="" />
            </form>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container two-column-respon mg-top-6x mg-bt-6x">
        <div className="row">
          <div className="col-sm-12 mg-btn-6x">
            <div className="shortcode_title title-center title-decoration-bottom-center">
              <h3 className="title_primary">WHY CHOOSE US?</h3>
              <span className="line_after_title"></span>
            </div>
          </div>
        </div>
        <div className="row">
          {[
            { icon: 'flaticon-transport-6', title: 'Diverse Destinations', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.' },
            { icon: 'flaticon-sand', title: 'Value for Money', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.' },
            { icon: 'flaticon-travel-2', title: 'Beautiful Places', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.' },
            { icon: 'flaticon-travelling', title: 'Passionate Travel', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.' }
          ].map((item, index) => (
            <div key={index} className="wpb_column col-sm-3">
              <div className="widget-icon-box widget-icon-box-base iconbox-center">
                <div className="boxes-icon circle" style={{fontSize:'30px',width:'80px', height:'80px',lineHeight:'80px'}}>
                  <span className="inner-icon"><i className={`vc_icon_element-icon ${item.icon}`}></i></span>
                </div>
                <div className="content-inner">
                  <div className="sc-heading article_heading">
                    <h4 className="heading__primary">{item.title}</h4>
                  </div>
                  <div className="desc-icon-box">
                    <div>{item.desc}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Popular Tours */}
      <div className="padding-top-6x padding-bottom-6x section-background" style={{backgroundImage: 'url(/assets/img/home/bg-popular.jpg)'}}>
        <div className="container">
          <div className="shortcode_title text-white title-center title-decoration-bottom-center">
            <div className="title_subtitle">Take a Look at Our</div>
            <h3 className="title_primary">MOST POPULAR TOURS</h3>
            <span className="line_after_title" style={{color:'#ffffff'}}></span>
          </div>
          <div className="row wrapper-tours-slider">
            <div 
              className="tours-type-slider list_content" 
              data-dots="true" 
              data-nav="true" 
              data-responsive='{"0":{"items":1}, "480":{"items":2}, "768":{"items":2}, "992":{"items":3}, "1200":{"items":4}}'
            >
              {[
                { id: 1, title: 'Kiwiana Panorama', price: 87.00, salePrice: 82.00, image: '/assets/img/tour/tour-1.jpg', sale: true },
                { id: 2, title: 'Camping Americas West', price: 82.00, image: '/assets/img/tour/tour-2.jpg' },
                { id: 3, title: 'Anchorage to Santiago', price: 89.00, image: '/assets/img/tour/tour-3.jpg' },
                { id: 4, title: 'Anchorage to Ushuaia', price: 90.00, image: '/assets/img/tour/tour-4.jpg' },
                { id: 5, title: 'Discover Brazil', price: 94.00, image: '/assets/img/tour/tour-5.jpg' },
                { id: 6, title: 'Cuzco to Anchorage', price: 91.00, image: '/assets/img/tour/tour-6.jpg' }
              ].map((tour) => (
                <div key={tour.id} className="item-tour">
                  <div className="item_border">
                    <div className="item_content">
                      <div className="post_images">
                        <a href={`/tours/${tour.id}`} className="travel_tour-LoopProduct-link">
                          {tour.sale ? (
                            <>
                              <span className="price">
                                <del><span className="travel_tour-Price-amount amount">${tour.price.toFixed(2)}</span></del>
                                <ins><span className="travel_tour-Price-amount amount">${tour.salePrice.toFixed(2)}</span></ins>
                              </span>
                              <span className="onsale">Sale!</span>
                            </>
                          ) : (
                            <span className="price">
                              <span className="travel_tour-Price-amount amount">${tour.price.toFixed(2)}</span>
                            </span>
                          )}
                          <img src={tour.image} alt={tour.title} title={tour.title} />
                          <div className="group-icon">
                            <a href="#" data-toggle="tooltip" data-placement="top" title="River Cruise" className="frist">
                              <i className="flaticon-transport-2"></i>
                            </a>
                            <a href="#" data-toggle="tooltip" data-placement="top" title="Wildlife">
                              <i className="flaticon-island"></i>
                            </a>
                          </div>
                        </a>
                      </div>
                      <div className="wrapper_content">
                        <div className="post_title">
                          <h4><a href={`/tours/${tour.id}`} rel="bookmark">{tour.title}</a></h4>
                        </div>
                        <span className="post_date">5 DAYS 4 NIGHTS</span>
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                      </div>
                      <a href={`/tours/${tour.id}`} className="read_more_button">
                        VIEW MORE <i className="fa fa-long-arrow-right"></i>
                      </a>
                      <div className="clear"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Destination Carousel */}
      <div className="section-white padding-top-6x padding-bottom-6x tours-type">
        <div className="container">
          <div className="shortcode_title title-center title-decoration-bottom-center">
            <div className="title_subtitle">Find a Tour by</div>
            <h3 className="title_primary">DESTINATION</h3>
            <span className="line_after_title"></span>
          </div>
          <div className="wrapper-tours-slider wrapper-tours-type-slider">
            <div 
              className="tours-type-slider" 
              data-dots="true" 
              data-nav="true" 
              data-responsive='{"0":{"items":1}, "480":{"items":2}, "768":{"items":3}, "992":{"items":4}, "1200":{"items":5}}'
            >
              {[
                { name: 'Brazil', image: '/assets/img/city/brazil.jpg' },
                { name: 'Philippines', image: '/assets/img/city/philippines.jpg' },
                { name: 'Italy', image: '/assets/img/city/italy.jpg' },
                { name: 'USA', image: '/assets/img/city/usa.jpg' },
                { name: 'Canada', image: '/assets/img/city/canada.jpg' },
                { name: 'Cuba', image: '/assets/img/city/cuba.jpg' }
              ].map((dest, index) => (
                <div key={index} className="tours_type_item">
                  <a href="/tours" className="tours-type__item__image">
                    <img src={dest.image} alt={dest.name} />
                  </a>
                  <div className="content-item">
                    <div className="item__title">{dest.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center Achievements */}
      <div className="padding-top-6x padding-bottom-6x bg__shadow section-background" style={{backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)'}}>
        <div className="container">
          <div className="shortcode_title text-white title-center title-decoration-bottom-center">
            <div className="title_subtitle">Some statistics about Sharavista Tours</div>
            <h3 className="title_primary">CENTER ACHIEVEMENTS</h3>
            <span className="line_after_title" style={{color:'#ffffff'}}></span>
          </div>
          <div className="row">
            {[
              { value: '94,532', label: 'Customers', icon: 'flaticon-airplane' },
              { value: '1,021', label: 'Destinations', icon: 'flaticon-island' },
              { value: '20,096', label: 'Tours', icon: 'flaticon-globe' },
              { value: '12', label: 'Tour types', icon: 'flaticon-people' }
            ].map((stat, index) => (
              <div key={index} className="col-sm-3">
                <div className="stats_counter text-center text-white">
                  <div className="wrapper-icon">
                    <i className={stat.icon}></i>
                  </div>
                  <div className="stats_counter_number">{stat.value}</div>
                  <div className="stats_counter_title">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deals and Discounts */}
      <div className="section-white padding-top-6x padding-bottom-6x">
        <div className="container">
          <div className="shortcode_title title-center title-decoration-bottom-center">
            <h3 className="title_primary">DEALS AND DISCOUNTS</h3>
            <span className="line_after_title"></span>
          </div>
          <div className="row wrapper-tours-slider">
            <div 
              className="tours-type-slider list_content" 
              data-dots="true" 
              data-nav="true" 
              data-responsive='{"0":{"items":1}, "480":{"items":2}, "768":{"items":3}, "992":{"items":3}, "1200":{"items":3}}'
            >
              {[
                { id: 1, title: 'Anchorage to Santiago', price: 89.00, image: '/assets/img/tour-3.jpg' },
                { id: 2, title: 'Anchorage to Ushuaia', price: 90.00, image: '/assets/img/tour-4.jpg' },
                { id: 3, title: 'Discover Brazil', price: 94.00, image: '/assets/img/tour-5.jpg' },
                { id: 4, title: 'Kiwiana Panorama', price: 87.00, salePrice: 82.00, image: '/assets/img/tour-1.jpg', sale: true }
              ].map((deal) => (
                <div key={deal.id} className="item-tour">
                  <div className="item_border">
                    <div className="item_content">
                      <div className="post_images">
                        <a href={`/tours/${deal.id}`} className="travel_tour-LoopProduct-link">
                          {deal.sale ? (
                            <>
                              <span className="price">
                                <del><span className="travel_tour-Price-amount amount">${deal.price.toFixed(2)}</span></del>
                                <ins><span className="travel_tour-Price-amount amount">${deal.salePrice.toFixed(2)}</span></ins>
                              </span>
                              <span className="onsale">Sale!</span>
                            </>
                          ) : (
                            <span className="price">
                              <span className="travel_tour-Price-amount amount">${deal.price.toFixed(2)}</span>
                            </span>
                          )}
                          <img src={deal.image} alt={deal.title} title={deal.title} />
                          <div className="group-icon">
                            <a href="#" data-toggle="tooltip" data-placement="top" title="River Cruise" className="frist">
                              <i className="flaticon-transport-2"></i>
                            </a>
                            <a href="#" data-toggle="tooltip" data-placement="top" title="Wildlife">
                              <i className="flaticon-island"></i>
                            </a>
                          </div>
                        </a>
                      </div>
                      <div className="wrapper_content">
                        <div className="post_title">
                          <h4><a href={`/tours/${deal.id}`} rel="bookmark">{deal.title}</a></h4>
                        </div>
                        <span className="post_date">5 DAYS 4 NIGHTS</span>
                        <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
                      </div>
                    </div>
                    <div className="read_more">
                      <div className="item_rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                      </div>
                      <a href={`/tours/${deal.id}`} className="read_more_button">
                        VIEW MORE <i className="fa fa-long-arrow-right"></i>
                      </a>
                      <div className="clear"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Special Offer */}
      <div className="bg__shadow padding-top-6x padding-bottom-6x section-background" style={{backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)'}}>
        <div className="container">
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
              <div className="discounts-tour">
                <h3 style={{color:'#ffffff'}} className="discounts-title"> 
                  Special Tour in April, Discover Australia for 100 customers with
                  <span> discount 50%</span>
                </h3>
                <span className="line" style={{color:'#ffffff'}}></span>
                <p style={{color:'#ffffff'}}>It’s limited seating! Hurry up</p>
                <div className="row centered text-center" id="myCounter"></div>
                <div className="col-sm-12 text-center padding-top-2x">
                  <a href="/tours/special" className="icon-btn">
                    <i className="flaticon-airplane-4"></i> Get tour 
                  </a>
                </div>
              </div>
            </div>
            <div className="col-sm-2"></div>
          </div>
        </div>
      </div>

      {/* Reviews & Latest Posts */}
      <div className="section-white padding-top-6x padding-bottom-6x">
        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <div className="shortcode_title title-center title-decoration-bottom-center">
                <h2 className="title_primary">Tours Reviews</h2>
                <span className="line_after_title"></span>
              </div>
              <div className="shortcode-tour-reviews wrapper-tours-slider">
                <div 
                  className="tours-type-slider" 
                  data-autoplay="true" 
                  data-dots="true" 
                  data-nav="false" 
                  data-responsive='{"0":{"items":1}, "480":{"items":1}, "768":{"items":1}, "992":{"items":1}, "1200":{"items":1}}'
                >
                  {[
                    { name: 'Jessica', tour: 'Canadian Rockies', comment: 'The sightseeing and activities were better than we even thought! I still can’t believe we did so much in such a short time' },
                    { name: 'Michael', tour: 'Maasai Mara Safari', comment: 'Absolutely amazing safari experience! Saw all the Big Five and the guides were incredibly knowledgeable.' },
                    { name: 'Sarah', tour: 'Diani Beach Paradise', comment: 'Our family beach getaway was perfect. The kids loved the activities and we adults enjoyed the relaxation.' }
                  ].map((review, index) => (
                    <div key={index} className="tour-reviews-item">
                      <div className="reviews-item-info">
                        <img alt={review.name} src="/assets/img/avata.jpg" className="avatar avatar-95 photo" height="90" width="90" />
                        <div className="reviews-item-info-name">{review.name}</div>
                        <div className="reviews-item-rating">
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                          <i className="fa fa-star"></i>
                        </div>
                      </div>
                      <div className="reviews-item-content">
                        <h3 className="reviews-item-title">
                          <a href="#">{review.tour}</a>
                        </h3>
                        <div className="reviews-item-description">{review.comment}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-sm-8">
              <div className="shortcode_title title-center title-decoration-bottom-center">
                <h2 className="title_primary">Latest Post</h2>
                <span className="line_after_title"></span>
              </div>
              <div className="row">
                <div className="post_list_content_unit col-sm-6">
                  <div className="feature-image">
                    <a href="#" className="entry-thumbnail">
                      <img width="370" height="260" src="/assets/img/blog/201H.jpg" alt="Love advice from experts" />
                    </a>
                  </div>
                  <div className="post-list-content">
                    <div className="post_list_inner_content_unit">
                      <h3 className="post_list_title">
                        <a href="/blog/single" rel="bookmark">Love advice from experts</a>
                      </h3>
                      <div className="wrapper-meta">
                        <div className="date-time">September 6, 2016</div>
                        <div className="post_list_cats">
                          <a href="#" rel="category tag">Travel Tips</a>
                        </div>
                      </div>
                      <div className="post_list_item_excerpt">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
                    </div>
                  </div>
                </div>
                <div className="post_list_content_unit col-sm-6">
                  <div className="feature-image">
                    <a href="#" className="entry-thumbnail">
                      <img width="370" height="260" src="/assets/img/blog/86H.jpg" alt="The perfect summer body" />
                    </a>
                  </div>
                  <div className="post-list-content">
                    <div className="post_list_inner_content_unit">
                      <h3 className="post_list_title">
                        <a href="/blog/single" rel="bookmark">The perfect summer body</a>
                      </h3>
                      <div className="wrapper-meta">
                        <div className="date-time">September 6, 2016</div>
                        <div className="post_list_cats">
                          <a href="#" rel="category tag">Health</a>
                        </div>
                      </div>
                      <div className="post_list_item_excerpt">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}