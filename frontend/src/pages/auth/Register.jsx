// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { Formik, Form, Field, ErrorMessage } from 'formik'
// import * as Yup from 'yup'
// import { register, clearError } from '../../features/auth/authSlice'

// export default function Register() {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { loading, error } = useSelector((state) => state.auth)

//   const validationSchema = Yup.object({
//     name: Yup.string().required('Full name is required'),
//     email: Yup.string().email('Invalid email address').required('Email is required'),
//     phone: Yup.string()
//       .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
//       .required('Phone number is required'),
//     password: Yup.string()
//       .min(6, 'Password must be at least 6 characters')
//       .required('Password is required'),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('password')], 'Passwords must match')
//       .required('Please confirm your password')
//   })

//   const handleSubmit = async (values, { setSubmitting }) => {
//     dispatch(clearError())
//     try {
//       const userData = {
//         name: values.name,
//         email: values.email,
//         phone: values.phone,
//         password: values.password
//       }
//       await dispatch(register(userData))
//       navigate('/dashboard', { replace: true })
//     } catch (err) {
//       console.error('Registration error:', err)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="register-form-container">
//       <h3>Register</h3>
      
//       {error && (
//         <div className="alert alert-danger">
//           {error}
//         </div>
//       )}

//       <Formik
//         initialValues={{ 
//           name: '', 
//           email: '', 
//           phone: '', 
//           password: '', 
//           confirmPassword: '' 
//         }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting }) => (
//           <Form className="register-form">
//             <p className="form-row">
//               <label htmlFor="name">Username <span className="required">*</span></label>
//               <Field 
//                 type="text" 
//                 name="name" 
//                 id="name" 
//                 className="input" 
//                 placeholder="Enter your full name"
//               />
//               <ErrorMessage name="name" component="div" className="error-message" />
//             </p>
            
//             <p className="form-row">
//               <label htmlFor="email">Email address <span className="required">*</span></label>
//               <Field 
//                 type="email" 
//                 name="email" 
//                 id="email" 
//                 className="input" 
//                 placeholder="Enter your email"
//               />
//               <ErrorMessage name="email" component="div" className="error-message" />
//             </p>
            
//             <p className="form-row">
//               <label htmlFor="phone">Phone Number <span className="required">*</span></label>
//               <Field 
//                 type="tel" 
//                 name="phone" 
//                 id="phone" 
//                 className="input" 
//                 placeholder="+254 712 345 678"
//               />
//               <ErrorMessage name="phone" component="div" className="error-message" />
//             </p>
            
//             <p className="form-row">
//               <label htmlFor="password">Password <span className="required">*</span></label>
//               <Field 
//                 type="password" 
//                 name="password" 
//                 id="password" 
//                 className="input" 
//                 placeholder="Create a password"
//               />
//               <ErrorMessage name="password" component="div" className="error-message" />
//             </p>
            
//             <p className="form-row">
//               <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
//               <Field 
//                 type="password" 
//                 name="confirmPassword" 
//                 id="confirmPassword" 
//                 className="input" 
//                 placeholder="Confirm your password"
//               />
//               <ErrorMessage name="confirmPassword" component="div" className="error-message" />
//             </p>
            
//             {/* Anti-spam field */}
//             <div style={{left: '-999em', position: 'absolute'}}>
//               <label htmlFor="trap">Anti-spam</label>
//               <Field type="text" name="email_2" id="trap" tabIndex="-1" autoComplete="off" />
//             </div>
            
//             <p className="form-row">
//               <button 
//                 type="submit" 
//                 className="button" 
//                 disabled={isSubmitting || loading}
//               >
//                 {loading ? 'Creating account...' : 'Register'}
//               </button>
//             </p>
//           </Form>
//         )}
//       </Formik>
      
//       <p className="login-link">
//         Already have an account? <Link to="/auth/login">Login</Link>
//       </p>
//     </div>
//   )
// }


import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { register, clearError } from '../../features/auth/authSlice'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
      .required('Phone number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password')
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError())
    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword
      }
      await dispatch(register(userData))
     
      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error('Registration error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="register-form-container">
      <h3>Register</h3>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <Formik
        initialValues={{ 
          name: '', 
          email: '', 
          phone: '', 
          password: '', 
          confirmPassword: '' 
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            <p className="form-row">
              <label htmlFor="name">Username <span className="required">*</span></label>
              <Field 
                type="text" 
                name="name" 
                id="name" 
                className="input" 
                placeholder="Enter your full name"
              />
              <ErrorMessage name="name" component="div" className="error-message" />
            </p>
            
            <p className="form-row">
              <label htmlFor="email">Email address <span className="required">*</span></label>
              <Field 
                type="email" 
                name="email" 
                id="email" 
                className="input" 
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </p>
            
            <p className="form-row">
              <label htmlFor="phone">Phone Number <span className="required">*</span></label>
              <Field 
                type="tel" 
                name="phone" 
                id="phone" 
                className="input" 
                placeholder="+254 712 345 678"
              />
              <ErrorMessage name="phone" component="div" className="error-message" />
            </p>
            
            <p className="form-row">
              <label htmlFor="password">Password <span className="required">*</span></label>
              <Field 
                type="password" 
                name="password" 
                id="password" 
                className="input" 
                placeholder="Create a password"
              />
              <ErrorMessage name="password" component="div" className="error-message" />
            </p>
            
            <p className="form-row">
              <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
              <Field 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword" 
                className="input" 
                placeholder="Confirm your password"
              />
              <ErrorMessage name="confirmPassword" component="div" className="error-message" />
            </p>
            
            {/* Anti-spam field */}
            <div style={{left: '-999em', position: 'absolute'}}>
              <label htmlFor="trap">Anti-spam</label>
              <Field type="text" name="email_2" id="trap" tabIndex="-1" autoComplete="off" />
            </div>
            
            <p className="form-row">
              <button 
                type="submit" 
                className="button" 
                disabled={isSubmitting || loading}
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </p>
          </Form>
        )}
      </Formik>
      
      <p className="login-link">
        Already have an account? <Link to="/auth/login">Login</Link>
      </p>
    </div>
  )
}