// // features/users/UserProfile.jsx
// import React, { useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   Box, Typography, Card, CardContent, Grid, Avatar, Chip, 
//   Button, Divider, Skeleton 
// } from '@mui/material';
// import { ArrowBack as BackIcon, Email as EmailIcon, Phone as PhoneIcon, Badge as RoleIcon } from '@mui/icons-material';
// // If you have a specific thunk to fetch one user, use it here. 
// // For now, we'll find the user from the existing list or you can create fetchUserById
// import { fetchAllUsers } from '../../features/auth/authSlice'; 

// export default function UserProfile() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { users, loading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!users || users.length === 0) {
//       dispatch(fetchAllUsers());
//     }
//   }, [dispatch, users]);

//   const user = users?.find(u => u.id === id);

//   if (loading && !user) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
//         <Skeleton variant="text" height={40} />
//         <Skeleton variant="text" height={40} />
//       </Box>
//     );
//   }

//   if (!user) {
//     return (
//       <Box sx={{ p: 4, textAlign: 'center' }}>
//         <Typography variant="h6" color="error">User not found</Typography>
//         <Button onClick={() => navigate('/admin/users')} sx={{ mt: 2 }}>Go Back</Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
//       {/* Header */}
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <Button startIcon={<BackIcon />} onClick={() => navigate('/admin/clients')} sx={{ mr: 2 }}>
//           Back
//         </Button>
//         <Typography variant="h5" sx={{ fontWeight: 700 }}>User Profile</Typography>
//       </Box>

//       <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
//         <CardContent sx={{ p: 4 }}>
//           {/* Avatar & Name */}
//           <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 4, gap: 3 }}>
//             <Avatar 
//               sx={{ 
//                 width: 100, 
//                 height: 100, 
//                 bgcolor: '#1976d2', 
//                 fontSize: '2.5rem',
//                 boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
//               }}
//             >
//               {user.name.charAt(0).toUpperCase()}
//             </Avatar>
//             <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
//               <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{user.name}</Typography>
//               <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
//                 <Chip 
//                   label={user.role.toUpperCase()} 
//                   color={user.role.includes('admin') ? 'primary' : 'default'} 
//                   sx={{ fontWeight: 600 }}
//                 />
//                 <Chip 
//                   label={user.is_verified ? 'Verified' : 'Unverified'} 
//                   color={user.is_verified ? 'success' : 'warning'} 
//                   variant="outlined"
//                 />
//               </Box>
//             </Box>
//           </Box>

//           <Divider sx={{ my: 3 }} />

//           {/* Details Grid */}
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
//                 <Box>
//                   <Typography variant="caption" color="textSecondary">Email Address</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.email}</Typography>
//                 </Box>
//               </Box>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
//                 <Box>
//                   <Typography variant="caption" color="textSecondary">Phone Number</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.phone}</Typography>
//                 </Box>
//               </Box>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <RoleIcon sx={{ mr: 2, color: 'text.secondary' }} />
//                 <Box>
//                   <Typography variant="caption" color="textSecondary">Account Role</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>{user.role}</Typography>
//                 </Box>
//               </Box>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <Box sx={{ mr: 2, color: 'text.secondary', fontWeight: 'bold' }}>ID</Box>
//                 <Box>
//                   <Typography variant="caption" color="textSecondary">User ID</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.id}</Typography>
//                 </Box>
//               </Box>
//             </Grid>
            
//             <Grid item xs={12}>
//                <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                   <Typography variant="caption" color="textSecondary">Member Since:</Typography>
//                   <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>
//                     {new Date(user.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
//                   </Typography>
//                </Box>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }



// features/users/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Card, CardContent, Grid, Avatar, Chip, 
  Button, Divider, Skeleton, Alert, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  ArrowBack as BackIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  Badge as RoleIcon,
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

// Import actions (Assuming you will add verifyUser to authSlice or a userSlice)
import { fetchAllUsers } from '../../features/auth/authSlice'; 
// import { verifyUser } from '../../features/users/userSlice'; // Uncomment when created

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { users, loading } = useSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  
  // Dialog state for role change confirmation (optional safety)
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);

  useEffect(() => {
    // If users list is empty or doesn't contain this user, fetch all
    if (!users || users.length === 0 || !users.find(u => u.id === id)) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, id, users]);

  const user = users?.find(u => u.id === id);

  const handleVerifyUser = async () => {
    setLocalLoading(true);
    setFeedback({ type: '', message: '' });
    setOpenVerifyDialog(false);

    try {
      // TODO: Replace with actual API call via Redux thunk
      // await dispatch(verifyUser(id)).unwrap();
      
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFeedback({ 
        type: 'success', 
        message: `User ${user.name} has been successfully verified! They can now log in.` 
      });
      
      // Optionally refresh the list to update the badge immediately
      dispatch(fetchAllUsers());
      
    } catch (err) {
      setFeedback({ 
        type: 'error', 
        message: err.message || 'Failed to verify user.' 
      });
    } finally {
      setLocalLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="rectangular" height={250} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="text" height={40} width="60%" />
        <Skeleton variant="text" height={40} width="40%" />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">User not found</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          The user ID {id} does not exist in the system.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/admin/users')} sx={{ mt: 2 }}>
          Back to Users List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Button 
          startIcon={<BackIcon />} 
          onClick={() => navigate('/admin/users')} 
          variant="outlined"
          size="small"
        >
          Back
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>User Profile</Typography>
      </Box>

      {/* Feedback Alert */}
      {feedback.message && (
        <Alert 
          severity={feedback.type} 
          sx={{ mb: 3 }} 
          onClose={() => setFeedback({ type: '', message: '' })}
        >
          {feedback.message}
        </Alert>
      )}

      <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          
          {/* Top Section: Avatar & Status */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 4, gap: 3 }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: user.role.includes('admin') ? '#1976d2' : '#2e7d32', 
                fontSize: '3rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{user.name}</Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<RoleIcon />}
                  label={user.role.replace('_', ' ').toUpperCase()} 
                  color={user.role.includes('admin') ? 'primary' : 'success'} 
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  icon={user.is_verified ? <VerifiedIcon /> : <WarningIcon />}
                  label={user.is_verified ? 'Verified Account' : 'Unverified Account'} 
                  color={user.is_verified ? 'success' : 'warning'} 
                  variant={user.is_verified ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>

            {/* ✅ Verify Action Button */}
            {!user.is_verified && (
              <Box sx={{ mt: { xs: 2, sm: 0 } }}>
                <Tooltip title="Allow this user to log in">
                  <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<VerifiedIcon />}
                    onClick={() => setOpenVerifyDialog(true)}
                    disabled={localLoading}
                    sx={{ minWidth: 160 }}
                  >
                    Verify Account
                  </Button>
                </Tooltip>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Details Grid */}
          <Grid container spacing={4}>
            {/* Email */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                <EmailIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>Email Address</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>{user.email}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                <PhoneIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>Phone Number</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{user.phone}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Role */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                <RoleIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>Account Role</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {user.role.replace('_', ' ')}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {user.role === 'super_admin' ? 'Full System Access' : user.role === 'admin' ? 'Management Access' : 'Client Access'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Member Since */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                <VerifiedIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>Member Since</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(user.created_at).toLocaleDateString('en-KE', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            {/* User ID (Full Width for visibility) */}
            <Grid item xs={12}>
               <Box sx={{ p: 2, bgcolor: '#eceff1', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>SYSTEM USER ID</Typography>
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem' }}>
                    {user.id}
                  </Typography>
               </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Verification Confirmation Dialog */}
      <Dialog open={openVerifyDialog} onClose={() => setOpenVerifyDialog(false)}>
        <DialogTitle>Verify User Account?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to verify <strong>{user.name}</strong>? 
            This will allow them to log in to the system immediately.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVerifyDialog(false)} disabled={localLoading}>Cancel</Button>
          <Button 
            onClick={handleVerifyUser} 
            variant="contained" 
            color="success" 
            disabled={localLoading}
          >
            {localLoading ? 'Verifying...' : 'Yes, Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}