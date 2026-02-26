// import { useEffect, useState, useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { fetchPackages } from '../features/packages/packageSlice';
// import Spinner from '../components/Spinner';

// export default function Tours() {
//   const dispatch = useDispatch();
//   const { loading, packages, error } = useSelector((state) => state.packages);

//   // --- SEARCH & FILTER STATE ---
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedType, setSelectedType] = useState('');
//   const [selectedDest, setSelectedDest] = useState('');

//   // --- PAGINATION STATE ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6; // Display 6 tours per page

//   useEffect(() => {
//     dispatch(fetchPackages());
//     if (window.$ && window.$.fn.tooltip) {
//       // eslint-disable-next-line no-undef
//       $('[data-toggle="tooltip"]').tooltip();
//     }
//   }, [dispatch]);

//   // --- 1. EXTRACT UNIQUE OPTIONS FOR DROPDOWNS ---
//   const { uniqueTypes, uniqueDestinations } = useMemo(() => {
//     const types = new Set();
//     const dests = new Set();

//     packages.forEach(pkg => {
//       if (pkg.category) types.add(pkg.category);
//       if (pkg.destination) dests.add(pkg.destination);
//     });

//     return {
//       uniqueTypes: Array.from(types).sort(),
//       uniqueDestinations: Array.from(dests).sort()
//     };
//   }, [packages]);

//   // --- 2. FILTER LOGIC ---
//   const filteredPackages = useMemo(() => {
//     return packages.filter(pkg => {
//       const matchesSearch = (pkg.title || pkg.name || '').toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesType = selectedType ? pkg.category === selectedType : true;
//       const matchesDest = selectedDest ? pkg.destination === selectedDest : true;

//       return matchesSearch && matchesType && matchesDest;
//     });
//   }, [packages, searchTerm, selectedType, selectedDest]);

//   // Reset to page 1 if filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, selectedType, selectedDest]);

//   // --- 3. PAGINATION LOGIC ---
//   const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentPackages = filteredPackages.slice(startIndex, endIndex);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedType('');
//     setSelectedDest('');
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-KENYA', { style: 'currency', currency: 'KES' }).format(price);
//   };

//   const getImageUrl = (pkg) => {
//     const primaryImage = pkg.PackageImages?.find(img => img.is_primary) || pkg.PackageImages?.[0];
//     if (primaryImage && primaryImage.url) {
//       let imgUrl = primaryImage.url;
//       if (!imgUrl.startsWith('/')) imgUrl = `/uploads/${imgUrl}`;
//       return imgUrl;
//     }
//     return '/assets/img/placeholder.jpg';
//   };

//   return (
//     <div className="archive travel_tour travel_tour-page">
//       {/* CSS FOR EQUAL HEIGHTS & BADGE STYLING */}
//       <style>{`
//         .tours.products {
//           display: flex;
//           flex-wrap: wrap;
//           margin-left: -15px;
//           margin-right: -15px;
//         }
//         .tours.products .item-tour {
//           display: flex;
//           padding: 0 15px 30px 15px;
//           box-sizing: border-box;
//         }
//         .tours.products .item-border.item-product {
//           display: flex;
//           flex-direction: column;
//           width: 100%;
//           height: 100%;
//         }
//         .tours.products .post_images {
//           position: relative;
//           width: 100%;
//           padding-top: 65%; /* Aspect Ratio */
//           overflow: hidden;
//           background-color: #f0f0f0;
//         }
//         .tours.products .post_images img {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }
//         .tours.products .wrapper_content {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//         }
//         .tours.products .description {
//           flex: 1;
//         }
//         .tours.products .read_more {
//           margin-top: auto;
//         }
//         .tours.products h4 {
//           min-height: 3.2rem;
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .tours.products .description p {
//           display: -webkit-box;
//           -webkit-line-clamp: 3;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }

//         /* ✅ UPDATED BADGE STYLES */
//         .price-badge {
//           position: absolute;
//           left: 10px;
//           padding: 6px 10px;
//           border-radius: 4px;
//           font-weight: 700;
//           font-size: 0.85rem;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//           z-index: 2;
//           white-space: nowrap;
//           color: #ffffff; /* White Text */
//         }
        
//         /* Adult Badge: Top Left, Amber Background */
//         .price-badge.adult {
//           top: 10px;
//           background-color: #ffb300;
//         }

//         /* Child Badge: Bottom Left, Sky Blue Background */
//         .price-badge.child {
//           bottom: 10px;
//           background-color: #26bdf7;
//         }

//         .price-badge del {
//           color: rgba(255, 255, 255, 0.8); /* Semi-transparent white for struck price */
//           font-weight: 400;
//           font-size: 0.75rem;
//           margin-right: 4px;
//           text-decoration: line-through;
//         }
//         .price-badge ins {
//           text-decoration: none;
//           color: #ffffff;
//         }
//       `}</style>

//       {/* Breadcrumb */}
//       <div className="top_site_main" style={{ backgroundImage: 'url(/assets/img/banner/top-heading.jpg)' }}>
//         <div className="banner-wrapper container article_heading">
//           <div className="breadcrumbs-wrapper">
//             <ul className="phys-breadcrumb">
//               <li><Link to="/" className="home">Home</Link></li>
//               <li>Tours</li>
//             </ul>
//           </div>
//           <h1 className="heading_primary">Tours</h1>
//         </div>
//       </div>

//       {/* Main Content */}
//       <section className="content-area">
//         <div className="container">
//           <div className="row">

//             <div className="site-main col-sm-9 alignright">

//               {loading && (
//                 <div style={{ textAlign: 'center', padding: '50px' }}>
//                   <Spinner size="lg" />
//                   <p>Loading tours...</p>
//                 </div>
//               )}

//               {!loading && error && (
//                 <div className="alert alert-danger" style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', borderRadius: '8px' }}>
//                   Error: {error}
//                 </div>
//               )}

//               {!loading && !error && filteredPackages.length === 0 && (
//                 <div style={{ textAlign: 'center', padding: '50px' }}>
//                   <h3>No tours found matching your criteria.</h3>
//                   <button onClick={clearFilters} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
//                     Clear Filters
//                   </button>
//                 </div>
//               )}

//               {!loading && !error && filteredPackages.length > 0 && (
//                 <>
//                   <ul className="tours products wrapper-tours-slider">
//                     {currentPackages.map((pkg) => {
//                       const adultPrice = parseFloat(pkg.price_adult || 0);
//                       const childPrice = parseFloat(pkg.price_child || 0);
//                       const adultDiscount = pkg.discount_price ? parseFloat(pkg.discount_price) : null;

//                       const hasAdultDiscount = adultDiscount && adultDiscount < adultPrice;

//                       return (
//                         <li key={pkg.id} className="item-tour col-md-4 col-sm-6 product">
//                           <div className="item_border item-product">
//                             <div className="post_images">
//                               <Link to={`/tours/${pkg.id}`}>

//                                 {/* ✅ ADULT PRICE BADGE (Top Left) */}
//                                 <div className="price-badge adult">
//                                   Adult: {hasAdultDiscount ? (
//                                     <>
//                                       <del>{formatPrice(adultPrice)}</del>
//                                       <ins>{formatPrice(adultDiscount)}</ins>
//                                     </>
//                                   ) : (
//                                     formatPrice(adultPrice)
//                                   )}
//                                 </div>

//                                 {/* ✅ CHILD PRICE BADGE (Bottom Left) */}
//                                 {childPrice > 0 && (
//                                   <div className="price-badge child">
//                                     Child: {formatPrice(childPrice)}
//                                   </div>
//                                 )}

//                                 {hasAdultDiscount && <span className="onsale">Sale!</span>}

//                                 <img
//                                   src={getImageUrl(pkg)}
//                                   alt={pkg.title || pkg.name}
//                                   title={pkg.title || pkg.name}
//                                   onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                                 />
//                               </Link>
//                               <div className="group-icon">
//                                 <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist">
//                                   <i className="flaticon-airplane-4"></i>
//                                 </a>
//                                 <a href="/tours" data-toggle="tooltip" data-placement="top" title="River Cruise">
//                                   <i className="flaticon-transport-2"></i>
//                                 </a>
//                               </div>
//                             </div>
//                             <div className="wrapper_content">
//                               <div className="post_title">
//                                 <h4>
//                                   <Link to={`/tours/${pkg.id}`} rel="bookmark">{pkg.title || pkg.name}</Link>
//                                 </h4>
//                               </div>
//                               <span className="post_date">
//                                 {pkg.duration_days || 0} DAYS {pkg.duration_nights || 0} NIGHTS
//                               </span>
//                               <div className="description">
//                                 <p>
//                                   {pkg.description ?
//                                     (pkg.description.length > 100 ? pkg.description.substring(0, 100) + '...' : pkg.description)
//                                     : 'Aliquam lacus nisl, viverra convallis sit amet penatibus nunc luctus'}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="read_more">
//                               <div className="item_rating">
//                                 <i className="fa fa-star"></i>
//                                 <i className="fa fa-star"></i>
//                                 <i className="fa fa-star"></i>
//                                 <i className="fa fa-star"></i>
//                                 <i className="fa fa-star-o"></i>
//                               </div>
//                               <Link to={`/tours/${pkg.id}`} className="button product_type_tour_phys add_to_cart_button">
//                                 Read more
//                               </Link>
//                             </div>
//                           </div>
//                         </li>
//                       );
//                     })}
//                   </ul>

//                   {/* ✅ PAGINATION CONTROLS */}
//                   <div className="navigation paging-navigation" role="navigation">
//                     <ul className="page-numbers">
//                       <li>
//                         <button
//                           className="page-numbers"
//                           onClick={() => handlePageChange(currentPage - 1)}
//                           disabled={currentPage === 1}
//                           style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, padding: '8px 12px', fontSize: '14px' }}
//                         >
//                           <i className="fa fa-long-arrow-left"></i> Prev
//                         </button>
//                       </li>

//                       {/* Show current page range info */}
//                       <li>
//                         <span className="page-numbers current" style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}>
//                           {currentPage}
//                         </span>
//                       </li>
//                       <li>
//                         <span className="page-numbers" style={{ padding: '8px 12px' }}>
//                           of {totalPages}
//                         </span>
//                       </li>

//                       <li>
//                         <button
//                           className="page-numbers"
//                           onClick={() => handlePageChange(currentPage + 1)}
//                           disabled={currentPage === totalPages}
//                           style={{ background: 'none', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, padding: '8px 12px', fontSize: '14px' }}
//                         >
//                           Next <i className="fa fa-long-arrow-right"></i>
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Sidebar */}
//             <div className="widget-area align-left col-sm-3">
//               <div className="search_tour">
//                 <div className="form-block block-after-indent">
//                   <h3 className="form-block_title">Search Tour</h3>
//                   <div className="form-block__description">Find your dream tour today!</div>

//                   {/* Changed to use React State instead of form submit */}
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Search by name..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
//                     />

//                     <select
//                       value={selectedType}
//                       onChange={(e) => setSelectedType(e.target.value)}
//                       style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
//                     >
//                       <option value="">All Tour Types</option>
//                       {uniqueTypes.map(type => (
//                         <option key={type} value={type}>{type}</option>
//                       ))}
//                     </select>

//                     <select
//                       value={selectedDest}
//                       onChange={(e) => setSelectedDest(e.target.value)}
//                       style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
//                     >
//                       <option value="">All Destinations</option>
//                       {uniqueDestinations.map(dest => (
//                         <option key={dest} value={dest}>{dest}</option>
//                       ))}
//                     </select>

//                     <button
//                       onClick={clearFilters}
//                       style={{ width: '100%', padding: '12px', backgroundColor: '#fff', color: '#666', border: '1px solid #ddd', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', marginTop: '5px' }}
//                     >
//                       Reset Filters
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* <aside className="widget widget_travel_tour">
//                 <div className="wrapper-special-tours">
//                   {!loading && packages.slice(0, 3).map((pkg) => {
//                      const adultPrice = parseFloat(pkg.price_adult || 0);
//                      const childPrice = parseFloat(pkg.price_child || 0);
//                      const adultDiscount = pkg.discount_price ? parseFloat(pkg.discount_price) : null;
//                      const hasAdultDiscount = adultDiscount && adultDiscount < adultPrice;

//                      return (
//                       <div key={pkg.id} className="inner-special-tours">
//                         <Link to={`/tours/${pkg.id}`}>
//                           {hasAdultDiscount && <span className="onsale">Sale!</span>}
//                           <img 
//                             src={getImageUrl(pkg)} 
//                             alt={pkg.title || pkg.name} 
//                             title={pkg.title || pkg.name}
//                             onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                           />
//                         </Link>
//                         <div className="item_rating">
//                           <i className="fa fa-star"></i>
//                           <i className="fa fa-star"></i>
//                           <i className="fa fa-star"></i>
//                           <i className="fa fa-star"></i>
//                           <i className="fa fa-star-o"></i>
//                         </div>
//                         <div className="post_title">
//                           <h3>
//                             <Link to={`/tours/${pkg.id}`} rel="bookmark">{pkg.title || pkg.name}</Link>
//                           </h3>
//                         </div>
//                         <div className="item_price">
//                           <span className="price" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                             <span style={{ 
//                               display: 'inline-block', 
//                               backgroundColor: '#ffb300', 
//                               color: '#fff', 
//                               padding: '4px 8px', 
//                               borderRadius: '4px', 
//                               fontWeight: 'bold',
//                               fontSize: '0.9rem'
//                             }}>
//                               Adult: {hasAdultDiscount ? <><del style={{fontSize:'0.8em', opacity: 0.8}}>{formatPrice(adultPrice)}</del> <ins>{formatPrice(adultDiscount)}</ins></> : formatPrice(adultPrice)}
//                             </span>
//                             {childPrice > 0 && (
//                               <span style={{ 
//                                 display: 'inline-block', 
//                                 backgroundColor: '#26bdf7', 
//                                 color: '#fff', 
//                                 padding: '4px 8px', 
//                                 borderRadius: '4px', 
//                                 fontWeight: 'bold',
//                                 fontSize: '0.85rem'
//                               }}>
//                                 Child: {formatPrice(childPrice)}
//                               </span>
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </aside> */}

//               <aside className="widget widget_travel_tour">
//                 <div className="wrapper-special-tours">
//                   <h4 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '2px solid #ffb300', paddingBottom: '10px', display: 'inline-block' }}>Featured Tours</h4>
//                   {!loading && packages.slice(0, 3).map((pkg) => {
//                     const adultPrice = parseFloat(pkg.price_adult || 0);
//                     const childPrice = parseFloat(pkg.price_child || 0);
//                     const adultDiscount = pkg.discount_price ? parseFloat(pkg.discount_price) : null;
//                     const hasAdultDiscount = adultDiscount && adultDiscount < adultPrice;

//                     return (
//                       <div key={pkg.id} className="inner-special-tours" style={{ display: 'flex', gap: '10px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
//                         <Link to={`/tours/${pkg.id}`} style={{ width: '80px', height: '60px', flexShrink: 0, overflow: 'hidden', borderRadius: '4px', position: 'relative' }}>
//                           {hasAdultDiscount && <span className="onsale" style={{ position: 'absolute', top: 0, left: 0, background: '#d32f2f', color: '#fff', fontSize: '0.6rem', padding: '2px 4px', borderRadius: '2px' }}>Sale</span>}
//                           <img src={getImageUrl(pkg)} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = '/assets/img/placeholder.jpg'} />
//                         </Link>
//                         <div style={{ flex: 1 }}>
//                           <h3 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', lineHeight: '1.3' }}>
//                             <Link to={`/tours/${pkg.id}`} rel="bookmark" style={{ textDecoration: 'none', color: '#333' }}>{pkg.title || pkg.name}</Link>
//                           </h3>
//                           <div style={{ fontWeight: 'bold', color: '#ffb300', fontSize: '0.9rem' }}>
//                             {hasAdultDiscount ? formatPrice(adultDiscount) : formatPrice(adultPrice)}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </aside>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPackages } from '../features/packages/packageSlice';
import Spinner from '../components/Spinner';
import Select from 'react-select'; // ✅ Import react-select

export default function Tours() {
  const dispatch = useDispatch();
  const { loading, packages, error } = useSelector((state) => state.packages);
  console.log('Error:', error); // Debugging log

  // --- SEARCH & FILTER STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(null); // ✅ React-select uses objects/null
  const [selectedDest, setSelectedDest] = useState(null); // ✅ React-select uses objects/null

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    dispatch(fetchPackages());
    if (window.$ && window.$.fn.tooltip) {
      // eslint-disable-next-line no-undef
      $('[data-toggle="tooltip"]').tooltip();
    }
  }, [dispatch]);

  // --- 1. EXTRACT UNIQUE OPTIONS FOR DROPDOWNS ---
  const { uniqueTypes, uniqueDestinations } = useMemo(() => {
    const types = new Set();
    const dests = new Set();

    packages.forEach(pkg => {
      if (pkg.category) types.add(pkg.category);
      if (pkg.destination) dests.add(pkg.destination);
    });

    // Format for react-select: [{ value: '...', label: '...' }]
    return {
      uniqueTypes: Array.from(types).sort().map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, ' ') })),
      uniqueDestinations: Array.from(dests).sort().map(d => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1).replace(/-/g, ' ') }))
    };
  }, [packages]);

  // --- 2. FILTER LOGIC ---
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const matchesSearch = (pkg.title || pkg.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      // Check .value because react-select returns an object
      const matchesType = selectedType ? pkg.category === selectedType.value : true;
      const matchesDest = selectedDest ? pkg.destination === selectedDest.value : true;

      return matchesSearch && matchesType && matchesDest;
    });
  }, [packages, searchTerm, selectedType, selectedDest]);

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedDest]);

  // --- 3. PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPackages = filteredPackages.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType(null);
    setSelectedDest(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KENYA', { style: 'currency', currency: 'KES' }).format(price);
  };

  const getImageUrl = (pkg) => {
    const primaryImage = pkg.PackageImages?.find(img => img.is_primary) || pkg.PackageImages?.[0];
    if (primaryImage && primaryImage.url) {
      let imgUrl = primaryImage.url;
      if (!imgUrl.startsWith('/')) imgUrl = `/uploads/${imgUrl}`;
      return imgUrl;
    }
    return '/assets/img/placeholder.jpg';
  };

  // ✅ Custom Styles for React-Select to match sidebar inputs
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: '#ddd',
      boxShadow: 'none',
      borderRadius: '4px',
      minHeight: '46px', // Match input height including border
      height: '46px',
      marginBottom: '10px', // Keep spacing consistent
      '&:hover': { borderColor: '#ccc' },
    }),
    valueContainer: (base) => ({
      ...base,
      height: '46px',
      padding: '0 10px',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '46px',
      padding: '0 5px',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '4px',
      marginTop: '4px',
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#ffb300' : state.isFocused ? '#f5f5f5' : '#fff',
      color: state.isSelected ? '#fff' : '#333',
      cursor: 'pointer',
      padding: '8px 12px',
      '&:active': { backgroundColor: '#ffb300' },
    }),
    singleValue: (base) => ({
      ...base,
      color: '#333',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#999',
    }),
  };

  return (
    <div className="archive travel_tour travel_tour-page">
      {/* CSS FOR EQUAL HEIGHTS & BADGE STYLING */}
      <style>{`
        .tours.products { display: flex; flex-wrap: wrap; margin-left: -15px; margin-right: -15px; }
        .tours.products .item-tour { display: flex; padding: 0 15px 30px 15px; box-sizing: border-box; }
        .tours.products .item-border.item-product { display: flex; flex-direction: column; width: 100%; height: 100%; }
        .tours.products .post_images { position: relative; width: 100%; padding-top: 65%; overflow: hidden; background-color: #f0f0f0; }
        .tours.products .post_images img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .tours.products .wrapper_content { flex: 1; display: flex; flex-direction: column; }
        .tours.products .description { flex: 1; }
        .tours.products .read_more { margin-top: auto; }
        .tours.products h4 { min-height: 3.2rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .tours.products .description p { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        
        .price-badge { position: absolute; left: 10px; padding: 6px 10px; border-radius: 4px; font-weight: 700; font-size: 0.85rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 2; white-space: nowrap; color: #ffffff; }
        .price-badge.adult { top: 10px; background-color: #ffb300; }
        .price-badge.child { bottom: 10px; background-color: #26bdf7; }
        .price-badge del { color: rgba(255, 255, 255, 0.8); font-weight: 400; font-size: 0.75rem; margin-right: 4px; text-decoration: line-through; }
        .price-badge ins { text-decoration: none; color: #ffffff; }
      `}</style>

      {/* Breadcrumb */}
      <div className="top_site_main" style={{ backgroundImage: 'url(/assets/img/banner/top-heading.jpg)' }}>
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

            <div className="site-main col-sm-9 alignright">

              {loading && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <Spinner size="lg" />
                  <p>Loading tours...</p>
                </div>
              )}

              {!loading && error && (
                <div className="alert alert-danger" style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', borderRadius: '8px' }}>
                  Error : {error}
                </div>
              )}

              {!loading && !error && filteredPackages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <h3>No tours found matching your criteria.</h3>
                  <button onClick={clearFilters} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Clear Filters
                  </button>
                </div>
              )}

              {!loading && !error && filteredPackages.length > 0 && (
                <>
                  <ul className="tours products wrapper-tours-slider">
                    {currentPackages.map((pkg) => {
                      const adultPrice = parseFloat(pkg.price_adult || 0);
                      const childPrice = parseFloat(pkg.price_child || 0);
                      const adultDiscount = pkg.discount_price ? parseFloat(pkg.discount_price) : null;
                      const hasAdultDiscount = adultDiscount && adultDiscount < adultPrice;

                      return (
                        <li key={pkg.id} className="item-tour col-md-4 col-sm-6 product">
                          <div className="item_border item-product">
                            <div className="post_images">
                              <Link to={`/tours/${pkg.id}`}>
                                <div className="price-badge adult">
                                  Adult: {hasAdultDiscount ? (
                                    <><del>{formatPrice(adultPrice)}</del><ins>{formatPrice(adultDiscount)}</ins></>
                                  ) : formatPrice(adultPrice)}
                                </div>
                                {childPrice > 0 && (
                                  <div className="price-badge child">
                                    Child: {formatPrice(childPrice)}
                                  </div>
                                )}
                                {hasAdultDiscount && <span className="onsale">Sale!</span>}
                                <img src={getImageUrl(pkg)} alt={pkg.title} title={pkg.title} onError={(e) => e.target.src = '/assets/img/placeholder.jpg'} />
                              </Link>
                              <div className="group-icon">
                                <a href="/tours" data-toggle="tooltip" data-placement="top" title="Escorted Tour" className="frist"><i className="flaticon-airplane-4"></i></a>
                                <a href="/tours" data-toggle="tooltip" data-placement="top" title="River Cruise"><i className="flaticon-transport-2"></i></a>
                              </div>
                            </div>
                            <div className="wrapper_content">
                              <div className="post_title">
                                <h4><Link to={`/tours/${pkg.id}`} rel="bookmark">{pkg.title || pkg.name}</Link></h4>
                              </div>
                              <span className="post_date">{pkg.duration_days || 0} DAYS {pkg.duration_nights || 0} NIGHTS</span>
                              <div className="description">
                                <p>{pkg.description ? (pkg.description.length > 100 ? pkg.description.substring(0, 100) + '...' : pkg.description) : 'Aliquam lacus nisl...'}</p>
                              </div>
                            </div>
                            <div className="read_more">
                              <div className="item_rating">
                                <i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star-o"></i>
                              </div>
                              <Link to={`/tours/${pkg.id}`} className="button product_type_tour_phys add_to_cart_button">Read more</Link>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Pagination */}
                  <div className="navigation paging-navigation" role="navigation">
                    <ul className="page-numbers">
                      <li>
                        <button className="page-numbers" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                          style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, padding: '8px 12px', fontSize: '14px' }}>
                          <i className="fa fa-long-arrow-left"></i> Prev
                        </button>
                      </li>
                      <li><span className="page-numbers current" style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}>{currentPage}</span></li>
                      <li><span className="page-numbers" style={{ padding: '8px 12px' }}>of {totalPages}</span></li>
                      <li>
                        <button className="page-numbers" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                          style={{ background: 'none', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, padding: '8px 12px', fontSize: '14px' }}>
                          Next <i className="fa fa-long-arrow-right"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="widget-area align-left col-sm-3">
              <div className="search_tour">
                <div className="form-block block-after-indent">
                  <h3 className="form-block_title">Search Tour</h3>
                  <div className="form-block__description">Find your dream tour today!</div>

                  <div>
                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', height: '46px' }}
                    />

                    {/* ✅ React-Select: Tour Type */}
                    <Select
                      options={uniqueTypes}
                      value={selectedType}
                      onChange={setSelectedType}
                      placeholder="All Tour Types"
                      isClearable
                      styles={customSelectStyles}
                      theme={(theme) => ({
                        ...theme,
                        colors: { ...theme.colors, primary: '#ffb300', primary25: '#ffe082' },
                      })}
                    />

                    {/* ✅ React-Select: Destination */}
                    <Select
                      options={uniqueDestinations}
                      value={selectedDest}
                      onChange={setSelectedDest}
                      placeholder="All Destinations"
                      isClearable
                      styles={customSelectStyles}
                      theme={(theme) => ({
                        ...theme,
                        colors: { ...theme.colors, primary: '#ffb300', primary25: '#ffe082' },
                      })}
                    />

                    <button
                      onClick={clearFilters}
                      style={{ width: '100%', padding: '12px', backgroundColor: '#fff', color: '#666', border: '1px solid #ddd', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', marginTop: '5px' }}
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>

              <aside className="widget widget_travel_tour">
                <div className="wrapper-special-tours">
                  <h4 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '2px solid #ffb300', paddingBottom: '10px', display: 'inline-block' }}>Featured Tours</h4>
                  {!loading && packages.slice(0, 3).map((pkg) => {
                    const adultPrice = parseFloat(pkg.price_adult || 0);
                    const childPrice = parseFloat(pkg.price_child || 0);
                    const adultDiscount = pkg.discount_price ? parseFloat(pkg.discount_price) : null;
                    const hasAdultDiscount = adultDiscount && adultDiscount < adultPrice;

                    return (
                      <div key={pkg.id} className="inner-special-tours" style={{ display: 'flex', gap: '10px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                        <Link to={`/tours/${pkg.id}`} style={{ width: '80px', height: '60px', flexShrink: 0, overflow: 'hidden', borderRadius: '4px', position: 'relative' }}>
                          {hasAdultDiscount && <span className="onsale" style={{ position: 'absolute', top: 0, left: 0, background: '#d32f2f', color: '#fff', fontSize: '0.6rem', padding: '2px 4px', borderRadius: '2px' }}>Sale</span>}
                          <img src={getImageUrl(pkg)} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = '/assets/img/placeholder.jpg'} />
                        </Link>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', lineHeight: '1.3' }}>
                            <Link to={`/tours/${pkg.id}`} rel="bookmark" style={{ textDecoration: 'none', color: '#333' }}>{pkg.title || pkg.name}</Link>
                          </h3>
                          <div style={{ fontWeight: 'bold', color: '#ffb300', fontSize: '0.9rem' }}>
                            {hasAdultDiscount ? formatPrice(adultDiscount) : formatPrice(adultPrice)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
