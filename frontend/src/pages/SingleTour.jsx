// import { useEffect, useState } from 'react'
// import { useParams, Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import Carousel from 'react-material-ui-carousel'
// import { Paper, Box } from '@mui/material'
// import { Formik, Form, Field, ErrorMessage } from 'formik'
// import * as Yup from 'yup'
// import { fetchPackageById, fetchPackages } from '../features/packages/packageSlice'
// import { createBooking } from '../features/bookings/bookingSlice'
// import { createMPESAPayment, createCardPayment } from '../features/payments/paymentSlice'

// export default function SingleTour() {
//   const { tourId } = useParams()
//   const dispatch = useDispatch()
  
//   const navigate = useNavigate()
  
//   // Redux selectors
//   const { selectedPackage, packages, loading, error } = useSelector(state => state.packages)
//   const { selectedBooking, loading: bookingLoading, error: bookingError, successMessage: bookingSuccess } = useSelector(state => state.bookings)
//   const { mpesaTransaction, loading: paymentLoading, error: paymentError } = useSelector(state => state.payments)
//   const { user, isAuthenticated } = useSelector(state => state.auth)
  
//   // Local state
//   const [activeTab, setActiveTab] = useState('description')
//   const [submitting, setSubmitting] = useState(false)
//   const [tourData, setTourData] = useState(null)
//   const [relatedTours, setRelatedTours] = useState([])
//   const [carouselIndex, setCarouselIndex] = useState(0)
  
//   const initialBookingValues = () => ({
//     // Passenger info
//     name: user?.name || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     age: '',
//     passport_number: '',
//     nationality: 'Kenyan',
//     // Booking details
//     start_date: '',
//     end_date: '',
//     adults: 1,
//     children: 0,
//     special_requests: ''
//   })

//   const BookingSchema = Yup.object().shape({
//     name: Yup.string().required('Full name is required'),
//     email: Yup.string().email('Invalid email').required('Email is required'),
//     start_date: Yup.date().required('Start date is required'),
//     end_date: Yup.date().nullable(),
//     adults: Yup.number().min(1, 'At least 1 adult').required('Adults field is required'),
//     children: Yup.number().min(0, 'Must be 0 or more').required(),
//     phone: Yup.string(),
//     age: Yup.number().min(0).max(120).nullable(),
//     passport_number: Yup.string(),
//     nationality: Yup.string(),
//     special_requests: Yup.string()
//   })
  
//   const [reviewForm, setReviewForm] = useState({
//     name: '',
//     email: '',
//     rating: 5,
//     comment: ''
//   })
  
//   const [enquiryForm, setEnquiryForm] = useState({
//     name: '',
//     email: '',
//     message: ''
//   })

//   // Transform Redux package data to component format
//   const transformPackageData = (packageData) => {
//     if (!packageData) return null
    
//     const parseJSONField = (field) => {
//       if (!field) return []
//       if (Array.isArray(field)) return field
//       if (typeof field === 'string') {
//         try {
//           const parsed = JSON.parse(field)
//           return Array.isArray(parsed) ? parsed : []
//         } catch (e) {
//           if (field.includes(',')) {
//             return field.split(',').map(item => item.trim()).filter(item => item)
//           }
//           return []
//         }
//       }
//       return []
//     }
    
//     const itinerary = parseJSONField(packageData.itinerary)
//     const inclusions = parseJSONField(packageData.inclusions)
//     const exclusions = parseJSONField(packageData.exclusions)

//     return {
//       id: packageData.id,
//       title: packageData.title,
//       code: packageData.id.substring(0, 6).toUpperCase(),
//       duration: `${packageData.duration_days} DAYS`,
//       categories: [packageData.category],
//       price: parseFloat(packageData.price_adult),
//       priceChild: parseFloat(packageData.price_child),
//       description: packageData.description,
//       destination: packageData.destination,
//       duration_days: packageData.duration_days,
//       images: packageData.PackageImages && packageData.PackageImages.length > 0 
//         ? packageData.PackageImages.map(img => {
//             if (!img.url) return '/assets/img/placeholder.jpg'
//             if (img.url.startsWith('http')) return img.url
//             return `/uploads/${img.url}`
//           })
//         : ['/assets/img/placeholder.jpg'],
//       itinerary: itinerary,
//       reviews: packageData.Reviews || [],
//       inclusions: inclusions,
//       exclusions: exclusions,
//       departureLocation: packageData.destination,
//       departureTime: 'Please arrive at least 2 hours before departure.',
//       included: Array.isArray(inclusions) ? inclusions : [],
//       notIncluded: Array.isArray(exclusions) ? exclusions : [],
//       relatedTours: []
//     }
//   }

//   // Fetch package data on mount
//   useEffect(() => {
//     if (tourId) {
//       dispatch(fetchPackageById(tourId))
//     }
//   }, [tourId, dispatch])

//   // Transform and set tour data when Redux package data updates
//   useEffect(() => {
//     if (selectedPackage) {
//       const transformed = transformPackageData(selectedPackage)
//       setTourData(transformed)
//     }
//   }, [selectedPackage])

//   // Fetch related tours
//   useEffect(() => {
//     if (tourData && tourData.categories.length > 0) {
//       dispatch(fetchPackages()).then((action) => {
//         const relatedPackages = action.payload
//           .filter(pkg => pkg.category === tourData.categories[0] && pkg.id !== tourId)
//           .slice(0, 3)
//           .map(pkg => ({
//             id: pkg.id,
//             title: pkg.title,
//             price: parseFloat(pkg.price_adult),
//             duration: `${pkg.duration_days} DAYS`,
//             image: pkg.PackageImages && pkg.PackageImages.length > 0
//               ? (pkg.PackageImages[0].url.startsWith('http') 
//                   ? pkg.PackageImages[0].url 
//                   : `/uploads/${pkg.PackageImages[0].url}`)
//               : '/assets/img/placeholder.jpg'
//           }))
        
//         setTourData(prev => ({
//           ...prev,
//           relatedTours: relatedPackages
//         }))
//         setRelatedTours(relatedPackages)
//       })
//     }
//   }, [tourData?.id, tourId, dispatch])

//   // Initialize jQuery plugins (swipebox and tooltips)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       // Initialize swipebox for lightbox
//       if (window.$ && window.$.fn.swipebox) {
//         $('.swipebox').swipebox()
//       }
      
//       // Initialize tooltips
//       if (window.$ && window.$.fn.tooltip) {
//         $('[data-toggle="tooltip"]').tooltip()
//       }
//     }, 100)
    
//     return () => clearTimeout(timer)
//   }, [tourData])

//   const handleBookingSubmit = async (values, formikHelpers) => {
//     try {
//       setSubmitting(true)

//       // Calculate end date if not provided
//       const endDate = values.end_date || new Date(new Date(values.start_date).getTime() + tourData.duration_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

//       const totalAmount = (parseInt(values.adults || 0) * tourData.price) + (parseInt(values.children || 0) * tourData.priceChild)

//       // Dispatch Redux action for booking
//       const result = await dispatch(createBooking({
//         package_id: tourId,
//         start_date: values.start_date,
//         end_date: endDate,
//         total_amount: totalAmount,
//         special_requests: values.special_requests || null,
//         passengers: [
//           {
//             name: values.name,
//             email: values.email,
//             phone: values.phone,
//             age: values.age || null,
//             passport_number: values.passport_number,
//             nationality: values.nationality
//           }
//         ]
//       }))

//       if (result.payload?.data?.booking) {
//         const bookingId = result.payload.data.booking.id
//         // Redirect to success page with booking ID
//         navigate(`/bookings/success/${bookingId}`)
//       } else {
//         alert('Booking submission failed. Please try again.')
//       }
//     } catch (err) {
//       alert('Error submitting booking: ' + (err.message || 'Unknown error'))
//     } finally {
//       setSubmitting(false)
//       formikHelpers.setSubmitting(false)
//     }
//   }

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       setSubmitting(true)
      
//       if (!reviewForm.comment || reviewForm.comment.length < 10) {
//         alert('Please write a review of at least 10 characters')
//         return
//       }

//       // In a real implementation, dispatch createReview action from reviewSlice
//       // For now, using direct API call
//       const response = await fetch(`/api/v1/reviews`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           package_id: tourId,
//           rating: reviewForm.rating,
//           comment: reviewForm.comment
//         })
//       })

//       if (response.ok) {
//         alert('Review submitted successfully!')
//         setReviewForm({
//           name: '',
//           email: '',
//           rating: 5,
//           comment: ''
//         })
        
//         // Refresh package data to show new review
//         dispatch(fetchPackageById(tourId))
//       }
//     } catch (err) {
//       alert('Error submitting review: ' + (err.message || 'Unknown error'))
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const calculateTotalPrice = (values) => {
//     if (!tourData || !values) return 0
//     const adults = parseInt(values.adults) || 0
//     const children = parseInt(values.children) || 0
//     const adultTotal = adults * tourData.price
//     const childTotal = children * tourData.priceChild
//     return adultTotal + childTotal
//   }

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="single-product travel_tour-page travel_tour">
//         <section className="content-area single-woo-tour">
//           <div className="container">
//             <div className="text-center" style={{ padding: '60px 20px' }}>
//               <div className="spinner">
//                 <div className="rect1"></div>
//                 <div className="rect2"></div>
//                 <div className="rect3"></div>
//                 <div className="rect4"></div>
//                 <div className="rect5"></div>
//               </div>
//               <p style={{ marginTop: '20px' }}>Loading tour details...</p>
//             </div>
//           </div>
//         </section>
//       </div>
//     )
//   }

//   // Show error state
//   if (error || !tourData) {
//     return (
//       <div className="single-product travel_tour-page travel_tour">
//         <section className="content-area single-woo-tour">
//           <div className="container">
//             <div className="alert alert-danger" style={{ padding: '20px', marginTop: '20px' }}>
//               <h3>Error Loading Tour</h3>
//               <p>{error || 'Tour not found'}</p>
//               <Link to="/tours" className="btn">Back to Tours</Link>
//             </div>
//           </div>
//         </section>
//       </div>
//     )
//   }

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
//                 <Box sx={{ marginBottom: 2 }}>
//                   <Carousel 
//                     index={carouselIndex}
//                     onChange={(now) => setCarouselIndex(now)}
//                     interval={5000}
//                     navButtonsAlwaysVisible={true}
//                   >
//                     {tourData.images.map((image, index) => (
//                       <Paper key={index} sx={{ position: 'relative', overflow: 'hidden' }}>
//                         <a href={image} className="swipebox" title="">
//                           <img 
//                             width="100%" 
//                             height="700" 
//                             src={image} 
//                             alt={`${tourData.title} - ${index + 1}`}
//                             title={tourData.title}
//                             style={{ objectFit: 'cover', display: 'block' }}
//                             onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                           />
//                         </a>
//                       </Paper>
//                     ))}
//                   </Carousel>
//                 </Box>

//                 {/* Thumbnail Carousel */}
//                 <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', paddingBottom: 2 }}>
//                   {tourData.images.map((image, index) => (
//                     <Box
//                       key={index}
//                       onClick={() => setCarouselIndex(index)}
//                       sx={{
//                         minWidth: 120,
//                         height: 100,
//                         cursor: 'pointer',
//                         border: carouselIndex === index ? '3px solid #007bff' : '2px solid #ddd',
//                         transition: 'all 0.3s ease',
//                         borderRadius: '4px',
//                         overflow: 'hidden',
//                         '&:hover': {
//                           borderColor: '#007bff'
//                         }
//                       }}
//                     >
//                       <img 
//                         width="100%" 
//                         height="100%" 
//                         src={image} 
//                         alt={`Thumbnail ${index + 1}`}
//                         title={tourData.title}
//                         style={{ objectFit: 'cover', display: 'block' }}
//                         onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                       />
//                     </Box>
//                   ))}
//                 </Box>

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
//                                     {tourData.included && tourData.included.length > 0 ? (
//                                       tourData.included.map((item, idx) => (
//                                         <tr key={idx}>
//                                           <td><i className="fa fa-check icon-tick icon-tick--on"></i> {item}</td>
//                                         </tr>
//                                       ))
//                                     ) : (
//                                       <tr><td><em>No inclusions listed</em></td></tr>
//                                     )}
//                                   </tbody>
//                                 </table>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td><b>NOT INCLUDED</b></td>
//                               <td>
//                                 <table>
//                                   <tbody>
//                                     {tourData.notIncluded && tourData.notIncluded.length > 0 ? (
//                                       tourData.notIncluded.map((item, idx) => (
//                                         <tr key={idx}>
//                                           <td><i className="fa fa-times icon-tick icon-tick--off"></i> {item}</td>
//                                         </tr>
//                                       ))
//                                     ) : (
//                                       <tr><td><em>No exclusions listed</em></td></tr>
//                                     )}
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
//                         className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--itinerary_tab panel entry-content wc-tab active" 
//                         id="tab-itinerary_tab"
//                       >
//                         {tourData.itinerary && tourData.itinerary.length > 0 ? (
//                           tourData.itinerary.map((item, index) => (
//                             <div key={item.day || index} className="interary-item">
//                               <p><span className="icon-left">{item.day}</span></p>
//                               <div className="item_content">
//                                 <h2><strong>{item.title}</strong></h2>
//                                 <p>{item.description}</p>
//                                 {item.activities && Array.isArray(item.activities) && (
//                                   <ul>
//                                     {item.activities.map((activity, idx) => (
//                                       <li key={idx}>{activity}</li>
//                                     ))}
//                                   </ul>
//                                 )}
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <p>No itinerary information available.</p>
//                         )}
//                       </div>
//                     )}

//                     {/* Location Tab */}
//                     {activeTab === 'location' && (
//                       <div 
//                         role="tabpanel" 
//                         className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--location_tab panel entry-content wc-tab active" 
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
//                         className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--reviews panel entry-content wc-tab active" 
//                         id="tab-reviews"
//                       >
//                         <div id="reviews" className="travel_tour-Reviews">
//                           <div id="comments">
//                             <h2 className="travel_tour-Reviews-title">
//                               {tourData.reviews.length} review for
//                               <span> {tourData.title}</span>
//                             </h2>
//                             <ol className="commentlist">
//                               {tourData.reviews && tourData.reviews.length > 0 ? (
//                                 tourData.reviews.map((review) => (
//                                   <li 
//                                     key={review.id} 
//                                     itemscope="" 
//                                     itemtype="http://schema.org/Review" 
//                                     className="comment byuser comment-author-physcode bypostauthor even thread-even depth-1"
//                                     id={`li-comment-${review.id}`}
//                                   >
//                                     <div id={`comment-${review.id}`} className="comment_container">
//                                       <img 
//                                         alt="" 
//                                         src="/assets/img/avata.jpg" 
//                                         className="avatar avatar-60 photo" 
//                                         height="60" 
//                                         width="60"
//                                       />
//                                       <div className="comment-text">
//                                         <div className="star-rating" title={`Rated ${review.rating} out of 5`}>
//                                           {[...Array(5)].map((_, i) => (
//                                             <i key={i} className={`fa fa-star${i < review.rating ? '' : '-o'}`}></i>
//                                           ))}
//                                         </div>
//                                         <p className="meta">
//                                           <strong>{review.User?.name || 'Anonymous'}</strong> –
//                                           <time dateTime={review.created_at}>
//                                             {new Date(review.created_at).toLocaleDateString()}
//                                           </time>
//                                           :
//                                         </p>
//                                         <div className="description">
//                                           <p>{review.comment}</p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </li>
//                                 ))
//                               ) : (
//                                 <li style={{ padding: '20px' }}>No reviews yet. Be the first to review!</li>
//                               )}
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
//                                   noValidate
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
//                                           style={{cursor: 'pointer'}}
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
//                                       value={submitting ? "Submitting..." : "Submit"}
//                                       disabled={submitting}
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
//                                 <span className="price">KES {tour.price.toFixed(2)}</span>
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
//                       <span className="travel_tour-Price-amount amount">KES {tourData.price.toFixed(2)}</span>
//                     </p>
//                     <div className="clear"></div>
                    
//                     {/* Booking Form */}
//                     <div className="booking">
//                       <div className="">
//                         <div className="form-block__title">
//                           <h4>Book the tour</h4>
//                         </div>
//                         {!isAuthenticated ? (
//                           <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', textAlign: 'center' }}>
//                             <p style={{ marginBottom: '15px' }}>You must be logged in to book this tour.</p>
//                             <button 
//                               onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
//                               style={{
//                                 padding: '10px 20px',
//                                 backgroundColor: '#007bff',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 cursor: 'pointer',
//                                 fontSize: '14px'
//                               }}
//                             >
//                               Login to Book
//                             </button>
//                           </div>
//                         ) : (
//                           <Formik
//                             initialValues={initialBookingValues()}
//                             validationSchema={BookingSchema}
//                             onSubmit={handleBookingSubmit}
//                           >
//                             {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
//                               <form onSubmit={handleSubmit} id="tourBookingForm" method="POST" noValidate>
//                                 <div className="">
//                                   <input
//                                     name="name"
//                                     placeholder="Full name *"
//                                     type="text"
//                                     value={values.name}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     style={{
//                                       borderColor: errors.name && touched.name ? '#dc3545' : '',
//                                       border: errors.name && touched.name ? '1px solid #dc3545' : ''
//                                     }}
//                                   />
//                                   {errors.name && touched.name && (
//                                     <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
//                                       {errors.name}
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="">
//                                   <input
//                                     name="email"
//                                     placeholder="Email *"
//                                     type="email"
//                                     value={values.email}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     style={{
//                                       borderColor: errors.email && touched.email ? '#dc3545' : '',
//                                       border: errors.email && touched.email ? '1px solid #dc3545' : ''
//                                     }}
//                                   />
//                                   {errors.email && touched.email && (
//                                     <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
//                                       {errors.email}
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="">
//                                   <input
//                                     name="phone"
//                                     placeholder="Phone"
//                                     type="text"
//                                     value={values.phone}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                   />
//                                 </div>
//                                 <div className="">
//                                   <input
//                                     name="age"
//                                     placeholder="Age"
//                                     type="number"
//                                     min="0"
//                                     max="120"
//                                     value={values.age}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                   />
//                                 </div>
//                                 <div className="">
//                                   <input
//                                     name="passport_number"
//                                     placeholder="Passport Number"
//                                     type="text"
//                                     value={values.passport_number}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                   />
//                                 </div>
//                                 <div className="">
//                                   <select
//                                     name="nationality"
//                                     value={values.nationality}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//                                   >
//                                     <option value="Kenyan">Kenyan</option>
//                                     <option value="Other">Other</option>
//                                   </select>
//                                 </div>
//                                 <div className="">
//                                   <label>Start Date *</label>
//                                   <input
//                                     type="date"
//                                     name="start_date"
//                                     value={values.start_date}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     style={{
//                                       borderColor: errors.start_date && touched.start_date ? '#dc3545' : '',
//                                       border: errors.start_date && touched.start_date ? '1px solid #dc3545' : ''
//                                     }}
//                                   />
//                                   {errors.start_date && touched.start_date && (
//                                     <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
//                                       {errors.start_date}
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="">
//                                   <label>End Date</label>
//                                   <input
//                                     type="date"
//                                     name="end_date"
//                                     value={values.end_date}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                   />
//                                 </div>
//                                 <div className="from-group">
//                                   <div className="total_price_arrow">
//                                     <div className="st_adults_children">
//                                       <span className="label">Adults</span>
//                                       <div className="input-number-ticket">
//                                         <input
//                                           type="number"
//                                           name="adults"
//                                           value={values.adults}
//                                           onChange={handleChange}
//                                           onBlur={handleBlur}
//                                           min="1"
//                                           max="10"
//                                           placeholder="Number ticket of Adults"
//                                         />
//                                       </div>
//                                       ×
//                                       KES {tourData.price.toFixed(2)}
//                                       =
//                                       <span className="total_price_adults">KES {(parseInt(values.adults || 0) * tourData.price).toFixed(2)}</span>
//                                     </div>
//                                     <div className="st_adults_children">
//                                       <span className="label">Children</span>
//                                       <div className="input-number-ticket">
//                                         <input
//                                           type="number"
//                                           name="children"
//                                           value={values.children}
//                                           onChange={handleChange}
//                                           onBlur={handleBlur}
//                                           min="0"
//                                           max="10"
//                                           placeholder="Number ticket of Children"
//                                         />
//                                         <input type="hidden" name="price_child" value={tourData.priceChild} />
//                                         <input type="hidden" name="price_child_set_on_tour" value="0" />
//                                       </div>
//                                       ×
//                                       KES {tourData.priceChild.toFixed(2)}
//                                       =
//                                       <span className="total_price_children">KES {(parseInt(values.children || 0) * tourData.priceChild).toFixed(2)}</span>
//                                     </div>
//                                     <div>
//                                       Total =
//                                       <span className="total_price_adults_children">KES {calculateTotalPrice(values).toFixed(2)}</span>
//                                     </div>
//                                     <input type="hidden" name="price_children_percent" value="70" />
//                                   </div>
//                                 </div>
//                                 <div className="">
//                                   <label>Special Requests</label>
//                                   <textarea
//                                     name="special_requests"
//                                     value={values.special_requests}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     placeholder="Any special requests or requirements?"
//                                     rows="3"
//                                     style={{ width: '100%', padding: '8px' }}
//                                   />
//                                 </div>
//                                 <div className="spinner">
//                                   <div className="rect1"></div>
//                                   <div className="rect2"></div>
//                                   <div className="rect3"></div>
//                                   <div className="rect4"></div>
//                                   <div className="rect5"></div>
//                                 </div>
//                                 <input
//                                   className="btn-booking btn"
//                                   value={isSubmitting || submitting ? 'Booking...' : 'Booking now'}
//                                   type="submit"
//                                   disabled={isSubmitting || submitting}
//                                 />
//                               </form>
//                             )}
//                           </Formik>
//                         )}
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
//                           setEnquiryForm({ name: '', email: '', message: '' })
//                         }} className="wpcf7-form" noValidate>
//                           <p>Fill up the form below to tell us what you're looking for</p>
//                           <p>
//                             <span className="wpcf7-form-control-wrap your-name">
//                               <input 
//                                 type="text" 
//                                 name="your-name" 
//                                 value={enquiryForm.name}
//                                 onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
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
//                                 value={enquiryForm.email}
//                                 onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
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
//                                 value={enquiryForm.message}
//                                 onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
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
//                                 <del>KES {tour.originalPrice.toFixed(2)}</del>
//                                 <ins>KES {tour.price.toFixed(2)}</ins>
//                               </span>
//                             ) : (
//                               <span className="price">KES {tour.price.toFixed(2)}</span>
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



import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Carousel from 'react-material-ui-carousel'
import { Paper, Box } from '@mui/material'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { fetchPackageById, fetchPackages } from '../features/packages/packageSlice'
import { createBooking } from '../features/bookings/bookingSlice'
import { createMPESAPayment, createCardPayment } from '../features/payments/paymentSlice'

export default function SingleTour() {
  const { tourId } = useParams()
  const dispatch = useDispatch()
  
  const navigate = useNavigate()
  
  // Redux selectors
  const { selectedPackage, packages, loading, error } = useSelector(state => state.packages)
  const { selectedBooking, loading: bookingLoading, error: bookingError, successMessage: bookingSuccess } = useSelector(state => state.bookings)
  const { mpesaTransaction, loading: paymentLoading, error: paymentError } = useSelector(state => state.payments)
  const { user, isAuthenticated } = useSelector(state => state.auth)
  
  // Local state
  const [activeTab, setActiveTab] = useState('description')
  const [submitting, setSubmitting] = useState(false)
  const [tourData, setTourData] = useState(null)
  const [relatedTours, setRelatedTours] = useState([])
  const [carouselIndex, setCarouselIndex] = useState(0)
  
  const initialBookingValues = () => ({
    // Passenger info
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: '',
    passport_number: '',
    nationality: 'Kenyan',
    // Booking details
    start_date: '',
    end_date: '',
    adults: 1,
    children: 0,
    special_requests: ''
  })

  const BookingSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    start_date: Yup.date().required('Start date is required'),
    end_date: Yup.date().nullable(),
    adults: Yup.number().min(1, 'At least 1 adult').required('Adults field is required'),
    children: Yup.number().min(0, 'Must be 0 or more').required(),
    phone: Yup.string(),
    age: Yup.number().min(0).max(120).nullable(),
    passport_number: Yup.string(),
    nationality: Yup.string(),
    special_requests: Yup.string()
  })
  
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  })
  
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  // Transform Redux package data to component format
  const transformPackageData = (packageData) => {
    if (!packageData) return null
    
    const parseJSONField = (field) => {
      if (!field) return []
      if (Array.isArray(field)) return field
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field)
          return Array.isArray(parsed) ? parsed : []
        } catch (e) {
          if (field.includes(',')) {
            return field.split(',').map(item => item.trim()).filter(item => item)
          }
          return []
        }
      }
      return []
    }
    
    const itinerary = parseJSONField(packageData.itinerary)
    const inclusions = parseJSONField(packageData.inclusions)
    const exclusions = parseJSONField(packageData.exclusions)

    return {
      id: packageData.id,
      title: packageData.title,
      code: packageData.id.substring(0, 6).toUpperCase(),
      duration: `${packageData.duration_days} DAYS`,
      categories: [packageData.category],
      price: parseFloat(packageData.price_adult),
      priceChild: parseFloat(packageData.price_child),
      description: packageData.description,
      destination: packageData.destination,
      duration_days: packageData.duration_days,
      images: packageData.PackageImages && packageData.PackageImages.length > 0 
        ? packageData.PackageImages.map(img => {
            if (!img.url) return '/assets/img/placeholder.jpg'
            if (img.url.startsWith('http')) return img.url
            return `/uploads/${img.url}`
          })
        : ['/assets/img/placeholder.jpg'],
      itinerary: itinerary,
      reviews: packageData.Reviews || [],
      inclusions: inclusions,
      exclusions: exclusions,
      departureLocation: packageData.destination,
      departureTime: 'Please arrive at least 2 hours before departure.',
      included: Array.isArray(inclusions) ? inclusions : [],
      notIncluded: Array.isArray(exclusions) ? exclusions : [],
      relatedTours: []
    }
  }

  // Fetch package data on mount
  useEffect(() => {
    if (tourId) {
      dispatch(fetchPackageById(tourId))
    }
  }, [tourId, dispatch])

  // Transform and set tour data when Redux package data updates
  useEffect(() => {
    if (selectedPackage) {
      const transformed = transformPackageData(selectedPackage)
      setTourData(transformed)
    }
  }, [selectedPackage])

  // Fetch related tours
  useEffect(() => {
    if (tourData && tourData.categories.length > 0) {
      dispatch(fetchPackages()).then((action) => {
        const relatedPackages = action.payload
          .filter(pkg => pkg.category === tourData.categories[0] && pkg.id !== tourId)
          .slice(0, 3)
          .map(pkg => ({
            id: pkg.id,
            title: pkg.title,
            price: parseFloat(pkg.price_adult),
            duration: `${pkg.duration_days} DAYS`,
            image: pkg.PackageImages && pkg.PackageImages.length > 0
              ? (pkg.PackageImages[0].url.startsWith('http') 
                  ? pkg.PackageImages[0].url 
                  : `/uploads/${pkg.PackageImages[0].url}`)
              : '/assets/img/placeholder.jpg'
          }))
        
        setTourData(prev => ({
          ...prev,
          relatedTours: relatedPackages
        }))
        setRelatedTours(relatedPackages)
      })
    }
  }, [tourData?.id, tourId, dispatch])

  // Initialize jQuery plugins (swipebox and tooltips)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Initialize swipebox for lightbox
      if (window.$ && window.$.fn.swipebox) {
        $('.swipebox').swipebox()
      }
      
      // Initialize tooltips
      if (window.$ && window.$.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [tourData])

  const handleBookingSubmit = async (values, formikHelpers) => {
    try {
      setSubmitting(true)

      // Calculate end date if not provided
      const endDate = values.end_date || new Date(new Date(values.start_date).getTime() + tourData.duration_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const totalAmount = (parseInt(values.adults || 0) * tourData.price) + (parseInt(values.children || 0) * tourData.priceChild)

      // Dispatch Redux action for booking
      const result = await dispatch(createBooking({
        package_id: tourId,
        start_date: values.start_date,
        end_date: endDate,
        total_amount: totalAmount,
        special_requests: values.special_requests || null,
        passengers: [
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            age: values.age || null,
            passport_number: values.passport_number,
            nationality: values.nationality
          }
        ]
      }))

      if (result.payload?.data?.booking) {
        const bookingId = result.payload.data.booking.id
        // Redirect to success page with booking ID
        navigate(`/bookings/success/${bookingId}`)
      } else {
        alert('Booking submission failed. Please try again.')
      }
    } catch (err) {
      alert('Error submitting booking: ' + (err.message || 'Unknown error'))
    } finally {
      setSubmitting(false)
      formikHelpers.setSubmitting(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      
      if (!reviewForm.comment || reviewForm.comment.length < 10) {
        alert('Please write a review of at least 10 characters')
        return
      }

      // In a real implementation, dispatch createReview action from reviewSlice
      // For now, using direct API call
      const response = await fetch(`/api/v1/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: tourId,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
      })

      if (response.ok) {
        alert('Review submitted successfully!')
        setReviewForm({
          name: '',
          email: '',
          rating: 5,
          comment: ''
        })
        
        // Refresh package data to show new review
        dispatch(fetchPackageById(tourId))
      }
    } catch (err) {
      alert('Error submitting review: ' + (err.message || 'Unknown error'))
    } finally {
      setSubmitting(false)
    }
  }

  const calculateTotalPrice = (values) => {
    if (!tourData || !values) return 0
    const adults = parseInt(values.adults) || 0
    const children = parseInt(values.children) || 0
    const adultTotal = adults * tourData.price
    const childTotal = children * tourData.priceChild
    return adultTotal + childTotal
  }

  // Show loading state
  if (loading) {
    return (
      <div className="single-product travel_tour-page travel_tour">
        <section className="content-area single-woo-tour">
          <div className="container">
            <div className="text-center" style={{ padding: '60px 20px' }}>
              <div className="spinner">
                <div className="rect1"></div>
                <div className="rect2"></div>
                <div className="rect3"></div>
                <div className="rect4"></div>
                <div className="rect5"></div>
              </div>
              <p style={{ marginTop: '20px' }}>Loading tour details...</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Show error state
  if (error || !tourData) {
    return (
      <div className="single-product travel_tour-page travel_tour">
        <section className="content-area single-woo-tour">
          <div className="container">
            <div className="alert alert-danger" style={{ padding: '20px', marginTop: '20px' }}>
              <h3>Error Loading Tour</h3>
              <p>{error || 'Tour not found'}</p>
              <Link to="/tours" className="btn">Back to Tours</Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="single-product travel_tour-page travel_tour">
      {/* Breadcrumb */}
      <div className="top_site_main" style={{ backgroundImage: 'url(/assets/img/banner/top-heading.jpg)' }}>
        <div className="banner-wrapper container article_heading">
          <div className="breadcrumbs-wrapper">
            <ul className="phys-breadcrumb">
              <li><Link to="/" className="home">Home</Link></li>
              <li><Link to="/blog">Business</Link></li>
              <li>Love advice from experts</li>
            </ul>
          </div>
          <h2 className="heading_primary">Business</h2>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-area single-woo-tour">
        <div className="container">
          <div className="tb_single_tour product">
            <div className="top_content_single row">
              {/* Left Column - Images & Tabs */}
              <div className="images images_single_left">
                <div className="title-single">
                  <div className="title">
                    <h1>{tourData.title}</h1>
                  </div>
                  <div className="tour_code">
                    <strong>Code: </strong>{tourData.code}
                  </div>
                </div>
                <div className="tour_after_title">
                  <div className="meta_date">
                    <span>{tourData.duration}</span>
                  </div>
                  <div className="meta_values">
                    <span>Category:</span>
                    <div className="value">
                      {tourData.categories.map((cat, idx) => (
                        <span key={idx}>
                          <Link to="/tours" rel="tag">{cat}</Link>
                          {idx < tourData.categories.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="tour-share">
                    <ul className="share-social">
                      <li>
                        <a target="_blank" className="facebook" href="#"><i className="fa fa-facebook"></i></a>
                      </li>
                      <li>
                        <a target="_blank" className="twitter" href="#"><i className="fa fa-twitter"></i></a>
                      </li>
                      <li>
                        <a target="_blank" className="pinterest" href="#"><i className="fa fa-pinterest"></i></a>
                      </li>
                      <li>
                        <a target="_blank" className="googleplus" href="#"><i className="fa fa-google"></i></a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Image Gallery */}
                <Box sx={{ marginBottom: 2 }}>
                  <Carousel 
                    index={carouselIndex}
                    onChange={(now) => setCarouselIndex(now)}
                    interval={5000}
                    navButtonsAlwaysVisible={true}
                  >
                    {tourData.images.map((image, index) => (
                      <Paper key={index} sx={{ position: 'relative', overflow: 'hidden' }}>
                        <a href={image} className="swipebox" title="">
                          <img 
                            width="100%" 
                            height="700" 
                            src={image} 
                            alt={`${tourData.title} - ${index + 1}`}
                            title={tourData.title}
                            style={{ objectFit: 'cover', display: 'block' }}
                            onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                          />
                        </a>
                      </Paper>
                    ))}
                  </Carousel>
                </Box>

                {/* Thumbnail Carousel */}
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', paddingBottom: 2 }}>
                  {tourData.images.map((image, index) => (
                    <Box
                      key={index}
                      onClick={() => setCarouselIndex(index)}
                      sx={{
                        minWidth: 120,
                        height: 100,
                        cursor: 'pointer',
                        border: carouselIndex === index ? '3px solid #007bff' : '2px solid #ddd',
                        transition: 'all 0.3s ease',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        '&:hover': {
                          borderColor: '#007bff'
                        }
                      }}
                    >
                      <img 
                        width="100%" 
                        height="100%" 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        title={tourData.title}
                        style={{ objectFit: 'cover', display: 'block' }}
                        onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                      />
                    </Box>
                  ))}
                </Box>

                <div className="clear"></div>

                {/* Tabs */}
                <div className="single-tour-tabs wc-tabs-wrapper">
                  <ul className="tabs wc-tabs" role="tablist">
                    <li 
                      className={`description_tab ${activeTab === 'description' ? 'active' : ''}`} 
                      role="presentation"
                    >
                      <a 
                        href="#tab-description" 
                        role="tab" 
                        data-toggle="tab"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTab('description')
                        }}
                      >
                        Description
                      </a>
                    </li>
                    <li 
                      className={`itinerary_tab_tab ${activeTab === 'itinerary' ? 'active' : ''}`} 
                      role="presentation"
                    >
                      <a 
                        href="#tab-itinerary_tab" 
                        role="tab" 
                        data-toggle="tab"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTab('itinerary')
                        }}
                      >
                        Itinerary
                      </a>
                    </li>
                    <li 
                      className={`location_tab_tab ${activeTab === 'location' ? 'active' : ''}`} 
                      role="presentation"
                    >
                      <a 
                        href="#tab-location_tab" 
                        role="tab" 
                        data-toggle="tab"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTab('location')
                        }}
                      >
                        Location
                      </a>
                    </li>
                    <li 
                      className={`reviews_tab ${activeTab === 'reviews' ? 'active' : ''}`} 
                      role="presentation"
                    >
                      <a 
                        href="#tab-reviews" 
                        role="tab" 
                        data-toggle="tab"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTab('reviews')
                        }}
                      >
                        Reviews ({tourData.reviews.length})
                      </a>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {/* Description Tab */}
                    {activeTab === 'description' && (
                      <div 
                        role="tabpanel" 
                        className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--description panel entry-content wc-tab active" 
                        id="tab-description"
                      >
                        <h2>Product Description</h2>
                        <p>{tourData.description}</p>
                        <p>{tourData.details}</p>
                        
                        <table className="tours-tabs_table">
                          <tbody>
                            <tr>
                              <td><strong>DEPARTURE/RETURN LOCATION</strong></td>
                              <td>{tourData.departureLocation}</td>
                            </tr>
                            <tr>
                              <td><strong>DEPARTURE TIME</strong></td>
                              <td>{tourData.departureTime}</td>
                            </tr>
                            <tr>
                              <td><strong>INCLUDED</strong></td>
                              <td>
                                <table>
                                  <tbody>
                                    {tourData.included && tourData.included.length > 0 ? (
                                      tourData.included.map((item, idx) => (
                                        <tr key={idx}>
                                          <td><i className="fa fa-check icon-tick icon-tick--on"></i> {item}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr><td><em>No inclusions listed</em></td></tr>
                                    )}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td><b>NOT INCLUDED</b></td>
                              <td>
                                <table>
                                  <tbody>
                                    {tourData.notIncluded && tourData.notIncluded.length > 0 ? (
                                      tourData.notIncluded.map((item, idx) => (
                                        <tr key={idx}>
                                          <td><i className="fa fa-times icon-tick icon-tick--off"></i> {item}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr><td><em>No exclusions listed</em></td></tr>
                                    )}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p>Ridiculus sociis dui eu vivamus tempor justo diam aliquam. Ipsum nunc purus, pede sed placerat sit habitasse potenti eleifend magna mus sociosqu hymenaeos cras metus mi donec tortor nisi leo dignissim turpis sit torquent.</p>
                        <p>Potenti mattis ad mollis eleifend Phasellus adipiscing ullamcorper interdum faucibus orci litora ornare aliquam. Ligula feugiat scelerisque. Molestie. Facilisi hac.</p>
                      </div>
                    )}

                    {/* Itinerary Tab */}
                    {activeTab === 'itinerary' && (
                      <div 
                        role="tabpanel" 
                        className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--itinerary_tab panel entry-content wc-tab active" 
                        id="tab-itinerary_tab"
                      >
                        {tourData.itinerary && tourData.itinerary.length > 0 ? (
                          tourData.itinerary.map((item, index) => (
                            <div key={item.day || index} className="interary-item">
                              <p><span className="icon-left">{item.day}</span></p>
                              <div className="item_content">
                                <h2><strong>{item.title}</strong></h2>
                                <p>{item.description}</p>
                                {item.activities && Array.isArray(item.activities) && (
                                  <ul>
                                    {item.activities.map((activity, idx) => (
                                      <li key={idx}>{activity}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No itinerary information available.</p>
                        )}
                      </div>
                    )}

                    {/* Location Tab */}
                    {activeTab === 'location' && (
                      <div 
                        role="tabpanel" 
                        className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--location_tab panel entry-content wc-tab active" 
                        id="tab-location_tab"
                      >
                        <div className="wrapper-gmap">
                          <div 
                            id="googleMapCanvas" 
                            className="google-map" 
                            data-lat="50.893577" 
                            data-long="-1.393483" 
                            data-address="European Way, Southampton, United Kingdom"
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                      <div 
                        role="tabpanel" 
                        className="tab-pane single-tour-tabs-panel single-tour-tabs-panel--reviews panel entry-content wc-tab active" 
                        id="tab-reviews"
                      >
                        <div id="reviews" className="travel_tour-Reviews">
                          <div id="comments">
                            <h2 className="travel_tour-Reviews-title">
                              {tourData.reviews.length} review for
                              <span> {tourData.title}</span>
                            </h2>
                            <ol className="commentlist">
                              {tourData.reviews && tourData.reviews.length > 0 ? (
                                tourData.reviews.map((review) => (
                                  <li 
                                    key={review.id} 
                                    itemscope="" 
                                    itemtype="http://schema.org/Review" 
                                    className="comment byuser comment-author-physcode bypostauthor even thread-even depth-1"
                                    id={`li-comment-${review.id}`}
                                  >
                                    <div id={`comment-${review.id}`} className="comment_container">
                                      <img 
                                        alt="" 
                                        src="/assets/img/avata.jpg" 
                                        className="avatar avatar-60 photo" 
                                        height="60" 
                                        width="60"
                                      />
                                      <div className="comment-text">
                                        <div className="star-rating" title={`Rated ${review.rating} out of 5`}>
                                          {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fa fa-star${i < review.rating ? '' : '-o'}`}></i>
                                          ))}
                                        </div>
                                        <p className="meta">
                                          <strong>{review.User?.name || 'Anonymous'}</strong> –
                                          <time dateTime={review.created_at}>
                                            {new Date(review.created_at).toLocaleDateString()}
                                          </time>
                                          :
                                        </p>
                                        <div className="description">
                                          <p>{review.comment}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))
                              ) : (
                                <li style={{ padding: '20px' }}>No reviews yet. Be the first to review!</li>
                              )}
                            </ol>
                          </div>

                          {/* Review Form */}
                          <div id="review_form_wrapper">
                            <div id="review_form">
                              <div id="respond" className="comment-respond">
                                <h3 id="reply-title" className="comment-reply-title">Add a review</h3>
                                <form 
                                  onSubmit={handleReviewSubmit}
                                  className="comment-form" 
                                  noValidate
                                >
                                  <p className="comment-notes">
                                    <span id="email-notes">Your email address will not be published.</span> Required fields are marked
                                    <span className="required">*</span>
                                  </p>
                                  <p className="comment-form-author">
                                    <label htmlFor="author">Name <span className="required">*</span></label>
                                    <input 
                                      id="author" 
                                      name="author" 
                                      type="text" 
                                      value={reviewForm.name}
                                      onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                                      size="30" 
                                      required=""
                                    />
                                  </p>
                                  <p className="comment-form-email">
                                    <label htmlFor="email">Email <span className="required">*</span></label>
                                    <input 
                                      id="email" 
                                      name="email" 
                                      type="email" 
                                      value={reviewForm.email}
                                      onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                                      size="30" 
                                      required=""
                                    />
                                  </p>
                                  <p className="comment-form-rating">
                                    <label>Your Rating</label>
                                  </p>
                                  <p className="stars">
                                    <span>
                                      {[...Array(5)].map((_, i) => (
                                        <i 
                                          key={i} 
                                          className={`fa fa-star${i < reviewForm.rating ? '' : '-o'}`}
                                          onClick={() => setReviewForm({...reviewForm, rating: i + 1})}
                                          style={{cursor: 'pointer'}}
                                        ></i>
                                      ))}
                                    </span>
                                  </p>
                                  <p className="comment-form-comment">
                                    <label htmlFor="comment">Your Review <span className="required">*</span></label>
                                    <textarea 
                                      id="comment" 
                                      name="comment" 
                                      cols="45" 
                                      rows="8" 
                                      value={reviewForm.comment}
                                      onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                      required=""
                                    ></textarea>
                                  </p>
                                  <p className="form-submit">
                                    <input 
                                      name="submit" 
                                      type="submit" 
                                      id="submit" 
                                      className="submit" 
                                      value={submitting ? "Submitting..." : "Submit"}
                                      disabled={submitting}
                                    />
                                  </p>
                                </form>
                              </div>
                            </div>
                          </div>
                          <div className="clear"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Related Tours */}
                <div className="related tours">
                  <h2>Related Tours</h2>
                  <ul className="tours products wrapper-tours-slider">
                    {tourData.relatedTours.map((tour) => (
                      <li key={tour.id} className="item-tour col-md-4 col-sm-6 product">
                        <div className="item_border item-product">
                          <div className="post_images">
                            <Link to={`/tours/${tour.id}`}>
                              {tour.sale ? (
                                <>
                                  <span className="price">
                                    <del>${tour.originalPrice.toFixed(2)}</del>
                                    <ins>${tour.price.toFixed(2)}</ins>
                                  </span>
                                  <span className="onsale">Sale!</span>
                                </>
                              ) : (
                                <span className="price">KES {tour.price.toFixed(2)}</span>
                              )}
                              <img 
                                width="430" 
                                height="305" 
                                src={tour.image} 
                                alt={tour.title} 
                                title={tour.title}
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
                                <Link to={`/tours/${tour.id}`} rel="bookmark">{tour.title}</Link>
                              </h4>
                            </div>
                            <span className="post_date">{tour.duration}</span>
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
                            <Link to={`/tours/${tour.id}`} className="button product_type_tour_phys add_to_cart_button">
                              Read more
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Booking & Sidebar */}
              <div className="summary entry-summary description_single">
                <div className="affix-sidebar">
                  <div className="entry-content-tour">
                    <p className="price">
                      <span className="text">Price:</span>
                      <span className="travel_tour-Price-amount amount">KES {tourData.price.toFixed(2)}</span>
                    </p>
                    <div className="clear"></div>
                    
                    {/* Booking Form */}
                    <div className="booking">
                      <div className="">
                        <div className="form-block__title">
                          <h4>Book the tour</h4>
                        </div>
                        {!isAuthenticated ? (
                          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', textAlign: 'center' }}>
                            <p style={{ marginBottom: '15px' }}>You must be logged in to book this tour.</p>
                            <button 
                              onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
                              style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Login to Book
                            </button>
                          </div>
                        ) : (
                          <Formik
                            initialValues={initialBookingValues()}
                            validationSchema={BookingSchema}
                            onSubmit={handleBookingSubmit}
                          >
                            {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
                              <form onSubmit={handleSubmit} id="tourBookingForm" method="POST" noValidate>
                                <div className="">
                                  <input
                                    name="name"
                                    placeholder="Full name *"
                                    type="text"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{
                                      borderColor: errors.name && touched.name ? '#dc3545' : '',
                                      border: errors.name && touched.name ? '1px solid #dc3545' : ''
                                    }}
                                  />
                                  {errors.name && touched.name && (
                                    <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                                      {errors.name}
                                    </div>
                                  )}
                                </div>
                                <div className="">
                                  <input
                                    name="email"
                                    placeholder="Email *"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{
                                      borderColor: errors.email && touched.email ? '#dc3545' : '',
                                      border: errors.email && touched.email ? '1px solid #dc3545' : ''
                                    }}
                                  />
                                  {errors.email && touched.email && (
                                    <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                                      {errors.email}
                                    </div>
                                  )}
                                </div>
                                <div className="">
                                  <input
                                    name="phone"
                                    placeholder="Phone"
                                    type="text"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </div>
                                <div className="">
                                  <input
                                    name="age"
                                    placeholder="Age"
                                    type="number"
                                    min="0"
                                    max="120"
                                    value={values.age}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </div>
                                <div className="">
                                  <input
                                    name="passport_number"
                                    placeholder="Passport Number"
                                    type="text"
                                    value={values.passport_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </div>
                                <div className="">
                                  <select
                                    name="nationality"
                                    value={values.nationality}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                  >
                                    <option value="Kenyan">Kenyan</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                <div className="">
                                  <label>Start Date *</label>
                                  <input
                                    type="date"
                                    name="start_date"
                                    value={values.start_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{
                                      borderColor: errors.start_date && touched.start_date ? '#dc3545' : '',
                                      border: errors.start_date && touched.start_date ? '1px solid #dc3545' : ''
                                    }}
                                  />
                                  {errors.start_date && touched.start_date && (
                                    <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                                      {errors.start_date}
                                    </div>
                                  )}
                                </div>
                                <div className="">
                                  <label>End Date</label>
                                  <input
                                    type="date"
                                    name="end_date"
                                    value={values.end_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </div>
                                <div className="from-group">
                                  <div className="total_price_arrow">
                                    <div className="st_adults_children">
                                      <span className="label">Adults</span>
                                      <div className="input-number-ticket">
                                        <input
                                          type="number"
                                          name="adults"
                                          value={values.adults}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          min="1"
                                          max="10"
                                          placeholder="Number ticket of Adults"
                                        />
                                      </div>
                                      ×
                                      KES {tourData.price.toFixed(2)}
                                      =
                                      <span className="total_price_adults">KES {(parseInt(values.adults || 0) * tourData.price).toFixed(2)}</span>
                                    </div>
                                    <div className="st_adults_children">
                                      <span className="label">Children</span>
                                      <div className="input-number-ticket">
                                        <input
                                          type="number"
                                          name="children"
                                          value={values.children}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          min="0"
                                          max="10"
                                          placeholder="Number ticket of Children"
                                        />
                                        <input type="hidden" name="price_child" value={tourData.priceChild} />
                                        <input type="hidden" name="price_child_set_on_tour" value="0" />
                                      </div>
                                      ×
                                      KES {tourData.priceChild.toFixed(2)}
                                      =
                                      <span className="total_price_children">KES {(parseInt(values.children || 0) * tourData.priceChild).toFixed(2)}</span>
                                    </div>
                                    <div>
                                      Total =
                                      <span className="total_price_adults_children">KES {calculateTotalPrice(values).toFixed(2)}</span>
                                    </div>
                                    <input type="hidden" name="price_children_percent" value="70" />
                                  </div>
                                </div>
                                <div className="">
                                  <label>Special Requests</label>
                                  <textarea
                                    name="special_requests"
                                    value={values.special_requests}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Any special requests or requirements?"
                                    rows="3"
                                    style={{ width: '100%', padding: '8px' }}
                                  />
                                </div>
                                <div className="spinner">
                                  <div className="rect1"></div>
                                  <div className="rect2"></div>
                                  <div className="rect3"></div>
                                  <div className="rect4"></div>
                                  <div className="rect5"></div>
                                </div>
                                <input
                                  className="btn-booking btn"
                                  value={isSubmitting || submitting ? 'Booking...' : 'Booking now'}
                                  type="submit"
                                  disabled={isSubmitting || submitting}
                                />
                              </form>
                            )}
                          </Formik>
                        )}
                      </div>
                    </div>

                    {/* Enquiry Form */}
                    <div className="form-block__title custom-form-title"><h4>Or</h4></div>
                    <div className="custom_from">
                      <div role="form" className="wpcf7" lang="en-US" dir="ltr">
                        <div className="screen-reader-response"></div>
                        <form onSubmit={(e) => {
                          e.preventDefault()
                          alert('Enquiry form submitted!')
                          setEnquiryForm({ name: '', email: '', message: '' })
                        }} className="wpcf7-form" noValidate>
                          <p>Fill up the form below to tell us what you're looking for</p>
                          <p>
                            <span className="wpcf7-form-control-wrap your-name">
                              <input 
                                type="text" 
                                name="your-name" 
                                value={enquiryForm.name}
                                onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
                                placeholder="Your name*" 
                                className="wpcf7-form-control" 
                                aria-invalid="false"
                              />
                            </span>
                          </p>
                          <p>
                            <span className="wpcf7-form-control-wrap your-email">
                              <input 
                                type="email" 
                                name="your-email" 
                                value={enquiryForm.email}
                                onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
                                placeholder="Email*" 
                                className="wpcf7-form-control" 
                                aria-invalid="false"
                              />
                            </span>
                          </p>
                          <p>
                            <span className="wpcf7-form-control-wrap your-message">
                              <textarea 
                                name="your-message" 
                                cols="40" 
                                rows="10" 
                                value={enquiryForm.message}
                                onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                                className="wpcf7-form-control" 
                                aria-invalid="false" 
                                placeholder="Message"
                              ></textarea>
                            </span>
                          </p>
                          <p>
                            <input 
                              type="submit" 
                              value="Send Enquiry" 
                              className="wpcf7-form-control wpcf7-submit"
                            />
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Special Tours Widget */}
                  <aside className="widget widget_travel_tour">
                    <div className="wrapper-special-tours">
                      {tourData.relatedTours.slice(0, 3).map((tour, index) => (
                        <div key={index} className="inner-special-tours">
                          <Link to={`/tours/${tour.id}`}>
                            {tour.sale && <span className="onsale">Sale!</span>}
                            <img 
                              width="430" 
                              height="305" 
                              src={tour.image} 
                              alt={tour.title} 
                              title={tour.title}
                              onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                            />
                          </Link>
                          <div className="item_rating">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fa fa-star${i < 4 ? '' : '-o'}`}></i>
                            ))}
                          </div>
                          <div className="post_title">
                            <h3>
                              <Link to={`/tours/${tour.id}`} rel="bookmark">{tour.title}</Link>
                            </h3>
                          </div>
                          <div className="item_price">
                            {tour.sale ? (
                              <span className="price">
                                <del>KES {tour.originalPrice.toFixed(2)}</del>
                                <ins>KES {tour.price.toFixed(2)}</ins>
                              </span>
                            ) : (
                              <span className="price">KES {tour.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

















































