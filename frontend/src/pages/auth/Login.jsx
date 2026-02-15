// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { Formik, Form, Field, ErrorMessage } from 'formik'
// import * as Yup from 'yup'
// import { login, clearError } from '../../features/auth/authSlice'

// export default function Login() {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { loading, error } = useSelector((state) => state.auth)

//   const validationSchema = Yup.object({
//     email: Yup.string().email('Invalid email address').required('Email is required'),
//     password: Yup.string().required('Password is required')
//   })

//   const handleSubmit = async (values, { setSubmitting }) => {
//     dispatch(clearError())
//     try {
//       await dispatch(login(values))
//       const from = location.state?.from?.pathname || '/dashboard'
//       navigate(from, { replace: true })
//     } catch (err) {
//       console.error('Login error:', err)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="login-form-container">
//       <h3>Login</h3>
      
//       {error && (
//         <div className="alert alert-danger">
//           {error}
//         </div>
//       )}

//       <Formik
//         initialValues={{ email: '', password: '' }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting }) => (
//           <Form className="login-form">
//             <p className="login-username">
//               <label htmlFor="email">Username or Email Address</label>
//               <Field 
//                 type="text" 
//                 name="email" 
//                 id="email" 
//                 className="input" 
//                 placeholder="Enter your email"
//               />
//               <ErrorMessage name="email" component="div" className="error-message" />
//             </p>
            
//             <p className="login-password">
//               <label htmlFor="password">Password</label>
//               <Field 
//                 type="password" 
//                 name="password" 
//                 id="password" 
//                 className="input" 
//                 placeholder="Enter your password"
//               />
//               <ErrorMessage name="password" component="div" className="error-message" />
//             </p>
            
//             <p className="login-remember">
//               <label>
//                 <Field type="checkbox" name="remember" /> 
//                 Remember Me
//               </label>
//             </p>
            
//             <p className="login-submit">
//               <button 
//                 type="submit" 
//                 className="button button-primary" 
//                 disabled={isSubmitting || loading}
//               >
//                 {loading ? 'Signing in...' : 'Log In'}
//               </button>
//             </p>
//           </Form>
//         )}
//       </Formik>
      
//       <a href="#" title="Lost your password?" className="lost-pass">Lost your password?</a>
      
//       <p className="register-link">
//         Don't have an account? <Link to="/auth/register">Register</Link>
//       </p>
//     </div>
//   )
// }


import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { login, clearError } from '../../features/auth/authSlice'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error } = useSelector((state) => state.auth)

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError())
    try {
      await dispatch(login(values))
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Login error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-form-container">
      <h3>Login</h3>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <p className="login-username">
              <label htmlFor="email">Username or Email Address</label>
              <Field 
                type="text" 
                name="email" 
                id="email" 
                className="input" 
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </p>
            
            <p className="login-password">
              <label htmlFor="password">Password</label>
              <Field 
                type="password" 
                name="password" 
                id="password" 
                className="input" 
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" className="error-message" />
            </p>
            
            <p className="login-remember">
              <label>
                <Field type="checkbox" name="remember" /> 
                Remember Me
              </label>
            </p>
            
            <p className="login-submit">
              <button 
                type="submit" 
                className="button button-primary" 
                disabled={isSubmitting || loading}
              >
                {loading ? 'Signing in...' : 'Log In'}
              </button>
            </p>
          </Form>
        )}
      </Formik>
      
      <a href="#" title="Lost your password?" className="lost-pass">Lost your password?</a>
      
      <p className="register-link">
        Don't have an account? <Link to="/auth/register">Register</Link>
      </p>
    </div>
  )
}