// import { Link } from 'react-router-dom'
// import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
// import { useState, useEffect } from 'react'

// // --- Styles ---
// const colors = {
//   primary: '#ffb300', // Amber/Gold from your theme
//   primaryDark: '#d97706',
//   textDark: '#111827',
//   textGray: '#4b5563',
//   textLight: '#9ca3af',
//   bgLight: '#f9fafb',
//   white: '#ffffff',
//   black: '#000000',
// }

// const styles = {
//   container: {
//     minHeight: '100vh',
//     backgroundColor: colors.white,
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     overflowX: 'hidden',
//   },
//   sectionPadding: {
//     padding: '4rem 1.5rem',
//     maxWidth: '80rem',
//     margin: '0 auto',
//   },
//   headingPrimary: {
//     fontSize: '2.5rem',
//     fontWeight: '700',
//     color: colors.textDark,
//     marginBottom: '1.5rem',
//     textAlign: 'center',
//     lineHeight: '1.2',
//   },
//   headingSecondary: {
//     fontSize: '1.5rem',
//     fontWeight: '600',
//     color: colors.primary,
//     marginBottom: '1rem',
//     textAlign: 'center',
//     textTransform: 'uppercase',
//     letterSpacing: '1px',
//   },
//   textLead: {
//     fontSize: '1.125rem',
//     color: colors.textGray,
//     lineHeight: '1.8',
//     textAlign: 'center',
//     maxWidth: '48rem',
//     margin: '0 auto',
//   },
//   card: {
//     backgroundColor: colors.white,
//     padding: '2.5rem',
//     borderRadius: '8px',
//     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//     textAlign: 'center',
//     height: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     transition: 'transform 0.3s ease',
//   },
//   teamImage: {
//     width: '150px',
//     height: '150px',
//     borderRadius: '50%',
//     objectFit: 'cover',
//     margin: '0 auto 1.5rem auto',
//     border: '4px solid #fff',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//   },
//   ctaSection: {
//     backgroundColor: colors.primary,
//     padding: '5rem 1.5rem',
//     textAlign: 'center',
//     color: colors.white,
//   },
//   button: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '1rem 2.5rem',
//     border: '2px solid colors.white',
//     fontSize: '1.125rem',
//     fontWeight: '600',
//     borderRadius: '50px',
//     color: colors.white,
//     backgroundColor: 'transparent',
//     textDecoration: 'none',
//     transition: 'all 0.3s ease',
//     cursor: 'pointer',
//     marginTop: '2rem',
//   },
//   // Carousel Specific
//   carouselContainer: {
//     position: 'relative',
//     maxWidth: '80rem',
//     margin: '0 auto',
//     padding: '0 1rem',
//     overflow: 'hidden',
//   },
//   carouselTrack: {
//     display: 'flex',
//     transition: 'transform 0.5s ease-in-out',
//     gap: '2rem',
//   },
//   carouselSlide: {
//     flex: '0 0 100%', // Mobile default
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '1rem',
//   },
//   carouselButton: {
//     position: 'absolute',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     border: 'none',
//     borderRadius: '50%',
//     width: '40px',
//     height: '40px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     cursor: 'pointer',
//     zIndex: 10,
//     boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//     color: colors.textDark,
//     transition: 'background 0.2s',
//   },
// }

// // Team Data
// const teamMembers = [
//   { name: 'Anthony Ndungu', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
//   { name: 'Sarah Wanjiku', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
//   { name: 'David Ochieng', role: 'Lead Guide', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
//   { name: 'Mary Akinyi', role: 'Customer Service', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
//   { name: 'John Kamau', role: 'Safety Officer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
// ]

// export default function About() {
//   const [currentSlide, setCurrentSlide] = useState(0)
//   const [slidesToShow, setSlidesToShow] = useState(1)

//   // Handle Responsive Slides
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) setSlidesToShow(3)
//       else if (window.innerWidth >= 768) setSlidesToShow(2)
//       else setSlidesToShow(1)
//     }
    
//     handleResize() // Initial check
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % Math.ceil(teamMembers.length / slidesToShow))
//   }

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + Math.ceil(teamMembers.length / slidesToShow)) % Math.ceil(teamMembers.length / slidesToShow))
//   }

//   return (
//     <div style={styles.container}>
      
//       {/* Hero Section */}
//       <div style={{ position: 'relative', backgroundColor: '#111827', overflow: 'hidden' }}>
//         <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', lgFlexDirection: 'row' }}>
//           {/* Text Content */}
//           <div style={{ position: 'relative', zIndex: 10, padding: '5rem 1.5rem', backgroundColor: '#111827', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//             <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '1.5rem', lineHeight: '1.2' }}>
//               About Sharavista Tours & Travel
//             </h1>
//             <p style={{ fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.8', marginBottom: '1.5rem' }}>
//               Welcome to Sharavista Tours and Travel, your premier partner in creating extraordinary travel experiences throughout Africa and beyond. Established in December 2024, we've quickly emerged as a leading destination management company dedicated to providing personalized travel solutions that exceed expectations.
//             </p>
//             <p style={{ fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.8' }}>
//               At Sharavista, we're passionate about making every journey seamless, immersive, and truly memorable. Whether you dream of thrilling wildlife safaris, pristine beach escapes, or captivating international adventures, we're here to transform your travel visions into reality.
//             </p>
//           </div>
          
//           {/* Image Content (Hidden on mobile, shown on large screens via flex logic if needed, but keeping simple stack for now) */}
//           <div style={{ flex: '1', minHeight: '300px', backgroundImage: 'url(https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
//         </div>
//       </div>

//       {/* Mission & Vision Section */}
//       <div style={{ ...styles.sectionPadding, backgroundColor: colors.white, paddingTop: '5rem', paddingBottom: '5rem' }}>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
          
//           {/* Mission */}
//           <div style={{ textAlign: 'center', padding: '2rem' }}>
//             <h2 style={{ ...styles.headingSecondary, color: colors.primary }}>Our Mission</h2>
//             <p style={{ fontSize: '1.125rem', color: colors.textGray, lineHeight: '1.8' }}>
//               To be the preferred quality service provider in the tours and travel industry, upholding professionalism through the delivery of quality service that exceeds client expectation.
//             </p>
//           </div>

//           {/* Vision */}
//           <div style={{ textAlign: 'center', padding: '2rem' }}>
//             <h2 style={{ ...styles.headingSecondary, color: colors.primary }}>Our Vision</h2>
//             <p style={{ fontSize: '1.125rem', color: colors.textGray, lineHeight: '1.8' }}>
//               To be the preferred travel solution partner in business and leisure in East Africa and rest of the world.
//             </p>
//           </div>

//         </div>
//       </div>

//       {/* Values Section */}
//       <div style={{ ...styles.sectionPadding, backgroundColor: colors.bgLight, paddingTop: '5rem', paddingBottom: '5rem' }}>
//         <h2 style={styles.headingPrimary}>Why Choose Sharavista?</h2>
//         <p style={{ ...styles.textLead, marginBottom: '3rem' }}>
//           Our team comprises dedicated travel specialists with extensive expertise in East Africa's most spectacular destinations and global travel networks.
//         </p>
        
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
//           {/* Value 1 */}
//           <div style={styles.card}>
//             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textDark, marginBottom: '1rem' }}>Safety First</h3>
//             <p style={{ color: colors.textGray, lineHeight: '1.6' }}>
//               We pride ourselves on delivering exceptional service, ensuring every trip is meticulously planned and completely safe.
//             </p>
//           </div>
          
//           {/* Value 2 */}
//           <div style={styles.card}>
//             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textDark, marginBottom: '1rem' }}>Local Expertise</h3>
//             <p style={{ color: colors.textGray, lineHeight: '1.6' }}>
//               Extensive expertise in East Africa's most spectacular destinations ensures you see the best of Kenya and beyond.
//             </p>
//           </div>
          
//           {/* Value 3 */}
//           <div style={styles.card}>
//             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
//             <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textDark, marginBottom: '1rem' }}>Tailored Experiences</h3>
//             <p style={{ color: colors.textGray, lineHeight: '1.6' }}>
//               Uniquely tailored journeys designed to create lasting memories, whether for business or leisure.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Team Carousel Section */}
//       <div style={{ ...styles.sectionPadding, backgroundColor: colors.white, paddingTop: '5rem', paddingBottom: '5rem' }}>
//         <h2 style={styles.headingPrimary}>Meet Our Team</h2>
//         <p style={{ ...styles.textLead, marginBottom: '3rem' }}>
//           The passionate experts behind your unforgettable African adventures
//         </p>

//         <div style={styles.carouselContainer}>
//           {/* Prev Button */}
//           <button 
//             onClick={prevSlide} 
//             style={{ ...styles.carouselButton, left: '0' }}
//             aria-label="Previous slide"
//           >
//             <ChevronLeftIcon style={{ width: '24px', height: '24px' }} />
//           </button>

//           {/* Track */}
//           <div style={{ 
//             ...styles.carouselTrack, 
//             transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
//             // Note: For a production app with variable slidesToShow, complex calculation is needed. 
//             // This simple percentage works well for fixed groups.
//             // A more robust way for dynamic slidesToShow:
//             transform: `translateX(-${currentSlide * 100}%)`, 
//             width: `${(teamMembers.length / slidesToShow) * 100}%` // Adjust width based on total items
//           }}>
//             {teamMembers.map((person, index) => (
//               <div 
//                 key={index} 
//                 style={{ 
//                   ...styles.carouselSlide, 
//                   flexBasis: `${100 / slidesToShow}%`, // Dynamic width based on screen
//                   boxSizing: 'border-box'
//                 }}
//               >
//                 <img src={person.image} alt={person.name} style={styles.teamImage} />
//                 <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textDark, marginBottom: '0.5rem' }}>{person.name}</h3>
//                 <p style={{ color: colors.primary, fontWeight: '500' }}>{person.role}</p>
//               </div>
//             ))}
//           </div>

//           {/* Next Button */}
//           <button 
//             onClick={nextSlide} 
//             style={{ ...styles.carouselButton, right: '0' }}
//             aria-label="Next slide"
//           >
//             <ChevronRightIcon style={{ width: '24px', height: '24px' }} />
//           </button>
//         </div>
        
//         {/* Dots Indicator */}
//         <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
//           {Array.from({ length: Math.ceil(teamMembers.length / slidesToShow) }).map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrentSlide(idx)}
//               style={{
//                 width: '12px',
//                 height: '12px',
//                 borderRadius: '50%',
//                 border: 'none',
//                 backgroundColor: currentSlide === idx ? colors.primary : '#d1d5db',
//                 cursor: 'pointer',
//                 transition: 'background 0.3s'
//               }}
//               aria-label={`Go to slide ${idx + 1}`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div style={styles.ctaSection}>
//         <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
//           <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.white, marginBottom: '1.5rem' }}>
//             Ready to Start Your Journey?
//           </h2>
//           <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
//             Contact us today to plan your next adventure with Sharavista Tours & Travel.
//           </p>
//           <Link 
//             to="/contact" 
//             style={{
//               ...styles.button,
//               borderColor: colors.white,
//               backgroundColor: colors.white,
//               color: colors.primary,
//             }}
//             onMouseOver={(e) => {
//               e.currentTarget.style.backgroundColor = '#f3f4f6';
//               e.currentTarget.style.transform = 'translateY(-2px)';
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.backgroundColor = colors.white;
//               e.currentTarget.style.transform = 'translateY(0)';
//             }}
//           >
//             Contact Us
//             <ArrowRightIcon style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }} />
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

import { Link } from 'react-router-dom'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

// --- Styles ---
const colors = {
  primary: '#ffb300', // Amber/Gold from your theme
  primaryDark: '#d97706',
  textDark: '#111827',
  textGray: '#4b5563',
  textLight: '#9ca3af',
  bgLight: '#f9fafb',
  white: '#ffffff',
  black: '#000000',
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.white,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    overflowX: 'hidden',
  },
  sectionPadding: {
    padding: '4rem 1.5rem',
    maxWidth: '80rem',
    margin: '0 auto',
  },
  headingPrimary: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: '1.5rem',
    textAlign: 'center',
    lineHeight: '1.2',
  },
  headingSecondary: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: '1rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  textLead: {
    fontSize: '1.125rem',
    color: colors.textGray,
    lineHeight: '1.8',
    textAlign: 'center',
    maxWidth: '48rem',
    margin: '0 auto',
  },
  card: {
    backgroundColor: colors.white,
    padding: '2.5rem',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
  },
  teamImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 1.5rem auto',
    border: '4px solid #fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  ctaSection: {
    backgroundColor: colors.primary,
    padding: '5rem 1.5rem',
    textAlign: 'center',
    color: colors.white,
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 2.5rem',
    border: '2px solid colors.white',
    fontSize: '1.125rem',
    fontWeight: '600',
    borderRadius: '50px',
    color: colors.white,
    backgroundColor: 'transparent',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    marginTop: '2rem',
  },
  // Carousel Specific
  carouselContainer: {
    position: 'relative',
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1rem',
    overflow: 'hidden',
  },
  carouselTrack: {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    gap: '2rem',
  },
  carouselSlide: {
    flex: '0 0 100%', // Mobile default
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  carouselButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    color: colors.textDark,
    transition: 'background 0.2s',
  },
}

// ✅ UPDATED TEAM DATA WITH REAL IMAGES & NAMES
const teamMembers = [
  { 
    name: 'Jane Kerubo Arama', 
    role: 'Chief Executive Officer (CEO)', 
    image: '/assets/img/jane-kerubo-arama.jpeg' // Replace with actual path if hosted locally
  },
  { 
    name: 'Dickens Otieno Okello', 
    role: 'Operations Manager', 
    image: '/assets/img/dickens-otieno-okello.jpeg' // Replace with actual path if hosted locally
  },
]

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(1)

  // Handle Responsive Slides
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSlidesToShow(2) // Show 2 on desktop since we only have 2 members
      else if (window.innerWidth >= 768) setSlidesToShow(2)
      else setSlidesToShow(1)
    }
    
    handleResize() // Initial check
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
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', lgFlexDirection: 'row' }}>
          {/* Text Content */}
          <div style={{ position: 'relative', zIndex: 10, padding: '5rem 1.5rem', backgroundColor: '#111827', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              About Sharavista Tours & Travel
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Welcome to Sharavista Tours and Travel, your premier partner in creating extraordinary travel experiences throughout Africa and beyond. Established in December 2024, we've quickly emerged as a leading destination management company dedicated to providing personalized travel solutions that exceed expectations.
            </p>
            <p style={{ fontSize: '1.125rem', color: '#d1d5db', lineHeight: '1.8' }}>
              At Sharavista, we're passionate about making every journey seamless, immersive, and truly memorable. Whether you dream of thrilling wildlife safaris, pristine beach escapes, or captivating international adventures, we're here to transform your travel visions into reality.
            </p>
          </div>
          
          {/* Image Content */}
          <div style={{ flex: '1', minHeight: '300px', backgroundImage: 'url(https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.white, paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' } }}>
          
          {/* Mission */}
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ ...styles.headingSecondary, color: colors.primary }}>Our Mission</h2>
            <p style={{ fontSize: '1.125rem', color: colors.textGray, lineHeight: '1.8' }}>
              To be the preferred quality service provider in the tours and travel industry, upholding professionalism through the delivery of quality service that exceeds client expectation.
            </p>
          </div>

          {/* Vision */}
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ ...styles.headingSecondary, color: colors.primary }}>Our Vision</h2>
            <p style={{ fontSize: '1.125rem', color: colors.textGray, lineHeight: '1.8' }}>
              To be the preferred travel solution partner in business and leisure in East Africa and rest of the world.
            </p>
          </div>

        </div>
      </div>

      {/* Values Section */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.bgLight, paddingTop: '5rem', paddingBottom: '5rem' }}>
        <h2 style={styles.headingPrimary}>Why Choose Sharavista?</h2>
        <p style={{ ...styles.textLead, marginBottom: '3rem' }}>
          Our team comprises dedicated travel specialists with extensive expertise in East Africa's most spectacular destinations and global travel networks.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', '@media (min-width: 768px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
          {/* Value 1 */}
          <div style={styles.card}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textDark, marginBottom: '1rem' }}>Safety First</h3>
            <p style={{ color: colors.textGray, lineHeight: '1.6' }}>
              We pride ourselves on delivering exceptional service, ensuring every trip is meticulously planned and completely safe.
            </p>
          </div>
          
          {/* Value 2 */}
          <div style={styles.card}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textDark, marginBottom: '1rem' }}>Local Expertise</h3>
            <p style={{ color: colors.textGray, lineHeight: '1.6' }}>
              Extensive expertise in East Africa's most spectacular destinations ensures you see the best of Kenya and beyond.
            </p>
          </div>
          
          {/* Value 3 */}
          <div style={styles.card}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textDark, marginBottom: '1rem' }}>Tailored Experiences</h3>
            <p style={{ color: colors.textGray, lineHeight: '1.6' }}>
              Uniquely tailored journeys designed to create lasting memories, whether for business or leisure.
            </p>
          </div>
        </div>
      </div>

      {/* Team Carousel Section */}
      <div style={{ ...styles.sectionPadding, backgroundColor: colors.white, paddingTop: '5rem', paddingBottom: '5rem' }}>
        <h2 style={styles.headingPrimary}>Meet Our Team</h2>
        <p style={{ ...styles.textLead, marginBottom: '3rem' }}>
          The passionate experts behind your unforgettable African adventures
        </p>

        <div style={styles.carouselContainer}>
          {/* Prev Button */}
          <button 
            onClick={prevSlide} 
            style={{ ...styles.carouselButton, left: '0' }}
            aria-label="Previous slide"
          >
            <ChevronLeftIcon style={{ width: '24px', height: '24px' }} />
          </button>

          {/* Track */}
          <div style={{ 
            ...styles.carouselTrack, 
            transform: `translateX(-${currentSlide * 100}%)`, 
            width: `${(teamMembers.length / slidesToShow) * 100}%`
          }}>
            {teamMembers.map((person, index) => (
              <div 
                key={index} 
                style={{ 
                  ...styles.carouselSlide, 
                  flexBasis: `${100 / slidesToShow}%`,
                  boxSizing: 'border-box'
                }}
              >
                {/* ✅ UPDATED IMAGES */}
                <img src={person.image} alt={person.name} style={styles.teamImage} onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.textDark, marginBottom: '0.5rem' }}>{person.name}</h3>
                <p style={{ color: colors.primary, fontWeight: '500' }}>{person.role}</p>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button 
            onClick={nextSlide} 
            style={{ ...styles.carouselButton, right: '0' }}
            aria-label="Next slide"
          >
            <ChevronRightIcon style={{ width: '24px', height: '24px' }} />
          </button>
        </div>
        
        {/* Dots Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          {Array.from({ length: Math.ceil(teamMembers.length / slidesToShow) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentSlide === idx ? colors.primary : '#d1d5db',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.white, marginBottom: '1.5rem' }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
            Contact us today to plan your next adventure with Sharavista Tours & Travel.
          </p>
          <Link 
            to="/contact" 
            style={{
              ...styles.button,
              borderColor: colors.white,
              backgroundColor: colors.white,
              color: colors.primary,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.white;
              e.currentTarget.style.transform = 'translateY(0)';
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