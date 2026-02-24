import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchPackages } from '../features/packages/packageSlice';
import Spinner from '../components/Spinner';
import Select from 'react-select'; // ✅ Import react-select

export default function Destinations() {
  const dispatch = useDispatch();
  const { loading, packages, error } = useSelector((state) => state.packages);
  const { destinationName } = useParams();

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(null); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchPackages());
    if (window.$ && window.$.fn.tooltip) {
      // eslint-disable-next-line no-undef
      $('[data-toggle="tooltip"]').tooltip();
    }
  }, [dispatch]);

  // 1. Base Filter: Destination
  const destinationPackages = useMemo(() => {
    if (!destinationName) return packages;
    return packages.filter(pkg => pkg.destination && pkg.destination.toLowerCase() === destinationName.toLowerCase());
  }, [packages, destinationName]);

  // 2. Prepare Options for React-Select
  const typeOptions = useMemo(() => {
    const types = new Set();
    destinationPackages.forEach(pkg => {
      if (pkg.category) types.add(pkg.category);
    });
    
    return Array.from(types).sort().map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')
    }));
  }, [destinationPackages]);

  // 3. Apply Filters
  const filteredPackages = useMemo(() => {
    return destinationPackages.filter(pkg => {
      const matchesSearch = (pkg.title || pkg.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? pkg.category === selectedType.value : true;
      return matchesSearch && matchesType;
    });
  }, [destinationPackages, searchTerm, selectedType]);

  // Reset Page on Filter Change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, destinationName]);

  // 4. Pagination
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
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
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

  const displayTitle = destinationName 
    ? destinationName.charAt(0).toUpperCase() + destinationName.slice(1)
    : 'All Destinations';

  // ✅ FIXED STYLES: Explicitly set height to match input (42px)
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: '#ddd',
      boxShadow: 'none',
      borderRadius: '4px',
      // Force exact height to match the text input
      minHeight: '42px', 
      height: '42px',
      '&:hover': { borderColor: '#ccc' },
    }),
    valueContainer: (base) => ({
      ...base,
      height: '42px',
      padding: '0 8px',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '42px',
      padding: '0 8px',
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

      {/* Hero Section */}
      <div 
        className="top_site_main" 
        style={{ 
          color: 'rgb(255, 255, 255)', 
          backgroundColor: 'rgb(0, 0, 0)', 
          backgroundImage: `url(/assets/img/destinations/${destinationName || 'default'}.jpg)` 
        }}
      >
        <div className="banner-wrapper-destination container article_heading text-center">
          <h1 className="heading_primary">Tourist {displayTitle}</h1>
          <div className="desc">
            <p>Discover the {displayTitle} with our special tours</p>
          </div>
          <div className="breadcrumbs-wrapper">
            <ul className="phys-breadcrumb">
              <li><Link to="/" className="home">Home</Link></li>
              <li><Link to="/tours" title="Tours">Tours</Link></li>
              <li>{displayTitle}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-area">
        <div className="container">
          <div className="row">
            <div className="site-main col-sm-12 full-width">
              
              {/* Search & Filter Bar */}
              {!loading && filteredPackages.length > 0 && (
                <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                  <input 
                    type="text" 
                    placeholder="Search tours in this destination..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: '1 1 300px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '42px', boxSizing: 'border-box' }}
                  />
                  
                  {/* ✅ React-Select Component with Fixed Height */}
                  <div style={{ flex: '0 1 250px' }}>
                    <Select
                      options={typeOptions}
                      value={selectedType}
                      onChange={setSelectedType}
                      placeholder="All Tour Types"
                      isClearable
                      styles={customSelectStyles}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#ffb300',
                          primary25: '#ffe082',
                        },
                      })}
                    />
                  </div>

                  {(searchTerm || selectedType) && (
                    <button 
                      onClick={clearFilters}
                      style={{ padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', color: '#666', height: '42px' }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {loading && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <Spinner size="lg" />
                  <p>Loading tours...</p>
                </div>
              )}

              {!loading && error && (
                <div className="alert alert-danger" style={{ padding: '20px', backgroundColor: '#fee', color: '#c00', borderRadius: '8px' }}>
                  Error: {error}
                </div>
              )}

              {!loading && !error && filteredPackages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <h3>No tours found for {displayTitle} matching your criteria.</h3>
                  <button onClick={clearFilters} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#ffb300', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Clear Filters
                  </button>
                  <br />
                  <Link to="/tours" style={{ display: 'inline-block', marginTop: '10px', color: '#1976d2' }}>View all tours</Link>
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
                        <li key={pkg.id} className="item-tour col-md-3 col-sm-6 product">
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
                                <img width="430" height="305" src={getImageUrl(pkg)} alt={pkg.title} title={pkg.title} onError={(e) => e.target.src = '/assets/img/placeholder.jpg'} />
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
                      <li><span className="page-numbers current" style={{ backgroundColor: '#ffb300', borderColor: '#ffb300' }}>{currentPage}</span></li>
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
          </div>
        </div>
      </section>
    </div>
  );
}