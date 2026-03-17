import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import {
  login,
  clearError,
  setLoginMessage
} from '../../features/auth/authSlice';

import {
  Button,
  TextField,
  Typography,
  Box,
  Paper
} from '@mui/material';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 

  const from = location.state?.from; 


  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect if logged in
  useEffect(() => {
    
    if (isAuthenticated && user) {
       if (from) {
        navigate(from, { replace: true });
        return;
      }

      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  // ✅ Handle Errors from Redux with Specific Codes  
  useEffect(() => {
    if (error) {
      // Error structure: { message, code, email? }
      const errCode = typeof error === 'object' ? error.code : null;
      const errMsg = typeof error === 'object' ? error.message : error;
      const errEmail = typeof error === 'object' ? error.email : null;

      console.log('🚨 Login Error Caught:', { code: errCode, message: errMsg, email: errEmail });

      if (errCode === 'ACCOUNT_NOT_VERIFIED') {
        // 1. Show Warning Toast
        toast.warning(errMsg || 'Account not verified', {
          position: "top-center",
          autoClose: 5000
        });

        // 2. Navigate to Verify Page with Email
        // Priority: Backend Email > Form State (handled in catch) > Empty
        const emailToUse = errEmail || '';

        navigate('/auth/verify-otp', {
          state: {
            email: emailToUse,
            message: errMsg
          }
        });
      }
      else if (errCode === 'INVALID_CREDENTIALS' || errCode === 'MISSING_FIELDS') {
        // Standard Login Error
        toast.error(errMsg || 'Invalid email or password', {
          position: "top-center",
          autoClose: 4000
        });
      }
      else if (errCode === 'SERVER_ERROR' || !errCode) {
        // Network or Unknown Error
        toast.error(errMsg || 'Network error. Please try again.', {
          position: "top-center",
          autoClose: 4000
        });
      }

      // Clear error after handling so it doesn't persist on re-render
      dispatch(clearError());
    }
  }, [error, dispatch, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values)).unwrap();

      // Success
      toast.success('Login successful! Welcome back.', {
        position: "top-center",
        autoClose: 3000
      });

      dispatch(setLoginMessage({ message: 'Welcome back', severity: 'success' }));

      // Redirect happens via the useEffect watching isAuthenticated

    } catch (err) {
      // err is the object { message, code, email? } from rejectWithValue

      console.log('🔍 Catch Block Executed:', err);

      if (err?.code === 'ACCOUNT_NOT_VERIFIED') {
        // Ensure we have an email to pass along
        const emailToPass = err?.email || values.email;

        // Navigation is primarily handled by useEffect, but this ensures 
        // the state is ready immediately if useEffect lags
        navigate('/auth/verify-otp', {
          state: {
            email: emailToPass,
            message: err.message
          }
        });
      }
      // Other errors are handled by the useEffect above
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '110vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>

      <Paper elevation={3} sx={{ maxWidth: 400, width: '100%', mx: 2, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: '#1976d2', fontWeight: 700 }}>Login</Typography>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors, isSubmitting, submitForm }) => (
            <div style={{ width: '100%' }}>

              {/* Email Field */}
              <Box sx={{ mb: 2 }}>
                <Typography component="label" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: '#555' }}>Email Address</Typography>
                <Field name="email">
                  {({ field }) => (
                    <TextField
                      {...field}
                      id="email"
                      fullWidth
                      placeholder="Enter your email"
                      size="small"
                      disabled={loading}
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!loading && !isSubmitting) submitForm();
                        }
                      }}
                    />
                  )}
                </Field>
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 2 }}>
                <Typography component="label" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: '#555' }}>Password</Typography>
                <Field name="password">
                  {({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      fullWidth
                      placeholder="Enter your password"
                      size="small"
                      disabled={loading}
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!loading && !isSubmitting) submitForm();
                        }
                      }}
                    />
                  )}
                </Field>
                <Box sx={{ textAlign: 'right', mt: 0.5 }}>
                  <Link to="/forgot-password" style={{ color: '#1976d2', fontSize: '0.8rem', textDecoration: 'none' }}>Forgot Password?</Link>
                </Box>
              </Box>

              {/* Submit Button */}
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!loading && !isSubmitting) submitForm();
                }}
                fullWidth
                variant="contained"
                disabled={loading || isSubmitting}
                sx={{ py: 1.5, fontWeight: 600, bgcolor: '#1976d2', '&:disabled': { bgcolor: '#ccc' } }}
              >
                {loading || isSubmitting ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                  </Box>
                ) : 'Log In'}
              </Button>
            </div>
          )}
        </Formik>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            No account? <Link to="/auth/register" style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
          </Typography>
        </Box>
      </Paper>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        .dot { width: 8px; height: 8px; border-radius: 50%; background-color: white; display: inline-block; margin: 0 4px; animation: pulse 1.4s infinite ease-in-out both; }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        .dot:nth-child(3) { animation-delay: 0s; }
      `}</style>
    </Box>
  );
}