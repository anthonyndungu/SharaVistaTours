import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  register,
  clearError,
  setLoginMessage
} from '../../features/auth/authSlice';

import {
  Button,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Box,
  Paper,
  CircularProgress,
  Stack
} from '@mui/material';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
      .required('Phone number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    dispatch(clearError());

    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword
      };

      await dispatch(register(userData)).unwrap();

      setSnackbarMessage('Account created successfully! Redirecting to login...');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      dispatch(setLoginMessage({
        message: 'Registration successful! Please check your email to verify your account before logging in.',
        severity: 'success'
      }));

      setTimeout(() => {
        // navigate('/auth/verify-otp', { replace: true });
        navigate('/auth/verify-otp', {
          state: {
            email: userData.email,
            isFromRegistration: true
          },
          replace: true
        });
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);

      let message = 'Registration failed';
      if (typeof err === 'string') message = err;
      else if (err?.message) message = err.message;
      else if (err?.payload?.message) message = err.payload.message;
      else if (err?.response?.data?.message) message = err.response.data.message;

      setSnackbarMessage(message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      dispatch(setLoginMessage({ message, severity: 'error' }));
    } finally {
      setSubmitting(false);
    }
  };

  // Reusable Component for a Two-Column Row
  const TwoColumnRow = ({ leftField, rightField }) => (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on desktop
      gap: 2 // Consistent gap between columns
    }}>
      <Box sx={{ flex: 1, minWidth: 0 }}> {/* flex: 1 makes them equal width, minWidth: 0 prevents overflow */}
        {leftField}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {rightField}
      </Box>
    </Box>
  );

  // Reusable Component for an Input Field
  const RenderField = ({ name, label, type, placeholder, touched, errors }) => (
    <Box sx={{ width: '100%' }}>
      <Typography component="label" htmlFor={name} sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: '#555', fontSize: '0.9rem' }}>
        {label}
      </Typography>
      <Field
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        as={TextField}
        fullWidth
        disabled={loading}
        variant="outlined"
        size="small"
        error={touched[name] && !!errors[name]}
        sx={{
          '& .MuiInputBase-input': { py: 1.25 },
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            // Force exact width matching
            width: '100%',
            boxSizing: 'border-box'
          }
        }}
      />
      <ErrorMessage name={name} component="div" style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }} />
    </Box>
  );

  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      minHeight: '120vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#f5f5f5',
      py: 4
    }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Paper
        elevation={3}
        sx={{
          maxWidth: '600px',
          width: '100%',
          mx: 2,
          p: 4,
          borderRadius: 2,
          position: 'relative'
        }}
      >
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 4, color: '#1976d2', fontWeight: 700 }}>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
            {typeof error === 'object' ? error.message : error}
          </Alert>
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
          {({ isSubmitting, touched, errors }) => (
            <Form noValidate>
              <Stack spacing={3}>

                {/* ROW 1: Full Name (Full Width) */}
                {RenderField({
                  name: 'name',
                  label: 'Full Name',
                  type: 'text',
                  placeholder: 'Enter your full name',
                  touched,
                  errors
                })}

                {/* ROW 2: Phone & Email (Two Columns - Flexbox) */}
                <TwoColumnRow
                  leftField={RenderField({
                    name: 'phone',
                    label: 'Phone Number',
                    type: 'tel',
                    placeholder: '+254 712 345 678',
                    touched,
                    errors
                  })}
                  rightField={RenderField({
                    name: 'email',
                    label: 'Email Address',
                    type: 'email',
                    placeholder: 'Enter your email',
                    touched,
                    errors
                  })}
                />

                {/* ROW 3: Password & Confirm (Two Columns - Flexbox) */}
                <TwoColumnRow
                  leftField={RenderField({
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Create a password',
                    touched,
                    errors
                  })}
                  rightField={RenderField({
                    name: 'confirmPassword',
                    label: 'Confirm Password',
                    type: 'password',
                    placeholder: 'Confirm password',
                    touched,
                    errors
                  })}
                />

                {/* ROW 4: Register Button (Full Width) */}
                <Box sx={{ mt: 1 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting || loading}
                    sx={{
                      py: 1.25,
                      fontWeight: 600,
                      bgcolor: '#1976d2',
                      '&:hover': { bgcolor: '#1565c0' },
                      '&:disabled': { bgcolor: '#ccc' }
                    }}
                  >
                    {(isSubmitting || loading) ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Register'
                    )}
                  </Button>
                </Box>

                {/* Anti-spam field (Hidden) */}
                <div style={{ position: 'absolute', left: '-9999px' }}>
                  <label htmlFor="trap">Anti-spam</label>
                  <Field type="text" name="email_2" id="trap" tabIndex="-1" autoComplete="off" />
                </div>

              </Stack>
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link to="/auth/login" style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'none' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}