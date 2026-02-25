import { Link } from 'react-router-dom'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

// --- Styles ---
const colors = {
  primary: '#ffb300',
  primaryDark: '#d97706',
  textDark: '#111827',
  textGray: '#4b5563',
  bgLight: '#f9fafb',
  white: '#ffffff',
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.white,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    overflowX: 'hidden',
  },
  sectionPadding: {
    padding: '4rem 1rem', // Reduced horizontal padding on mobile
    maxWidth: '80rem',
    margin: '0 auto',
  },
  headingPrimary: {
    fontSize: '2rem', // Smaller font on mobile
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: '1rem',
    textAlign: 'center',
    lineHeight: '1.2',
  },
  headingSecondary: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  textLead: {
    fontSize: '1rem',
    color: colors.textGray,
    lineHeight: '1.6',
    textAlign: 'center',
    maxWidth: '48rem',
    margin: '0 auto',
    padding: '0 1rem',
  },
  card: {
    backgroundColor: colors.white,
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ✅ UPDATED TEAM IMAGE STYLE
  teamImage: {
    width: '120px', // Smaller on mobile
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 1rem auto',
    border: '3px solid #fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  ctaSection: {
    backgroundColor: colors.primary,
    padding: '4rem 1rem',
    textAlign: 'center',
    color: colors.white,
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.875rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '50px',
    color: colors.white,
    backgroundColor: colors.white,
    textDecoration: 'none',
    cursor: 'pointer',
    marginTop: '1.5rem',
    transition: 'all 0.3s ease',
  },
  // ✅ UPDATED CAROUSEL STYLES
  carouselContainer: {
    position: 'relative',
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1rem',
    overflow: 'hidden',
    width: '100%',
  },
  carouselTrack: {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    gap: '1rem', // Reduced gap on mobile
  },
  carouselSlide: {
    flex: '0 0 100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to top
    padding: '1rem 0.5rem', // Added horizontal padding inside slide
    boxSizing: 'border-box',
    width: '100%',
  },
  carouselButton: {
    position: 'absolute',
    top: '40%', // Adjusted vertical position
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #e5e7eb',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    color: colors.textDark,
    transition: 'background 0.2s',
  },
}

// Team Data
const teamMembers = [
  { 
    name: 'Jane Kerubo Arama', 
    role: 'Chief Executive Officer (CEO)', 
    image: '/assets/img/CEO.jpeg' 
  },
  { 
    name: 'Dickens Otieno Okello', 
    role: 'Operations Manager', 
    image: '/assets/img/operations_manager.jpeg' 
  },
]

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(1)

  // Handle Responsive Slides
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSlidesToShow(2)
      else if (window.innerWidth >= 768) setSlidesToShow(2)
      else setSlidesToShow(1)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(teamMembers.length / slidesToShow))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(teamMembers.length / slidesToShow)) % Math.ceil(teamMembers.length / slidesToShow))
  }

  return (
    <div style={styles.container}>
      
      {/* Hero Section */}
      <div style={{ position: 'relative', backgroundColor: '#111827', overflow: 'hidden' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', zIndex: 10, padding: '4rem 1rem', backgroundColor: '#111827', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ ...styles.headingPrimary, color: '#ffffff', fontSize: '2rem' }}>
              About Sharavista Tours & Travel
            </h1>
            <p style={{ fontSize: '1rem', color: '#d1d5db', lineHeight: '1.6', marginBottom: '1rem' }}>
              Welcome to Sharavista Tours and Travel, your premier partner in creating extraordinary travel experiences throughout Africa and beyond.
            </p>
          </div>
          <div style={{ flex: '1', minHeight: '250px', backgroundImage: 'url(https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.white, paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h2 style={{ ...styles.headingSecondary, color: colors.primary }}>Our Mission</h2>
            <p style={{ fontSize: '1rem', color: colors.textGray, lineHeight: '1.6' }}>
              To be the preferred quality service provider in the tours and travel industry, upholding professionalism through the delivery of quality service that exceeds client expectation.
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h2 style={{ ...styles.headingSecondary, color: colors.primary }}>Our Vision</h2>
            <p style={{ fontSize: '1rem', color: colors.textGray, lineHeight: '1.6' }}>
              To be the preferred travel solution partner in business and leisure in East Africa and rest of the world.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.bgLight, paddingTop: '4rem', paddingBottom: '4rem' }}>
        <h2 style={styles.headingPrimary}>Why Choose Sharavista?</h2>
        <p style={{ ...styles.textLead, marginBottom: '2rem' }}>
          Our team comprises dedicated travel specialists with extensive expertise in East Africa's most spectacular destinations.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={styles.card}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.textDark, marginBottom: '0.75rem' }}>Safety First</h3>
            <p style={{ color: colors.textGray, lineHeight: '1.5', fontSize: '0.95rem' }}>
              We pride ourselves on delivering exceptional service, ensuring every trip is meticulously planned and completely safe.
            </p>
          </div>
          <div style={styles.card}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌍</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.textDark, marginBottom: '0.75rem' }}>Local Expertise</h3>
            <p style={{ color: colors.textGray, lineHeight: '1.5', fontSize: '0.95rem' }}>
              Extensive expertise in East Africa's most spectacular destinations ensures you see the best of Kenya and beyond.
            </p>
          </div>
          <div style={styles.card}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.textDark, marginBottom: '0.75rem' }}>Tailored Experiences</h3>
            <p style={{ color: colors.textGray, lineHeight: '1.5', fontSize: '0.95rem' }}>
              Uniquely tailored journeys designed to create lasting memories, whether for business or leisure.
            </p>
          </div>
        </div>
      </div>

      {/* Team Carousel - FIXED RESPONSIVENESS */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.white, paddingTop: '4rem', paddingBottom: '4rem' }}>
        <h2 style={styles.headingPrimary}>Meet Our Team</h2>
        <p style={{ ...styles.textLead, marginBottom: '2rem' }}>
          The passionate experts behind your unforgettable African adventures
        </p>

        <div style={styles.carouselContainer}>
          {/* Prev Button - Adjusted Left Position for Mobile */}
          <button 
            onClick={prevSlide} 
            style={{ 
              ...styles.carouselButton, 
              left: '5px', // Closer to edge on mobile
              '@media (min-width: 768px)': { left: '-20px' } // Further out on desktop
            }}
            aria-label="Previous slide"
          >
            <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
          </button>

          {/* Track */}
          <div style={{ 
            ...styles.carouselTrack, 
            transform: `translateX(-${currentSlide * 100}%)`,
          }}>
            {teamMembers.map((person, index) => (
              <div 
                key={index} 
                style={{ 
                  ...styles.carouselSlide,
                  // Ensure full width on mobile, half on desktop
                  flexBasis: slidesToShow === 1 ? '100%' : '50%',
                  maxWidth: slidesToShow === 1 ? '100%' : '50%',
                }}
              >
                <img 
                  src={person.image} 
                  alt={person.name} 
                  style={{
                    ...styles.teamImage,
                    // Slightly larger on desktop
                    width: slidesToShow > 1 ? '150px' : '120px',
                    height: slidesToShow > 1 ? '150px' : '120px',
                  }} 
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Image'} 
                />
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '700', 
                  color: colors.textDark, 
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  wordWrap: 'break-word', // Prevent long names from breaking layout
                  maxWidth: '90%',
                }}>{person.name}</h3>
                <p style={{ 
                  color: colors.primary, 
                  fontWeight: '500',
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  lineHeight: '1.4',
                  maxWidth: '90%',
                }}>{person.role}</p>
              </div>
            ))}
          </div>

          {/* Next Button - Adjusted Right Position for Mobile */}
          <button 
            onClick={nextSlide} 
            style={{ 
              ...styles.carouselButton, 
              right: '5px', // Closer to edge on mobile
              '@media (min-width: 768px)': { right: '-20px' } // Further out on desktop
            }}
            aria-label="Next slide"
          >
            <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
        
        {/* Dots Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          {Array.from({ length: Math.ceil(teamMembers.length / slidesToShow) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentSlide === idx ? colors.primary : '#d1d5db',
                cursor: 'pointer',
                transition: 'background 0.3s',
                padding: '0',
                margin: '0',
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: colors.white, marginBottom: '1rem' }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem' }}>
            Contact us today to plan your next adventure with Sharavista Tours & Travel.
          </p>
          <Link 
            to="/contact" 
            style={styles.button}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.white;
              e.currentTarget.style.color = colors.primary;
            }}
          >
            Contact Us
            <ArrowRightIcon style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }} />
          </Link>
        </div>
      </div>
    </div>
  )
}