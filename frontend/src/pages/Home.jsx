// import { useEffect, useRef } from 'react'
// import { Link } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchPackages } from '../features/packages/packageSlice'
// import Spinner from '../components/Spinner'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// // Import Swiper styles
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

// export default function Home() {
//   const dispatch = useDispatch();
//   const { loading, packages, error } = useSelector(state => state.packages);
  
//   // Refs for Swiper instances
//   const popularSwiperRef = useRef(null);
//   const dealsSwiperRef = useRef(null);

//   // Compute deals (packages with a lower discount_price)
//   const dealPackages = packages
//     .filter(p => {
//       const adult = parseFloat(p.price_adult || 0);
//       const disc = parseFloat(p.discount_price || 0);
//       return disc > 0 && disc < adult;
//     })
//     .slice(0, 6); // Show up to 6 deals

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-KENYA', { style: 'currency', currency: 'KES' }).format(price);
//   };

//   useEffect(() => {
//     dispatch(fetchPackages());
//   }, [dispatch]);

//   // Initialize tooltips after packages arrive
//   useEffect(() => {
//     if (window.$ && window.$.fn.tooltip) {
//       // eslint-disable-next-line no-undef
//       $('[data-toggle="tooltip"]').tooltip();
//     }
//   }, [packages]);

//   // Helper to get image URL
//   const getImageUrl = (pkg) => {
//     const primary = pkg.PackageImages?.find(img => img.is_primary) || pkg.PackageImages?.[0];
//     if (primary && primary.url) {
//       let url = primary.url;
//       if (!url.startsWith('/')) url = `/uploads/${url}`;
//       return url;
//     }
//     return '/assets/img/placeholder.jpg';
//   };

//   // Reusable Tour Card Component
//   const TourCard = ({ pkg }) => {
//     const adultPrice = parseFloat(pkg.price_adult || 0);
//     const childPrice = parseFloat(pkg.price_child || 0);
//     const adultDiscount = pkg.discount_price ? parseFloat(pkg.discount_price) : null;
//     const hasAdultDiscount = adultDiscount && adultDiscount < adultPrice;
//     const imageUrl = getImageUrl(pkg);

//     return (
//       <div className="item-tour" style={{ height: '100%' }}>
//         <div className="item_border" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          
//           {/* Image Section */}
//           <div className="post_images" style={{ position: 'relative', width: '100%', paddingTop: '65%', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
//             <Link to={`/tours/${pkg.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
              
//               {/* Adult Price Badge (Top Left - Amber) */}
//               <div className="price-badge adult" style={{
//                 position: 'absolute', left: '10px', top: '10px', zIndex: 2,
//                 backgroundColor: '#ffb300', color: '#fff', padding: '6px 10px',
//                 borderRadius: '4px', fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap'
//               }}>
//                 Adult: {hasAdultDiscount ? (
//                   <>
//                     <del style={{ marginRight: '4px', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>{formatPrice(adultPrice)}</del>
//                     <ins style={{ textDecoration: 'none', color: '#fff' }}>{formatPrice(adultDiscount)}</ins>
//                   </>
//                 ) : (
//                   formatPrice(adultPrice)
//                 )}
//               </div>

//               {/* Child Price Badge (Bottom Left - Blue) */}
//               {childPrice > 0 && (
//                 <div className="price-badge child" style={{
//                   position: 'absolute', left: '10px', bottom: '10px', zIndex: 2,
//                   backgroundColor: '#26bdf7', color: '#fff', padding: '6px 10px',
//                   borderRadius: '4px', fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap'
//                 }}>
//                   Child: {formatPrice(childPrice)}
//                 </div>
//               )}

//               {/* Sale Badge */}
//               {hasAdultDiscount && (
//                 <span className="onsale" style={{
//                   position: 'absolute', top: '10px', right: '10px', background: '#d32f2f',
//                   color: '#fff', padding: '4px 8px', borderRadius: '4px', zIndex: 2, fontSize: '0.8rem', fontWeight: 'bold'
//                 }}>Sale!</span>
//               )}

//               <img 
//                 src={imageUrl} 
//                 alt={pkg.title || pkg.name} 
//                 title={pkg.title || pkg.name} 
//                 style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
//                 onError={(e) => e.target.src = '/assets/img/placeholder.jpg'} 
//               />
//             </Link>

//             {/* Icons */}
//             <div className="group-icon" style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 2, display: 'flex', gap: '5px' }}>
//               <a href="#" data-toggle="tooltip" data-placement="top" title={pkg.category || ''} className="frist" style={{ background: 'rgba(255,255,255,0.9)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: '#333' }}>
//                 <i className="flaticon-airplane-4"></i>
//               </a>
//               <a href="#" data-toggle="tooltip" data-placement="top" title={pkg.destination || ''} style={{ background: 'rgba(255,255,255,0.9)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: '#333' }}>
//                 <i className="flaticon-transport-2"></i>
//               </a>
//             </div>
//           </div>

//           {/* Content Section */}
//           <div className="wrapper_content" style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
//             <div className="post_title">
//               <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', minHeight: '3.2rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
//                 <Link to={`/tours/${pkg.id}`} rel="bookmark" style={{ textDecoration: 'none', color: '#333', fontWeight: '600' }}>
//                   {pkg.title || pkg.name}
//                 </Link>
//               </h4>
//             </div>
//             <span className="post_date" style={{ display: 'block', marginBottom: '10px', color: '#777', fontSize: '0.9rem', fontWeight: '500' }}>
//               <i className="fa fa-clock-o" style={{marginRight:'5px'}}></i>
//               {pkg.duration_days || 0} DAYS {pkg.duration_nights || 0} NIGHTS
//             </span>
//             <div className="description" style={{ flex: 1 }}>
//               <p style={{ margin: 0, color: '#555', lineHeight: '1.5', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
//                 {pkg.description ? (pkg.description.length > 100 ? pkg.description.substring(0, 100) + '...' : pkg.description) : 'Aliquam lacus nisl, viverra convallis sit amet penatibus nunc luctus'}
//               </p>
//             </div>
//           </div>

//           {/* Footer Section */}
//           <div className="read_more" style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9' }}>
//             <div className="item_rating">
//               <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
//               <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
//               <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
//               <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
//               <i className="fa fa-star-o" style={{ color: '#ffc107' }}></i>
//             </div>
//             <Link to={`/tours/${pkg.id}`} className="button product_type_tour_phys" style={{
//               color: '#fff', fontWeight: 'bold', textDecoration: 'none',
//               backgroundColor: '#26bdf7', padding: '8px 20px', borderRadius: '0 4px 4px 0',
//               clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)',
//               marginLeft: '10px'
//             }}>
//               READ MORE <i className="fa fa-arrow-right" style={{marginLeft:'5px'}}></i>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="home-content" role="main">
      
//       {/* Hero Video Slider */}
//       <div className="wrapper-bg-video">
//         <video poster="/assets/img/video_slider.jpg" playsInline autoPlay muted loop>
//           <source src="https://physcode.com/video/330149744.mp4" type="video/mp4" />
//         </video>
//         <div className="content-slider">
//           <p>Find your special tour today</p>
//           <h2>With Sharavista Tours</h2>
//           <p><Link to="/tours" className="btn btn-slider">VIEW TOURS</Link></p>
//         </div>
//       </div>

//       {/* Search Form */}
//       <div className="slider-tour-booking">
//         <div className="container">
//           <div className="travel-booking-search hotel-booking-search travel-booking-style_1">
//             <form className="form-tour-booking" onSubmit={(e) => e.preventDefault()}>
//               <div className="form-group">
//                 <label>Tour Name</label>
//                 <input type="text" className="form-control" placeholder="Search by tour name..." style={{width:'100%', padding:'10px', borderRadius:'4px', border:'1px solid #ddd'}} />
//               </div>
//               <div className="form-group">
//                 <label>Tour Type</label>
//                 <select className="form-control" style={{width:'100%', padding:'10px', borderRadius:'4px', border:'1px solid #ddd'}}>
//                   <option value="">All Tour Types</option>
//                   <option value="escorted-tour">Escorted Tour</option>
//                   <option value="rail-tour">Rail Tour</option>
//                   <option value="river-cruise">River Cruise</option>
//                   <option value="tour-cruise">Tour & Cruise</option>
//                   <option value="wildlife">Wildlife</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Destination</label>
//                 <select className="form-control" style={{width:'100%', padding:'10px', borderRadius:'4px', border:'1px solid #ddd'}}>
//                   <option value="">All Destinations</option>
//                   <option value="brazil">Brazil</option>
//                   <option value="canada">Canada</option>
//                   <option value="cuba">Cuba</option>
//                   <option value="italy">Italy</option>
//                   <option value="philippines">Philippines</option>
//                   <option value="usa">USA</option>
//                 </select>
//               </div>
//               <div className="form-group" style={{display:'flex', alignItems:'flex-end'}}>
//                 <button type="submit" className="btn btn-primary" style={{width: '100%', padding:'10px', backgroundColor:'#ffb300', color:'#fff', border:'none', borderRadius:'4px', fontWeight:'bold', cursor:'pointer'}}>Search</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Why Choose Us */}
//       <div className="container two-column-respon mg-top-6x mg-bt-6x">
//         <div className="row">
//           <div className="col-sm-12 mg-btn-6x">
//             <div className="shortcode_title title-center title-decoration-bottom-center">
//               <h3 className="title_primary">WHY CHOOSE US?</h3>
//               <span className="line_after_title"></span>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           {[
//             { icon: 'flaticon-transport-6', title: 'Diverse Destinations', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.' },
//             { icon: 'flaticon-sand', title: 'Value for Money', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.' },
//             { icon: 'flaticon-travel-2', title: 'Beautiful Places', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.' },
//             { icon: 'flaticon-travelling', title: 'Passionate Travel', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.' }
//           ].map((item, index) => (
//             <div key={index} className="wpb_column col-sm-3" style={{marginBottom:'20px'}}>
//               <div className="widget-icon-box widget-icon-box-base iconbox-center">
//                 <div className="boxes-icon circle" style={{fontSize:'30px',width:'80px', height:'80px',lineHeight:'80px', margin:'0 auto 15px auto', background:'#f5f5f5', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
//                   <span className="inner-icon"><i className={`vc_icon_element-icon ${item.icon}`} style={{color:'#ffb300'}}></i></span>
//                 </div>
//                 <div className="content-inner">
//                   <div className="sc-heading article_heading">
//                     <h4 className="heading__primary">{item.title}</h4>
//                   </div>
//                   <div className="desc-icon-box">
//                     <div>{item.desc}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Most Popular Tours - SWIPER */}
//       <div className="padding-top-6x padding-bottom-6x section-background" style={{backgroundImage: 'url(/assets/img/home/bg-popular.jpg)', backgroundSize:'cover'}}>
//         <div className="container">
//           <div className="shortcode_title text-white title-center title-decoration-bottom-center">
//             <div className="title_subtitle">Take a Look at Our</div>
//             <h3 className="title_primary">MOST POPULAR TOURS</h3>
//             <span className="line_after_title" style={{color:'#ffffff'}}></span>
//           </div>
          
//           <div className="row wrapper-tours-slider" style={{position:'relative', marginTop:'30px'}}>
//             {loading && <div style={{textAlign:'center', width:'100%', color:'#fff'}}><Spinner /></div>}
            
//             {!loading && error && (
//               <div className="alert alert-danger" style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', borderRadius: '8px', width: '100%' }}>
//                 Error: {error}
//               </div>
//             )}

//             {!loading && !error && packages.length > 0 && (
//               <>
//                 {/* Custom Navigation Buttons */}
//                 <button className="swiper-nav-prev" onClick={() => popularSwiperRef.current?.swiper.slidePrev()} style={{
//                   position:'absolute', left:'-50px', top:'50%', transform:'translateY(-50%)', zIndex:10,
//                   background:'#fff', color:'#333', border:'none', width:'40px', height:'40px', borderRadius:'50%',
//                   cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
//                 }}>
//                   <i className="fa fa-chevron-left"></i>
//                 </button>
//                 <button className="swiper-nav-next" onClick={() => popularSwiperRef.current?.swiper.slideNext()} style={{
//                   position:'absolute', right:'-50px', top:'50%', transform:'translateY(-50%)', zIndex:10,
//                   background:'#fff', color:'#333', border:'none', width:'40px', height:'40px', borderRadius:'50%',
//                   cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
//                 }}>
//                   <i className="fa fa-chevron-right"></i>
//                 </button>

//                 <Swiper
//                   ref={popularSwiperRef}
//                   modules={[Navigation, Pagination]}
//                   spaceBetween={20}
//                   slidesPerView={1}
//                   navigation={false} // Using custom buttons
//                   pagination={{ clickable: true }}
//                   breakpoints={{
//                     0: { slidesPerView: 1 },
//                     480: { slidesPerView: 2 },
//                     768: { slidesPerView: 2 },
//                     992: { slidesPerView: 3 },
//                     1200: { slidesPerView: 4 }
//                   }}
//                   style={{ width: '100%', paddingBottom: '40px' }}
//                 >
//                   {packages.slice(0, 8).map(pkg => (
//                     <SwiperSlide key={pkg.id}>
//                       <TourCard pkg={pkg} />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Destination Carousel (Static Grid for now as per template) */}
//       <div className="section-white padding-top-6x padding-bottom-6x tours-type">
//         <div className="container">
//           <div className="shortcode_title title-center title-decoration-bottom-center">
//             <div className="title_subtitle">Find a Tour by</div>
//             <h3 className="title_primary">DESTINATION</h3>
//             <span className="line_after_title"></span>
//           </div>
//           <div className="row" style={{marginTop:'30px'}}>
//             {[
//               { name: 'Brazil', image: '/assets/img/city/brazil.jpg' },
//               { name: 'Philippines', image: '/assets/img/city/philippines.jpg' },
//               { name: 'Italy', image: '/assets/img/city/italy.jpg' },
//               { name: 'USA', image: '/assets/img/city/usa.jpg' },
//               { name: 'Canada', image: '/assets/img/city/canada.jpg' },
//               { name: 'Cuba', image: '/assets/img/city/cuba.jpg' }
//             ].map((dest, index) => (
//               <div key={index} className="col-sm-4 col-md-2" style={{marginBottom:'20px'}}>
//                 <div className="tours_type_item" style={{position:'relative', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
//                   <Link to="/tours" className="tours-type__item__image" style={{display:'block'}}>
//                     <img src={dest.image} alt={dest.name} style={{width:'100%', height:'auto', display:'block', transition:'transform 0.3s'}} onMouseOver={(e)=>e.target.style.transform='scale(1.1)'} onMouseOut={(e)=>e.target.style.transform='scale(1)'} />
//                   </Link>
//                   <div className="content-item" style={{position:'absolute', bottom:'0', left:'0', right:'0', background:'rgba(0,0,0,0.6)', padding:'10px', textAlign:'center'}}>
//                     <div className="item__title" style={{color:'#fff', fontWeight:'bold', fontSize:'1rem'}}>{dest.name}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Center Achievements */}
//       <div className="padding-top-6x padding-bottom-6x bg__shadow section-background" style={{backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)', backgroundSize:'cover'}}>
//         <div className="container">
//           <div className="shortcode_title text-white title-center title-decoration-bottom-center">
//             <div className="title_subtitle">Some statistics about Sharavista Tours</div>
//             <h3 className="title_primary">CENTER ACHIEVEMENTS</h3>
//             <span className="line_after_title" style={{color:'#ffffff'}}></span>
//           </div>
//           <div className="row" style={{marginTop:'30px'}}>
//             {[
//               { value: '94,532', label: 'Customers', icon: 'flaticon-airplane' },
//               { value: '1,021', label: 'Destinations', icon: 'flaticon-island' },
//               { value: '20,096', label: 'Tours', icon: 'flaticon-globe' },
//               { value: '12', label: 'Tour types', icon: 'flaticon-people' }
//             ].map((stat, index) => (
//               <div key={index} className="col-sm-3" style={{marginBottom:'20px', textAlign:'center'}}>
//                 <div className="stats_counter text-white">
//                   <div className="wrapper-icon" style={{fontSize:'40px', marginBottom:'15px', color:'#ffb300'}}>
//                     <i className={stat.icon}></i>
//                   </div>
//                   <div className="stats_counter_number" style={{fontSize:'2.5rem', fontWeight:'bold'}}>{stat.value}</div>
//                   <div className="stats_counter_title">{stat.label}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Deals and Discounts - SWIPER */}
//       <div className="section-white padding-top-6x padding-bottom-6x">
//         <div className="container">
//           <div className="shortcode_title title-center title-decoration-bottom-center">
//             <h3 className="title_primary">DEALS AND DISCOUNTS</h3>
//             <span className="line_after_title"></span>
//           </div>
          
//           <div className="row wrapper-tours-slider" style={{position:'relative', marginTop:'30px'}}>
//             {!loading && !error && dealPackages.length > 0 && (
//               <>
//                 <button className="swiper-nav-prev" onClick={() => dealsSwiperRef.current?.swiper.slidePrev()} style={{
//                   position:'absolute', left:'-50px', top:'50%', transform:'translateY(-50%)', zIndex:10,
//                   background:'#fff', color:'#333', border:'none', width:'40px', height:'40px', borderRadius:'50%',
//                   cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
//                 }}>
//                   <i className="fa fa-chevron-left"></i>
//                 </button>
//                 <button className="swiper-nav-next" onClick={() => dealsSwiperRef.current?.swiper.slideNext()} style={{
//                   position:'absolute', right:'-50px', top:'50%', transform:'translateY(-50%)', zIndex:10,
//                   background:'#fff', color:'#333', border:'none', width:'40px', height:'40px', borderRadius:'50%',
//                   cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
//                 }}>
//                   <i className="fa fa-chevron-right"></i>
//                 </button>

//                 <Swiper
//                   ref={dealsSwiperRef}
//                   modules={[Navigation, Pagination, Autoplay]}
//                   spaceBetween={20}
//                   slidesPerView={1}
//                   navigation={false}
//                   pagination={{ clickable: true }}
//                   autoplay={{ delay: 5000 }}
//                   breakpoints={{
//                     0: { slidesPerView: 1 },
//                     480: { slidesPerView: 1 },
//                     768: { slidesPerView: 2 },
//                     992: { slidesPerView: 2 },
//                     1200: { slidesPerView: 3 }
//                   }}
//                   style={{ width: '100%', paddingBottom: '40px' }}
//                 >
//                   {dealPackages.map(pkg => (
//                     <SwiperSlide key={pkg.id}>
//                       <TourCard pkg={pkg} />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </>
//             )}
//             {!loading && !error && dealPackages.length === 0 && (
//               <p style={{textAlign:'center', width:'100%'}}>No current deals available.</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Special Offer */}
//       <div className="bg__shadow padding-top-6x padding-bottom-6x section-background" style={{backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)', backgroundSize:'cover'}}>
//         <div className="container">
//           <div className="row">
//             <div className="col-sm-2"></div>
//             <div className="col-sm-8">
//               <div className="discounts-tour" style={{textAlign:'center', color:'#fff'}}>
//                 <h3 className="discounts-title" style={{color:'#ffffff', marginBottom:'20px'}}> 
//                   Special Tour in April, Discover Australia for 100 customers with
//                   <span style={{color:'#ffb300', fontWeight:'bold'}}> discount 50%</span>
//                 </h3>
//                 <span className="line" style={{display:'block', width:'100px', height:'3px', background:'#ffb300', margin:'20px auto'}}></span>
//                 <p style={{color:'#ffffff', fontSize:'1.1rem'}}>It's limited seating! Hurry up</p>
//                 <div className="col-sm-12 text-center padding-top-2x">
//                   <a href="/tours/special" className="icon-btn" style={{display:'inline-block', background:'#ffb300', color:'#fff', padding:'12px 30px', borderRadius:'50px', textDecoration:'none', fontWeight:'bold', marginTop:'20px'}}>
//                     <i className="flaticon-airplane-4"></i> Get tour 
//                   </a>
//                 </div>
//               </div>
//             </div>
//             <div className="col-sm-2"></div>
//           </div>
//         </div>
//       </div>

//       {/* Reviews & Latest Posts */}
//       <div className="section-white padding-top-6x padding-bottom-6x">
//         <div className="container">
//           <div className="row">
//             <div className="col-sm-4" style={{marginBottom:'30px'}}>
//               <div className="shortcode_title title-center title-decoration-bottom-center">
//                 <h2 className="title_primary">Tours Reviews</h2>
//                 <span className="line_after_title"></span>
//               </div>
//               <div className="shortcode-tour-reviews wrapper-tours-slider">
//                 <Swiper
//                   modules={[Pagination, Autoplay]}
//                   spaceBetween={20}
//                   slidesPerView={1}
//                   pagination={{ clickable: true }}
//                   autoplay={{ delay: 5000 }}
//                   style={{width:'100%'}}
//                 >
//                   {[
//                     { name: 'Jessica', tour: 'Canadian Rockies', comment: 'The sightseeing and activities were better than we even thought! I still can\'t believe we did so much in such a short time' },
//                     { name: 'Michael', tour: 'Maasai Mara Safari', comment: 'Absolutely amazing safari experience! Saw all the Big Five and the guides were incredibly knowledgeable.' },
//                     { name: 'Sarah', tour: 'Diani Beach Paradise', comment: 'Our family beach getaway was perfect. The kids loved the activities and we adults enjoyed the relaxation.' }
//                   ].map((review, index) => (
//                     <SwiperSlide key={index}>
//                       <div className="tour-reviews-item" style={{background:'#f9f9f9', padding:'20px', borderRadius:'8px', marginBottom:'20px', boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
//                         <div className="reviews-item-info" style={{display:'flex', alignItems:'center', marginBottom:'15px'}}>
//                           <img alt={review.name} src="/assets/img/avata.jpg" className="avatar avatar-95 photo" height="60" width="60" style={{borderRadius:'50%', marginRight:'15px', border:'2px solid #ffb300'}} />
//                           <div>
//                             <div className="reviews-item-info-name" style={{fontWeight:'bold', color:'#333'}}>{review.name}</div>
//                             <div className="reviews-item-rating">
//                               <i className="fa fa-star" style={{color:'#ffc107'}}></i>
//                               <i className="fa fa-star" style={{color:'#ffc107'}}></i>
//                               <i className="fa fa-star" style={{color:'#ffc107'}}></i>
//                               <i className="fa fa-star" style={{color:'#ffc107'}}></i>
//                               <i className="fa fa-star" style={{color:'#ffc107'}}></i>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="reviews-item-content">
//                           <h3 className="reviews-item-title" style={{margin:'0 0 10px 0', fontSize:'1.1rem', color:'#333'}}>
//                             <Link to="#" style={{textDecoration:'none', color:'inherit'}}>{review.tour}</Link>
//                           </h3>
//                           <div className="reviews-item-description" style={{color:'#555', lineHeight:'1.6', fontStyle:'italic'}}>"{review.comment}"</div>
//                         </div>
//                       </div>
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//             </div>
//             <div className="col-sm-8">
//               <div className="shortcode_title title-center title-decoration-bottom-center">
//                 <h2 className="title_primary">Latest Post</h2>
//                 <span className="line_after_title"></span>
//               </div>
//               <div className="row">
//                 <div className="post_list_content_unit col-sm-6" style={{marginBottom:'30px'}}>
//                   <div className="feature-image" style={{marginBottom:'15px', overflow:'hidden', borderRadius:'8px', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
//                     <Link to="#" className="entry-thumbnail" style={{display:'block'}}>
//                       <img width="370" height="260" src="/assets/img/blog/201H.jpg" alt="Love advice from experts" style={{width:'100%', height:'auto', display:'block', transition:'transform 0.3s'}} onMouseOver={(e)=>e.target.style.transform='scale(1.05)'} onMouseOut={(e)=>e.target.style.transform='scale(1)'} />
//                     </Link>
//                   </div>
//                   <div className="post-list-content">
//                     <div className="post_list_inner_content_unit">
//                       <h3 className="post_list_title" style={{margin:'0 0 10px 0', fontSize:'1.2rem', fontWeight:'600'}}>
//                         <Link to="/blog/single" rel="bookmark" style={{textDecoration:'none', color:'#333'}}>Love advice from experts</Link>
//                       </h3>
//                       <div className="wrapper-meta" style={{fontSize:'0.85rem', color:'#777', marginBottom:'10px'}}>
//                         <div className="date-time">September 6, 2016</div>
//                         <div className="post_list_cats">
//                           <Link to="#" rel="category tag" style={{color:'#26bdf7', marginLeft:'10px', textDecoration:'none'}}>Travel Tips</Link>
//                         </div>
//                       </div>
//                       <div className="post_list_item_excerpt" style={{color:'#555', lineHeight:'1.6'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="post_list_content_unit col-sm-6" style={{marginBottom:'30px'}}>
//                   <div className="feature-image" style={{marginBottom:'15px', overflow:'hidden', borderRadius:'8px', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
//                     <Link to="#" className="entry-thumbnail" style={{display:'block'}}>
//                       <img width="370" height="260" src="/assets/img/blog/86H.jpg" alt="The perfect summer body" style={{width:'100%', height:'auto', display:'block', transition:'transform 0.3s'}} onMouseOver={(e)=>e.target.style.transform='scale(1.05)'} onMouseOut={(e)=>e.target.style.transform='scale(1)'} />
//                     </Link>
//                   </div>
//                   <div className="post-list-content">
//                     <div className="post_list_inner_content_unit">
//                       <h3 className="post_list_title" style={{margin:'0 0 10px 0', fontSize:'1.2rem', fontWeight:'600'}}>
//                         <Link to="/blog/single" rel="bookmark" style={{textDecoration:'none', color:'#333'}}>The perfect summer body</Link>
//                       </h3>
//                       <div className="wrapper-meta" style={{fontSize:'0.85rem', color:'#777', marginBottom:'10px'}}>
//                         <div className="date-time">September 6, 2016</div>
//                         <div className="post_list_cats">
//                           <Link to="#" rel="category tag" style={{color:'#26bdf7', marginLeft:'10px', textDecoration:'none'}}>Health</Link>
//                         </div>
//                       </div>
//                       <div className="post_list_item_excerpt" style={{color:'#555', lineHeight:'1.6'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPackages } from '../features/packages/packageSlice'
import Spinner from '../components/Spinner'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function Home() {
  const dispatch = useDispatch();
  const { loading, packages, error } = useSelector(state => state.packages);
  
  // Refs for Swiper instances
  const popularSwiperRef = useRef(null);
  const dealsSwiperRef = useRef(null);

  // Compute deals (packages with a lower discount_price)
  const dealPackages = packages
    .filter(p => {
      const adult = parseFloat(p.price_adult || 0);
      const disc = parseFloat(p.discount_price || 0);
      return disc > 0 && disc < adult;
    })
    .slice(0, 6);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KENYA', { style: 'currency', currency: 'KES' }).format(price);
  };

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  // Initialize tooltips after packages arrive
  useEffect(() => {
    if (window.$ && window.$.fn.tooltip) {
      // eslint-disable-next-line no-undef
      $('[data-toggle="tooltip"]').tooltip();
    }
  }, [packages]);

  // Helper to get image URL
  const getImageUrl = (pkg) => {
    const primary = pkg.PackageImages?.find(img => img.is_primary) || pkg.PackageImages?.[0];
    if (primary && primary.url) {
      let url = primary.url;
      if (!url.startsWith('/')) url = `/uploads/${url}`;
      return url;
    }
    return '/assets/img/placeholder.jpg';
  };

  // Reusable Tour Card Component
  const TourCard = ({ pkg }) => {
    const adultPrice = parseFloat(pkg.price_adult || 0);
    const childPrice = parseFloat(pkg.price_child || 0);
    const adultDiscount = pkg.discount_price ? parseFloat(pkg.discount_price) : null;
    const hasAdultDiscount = adultDiscount && adultDiscount < adultPrice;
    const imageUrl = getImageUrl(pkg);

    return (
      <div className="item-tour" style={{ height: '100%' }}>
        <div className="item_border" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          
          {/* Image Section */}
          <div className="post_images" style={{ position: 'relative', width: '100%', paddingTop: '65%', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
            <Link to={`/tours/${pkg.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
              
              {/* Adult Price Badge (Top Left - Amber) */}
              <div className="price-badge adult" style={{
                position: 'absolute', left: '10px', top: '10px', zIndex: 2,
                backgroundColor: '#ffb300', color: '#fff', padding: '6px 10px',
                borderRadius: '4px', fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap'
              }}>
                Adult: {hasAdultDiscount ? (
                  <>
                    <del style={{ marginRight: '4px', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>{formatPrice(adultPrice)}</del>
                    <ins style={{ textDecoration: 'none', color: '#fff' }}>{formatPrice(adultDiscount)}</ins>
                  </>
                ) : (
                  formatPrice(adultPrice)
                )}
              </div>

              {/* Child Price Badge (Bottom Left - Blue) */}
              {childPrice > 0 && (
                <div className="price-badge child" style={{
                  position: 'absolute', left: '10px', bottom: '10px', zIndex: 2,
                  backgroundColor: '#26bdf7', color: '#fff', padding: '6px 10px',
                  borderRadius: '4px', fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap'
                }}>
                  Child: {formatPrice(childPrice)}
                </div>
              )}

              {/* Sale Badge */}
              {hasAdultDiscount && (
                <span className="onsale" style={{
                  position: 'absolute', top: '10px', right: '10px', background: '#d32f2f',
                  color: '#fff', padding: '4px 8px', borderRadius: '4px', zIndex: 2, fontSize: '0.8rem', fontWeight: 'bold'
                }}>Sale!</span>
              )}

              <img 
                src={imageUrl} 
                alt={pkg.title || pkg.name} 
                title={pkg.title || pkg.name} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => e.target.src = '/assets/img/placeholder.jpg'} 
              />
            </Link>

            {/* Icons */}
            <div className="group-icon" style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 2, display: 'flex', gap: '5px' }}>
              <a href="#" data-toggle="tooltip" data-placement="top" title={pkg.category || ''} className="frist" style={{ background: 'rgba(255,255,255,0.9)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: '#333' }}>
                <i className="flaticon-airplane-4"></i>
              </a>
              <a href="#" data-toggle="tooltip" data-placement="top" title={pkg.destination || ''} style={{ background: 'rgba(255,255,255,0.9)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: '#333' }}>
                <i className="flaticon-transport-2"></i>
              </a>
            </div>
          </div>

          {/* Content Section */}
          <div className="wrapper_content" style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div className="post_title">
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', minHeight: '3.2rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                <Link to={`/tours/${pkg.id}`} rel="bookmark" style={{ textDecoration: 'none', color: '#333', fontWeight: '600' }}>
                  {pkg.title || pkg.name}
                </Link>
              </h4>
            </div>
            <span className="post_date" style={{ display: 'block', marginBottom: '10px', color: '#777', fontSize: '0.9rem', fontWeight: '500' }}>
              <i className="fa fa-clock-o" style={{marginRight:'5px'}}></i>
              {pkg.duration_days || 0} DAYS {pkg.duration_nights || 0} NIGHTS
            </span>
            <div className="description" style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.5', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {pkg.description ? (pkg.description.length > 100 ? pkg.description.substring(0, 100) + '...' : pkg.description) : 'Aliquam lacus nisl, viverra convallis sit amet penatibus nunc luctus'}
              </p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="read_more" style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9' }}>
            <div className="item_rating">
              <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
              <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
              <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
              <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
              <i className="fa fa-star-o" style={{ color: '#ffc107' }}></i>
            </div>
            <Link to={`/tours/${pkg.id}`} className="button product_type_tour_phys" style={{
              color: '#fff', fontWeight: 'bold', textDecoration: 'none',
              backgroundColor: '#26bdf7', padding: '8px 20px', borderRadius: '0 4px 4px 0',
              clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)',
              marginLeft: '10px'
            }}>
              READ MORE <i className="fa fa-arrow-right" style={{marginLeft:'5px'}}></i>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="home-content" role="main">
      
      {/* ✅ UPDATED HERO SECTION WITH VIDEO & FLOATING SEARCH */}
      <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
        {/* Video Background */}
        <video 
          poster="/assets/img/video_slider.jpg" 
          playsInline 
          autoPlay 
          muted 
          loop 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            minWidth: '100%', 
            minHeight: '100%', 
            width: 'auto', 
            height: 'auto', 
            zIndex: 1, 
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover'
          }}
        >
          <source src="https://physcode.com/video/330149744.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.4)', zIndex: 2 
        }}></div>

        {/* Centered Content */}
        <div style={{ 
          position: 'relative', zIndex: 3, height: '100%', 
          display: 'flex', flexDirection: 'column', 
          justifyContent: 'center', alignItems: 'center', 
          textAlign: 'center', color: '#fff', padding: '0 20px' 
        }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: '300' }}>Find your special tour today</p>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '30px', lineHeight: '1.2' }}>With Travel Tours</h1>
          <Link to="/tours" style={{ 
            backgroundColor: '#ffb300', color: '#fff', 
            padding: '15px 40px', fontSize: '1rem', fontWeight: 'bold', 
            textDecoration: 'none', borderRadius: '4px', 
            textTransform: 'uppercase', letterSpacing: '1px',
            transition: 'background 0.3s'
          }} onMouseOver={(e) => e.target.style.backgroundColor = '#e6a100'} onMouseOut={(e) => e.target.style.backgroundColor = '#ffb300'}>
            VIEW TOURS
          </Link>
        </div>

        {/* ✅ Floating Search Bar at Bottom */}
        <div style={{ 
          position: 'absolute', bottom: '0', left: '0', right: '0', 
          background: 'rgba(0,0,0,0.7)', zIndex: 3, 
          padding: '20px 0', backdropFilter: 'blur(5px)'
        }}>
          <div className="container">
            <form className="form-tour-booking" onSubmit={(e) => e.preventDefault()} style={{ 
              display: 'flex', gap: '15px', alignItems: 'flex-end', 
              flexWrap: 'wrap', justifyContent: 'center' 
            }}>
              <div style={{ flex: '1 1 200px' }}>
                <input type="text" placeholder="Tour name" style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: 'none', fontSize: '0.95rem' }} />
              </div>
              <div style={{ flex: '1 1 150px' }}>
                <select style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: 'none', fontSize: '0.95rem', backgroundColor: '#fff', cursor: 'pointer' }}>
                  <option value="">Tour Type</option>
                  <option value="escorted-tour">Escorted Tour</option>
                  <option value="rail-tour">Rail Tour</option>
                  <option value="river-cruise">River Cruise</option>
                  <option value="wildlife">Wildlife</option>
                </select>
              </div>
              <div style={{ flex: '1 1 150px' }}>
                <select style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: 'none', fontSize: '0.95rem', backgroundColor: '#fff', cursor: 'pointer' }}>
                  <option value="">Destination</option>
                  <option value="brazil">Brazil</option>
                  <option value="kenya">Kenya</option>
                  <option value="usa">USA</option>
                </select>
              </div>
              <div style={{ flex: '1 1 150px' }}>
                <select style={{ width: '100%', padding: '12px 15px', borderRadius: '4px', border: 'none', fontSize: '0.95rem', backgroundColor: '#fff', cursor: 'pointer' }}>
                  <option value="">Month</option>
                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                    <option key={m} value={m.toLowerCase()}>{m}</option>
                  ))}
                </select>
              </div>
              <button type="submit" style={{ 
                backgroundColor: '#ffb300', color: '#fff', 
                padding: '12px 30px', borderRadius: '4px', border: 'none', 
                fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer',
                textTransform: 'uppercase', minWidth: '150px'
              }}>
                SEARCH TOURS
              </button>
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
            <div key={index} className="wpb_column col-sm-3" style={{marginBottom:'20px'}}>
              <div className="widget-icon-box widget-icon-box-base iconbox-center">
                <div className="boxes-icon circle" style={{fontSize:'30px',width:'80px', height:'80px',lineHeight:'80px', margin:'0 auto 15px auto', background:'#f5f5f5', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <span className="inner-icon"><i className={`vc_icon_element-icon ${item.icon}`} style={{color:'#ffb300'}}></i></span>
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

      {/* Most Popular Tours - SWIPER */}
      <div className="padding-top-6x padding-bottom-6x section-background" style={{backgroundImage: 'url(/assets/img/home/bg-popular.jpg)', backgroundSize:'cover'}}>
        <div className="container">
          <div className="shortcode_title text-white title-center title-decoration-bottom-center">
            <div className="title_subtitle">Take a Look at Our</div>
            <h3 className="title_primary">MOST POPULAR TOURS</h3>
            <span className="line_after_title" style={{color:'#ffffff'}}></span>
          </div>
          
          <div className="row wrapper-tours-slider" style={{position:'relative', marginTop:'30px'}}>
            {loading && <div style={{textAlign:'center', width:'100%', color:'#fff'}}><Spinner /></div>}
            
            {!loading && error && (
              <div className="alert alert-danger" style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', borderRadius: '8px', width: '100%' }}>
                Error: {error}
              </div>
            )}

            {!loading && !error && packages.length > 0 && (
              <>
                {/* Custom Navigation Buttons */}
                <button className="swiper-nav-prev" onClick={() => popularSwiperRef.current?.swiper.slidePrev()} style={{
                  position:'absolute', left:'-50px', top:'50%', transform:'translateY(-50%)', zIndex:10,
                  background:'#fff', color:'#333', border:'none', width:'40px', height:'40px', borderRadius:'50%',
                  cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
                }}>
                  <i className="fa fa-chevron-left"></i>
                </button>
                <button className="swiper-nav-next" onClick={() => popularSwiperRef.current?.swiper.slideNext()} style={{
                  position:'absolute', right:'-50px', top:'50%', transform:'translateY(-50%)', zIndex:10,
                  background:'#fff', color:'#333', border:'none', width:'40px', height:'40px', borderRadius:'50%',
                  cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
                }}>
                  <i className="fa fa-chevron-right"></i>
                </button>

                <Swiper
                  ref={popularSwiperRef}
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation={false}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    992: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 }
                  }}
                  style={{ width: '100%', paddingBottom: '40px' }}
                >
                  {packages.slice(0, 8).map(pkg => (
                    <SwiperSlide key={pkg.id}>
                      <TourCard pkg={pkg} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Destination Carousel (Static Grid) */}
      <div className="section-white padding-top-6x padding-bottom-6x tours-type">
        <div className="container">
          <div className="shortcode_title title-center title-decoration-bottom-center">
            <div className="title_subtitle">Find a Tour by</div>
            <h3 className="title_primary">DESTINATION</h3>
            <span className="line_after_title"></span>
          </div>
          <div className="row" style={{marginTop:'30px'}}>
            {[
              { name: 'Brazil', image: '/assets/img/city/brazil.jpg' },
              { name: 'Philippines', image: '/assets/img/city/philippines.jpg' },
              { name: 'Italy', image: '/assets/img/city/italy.jpg' },
              { name: 'USA', image: '/assets/img/city/usa.jpg' },
              { name: 'Canada', image: '/assets/img/city/canada.jpg' },
              { name: 'Cuba', image: '/assets/img/city/cuba.jpg' }
            ].map((dest, index) => (
              <div key={index} className="col-sm-4 col-md-2" style={{marginBottom:'20px'}}>
                <div className="tours_type_item" style={{position:'relative', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
                  <Link to="/tours" className="tours-type__item__image" style={{display:'block'}}>
                    <img src={dest.image} alt={dest.name} style={{width:'100%', height:'auto', display:'block', transition:'transform 0.3s'}} onMouseOver={(e)=>e.target.style.transform='scale(1.1)'} onMouseOut={(e)=>e.target.style.transform='scale(1)'} />
                  </Link>
                  <div className="content-item" style={{position:'absolute', bottom:'0', left:'0', right:'0', background:'rgba(0,0,0,0.6)', padding:'10px', textAlign:'center'}}>
                    <div className="item__title" style={{color:'#fff', fontWeight:'bold', fontSize:'1rem'}}>{dest.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Achievements */}
      <div className="padding-top-6x padding-bottom-6x bg__shadow section-background" style={{backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)', backgroundSize:'cover'}}>
        <div className="container">
          <div className="shortcode_title text-white title-center title-decoration-bottom-center">
            <div className="title_subtitle">Some statistics about Sharavista Tours</div>
            <h3 className="title_primary">CENTER ACHIEVEMENTS</h3>
            <span className="line_after_title" style={{color:'#ffffff'}}></span>
          </div>
          <div className="row" style={{marginTop:'30px'}}>
            {[
              { value: '94,532', label: 'Customers', icon: 'flaticon-airplane' },
              { value: '1,021', label: 'Destinations', icon: 'flaticon-island' },
              { value: '20,096', label: 'Tours', icon: 'flaticon-globe' },
              { value: '12', label: 'Tour types', icon: 'flaticon-people' }
            ].map((stat, index) => (
              <div key={index} className="col-sm-3" style={{marginBottom:'20px', textAlign:'center'}}>
                <div className="stats_counter text-white">
                  <div className="wrapper-icon" style={{fontSize:'40px', marginBottom:'15px', color:'#ffb300'}}>
                    <i className={stat.icon}></i>
                  </div>
                  <div className="stats_counter_number" style={{fontSize:'2.5rem', fontWeight:'bold'}}>{stat.value}</div>
                  <div className="stats_counter_title">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deals and Discounts - SWIPER */}
      <div className="section-white padding-top-6x padding-bottom-6x">
        <div className="container">
          <div className="shortcode_title title-center title-decoration-bottom-center">
            <h3 className="title_primary">DEALS AND DISCOUNTS</h3>
            <span className="line_after_title"></span>
          </div>
          
          <div className="row wrapper-tours-slider" style={{position:'relative', marginTop:'30px'}}>
            {!loading && !error && dealPackages.length > 0 && (
              <>
                <button className="swiper-nav-prev" onClick={() => dealsSwiperRef.current?.swiper.slidePrev()} style={{
                  position:'absolute', left:'-50px', top:'50%', transform:'translateY(-50%)', zIndex:10,
                  background:'#fff', color:'#333', border:'none', width:'40px', height:'40px', borderRadius:'50%',
                  cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
                }}>
                  <i className="fa fa-chevron-left"></i>
                </button>
                <button className="swiper-nav-next" onClick={() => dealsSwiperRef.current?.swiper.slideNext()} style={{
                  position:'absolute', right:'-50px', top:'50%', transform:'translateY(-50%)', zIndex:10,
                  background:'#fff', color:'#333', border:'none', width:'40px', height:'40px', borderRadius:'50%',
                  cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center'
                }}>
                  <i className="fa fa-chevron-right"></i>
                </button>

                <Swiper
                  ref={dealsSwiperRef}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation={false}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000 }}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    480: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    992: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 }
                  }}
                  style={{ width: '100%', paddingBottom: '40px' }}
                >
                  {dealPackages.map(pkg => (
                    <SwiperSlide key={pkg.id}>
                      <TourCard pkg={pkg} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
            {!loading && !error && dealPackages.length === 0 && (
              <p style={{textAlign:'center', width:'100%'}}>No current deals available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Special Offer */}
      <div className="bg__shadow padding-top-6x padding-bottom-6x section-background" style={{backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)', backgroundSize:'cover'}}>
        <div className="container">
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
              <div className="discounts-tour" style={{textAlign:'center', color:'#fff'}}>
                <h3 className="discounts-title" style={{color:'#ffffff', marginBottom:'20px'}}> 
                  Special Tour in April, Discover Australia for 100 customers with
                  <span style={{color:'#ffb300', fontWeight:'bold'}}> discount 50%</span>
                </h3>
                <span className="line" style={{display:'block', width:'100px', height:'3px', background:'#ffb300', margin:'20px auto'}}></span>
                <p style={{color:'#ffffff', fontSize:'1.1rem'}}>It's limited seating! Hurry up</p>
                <div className="col-sm-12 text-center padding-top-2x">
                  <a href="/tours/special" className="icon-btn" style={{display:'inline-block', background:'#ffb300', color:'#fff', padding:'12px 30px', borderRadius:'50px', textDecoration:'none', fontWeight:'bold', marginTop:'20px'}}>
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
            <div className="col-sm-4" style={{marginBottom:'30px'}}>
              <div className="shortcode_title title-center title-decoration-bottom-center">
                <h2 className="title_primary">Tours Reviews</h2>
                <span className="line_after_title"></span>
              </div>
              <div className="shortcode-tour-reviews wrapper-tours-slider">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000 }}
                  style={{width:'100%'}}
                >
                  {[
                    { name: 'Jessica', tour: 'Canadian Rockies', comment: 'The sightseeing and activities were better than we even thought! I still can\'t believe we did so much in such a short time' },
                    { name: 'Michael', tour: 'Maasai Mara Safari', comment: 'Absolutely amazing safari experience! Saw all the Big Five and the guides were incredibly knowledgeable.' },
                    { name: 'Sarah', tour: 'Diani Beach Paradise', comment: 'Our family beach getaway was perfect. The kids loved the activities and we adults enjoyed the relaxation.' }
                  ].map((review, index) => (
                    <SwiperSlide key={index}>
                      <div className="tour-reviews-item" style={{background:'#f9f9f9', padding:'20px', borderRadius:'8px', marginBottom:'20px', boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
                        <div className="reviews-item-info" style={{display:'flex', alignItems:'center', marginBottom:'15px'}}>
                          <img alt={review.name} src="/assets/img/avata.jpg" className="avatar avatar-95 photo" height="60" width="60" style={{borderRadius:'50%', marginRight:'15px', border:'2px solid #ffb300'}} />
                          <div>
                            <div className="reviews-item-info-name" style={{fontWeight:'bold', color:'#333'}}>{review.name}</div>
                            <div className="reviews-item-rating">
                              <i className="fa fa-star" style={{color:'#ffc107'}}></i>
                              <i className="fa fa-star" style={{color:'#ffc107'}}></i>
                              <i className="fa fa-star" style={{color:'#ffc107'}}></i>
                              <i className="fa fa-star" style={{color:'#ffc107'}}></i>
                              <i className="fa fa-star" style={{color:'#ffc107'}}></i>
                            </div>
                          </div>
                        </div>
                        <div className="reviews-item-content">
                          <h3 className="reviews-item-title" style={{margin:'0 0 10px 0', fontSize:'1.1rem', color:'#333'}}>
                            <Link to="#" style={{textDecoration:'none', color:'inherit'}}>{review.tour}</Link>
                          </h3>
                          <div className="reviews-item-description" style={{color:'#555', lineHeight:'1.6', fontStyle:'italic'}}>"{review.comment}"</div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div className="col-sm-8">
              <div className="shortcode_title title-center title-decoration-bottom-center">
                <h2 className="title_primary">Latest Post</h2>
                <span className="line_after_title"></span>
              </div>
              <div className="row">
                <div className="post_list_content_unit col-sm-6" style={{marginBottom:'30px'}}>
                  <div className="feature-image" style={{marginBottom:'15px', overflow:'hidden', borderRadius:'8px', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
                    <Link to="#" className="entry-thumbnail" style={{display:'block'}}>
                      <img width="370" height="260" src="/assets/img/blog/201H.jpg" alt="Love advice from experts" style={{width:'100%', height:'auto', display:'block', transition:'transform 0.3s'}} onMouseOver={(e)=>e.target.style.transform='scale(1.05)'} onMouseOut={(e)=>e.target.style.transform='scale(1)'} />
                    </Link>
                  </div>
                  <div className="post-list-content">
                    <div className="post_list_inner_content_unit">
                      <h3 className="post_list_title" style={{margin:'0 0 10px 0', fontSize:'1.2rem', fontWeight:'600'}}>
                        <Link to="/blog/single" rel="bookmark" style={{textDecoration:'none', color:'#333'}}>Love advice from experts</Link>
                      </h3>
                      <div className="wrapper-meta" style={{fontSize:'0.85rem', color:'#777', marginBottom:'10px'}}>
                        <div className="date-time">September 6, 2016</div>
                        <div className="post_list_cats">
                          <Link to="#" rel="category tag" style={{color:'#26bdf7', marginLeft:'10px', textDecoration:'none'}}>Travel Tips</Link>
                        </div>
                      </div>
                      <div className="post_list_item_excerpt" style={{color:'#555', lineHeight:'1.6'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
                    </div>
                  </div>
                </div>
                <div className="post_list_content_unit col-sm-6" style={{marginBottom:'30px'}}>
                  <div className="feature-image" style={{marginBottom:'15px', overflow:'hidden', borderRadius:'8px', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
                    <Link to="#" className="entry-thumbnail" style={{display:'block'}}>
                      <img width="370" height="260" src="/assets/img/blog/86H.jpg" alt="The perfect summer body" style={{width:'100%', height:'auto', display:'block', transition:'transform 0.3s'}} onMouseOver={(e)=>e.target.style.transform='scale(1.05)'} onMouseOut={(e)=>e.target.style.transform='scale(1)'} />
                    </Link>
                  </div>
                  <div className="post-list-content">
                    <div className="post_list_inner_content_unit">
                      <h3 className="post_list_title" style={{margin:'0 0 10px 0', fontSize:'1.2rem', fontWeight:'600'}}>
                        <Link to="/blog/single" rel="bookmark" style={{textDecoration:'none', color:'#333'}}>The perfect summer body</Link>
                      </h3>
                      <div className="wrapper-meta" style={{fontSize:'0.85rem', color:'#777', marginBottom:'10px'}}>
                        <div className="date-time">September 6, 2016</div>
                        <div className="post_list_cats">
                          <Link to="#" rel="category tag" style={{color:'#26bdf7', marginLeft:'10px', textDecoration:'none'}}>Health</Link>
                        </div>
                      </div>
                      <div className="post_list_item_excerpt" style={{color:'#555', lineHeight:'1.6'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}