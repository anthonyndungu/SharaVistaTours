import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { 
  resendVerificationOTP, 
  verifyOTP, 
  setLoginMessage 
} from '../../features/auth/authSlice';

import {
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  Paper
} from '@mui/material';

export default function VerifyOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading } = useSelector((state) => state.auth);
  
  const initialEmail = location.state?.email || '';
  const initialMessage = location.state?.message || '';
  // Check if user just registered (optional flag)
  const isFromRegistration = location.state?.isFromRegistration || false; 

  const [email, setEmail] = useState(initialEmail);
  const [otpValue, setOtpValue] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState({ type: '', text: initialMessage });

  // ✅ Timer State
  const [timeLeft, setTimeLeft] = useState(600); // Start with default 10 mins (matches backend)
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Start timer immediately
  const [expiryTime, setExpiryTime] = useState(null);

  const otpInputRef = useRef(null);

  // Focus OTP input on load
  useEffect(() => {
    if (otpInputRef.current && !otpValue && email) {
      otpInputRef.current.focus();
    }
  }, [email, otpValue]);

  //Timer Logic (Counts down from 10 mins)
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = async () => {
    const emailToSend = email.trim();
    
    if (!emailToSend) {
      toast.error('Please enter your email address first.', { position: "top-center" });
      setOtpMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    setOtpLoading(true);
    try {
      // ✅ ONLY call API when user explicitly clicks "Resend"
      const result = await dispatch(resendVerificationOTP(emailToSend)).unwrap();
      
      setOtpMessage({ type: 'success', text: 'New OTP sent! Check your email.' });
      toast.success('OTP resent successfully!', { position: "top-center" });
      
      // Update timer based on backend response
      if (result?.expiresAt) {
        const expiryDate = new Date(result.expiresAt);
        const now = new Date();
        const diffInSeconds = Math.floor((expiryDate - now) / 1000);
        setExpiryTime(expiryDate);
        setTimeLeft(diffInSeconds > 0 ? diffInSeconds : 600);
        setIsTimerRunning(true);
      } else {
        setTimeLeft(600);
        setIsTimerRunning(true);
      }
      
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err?.message || 'Failed to send OTP');
      setOtpMessage({ type: 'error', text: msg });
      toast.error(msg, { position: "top-center" });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (values, { setSubmitting }) => {
    const emailToVerify = email.trim();
    if (!emailToVerify) {
      toast.error('Email address is missing.', { position: "top-center" });
      setOtpMessage({ type: 'error', text: 'Email is required' });
      setSubmitting(false);
      return;
    }

    const otpCode = values.otp.trim();
    if (otpCode.length !== 6) {
      toast.error('OTP must be 6 digits.', { position: "top-center" });
      setSubmitting(false);
      return;
    }

    if (timeLeft <= 0) {
      toast.error('OTP has expired. Please request a new one.', { position: "top-center" });
      setSubmitting(false);
      return;
    }

    setOtpLoading(true);
    try {
      await dispatch(verifyOTP({ email: emailToVerify, otp: otpCode })).unwrap();
      
      setOtpMessage({ type: 'success', text: 'Email verified successfully!' });
      toast.success('Verification successful! Redirecting...', { position: "top-center" });
      dispatch(setLoginMessage({ message: 'Email verified. Please login.', severity: 'success' }));

      setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 1000);

    } catch (err) {
      const msg = typeof err === 'string' ? err : (err?.message || 'Invalid or expired OTP');
      setOtpMessage({ type: 'error', text: msg });
      toast.error(msg, { position: "top-center" });
    } finally {
      setOtpLoading(false);
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, 'OTP must be 6 digits')
      .matches(/^[0-9]+$/, 'OTP must contain only numbers')
      .required('OTP is required'),
  });

  return (
    <Box sx={{ minHeight: '130vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ maxWidth: 400, width: '100%', mx: 2, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 1, color: '#1976d2', fontWeight: 700 }}>Verify Email</Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: '#666' }}>
          Enter the 6-digit code sent to <strong>{email}</strong>
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography component="label" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: '#555' }}>Email Address</Typography>
          <TextField 
            fullWidth 
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={otpLoading || isTimerRunning} 
            variant="outlined"
          />
        </Box>

        <Formik
          initialValues={{ otp: '' }}
          validationSchema={validationSchema}
          onSubmit={handleVerifyOTP}
        >
          {({ touched, errors, isSubmitting, submitForm }) => (
            <div style={{ width: '100%' }}>
              <Box sx={{ mb: 2 }}>
                <Typography component="label" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: '#555' }}>OTP Code</Typography>
                <Field name="otp">
                  {({ field }) => (
                    <TextField 
                      {...field}
                      inputRef={otpInputRef}
                      fullWidth 
                      placeholder="000000" 
                      size="large"
                      inputProps={{ 
                        style: { fontSize: '1.5rem', textAlign: 'center', letterSpacing: '10px', fontWeight: 'bold' },
                        maxLength: 6,
                        inputMode: 'numeric'
                      }}
                      disabled={otpLoading}
                      error={touched.otp && !!errors.otp}
                      helperText={touched.otp && errors.otp}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!otpLoading && !isSubmitting) submitForm();
                        }
                      }}
                    />
                  )}
                </Field>
              </Box>

              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: timeLeft < 30 && timeLeft > 0 ? '#d32f2f' : '#666', fontWeight: 'bold' }}>
                  {isTimerRunning 
                    ? `Code expires in: ${formatTime(timeLeft)}` 
                    : 'Code has expired'}
                </Typography>
              </Box>

              {otpMessage.text && (
                <Alert severity={otpMessage.type} sx={{ mb: 2 }}>
                  {otpMessage.text}
                </Alert>
              )}

              <Button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!otpLoading && !isSubmitting) submitForm();
                }}
                fullWidth 
                variant="contained" 
                disabled={otpLoading || isSubmitting || !email || (isTimerRunning && timeLeft === 0)} 
                sx={{ py: 1.5, fontWeight: 600, bgcolor: '#1976d2', '&:disabled': { bgcolor: '#ccc' } }}
              >
                {otpLoading || isSubmitting ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                  </Box>
                ) : 'Verify Account'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  size="small" 
                  onClick={handleResendOTP} 
                  disabled={otpLoading || (isTimerRunning && timeLeft > 0) || !email}
                  sx={{ 
                    color: '#1976d2', 
                    fontWeight: 'bold', 
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 1
                  }}
                >
                  {(isTimerRunning && timeLeft > 0)
                    ? `Resend OTP in ${formatTime(timeLeft)}` 
                    : (otpLoading ? 'Sending...' : "Didn't receive code? Resend OTP")
                  }
                </Button>
              </Box>
            </div>
          )}
        </Formik>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Remember your password? <Link to="/auth/login" style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
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