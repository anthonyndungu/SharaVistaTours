import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUserProfile, 
  updateMe, 
  updateMyPassword, 
  clearError 
} from '../../features/auth/authSlice';
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
// Using Heroicons wrapped in SVG or MUI icons if preferred. 
// For consistency with AdminProfile, I'll use MUI icons above, 
// but you can swap back to Heroicons if you have a wrapper component.

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  background: '#f5f5f5'
};

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading: sliceLoading, error: sliceError } = useSelector((state) => state.auth); 
  
  const [tabValue, setTabValue] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form States: Basic Info
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Form States: Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    } else {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, dispatch]);

  // Handle Slice Errors
  useEffect(() => {
    if (sliceError) {
      setMessage({ type: 'error', text: typeof sliceError === 'string' ? sliceError : 'An error occurred' });
      dispatch(clearError());
    }
  }, [sliceError, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMessage({ type: '', text: '' });
    dispatch(clearError());
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (message.type === 'success') setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (message.type === 'success') setMessage({ type: '', text: '' });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await dispatch(updateMe(profileForm)).unwrap();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      setLocalLoading(false);
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      setLocalLoading(false);
      return;
    }

    try {
      await dispatch(updateMyPassword(passwordForm)).unwrap();
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
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

  if (isLoading && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
          {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : <PersonIcon />}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
            Profile Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal information and security
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
          <Box component="form" onSubmit={handleProfileSubmit}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: COLORS.primary }}>
              Personal Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
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
                  value={profileForm.email}
                  onChange={handleProfileChange}
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
                  type="tel"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  required
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
                {isLoading ? 'Saving...' : 'Update Profile'}
              </Button>
            </Box>
          </Box>
        )}

        {/* TAB 2: Security & Password */}
        {tabValue === 1 && (
          <Box component="form" onSubmit={handlePasswordSubmit}>
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
                  value={passwordForm.currentPassword}
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
                  value={passwordForm.newPassword}
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
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isLoading}
                  error={passwordForm.confirmNewPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword}
                  helperText={passwordForm.confirmNewPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword ? "Passwords do not match" : ""}
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
                disabled={isLoading || (passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword)}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                sx={{ 
                  backgroundColor: COLORS.primary, 
                  px: 4,
                  '&:hover': { backgroundColor: '#1565c0' }
                }}
              >
                {isLoading ? 'Updating...' : 'Change Password'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}