import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPackages } from '../features/packages/packageSlice'
import Spinner from '../components/Spinner'

export default function Gallery() {
  const dispatch = useDispatch()
  const { packages, loading, error } = useSelector(state => state.packages)

  // State for Pagination & Grid
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9) // Default 9 items per page
  const [gridColumns, setGridColumns] = useState(3) // Default 3 columns (col-sm-4)

  // Fetch packages on mount
  useEffect(() => {
    dispatch(fetchPackages())
  }, [dispatch])

  // Extract all unique images from all packages
  const allImages = useMemo(() => {
    if (!packages || packages.length === 0) return []

    const images = []
    packages.forEach(pkg => {
      if (pkg.PackageImages && pkg.PackageImages.length > 0) {
        pkg.PackageImages.forEach(img => {
          let imageUrl = img.url
          if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
            imageUrl = `/uploads/${imageUrl}`
          } else if (imageUrl.startsWith('http') && !imageUrl.includes('cloudinary')) {
             // Keep external URLs as is
          }
          
          images.push({
            id: `${pkg.id}-${img.id || Math.random()}`,
            src: imageUrl,
            title: pkg.title,
            category: pkg.category || 'Tour',
            price: pkg.price_adult
          })
        })
      }
    })
    return images
  }, [packages])

  // Reset to page 1 when grid size changes
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage, gridColumns])

  // Calculate Pagination
  const totalPages = Math.ceil(allImages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentImages = allImages.slice(startIndex, endIndex)

  // Handle Grid Change
  const handleGridChange = (cols) => {
    setGridColumns(cols)
    // Adjust items per page based on columns to keep roughly same visual density
    if (cols === 2) setItemsPerPage(6)
    if (cols === 3) setItemsPerPage(9)
    if (cols === 4) setItemsPerPage(12)
  }

  if (loading && allImages.length === 0) {
    return (
      <div className="archive">
        <div className="top_site_main" style={{backgroundImage: 'url(/assets/img/banner/top-heading.jpg)'}}>
           <div className="banner-wrapper container article_heading">
             <h1 className="heading_primary">Gallery</h1>
           </div>
        </div>
        <div style={{ padding: '100px', textAlign: 'center' }}><Spinner /></div>
      </div>
    )
  }

  return (
    <div className="archive">
      {/* Breadcrumb */}
      <div className="top_site_main" style={{backgroundImage: 'url(/assets/img/banner/top-heading.jpg)'}}>
        <div className="banner-wrapper container article_heading">
          <div className="breadcrumbs-wrapper">
            <ul className="phys-breadcrumb">
              <li><Link to="/" className="home">Home</Link></li>
              <li>Gallery</li>
            </ul>
          </div>
          <h1 className="heading_primary">Our Tours Gallery</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-area" style={{ padding: '40px 0' }}>
        <div className="container">
          
          {/* Controls: Grid Selector & Pagination Info */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px', 
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{ color: '#777' }}>
              Showing <strong>{startIndex + 1}-{Math.min(endIndex, allImages.length)}</strong> of <strong>{allImages.length}</strong> images
            </div>

            {/* Grid Selector Buttons */}
            <div style={{ display: 'flex', gap: '5px', background: '#f5f5f5', padding: '5px', borderRadius: '8px' }}>
              {[2, 3, 4].map(cols => (
                <button
                  key={cols}
                  onClick={() => handleGridChange(cols)}
                  style={{
                    background: gridColumns === cols ? '#ffb300' : 'transparent',
                    color: gridColumns === cols ? '#fff' : '#333',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  title={`${cols} Columns`}
                >
                  <i className={`fa fa-th-${cols === 2 ? 'large' : cols === 3 ? '' : 'list'}`}></i>
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="row content_gallery">
            {currentImages.length > 0 ? (
              currentImages.map((item) => (
                <div 
                  key={item.id} 
                  className={`col-sm-${12/gridColumns} gallery_item-wrap`}
                  style={{ marginBottom: '30px' }}
                >
                  <div style={{ 
                    position: 'relative', 
                    overflow: 'hidden', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    group: 'group'
                  }}>
                    {/* Image */}
                    <a 
                      href={item.src} 
                      data-gallery="tour-gallery"
                      title={`${item.title} - KES ${item.price}`}
                      style={{ display: 'block', lineHeight: 0 }}
                    >
                      <img 
                        src={item.src} 
                        alt={item.title}
                        style={{ 
                          width: '100%', 
                          height: '250px', 
                          objectFit: 'cover', 
                          transition: 'transform 0.4s ease',
                          ':hover': { transform: 'scale(1.1)' }
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/img/placeholder.jpg';
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      
                      {/* Overlay */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        padding: '20px',
                        textAlign: 'center'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                      onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                      >
                        <i className="fa fa-search-plus" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.title}</h4>
                        <span style={{ fontSize: '0.9rem', color: '#ffb300' }}>KES {parseFloat(item.price).toLocaleString()}</span>
                      </div>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#777' }}>
                No images found in the gallery.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '40px', 
              gap: '5px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  background: currentPage === 1 ? '#f5f5f5' : '#fff',
                  color: currentPage === 1 ? '#ccc' : '#333',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <i className="fa fa-chevron-left"></i> Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '10px 15px',
                    border: '1px solid #ddd',
                    background: currentPage === page ? '#ffb300' : '#fff',
                    color: currentPage === page ? '#fff' : '#333',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: currentPage === page ? 'bold' : 'normal'
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                  color: currentPage === totalPages ? '#ccc' : '#333',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}