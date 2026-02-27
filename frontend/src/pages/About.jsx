import { Link } from 'react-router-dom'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

// --- Styles & Constants ---
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
    color: colors.textDark,
  },
  sectionPadding: {
    padding: '5rem 1.5rem',
    maxWidth: '80rem',
    margin: '0 auto',
  },
  headingPrimary: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: '1.5rem',
    textAlign: 'center',
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
  },
  headingSecondary: {
    fontSize: '1rem',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  textLead: {
    fontSize: '1.125rem',
    color: colors.textGray,
    lineHeight: '1.8',
    textAlign: 'center',
    maxWidth: '48rem',
    margin: '0 auto',
  },
  // Enhanced Card Style
  card: {
    backgroundColor: colors.white,
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid #f3f4f6',
  },
  teamImage: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 1.5rem auto',
    border: '4px solid #fff',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  ctaSection: {
    backgroundColor: colors.primary,
    padding: '5rem 1.5rem',
    textAlign: 'center',
    color: colors.white,
    backgroundImage: 'linear-gradient(135deg, #ffb300 0%, #d97706 100%)',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 2.5rem',
    fontSize: '1.125rem',
    fontWeight: '700',
    borderRadius: '50px',
    color: colors.primary,
    backgroundColor: colors.white,
    textDecoration: 'none',
    cursor: 'pointer',
    marginTop: '2rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
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
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    gap: '2rem',
  },
  carouselSlide: {
    flex: '0 0 100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    boxSizing: 'border-box',
    width: '100%',
  },
  carouselButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e5e7eb',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    color: colors.textDark,
    transition: 'all 0.2s',
  },
  // Image Grid Styles
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    marginTop: '3rem',
  },
  gridImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.4s ease',
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

// Gallery Images for "Our Journey"
const journeyImages = [
  { src: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Safari Adventure' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Pristine Beaches' },
  { src: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Cultural Experience' },
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
      <br />
      <br />
      <br />
      <br />
      {/* Hero Section */}
      <div style={{ position: 'relative', backgroundColor: '#111827', overflow: 'hidden' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', zIndex: 10, padding: '5rem 1.5rem', backgroundColor: '#111827', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ color: colors.primary, fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', fontSize: '0.875rem' }}>Who We Are</span>
            <h1 style={{ ...styles.headingPrimary, color: '#ffffff', fontSize: '2.5rem', maxWidth: '600px' }}>
              About Sharavista Tours & Travel
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.8', maxWidth: '600px' }}>
              Your premier partner in creating extraordinary travel experiences throughout Africa and beyond.
            </p>
          </div>
          <div style={{ flex: '1', minHeight: '300px', backgroundImage: 'url(https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>
      </div>

      {/* Our Story Section */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.white }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <h2 style={styles.headingSecondary}>Our Story</h2>
          <h3 style={{ fontSize: '1.875rem', fontWeight: '800', color: colors.textDark, textAlign: 'center', marginBottom: '2rem', lineHeight: '1.3' }}>
            Crafting Memories Since 2024
          </h3>
          
          <div style={{ fontSize: '1.125rem', color: colors.textGray, lineHeight: '1.8', textAlign: 'left', spaceY: '1.5rem' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Established in <strong>December 2024</strong>, Sharavista Tours and Travel has quickly emerged as a leading destination management company dedicated to providing personalized travel solutions that exceed expectations.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              At Sharavista, we're passionate about making every journey seamless, immersive, and truly memorable. Whether you dream of thrilling wildlife safaris, pristine beach escapes, or captivating international adventures, we're here to transform your travel visions into reality.
            </p>

            <p>
              Our team comprises dedicated travel specialists with extensive expertise in East Africa's most spectacular destinations and global travel networks. We pride ourselves on delivering exceptional service, ensuring every trip is meticulously planned, completely safe, and uniquely tailored to create lasting memories.
            </p>
          </div>

          {/* ✅ NEW: Visual Journey Grid */}
          <div style={{
            ...styles.imageGrid,
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            {journeyImages.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  style={styles.gridImage}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  padding: '20px',
                  color: '#fff',
                  fontWeight: '600'
                }}>
                  {img.alt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.bgLight }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '2.5rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: colors.primary }}>🎯</div>
            <h2 style={{ ...styles.headingSecondary, color: colors.primary, marginBottom: '1rem' }}>Our Mission</h2>
            <p style={{ fontSize: '1.125rem', color: colors.textGray, lineHeight: '1.8' }}>
              To be the preferred quality service provider in the tours and travel industry, upholding professionalism through the delivery of quality service that exceeds client expectation.
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '2.5rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: colors.primary }}>👁️</div>
            <h2 style={{ ...styles.headingSecondary, color: colors.primary, marginBottom: '1rem' }}>Our Vision</h2>
            <p style={{ fontSize: '1.125rem', color: colors.textGray, lineHeight: '1.8' }}>
              To be the preferred travel solution partner in business and leisure in East Africa and rest of the world.
            </p>
          </div>
        </div>
      </div>

      {/* Values - Enhanced with Icons */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.white }}>
        <h2 style={styles.headingPrimary}>Why Choose Sharavista?</h2>
        <p style={{ ...styles.textLead, marginBottom: '3rem' }}>
          We combine local expertise with global standards to deliver unforgettable experiences.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {[
            { icon: '🛡️', title: 'Safety First', desc: 'Every trip is meticulously planned and completely safe, giving you peace of mind.' },
            { icon: '🌍', title: 'Local Expertise', desc: 'Extensive knowledge of East Africa\'s most spectacular destinations ensures you see the best.' },
            { icon: '✨', title: 'Tailored Experiences', desc: 'Uniquely tailored journeys designed to create lasting memories for business or leisure.' }
          ].map((item, idx) => (
            <div key={idx} style={styles.card}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)';
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.textDark, marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: colors.textGray, lineHeight: '1.7', fontSize: '1.125rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Carousel - Enhanced Design */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.bgLight }}>
        <h2 style={styles.headingPrimary}>Meet Our Team</h2>
        <p style={{ ...styles.textLead, marginBottom: '3rem' }}>
          The passionate experts behind your unforgettable African adventures
        </p>

        <div style={styles.carouselContainer}>
          <button 
            onClick={prevSlide} 
            style={{ ...styles.carouselButton, left: '0' }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = colors.textDark;
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            aria-label="Previous slide"
          >
            <ChevronLeftIcon style={{ width: '24px', height: '24px' }} />
          </button>

          <div style={{ 
            ...styles.carouselTrack, 
            transform: `translateX(-${currentSlide * 100}%)`,
          }}>
            {teamMembers.map((person, index) => (
              <div 
                key={index} 
                style={{ 
                  ...styles.carouselSlide,
                  flexBasis: slidesToShow === 1 ? '100%' : '50%',
                  maxWidth: slidesToShow === 1 ? '100%' : '50%',
                }}
              >
                <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    style={{
                      ...styles.teamImage,
                      width: slidesToShow > 1 ? '160px' : '140px',
                      height: slidesToShow > 1 ? '160px' : '140px',
                    }} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/160?text=No+Image'} 
                  />
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '800', 
                    color: colors.textDark, 
                    marginBottom: '0.5rem',
                  }}>{person.name}</h3>
                  <p style={{ 
                    color: colors.primary, 
                    fontWeight: '600',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '1rem',
                  }}>{person.role}</p>
                  <div style={{ height: '2px', width: '50px', background: '#f3f4f6', margin: '0 auto' }}></div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={nextSlide} 
            style={{ ...styles.carouselButton, right: '0' }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = colors.textDark;
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            aria-label="Next slide"
          >
            <ChevronRightIcon style={{ width: '24px', height: '24px' }} />
          </button>
        </div>
        
        {/* Dots Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
          {Array.from({ length: Math.ceil(teamMembers.length / slidesToShow) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? '2rem' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: currentSlide === idx ? colors.primary : '#d1d5db',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
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
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.white, marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.95)', marginBottom: '2rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            Contact us today to plan your next adventure with Sharavista Tours & Travel.
          </p>
          <Link 
            to="/contact" 
            style={styles.button}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = colors.primary;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.white;
              e.currentTarget.style.color = colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            Contact Us
            <ArrowRightIcon style={{ marginLeft: '0.75rem', width: '1.5rem', height: '1.5rem' }} />
          </Link>
        </div>
      </div>
    </div>
  )
}