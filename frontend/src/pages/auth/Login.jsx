import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  login, 
  clearError, 
  resendVerificationOTP, 
  verifyOTP 
} from '../../features/auth/authSlice';

import { 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  Box, 
  Paper,
  CircularProgress,
  LinearProgress
} from '@mui/material';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  
  // State for OTP Overlay
  const [showOTPOverlay, setShowOTPOverlay] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false); // Separate loading for resend
  const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });

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
      const result = await dispatch(login(values)).unwrap();
      const { user } = result.data;
      
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      if (err && err.code === 'ACCOUNT_NOT_VERIFIED') {
        setUnverifiedEmail(values.email);
        handleRequestOTP(values.email);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Unified Handler for Initial Send & Resend
  const handleRequestOTP = async (email) => {
    if (!email) return;

    // Set specific loading state for resend action
    setResendLoading(true);
    setOtpMessage({ type: '', text: '' }); // Clear old messages
    
    try {
      await dispatch(resendVerificationOTP(email)).unwrap();
      
      setOtpMessage({ 
        type: 'success', 
        text: 'New OTP sent! Please check your email.' 
      });
      
      setShowOTPOverlay(true);
      
      // Force focus back to input after sending
      setTimeout(() => {
        if (otpInputRef.current) {
          otpInputRef.current.focus();
          otpInputRef.current.select();
        }
      }, 100);

    } catch (err) {
      setOtpMessage({ 
        type: 'error', 
        text: err || 'Failed to send. Try again.' 
      });
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
      
      setOtpMessage({ 
        type: 'success', 
        text: 'Verified! Logging in...' 
      });
      
      setTimeout(() => {
        setShowOTPOverlay(false);
        setOtpValue('');
        setUnverifiedEmail(null);
        setOtpMessage({ type: '', text: '' });
        dispatch(clearError()); 
      }, 1500);
      
    } catch (err) {
      setOtpMessage({ 
        type: 'error', 
        text: err || 'Invalid or expired OTP.' 
      });
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
  }, [showOTPOverlay, otpMessage]); // Re-run focus when message changes (e.g., after resend)

  const isErrorObject = error && typeof error === 'object';
  const errorMessage = isErrorObject ? (error.message || 'Login failed') : (error || '');
  const errorCode = isErrorObject ? error.code : null;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      
      {/* ✅ Main Login Form */}
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

      {/* ✅ OTP OVERLAY */}
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
          <Paper
            elevation={6}
            sx={{
              p: 3,
              width: '90%',
              maxWidth: '350px',
              textAlign: 'center',
              position: 'relative',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
              Verify Email
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
              Enter the 6-digit code sent to:<br/>
              <strong>{unverifiedEmail}</strong>
            </Typography>

            {otpMessage.text && (
              <Alert severity={otpMessage.type} sx={{ mb: 2, fontSize: '0.8rem' }}>
                {otpMessage.text}
              </Alert>
            )}

            <TextField
              inputRef={otpInputRef}
              type="text"
              inputProps={{
                maxLength: 6,
                style: {
                  letterSpacing: '10px',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: '10px'
                }
              }}
              fullWidth
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
              disabled={otpLoading || resendLoading}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button
                  size="small"
                  onClick={() => setShowOTPOverlay(false)}
                  disabled={otpLoading || resendLoading}
                  color="inherit"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleVerifyOTP}
                  disabled={otpLoading || resendLoading || otpValue.length !== 6}
                  size="large"
                  sx={{ minWidth: '120px' }}
                >
                  {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
                </Button>
              </Box>
              
              {/* ✅ Improved Resend Button inside Overlay */}
              <Button 
                size="small" 
                onClick={() => handleRequestOTP(unverifiedEmail)} 
                disabled={resendLoading || otpLoading}
                sx={{ 
                  mt: 1, 
                  textTransform: 'none', 
                  color: '#1976d2',
                  fontWeight: 'bold'
                }}
              >
                {resendLoading ? (
                  <>
                    <CircularProgress size={14} sx={{ mr: 1 }} /> Sending...
                  </>
                ) : (
                  'Didn\'t receive code? Resend'
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}