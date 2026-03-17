

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword, clearError } from '../../features/auth/authSlice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Spinner from '../../components/Spinner';

// MUI Imports
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Stack,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      return;
    }
    alert(formData.confirmPassword)

    const response = await dispatch(resetPassword({ token, password: formData.password, confirmPassword: formData.confirmPassword }));

    if (resetPassword.fulfilled.match(response)) {
      toast.success('Password reset successfully! Redirecting...', { position: 'top-center' });
      setTimeout(() => navigate('/auth/login'), 3000);
    }

  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/auth/login'); // Redirect to login page
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Password mismatch validation
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const canSubmit = formData.password && formData.confirmPassword && passwordsMatch && !loading;

  // if (success) {
  //   return (
  //     <Paper elevation={3} sx={{ p: 6, borderRadius: 2, textAlign: 'center', maxWidth: 500, width: '100%' }}>
  //       <Box sx={{
  //         width: 64,
  //         height: 64,
  //         bgcolor: '#e8f5e9',
  //         borderRadius: '50%',
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         mx: 'auto',
  //         mb: 3
  //       }}>
  //         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
  //           <polyline points="22 4 12 14.01 9 11.01"></polyline>
  //         </svg>
  //       </Box>
  //       <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
  //         Password reset successfully!
  //       </Typography>
  //       <Typography variant="body1" color="text.secondary">
  //         Redirecting to login...
  //       </Typography>
  //     </Paper>
  //   );
  // }

  return (
    <Box sx={{ minHeight: '120vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 2, maxWidth: 500, width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
            Set new password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your new password below.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            {/* New Password Field */}
            <TextField
              id="password"
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <EyeSlashIcon style={{ width: 20, height: 20, color: '#757575' }} />
                      ) : (
                        <EyeIcon style={{ width: 20, height: 20, color: '#757575' }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password Field */}
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              error={formData.password && formData.confirmPassword && !passwordsMatch}
              helperText={formData.password && formData.confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon style={{ width: 20, height: 20, color: '#757575' }} />
                      ) : (
                        <EyeIcon style={{ width: 20, height: 20, color: '#757575' }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!canSubmit}
              sx={{
                py: 1.5,
                fontWeight: 600,
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' },
                '&:disabled': { bgcolor: '#bdbdbd' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset password'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>

  );
}