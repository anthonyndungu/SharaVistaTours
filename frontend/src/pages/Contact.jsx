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
//   const [submitSuccess, setSubmitSuccess] = useState(false)
//   const [submitError, setSubmitError] = useState('')

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setSubmitError('')

//     try {
//       console.log('Form submitted:', formData)
//       await new Promise(resolve => setTimeout(resolve, 1000))
//       setSubmitSuccess(true)
//       setFormData({ name: '', email: '', subject: '', message: '' })
//     } catch (error) {
//       setSubmitError('Failed to send message. Please try again.')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="archive">
//       {/* Breadcrumb */}
//       <div className="top_site_main" style={{ backgroundImage: 'url(/assets/img/banner/top-heading.jpg)' }}>
//         <div className="banner-wrapper container article_heading">
//           <div className="breadcrumbs-wrapper">
//             <ul className="phys-breadcrumb">
//               <li><Link to="/" className="home">Home</Link></li>
//               <li>Contact</li>
//             </ul>
//           </div>
//           <h1 className="heading_primary">Contact</h1>
//         </div>
//       </div>

//       {/* Main Content */}
//       <section className="content-area">
//         <div className="container">
//           <div className="row">
//             {/* Left Column - Map & Form */}
//             <div className="site-main col-sm-9 alignleft">
//               {/* Google Maps Embed */}
//               <div className="video-container">
//                 <iframe 
//                   src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d127641.1616745885!2d36.847397!3d-1.303209!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1771147070894!5m2!1sen!2ske" 
//                   width="600" 
//                   height="450" 
//                   style={{ border: '0', pointerEvents: 'none' }}
//                   allowFullScreen=""
//                   loading="lazy"
//                 ></iframe>
//               </div>

//               {/* Contact Information */}
//               <div className="pages_content padding-top-4x">
//                 <h4>CONTACT INFORMATION</h4>
//                 <div className="contact_infor">
//                   <ul>
//                     <li>
//                       <label><i className="fa fa-map-marker"></i>ADDRESS</label>
//                       <div className="des">Taman Pertama, Cheras, 56100 Kuala Lumpur, Malaysia</div>
//                     </li>
//                     <li>
//                       <label><i className="fa fa-phone"></i>TEL NO</label>
//                       <div className="des">+012345678 (tour) | +0123456789 (ticketing)</div>
//                     </li>
//                     <li>
//                       <label><i className="fa fa-print"></i>FAX NO</label>
//                       <div className="des">+012345678 (tour) | +123456789 (ticketing)</div>
//                     </li>
//                     <li>
//                       <label><i className="fa fa-envelope"></i>EMAIL</label>
//                       <div className="des">
//                         <a href="mailto:info@sharavistatours.com">info@sharavistatours.com</a> (tour) |{' '}
//                         <a href="mailto:ticketing@sharavistatours.com">ticketing@sharavistatours.com</a> (ticketing)
//                       </div>
//                     </li>
//                     <li>
//                       <label><i className="fa fa-clock-o"></i>WORKING HOURS</label>
//                       <div className="des">
//                         Mon – Fri 9:00 am – 5:30 pm, Sat 9:00 am – 1:00 pm<br />
//                         We are closed on 1st &amp; 3rd Sat of every month, Sundays &amp; public holidays
//                       </div>
//                     </li>
//                     <li>
//                       <label><i className="fa fa-map-marker"></i>GPS COORDINATE</label>
//                       <div className="des">Latitude : 3.1117181000, Longitude : 101.7301577000</div>
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//               {/* Contact Form - FIXED: Using template classes */}
//               <div className="wpb_wrapper pages_content">
//                 <h4>Have a question?</h4>
//                 {submitSuccess && (
//                   <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
//                     Thank you! Your message has been sent successfully.
//                   </div>
//                 )}
//                 {submitError && (
//                   <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
//                     {submitError}
//                   </div>
//                 )}
//                 <form onSubmit={handleSubmit} className="wpcf7-form" noValidate>
//                   <div className="form-contact">
//                     <div className="row-1x">
//                       <div className="col-sm-6">
//                         <span className="wpcf7-form-control-wrap your-name">
//                           <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             placeholder="Your name*"
//                             className="wpcf7-form-control"
//                             required
//                           />
//                         </span>
//                       </div>
//                       <div className="col-sm-6">
//                         <span className="wpcf7-form-control-wrap your-email">
//                           <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             placeholder="Email*"
//                             className="wpcf7-form-control"
//                             required
//                           />
//                         </span>
//                       </div>
//                     </div>
//                     <div className="form-contact-fields mt-4">
//                       <span className="wpcf7-form-control-wrap your-subject">
//                         <input
//                           type="text"
//                           name="subject"
//                           value={formData.subject}
//                           onChange={handleChange}
//                           placeholder="Subject"
//                           className="wpcf7-form-control"
//                         />
//                       </span>
//                     </div>
//                     <div className="form-contact-fields mt-4">
//                       <span className="wpcf7-form-control-wrap your-message">
//                         <textarea
//                           name="message"
//                           value={formData.message}
//                           onChange={handleChange}
//                           rows="5"
//                           placeholder="Message"
//                           className="wpcf7-form-control wpcf7-textarea"
//                           required
//                         ></textarea>
//                       </span><br />
//                       <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="wpcf7-form-control wpcf7-submit bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded mt-4 transition-colors"
//                       >
//                         {isSubmitting ? 'Sending...' : 'Submit'}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>

//             {/* Right Column - Sidebar */}
//             <div className="widget-area col-sm-3 align-left">
//               <aside className="widget widget_text">
//                 <img
//                   src="/assets/img/images-sidebar/sidebanner-ticketing.jpg"
//                   alt="Ticketing Banner"
//                   onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                 />
//               </aside>
//               <aside className="widget widget_text">
//                 <img
//                   src="/assets/img/images-sidebar/sidebanner-tour.png"
//                   alt="Tour Banner"
//                   onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                 />
//               </aside>
//               <aside className="widget widget_text">
//                 <img
//                   src="/assets/img/images-sidebar/hertz-sidebanner.jpg"
//                   alt="Hertz Banner"
//                   onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                 />
//               </aside>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }


import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact() {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real app: await api.post('/contact', formData)
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000)
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

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
            marginTop: '-80px', // Overlap effect
            position: 'relative',
            zIndex: 10
          }}>
            {[
              { icon: 'fa-map-marker', title: 'Visit Us', info: 'Nairobi, Kenya', sub: 'Westlands Area' },
              { icon: 'fa-phone', title: 'Call Us', info: '+254 704 026 942', sub: 'Mon-Fri, 9am-5pm' },
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

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Your Name *</label>
                      <input
                        type="text"
                        name="name"
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
                        name="email"
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
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
                      width: '100%'
                    }}
                    onMouseOver={(e) => !isSubmitting && (e.target.style.background = '#e6a100')}
                    onMouseOut={(e) => !isSubmitting && (e.target.style.background = '#ffb300')}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'} <i className="fa fa-paper-plane" style={{ marginLeft: '8px' }}></i>
                  </button>
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
                      <span style={{ color: '#666' }}>+254 704 026 942</span>
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
                  <div style={{ display: 'flex', gap: '15px' }}>
                    {['facebook', 'twitter', 'instagram', 'whatsapp'].map(social => (
                      <a key={social} href="#" style={{ 
                        width: '36px', height: '36px', 
                        background: '#f0f0f0', 
                        borderRadius: '50%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#555',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#ffb300';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f0f0f0';
                        e.currentTarget.style.color = '#555';
                      }}
                      >
                        <i className={`fa fa-${social}`}></i>
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