// import { useState } from 'react'
// import { Link } from 'react-router-dom'

// export default function Contact() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setSubmitStatus(null)

//     try {
//       // Simulate API call (Replace with actual API call later)
//       await new Promise(resolve => setTimeout(resolve, 1500))
      
//       // In real app: await api.post('/contact', formData)
      
//       setSubmitStatus('success')
//       setFormData({ name: '', email: '', subject: '', message: '' })
      
//       // Auto-hide success message after 5 seconds
//       setTimeout(() => setSubmitStatus(null), 5000)
//     } catch (error) {
//       setSubmitStatus('error')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   // Social Media Data (Matching Footer) - ✅ FIXED ICONS FOR COMPATIBILITY
//   const socialLinks = [
//     { 
//       name: 'facebook', 
//       icon: 'fa-facebook-square', // Works on FA 4, 5, 6
//       url: 'https://www.facebook.com/people/Sharavista-Tours/61582686912041/', 
//       color: '#1877F2' 
//     },
//     { 
//       name: 'X', 
//       icon: 'fa-twitter', // ✅ FALLBACK: Shows bird logo (works on all versions)
//       url: 'https://twitter.com/sharavista', 
//       color: '#000000' 
//     },
//     { 
//       name: 'instagram', 
//       icon: 'fa-instagram', // Works on FA 4, 5, 6
//       url: 'https://www.instagram.com/sharavistatours/', 
//       color: '#E4405F' 
//     },
//     { 
//       name: 'youtube', 
//       icon: 'fa-youtube-play', // Works on FA 4, 5, 6
//       url: '#', 
//       color: '#FF0000' 
//     },
//     { 
//       name: 'tiktok', 
//       icon: 'fa-tiktok', // ✅ FALLBACK: Shows music note (FA 5 doesn't have TikTok logo)
//       // If you upgrade to FA 6, change this back to: 'fa-brands fa-tiktok'
//       url: '#', 
//       color: '#00f2ea' 
//     },
//     { 
//       name: 'whatsapp', 
//       icon: 'fa-whatsapp', // Works on FA 4, 5, 6
//       url: `https://wa.me/254769859091?text=Hello%20Sharavista%20Tours,%20I%20have%20an%20inquiry%20from%20the%20contact%20page.`, 
//       color: '#25D366' 
//     }
//   ]

//   return (
//     <div className="archive" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
//       {/* 1. Modern Hero Header */}
//       <div style={{ 
//         background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(/assets/img/banner/top-heading.jpg)',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         padding: '80px 0',
//         textAlign: 'center',
//         color: '#fff'
//       }}>
//         <div className="container">
//           <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '10px' }}>Get in Touch</h1>
//           <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
//             Have questions about our tours? We're here to help you plan your perfect adventure.
//           </p>
//           <div style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
//             <Link to="/" style={{ color: '#ffb300', textDecoration: 'none' }}>Home</Link> / Contact
//           </div>
//         </div>
//       </div>

//       {/* 2. Main Content */}
//       <section className="content-area" style={{ padding: '60px 0' }}>
//         <div className="container">
          
//           {/* Top Info Cards */}
//           <div style={{ 
//             display: 'grid', 
//             gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
//             gap: '30px', 
//             marginBottom: '60px',
//             marginTop: '-80px', // Overlap effect
//             position: 'relative',
//             zIndex: 10
//           }}>
//             {[
//               { icon: 'fa-map-marker', title: 'Visit Us', info: 'Nairobi, Kenya', sub: 'Westlands Area' },
//               { icon: 'fa-phone', title: 'Call Us', info: '+254 769 859 091', sub: 'Mon-Fri, 9am-5pm' },
//               { icon: 'fa-envelope', title: 'Email Us', info: 'info@sharavistatours.com', sub: '24/7 Support' }
//             ].map((item, i) => (
//               <div key={i} style={{ 
//                 background: '#fff', 
//                 padding: '30px', 
//                 borderRadius: '12px', 
//                 boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
//                 textAlign: 'center',
//                 borderTop: '4px solid #ffb300'
//               }}>
//                 <div style={{ fontSize: '2.5rem', color: '#ffb300', marginBottom: '15px' }}>
//                   <i className={`fa ${item.icon}`}></i>
//                 </div>
//                 <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', color: '#333' }}>{item.title}</h3>
//                 <p style={{ margin: 0, fontWeight: 'bold', color: '#555' }}>{item.info}</p>
//                 <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#888' }}>{item.sub}</p>
//               </div>
//             ))}
//           </div>

//           <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
            
//             {/* Left Column: Form */}
//             <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
//               <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
//                 <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#333' }}>Send us a Message</h2>
//                 <p style={{ color: '#666', marginBottom: '30px' }}>Fill out the form below and we will get back to you within 24 hours.</p>

//                 {submitStatus === 'success' && (
//                   <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c3e6cb' }}>
//                     <i className="fa fa-check-circle"></i> Thank you! Your message has been sent successfully.
//                   </div>
//                 )}
//                 {submitStatus === 'error' && (
//                   <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
//                     <i className="fa fa-exclamation-circle"></i> Failed to send message. Please try again.
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit}>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
//                     <div>
//                       <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Your Name *</label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                         style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
//                         placeholder="John Doe"
//                       />
//                     </div>
//                     <div>
//                       <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Email Address *</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                         style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
//                         placeholder="john@example.com"
//                       />
//                     </div>
//                   </div>

//                   <div style={{ marginBottom: '20px' }}>
//                     <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Subject</label>
//                     <input
//                       type="text"
//                       name="subject"
//                       value={formData.subject}
//                       onChange={handleChange}
//                       style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
//                       placeholder="Inquiry about Safari Tour"
//                     />
//                   </div>

//                   <div style={{ marginBottom: '25px' }}>
//                     <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Message *</label>
//                     <textarea
//                       name="message"
//                       value={formData.message}
//                       onChange={handleChange}
//                       rows="5"
//                       required
//                       style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', resize: 'vertical' }}
//                       placeholder="Tell us about your travel plans..."
//                     ></textarea>
//                   </div>

//                   <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       style={{
//                         flex: '1',
//                         minWidth: '200px',
//                         background: '#ffb300',
//                         color: '#fff',
//                         border: 'none',
//                         padding: '14px 30px',
//                         fontSize: '1rem',
//                         fontWeight: 'bold',
//                         borderRadius: '6px',
//                         cursor: isSubmitting ? 'not-allowed' : 'pointer',
//                         opacity: isSubmitting ? 0.7 : 1,
//                         transition: 'background 0.3s',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: '10px'
//                       }}
//                       onMouseOver={(e) => !isSubmitting && (e.target.style.background = '#e6a100')}
//                       onMouseOut={(e) => !isSubmitting && (e.target.style.background = '#ffb300')}
//                     >
//                       {isSubmitting ? 'Sending...' : 'Send Message'} <i className="fa fa-paper-plane"></i>
//                     </button>

//                     {/* Quick Email Button */}
//                     <a
//                       href="mailto:info@sharavistatours.com?subject=Inquiry from Website&body=Hello Sharavista Tours,"
//                       style={{
//                         flex: '1',
//                         minWidth: '200px',
//                         background: '#fff',
//                         color: '#333',
//                         border: '2px solid #ddd',
//                         padding: '14px 30px',
//                         fontSize: '1rem',
//                         fontWeight: 'bold',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                         transition: 'all 0.3s',
//                         textDecoration: 'none',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: '10px'
//                       }}
//                       onMouseOver={(e) => {
//                         e.target.style.borderColor = '#ffb300';
//                         e.target.style.color = '#ffb300';
//                       }}
//                       onMouseOut={(e) => {
//                         e.target.style.borderColor = '#ddd';
//                         e.target.style.color = '#333';
//                       }}
//                     >
//                       <i className="fa fa-envelope"></i> Open Email App
//                     </a>
//                   </div>
//                 </form>
//               </div>
//             </div>

//             {/* Right Column: Map & Details */}
//             <div style={{ flex: '1 1 400px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
//               {/* Interactive Map */}
//               <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', height: '350px' }}>
//                 <iframe 
//                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255278.6983466826!2d36.70730844250488!3d-1.3032090999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1771147070894!5m2!1sen!2ske" 
//                   width="100%" 
//                   height="100%" 
//                   style={{ border: '0' }}
//                   allowFullScreen=""
//                   loading="lazy"
//                   title="Sharavista Tours Location"
//                 ></iframe>
//               </div>

//               {/* Detailed Info Card */}
//               <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
//                 <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Contact Details</h3>
                
//                 <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//                   <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
//                     <div style={{ width: '40px', height: '40px', background: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb300', flexShrink: 0 }}>
//                       <i className="fa fa-map-marker"></i>
//                     </div>
//                     <div>
//                       <strong style={{ display: 'block', color: '#333', marginBottom: '4px' }}>Head Office</strong>
//                       <span style={{ color: '#666' }}>Westlands, Nairobi, Kenya</span>
//                     </div>
//                   </li>

//                   <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
//                     <div style={{ width: '40px', height: '40px', background: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb300', flexShrink: 0 }}>
//                       <i className="fa fa-phone"></i>
//                     </div>
//                     <div>
//                       <strong style={{ display: 'block', color: '#333', marginBottom: '4px' }}>Phone</strong>
//                       <span style={{ color: '#666' }}>+254 769 859 091</span>
//                     </div>
//                   </li>

//                   <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
//                     <div style={{ width: '40px', height: '40px', background: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb300', flexShrink: 0 }}>
//                       <i className="fa fa-envelope"></i>
//                     </div>
//                     <div>
//                       <strong style={{ display: 'block', color: '#333', marginBottom: '4px' }}>Email</strong>
//                       <a href="mailto:info@sharavistatours.com" style={{ color: '#26bdf7', textDecoration: 'none' }}>info@sharavistatours.com</a>
//                     </div>
//                   </li>

//                   <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
//                     <div style={{ width: '40px', height: '40px', background: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb300', flexShrink: 0 }}>
//                       <i className="fa fa-clock-o"></i>
//                     </div>
//                     <div>
//                       <strong style={{ display: 'block', color: '#333', marginBottom: '4px' }}>Working Hours</strong>
//                       <span style={{ color: '#666' }}>Mon – Fri: 9:00 am – 5:30 pm<br/>Sat: 9:00 am – 1:00 pm</span>
//                     </div>
//                   </li>
//                 </ul>

//                 <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
//                   <h4 style={{ margin: '0 0 15px', fontSize: '1.1rem', color: '#333' }}>Follow Us</h4>
//                   <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
//                     {socialLinks.map((social) => (
//                       <a 
//                         key={social.name} 
//                         href={social.url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         style={{ 
//                           width: '36px', height: '36px', 
//                           background: '#f0f0f0', 
//                           borderRadius: '50%', 
//                           display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           color: '#555',
//                           transition: 'all 0.3s',
//                           textDecoration: 'none'
//                         }}
//                         onMouseOver={(e) => {
//                           e.currentTarget.style.background = social.color;
//                           e.currentTarget.style.color = '#fff';
//                           // Special case for TikTok if using light icon
//                           if(social.name === 'tiktok') e.currentTarget.style.color = '#fff'; 
//                         }}
//                         onMouseOut={(e) => {
//                           e.currentTarget.style.background = '#f0f0f0';
//                           e.currentTarget.style.color = '#555';
//                         }}
//                         title={social.name}
//                       >
//                         <i className={`fa ${social.icon}`}></i>
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const form = useRef()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // ⚠️ REPLACE THESE WITH YOUR ACTUAL EMAILJS CREDENTIALS
    const SERVICE_ID = 'YOUR_SERVICE_ID' 
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log(result.text)
          setSubmitStatus('success')
          setFormData({ name: '', email: '', subject: '', message: '' })
          
          // Auto-hide success message after 5 seconds
          setTimeout(() => setSubmitStatus(null), 5000)
      }, (error) => {
          console.log(error.text)
          setSubmitStatus('error')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  // Social Media Data (Matching Footer)
  const socialLinks = [
    { 
      name: 'facebook', 
      icon: 'fa-facebook-square', 
      url: 'https://www.facebook.com/people/Sharavista-Tours/61582686912041/', 
      color: '#1877F2' 
    },
    { 
      name: 'instagram', 
      icon: 'fa-instagram', 
      url: 'https://www.instagram.com/sharavistatours/', 
      color: '#E4405F' 
    },
    { 
      name: 'youtube', 
      icon: 'fa-youtube-play', 
      url: '#', 
      color: '#FF0000' 
    },
    { 
      name: 'tiktok', 
      icon: 'fa-tiktok', 
      url: '#', 
      color: '#00f2ea' 
    },
    { 
      name: 'whatsapp', 
      icon: 'fa-whatsapp', 
      url: `https://wa.me/254769859091?text=Hello%20Sharavista%20Tours,%20I%20have%20an%20inquiry%20from%20the%20contact%20page.`, 
      color: '#25D366' 
    }
  ]

  return (
    <div className="archive" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* 1. Modern Hero Header */}
      <div style={{ 
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(/assets/img/banner/top-heading.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 0',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '10px' }}>Get in Touch</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Have questions about our tours? We're here to help you plan your perfect adventure.
          </p>
          <div style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
            <Link to="/" style={{ color: '#ffb300', textDecoration: 'none' }}>Home</Link> / Contact
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <section className="content-area" style={{ padding: '60px 0' }}>
        <div className="container">
          
          {/* Top Info Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '30px', 
            marginBottom: '60px',
            marginTop: '-80px',
            position: 'relative',
            zIndex: 10
          }}>
            {[
              { icon: 'fa-map-marker', title: 'Visit Us', info: 'Nairobi, Kenya', sub: 'Westlands Area' },
              { icon: 'fa-phone', title: 'Call Us', info: '+254 769 859 091', sub: 'Mon-Fri, 9am-5pm' },
              { icon: 'fa-envelope', title: 'Email Us', info: 'info@sharavistatours.com', sub: '24/7 Support' }
            ].map((item, i) => (
              <div key={i} style={{ 
                background: '#fff', 
                padding: '30px', 
                borderRadius: '12px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                textAlign: 'center',
                borderTop: '4px solid #ffb300'
              }}>
                <div style={{ fontSize: '2.5rem', color: '#ffb300', marginBottom: '15px' }}>
                  <i className={`fa ${item.icon}`}></i>
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', color: '#333' }}>{item.title}</h3>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#555' }}>{item.info}</p>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#888' }}>{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
            
            {/* Left Column: Form */}
            <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
              <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#333' }}>Send us a Message</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Fill out the form below and we will get back to you within 24 hours.</p>

                {submitStatus === 'success' && (
                  <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c3e6cb' }}>
                    <i className="fa fa-check-circle"></i> Thank you! Your message has been sent successfully.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
                    <i className="fa fa-exclamation-circle"></i> Failed to send message. Please try again.
                  </div>
                )}

                {/* ✅ ADDED ref={form} TO CONNECT WITH EMAILJS */}
                <form ref={form} onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Your Name *</label>
                      <input
                        type="text"
                        name="user_name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Email Address *</label>
                      <input
                        type="email"
                        name="user_email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                      placeholder="Inquiry about Safari Tour"
                    />
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      required
                      style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', resize: 'vertical' }}
                      placeholder="Tell us about your travel plans..."
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        flex: '1',
                        minWidth: '200px',
                        background: '#ffb300',
                        color: '#fff',
                        border: 'none',
                        padding: '14px 30px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: '6px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: 'background 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                      onMouseOver={(e) => !isSubmitting && (e.target.style.background = '#e6a100')}
                      onMouseOut={(e) => !isSubmitting && (e.target.style.background = '#ffb300')}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'} <i className="fa fa-paper-plane"></i>
                    </button>

                    {/* Quick Email Button */}
                    <a
                      href="mailto:info@sharavistatours.com?subject=Inquiry from Website&body=Hello Sharavista Tours,"
                      style={{
                        flex: '1',
                        minWidth: '200px',
                        background: '#fff',
                        color: '#333',
                        border: '2px solid #ddd',
                        padding: '14px 30px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.borderColor = '#ffb300';
                        e.target.style.color = '#ffb300';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.borderColor = '#ddd';
                        e.target.style.color = '#333';
                      }}
                    >
                      <i className="fa fa-envelope"></i> Open Email App
                    </a>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Map & Details */}
            <div style={{ flex: '1 1 400px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Interactive Map */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', height: '350px' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255278.6983466826!2d36.70730844250488!3d-1.3032090999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1771147070894!5m2!1sen!2ske" 
                  width="100%" 
                  height="100%" 
                  style={{ border: '0' }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Sharavista Tours Location"
                ></iframe>
              </div>

              {/* Detailed Info Card */}
              <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Contact Details</h3>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb300', flexShrink: 0 }}>
                      <i className="fa fa-map-marker"></i>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#333', marginBottom: '4px' }}>Head Office</strong>
                      <span style={{ color: '#666' }}>Westlands, Nairobi, Kenya</span>
                    </div>
                  </li>

                  <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb300', flexShrink: 0 }}>
                      <i className="fa fa-phone"></i>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#333', marginBottom: '4px' }}>Phone</strong>
                      <span style={{ color: '#666' }}>+254 769 859 091</span>
                    </div>
                  </li>

                  <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb300', flexShrink: 0 }}>
                      <i className="fa fa-envelope"></i>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#333', marginBottom: '4px' }}>Email</strong>
                      <a href="mailto:info@sharavistatours.com" style={{ color: '#26bdf7', textDecoration: 'none' }}>info@sharavistatours.com</a>
                    </div>
                  </li>

                  <li style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#fff4e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffb300', flexShrink: 0 }}>
                      <i className="fa fa-clock-o"></i>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#333', marginBottom: '4px' }}>Working Hours</strong>
                      <span style={{ color: '#666' }}>Mon – Fri: 9:00 am – 5:30 pm<br/>Sat: 9:00 am – 1:00 pm</span>
                    </div>
                  </li>
                </ul>

                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                  <h4 style={{ margin: '0 0 15px', fontSize: '1.1rem', color: '#333' }}>Follow Us</h4>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {socialLinks.map((social) => (
                      <a 
                        key={social.name} 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          width: '36px', height: '36px', 
                          background: '#f0f0f0', 
                          borderRadius: '50%', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#555',
                          transition: 'all 0.3s',
                          textDecoration: 'none'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = social.color;
                          e.currentTarget.style.color = '#fff';
                          if(social.name === 'tiktok') e.currentTarget.style.color = '#fff'; 
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#f0f0f0';
                          e.currentTarget.style.color = '#555';
                        }}
                        title={social.name}
                      >
                        <i className={`fa ${social.icon}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
