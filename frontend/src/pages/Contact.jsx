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
//       // TODO: Implement actual form submission to backend
//       console.log('Form submitted:', formData)

//       // Simulate API call
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
//                   style={{border: '0', pointerEvents: 'none'}}
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

//               {/* Contact Form */}
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
//                         <input
//                           type="text"
//                           name="name"
//                           value={formData.name}
//                           onChange={handleChange}
//                           placeholder="Your name*"
//                           className="wpcf7-form-control w-full px-3 py-2 border border-gray-300 rounded"
//                           required
//                         />
//                       </div>
//                       <div className="col-sm-6">
//                         <input
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleChange}
//                           placeholder="Email*"
//                           className="wpcf7-form-control w-full px-3 py-2 border border-gray-300 rounded"
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div className="form-contact-fields mt-4">
//                       <input
//                         type="text"
//                         name="subject"
//                         value={formData.subject}
//                         onChange={handleChange}
//                         placeholder="Subject"
//                         className="wpcf7-form-control w-full px-3 py-2 border border-gray-300 rounded"
//                       />
//                     </div>
//                     <div className="form-contact-fields mt-4">
//                       <textarea
//                         name="message"
//                         value={formData.message}
//                         onChange={handleChange}
//                         rows="5"
//                         placeholder="Message"
//                         className="wpcf7-form-control wpcf7-textarea w-full px-3 py-2 border border-gray-300 rounded"
//                         required
//                       ></textarea>
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
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      console.log('Form submitted:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="archive">
      {/* Breadcrumb */}
      <div className="top_site_main" style={{ backgroundImage: 'url(/assets/img/banner/top-heading.jpg)' }}>
        <div className="banner-wrapper container article_heading">
          <div className="breadcrumbs-wrapper">
            <ul className="phys-breadcrumb">
              <li><Link to="/" className="home">Home</Link></li>
              <li>Contact</li>
            </ul>
          </div>
          <h1 className="heading_primary">Contact</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="content-area">
        <div className="container">
          <div className="row">
            {/* Left Column - Map & Form */}
            <div className="site-main col-sm-9 alignleft">
              {/* Google Maps Embed */}
              <div className="video-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d127641.1616745885!2d36.847397!3d-1.303209!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1771147070894!5m2!1sen!2ske" 
                  width="600" 
                  height="450" 
                  style={{ border: '0', pointerEvents: 'none' }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>

              {/* Contact Information */}
              <div className="pages_content padding-top-4x">
                <h4>CONTACT INFORMATION</h4>
                <div className="contact_infor">
                  <ul>
                    <li>
                      <label><i className="fa fa-map-marker"></i>ADDRESS</label>
                      <div className="des">Taman Pertama, Cheras, 56100 Kuala Lumpur, Malaysia</div>
                    </li>
                    <li>
                      <label><i className="fa fa-phone"></i>TEL NO</label>
                      <div className="des">+012345678 (tour) | +0123456789 (ticketing)</div>
                    </li>
                    <li>
                      <label><i className="fa fa-print"></i>FAX NO</label>
                      <div className="des">+012345678 (tour) | +123456789 (ticketing)</div>
                    </li>
                    <li>
                      <label><i className="fa fa-envelope"></i>EMAIL</label>
                      <div className="des">
                        <a href="mailto:info@sharavistatours.com">info@sharavistatours.com</a> (tour) |{' '}
                        <a href="mailto:ticketing@sharavistatours.com">ticketing@sharavistatours.com</a> (ticketing)
                      </div>
                    </li>
                    <li>
                      <label><i className="fa fa-clock-o"></i>WORKING HOURS</label>
                      <div className="des">
                        Mon – Fri 9:00 am – 5:30 pm, Sat 9:00 am – 1:00 pm<br />
                        We are closed on 1st &amp; 3rd Sat of every month, Sundays &amp; public holidays
                      </div>
                    </li>
                    <li>
                      <label><i className="fa fa-map-marker"></i>GPS COORDINATE</label>
                      <div className="des">Latitude : 3.1117181000, Longitude : 101.7301577000</div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Form - FIXED: Using template classes */}
              <div className="wpb_wrapper pages_content">
                <h4>Have a question?</h4>
                {submitSuccess && (
                  <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
                    Thank you! Your message has been sent successfully.
                  </div>
                )}
                {submitError && (
                  <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {submitError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="wpcf7-form" noValidate>
                  <div className="form-contact">
                    <div className="row-1x">
                      <div className="col-sm-6">
                        <span className="wpcf7-form-control-wrap your-name">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name*"
                            className="wpcf7-form-control"
                            required
                          />
                        </span>
                      </div>
                      <div className="col-sm-6">
                        <span className="wpcf7-form-control-wrap your-email">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email*"
                            className="wpcf7-form-control"
                            required
                          />
                        </span>
                      </div>
                    </div>
                    <div className="form-contact-fields mt-4">
                      <span className="wpcf7-form-control-wrap your-subject">
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Subject"
                          className="wpcf7-form-control"
                        />
                      </span>
                    </div>
                    <div className="form-contact-fields mt-4">
                      <span className="wpcf7-form-control-wrap your-message">
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="5"
                          placeholder="Message"
                          className="wpcf7-form-control wpcf7-textarea"
                          required
                        ></textarea>
                      </span><br />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="wpcf7-form-control wpcf7-submit bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded mt-4 transition-colors"
                      >
                        {isSubmitting ? 'Sending...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="widget-area col-sm-3 align-left">
              <aside className="widget widget_text">
                <img
                  src="/assets/img/images-sidebar/sidebanner-ticketing.jpg"
                  alt="Ticketing Banner"
                  onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                />
              </aside>
              <aside className="widget widget_text">
                <img
                  src="/assets/img/images-sidebar/sidebanner-tour.png"
                  alt="Tour Banner"
                  onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                />
              </aside>
              <aside className="widget widget_text">
                <img
                  src="/assets/img/images-sidebar/hertz-sidebanner.jpg"
                  alt="Hertz Banner"
                  onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
                />
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}