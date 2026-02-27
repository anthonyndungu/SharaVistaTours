// // import React, { useState, useEffect, useRef } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { Formik, Form, Field, ErrorMessage } from 'formik';
// // import * as Yup from 'yup';
// // import {
// //   login,
// //   clearError,
// //   resendVerificationOTP,
// //   verifyOTP,
// //   fetchUserProfile
// // } from '../../features/auth/authSlice';

// // import {
// //   Button,
// //   TextField,
// //   Typography,
// //   Alert,
// //   Box,
// //   Paper,
// //   CircularProgress,
// //   Container
// // } from '@mui/material';

// // export default function Login() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   // Select auth state
// //   const { loading, error, isAuthenticated, user, token } = useSelector((state) => state.auth);

// //   const [unverifiedEmail, setUnverifiedEmail] = useState(null);
// //   const [showOTPOverlay, setShowOTPOverlay] = useState(false);
// //   const [otpValue, setOtpValue] = useState('');
// //   const [otpLoading, setOtpLoading] = useState(false);
// //   const [resendLoading, setResendLoading] = useState(false);
// //   const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });

// //   const [checkingSession, setCheckingSession] = useState(true);
// //   const otpInputRef = useRef(null);

// //   const validationSchema = Yup.object({
// //     email: Yup.string().email('Invalid email address').required('Email is required'),
// //     password: Yup.string().required('Password is required')
// //   });
  
// //   const handleSubmit = async (values, { setSubmitting }) => {
// //     const isErrorObject = error && typeof error === 'object';
// //     const currentCode = isErrorObject ? error.code : null;

// //     if (currentCode !== 'ACCOUNT_NOT_VERIFIED') {
// //       dispatch(clearError());
// //     }
// //     setOtpMessage({ type: '', text: '' });

// //     try {
// //       // 1. Dispatch Login
// //       const result = await dispatch(login(values)).unwrap();

// //       // 2. Extract User Directly from Result
// //       // Based on your log: result.data.user exists
// //       const user = result.data?.user;

// //       if (!user) {
// //         const userData = await dispatch(fetchUserProfile()).unwrap();
// //         if (userData.role === 'admin' || userData.role === 'super_admin') {
// //           navigate('/admin', { replace: true });
// //         } else {
// //           navigate('/dashboard', { replace: true });
// //         }
// //         return;
// //       }

// //       console.log('👤 User Role Detected:', user.role);

// //       // 3. FORCE REDIRECT IMMEDIATELY
// //       if (user.role === 'admin' || user.role === 'super_admin') {
// //         console.log('🚀 Redirecting to Admin Dashboard...');
// //         navigate('/admin', { replace: true });
// //       } else {
// //         console.log('🚀 Redirecting to Client Dashboard...');
// //         navigate('/dashboard', { replace: true });
// //       }

// //     } catch (err) {
// //       console.error('❌ Login FAILED:', err);

// //       if (err && err.code === 'ACCOUNT_NOT_VERIFIED') {
// //         setUnverifiedEmail(values.email);
// //         handleRequestOTP(values.email);
// //       }
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // const handleSubmit = async (values, { setSubmitting }) => {
// //   //   const isErrorObject = error && typeof error === 'object';
// //   //   const currentCode = isErrorObject ? error.code : null;

// //   //   if (currentCode !== 'ACCOUNT_NOT_VERIFIED') {
// //   //     dispatch(clearError());
// //   //   }
// //   //   setOtpMessage({ type: '', text: '' });

// //   //   try {
// //   //     // ✅ Dispatch login. Do NOT navigate here.
// //   //     const result = await dispatch(login(values)).unwrap();
// //   //     console.log('**********************************8✅ Login Success! Result:', result);
// //   //     // The useEffect above will catch the state change and redirect automatically.

// //   //   } catch (err) {
// //   //     console.error('Login error:', err);

// //   //     // Handle Unverified Account
// //   //     if (err && err.code === 'ACCOUNT_NOT_VERIFIED') {
// //   //       setUnverifiedEmail(values.email);
// //   //       handleRequestOTP(values.email);
// //   //     }
// //   //   } finally {
// //   //     setSubmitting(false);
// //   //   }
// //   // };

// //   // ✅ DEBUG VERSION OF REDIRECT LOGIC
// //   useEffect(() => {
// //     console.log('--- Redirect Check ---');
// //     console.log('checkingSession:', checkingSession);
// //     console.log('isAuthenticated:', isAuthenticated);
// //     console.log('user:', user);

// //     if (checkingSession) {
// //       console.log('⏳ Still checking session...');
// //       return;
// //     }

// //     if (!isAuthenticated) {
// //       console.log('❌ Not authenticated');
// //       return;
// //     }

// //     if (!user) {
// //       console.log('❌ Authenticated but NO user object found!');
// //       // FIX: If authenticated but no user, try fetching profile manually
// //       console.log('🔄 Attempting to fetch user profile manually...');
// //       dispatch(fetchUserProfile());
// //       return;
// //     }

// //     console.log('✅ All checks passed! Redirecting...');
// //     console.log('Role detected:', user.role);

// //     if (user.role === 'admin' || user.role === 'super_admin') {
// //       console.log('🚀 Navigating to /admin');
// //       navigate('/admin', { replace: true });
// //     } else {
// //       console.log('🚀 Navigating to /dashboard');
// //       navigate('/dashboard', { replace: true });
// //     }
// //   }, [isAuthenticated, user, checkingSession, navigate, dispatch]);

// //   // ✅ 1. SESSION CHECK (On Mount)
// //   useEffect(() => {
// //     const storedToken = localStorage.getItem('token');

// //     if (storedToken && !user) {
// //       // Only fetch if we don't have user data yet
// //       dispatch(fetchUserProfile())
// //         .unwrap()
// //         .then((userData) => {
// //           console.log('Session valid, user data loaded', userData);
// //           if (userData.role === 'admin' || userData.role === 'super_admin') {
// //             navigate('/admin', { replace: true });
// //           } else {
// //             navigate('/dashboard', { replace: true });
// //           }
// //         })
// //         .catch(() => {
// //           localStorage.removeItem('token');
// //           dispatch(clearError());
// //         })
// //         .finally(() => {
// //           setCheckingSession(false);
// //         });
// //     } else {
// //       setCheckingSession(false);
// //     }
// //   }, [dispatch, navigate, user]);

// //   // ✅ 2. REDIRECT LOGIC (The ONLY place we redirect after login)
// //   useEffect(() => {
// //     // Only redirect if:
// //     // 1. We are done checking initial session
// //     // 2. User is authenticated
// //     // 3. We have user data
// //     // 4. We are not already on the correct page (optional safety)
// //     if (!checkingSession && isAuthenticated && user) {
// //       if (user.role === 'admin' || user.role === 'super_admin') {
// //         navigate('/admin', { replace: true });
// //       } else {
// //         navigate('/dashboard', { replace: true });
// //       }
// //     }
// //   }, [isAuthenticated, user, checkingSession, navigate]);

// //   const handleRequestOTP = async (email) => {
// //     if (!email) return;
// //     setResendLoading(true);
// //     setOtpMessage({ type: '', text: '' });

// //     try {
// //       await dispatch(resendVerificationOTP(email)).unwrap();
// //       setOtpMessage({ type: 'success', text: 'New OTP sent! Please check your email.' });
// //       setShowOTPOverlay(true);
// //       setTimeout(() => {
// //         if (otpInputRef.current) {
// //           otpInputRef.current.focus();
// //           otpInputRef.current.select();
// //         }
// //       }, 100);
// //     } catch (err) {
// //       setOtpMessage({ type: 'error', text: err || 'Failed to send. Try again.' });
// //       setShowOTPOverlay(true);
// //     } finally {
// //       setResendLoading(false);
// //     }
// //   };

// //   const handleVerifyOTP = async () => {
// //     if (!otpValue || otpValue.length !== 6) {
// //       setOtpMessage({ type: 'error', text: 'Enter valid 6-digit OTP.' });
// //       return;
// //     }

// //     setOtpLoading(true);
// //     try {
// //       await dispatch(verifyOTP({ email: unverifiedEmail, otp: otpValue })).unwrap();
// //       setOtpMessage({ type: 'success', text: 'Verified! Logging in...' });

// //       // ✅ CRITICAL FIX FOR OTP:
// //       // After verifying, we must log in automatically OR fetch profile to trigger the redirect effect.
// //       // Since verifyOTP usually doesn't return a token, we assume the user must now login manually,
// //       // OR if your backend returns a token on verify, we dispatch login here.

// //       // OPTION A: If backend returns token on verify (Uncomment if applicable)
// //       // const result = await dispatch(login({ email: unverifiedEmail, password: ... })).unwrap(); 

// //       // OPTION B: Close overlay and let user login (Current behavior)
// //       setTimeout(() => {
// //         setShowOTPOverlay(false);
// //         setOtpValue('');
// //         setUnverifiedEmail(null);
// //         setOtpMessage({ type: '', text: '' });
// //         dispatch(clearError());
// //         // User will now type password and login normally
// //       }, 1500);

// //     } catch (err) {
// //       setOtpMessage({ type: 'error', text: err || 'Invalid or expired OTP.' });
// //     } finally {
// //       setOtpLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (showOTPOverlay && otpInputRef.current) {
// //       const timer = setTimeout(() => {
// //         otpInputRef.current.focus();
// //         otpInputRef.current.select();
// //       }, 50);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [showOTPOverlay, otpMessage]);

// //   if (checkingSession) {
// //     return (
// //       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
// //         <CircularProgress size={60} />
// //         <Typography sx={{ ml: 2 }}>Checking session...</Typography>
// //       </Box>
// //     );
// //   }

// //   const isErrorObject = error && typeof error === 'object';
// //   const errorMessage = isErrorObject ? (error.message || 'Login failed') : (error || '');
// //   const errorCode = isErrorObject ? error.code : null;

// //   return (
// //     <Box sx={{ position: 'relative', width: '100%' }}>
// //       {/* Main Login Form */}
// //       <div className="login-form-container" style={{
// //         maxWidth: '400px',
// //         margin: '2rem auto',
// //         padding: '2rem',
// //         border: '1px solid #ddd',
// //         borderRadius: '8px',
// //         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
// //         opacity: showOTPOverlay ? 0.3 : 1,
// //         pointerEvents: showOTPOverlay ? 'none' : 'auto',
// //         transition: 'all 0.3s ease'
// //       }}>
// //         <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Login</h3>

// //         {error && errorCode !== 'ACCOUNT_NOT_VERIFIED' && (
// //           <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
// //             {errorMessage}
// //           </Alert>
// //         )}

// //         {errorCode === 'ACCOUNT_NOT_VERIFIED' && (
// //           <Alert severity="warning" sx={{ mb: 2 }}>
// //             {errorMessage}
// //             <Button
// //               size="small"
// //               color="inherit"
// //               onClick={() => handleRequestOTP(unverifiedEmail)}
// //               disabled={resendLoading}
// //               sx={{ ml: 1, fontWeight: 'bold', minWidth: 'auto' }}
// //             >
// //               {resendLoading ? 'Sending...' : 'Resend OTP'}
// //             </Button>
// //           </Alert>
// //         )}

// //         <Formik
// //           initialValues={{ email: '', password: '', remember: false }}
// //           validationSchema={validationSchema}
// //           onSubmit={handleSubmit}
// //         >
// //           {({ isSubmitting }) => (
// //             <Form className="login-form">
// //               <p className="login-username" style={{ marginBottom: '1rem' }}>
// //                 <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' }}>Email Address</label>
// //                 <Field
// //                   type="text"
// //                   name="email"
// //                   id="email"
// //                   placeholder="Enter your email"
// //                   disabled={loading || otpLoading}
// //                   style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
// //                 />
// //                 <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }} />
// //               </p>

// //               <p className="login-password" style={{ marginBottom: '1rem' }}>
// //                 <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' }}>Password</label>
// //                 <Field
// //                   type="password"
// //                   name="password"
// //                   id="password"
// //                   placeholder="Enter your password"
// //                   disabled={loading || otpLoading}
// //                   style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
// //                 />
// //                 <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }} />
// //               </p>

// //               <p className="login-submit">
// //                 <button
// //                   type="submit"
// //                   disabled={isSubmitting || loading || otpLoading}
// //                   style={{
// //                     width: '100%',
// //                     padding: '0.75rem',
// //                     backgroundColor: (isSubmitting || loading || otpLoading) ? '#ccc' : '#1976d2',
// //                     color: 'white',
// //                     border: 'none',
// //                     borderRadius: '4px',
// //                     cursor: (isSubmitting || loading || otpLoading) ? 'not-allowed' : 'pointer',
// //                     fontWeight: '600'
// //                   }}
// //                 >
// //                   {loading ? 'Signing in...' : 'Log In'}
// //                 </button>
// //               </p>
// //             </Form>
// //           )}
// //         </Formik>

// //         <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
// //           Don't have an account? <Link to="/auth/register" style={{ color: '#1976d2' }}>Register</Link>
// //         </p>
// //       </div>

// //       {/* OTP OVERLAY */}
// //       {showOTPOverlay && (
// //         <Box
// //           sx={{
// //             position: 'absolute',
// //             top: 0,
// //             left: 0,
// //             right: 0,
// //             bottom: 0,
// //             backgroundColor: 'rgba(0, 0, 0, 0.6)',
// //             display: 'flex',
// //             alignItems: 'center',
// //             justifyContent: 'center',
// //             zIndex: 1300,
// //             borderRadius: '8px',
// //             backdropFilter: 'blur(2px)'
// //           }}
// //         >
// //           <Paper elevation={6} sx={{ p: 3, width: '90%', maxWidth: '350px', textAlign: 'center', position: 'relative' }}>
// //             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>Verify Email</Typography>
// //             <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
// //               Enter the 6-digit code sent to:<br /><strong>{unverifiedEmail}</strong>
// //             </Typography>

// //             {otpMessage.text && (
// //               <Alert severity={otpMessage.type} sx={{ mb: 2, fontSize: '0.8rem' }}>{otpMessage.text}</Alert>
// //             )}

// //             <TextField
// //               inputRef={otpInputRef}
// //               type="text"
// //               inputProps={{ maxLength: 6, style: { letterSpacing: '10px', fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold', padding: '10px' } }}
// //               fullWidth
// //               value={otpValue}
// //               onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
// //               disabled={otpLoading || resendLoading}
// //               variant="outlined"
// //               sx={{ mb: 2 }}
// //             />

// //             <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexDirection: 'column' }}>
// //               <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
// //                 <Button size="small" onClick={() => setShowOTPOverlay(false)} disabled={otpLoading || resendLoading} color="inherit">Cancel</Button>
// //                 <Button variant="contained" onClick={handleVerifyOTP} disabled={otpLoading || resendLoading || otpValue.length !== 6} size="large" sx={{ minWidth: '120px' }}>
// //                   {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
// //                 </Button>
// //               </Box>
// //               <Button size="small" onClick={() => handleRequestOTP(unverifiedEmail)} disabled={resendLoading || otpLoading} sx={{ mt: 1, textTransform: 'none', color: '#1976d2', fontWeight: 'bold' }}>
// //                 {resendLoading ? <><CircularProgress size={14} sx={{ mr: 1 }} /> Sending...</> : "Didn't receive code? Resend"}
// //               </Button>
// //             </Box>
// //           </Paper>
// //         </Box>
// //       )}
// //     </Box>
// //   );
// // }


// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import {
//   login,
//   clearError,
//   resendVerificationOTP,
//   verifyOTP,
//   fetchUserProfile
// } from '../../features/auth/authSlice';

// import {
//   Button,
//   TextField,
//   Typography,
//   Alert,
//   Box,
//   Paper,
//   CircularProgress,
//   Container
// } from '@mui/material';

// export default function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Select auth state
//   const { loading, error, isAuthenticated, user, token } = useSelector((state) => state.auth);

//   const [unverifiedEmail, setUnverifiedEmail] = useState(null);
//   const [showOTPOverlay, setShowOTPOverlay] = useState(false);
//   const [otpValue, setOtpValue] = useState('');
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });

//   const [checkingSession, setCheckingSession] = useState(true);
//   const otpInputRef = useRef(null);

//   const validationSchema = Yup.object({
//     email: Yup.string().email('Invalid email address').required('Email is required'),
//     password: Yup.string().required('Password is required')
//   });
  
//   const handleSubmit = async (values, { setSubmitting }) => {
//     const isErrorObject = error && typeof error === 'object';
//     const currentCode = isErrorObject ? error.code : null;

//     if (currentCode !== 'ACCOUNT_NOT_VERIFIED') {
//       dispatch(clearError());
//     }
//     setOtpMessage({ type: '', text: '' });

//     try {
//       // 1. Dispatch Login
//       const result = await dispatch(login(values)).unwrap();

//       // 2. Extract User Directly from Result
//       const user = result.data?.user;

//       if (!user) {
//         const userData = await dispatch(fetchUserProfile()).unwrap();
//         if (userData.role === 'admin' || userData.role === 'super_admin') {
//           navigate('/admin', { replace: true });
//         } else {
//           navigate('/dashboard', { replace: true });
//         }
//         return;
//       }

//       console.log('👤 User Role Detected:', user.role);

//       // 3. FORCE REDIRECT IMMEDIATELY
//       if (user.role === 'admin' || user.role === 'super_admin') {
//         console.log('🚀 Redirecting to Admin Dashboard...');
//         navigate('/admin', { replace: true });
//       } else {
//         console.log('🚀 Redirecting to Client Dashboard...');
//         navigate('/dashboard', { replace: true });
//       }

//     } catch (err) {
//       console.error('❌ Login FAILED:', err);

//       if (err && err.code === 'ACCOUNT_NOT_VERIFIED') {
//         setUnverifiedEmail(values.email);
//         handleRequestOTP(values.email);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ✅ DEBUG VERSION OF REDIRECT LOGIC
//   useEffect(() => {
//     console.log('--- Redirect Check ---');
//     console.log('checkingSession:', checkingSession);
//     console.log('isAuthenticated:', isAuthenticated);
//     console.log('user:', user);

//     if (checkingSession) {
//       console.log('⏳ Still checking session...');
//       return;
//     }

//     if (!isAuthenticated) {
//       console.log('❌ Not authenticated');
//       return;
//     }

//     if (!user) {
//       console.log('❌ Authenticated but NO user object found!');
//       dispatch(fetchUserProfile());
//       return;
//     }

//     console.log('✅ All checks passed! Redirecting...');
//     console.log('Role detected:', user.role);

//     if (user.role === 'admin' || user.role === 'super_admin') {
//       console.log('🚀 Navigating to /admin');
//       navigate('/admin', { replace: true });
//     } else {
//       console.log('🚀 Navigating to /dashboard');
//       navigate('/dashboard', { replace: true });
//     }
//   }, [isAuthenticated, user, checkingSession, navigate, dispatch]);

//   // ✅ 1. SESSION CHECK (On Mount)
//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');

//     if (storedToken && !user) {
//       dispatch(fetchUserProfile())
//         .unwrap()
//         .then((userData) => {
//           console.log('Session valid, user data loaded', userData);
//           if (userData.role === 'admin' || userData.role === 'super_admin') {
//             navigate('/admin', { replace: true });
//           } else {
//             navigate('/dashboard', { replace: true });
//           }
//         })
//         .catch(() => {
//           localStorage.removeItem('token');
//           dispatch(clearError());
//         })
//         .finally(() => {
//           setCheckingSession(false);
//         });
//     } else {
//       setCheckingSession(false);
//     }
//   }, [dispatch, navigate, user]);

//   // ✅ 2. REDIRECT LOGIC
//   useEffect(() => {
//     if (!checkingSession && isAuthenticated && user) {
//       if (user.role === 'admin' || user.role === 'super_admin') {
//         navigate('/admin', { replace: true });
//       } else {
//         navigate('/dashboard', { replace: true });
//       }
//     }
//   }, [isAuthenticated, user, checkingSession, navigate]);

//   const handleRequestOTP = async (email) => {
//     if (!email) return;
//     setResendLoading(true);
//     setOtpMessage({ type: '', text: '' });

//     try {
//       await dispatch(resendVerificationOTP(email)).unwrap();
//       setOtpMessage({ type: 'success', text: 'New OTP sent! Please check your email.' });
//       setShowOTPOverlay(true);
//       setTimeout(() => {
//         if (otpInputRef.current) {
//           otpInputRef.current.focus();
//           otpInputRef.current.select();
//         }
//       }, 100);
//     } catch (err) {
//       setOtpMessage({ type: 'error', text: err || 'Failed to send. Try again.' });
//       setShowOTPOverlay(true);
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (!otpValue || otpValue.length !== 6) {
//       setOtpMessage({ type: 'error', text: 'Enter valid 6-digit OTP.' });
//       return;
//     }

//     setOtpLoading(true);
//     try {
//       await dispatch(verifyOTP({ email: unverifiedEmail, otp: otpValue })).unwrap();
//       setOtpMessage({ type: 'success', text: 'Verified! Logging in...' });

//       setTimeout(() => {
//         setShowOTPOverlay(false);
//         setOtpValue('');
//         setUnverifiedEmail(null);
//         setOtpMessage({ type: '', text: '' });
//         dispatch(clearError());
//       }, 1500);

//     } catch (err) {
//       setOtpMessage({ type: 'error', text: err || 'Invalid or expired OTP.' });
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (showOTPOverlay && otpInputRef.current) {
//       const timer = setTimeout(() => {
//         otpInputRef.current.focus();
//         otpInputRef.current.select();
//       }, 50);
//       return () => clearTimeout(timer);
//     }
//   }, [showOTPOverlay, otpMessage]);

//   if (checkingSession) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress size={60} />
//         <Typography sx={{ ml: 2 }}>Checking session...</Typography>
//       </Box>
//     );
//   }

//   const isErrorObject = error && typeof error === 'object';
//   const errorMessage = isErrorObject ? (error.message || 'Login failed') : (error || '');
//   const errorCode = isErrorObject ? error.code : null;

//   return (
//     <Box sx={{ position: 'relative', width: '100%' }}>
//       {/* Main Login Form */}
//       <div className="login-form-container" style={{
//         maxWidth: '400px',
//         margin: '2rem auto',
//         padding: '2rem',
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//         opacity: showOTPOverlay ? 0.3 : 1,
//         pointerEvents: showOTPOverlay ? 'none' : 'auto',
//         transition: 'all 0.3s ease'
//       }}>
//         <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Login</h3>

//         {error && errorCode !== 'ACCOUNT_NOT_VERIFIED' && (
//           <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
//             {errorMessage}
//           </Alert>
//         )}

//         {errorCode === 'ACCOUNT_NOT_VERIFIED' && (
//           <Alert severity="warning" sx={{ mb: 2 }}>
//             {errorMessage}
//             <Button
//               size="small"
//               color="inherit"
//               onClick={() => handleRequestOTP(unverifiedEmail)}
//               disabled={resendLoading}
//               sx={{ ml: 1, fontWeight: 'bold', minWidth: 'auto' }}
//             >
//               {resendLoading ? 'Sending...' : 'Resend OTP'}
//             </Button>
//           </Alert>
//         )}

//         <Formik
//           initialValues={{ email: '', password: '', remember: false }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="login-form">
//               <p className="login-username" style={{ marginBottom: '1rem' }}>
//                 <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' }}>Email Address</label>
//                 <Field
//                   type="text"
//                   name="email"
//                   id="email"
//                   placeholder="Enter your email"
//                   disabled={loading || otpLoading}
//                   style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
//                 />
//                 <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }} />
//               </p>

//               <p className="login-password" style={{ marginBottom: '1rem' }}>
//                 <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' }}>Password</label>
//                 <Field
//                   type="password"
//                   name="password"
//                   id="password"
//                   placeholder="Enter your password"
//                   disabled={loading || otpLoading}
//                   style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
//                 />
//                 <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }} />
                
//                 {/* ✅ FORGOT PASSWORD LINK */}
//                 <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
//                   <Link 
//                     to="/forgot-password" 
//                     style={{ 
//                       color: '#1976d2', 
//                       fontSize: '0.85rem', 
//                       textDecoration: 'none', 
//                       fontWeight: '500' 
//                     }}
//                     onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
//                     onMouseOut={(e) => e.target.style.textDecoration = 'none'}
//                   >
//                     Forgot Password?
//                   </Link>
//                 </div>
//               </p>

//               <p className="login-submit">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || loading || otpLoading}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     backgroundColor: (isSubmitting || loading || otpLoading) ? '#ccc' : '#1976d2',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: (isSubmitting || loading || otpLoading) ? 'not-allowed' : 'pointer',
//                     fontWeight: '600'
//                   }}
//                 >
//                   {loading ? 'Signing in...' : 'Log In'}
//                 </button>
//               </p>
//             </Form>
//           )}
//         </Formik>

//         <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
//           Don't have an account? <Link to="/auth/register" style={{ color: '#1976d2' }}>Register</Link>
//         </p>
//       </div>

//       {/* OTP OVERLAY */}
//       {showOTPOverlay && (
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.6)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 1300,
//             borderRadius: '8px',
//             backdropFilter: 'blur(2px)'
//           }}
//         >
//           <Paper elevation={6} sx={{ p: 3, width: '90%', maxWidth: '350px', textAlign: 'center', position: 'relative' }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>Verify Email</Typography>
//             <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
//               Enter the 6-digit code sent to:<br /><strong>{unverifiedEmail}</strong>
//             </Typography>

//             {otpMessage.text && (
//               <Alert severity={otpMessage.type} sx={{ mb: 2, fontSize: '0.8rem' }}>{otpMessage.text}</Alert>
//             )}

//             <TextField
//               inputRef={otpInputRef}
//               type="text"
//               inputProps={{ maxLength: 6, style: { letterSpacing: '10px', fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold', padding: '10px' } }}
//               fullWidth
//               value={otpValue}
//               onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
//               disabled={otpLoading || resendLoading}
//               variant="outlined"
//               sx={{ mb: 2 }}
//             />

//             <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexDirection: 'column' }}>
//               <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
//                 <Button size="small" onClick={() => setShowOTPOverlay(false)} disabled={otpLoading || resendLoading} color="inherit">Cancel</Button>
//                 <Button variant="contained" onClick={handleVerifyOTP} disabled={otpLoading || resendLoading || otpValue.length !== 6} size="large" sx={{ minWidth: '120px' }}>
//                   {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
//                 </Button>
//               </Box>
//               <Button size="small" onClick={() => handleRequestOTP(unverifiedEmail)} disabled={resendLoading || otpLoading} sx={{ mt: 1, textTransform: 'none', color: '#1976d2', fontWeight: 'bold' }}>
//                 {resendLoading ? <><CircularProgress size={14} sx={{ mr: 1 }} /> Sending...</> : "Didn't receive code? Resend"}
//               </Button>
//             </Box>
//           </Paper>
//         </Box>
//       )}
//     </Box>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import {
//   login,
//   clearError,
//   resendVerificationOTP,
//   verifyOTP,
//   fetchUserProfile
// } from '../../features/auth/authSlice';

// import {
//   Button,
//   TextField,
//   Typography,
//   Alert,
//   Box,
//   Paper,
//   CircularProgress,
//   Container
// } from '@mui/material';

// export default function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Select auth state
//   const { loading, error, isAuthenticated, user, token } = useSelector((state) => state.auth);

//   const [unverifiedEmail, setUnverifiedEmail] = useState(null);
//   const [showOTPOverlay, setShowOTPOverlay] = useState(false);
//   const [otpValue, setOtpValue] = useState('');
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });

//   const [checkingSession, setCheckingSession] = useState(true);
//   const otpInputRef = useRef(null);

//   const validationSchema = Yup.object({
//     email: Yup.string().email('Invalid email address').required('Email is required'),
//     password: Yup.string().required('Password is required')
//   });
  
//   const handleSubmit = async (values, { setSubmitting }) => {
//     const isErrorObject = error && typeof error === 'object';
//     const currentCode = isErrorObject ? error.code : null;

//     if (currentCode !== 'ACCOUNT_NOT_VERIFIED') {
//       dispatch(clearError());
//     }
//     setOtpMessage({ type: '', text: '' });

//     try {
//       // 1. Dispatch Login
//       const result = await dispatch(login(values)).unwrap();

//       // 2. Extract User Directly from Result
//       // Based on your log: result.data.user exists
//       const user = result.data?.user;

//       if (!user) {
//         const userData = await dispatch(fetchUserProfile()).unwrap();
//         if (userData.role === 'admin' || userData.role === 'super_admin') {
//           navigate('/admin', { replace: true });
//         } else {
//           navigate('/dashboard', { replace: true });
//         }
//         return;
//       }

//       console.log('👤 User Role Detected:', user.role);

//       // 3. FORCE REDIRECT IMMEDIATELY
//       if (user.role === 'admin' || user.role === 'super_admin') {
//         console.log('🚀 Redirecting to Admin Dashboard...');
//         navigate('/admin', { replace: true });
//       } else {
//         console.log('🚀 Redirecting to Client Dashboard...');
//         navigate('/dashboard', { replace: true });
//       }

//     } catch (err) {
//       console.error('❌ Login FAILED:', err);

//       if (err && err.code === 'ACCOUNT_NOT_VERIFIED') {
//         setUnverifiedEmail(values.email);
//         handleRequestOTP(values.email);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // const handleSubmit = async (values, { setSubmitting }) => {
//   //   const isErrorObject = error && typeof error === 'object';
//   //   const currentCode = isErrorObject ? error.code : null;

//   //   if (currentCode !== 'ACCOUNT_NOT_VERIFIED') {
//   //     dispatch(clearError());
//   //   }
//   //   setOtpMessage({ type: '', text: '' });

//   //   try {
//   //     // ✅ Dispatch login. Do NOT navigate here.
//   //     const result = await dispatch(login(values)).unwrap();
//   //     console.log('**********************************8✅ Login Success! Result:', result);
//   //     // The useEffect above will catch the state change and redirect automatically.

//   //   } catch (err) {
//   //     console.error('Login error:', err);

//   //     // Handle Unverified Account
//   //     if (err && err.code === 'ACCOUNT_NOT_VERIFIED') {
//   //       setUnverifiedEmail(values.email);
//   //       handleRequestOTP(values.email);
//   //     }
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };

//   // ✅ DEBUG VERSION OF REDIRECT LOGIC
//   useEffect(() => {
//     console.log('--- Redirect Check ---');
//     console.log('checkingSession:', checkingSession);
//     console.log('isAuthenticated:', isAuthenticated);
//     console.log('user:', user);

//     if (checkingSession) {
//       console.log('⏳ Still checking session...');
//       return;
//     }

//     if (!isAuthenticated) {
//       console.log('❌ Not authenticated');
//       return;
//     }

//     if (!user) {
//       console.log('❌ Authenticated but NO user object found!');
//       // FIX: If authenticated but no user, try fetching profile manually
//       console.log('🔄 Attempting to fetch user profile manually...');
//       dispatch(fetchUserProfile());
//       return;
//     }

//     console.log('✅ All checks passed! Redirecting...');
//     console.log('Role detected:', user.role);

//     if (user.role === 'admin' || user.role === 'super_admin') {
//       console.log('🚀 Navigating to /admin');
//       navigate('/admin', { replace: true });
//     } else {
//       console.log('🚀 Navigating to /dashboard');
//       navigate('/dashboard', { replace: true });
//     }
//   }, [isAuthenticated, user, checkingSession, navigate, dispatch]);

//   // ✅ 1. SESSION CHECK (On Mount)
//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');

//     if (storedToken && !user) {
//       // Only fetch if we don't have user data yet
//       dispatch(fetchUserProfile())
//         .unwrap()
//         .then((userData) => {
//           console.log('Session valid, user data loaded', userData);
//           if (userData.role === 'admin' || userData.role === 'super_admin') {
//             navigate('/admin', { replace: true });
//           } else {
//             navigate('/dashboard', { replace: true });
//           }
//         })
//         .catch(() => {
//           localStorage.removeItem('token');
//           dispatch(clearError());
//         })
//         .finally(() => {
//           setCheckingSession(false);
//         });
//     } else {
//       setCheckingSession(false);
//     }
//   }, [dispatch, navigate, user]);

//   // ✅ 2. REDIRECT LOGIC (The ONLY place we redirect after login)
//   useEffect(() => {
//     // Only redirect if:
//     // 1. We are done checking initial session
//     // 2. User is authenticated
//     // 3. We have user data
//     // 4. We are not already on the correct page (optional safety)
//     if (!checkingSession && isAuthenticated && user) {
//       if (user.role === 'admin' || user.role === 'super_admin') {
//         navigate('/admin', { replace: true });
//       } else {
//         navigate('/dashboard', { replace: true });
//       }
//     }
//   }, [isAuthenticated, user, checkingSession, navigate]);

//   const handleRequestOTP = async (email) => {
//     if (!email) return;
//     setResendLoading(true);
//     setOtpMessage({ type: '', text: '' });

//     try {
//       await dispatch(resendVerificationOTP(email)).unwrap();
//       setOtpMessage({ type: 'success', text: 'New OTP sent! Please check your email.' });
//       setShowOTPOverlay(true);
//       setTimeout(() => {
//         if (otpInputRef.current) {
//           otpInputRef.current.focus();
//           otpInputRef.current.select();
//         }
//       }, 100);
//     } catch (err) {
//       setOtpMessage({ type: 'error', text: err || 'Failed to send. Try again.' });
//       setShowOTPOverlay(true);
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (!otpValue || otpValue.length !== 6) {
//       setOtpMessage({ type: 'error', text: 'Enter valid 6-digit OTP.' });
//       return;
//     }

//     setOtpLoading(true);
//     try {
//       await dispatch(verifyOTP({ email: unverifiedEmail, otp: otpValue })).unwrap();
//       setOtpMessage({ type: 'success', text: 'Verified! Logging in...' });

//       // ✅ CRITICAL FIX FOR OTP:
//       // After verifying, we must log in automatically OR fetch profile to trigger the redirect effect.
//       // Since verifyOTP usually doesn't return a token, we assume the user must now login manually,
//       // OR if your backend returns a token on verify, we dispatch login here.

//       // OPTION A: If backend returns token on verify (Uncomment if applicable)
//       // const result = await dispatch(login({ email: unverifiedEmail, password: ... })).unwrap(); 

//       // OPTION B: Close overlay and let user login (Current behavior)
//       setTimeout(() => {
//         setShowOTPOverlay(false);
//         setOtpValue('');
//         setUnverifiedEmail(null);
//         setOtpMessage({ type: '', text: '' });
//         dispatch(clearError());
//         // User will now type password and login normally
//       }, 1500);

//     } catch (err) {
//       setOtpMessage({ type: 'error', text: err || 'Invalid or expired OTP.' });
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (showOTPOverlay && otpInputRef.current) {
//       const timer = setTimeout(() => {
//         otpInputRef.current.focus();
//         otpInputRef.current.select();
//       }, 50);
//       return () => clearTimeout(timer);
//     }
//   }, [showOTPOverlay, otpMessage]);

//   if (checkingSession) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress size={60} />
//         <Typography sx={{ ml: 2 }}>Checking session...</Typography>
//       </Box>
//     );
//   }

//   const isErrorObject = error && typeof error === 'object';
//   const errorMessage = isErrorObject ? (error.message || 'Login failed') : (error || '');
//   const errorCode = isErrorObject ? error.code : null;

//   return (
//     <Box sx={{ position: 'relative', width: '100%' }}>
//       {/* Main Login Form */}
//       <div className="login-form-container" style={{
//         maxWidth: '400px',
//         margin: '2rem auto',
//         padding: '2rem',
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//         opacity: showOTPOverlay ? 0.3 : 1,
//         pointerEvents: showOTPOverlay ? 'none' : 'auto',
//         transition: 'all 0.3s ease'
//       }}>
//         <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Login</h3>

//         {error && errorCode !== 'ACCOUNT_NOT_VERIFIED' && (
//           <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
//             {errorMessage}
//           </Alert>
//         )}

//         {errorCode === 'ACCOUNT_NOT_VERIFIED' && (
//           <Alert severity="warning" sx={{ mb: 2 }}>
//             {errorMessage}
//             <Button
//               size="small"
//               color="inherit"
//               onClick={() => handleRequestOTP(unverifiedEmail)}
//               disabled={resendLoading}
//               sx={{ ml: 1, fontWeight: 'bold', minWidth: 'auto' }}
//             >
//               {resendLoading ? 'Sending...' : 'Resend OTP'}
//             </Button>
//           </Alert>
//         )}

//         <Formik
//           initialValues={{ email: '', password: '', remember: false }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="login-form">
//               <p className="login-username" style={{ marginBottom: '1rem' }}>
//                 <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' }}>Email Address</label>
//                 <Field
//                   type="text"
//                   name="email"
//                   id="email"
//                   placeholder="Enter your email"
//                   disabled={loading || otpLoading}
//                   style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
//                 />
//                 <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }} />
//               </p>

//               <p className="login-password" style={{ marginBottom: '1rem' }}>
//                 <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' }}>Password</label>
//                 <Field
//                   type="password"
//                   name="password"
//                   id="password"
//                   placeholder="Enter your password"
//                   disabled={loading || otpLoading}
//                   style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
//                 />
//                 <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }} />
//               </p>

//               <p className="login-submit">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || loading || otpLoading}
//                   style={{
//                     width: '100%',
//                     padding: '0.75rem',
//                     backgroundColor: (isSubmitting || loading || otpLoading) ? '#ccc' : '#1976d2',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: (isSubmitting || loading || otpLoading) ? 'not-allowed' : 'pointer',
//                     fontWeight: '600'
//                   }}
//                 >
//                   {loading ? 'Signing in...' : 'Log In'}
//                 </button>
//               </p>
//             </Form>
//           )}
//         </Formik>

//         <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
//           Don't have an account? <Link to="/auth/register" style={{ color: '#1976d2' }}>Register</Link>
//         </p>
//       </div>

//       {/* OTP OVERLAY */}
//       {showOTPOverlay && (
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.6)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 1300,
//             borderRadius: '8px',
//             backdropFilter: 'blur(2px)'
//           }}
//         >
//           <Paper elevation={6} sx={{ p: 3, width: '90%', maxWidth: '350px', textAlign: 'center', position: 'relative' }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>Verify Email</Typography>
//             <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
//               Enter the 6-digit code sent to:<br /><strong>{unverifiedEmail}</strong>
//             </Typography>

//             {otpMessage.text && (
//               <Alert severity={otpMessage.type} sx={{ mb: 2, fontSize: '0.8rem' }}>{otpMessage.text}</Alert>
//             )}

//             <TextField
//               inputRef={otpInputRef}
//               type="text"
//               inputProps={{ maxLength: 6, style: { letterSpacing: '10px', fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold', padding: '10px' } }}
//               fullWidth
//               value={otpValue}
//               onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
//               disabled={otpLoading || resendLoading}
//               variant="outlined"
//               sx={{ mb: 2 }}
//             />

//             <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexDirection: 'column' }}>
//               <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
//                 <Button size="small" onClick={() => setShowOTPOverlay(false)} disabled={otpLoading || resendLoading} color="inherit">Cancel</Button>
//                 <Button variant="contained" onClick={handleVerifyOTP} disabled={otpLoading || resendLoading || otpValue.length !== 6} size="large" sx={{ minWidth: '120px' }}>
//                   {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
//                 </Button>
//               </Box>
//               <Button size="small" onClick={() => handleRequestOTP(unverifiedEmail)} disabled={resendLoading || otpLoading} sx={{ mt: 1, textTransform: 'none', color: '#1976d2', fontWeight: 'bold' }}>
//                 {resendLoading ? <><CircularProgress size={14} sx={{ mr: 1 }} /> Sending...</> : "Didn't receive code? Resend"}
//               </Button>
//             </Box>
//           </Paper>
//         </Box>
//       )}
//     </Box>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  login,
  clearError,
  resendVerificationOTP,
  verifyOTP,
  fetchUserProfile
} from '../../features/auth/authSlice';

import {
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  Paper,
  CircularProgress,
  Container
} from '@mui/material';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select auth state
  const { loading, error, isAuthenticated, user, token } = useSelector((state) => state.auth);

  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [showOTPOverlay, setShowOTPOverlay] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });

  const [checkingSession, setCheckingSession] = useState(true);
  const otpInputRef = useRef(null);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });
  
  const handleSubmit = async (values, { setSubmitting }) => {
    const isErrorObject = error && typeof error === 'object';
    const currentCode = isErrorObject ? error.code : null;

    if (currentCode !== 'ACCOUNT_NOT_VERIFIED') {
      dispatch(clearError());
    }
    setOtpMessage({ type: '', text: '' });

    try {
      // 1. Dispatch Login
      const result = await dispatch(login(values)).unwrap();

      // 2. Extract User Directly from Result
      const user = result.data?.user;

      if (!user) {
        const userData = await dispatch(fetchUserProfile()).unwrap();
        if (userData.role === 'admin' || userData.role === 'super_admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        return;
      }

      console.log('👤 User Role Detected:', user.role);

      // 3. FORCE REDIRECT IMMEDIATELY
      if (user.role === 'admin' || user.role === 'super_admin') {
        console.log('🚀 Redirecting to Admin Dashboard...');
        navigate('/admin', { replace: true });
      } else {
        console.log('🚀 Redirecting to Client Dashboard...');
        navigate('/dashboard', { replace: true });
      }

    } catch (err) {
      console.error('❌ Login FAILED:', err);

      if (err && err.code === 'ACCOUNT_NOT_VERIFIED') {
        setUnverifiedEmail(values.email);
        handleRequestOTP(values.email);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ DEBUG VERSION OF REDIRECT LOGIC
  useEffect(() => {
    console.log('--- Redirect Check ---');
    console.log('checkingSession:', checkingSession);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);

    if (checkingSession) {
      console.log('⏳ Still checking session...');
      return;
    }

    if (!isAuthenticated) {
      console.log('❌ Not authenticated');
      return;
    }

    if (!user) {
      console.log('❌ Authenticated but NO user object found!');
      dispatch(fetchUserProfile());
      return;
    }

    console.log('✅ All checks passed! Redirecting...');
    console.log('Role detected:', user.role);

    if (user.role === 'admin' || user.role === 'super_admin') {
      console.log('🚀 Navigating to /admin');
      navigate('/admin', { replace: true });
    } else {
      console.log('🚀 Navigating to /dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, checkingSession, navigate, dispatch]);

  // ✅ 1. SESSION CHECK (On Mount)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken && !user) {
      dispatch(fetchUserProfile())
        .unwrap()
        .then((userData) => {
          console.log('Session valid, user data loaded', userData);
          if (userData.role === 'admin' || userData.role === 'super_admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          dispatch(clearError());
        })
        .finally(() => {
          setCheckingSession(false);
        });
    } else {
      setCheckingSession(false);
    }
  }, [dispatch, navigate, user]);

  // ✅ 2. REDIRECT LOGIC
  useEffect(() => {
    if (!checkingSession && isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, checkingSession, navigate]);

  const handleRequestOTP = async (email) => {
    if (!email) return;
    setResendLoading(true);
    setOtpMessage({ type: '', text: '' });

    try {
      await dispatch(resendVerificationOTP(email)).unwrap();
      setOtpMessage({ type: 'success', text: 'New OTP sent! Please check your email.' });
      setShowOTPOverlay(true);
      setTimeout(() => {
        if (otpInputRef.current) {
          otpInputRef.current.focus();
          otpInputRef.current.select();
        }
      }, 100);
    } catch (err) {
      setOtpMessage({ type: 'error', text: err || 'Failed to send. Try again.' });
      setShowOTPOverlay(true);
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpValue || otpValue.length !== 6) {
      setOtpMessage({ type: 'error', text: 'Enter valid 6-digit OTP.' });
      return;
    }

    setOtpLoading(true);
    try {
      await dispatch(verifyOTP({ email: unverifiedEmail, otp: otpValue })).unwrap();
      setOtpMessage({ type: 'success', text: 'Verified! Logging in...' });

      setTimeout(() => {
        setShowOTPOverlay(false);
        setOtpValue('');
        setUnverifiedEmail(null);
        setOtpMessage({ type: '', text: '' });
        dispatch(clearError());
      }, 1500);

    } catch (err) {
      setOtpMessage({ type: 'error', text: err || 'Invalid or expired OTP.' });
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    if (showOTPOverlay && otpInputRef.current) {
      const timer = setTimeout(() => {
        otpInputRef.current.focus();
        otpInputRef.current.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showOTPOverlay, otpMessage]);

  if (checkingSession) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Checking session...</Typography>
      </Box>
    );
  }

  const isErrorObject = error && typeof error === 'object';
  const errorMessage = isErrorObject ? (error.message || 'Login failed') : (error || '');
  const errorCode = isErrorObject ? error.code : null;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Main Login Form */}
      <div className="login-form-container" style={{
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        opacity: showOTPOverlay ? 0.3 : 1,
        pointerEvents: showOTPOverlay ? 'none' : 'auto',
        transition: 'all 0.3s ease'
      }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Login</h3>

        {error && errorCode !== 'ACCOUNT_NOT_VERIFIED' && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
            {errorMessage}
          </Alert>
        )}

        {errorCode === 'ACCOUNT_NOT_VERIFIED' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {errorMessage}
            <Button
              size="small"
              color="inherit"
              onClick={() => handleRequestOTP(unverifiedEmail)}
              disabled={resendLoading}
              sx={{ ml: 1, fontWeight: 'bold', minWidth: 'auto' }}
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </Button>
          </Alert>
        )}

        <Formik
          initialValues={{ email: '', password: '', remember: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <p className="login-username" style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' }}>Email Address</label>
                <Field
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  disabled={loading || otpLoading}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
                <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }} />
              </p>

              <p className="login-password" style={{ marginBottom: '1rem' }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#555' }}>Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  disabled={loading || otpLoading}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
                <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }} />
                
                {/* ✅ FORGOT PASSWORD LINK */}
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <Link 
                    to="/forgot-password" 
                    style={{ 
                      color: '#1976d2', 
                      fontSize: '0.85rem', 
                      textDecoration: 'none', 
                      fontWeight: '500' 
                    }}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </p>

              <p className="login-submit">
                <button
                  type="submit"
                  disabled={isSubmitting || loading || otpLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: (isSubmitting || loading || otpLoading) ? '#ccc' : '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: (isSubmitting || loading || otpLoading) ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {loading ? 'Signing in...' : 'Log In'}
                </button>
              </p>
            </Form>
          )}
        </Formik>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/auth/register" style={{ color: '#1976d2' }}>Register</Link>
        </p>
      </div>

      {/* OTP OVERLAY */}
      {showOTPOverlay && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            borderRadius: '8px',
            backdropFilter: 'blur(2px)'
          }}
        >
          <Paper elevation={6} sx={{ p: 3, width: '90%', maxWidth: '350px', textAlign: 'center', position: 'relative' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>Verify Email</Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
              Enter the 6-digit code sent to:<br /><strong>{unverifiedEmail}</strong>
            </Typography>

            {otpMessage.text && (
              <Alert severity={otpMessage.type} sx={{ mb: 2, fontSize: '0.8rem' }}>{otpMessage.text}</Alert>
            )}

            <TextField
              inputRef={otpInputRef}
              type="text"
              inputProps={{ maxLength: 6, style: { letterSpacing: '10px', fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold', padding: '10px' } }}
              fullWidth
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
              disabled={otpLoading || resendLoading}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button size="small" onClick={() => setShowOTPOverlay(false)} disabled={otpLoading || resendLoading} color="inherit">Cancel</Button>
                <Button variant="contained" onClick={handleVerifyOTP} disabled={otpLoading || resendLoading || otpValue.length !== 6} size="large" sx={{ minWidth: '120px' }}>
                  {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
                </Button>
              </Box>
              <Button size="small" onClick={() => handleRequestOTP(unverifiedEmail)} disabled={resendLoading || otpLoading} sx={{ mt: 1, textTransform: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                {resendLoading ? <><CircularProgress size={14} sx={{ mr: 1 }} /> Sending...</> : "Didn't receive code? Resend"}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}