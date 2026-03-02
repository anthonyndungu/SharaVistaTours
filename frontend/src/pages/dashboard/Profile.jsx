// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   fetchUserProfile, 
//   updateMe, 
//   updateMyPassword, 
//   clearError 
// } from '../../features/auth/authSlice';
// import { 
//   Box, 
//   Typography, 
//   TextField, 
//   Button, 
//   Avatar, 
//   Grid, 
//   Paper, 
//   Tab, 
//   Tabs, 
//   Alert, 
//   CircularProgress,
//   InputAdornment,
//   IconButton
// } from '@mui/material';
// import { 
//   Save as SaveIcon, 
//   LockReset as LockIcon, 
//   Person as PersonIcon, 
//   Email as EmailIcon, 
//   Phone as PhoneIcon,
//   Visibility,
//   VisibilityOff,
//   CheckCircle
// } from '@mui/icons-material';
// // Using Heroicons wrapped in SVG or MUI icons if preferred. 
// // For consistency with AdminProfile, I'll use MUI icons above, 
// // but you can swap back to Heroicons if you have a wrapper component.

// const COLORS = {
//   primary: '#1976d2',
//   success: '#2e7d32',
//   error: '#c62828',
//   background: '#f5f5f5'
// };

// export default function Profile() {
//   const dispatch = useDispatch();
//   const { user, loading: sliceLoading, error: sliceError } = useSelector((state) => state.auth); 
  
//   const [tabValue, setTabValue] = useState(0);
//   const [localLoading, setLocalLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
  
//   // Form States: Basic Info
//   const [profileForm, setProfileForm] = useState({
//     name: '',
//     email: '',
//     phone: ''
//   });

//   // Form States: Password
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmNewPassword: ''
//   });

//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });

//   // Initialize form data when user loads
//   useEffect(() => {
//     if (!user) {
//       dispatch(fetchUserProfile());
//     } else {
//       setProfileForm({
//         name: user.name || '',
//         email: user.email || '',
//         phone: user.phone || ''
//       });
//     }
//   }, [user, dispatch]);

//   // Handle Slice Errors
//   useEffect(() => {
//     if (sliceError) {
//       setMessage({ type: 'error', text: typeof sliceError === 'string' ? sliceError : 'An error occurred' });
//       dispatch(clearError());
//     }
//   }, [sliceError, dispatch]);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//     setMessage({ type: '', text: '' });
//     dispatch(clearError());
//   };

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileForm(prev => ({ ...prev, [name]: value }));
//     if (message.type === 'success') setMessage({ type: '', text: '' });
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordForm(prev => ({ ...prev, [name]: value }));
//     if (message.type === 'success') setMessage({ type: '', text: '' });
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setLocalLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       await dispatch(updateMe(profileForm)).unwrap();
//       setMessage({ type: 'success', text: 'Profile updated successfully!' });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLocalLoading(false);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setLocalLoading(true);
//     setMessage({ type: '', text: '' });

//     if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
//       setMessage({ type: 'error', text: 'New passwords do not match.' });
//       setLocalLoading(false);
//       return;
//     }
//     if (passwordForm.newPassword.length < 6) {
//       setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
//       setLocalLoading(false);
//       return;
//     }

//     try {
//       await dispatch(updateMyPassword(passwordForm)).unwrap();
//       setMessage({ type: 'success', text: 'Password changed successfully!' });
//       setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLocalLoading(false);
//     }
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
//   };

//   const isLoading = sliceLoading || localLoading;

//   if (isLoading && !user) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ 
//       p: { xs: 1, sm: 2, md: 3 }, 
//       maxWidth: '1200px', 
//       margin: '0 auto',
//       width: '100%',
//       boxSizing: 'border-box'
//     }}>
//       {/* Header */}
//       <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
//         <Avatar 
//           sx={{ 
//             width: { xs: 50, sm: 60 }, 
//             height: { xs: 50, sm: 60 }, 
//             bgcolor: COLORS.primary,
//             fontSize: { xs: '1.5rem', sm: '2rem' }
//           }}
//         >
//           {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : <PersonIcon />}
//         </Avatar>
//         <Box>
//           <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
//             Profile Settings
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Manage your personal information and security
//           </Typography>
//         </Box>
//       </Box>

//       {/* Tabs */}
//       <Paper sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden' }}>
//         <Tabs
//           value={tabValue}
//           onChange={handleTabChange}
//           variant="scrollable"
//           scrollButtons="auto"
//           sx={{
//             borderBottom: 1,
//             borderColor: 'divider',
//             backgroundColor: '#fafafa',
//             '& .MuiTab-root': {
//               textTransform: 'none',
//               fontWeight: 600,
//               fontSize: { xs: '0.875rem', sm: '1rem' },
//               minHeight: { xs: 48, sm: 56 }
//             }
//           }}
//         >
//           <Tab icon={<PersonIcon />} iconPosition="start" label="Basic Information" />
//           <Tab icon={<LockIcon />} iconPosition="start" label="Security & Password" />
//         </Tabs>
//       </Paper>

//       {/* Content Area */}
//       <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        
//         {/* Global Message Alert */}
//         {message.text && (
//           <Alert 
//             severity={message.type} 
//             sx={{ mb: 3, width: '100%' }} 
//             onClose={() => setMessage({ type: '', text: '' })}
//             action={message.type === 'success' ? <CheckCircle color="success" /> : null}
//           >
//             {message.text}
//           </Alert>
//         )}

//         {/* TAB 1: Basic Information */}
//         {tabValue === 0 && (
//           <Box component="form" onSubmit={handleProfileSubmit}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: COLORS.primary }}>
//               Personal Details
//             </Typography>
            
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Full Name"
//                   name="name"
//                   value={profileForm.name}
//                   onChange={handleProfileChange}
//                   required
//                   disabled={isLoading}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <PersonIcon color="action" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Email Address"
//                   name="email"
//                   type="email"
//                   value={profileForm.email}
//                   onChange={handleProfileChange}
//                   required
//                   disabled={isLoading}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <EmailIcon color="action" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Phone Number"
//                   name="phone"
//                   type="tel"
//                   value={profileForm.phone}
//                   onChange={handleProfileChange}
//                   required
//                   disabled={isLoading}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <PhoneIcon color="action" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
//                 />
//               </Grid>
//             </Grid>

//             <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 size="large"
//                 disabled={isLoading}
//                 startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
//                 sx={{ 
//                   backgroundColor: COLORS.primary, 
//                   px: 4,
//                   '&:hover': { backgroundColor: '#1565c0' }
//                 }}
//               >
//                 {isLoading ? 'Saving...' : 'Update Profile'}
//               </Button>
//             </Box>
//           </Box>
//         )}

//         {/* TAB 2: Security & Password */}
//         {tabValue === 1 && (
//           <Box component="form" onSubmit={handlePasswordSubmit}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: COLORS.primary }}>
//               Change Password
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               Ensure your account stays secure by using a strong, unique password.
//             </Typography>

//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Current Password"
//                   name="currentPassword"
//                   type={showPasswords.current ? 'text' : 'password'}
//                   value={passwordForm.currentPassword}
//                   onChange={handlePasswordChange}
//                   required
//                   disabled={isLoading}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton onClick={() => togglePasswordVisibility('current')} edge="end" disabled={isLoading}>
//                           {showPasswords.current ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     )
//                   }}
//                   sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="New Password"
//                   name="newPassword"
//                   type={showPasswords.new ? 'text' : 'password'}
//                   value={passwordForm.newPassword}
//                   onChange={handlePasswordChange}
//                   required
//                   disabled={isLoading}
//                   helperText="Min. 6 characters"
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton onClick={() => togglePasswordVisibility('new')} edge="end" disabled={isLoading}>
//                           {showPasswords.new ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     )
//                   }}
//                   sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Confirm New Password"
//                   name="confirmNewPassword"
//                   type={showPasswords.confirm ? 'text' : 'password'}
//                   value={passwordForm.confirmNewPassword}
//                   onChange={handlePasswordChange}
//                   required
//                   disabled={isLoading}
//                   error={passwordForm.confirmNewPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword}
//                   helperText={passwordForm.confirmNewPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword ? "Passwords do not match" : ""}
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton onClick={() => togglePasswordVisibility('confirm')} edge="end" disabled={isLoading}>
//                           {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     )
//                   }}
//                   sx={{ '& .MuiInputBase-root': { borderRadius: '6px' } }}
//                 />
//               </Grid>
//             </Grid>

//             <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 size="large"
//                 disabled={isLoading || (passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword)}
//                 startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
//                 sx={{ 
//                   backgroundColor: COLORS.primary, 
//                   px: 4,
//                   '&:hover': { backgroundColor: '#1565c0' }
//                 }}
//               >
//                 {isLoading ? 'Updating...' : 'Change Password'}
//               </Button>
//             </Box>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }



// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUserProfile, 
  updateMe, 
  updateMyPassword, 
  clearError 
} from '../../features/auth/authSlice';
import './Profile.css';

// Icons
const Icons = {
  User: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Lock: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Save: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
  Mail: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Eye: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  Check: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>,
  Alert: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
};

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading: sliceLoading, error: sliceError } = useSelector((state) => state.auth); 
  
  const [activeTab, setActiveTab] = useState('profile');
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

  // Initialize form data
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

  // Handle Errors
  useEffect(() => {
    if (sliceError) {
      setMessage({ type: 'error', text: typeof sliceError === 'string' ? sliceError : 'An error occurred' });
      dispatch(clearError());
    }
  }, [sliceError, dispatch]);

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
      // Error handled by slice effect
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
      // Error handled by slice effect
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
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        
        {/* Header */}
        <header className="profile-header">
          <div className="avatar-wrapper">
            <div className="avatar-large">
              {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : <Icons.User />}
            </div>
          </div>
          <div className="header-info">
            <h1>Profile Settings</h1>
            <p>Manage your personal information and security</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <Icons.User /> Basic Information
          </button>
          <button 
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Icons.Lock /> Security & Password
          </button>
        </div>

        {/* Content Card */}
        <div className="card content-card">
          
          {/* Message Alert */}
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.type === 'success' ? <Icons.Check /> : <Icons.Alert />}
              <span>{message.text}</span>
              <button onClick={() => setMessage({ type: '', text: '' })} className="alert-close">✕</button>
            </div>
          )}

          {/* Tab 1: Basic Information */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <h3 className="form-title">Personal Details</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icons.User /></span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      required
                      disabled={isLoading}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icons.Mail /></span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      required
                      disabled={isLoading}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icons.Phone /></span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      required
                      disabled={isLoading}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <span className="btn-loader"></span>
                  ) : (
                    <>
                      <Icons.Save /> Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Security & Password */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <h3 className="form-title">Change Password</h3>
              <p className="form-description">
                Ensure your account stays secure by using a strong, unique password.
              </p>

              <div className="form-grid single-column">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icons.Lock /></span>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      disabled={isLoading}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('current')}
                      disabled={isLoading}
                    >
                      {showPasswords.current ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icons.Lock /></span>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      disabled={isLoading}
                      placeholder="Min. 6 characters"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('new')}
                      disabled={isLoading}
                    >
                      {showPasswords.new ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                  <span className="helper-text">Min. 6 characters</span>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmNewPassword">Confirm New Password</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><Icons.Lock /></span>
                    <input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmNewPassword}
                      onChange={handlePasswordChange}
                      required
                      disabled={isLoading}
                      placeholder="Re-enter new password"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                      disabled={isLoading}
                    >
                      {showPasswords.confirm ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                  {passwordForm.confirmNewPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword && (
                    <span className="error-text">Passwords do not match</span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isLoading || (passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword)}
                >
                  {isLoading ? (
                    <span className="btn-loader"></span>
                  ) : (
                    <>
                      <Icons.Lock /> Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}