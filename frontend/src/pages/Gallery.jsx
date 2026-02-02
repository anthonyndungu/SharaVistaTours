import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Gallery() {
  // Initialize Swipebox and Isotope after component mounts
  useEffect(() => {
    // Initialize Swipebox for lightbox functionality
    if (window.$ && window.$.fn.swipebox) {
      $('.swipebox').swipebox()
    }
    
    // Initialize Isotope for gallery filtering (if needed)
    if (window.$ && window.Isotope) {
      const $grid = $('.content_gallery').isotope({
        itemSelector: '.gallery_item-wrap',
        layoutMode: 'fitRows'
      })
      
      // Filter items on click
      $('.gallery-tabs').on('click', 'a', function(e) {
        e.preventDefault()
        const filterValue = $(this).attr('data-filter')
        $grid.isotope({ filter: filterValue })
        $('.gallery-tabs a').removeClass('active')
        $(this).addClass('active')
      })
    }
  }, [])

  // Gallery data
  const galleryItems = [
    { id: 1, title: "World’s hottest destinations for vegans", category: "competitions gears", image: "/assets/img/tour/430x305/tour-1.jpg" },
    { id: 2, title: "Love advice from experts", category: "iinstructional swimbaits", image: "/assets/img/tour/430x305/tour-2.jpg" },
    { id: 3, title: "The perfect summer body", category: "gears iinstructional", image: "/assets/img/tour/430x305/tour-3.jpg" },
    { id: 4, title: "A rare opportunity to try Foundry coffee", category: "competitions swimbaits", image: "/assets/img/tour/430x305/tour-4.jpg" },
    { id: 5, title: "7 Things You Tell People", category: "competitions iinstructional", image: "/assets/img/tour/430x305/tour-5.jpg" },
    { id: 6, title: "The Sun Is Underappreciated", category: "gears swimbaits", image: "/assets/img/tour/430x305/tour-6.jpg" },
    { id: 7, title: "An Overly Close", category: "gears iinstructional", image: "/assets/img/tour/430x305/tour-3.jpg" },
    { id: 8, title: "The Santa Barbara Wildfire", category: "gears swimbaits", image: "/assets/img/tour/430x305/tour-1.jpg" },
    { id: 9, title: "A Perfect Day in the Nature", category: "gears iinstructional", image: "/assets/img/tour/430x305/tour-2.jpg" },
    { id: 10, title: "A smile is a sign of friendliness", category: "competitions iinstructional", image: "/assets/img/tour/430x305/tour-4.jpg" },
    { id: 11, title: "A happy fammily", category: "gears swimbaits", image: "/assets/img/tour/430x305/tour-5.jpg" },
    { id: 12, title: "You big profit", category: "competitions iinstructional", image: "/assets/img/tour/430x305/tour-3.jpg" }
  ]

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
          <h1 className="heading_primary">Gallery</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-area">
        <div className="container">
          <div className="row">
            <div className="site-main col-sm-12 full-width">
              <div className="sc-gallery wrapper_gallery">
                {/* Gallery Filters */}
                <div className="gallery-tabs-wrapper filters">
                  <ul className="gallery-tabs">
                    <li><a href="#" data-filter="*" className="filter active">all</a></li>
                    <li><a href="#" data-filter=".competitions" className="filter">Competitions</a></li>
                    <li><a href="#" data-filter=".gears" className="filter">Gears</a></li>
                    <li><a href="#" data-filter=".iinstructional" className="filter">Iinstructional</a></li>
                    <li><a href="#" data-filter=".swimbaits" className="filter">Swimbaits</a></li>
                  </ul>
                </div>

                {/* Gallery Grid */}
                <div className="row content_gallery">
                  {galleryItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`col-sm-4 gallery_item-wrap ${item.category}`}
                    >
                      <a 
                        href={item.image.replace('/430x305', '')} 
                        className="swipebox" 
                        title={item.title}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title}
                          onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                        />
                        <div className="gallery-item">
                          <h4 className="title">{item.title}</h4>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}