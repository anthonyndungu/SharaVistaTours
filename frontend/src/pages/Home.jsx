// import { useEffect, useState, useMemo, useRef } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchPackages } from '../features/packages/packageSlice'
// import Spinner from '../components/Spinner'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Navigation, Pagination, Autoplay } from 'swiper/modules'
// import Select from 'react-select'

// // Import Swiper styles
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

// export default function Home() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, packages, error } = useSelector(state => state.packages);
//   const authUsers = useSelector(state => state.auth?.users); // ✅ Get users from auth state

//   // derive only clients for easier reuse
//   const clientUsers = useMemo(() => {
//     if (!Array.isArray(authUsers)) return [];
//     return authUsers.filter(u => u.role && u.role.toLowerCase() === 'client');
//   }, [authUsers]);


//   // Refs for Swiper instances
//   const popularSwiperRef = useRef(null);
//   const dealsSwiperRef = useRef(null);
//   const destinationSwiperRef = useRef(null);

//   // --- SEARCH STATE ---
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedType, setSelectedType] = useState('');
//   const [selectedDest, setSelectedDest] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState('');

//   // Compute deals
//   const dealPackages = packages
//     .filter(p => {
//       const adult = parseFloat(p.price_adult || 0);
//       const disc = parseFloat(p.discount_price || 0);
//       return disc > 0 && disc < adult;
//     })
//     .slice(0, 6);

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-KENYA', { style: 'currency', currency: 'KES' }).format(price);
//   };

//   useEffect(() => {
//     dispatch(fetchPackages());
//   }, [dispatch]);

//   // Initialize tooltips
//   useEffect(() => {
//     if (window.$ && window.$.fn.tooltip) {
//       // eslint-disable-next-line no-undef
//       $('[data-toggle="tooltip"]').tooltip();
//     }
//   }, [packages]);

//   // --- DYNAMIC OPTIONS FROM DB ---
//   const { typeOptions, destinationOptions } = useMemo(() => {
//     const types = new Set();
//     const dests = new Set();

//     packages.forEach(pkg => {
//       if (pkg.category) types.add(pkg.category);
//       if (pkg.destination) dests.add(pkg.destination);
//     });

//     return {
//       typeOptions: Array.from(types).sort(),
//       destinationOptions: Array.from(dests).sort()
//     };
//   }, [packages]);

//   const monthOptions = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   // --- SEARCH HANDLER ---
//   const handleSearch = (e) => {
//     e.preventDefault();

//     const params = new URLSearchParams();
//     if (searchTerm.trim()) params.append('search', searchTerm.trim());
//     if (selectedType) params.append('type', selectedType);
//     if (selectedDest) params.append('destination', selectedDest);
//     if (selectedMonth) params.append('month', selectedMonth.toLowerCase());

//     navigate(`/tours?${params.toString()}`);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedType('');
//     setSelectedDest('');
//     setSelectedMonth('');
//   };

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

//               {/* Adult Price Badge */}
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

//               {/* Child Price Badge (below adult) */}
//               {childPrice > 0 && (
//                 <div className="price-badge child" style={{
//                   position: 'absolute', left: '10px', top: '45px', zIndex: 2,
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
//               <i className="fa fa-clock-o" style={{ marginRight: '5px' }}></i>
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
//               READ MORE <i className="fa fa-arrow-right" style={{ marginLeft: '5px' }}></i>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Reusable Navigation Button Component
//   const NavButton = ({ direction, onClick, style: customStyle = {} }) => (
//     <button
//       onClick={onClick}
//       style={{
//         background: '#fff',
//         color: '#333',
//         border: 'none',
//         width: '40px',
//         height: '40px',
//         borderRadius: '50%',
//         cursor: 'pointer',
//         boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexShrink: 0,
//         zIndex: 10,
//         ...customStyle
//       }}
//     >
//       <i className={`fa fa-chevron-${direction}`}></i>
//     </button>
//   );



//   const CountdownTimer = ({ targetDate }) => {
//     const calculateTimeLeft = () => {
//       const difference = +new Date(targetDate) - +new Date();
//       let timeLeft = {};

//       if (difference > 0) {
//         timeLeft = {
//           days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//           hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//           minutes: Math.floor((difference / 1000 / 60) % 60),
//           seconds: Math.floor((difference / 1000) % 60),
//         };
//       } else {
//         timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
//       }
//       return timeLeft;
//     };

//     const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//     useEffect(() => {
//       const timer = setTimeout(() => {
//         setTimeLeft(calculateTimeLeft());
//       }, 1000);
//       return () => clearTimeout(timer);
//     });

//     const timerBoxes = [
//       { label: 'DAYS', value: timeLeft.days },
//       { label: 'HOURS', value: timeLeft.hours },
//       { label: 'MINUTES', value: timeLeft.minutes },
//       { label: 'SECONDS', value: timeLeft.seconds },
//     ];

//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
//         {timerBoxes.map((item, index) => (
//           <div key={index} style={{ textAlign: 'center' }}>
//             <div style={{
//               background: '#ffb300',
//               color: '#333',
//               fontSize: '2.5rem',
//               fontWeight: 'bold',
//               padding: '10px 20px',
//               borderRadius: '8px',
//               minWidth: '80px',
//               boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
//             }}>
//               {String(item.value).padStart(2, '0')}
//             </div>
//             <div style={{
//               color: '#fff',
//               fontSize: '0.9rem',
//               fontWeight: '600',
//               marginTop: '10px',
//               letterSpacing: '1px',
//               textTransform: 'uppercase'
//             }}>
//               {item.label}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="home-content" role="main">
//       {/* HERO SECTION */}
//       <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
//         <video
//           poster="/assets/img/video_slider.jpg"
//           playsInline
//           autoPlay
//           muted
//           loop
//           style={{
//             position: 'absolute', top: '50%', left: '50%',
//             minWidth: '100%', minHeight: '100%',
//             width: 'auto', height: 'auto',
//             zIndex: 1, transform: 'translate(-50%, -50%)',
//             objectFit: 'cover'
//           }}
//         >
//           <source src="/assets/video/sharavista-intro1.mp4" type="video/mp4" />
//         </video>

//         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2 }}></div>

//         <div style={{
//           position: 'relative', zIndex: 3, height: '100%',
//           display: 'flex', flexDirection: 'column',
//           justifyContent: 'center', alignItems: 'center',
//           textAlign: 'center', color: '#fff', padding: '0 20px'
//         }}>
//           <p style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: '300' }}>Find your special tour today</p>
//           <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '30px', lineHeight: '1.2', color: '#ffb300' }}>With Sharavista Tours</h1>
//           <Link to="/tours" style={{
//             backgroundColor: '#3B82F6', color: '#fff',
//             padding: '15px 40px', fontSize: '1rem', fontWeight: 'bold',
//             textDecoration: 'none', borderRadius: '4px',
//             textTransform: 'uppercase', letterSpacing: '1px',
//             transition: 'background 0.3s'
//           }} onMouseOver={(e) => e.target.style.backgroundColor = '#e6a100'} onMouseOut={(e) => e.target.style.backgroundColor = '#3B82F6'}>
//             VIEW TOURS
//           </Link>
//         </div>

//         {/* Search Bar - Block on Mobile */}
//         <div style={{
//           position: 'absolute', bottom: '0', left: '0', right: 0,
//           background: 'rgba(0,0,0,0.7)', zIndex: 100,
//           padding: '20px 0', backdropFilter: 'blur(5px)'
//         }}>
//           <style>{`
//             @media (max-width: 767px) {
//               .form-tour-booking {
//                 flex-direction: column !important;
//               }
//               .form-tour-booking > div,
//               .form-tour-booking > button {
//                 width: 100% !important;
//                 flex: 1 1 100% !important;
//               }
//             }
//             @media (min-width: 768px) {
//               .form-tour-booking {
//                 flex-direction: row;
//               }
//               .form-tour-booking > div,
//               .form-tour-booking > button {
//                 flex: 1 1 auto;
//                 width: auto;
//               }
//               .form-tour-booking > button {
//                 max-width: 200px;
//               }
//             }
//           `}</style>
//           <div className="container">
//             <form className="form-tour-booking" onSubmit={handleSearch} style={{
//               display: 'flex',
//               gap: '15px',
//               alignItems: 'stretch',
//               flexWrap: 'wrap',
//               justifyContent: 'center'
//             }}>
//               {/* Tour Name Input */}
//               <div style={{ flex: '1 1 200px', minWidth: 'unset', width: '100%' }}>
//                 <input
//                   type="text"
//                   placeholder="Tour name"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   style={{
//                     width: '100%',
//                     padding: '12px 15px',
//                     borderRadius: '4px',
//                     border: 'none',
//                     fontSize: '0.95rem',
//                     boxSizing: 'border-box',
//                     height: '48px'
//                   }}
//                 />
//               </div>

//               {/* Tour Type Select */}
//               <div style={{ flex: '1 1 140px', minWidth: 'unset', width: '100%' }}>
//                 <Select
//                   options={[{ value: '', label: 'Tour Type' }, ...typeOptions.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ') }))]}
//                   value={selectedType ? { value: selectedType, label: selectedType.charAt(0).toUpperCase() + selectedType.slice(1).replace(/-/g, ' ') } : { value: '', label: 'Tour Type' }}
//                   onChange={(option) => setSelectedType(option?.value || '')}
//                   isClearable={false}
//                   isSearchable={true}
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       minHeight: '48px',
//                       height: '48px',
//                       borderRadius: '4px',
//                       border: '1px solid #ddd',
//                       boxSizing: 'border-box'
//                     }),
//                     menuPortal: (base) => ({ ...base, zIndex: 10000 }),
//                     menu: (base) => ({ ...base, zIndex: 10000 })
//                   }}
//                   menuPortalTarget={document.body}
//                 />
//               </div>

//               {/* Destination Select */}
//               <div style={{ flex: '1 1 140px', minWidth: 'unset', width: '100%' }}>
//                 <Select
//                   options={[{ value: '', label: 'Destination' }, ...destinationOptions.map(dest => ({ value: dest, label: dest.charAt(0).toUpperCase() + dest.slice(1).replace(/-/g, ' ') }))]}
//                   value={selectedDest ? { value: selectedDest, label: selectedDest.charAt(0).toUpperCase() + selectedDest.slice(1).replace(/-/g, ' ') } : { value: '', label: 'Destination' }}
//                   onChange={(option) => setSelectedDest(option?.value || '')}
//                   isClearable={false}
//                   isSearchable={true}
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       minHeight: '48px',
//                       height: '48px',
//                       borderRadius: '4px',
//                       border: '1px solid #ddd',
//                       boxSizing: 'border-box'
//                     }),
//                     menuPortal: (base) => ({ ...base, zIndex: 10000 }),
//                     menu: (base) => ({ ...base, zIndex: 10000 })
//                   }}
//                   menuPortalTarget={document.body}
//                 />
//               </div>

//               {/* Month Select */}
//               <div style={{ flex: '1 1 140px', minWidth: 'unset', width: '100%' }}>
//                 <Select
//                   options={[{ value: '', label: 'Month' }, ...monthOptions.map(month => ({ value: month.toLowerCase(), label: month }))]}
//                   value={selectedMonth ? { value: selectedMonth, label: monthOptions[monthOptions.findIndex(m => m.toLowerCase() === selectedMonth)] || selectedMonth } : { value: '', label: 'Month' }}
//                   onChange={(option) => setSelectedMonth(option?.value || '')}
//                   isClearable={false}
//                   isSearchable={true}
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       minHeight: '48px',
//                       height: '48px',
//                       borderRadius: '4px',
//                       border: '1px solid #ddd',
//                       boxSizing: 'border-box'
//                     }),
//                     menuPortal: (base) => ({ ...base, zIndex: 10000 }),
//                     menu: (base) => ({ ...base, zIndex: 10000 })
//                   }}
//                   menuPortalTarget={document.body}
//                 />
//               </div>

//               {/* Search Button */}
//               <button type="submit" style={{
//                 backgroundColor: '#ffb300', color: '#fff',
//                 padding: '12px 30px', borderRadius: '4px', border: 'none',
//                 fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer',
//                 textTransform: 'uppercase',
//                 whiteSpace: 'nowrap',
//                 flex: '1 1 100%',
//                 width: '100%',
//                 height: '48px'
//               }}>
//                 SEARCH TOURS
//               </button>

//               {/* Clear Filters Button */}
//               {(searchTerm || selectedType || selectedDest || selectedMonth) && (
//                 <button
//                   type="button"
//                   onClick={clearFilters}
//                   style={{
//                     backgroundColor: 'transparent', color: '#fff',
//                     padding: '12px 15px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.5)',
//                     fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer',
//                     textTransform: 'uppercase', whiteSpace: 'nowrap',
//                     flex: '1 1 100%',
//                     maxWidth: '150px',
//                     height: '48px'
//                   }}
//                 >
//                   Clear
//                 </button>
//               )}
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
//             <div key={index} className="wpb_column col-sm-3" style={{ marginBottom: '20px' }}>
//               <div className="widget-icon-box widget-icon-box-base iconbox-center">
//                 <div className="boxes-icon circle" style={{ fontSize: '30px', width: '80px', height: '80px', lineHeight: '80px', margin: '0 auto 15px auto', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <span className="inner-icon"><i className={`vc_icon_element-icon ${item.icon}`} style={{ color: '#ffb300' }}></i></span>
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

//       {/* Most Popular Tours - SWIPER WITH INLINE ARROWS */}
//       <div className="padding-top-6x padding-bottom-6x section-background" style={{ backgroundImage: 'url(/assets/img/home/bg-popular.jpg)', backgroundSize: 'cover' }}>
//         <div className="container">
//           <div className="shortcode_title text-white title-center title-decoration-bottom-center">
//             <div className="title_subtitle">Take a Look at Our</div>
//             <h3 className="title_primary">MOST POPULAR TOURS</h3>
//             <span className="line_after_title" style={{ color: '#ffffff' }}></span>
//           </div>

//           <div className="row wrapper-tours-slider" style={{ marginTop: '30px' }}>
//             {loading && <div style={{ textAlign: 'center', width: '100%', color: '#fff' }}><Spinner /></div>}

//             {!loading && error && (
//               <div className="alert alert-danger" style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', borderRadius: '8px', width: '100%' }}>
//                 Error: {error}
//               </div>
//             )}

//             {!loading && !error && packages.length > 0 && (
//               <div style={{ position: 'relative', overflow: 'visible' }}>

//                 {/* Left Arrow positioned inside container */}
//                 <NavButton direction="left" onClick={() => popularSwiperRef.current?.swiper.slidePrev()} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />

//                 {/* Swiper with padding to avoid overlap */}
//                 <div style={{ width: '100%', padding: '0 50px' }}>
//                   <Swiper
//                     ref={popularSwiperRef}
//                     modules={[Navigation, Pagination, Autoplay]}
//                     spaceBetween={20}
//                     slidesPerView={1}
//                     pagination={{ clickable: true }}
//                     autoplay={{ delay: 3000, disableOnInteraction: false }}
//                     breakpoints={{
//                       0: { slidesPerView: 1 },
//                       480: { slidesPerView: 2 },
//                       768: { slidesPerView: 2 },
//                       992: { slidesPerView: 3 },
//                       1200: { slidesPerView: 4 }
//                     }}
//                     style={{ width: '100%', paddingBottom: '40px' }}
//                   >
//                     {packages.slice(0, 8).map(pkg => (
//                       <SwiperSlide key={pkg.id}>
//                         <TourCard pkg={pkg} />
//                       </SwiperSlide>
//                     ))}
//                   </Swiper>
//                 </div>

//                 {/* Right Arrow positioned inside container */}
//                 <NavButton direction="right" onClick={() => popularSwiperRef.current?.swiper.slideNext()} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />

//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Destination Carousel (Static Grid) */}
//       <div className="section-white padding-top-6x padding-bottom-6x tours-type">
//         <div className="container">
//           <div className="shortcode_title title-center title-decoration-bottom-center">
//             <div className="title_subtitle">Find a Tour by</div>
//             <h3 className="title_primary">DESTINATION</h3>
//             <span className="line_after_title"></span>
//           </div>

//           {loading ? (
//             <div style={{ textAlign: 'center', padding: '40px' }}><Spinner /></div>
//           ) : destinationOptions.length > 0 ? (
//             <div style={{ marginTop: '40px', paddingBottom: '20px', position: 'relative', overflow: 'visible' }}>

//               {/* Left Arrow Button - Absolutely Positioned */}
//               <button
//                 onClick={() => destinationSwiperRef.current?.swiper.slidePrev()}
//                 style={{
//                   position: 'absolute',
//                   left: '10px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   background: '#fff',
//                   color: '#333',
//                   border: 'none',
//                   width: '40px',
//                   height: '40px',
//                   borderRadius: '50%',
//                   cursor: 'pointer',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   zIndex: 10,
//                   transition: 'all 0.2s',
//                 }}
//                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
//                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%)'}
//               >
//                 <i className="fa fa-chevron-left" style={{ fontSize: '18px' }}></i>
//               </button>

//               {/* Swiper Component with Padding */}
//               <div style={{ width: '100%', padding: '0 50px' }}>
//                 <Swiper
//                   ref={destinationSwiperRef}
//                   modules={[Navigation, Pagination, Autoplay]}
//                   spaceBetween={20}
//                   slidesPerView={2}
//                   // navigation={true} // Disabled default nav
//                   pagination={{ clickable: true }}
//                   autoplay={{ delay: 3500, disableOnInteraction: false }}
//                   breakpoints={{
//                     0: { slidesPerView: 1 },
//                     480: { slidesPerView: 2 },
//                     768: { slidesPerView: 3 },
//                     992: { slidesPerView: 4 },
//                     1200: { slidesPerView: 5 }
//                   }}
//                   style={{ width: '100%', paddingBottom: '50px' }}
//                 >
//                   {destinationOptions.map((dest, index) => {
//                     const cityName = dest.toLowerCase().replace(/\s+/g, '-');
//                     const cityImage = `/assets/img/city/${cityName}.jpg`;
//                     const fallbackImage = `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`;

//                     return (
//                       <SwiperSlide key={index}>
//                         <Link
//                           to={`/tours?destination=${encodeURIComponent(dest)}`}
//                           style={{
//                             display: 'block',
//                             position: 'relative',
//                             borderRadius: '12px',
//                             overflow: 'hidden',
//                             boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
//                             height: '250px',
//                             textDecoration: 'none'
//                           }}
//                         >
//                           <img
//                             src={cityImage}
//                             alt={dest}
//                             onError={(e) => { e.target.src = fallbackImage; }}
//                             style={{
//                               width: '100%',
//                               height: '100%',
//                               objectFit: 'cover',
//                               transition: 'transform 0.5s ease',
//                               filter: 'brightness(0.85)'
//                             }}
//                             onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
//                             onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
//                           />

//                           <div style={{
//                             position: 'absolute',
//                             bottom: 0,
//                             left: 0,
//                             right: 0,
//                             height: '60%',
//                             background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
//                             pointerEvents: 'none'
//                           }}></div>

//                           <div style={{
//                             position: 'absolute',
//                             bottom: '20px',
//                             left: '20px',
//                             right: '20px',
//                             color: '#fff',
//                             zIndex: 2,
//                           }}>
//                             <h4 style={{
//                               margin: 0,
//                               fontSize: '1.2rem',
//                               fontWeight: '700',
//                               textTransform: 'uppercase',
//                               letterSpacing: '0.5px',
//                               color: '#26bdf7',
//                               textShadow: '0 2px 4px rgba(0,0,0,0.5)'
//                             }}>
//                               {dest}
//                             </h4>
//                             <div style={{
//                               marginTop: '5px',
//                               fontSize: '0.9rem',
//                               opacity: 0.9,
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '5px'
//                             }}>
//                               <span>Explore Tours</span>
//                               <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
//                             </div>
//                           </div>
//                         </Link>
//                       </SwiperSlide>
//                     );
//                   })}
//                 </Swiper>
//               </div>

//               {/* Right Arrow Button - Absolutely Positioned */}
//               <button
//                 onClick={() => destinationSwiperRef.current?.swiper.slideNext()}
//                 style={{
//                   position: 'absolute',
//                   right: '10px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   background: '#fff',
//                   color: '#333',
//                   border: 'none',
//                   width: '40px',
//                   height: '40px',
//                   borderRadius: '50%',
//                   cursor: 'pointer',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   zIndex: 10,
//                   transition: 'all 0.2s',
//                 }}
//                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
//                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%)'}
//               >
//                 <i className="fa fa-chevron-right" style={{ fontSize: '18px' }}></i>
//               </button>

//             </div>
//           ) : (
//             <p style={{ textAlign: 'center', padding: '40px', color: '#777' }}>No destinations available at the moment.</p>
//           )}
//         </div>
//       </div>

//       {/* Center Achievements */}
//       {/* <div className="padding-top-6x padding-bottom-6x bg__shadow section-background" style={{ backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)', backgroundSize: 'cover' }}>
//         <div className="container">
//           <div className="shortcode_title text-white title-center title-decoration-bottom-center">
//             <div className="title_subtitle">Some statistics about Sharavista Tours</div>
//             <h3 className="title_primary">CENTER ACHIEVEMENTS</h3>
//             <span className="line_after_title" style={{ color: '#ffffff' }}></span>
//           </div>

//           {loading ? (
//             <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}><Spinner /></div>
//           ) : (
//             <div className="row" style={{ marginTop: '30px' }}>
            
//               {(() => {
//                 const totalTours = packages.length;

//                 // Get unique destinations
//                 const uniqueDestinations = new Set(packages.map(p => p.destination).filter(Boolean));
//                 const totalDestinations = uniqueDestinations.size;

//                 // Get unique categories
//                 const uniqueCategories = new Set(packages.map(p => p.category).filter(Boolean));
//                 const totalTypes = uniqueCategories.size;

//                 // Simulate customers (Base + multiplier based on tours)
//                 // In a real app, you would fetch this from an API endpoint like /api/stats
//                 const estimatedCustomers = 150 + (totalTours * 12);

//                 const stats = [
//                   {
//                     value: estimatedCustomers.toLocaleString(),
//                     label: 'Happy Customers',
//                     icon: 'flaticon-people'
//                   },
//                   {
//                     value: totalDestinations.toLocaleString(),
//                     label: 'Destinations',
//                     icon: 'flaticon-island'
//                   },
//                   {
//                     value: totalTours.toLocaleString(),
//                     label: 'Available Tours',
//                     icon: 'flaticon-globe'
//                   },
//                   {
//                     value: totalTypes.toLocaleString(),
//                     label: 'Tour Types',
//                     icon: 'flaticon-airplane'
//                   }
//                 ];

//                 return stats.map((stat, index) => (
//                   <div key={index} className="col-sm-3" style={{ marginBottom: '20px', textAlign: 'center' }}>
//                     <div className="stats_counter text-white">
//                       <div className="wrapper-icon" style={{ fontSize: '40px', marginBottom: '15px', color: '#ffb300' }}>
//                         <i className={stat.icon}></i>
//                       </div>
//                       <div className="stats_counter_number" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
//                         {stat.value}
//                       </div>
//                       <div className="stats_counter_title">{stat.label}</div>
//                     </div>
//                   </div>
//                 ));
//               })()}
//             </div>
//           )}
//         </div>
//       </div> */}

//             {/* ✅ UPDATED: Center Achievements - Count ONLY Clients */}
//       <div className="padding-top-6x padding-bottom-6x bg__shadow section-background" style={{ backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)', backgroundSize: 'cover' }}>
//         <div className="container">
//           <div className="shortcode_title text-white title-center title-decoration-bottom-center">
//             <div className="title_subtitle">Some statistics about Sharavista Tours</div>
//             <h3 className="title_primary">CENTER ACHIEVEMENTS</h3>
//             <span className="line_after_title" style={{ color: '#ffffff' }}></span>
//           </div>

//           {loading ? (
//             <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}><Spinner /></div>
//           ) : (
//             <div className="row" style={{ marginTop: '30px' }}>
//               {/* Calculate Dynamic Stats */}
//               {(() => {
//                 const totalTours = packages.length;

//                 // Get unique destinations
//                 const uniqueDestinations = new Set(packages.map(p => p.destination).filter(Boolean));
//                 const totalDestinations = uniqueDestinations.size;

//                 // Get unique categories
//                 const uniqueCategories = new Set(packages.map(p => p.category).filter(Boolean));
//                 const totalTypes = uniqueCategories.size;

//                 // Filter users where role === 'client' (case-insensitive check)
//                 // use memoized clientUsers list
//                 const totalCustomers = clientUsers.length;

//                 const stats = [
//                   {
//                     value: totalCustomers.toLocaleString(),
//                     label: 'Happy Clients', // Updated label
//                     icon: 'flaticon-people'
//                   },
//                   {
//                     value: totalDestinations.toLocaleString(),
//                     label: 'Destinations',
//                     icon: 'flaticon-island'
//                   },
//                   {
//                     value: totalTours.toLocaleString(),
//                     label: 'Available Tours',
//                     icon: 'flaticon-globe'
//                   },
//                   {
//                     value: totalTypes.toLocaleString(),
//                     label: 'Tour Types',
//                     icon: 'flaticon-airplane'
//                   }
//                 ];

//                 return stats.map((stat, index) => (
//                   <div key={index} className="col-sm-3" style={{ marginBottom: '20px', textAlign: 'center' }}>
//                     <div className="stats_counter text-white">
//                       <div className="wrapper-icon" style={{ fontSize: '40px', marginBottom: '15px', color: '#ffb300' }}>
//                         <i className={stat.icon}></i>
//                       </div>
//                       <div className="stats_counter_number" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
//                         {stat.value}
//                       </div>
//                       <div className="stats_counter_title">{stat.label}</div>
//                     </div>
//                   </div>
//                 ));
//               })()}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="section-white padding-top-6x padding-bottom-6x">
//         <div className="container">
//           <div className="shortcode_title title-center title-decoration-bottom-center">
//             <h3 className="title_primary">DEALS AND DISCOUNTS</h3>
//             <span className="line_after_title"></span>
//           </div>

//           <div className="row wrapper-tours-slider" style={{ marginTop: '30px' }}>
//             {!loading && !error && dealPackages.length > 0 && (
//               <div style={{ position: 'relative', overflow: 'visible' }}>
//                 <NavButton direction="left" onClick={() => dealsSwiperRef.current?.swiper.slidePrev()} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
//                 <div style={{ width: '100%', padding: '0 50px' }}>
//                   <Swiper
//                     ref={dealsSwiperRef}
//                     modules={[Navigation, Pagination, Autoplay]}
//                     spaceBetween={20}
//                     slidesPerView={1}
//                     pagination={{ clickable: true }}
//                     autoplay={{ delay: 3000, disableOnInteraction: false }}
//                     breakpoints={{
//                       0: { slidesPerView: 1 },
//                       480: { slidesPerView: 1 },
//                       768: { slidesPerView: 2 },
//                       992: { slidesPerView: 2 },
//                       1200: { slidesPerView: 3 }
//                     }}
//                     style={{ width: '100%', paddingBottom: '40px' }}
//                   >
//                     {dealPackages.map(pkg => (
//                       <SwiperSlide key={pkg.id}>
//                         <TourCard pkg={pkg} />
//                       </SwiperSlide>
//                     ))}
//                   </Swiper>
//                 </div>
//                 <NavButton direction="right" onClick={() => dealsSwiperRef.current?.swiper.slideNext()} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />

//               </div>
//             )}
//             {!loading && !error && dealPackages.length === 0 && (
//               <p style={{ textAlign: 'center', width: '100%' }}>No current deals available.</p>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* ✅ UPDATED: Special Offer with Countdown Timer */}
//       <div className="bg__shadow padding-top-6x padding-bottom-6x section-background" style={{ backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)', backgroundSize: 'cover', position: 'relative' }}>
//         {/* Dark Overlay for better text readability */}
//         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>

//         <div className="container" style={{ position: 'relative', zIndex: 2 }}>
//           <div className="row">
//             <div className="col-sm-2"></div>
//             <div className="col-sm-8">
//               <div className="discounts-tour" style={{ textAlign: 'center', color: '#fff' }}>
//                 <h3 className="discounts-title" style={{ color: '#ffffff', marginBottom: '10px', fontSize: '2rem', fontWeight: '700' }}>
//                   Special Tour in April, Discover Australia for 100 customers with
//                 </h3>
//                 <h3 style={{ color: '#ffb300', fontWeight: 'bold', fontSize: '2.5rem', margin: '10px 0', textTransform: 'uppercase' }}>
//                   discount 50%
//                 </h3>
//                 <span className="line" style={{ display: 'block', width: '60px', height: '3px', background: '#ffb300', margin: '20px auto' }}></span>
//                 <p style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '30px' }}>It's limited seating! Hurry up</p>

//                 {/* ✅ COUNTDOWN TIMER */}
//                 <CountdownTimer targetDate="2026-03-31T00:00:00" />

//                 <div className="col-sm-12 text-center padding-top-2x">
//                   <a href="/tours/special" className="icon-btn" style={{ display: 'inline-block', background: '#ffb300', color: '#fff', padding: '15px 40px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', marginTop: '30px', fontSize: '1.1rem', transition: 'transform 0.2s' }}
//                     onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//                     onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
//                   >
//                     <i className="flaticon-airplane-4"></i> GET TOUR
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
//             <div className="col-sm-4" style={{ marginBottom: '30px' }}>
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
//                   autoplay={{ delay: 4000, disableOnInteraction: false }}
//                   style={{ width: '100%' }}
//                 >
//                   {[
//                     { name: 'Jessica', tour: 'Canadian Rockies', comment: 'The sightseeing and activities were better than we even thought! I still can\'t believe we did so much in such a short time' },
//                     { name: 'Michael', tour: 'Maasai Mara Safari', comment: 'Absolutely amazing safari experience! Saw all the Big Five and the guides were incredibly knowledgeable.' },
//                     { name: 'Sarah', tour: 'Diani Beach Paradise', comment: 'Our family beach getaway was perfect. The kids loved the activities and we adults enjoyed the relaxation.' }
//                   ].map((review, index) => (
//                     <SwiperSlide key={index}>
//                       <div className="tour-reviews-item" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
//                         <div className="reviews-item-info" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
//                           <img alt={review.name} src="/assets/img/avata.jpg" className="avatar avatar-95 photo" height="60" width="60" style={{ borderRadius: '50%', marginRight: '15px', border: '2px solid #ffb300' }} />
//                           <div>
//                             <div className="reviews-item-info-name" style={{ fontWeight: 'bold', color: '#333' }}>{review.name}</div>
//                             <div className="reviews-item-rating">
//                               <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
//                               <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
//                               <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
//                               <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
//                               <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="reviews-item-content">
//                           <h3 className="reviews-item-title" style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#333' }}>
//                             <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>{review.tour}</Link>
//                           </h3>
//                           <div className="reviews-item-description" style={{ color: '#555', lineHeight: '1.6', fontStyle: 'italic' }}>"{review.comment}"</div>
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
//                 <div className="post_list_content_unit col-sm-6" style={{ marginBottom: '30px' }}>
//                   <div className="feature-image" style={{ marginBottom: '15px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//                     <Link to="#" className="entry-thumbnail" style={{ display: 'block' }}>
//                       <img width="370" height="260" src="/assets/img/blog/201H.jpg" alt="Love advice from experts" style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.3s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
//                     </Link>
//                   </div>
//                   <div className="post-list-content">
//                     <div className="post_list_inner_content_unit">
//                       <h3 className="post_list_title" style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
//                         <Link to="/blog/single" rel="bookmark" style={{ textDecoration: 'none', color: '#333' }}>Love advice from experts</Link>
//                       </h3>
//                       <div className="wrapper-meta" style={{ fontSize: '0.85rem', color: '#777', marginBottom: '10px' }}>
//                         <div className="date-time">September 6, 2016</div>
//                         <div className="post_list_cats">
//                           <Link to="#" rel="category tag" style={{ color: '#26bdf7', marginLeft: '10px', textDecoration: 'none' }}>Travel Tips</Link>
//                         </div>
//                       </div>
//                       <div className="post_list_item_excerpt" style={{ color: '#555', lineHeight: '1.6' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="post_list_content_unit col-sm-6" style={{ marginBottom: '30px' }}>
//                   <div className="feature-image" style={{ marginBottom: '15px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//                     <Link to="#" className="entry-thumbnail" style={{ display: 'block' }}>
//                       <img width="370" height="260" src="/assets/img/blog/86H.jpg" alt="The perfect summer body" style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.3s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
//                     </Link>
//                   </div>
//                   <div className="post-list-content">
//                     <div className="post_list_inner_content_unit">
//                       <h3 className="post_list_title" style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
//                         <Link to="/blog/single" rel="bookmark" style={{ textDecoration: 'none', color: '#333' }}>The perfect summer body</Link>
//                       </h3>
//                       <div className="wrapper-meta" style={{ fontSize: '0.85rem', color: '#777', marginBottom: '10px' }}>
//                         <div className="date-time">September 6, 2016</div>
//                         <div className="post_list_cats">
//                           <Link to="#" rel="category tag" style={{ color: '#26bdf7', marginLeft: '10px', textDecoration: 'none' }}>Health</Link>
//                         </div>
//                       </div>
//                       <div className="post_list_item_excerpt" style={{ color: '#555', lineHeight: '1.6' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
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


import { useEffect, useState, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPackages } from '../features/packages/packageSlice'
import Spinner from '../components/Spinner'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import Select from 'react-select'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, packages, error } = useSelector(state => state.packages);
  const authUsers = useSelector(state => state.auth?.users); // ✅ Get users from auth state

  // derive only clients for easier reuse
  const clientUsers = useMemo(() => {
    if (!Array.isArray(authUsers)) return [];
    return authUsers.filter(u => u.role && u.role.toLowerCase() === 'client');
  }, [authUsers]);

  // Refs for Swiper instances
  const popularSwiperRef = useRef(null);
  const dealsSwiperRef = useRef(null);
  const destinationSwiperRef = useRef(null);

  // --- SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDest, setSelectedDest] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Compute deals
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

  // Initialize tooltips
  useEffect(() => {
    if (window.$ && window.$.fn.tooltip) {
      // eslint-disable-next-line no-undef
      $('[data-toggle="tooltip"]').tooltip();
    }
  }, [packages]);

  // --- DYNAMIC OPTIONS FROM DB ---
  const { typeOptions, destinationOptions } = useMemo(() => {
    const types = new Set();
    const dests = new Set();

    packages.forEach(pkg => {
      if (pkg.category) types.add(pkg.category);
      if (pkg.destination) dests.add(pkg.destination);
    });

    return {
      typeOptions: Array.from(types).sort(),
      destinationOptions: Array.from(dests).sort()
    };
  }, [packages]);

  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // --- SEARCH HANDLER ---
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (selectedType) params.append('type', selectedType);
    if (selectedDest) params.append('destination', selectedDest);
    if (selectedMonth) params.append('month', selectedMonth.toLowerCase());
    navigate(`/tours?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedDest('');
    setSelectedMonth('');
  };

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
              {/* Adult Price Badge */}
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
              {/* Child Price Badge (below adult) */}
              {childPrice > 0 && (
                <div className="price-badge child" style={{
                  position: 'absolute', left: '10px', top: '45px', zIndex: 2,
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
              <i className="fa fa-clock-o" style={{ marginRight: '5px' }}></i>
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
              READ MORE <i className="fa fa-arrow-right" style={{ marginLeft: '5px' }}></i>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Reusable Navigation Button Component
  const NavButton = ({ direction, onClick, style: customStyle = {} }) => (
    <button
      onClick={onClick}
      style={{
        background: '#fff',
        color: '#333',
        border: 'none',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 10,
        ...customStyle
      }}
    >
      <i className={`fa fa-chevron-${direction}`}></i>
    </button>
  );

  const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = {};
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearTimeout(timer);
    });

    const timerBoxes = [
      { label: 'DAYS', value: timeLeft.days },
      { label: 'HOURS', value: timeLeft.hours },
      { label: 'MINUTES', value: timeLeft.minutes },
      { label: 'SECONDS', value: timeLeft.seconds },
    ];

    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {timerBoxes.map((item, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div style={{
              background: '#ffb300',
              color: '#333',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '8px',
              minWidth: '80px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              {String(item.value).padStart(2, '0')}
            </div>
            <div style={{
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginTop: '10px',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="home-content" role="main">
      {/* HERO SECTION */}
      <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
        <video
          poster="/assets/img/video_slider.jpg"
          playsInline
          autoPlay
          muted
          loop
          style={{
            position: 'absolute', top: '50%', left: '50%',
            minWidth: '100%', minHeight: '100%',
            width: 'auto', height: 'auto',
            zIndex: 1, transform: 'translate(-50%, -50%)',
            objectFit: 'cover'
          }}
        >
          <source src="/assets/video/sharavista-intro1.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2 }}></div>
        <div style={{
          position: 'relative', zIndex: 3, height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          textAlign: 'center', color: '#fff', padding: '0 20px'
        }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: '300' }}>Find your special tour today</p>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '30px', lineHeight: '1.2', color: '#ffb300' }}>With Sharavista Tours</h1>
          <Link to="/tours" style={{
            backgroundColor: '#3B82F6', color: '#fff',
            padding: '15px 40px', fontSize: '1rem', fontWeight: 'bold',
            textDecoration: 'none', borderRadius: '4px',
            textTransform: 'uppercase', letterSpacing: '1px',
            transition: 'background 0.3s'
          }} onMouseOver={(e) => e.target.style.backgroundColor = '#e6a100'} onMouseOut={(e) => e.target.style.backgroundColor = '#3B82F6'}>
            VIEW TOURS
          </Link>
        </div>

        {/* Search Bar - Block on Mobile */}
        <div style={{
          position: 'absolute', bottom: '0', left: '0', right: 0,
          background: 'rgba(0,0,0,0.7)', zIndex: 100,
          padding: '20px 0', backdropFilter: 'blur(5px)'
        }}>
          <style>{`
            @media (max-width: 767px) {
              .form-tour-booking {
                flex-direction: column !important;
              }
              .form-tour-booking > div,
              .form-tour-booking > button {
                width: 100% !important;
                flex: 1 1 100% !important;
              }
            }
            @media (min-width: 768px) {
              .form-tour-booking {
                flex-direction: row;
              }
              .form-tour-booking > div,
              .form-tour-booking > button {
                flex: 1 1 auto;
                width: auto;
              }
              .form-tour-booking > button {
                max-width: 200px;
              }
            }
          `}</style>
          <div className="container">
            <form className="form-tour-booking" onSubmit={handleSearch} style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'stretch',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {/* Tour Name Input */}
              <div style={{ flex: '1 1 200px', minWidth: 'unset', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Tour name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    height: '48px'
                  }}
                />
              </div>
              {/* Tour Type Select */}
              <div style={{ flex: '1 1 140px', minWidth: 'unset', width: '100%' }}>
                <Select
                  options={[{ value: '', label: 'Tour Type' }, ...typeOptions.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ') }))]}
                  value={selectedType ? { value: selectedType, label: selectedType.charAt(0).toUpperCase() + selectedType.slice(1).replace(/-/g, ' ') } : { value: '', label: 'Tour Type' }}
                  onChange={(option) => setSelectedType(option?.value || '')}
                  isClearable={false}
                  isSearchable={true}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '48px',
                      height: '48px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      boxSizing: 'border-box'
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 10000 }),
                    menu: (base) => ({ ...base, zIndex: 10000 })
                  }}
                  menuPortalTarget={document.body}
                />
              </div>
              {/* Destination Select */}
              <div style={{ flex: '1 1 140px', minWidth: 'unset', width: '100%' }}>
                <Select
                  options={[{ value: '', label: 'Destination' }, ...destinationOptions.map(dest => ({ value: dest, label: dest.charAt(0).toUpperCase() + dest.slice(1).replace(/-/g, ' ') }))]}
                  value={selectedDest ? { value: selectedDest, label: selectedDest.charAt(0).toUpperCase() + selectedDest.slice(1).replace(/-/g, ' ') } : { value: '', label: 'Destination' }}
                  onChange={(option) => setSelectedDest(option?.value || '')}
                  isClearable={false}
                  isSearchable={true}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '48px',
                      height: '48px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      boxSizing: 'border-box'
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 10000 }),
                    menu: (base) => ({ ...base, zIndex: 10000 })
                  }}
                  menuPortalTarget={document.body}
                />
              </div>
              {/* Month Select */}
              <div style={{ flex: '1 1 140px', minWidth: 'unset', width: '100%' }}>
                <Select
                  options={[{ value: '', label: 'Month' }, ...monthOptions.map(month => ({ value: month.toLowerCase(), label: month }))]}
                  value={selectedMonth ? { value: selectedMonth, label: monthOptions[monthOptions.findIndex(m => m.toLowerCase() === selectedMonth)] || selectedMonth } : { value: '', label: 'Month' }}
                  onChange={(option) => setSelectedMonth(option?.value || '')}
                  isClearable={false}
                  isSearchable={true}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '48px',
                      height: '48px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      boxSizing: 'border-box'
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 10000 }),
                    menu: (base) => ({ ...base, zIndex: 10000 })
                  }}
                  menuPortalTarget={document.body}
                />
              </div>
              {/* Search Button */}
              <button type="submit" style={{
                backgroundColor: '#ffb300', color: '#fff',
                padding: '12px 30px', borderRadius: '4px', border: 'none',
                fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                flex: '1 1 100%',
                width: '100%',
                height: '48px'
              }}>
                SEARCH TOURS
              </button>
              {/* Clear Filters Button */}
              {(searchTerm || selectedType || selectedDest || selectedMonth) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    backgroundColor: 'transparent', color: '#fff',
                    padding: '12px 15px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.5)',
                    fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                    flex: '1 1 100%',
                    maxWidth: '150px',
                    height: '48px'
                  }}
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
        {/* ✅ NEW SECTION: Welcome Message */}
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#333', marginBottom: '20px' }}>Welcome to Sharavista Tours and Travel</h2>
        <div style={{ width: '80px', height: '4px', background: '#ffb300', margin: '0 auto 30px auto' }}></div>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#555' }}>
          Your premier partner in creating extraordinary travel experiences throughout Africa and beyond. Established in December 2024, we've quickly emerged as a leading destination management company dedicated to providing personalized travel solutions that exceed expectations.
        </p>
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
            <div key={index} className="wpb_column col-sm-3" style={{ marginBottom: '20px' }}>
              <div className="widget-icon-box widget-icon-box-base iconbox-center">
                <div className="boxes-icon circle" style={{ fontSize: '30px', width: '80px', height: '80px', lineHeight: '80px', margin: '0 auto 15px auto', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="inner-icon"><i className={`vc_icon_element-icon ${item.icon}`} style={{ color: '#ffb300' }}></i></span>
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

    

      {/* Most Popular Tours - SWIPER WITH INLINE ARROWS */}
      <div className="padding-top-6x padding-bottom-6x section-background" style={{ backgroundImage: 'url(/assets/img/home/bg-popular.jpg)', backgroundSize: 'cover' }}>
        <div className="container">
          <div className="shortcode_title text-white title-center title-decoration-bottom-center">
            <div className="title_subtitle">Take a Look at Our</div>
            <h3 className="title_primary">MOST POPULAR TOURS</h3>
            <span className="line_after_title" style={{ color: '#ffffff' }}></span>
          </div>
          <div className="row wrapper-tours-slider" style={{ marginTop: '30px' }}>
            {loading && <div style={{ textAlign: 'center', width: '100%', color: '#fff' }}><Spinner /></div>}
            {!loading && error && (
              <div className="alert alert-danger" style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', borderRadius: '8px', width: '100%' }}>
                Error: {error}
              </div>
            )}
            {!loading && !error && packages.length > 0 && (
              <div style={{ position: 'relative', overflow: 'visible' }}>
                {/* Left Arrow positioned inside container */}
                <NavButton direction="left" onClick={() => popularSwiperRef.current?.swiper.slidePrev()} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                {/* Swiper with padding to avoid overlap */}
                <div style={{ width: '100%', padding: '0 50px' }}>
                  <Swiper
                    ref={popularSwiperRef}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                </div>
                {/* Right Arrow positioned inside container */}
                <NavButton direction="right" onClick={() => popularSwiperRef.current?.swiper.slideNext()} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><Spinner /></div>
          ) : destinationOptions.length > 0 ? (
            <div style={{ marginTop: '40px', paddingBottom: '20px', position: 'relative', overflow: 'visible' }}>
              {/* Left Arrow Button - Absolutely Positioned */}
              <button
                onClick={() => destinationSwiperRef.current?.swiper.slidePrev()}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  color: '#333',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%)'}
              >
                <i className="fa fa-chevron-left" style={{ fontSize: '18px' }}></i>
              </button>
              {/* Swiper Component with Padding */}
              <div style={{ width: '100%', padding: '0 50px' }}>
                <Swiper
                  ref={destinationSwiperRef}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={2}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    992: { slidesPerView: 4 },
                    1200: { slidesPerView: 5 }
                  }}
                  style={{ width: '100%', paddingBottom: '50px' }}
                >
                  {destinationOptions.map((dest, index) => {
                    const cityName = dest.toLowerCase().replace(/\s+/g, '-');
                    const cityImage = `/assets/img/city/${cityName}.jpg`;
                    const fallbackImage = `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`;
                    return (
                      <SwiperSlide key={index}>
                        <Link
                          to={`/tours?destination=${encodeURIComponent(dest)}`}
                          style={{
                            display: 'block',
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                            height: '250px',
                            textDecoration: 'none'
                          }}
                        >
                          <img
                            src={cityImage}
                            alt={dest}
                            onError={(e) => { e.target.src = fallbackImage; }}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease',
                              filter: 'brightness(0.85)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '60%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            pointerEvents: 'none'
                          }}></div>
                          <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            right: '20px',
                            color: '#fff',
                            zIndex: 2,
                          }}>
                            <h4 style={{
                              margin: 0,
                              fontSize: '1.2rem',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              color: '#26bdf7',
                              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                              {dest}
                            </h4>
                            <div style={{
                              marginTop: '5px',
                              fontSize: '0.9rem',
                              opacity: 0.9,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              <span>Explore Tours</span>
                              <i className="fa fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              {/* Right Arrow Button - Absolutely Positioned */}
              <button
                onClick={() => destinationSwiperRef.current?.swiper.slideNext()}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  color: '#333',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%)'}
              >
                <i className="fa fa-chevron-right" style={{ fontSize: '18px' }}></i>
              </button>
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '40px', color: '#777' }}>No destinations available at the moment.</p>
          )}
        </div>
      </div>

      {/* ✅ UPDATED: Center Achievements - Count ONLY Clients */}
      <div className="padding-top-6x padding-bottom-6x bg__shadow section-background" style={{ backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)', backgroundSize: 'cover' }}>
        <div className="container">
          <div className="shortcode_title text-white title-center title-decoration-bottom-center">
            <div className="title_subtitle">Some statistics about Sharavista Tours</div>
            <h3 className="title_primary">CENTER ACHIEVEMENTS</h3>
            <span className="line_after_title" style={{ color: '#ffffff' }}></span>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}><Spinner /></div>
          ) : (
            <div className="row" style={{ marginTop: '30px' }}>
              {/* Calculate Dynamic Stats */}
              {(() => {
                const totalTours = packages.length;
                // Get unique destinations
                const uniqueDestinations = new Set(packages.map(p => p.destination).filter(Boolean));
                const totalDestinations = uniqueDestinations.size;
                // Get unique categories
                const uniqueCategories = new Set(packages.map(p => p.category).filter(Boolean));
                const totalTypes = uniqueCategories.size;
                // Filter users where role === 'client' (case-insensitive check)
                // use memoized clientUsers list
                const totalCustomers = clientUsers.length;
                const stats = [
                  {
                    value: totalCustomers.toLocaleString(),
                    label: 'Happy Clients', // Updated label
                    icon: 'flaticon-people'
                  },
                  {
                    value: totalDestinations.toLocaleString(),
                    label: 'Destinations',
                    icon: 'flaticon-island'
                  },
                  {
                    value: totalTours.toLocaleString(),
                    label: 'Available Tours',
                    icon: 'flaticon-globe'
                  },
                  {
                    value: totalTypes.toLocaleString(),
                    label: 'Tour Types',
                    icon: 'flaticon-airplane'
                  }
                ];
                return stats.map((stat, index) => (
                  <div key={index} className="col-sm-3" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <div className="stats_counter text-white">
                      <div className="wrapper-icon" style={{ fontSize: '40px', marginBottom: '15px', color: '#ffb300' }}>
                        <i className={stat.icon}></i>
                      </div>
                      <div className="stats_counter_number" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                        {stat.value}
                      </div>
                      <div className="stats_counter_title">{stat.label}</div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      <div className="section-white padding-top-6x padding-bottom-6x">
        <div className="container">
          <div className="shortcode_title title-center title-decoration-bottom-center">
            <h3 className="title_primary">DEALS AND DISCOUNTS</h3>
            <span className="line_after_title"></span>
          </div>
          <div className="row wrapper-tours-slider" style={{ marginTop: '30px' }}>
            {!loading && !error && dealPackages.length > 0 && (
              <div style={{ position: 'relative', overflow: 'visible' }}>
                <NavButton direction="left" onClick={() => dealsSwiperRef.current?.swiper.slidePrev()} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <div style={{ width: '100%', padding: '0 50px' }}>
                  <Swiper
                    ref={dealsSwiperRef}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                </div>
                <NavButton direction="right" onClick={() => dealsSwiperRef.current?.swiper.slideNext()} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            )}
            {!loading && !error && dealPackages.length === 0 && (
              <p style={{ textAlign: 'center', width: '100%' }}>No current deals available.</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ UPDATED: Special Offer with Countdown Timer */}
      <div className="bg__shadow padding-top-6x padding-bottom-6x section-background" style={{ backgroundImage: 'url(/assets/img/home/bg-pallarax.jpg)', backgroundSize: 'cover', position: 'relative' }}>
        {/* Dark Overlay for better text readability */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
              <div className="discounts-tour" style={{ textAlign: 'center', color: '#fff' }}>
                <h3 className="discounts-title" style={{ color: '#ffffff', marginBottom: '10px', fontSize: '2rem', fontWeight: '700' }}>
                  Special Tour in April, Discover Australia for 100 customers with
                </h3>
                <h3 style={{ color: '#ffb300', fontWeight: 'bold', fontSize: '2.5rem', margin: '10px 0', textTransform: 'uppercase' }}>
                  discount 50%
                </h3>
                <span className="line" style={{ display: 'block', width: '60px', height: '3px', background: '#ffb300', margin: '20px auto' }}></span>
                <p style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '30px' }}>It's limited seating! Hurry up</p>
                {/* ✅ COUNTDOWN TIMER */}
                <CountdownTimer targetDate="2026-03-31T00:00:00" />
                <div className="col-sm-12 text-center padding-top-2x">
                  <a href="/tours/special" className="icon-btn" style={{ display: 'inline-block', background: '#ffb300', color: '#fff', padding: '15px 40px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', marginTop: '30px', fontSize: '1.1rem', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <i className="flaticon-airplane-4"></i> GET TOUR
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
            <div className="col-sm-4" style={{ marginBottom: '30px' }}>
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
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  style={{ width: '100%' }}
                >
                  {[
                    { name: 'Jessica', tour: 'Canadian Rockies', comment: 'The sightseeing and activities were better than we even thought! I still can\'t believe we did so much in such a short time' },
                    { name: 'Michael', tour: 'Maasai Mara Safari', comment: 'Absolutely amazing safari experience! Saw all the Big Five and the guides were incredibly knowledgeable.' },
                    { name: 'Sarah', tour: 'Diani Beach Paradise', comment: 'Our family beach getaway was perfect. The kids loved the activities and we adults enjoyed the relaxation.' }
                  ].map((review, index) => (
                    <SwiperSlide key={index}>
                      <div className="tour-reviews-item" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div className="reviews-item-info" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                          <img alt={review.name} src="/assets/img/avata.jpg" className="avatar avatar-95 photo" height="60" width="60" style={{ borderRadius: '50%', marginRight: '15px', border: '2px solid #ffb300' }} />
                          <div>
                            <div className="reviews-item-info-name" style={{ fontWeight: 'bold', color: '#333' }}>{review.name}</div>
                            <div className="reviews-item-rating">
                              <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
                              <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
                              <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
                              <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
                              <i className="fa fa-star" style={{ color: '#ffc107' }}></i>
                            </div>
                          </div>
                        </div>
                        <div className="reviews-item-content">
                          <h3 className="reviews-item-title" style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#333' }}>
                            <Link to="#" style={{ textDecoration: 'none', color: 'inherit' }}>{review.tour}</Link>
                          </h3>
                          <div className="reviews-item-description" style={{ color: '#555', lineHeight: '1.6', fontStyle: 'italic' }}>"{review.comment}"</div>
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
                <div className="post_list_content_unit col-sm-6" style={{ marginBottom: '30px' }}>
                  <div className="feature-image" style={{ marginBottom: '15px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Link to="#" className="entry-thumbnail" style={{ display: 'block' }}>
                      <img width="370" height="260" src="/assets/img/blog/201H.jpg" alt="Love advice from experts" style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.3s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
                    </Link>
                  </div>
                  <div className="post-list-content">
                    <div className="post_list_inner_content_unit">
                      <h3 className="post_list_title" style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
                        <Link to="/blog/single" rel="bookmark" style={{ textDecoration: 'none', color: '#333' }}>Love advice from experts</Link>
                      </h3>
                      <div className="wrapper-meta" style={{ fontSize: '0.85rem', color: '#777', marginBottom: '10px' }}>
                        <div className="date-time">September 6, 2016</div>
                        <div className="post_list_cats">
                          <Link to="#" rel="category tag" style={{ color: '#26bdf7', marginLeft: '10px', textDecoration: 'none' }}>Travel Tips</Link>
                        </div>
                      </div>
                      <div className="post_list_item_excerpt" style={{ color: '#555', lineHeight: '1.6' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
                    </div>
                  </div>
                </div>
                <div className="post_list_content_unit col-sm-6" style={{ marginBottom: '30px' }}>
                  <div className="feature-image" style={{ marginBottom: '15px', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Link to="#" className="entry-thumbnail" style={{ display: 'block' }}>
                      <img width="370" height="260" src="/assets/img/blog/86H.jpg" alt="The perfect summer body" style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.3s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
                    </Link>
                  </div>
                  <div className="post-list-content">
                    <div className="post_list_inner_content_unit">
                      <h3 className="post_list_title" style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '600' }}>
                        <Link to="/blog/single" rel="bookmark" style={{ textDecoration: 'none', color: '#333' }}>The perfect summer body</Link>
                      </h3>
                      <div className="wrapper-meta" style={{ fontSize: '0.85rem', color: '#777', marginBottom: '10px' }}>
                        <div className="date-time">September 6, 2016</div>
                        <div className="post_list_cats">
                          <Link to="#" rel="category tag" style={{ color: '#26bdf7', marginLeft: '10px', textDecoration: 'none' }}>Health</Link>
                        </div>
                      </div>
                      <div className="post_list_item_excerpt" style={{ color: '#555', lineHeight: '1.6' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur</div>
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

