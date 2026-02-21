import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateMe, 
  updateMyPassword, 
  fetchUserProfile, 
  clearError 
} from '../../features/auth/authSlice'; // Adjust path if needed
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  Grid, 
  Paper, 
  Tab, 
  Tabs, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Save as SaveIcon, 
  LockReset as LockIcon, 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
  CheckCircle
} from '@mui/icons-material';

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  background: '#f5f5f5'
};

export default function AdminProfile() {
  const dispatch = useDispatch();
  const { user, loading: sliceLoading, error: sliceError } = useSelector((state) => state.auth); 
  
  const [tabValue, setTabValue] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form States: Basic Info
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Form States: Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Initialize form data when user loads from Redux
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, dispatch]);

  // Handle Slice Errors (Display them in the UI)
  useEffect(() => {
    if (sliceError) {
      setMessage({ type: 'error', text: typeof sliceError === 'string' ? sliceError : 'An error occurred' });
      // Clear error after showing so it doesn't persist on tab switch
      dispatch(clearError());
    }
  }, [sliceError, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMessage({ type: '', text: '' }); // Clear messages on tab switch
    dispatch(clearError());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear success message when user starts typing again
    if (message.type === 'success') setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (message.type === 'success') setMessage({ type: '', text: '' });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await dispatch(updateMe(formData)).unwrap();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Reset pass form just in case
    } catch (err) {
      // Error is handled by the useEffect listening to sliceError, 
      // but we can add specific local handling if needed
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setMessage({ type: '', text: '' });

    // Client-side Validation
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      setLocalLoading(false);
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      setLocalLoading(false);
      return;
    }
    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required.' });
      setLocalLoading(false);
      return;
    }

    try {
      await dispatch(updateMyPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      })).unwrap();
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const isLoading = sliceLoading || localLoading;

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      maxWidth: '1200px', 
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            width: { xs: 50, sm: 60 }, 
            height: { xs: 50, sm: 60 }, 
            bgcolor: COLORS.primary,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          {formData.name ? formData.name.charAt(0).toUpperCase() : <PersonIcon />}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
            My Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account settings and security
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: '#fafafa',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minHeight: { xs: 48, sm: 56 }
            }
          }}
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label="Basic Information" />
          <Tab icon={<LockIcon />} iconPosition="start" label="Security & Password" />
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        
        {/* Global Message Alert */}
        {message.text && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 3, width: '100%' }} 
            onClose={() => setMessage({ type: '', text: '' })}
            action={message.type === 'success' ? <CheckCircle color="success" /> : null}
          >
            {message.text}
          </Alert>
        )}

        {/* TAB 1: Basic Information */}
        {tabValue === 0 && (
          <Box component="form" onSubmit={handleSaveProfile}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: COLORS.primary }}>
              Personal Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
                />
              </Grid>

              {/* Optional: Display Role as Read-Only if available in user object */}
              {user?.role && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={user.role}
                    disabled
                    InputProps={{
                      sx: { backgroundColor: '#f5f5f5', borderRadius: '6px' }
                    }}
                    helperText="Contact Super Admin to change role"
                  />
                </Grid>
              )}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ 
                  backgroundColor: COLORS.primary, 
                  px: 4,
                  '&:hover': { backgroundColor: '#1565c0' }
                }}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        )}

        {/* TAB 2: Security & Password */}
        {tabValue === 1 && (
          <Box component="form" onSubmit={handleUpdatePassword}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: COLORS.primary }}>
              Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ensure your account stays secure by using a strong, unique password.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => togglePasswordVisibility('current')} edge="end" disabled={isLoading}>
                          {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isLoading}
                  helperText="Min. 6 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => togglePasswordVisibility('new')} edge="end" disabled={isLoading}>
                          {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isLoading}
                  error={passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword}
                  helperText={passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword ? "Passwords do not match" : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => togglePasswordVisibility('confirm')} edge="end" disabled={isLoading}>
                          {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                sx={{ 
                  backgroundColor: COLORS.error, 
                  px: 4,
                  '&:hover': { backgroundColor: '#b71c1c' }
                }}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}