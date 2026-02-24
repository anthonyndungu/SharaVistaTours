// import { useEffect, useState } from 'react'
// import { useParams, Link } from 'react-router-dom'

// export default function SingleTour() {
//   const { tourId } = useParams()
//   const [activeTab, setActiveTab] = useState('description')
//   const [bookingForm, setBookingForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     dateBook: '',
//     adults: 1,
//     children: 0
//   })
//   const [reviewForm, setReviewForm] = useState({
//     name: '',
//     email: '',
//     rating: 5,
//     comment: ''
//   })

//   // Mock tour data - replace with API call in production
//   const tourData = {
//     id: tourId,
//     title: 'Discover Brazil',
//     code: 'LMJUYH',
//     duration: '5 DAYS 4 NIGHTS',
//     categories: ['Escorted Tour', 'Rail Tour'],
//     price: 93.00,
//     priceChild: 65.10,
//     images: [
//       '/assets/img/tour/tour-1.jpg',
//       '/assets/img/tour/tour-2.jpg',
//       '/assets/img/tour/tour-3.jpg',
//       '/assets/img/tour/tour-4.jpg',
//       '/assets/img/tour/tour-5.jpg',
//       '/assets/img/tour/tour-6.jpg'
//     ],
//     description: 'Mattis interdum nunc massa. Velit. Nonummy penatibus luctus. Aliquam. Massa aptent senectus elementum taciti.Id sodales morbi felis eu mus auctor ullamcorper. Litora. In nostra tempus, habitant. Nam tristique.',
//     details: 'Felis venenatis metus placerat taciti malesuada ultricies bibendum nunc hymenaeos orci erat mollis pretium ligula ligulamus pellentesque urna. Sagittis bibendum justo congue facilisi. Aliquam potenti sagittis etiam facilisis vehicula. Id.',
//     departureLocation: 'San Francisco International Airport',
//     departureTime: 'Please arrive at least 2 hours before the flight.',
//     included: [
//       'Airfare',
//       'Accommodations', 
//       '2 days cruise',
//       'Professional guide'
//     ],
//     notIncluded: [
//       'Entrance fees',
//       'Guide gratuity'
//     ],
//     itinerary: [
//       {
//         day: 1,
//         title: 'Day 1: Departure',
//         description: 'Ornare proin neque tempus cubilia cubilia blandit netus.',
//         activities: [
//           'Pretium vitae tempus sem enim enim.',
//           'Tempus, leo, taciti augue aliquam hendrerit.',
//           'Accumsan pharetra eros justo augue posuere felis elit cras montes fames.',
//           'Vulputate dictumst egestas etiam dictum varius.'
//         ]
//       },
//       {
//         day: 2,
//         title: 'Day 2',
//         description: 'Tortor elementum egestas metus potenti habitasse tempus natoque senectus commodo rutrum quisque fermentum. Nisi velit primis dapibus odio consequat facilisi sollicitudin porta nulla tellus sagittis platea tempor sed parturient convallis consectetuer Vulputate curae; pharetra.'
//       },
//       {
//         day: 3,
//         title: 'Day 3',
//         description: 'Fusce sagittis viverra lorem proin porttitor conubia risus vivamus. Mollis. Luctus curabitur porta nibh penatibus aliquet nec conubia magnis semper, sem feugiat scelerisque molestie. Nibh proin dapibus phasellus lacus. Facilisi.'
//       },
//       {
//         day: 4,
//         title: 'Day 4',
//         description: 'Pretium consequat, facilisis sem in malesuada sodales et ipsum proin eleifend tincidunt, urna morbi metus quisque. Lacinia habitasse ridiculus sapien platea a cursus hendrerit tempor facilisi orci at tempor, senectus.'
//       },
//       {
//         day: 5,
//         title: 'Day 5',
//         description: 'Egestas maecenas hac nullam integer at. Lacinia habitasse ridiculus sapien platea a cursus hendrerit tempor facilisi orci at tempor, senectus.'
//       },
//       {
//         day: 6,
//         title: 'Day 6: Return',
//         description: ''
//       }
//     ],
//     reviews: [
//       {
//         id: 1,
//         author: 'physcode',
//         rating: 4,
//         date: 'January 24, 2017',
//         comment: 'Mattis interdum nunc massa. Velit. Nonummy penatibus luctus'
//       }
//     ],
//     relatedTours: [
//       { id: 1, title: 'Discover Brazil', price: 93.00, duration: '5 DAYS 4 NIGHTS', image: '/assets/img/tour/430x305/tour-1.jpg' },
//       { id: 2, title: 'Kiwiana Panorama', price: 82.00, originalPrice: 87.00, duration: '5 DAYS 4 NIGHTS', image: '/assets/img/tour/430x305/tour-2.jpg', sale: true },
//       { id: 3, title: 'Anchorage to Quito', price: 64.00, duration: '5 DAYS 4 NIGHTS', image: '/assets/img/tour/430x305/tour-3.jpg' }
//     ]
//   }

//   const handleBookingSubmit = (e) => {
//     e.preventDefault()
//     console.log('Booking submitted:', bookingForm)
//     alert('Booking form submitted! In production, this would connect to your backend.')
//   }

//   const handleReviewSubmit = (e) => {
//     e.preventDefault()
//     console.log('Review submitted:', reviewForm)
//     alert('Review submitted! In production, this would connect to your backend.')
//   }

//   const calculateTotalPrice = () => {
//     const adultTotal = bookingForm.adults * tourData.price
//     const childTotal = bookingForm.children * tourData.priceChild
//     return adultTotal + childTotal
//   }

//   // Initialize jQuery plugins after render
//   useEffect(() => {
//     if (window.$ && window.$.fn.swipebox) {
//       $('.swipebox').swipebox()
//     }
//     if (window.$ && window.$.fn.tooltip) {
//       $('[data-toggle="tooltip"]').tooltip()
//     }
//   }, [])

//   return (
//     <div className="single-product travel_tour-page travel_tour">
//       {/* Breadcrumb */}
//       <div className="top_site_main" style={{ backgroundImage: 'url(/assets/img/banner/top-heading.jpg)' }}>
//         <div className="banner-wrapper container article_heading">
//           <div className="breadcrumbs-wrapper">
//             <ul className="phys-breadcrumb">
//               <li><Link to="/" className="home">Home</Link></li>
//               <li><Link to="/blog">Business</Link></li>
//               <li>Love advice from experts</li>
//             </ul>
//           </div>
//           <h2 className="heading_primary">Business</h2>
//         </div>
//       </div>

//       {/* Main Content */}
//       <section className="content-area single-woo-tour">
//         <div className="container">
//           <div className="tb_single_tour product">
//             <div className="top_content_single row">
//               {/* Left Column - Images & Tabs */}
//               <div className="images images_single_left">
//                 <div className="title-single">
//                   <div className="title">
//                     <h1>{tourData.title}</h1>
//                   </div>
//                   <div className="tour_code">
//                     <strong>Code: </strong>{tourData.code}
//                   </div>
//                 </div>
//                 <div className="tour_after_title">
//                   <div className="meta_date">
//                     <span>{tourData.duration}</span>
//                   </div>
//                   <div className="meta_values">
//                     <span>Category:</span>
//                     <div className="value">
//                       {tourData.categories.map((cat, idx) => (
//                         <span key={idx}>
//                           <Link to="/tours" rel="tag">{cat}</Link>
//                           {idx < tourData.categories.length - 1 && ', '}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="tour-share">
//                     <ul className="share-social">
//                       <li>
//                         <a target="_blank" className="facebook" href="#"><i className="fa fa-facebook"></i></a>
//                       </li>
//                       <li>
//                         <a target="_blank" className="twitter" href="#"><i className="fa fa-twitter"></i></a>
//                       </li>
//                       <li>
//                         <a target="_blank" className="pinterest" href="#"><i className="fa fa-pinterest"></i></a>
//                       </li>
//                       <li>
//                         <a target="_blank" className="googleplus" href="#"><i className="fa fa-google"></i></a>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>

//                 {/* Image Gallery */}
//                 <div id="slider" className="flexslider">
//                   <ul className="slides">
//                     {tourData.images.map((image, index) => (
//                       <li key={index}>
//                         <a href={image} className="swipebox" title="">
//                           <img 
//                             width="950" 
//                             height="700" 
//                             src={image} 
//                             alt={tourData.title} 
//                             title={tourData.title}
//                             onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                           />
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div id="carousel" className="flexslider thumbnail_product">
//                   <ul className="slides">
//                     {tourData.images.map((image, index) => (
//                       <li key={index}>
//                         <img 
//                           width="150" 
//                           height="100" 
//                           src={image} 
//                           alt={tourData.title} 
//                           title={tourData.title}
//                           onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                         />
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="clear"></div>

//                 {/* Tabs */}
//                 <div className="single-tour-tabs wc-tabs-wrapper">
//                   <ul className="tabs wc-tabs" role="tablist">
//                     <li 
//                       className={`description_tab ${activeTab === 'description' ? 'active' : ''}`} 
//                       role="presentation"
//                     >
//                       <a 
//                         href="#tab-description" 
//                         role="tab" 
//                         data-toggle="tab"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           setActiveTab('description')
//                         }}
//                       >
//                         Description
//                       </a>
//                     </li>
//                     <li 
//                       className={`itinerary_tab_tab ${activeTab === 'itinerary' ? 'active' : ''}`} 
//                       role="presentation"
//                     >
//                       <a 
//                         href="#tab-itinerary_tab" 
//                         role="tab" 
//                         data-toggle="tab"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           setActiveTab('itinerary')
//                         }}
//                       >
//                         Itinerary
//                       </a>
//                     </li>
//                     <li 
//                       className={`location_tab_tab ${activeTab === 'location' ? 'active' : ''}`} 
//                       role="presentation"
//                     >
//                       <a 
//                         href="#tab-location_tab" 
//                         role="tab" 
//                         data-toggle="tab"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           setActiveTab('location')
//                         }}
//                       >
//                         Location
//                       </a>
//                     </li>
//                     <li 
//                       className={`reviews_tab ${activeTab === 'reviews' ? 'active' : ''}`} 
//                       role="presentation"
//                     >
//                       <a 
//                         href="#tab-reviews" 
//                         role="tab" 
//                         data-toggle="tab"
//                         onClick={(e) => {
//                           e.preventDefault()
//                           setActiveTab('reviews')
//                         }}
//                       >
//                         Reviews ({tourData.reviews.length})
//                       </a>
//                     </li>
//                   </ul>

//                   <div className="tab-content">
//                     {/* Description Tab */}
//                     {activeTab === 'description' && (
//                       <div 
//                         role="tabpanel" 
//                         className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--description panel entry-content wc-tab active" 
//                         id="tab-description"
//                       >
//                         <h2>Product Description</h2>
//                         <p>{tourData.description}</p>
//                         <p>{tourData.details}</p>
                        
//                         <table className="tours-tabs_table">
//                           <tbody>
//                             <tr>
//                               <td><strong>DEPARTURE/RETURN LOCATION</strong></td>
//                               <td>{tourData.departureLocation}</td>
//                             </tr>
//                             <tr>
//                               <td><strong>DEPARTURE TIME</strong></td>
//                               <td>{tourData.departureTime}</td>
//                             </tr>
//                             <tr>
//                               <td><strong>INCLUDED</strong></td>
//                               <td>
//                                 <table>
//                                   <tbody>
//                                     <tr>
//                                       <td><i className="fa fa-check icon-tick icon-tick--on"></i>{tourData.included[0]}</td>
//                                       <td><i className="fa fa-check icon-tick icon-tick--on"></i>{tourData.included[1]}</td>
//                                     </tr>
//                                     <tr>
//                                       <td><i className="fa fa-check icon-tick icon-tick--on"></i>{tourData.included[2]}</td>
//                                       <td><i className="fa fa-check icon-tick icon-tick--on"></i>{tourData.included[3]}</td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td><b>NOT INCLUDED</b></td>
//                               <td>
//                                 <table>
//                                   <tbody>
//                                     <tr>
//                                       <td><i className="fa fa-times icon-tick icon-tick--off"></i>{tourData.notIncluded[0]}</td>
//                                     </tr>
//                                     <tr>
//                                       <td><i className="fa fa-times icon-tick icon-tick--off"></i>{tourData.notIncluded[1]}</td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <p>Ridiculus sociis dui eu vivamus tempor justo diam aliquam. Ipsum nunc purus, pede sed placerat sit habitasse potenti eleifend magna mus sociosqu hymenaeos cras metus mi donec tortor nisi leo dignissim turpis sit torquent.</p>
//                         <p>Potenti mattis ad mollis eleifend Phasellus adipiscing ullamcorper interdum faucibus orci litora ornare aliquam. Ligula feugiat scelerisque. Molestie. Facilisi hac.</p>
//                       </div>
//                     )}

//                     {/* Itinerary Tab */}
//                     {activeTab === 'itinerary' && (
//                       <div 
//                         role="tabpanel" 
//                         className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--itinerary_tab panel entry-content wc-tab" 
//                         id="-itinerary_tab"
//                       >
//                         {tourData.itinerary.map((item, index) => (
//                           <div key={item.day} className="interary-item">
//                             <p><span className="icon-left">{item.day}</span></p>
//                             <div className="item_content">
//                               <h2><strong>{item.title}</strong></h2>
//                               <p>{item.description}</p>
//                               {item.activities && (
//                                 <ul>
//                                   {item.activities.map((activity, idx) => (
//                                     <li key={idx}>{activity}</li>
//                                   ))}
//                                 </ul>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {/* Location Tab */}
//                     {activeTab === 'location' && (
//                       <div 
//                         role="tabpanel" 
//                         className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--location_tab panel entry-content wc-tab" 
//                         id="tab-location_tab"
//                       >
//                         <div className="wrapper-gmap">
//                           <div 
//                             id="googleMapCanvas" 
//                             className="google-map" 
//                             data-lat="50.893577" 
//                             data-long="-1.393483" 
//                             data-address="European Way, Southampton, United Kingdom"
//                           ></div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Reviews Tab */}
//                     {activeTab === 'reviews' && (
//                       <div 
//                         role="tabpanel" 
//                         className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--reviews panel entry-content wc-tab" 
//                         id="tab-reviews"
//                       >
//                         <div id="reviews" className="travel_tour-Reviews">
//                           <div id="comments">
//                             <h2 className="travel_tour-Reviews-title">
//                               {tourData.reviews.length} review for
//                               <span> {tourData.title}</span>
//                             </h2>
//                             <ol className="commentlist">
//                               {tourData.reviews.map((review) => (
//                                 <li 
//                                   key={review.id} 
//                                   itemscope="" 
//                                   itemtype="http://schema.org/Review" 
//                                   className="comment byuser comment-author-physcode bypostauthor even thread-even depth-1"
//                                   id={`li-comment-${review.id}`}
//                                 >
//                                   <div id={`comment-${review.id}`} className="comment_container">
//                                     <img 
//                                       alt="" 
//                                       src="/assets/img/avata.jpg" 
//                                       className="avatar avatar-60 photo" 
//                                       height="60" 
//                                       width="60"
//                                     />
//                                     <div className="comment-text">
//                                       <div className="star-rating" title={`Rated ${review.rating} out of 5`}>
//                                         {[...Array(5)].map((_, i) => (
//                                           <i key={i} className={`fa fa-star${i < review.rating ? '' : '-o'}`}></i>
//                                         ))}
//                                       </div>
//                                       <p className="meta">
//                                         <strong>{review.author}</strong> –
//                                         <time dateTime="2017-01-24T03:54:04+00:00">{review.date}</time>
//                                         :
//                                       </p>
//                                       <div className="description">
//                                         <p>{review.comment}</p>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </li>
//                               ))}
//                             </ol>
//                           </div>

//                           {/* Review Form */}
//                           <div id="review_form_wrapper">
//                             <div id="review_form">
//                               <div id="respond" className="comment-respond">
//                                 <h3 id="reply-title" className="comment-reply-title">Add a review</h3>
//                                 <form 
//                                   onSubmit={handleReviewSubmit}
//                                   className="comment-form" 
//                                   noValidate=""
//                                 >
//                                   <p className="comment-notes">
//                                     <span id="email-notes">Your email address will not be published.</span> Required fields are marked
//                                     <span className="required">*</span>
//                                   </p>
//                                   <p className="comment-form-author">
//                                     <label htmlFor="author">Name <span className="required">*</span></label>
//                                     <input 
//                                       id="author" 
//                                       name="author" 
//                                       type="text" 
//                                       value={reviewForm.name}
//                                       onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
//                                       size="30" 
//                                       required=""
//                                     />
//                                   </p>
//                                   <p className="comment-form-email">
//                                     <label htmlFor="email">Email <span className="required">*</span></label>
//                                     <input 
//                                       id="email" 
//                                       name="email" 
//                                       type="email" 
//                                       value={reviewForm.email}
//                                       onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
//                                       size="30" 
//                                       required=""
//                                     />
//                                   </p>
//                                   <p className="comment-form-rating">
//                                     <label>Your Rating</label>
//                                   </p>
//                                   <p className="stars">
//                                     <span>
//                                       {[...Array(5)].map((_, i) => (
//                                         <i 
//                                           key={i} 
//                                           className={`fa fa-star${i < reviewForm.rating ? '' : '-o'}`}
//                                           onClick={() => setReviewForm({...reviewForm, rating: i + 1})}
//                                         ></i>
//                                       ))}
//                                     </span>
//                                   </p>
//                                   <p className="comment-form-comment">
//                                     <label htmlFor="comment">Your Review <span className="required">*</span></label>
//                                     <textarea 
//                                       id="comment" 
//                                       name="comment" 
//                                       cols="45" 
//                                       rows="8" 
//                                       value={reviewForm.comment}
//                                       onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
//                                       required=""
//                                     ></textarea>
//                                   </p>
//                                   <p className="form-submit">
//                                     <input 
//                                       name="submit" 
//                                       type="submit" 
//                                       id="submit" 
//                                       className="submit" 
//                                       value="Submit"
//                                     />
//                                   </p>
//                                 </form>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="clear"></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Related Tours */}
//                 <div className="related tours">
//                   <h2>Related Tours</h2>
//                   <ul className="tours products wrapper-tours-slider">
//                     {tourData.relatedTours.map((tour) => (
//                       <li key={tour.id} className="item-tour col-md-4 col-sm-6 product">
//                         <div className="item_border item-product">
//                           <div className="post_images">
//                             <Link to={`/tours/${tour.id}`}>
//                               {tour.sale ? (
//                                 <>
//                                   <span className="price">
//                                     <del>${tour.originalPrice.toFixed(2)}</del>
//                                     <ins>${tour.price.toFixed(2)}</ins>
//                                   </span>
//                                   <span className="onsale">Sale!</span>
//                                 </>
//                               ) : (
//                                 <span className="price">${tour.price.toFixed(2)}</span>
//                               )}
//                               <img 
//                                 width="430" 
//                                 height="305" 
//                                 src={tour.image} 
//                                 alt={tour.title} 
//                                 title={tour.title}
//                                 onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                               />
//                             </Link>
//                             <div className="group-icon">
//                               <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist">
//                                 <i className="flaticon-airplane-4"></i>
//                               </a>
//                               <a href="/tours" data-toggle="tooltip" data-placement="top" title="Rail Tour">
//                                 <i className="flaticon-cart-1"></i>
//                               </a>
//                             </div>
//                           </div>
//                           <div className="wrapper_content">
//                             <div className="post_title">
//                               <h4>
//                                 <Link to={`/tours/${tour.id}`} rel="bookmark">{tour.title}</Link>
//                               </h4>
//                             </div>
//                             <span className="post_date">{tour.duration}</span>
//                             <div className="description">
//                               <p>Aliquam lacus nisl, viverra convallis sit amet&nbsp;penatibus nunc&nbsp;luctus</p>
//                             </div>
//                           </div>
//                           <div className="read_more">
//                             <div className="item_rating">
//                               <i className="fa fa-star"></i>
//                               <i className="fa fa-star"></i>
//                               <i className="fa fa-star"></i>
//                               <i className="fa fa-star"></i>
//                               <i className="fa fa-star-o"></i>
//                             </div>
//                             <Link to={`/tours/${tour.id}`} className="button product_type_tour_phys add_to_cart_button">
//                               Read more
//                             </Link>
//                           </div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* Right Column - Booking & Sidebar */}
//               <div className="summary entry-summary description_single">
//                 <div className="affix-sidebar">
//                   <div className="entry-content-tour">
//                     <p className="price">
//                       <span className="text">Price:</span>
//                       <span className="travel_tour-Price-amount amount">${tourData.price.toFixed(2)}</span>
//                     </p>
//                     <div className="clear"></div>
                    
//                     {/* Booking Form */}
//                     <div className="booking">
//                       <div className="">
//                         <div className="form-block__title">
//                           <h4>Book the tour</h4>
//                         </div>
//                         <form onSubmit={handleBookingSubmit} id="tourBookingForm" method="POST">
//                           <div className="">
//                             <input 
//                               name="first_name" 
//                               value={bookingForm.firstName}
//                               onChange={(e) => setBookingForm({...bookingForm, firstName: e.target.value})}
//                               placeholder="First name" 
//                               type="text"
//                             />
//                           </div>
//                           <div className="">
//                             <input 
//                               name="last_name" 
//                               value={bookingForm.lastName}
//                               onChange={(e) => setBookingForm({...bookingForm, lastName: e.target.value})}
//                               placeholder="Last name" 
//                               type="text"
//                             />
//                           </div>
//                           <div className="">
//                             <input 
//                               name="email_tour" 
//                               value={bookingForm.email}
//                               onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
//                               placeholder="Email" 
//                               type="text"
//                             />
//                           </div>
//                           <div className="">
//                             <input 
//                               name="phone" 
//                               value={bookingForm.phone}
//                               onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
//                               placeholder="Phone" 
//                               type="text"
//                             />
//                           </div>
//                           <div className="">
//                             <input 
//                               type="text" 
//                               name="date_book" 
//                               value={bookingForm.dateBook}
//                               onChange={(e) => setBookingForm({...bookingForm, dateBook: e.target.value})}
//                               placeholder="Date Book" 
//                               className="hasDatepicker"
//                             />
//                           </div>
//                           <div className="from-group">
//                             <div className="total_price_arrow">
//                               <div className="st_adults_children">
//                                 <span className="label">Adults</span>
//                                 <div className="input-number-ticket">
//                                   <input 
//                                     type="number" 
//                                     name="number_ticket" 
//                                     value={bookingForm.adults}
//                                     onChange={(e) => setBookingForm({...bookingForm, adults: parseInt(e.target.value) || 1})}
//                                     min="1" 
//                                     max="10" 
//                                     placeholder="Number ticket of Adults"
//                                   />
//                                 </div>
//                                 ×
//                                 ${tourData.price.toFixed(2)}
//                                 =
//                                 <span className="total_price_adults">${(bookingForm.adults * tourData.price).toFixed(2)}</span>
//                               </div>
//                               <div className="st_adults_children">
//                                 <span className="label">Children</span>
//                                 <div className="input-number-ticket">
//                                   <input 
//                                     type="number" 
//                                     name="number_children" 
//                                     value={bookingForm.children}
//                                     onChange={(e) => setBookingForm({...bookingForm, children: parseInt(e.target.value) || 0})}
//                                     min="0" 
//                                     max="10" 
//                                     placeholder="Number ticket of Children"
//                                   />
//                                   <input type="hidden" name="price_child" value={tourData.priceChild} />
//                                   <input type="hidden" name="price_child_set_on_tour" value="0" />
//                                 </div>
//                                 ×
//                                 ${tourData.priceChild.toFixed(2)}
//                                 =
//                                 <span className="total_price_children">${(bookingForm.children * tourData.priceChild).toFixed(2)}</span>
//                               </div>
//                               <div>
//                                 Total =
//                                 <span className="total_price_adults_children">${calculateTotalPrice().toFixed(2)}</span>
//                               </div>
//                               <input type="hidden" name="price_children_percent" value="70" />
//                             </div>
//                           </div>
//                           <div className="spinner">
//                             <div className="rect1"></div>
//                             <div className="rect2"></div>
//                             <div className="rect3"></div>
//                             <div className="rect4"></div>
//                             <div className="rect5"></div>
//                           </div>
//                           <input className="btn-booking btn" value="Booking now" type="submit" />
//                         </form>
//                       </div>
//                     </div>

//                     {/* Enquiry Form */}
//                     <div className="form-block__title custom-form-title"><h4>Or</h4></div>
//                     <div className="custom_from">
//                       <div role="form" className="wpcf7" lang="en-US" dir="ltr">
//                         <div className="screen-reader-response"></div>
//                         <form onSubmit={(e) => {
//                           e.preventDefault()
//                           alert('Enquiry form submitted!')
//                         }} className="wpcf7-form" novalidate="novalidate">
//                           <p>Fill up the form below to tell us what you're looking for</p>
//                           <p>
//                             <span className="wpcf7-form-control-wrap your-name">
//                               <input 
//                                 type="text" 
//                                 name="your-name" 
//                                 value=""
//                                 placeholder="Your name*" 
//                                 className="wpcf7-form-control" 
//                                 aria-invalid="false"
//                               />
//                             </span>
//                           </p>
//                           <p>
//                             <span className="wpcf7-form-control-wrap your-email">
//                               <input 
//                                 type="email" 
//                                 name="your-email" 
//                                 value=""
//                                 placeholder="Email*" 
//                                 className="wpcf7-form-control" 
//                                 aria-invalid="false"
//                               />
//                             </span>
//                           </p>
//                           <p>
//                             <span className="wpcf7-form-control-wrap your-message">
//                               <textarea 
//                                 name="your-message" 
//                                 cols="40" 
//                                 rows="10" 
//                                 className="wpcf7-form-control" 
//                                 aria-invalid="false" 
//                                 placeholder="Message"
//                               ></textarea>
//                             </span>
//                           </p>
//                           <p>
//                             <input 
//                               type="submit" 
//                               value="Send Enquiry" 
//                               className="wpcf7-form-control wpcf7-submit"
//                             />
//                           </p>
//                         </form>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Special Tours Widget */}
//                   <aside className="widget widget_travel_tour">
//                     <div className="wrapper-special-tours">
//                       {tourData.relatedTours.slice(0, 3).map((tour, index) => (
//                         <div key={index} className="inner-special-tours">
//                           <Link to={`/tours/${tour.id}`}>
//                             {tour.sale && <span className="onsale">Sale!</span>}
//                             <img 
//                               width="430" 
//                               height="305" 
//                               src={tour.image} 
//                               alt={tour.title} 
//                               title={tour.title}
//                               onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                             />
//                           </Link>
//                           <div className="item_rating">
//                             {[...Array(5)].map((_, i) => (
//                               <i key={i} className={`fa fa-star${i < 4 ? '' : '-o'}`}></i>
//                             ))}
//                           </div>
//                           <div className="post_title">
//                             <h3>
//                               <Link to={`/tours/${tour.id}`} rel="bookmark">{tour.title}</Link>
//                             </h3>
//                           </div>
//                           <div className="item_price">
//                             {tour.sale ? (
//                               <span className="price">
//                                 <del>${tour.originalPrice.toFixed(2)}</del>
//                                 <ins>${tour.price.toFixed(2)}</ins>
//                               </span>
//                             ) : (
//                               <span className="price">${tour.price.toFixed(2)}</span>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </aside>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }


import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPackages } from '../features/packages/packageSlice';
import Spinner from '../components/Spinner';

export default function SingleTour() {
  const { tourId } = useParams();
  const dispatch = useDispatch();
  const { loading, packages, error } = useSelector((state) => state.packages);

  const [activeTab, setActiveTab] = useState('description');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateBook: '',
    adults: 1,
    children: 0
  });

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    dispatch(fetchPackages());
    window.scrollTo(0, 0);
  }, [dispatch, tourId]);

  const pkg = packages.find(p => p.id === tourId);

  // Prepare Images
  const images = pkg?.PackageImages?.map(img => {
    let url = img.url;
    if (!url.startsWith('/')) url = `/uploads/${url}`;
    return url;
  }) || ['/assets/img/placeholder.jpg'];

  const mainImage = images[mainImageIndex] || '/assets/img/placeholder.jpg';

  // ✅ SAFE PARSING FOR ITINERARY
  const getItinerary = () => {
    if (!pkg?.itinerary) return [];
    try {
      if (typeof pkg.itinerary === 'string') {
        return JSON.parse(pkg.itinerary);
      }
      return pkg.itinerary;
    } catch (e) {
      console.warn("Itinerary is not valid JSON:", pkg.itinerary);
      return [];
    }
  };

  const itineraryData = getItinerary();

  // Calculate Total Price
  const adultPrice = parseFloat(pkg?.price_adult || 0);
  const childPrice = parseFloat(pkg?.price_child || 0);
  const totalAdult = bookingForm.adults * adultPrice;
  const totalChild = bookingForm.children * childPrice;
  const grandTotal = totalAdult + totalChild;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    alert(`Booking Request Sent!\nTotal: $${grandTotal.toFixed(2)}`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your review!');
    setReviewForm({ name: '', email: '', rating: 5, comment: '' });
  };

  if (loading && !pkg) return <div style={{padding: '50px', textAlign: 'center'}}><Spinner size="lg" /><p>Loading...</p></div>;
  if (error) return <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>Error: {error}</div>;
  if (!pkg) return <div style={{padding: '50px', textAlign: 'center'}}>Tour not found.</div>;

  return (
    <div className="single-product travel_tour-page travel_tour">
      
      {/* Breadcrumb */}
      <div className="top_site_main" style={{ backgroundImage: 'url(/assets/img/banner/top-heading.jpg)' }}>
        <div className="banner-wrapper container article_heading">
          <div className="breadcrumbs-wrapper">
            <ul className="phys-breadcrumb">
              <li><Link to="/" className="home">Home</Link></li>
              <li><Link to="/tours">Tours</Link></li>
              <li>{pkg.title}</li>
            </ul>
          </div>
          <h2 className="heading_primary">{pkg.title}</h2>
        </div>
      </div>

      <section className="content-area single-woo-tour">
        <div className="container">
          <div className="tb_single_tour product">
            <div className="top_content_single row">
              
              {/* LEFT COLUMN */}
              <div className="images images_single_left col-sm-8">
                
                {/* Title & Meta */}
                <div className="title-single">
                  <div className="title"><h1>{pkg.title}</h1></div>
                  <div className="tour_code"><strong>Code: </strong>{pkg.id}</div>
                </div>
                <div className="tour_after_title">
                  <div className="meta_date"><span>{pkg.duration_days} DAYS {pkg.duration_nights} NIGHTS</span></div>
                  <div className="meta_values">
                    <span>Category:</span>
                    <div className="value">{pkg.category && <Link to={`/tours?type=${pkg.category}`}>{pkg.category}</Link>}</div>
                  </div>
                  <div className="tour-share">
                    <ul className="share-social">
                      <li><a href="#" className="facebook"><i className="fa fa-facebook"></i></a></li>
                      <li><a href="#" className="twitter"><i className="fa fa-twitter"></i></a></li>
                      <li><a href="#" className="pinterest"><i className="fa fa-pinterest"></i></a></li>
                    </ul>
                  </div>
                </div>

                {/* Images */}
                <div id="slider" className="flexslider">
                  <ul className="slides">
                    <li><a href={mainImage} className="swipebox"><img src={mainImage} alt={pkg.title} /></a></li>
                  </ul>
                </div>
                <div id="carousel" className="flexslider thumbnail_product">
                  <ul className="slides">
                    {images.map((img, idx) => (
                      <li key={idx} onClick={() => setMainImageIndex(idx)} style={{cursor:'pointer'}}>
                        <img src={img} alt="thumb" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="clear"></div>

                {/* TABS SECTION */}
                <div className="single-tour-tabs wc-tabs-wrapper">
                  <ul className="tabs wc-tabs" role="tablist">
                    <li className={`description_tab ${activeTab === 'description' ? 'active' : ''}`}>
                      <a href="#tab-description" onClick={(e) => { e.preventDefault(); setActiveTab('description'); }}>Description</a>
                    </li>
                    <li className={`itinerary_tab_tab ${activeTab === 'itinerary' ? 'active' : ''}`}>
                      {/* ✅ FIXED: href matches the id below */}
                      <a href="#tab-itinerary_tab" onClick={(e) => { e.preventDefault(); setActiveTab('itinerary'); }}>Itinerary</a>
                    </li>
                    <li className={`location_tab_tab ${activeTab === 'location' ? 'active' : ''}`}>
                      <a href="#tab-location_tab" onClick={(e) => { e.preventDefault(); setActiveTab('location'); }}>Location</a>
                    </li>
                    <li className={`reviews_tab ${activeTab === 'reviews' ? 'active' : ''}`}>
                      <a href="#tab-reviews" onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }}>Reviews</a>
                    </li>
                  </ul>

                  <div className="tab-content">
                    
                    {/* DESCRIPTION */}
                    {activeTab === 'description' && (
                      <div role="tabpanel" className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--description panel entry-content wc-tab active" id="tab-description">
                        <h2>Product Description</h2>
                        <p>{pkg.description}</p>
                        <table className="tours-tabs_table">
                          <tbody>
                            <tr><td><strong>DEPARTURE LOCATION</strong></td><td>{pkg.departure_location || 'N/A'}</td></tr>
                            <tr><td><strong>INCLUDED</strong></td><td>{pkg.inclusions}</td></tr>
                            <tr><td><strong>NOT INCLUDED</strong></td><td>{pkg.exclusions}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ITINERARY */}
                    {activeTab === 'itinerary' && (
                      /* ✅ FIXED: ID now matches the href "#tab-itinerary_tab" */
                      <div role="tabpanel" className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--itinerary_tab panel entry-content wc-tab" id="tab-itinerary_tab">
                        {itineraryData.length > 0 ? (
                          itineraryData.map((item, index) => (
                            <div key={index} className="interary-item">
                              <p><span className="icon-left">{item.day || index + 1}</span></p>
                              <div className="item_content">
                                <h2><strong>{item.title}</strong></h2>
                                <p>{item.description}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No itinerary available.</p>
                        )}
                      </div>
                    )}

                    {/* LOCATION */}
                    {activeTab === 'location' && (
                      <div role="tabpanel" className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--location_tab panel entry-content wc-tab" id="tab-location_tab">
                        <div className="wrapper-gmap">
                          <div id="googleMapCanvas" className="google-map" style={{width:'100%', height:'400px', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            Map Placeholder
                          </div>
                        </div>
                      </div>
                    )}

                    {/* REVIEWS */}
                    {activeTab === 'reviews' && (
                      <div role="tabpanel" className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--reviews panel entry-content wc-tab" id="tab-reviews">
                        <div id="reviews" className="travel_tour-Reviews">
                          <h2>Reviews for {pkg.title}</h2>
                          <form onSubmit={handleReviewSubmit} className="comment-form">
                            <p><label>Name</label><input type="text" value={reviewForm.name} onChange={e=>setReviewForm({...reviewForm, name:e.target.value})} required style={{width:'100%', padding:'8px'}} /></p>
                            <p><label>Email</label><input type="email" value={reviewForm.email} onChange={e=>setReviewForm({...reviewForm, email:e.target.value})} required style={{width:'100%', padding:'8px'}} /></p>
                            <p><label>Rating</label>
                              <span>
                                {[1,2,3,4,5].map(s => <i key={s} className={`fa fa-star${s<=reviewForm.rating?'':'-o'}`} onClick={()=>setReviewForm({...reviewForm, rating:s})} style={{cursor:'pointer'}}></i>)}
                              </span>
                            </p>
                            <p><label>Review</label><textarea value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm, comment:e.target.value})} required style={{width:'100%', padding:'8px'}}></textarea></p>
                            <p><input type="submit" value="Submit" className="submit" /></p>
                          </form>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* RELATED TOURS (Outside Tabs) */}
                <div className="related tours">
                  <h2>Related Tours</h2>
                  <ul className="tours products wrapper-tours-slider">
                    {packages.filter(p => p.id !== tourId && p.category === pkg.category).slice(0, 3).map(related => (
                      <li key={related.id} className="item-tour col-md-4 col-sm-6 product">
                        <div className="item_border item-product">
                          <div className="post_images">
                            <Link to={`/tours/${related.id}`}>
                              <span className="price">${parseFloat(related.price_adult).toFixed(2)}</span>
                              <img src={related.PackageImages?.[0]?.url.startsWith('/') ? related.PackageImages[0].url : `/uploads/${related.PackageImages?.[0]?.url}`} alt={related.title} onError={(e)=>e.target.src='/assets/img/placeholder.jpg'} />
                            </Link>
                          </div>
                          <div className="wrapper_content">
                            <h4><Link to={`/tours/${related.id}`}>{related.title}</Link></h4>
                            <Link to={`/tours/${related.id}`} className="button">Read more</Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* RIGHT COLUMN: Booking */}
              <div className="summary entry-summary description_single col-sm-4">
                <div className="affix-sidebar">
                  <p className="price"><span>${adultPrice.toFixed(2)}</span></p>
                  <div className="booking">
                    <h4>Book the tour</h4>
                    <form onSubmit={handleBookingSubmit}>
                      <input placeholder="First Name" value={bookingForm.firstName} onChange={e=>setBookingForm({...bookingForm, firstName:e.target.value})} style={{width:'100%', marginBottom:'10px', padding:'8px'}} required />
                      <input placeholder="Last Name" value={bookingForm.lastName} onChange={e=>setBookingForm({...bookingForm, lastName:e.target.value})} style={{width:'100%', marginBottom:'10px', padding:'8px'}} required />
                      <input placeholder="Email" value={bookingForm.email} onChange={e=>setBookingForm({...bookingForm, email:e.target.value})} style={{width:'100%', marginBottom:'10px', padding:'8px'}} required />
                      <input placeholder="Phone" value={bookingForm.phone} onChange={e=>setBookingForm({...bookingForm, phone:e.target.value})} style={{width:'100%', marginBottom:'10px', padding:'8px'}} />
                      <input type="date" value={bookingForm.dateBook} onChange={e=>setBookingForm({...bookingForm, dateBook:e.target.value})} style={{width:'100%', marginBottom:'10px', padding:'8px'}} required />
                      
                      <div style={{background:'#f9f9f9', padding:'10px', marginBottom:'10px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                          <span>Adults:</span>
                          <input type="number" min="1" value={bookingForm.adults} onChange={e=>setBookingForm({...bookingForm, adults:parseInt(e.target.value)||1})} style={{width:'60px'}} />
                          <span>= ${totalAdult.toFixed(2)}</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                          <span>Children:</span>
                          <input type="number" min="0" value={bookingForm.children} onChange={e=>setBookingForm({...bookingForm, children:parseInt(e.target.value)||0})} style={{width:'60px'}} />
                          <span>= ${totalChild.toFixed(2)}</span>
                        </div>
                        <div style={{fontWeight:'bold', marginTop:'5px', borderTop:'1px solid #ddd', paddingTop:'5px'}}>Total: ${grandTotal.toFixed(2)}</div>
                      </div>

                      <button type="submit" style={{width:'100%', background:'#ffb300', border:'none', padding:'10px', fontWeight:'bold', cursor:'pointer'}}>Booking Now</button>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}