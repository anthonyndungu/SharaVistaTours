import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Card, CardContent, Grid, Avatar, Chip, 
  Button, Divider, Skeleton, Alert, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack as BackIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  Badge as RoleIcon,
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

import { fetchAllUsers, verifyUser } from '../../features/auth/authSlice'; 

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { users, loading: sliceLoading } = useSelector((state) => state.auth);
  
  // Local state for feedback and dialog
  const [localLoading, setLocalLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);

  // Fetch users if not present
  useEffect(() => {
    if (!users || users.length === 0 || !users.find(u => u.id === id)) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, id, users]);

  const user = users?.find(u => u.id === id);

  // ✅ 2. Real API Call Implementation
  const handleVerifyUser = async () => {
    setLocalLoading(true);
    setFeedback({ type: '', message: '' });
    setOpenVerifyDialog(false);

    try {
      // Dispatch the thunk to backend
      await dispatch(verifyUser(id)).unwrap();
      
      setFeedback({ 
        type: 'success', 
        message: `User ${user.name} has been successfully verified! They can now log in.` 
      });
      
      // Refresh the list to update the badge immediately
      dispatch(fetchAllUsers());
      
    } catch (err) {
      // Handle error from backend (e.g., "Already verified")
      setFeedback({ 
        type: 'error', 
        message: err || 'Failed to verify user.' 
      });
    } finally {
      setLocalLoading(false);
    }
  };

  // Loading State
  if (sliceLoading && !user) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="rectangular" height={250} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="text" height={40} width="60%" />
        <Skeleton variant="text" height={40} width="40%" />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  // Not Found State
  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">User not found</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          The user ID {id} does not exist in the system.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/admin/clients')} sx={{ mt: 2 }}>
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
          onClick={() => navigate('/admin/clients')} 
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

            {/* ✅ Verify Action Button (Only shows if Unverified) */}
            {!user.is_verified && (
              <Box sx={{ mt: { xs: 2, sm: 0 } }}>
                <Tooltip title="Manually verify this user so they can log in immediately">
                  <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<VerifiedIcon />}
                    onClick={() => setOpenVerifyDialog(true)}
                    disabled={localLoading || sliceLoading}
                    sx={{ minWidth: 160 }}
                  >
                    {localLoading ? 'Verifying...' : 'Verify Account'}
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
            
            {/* User ID */}
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
            Are you sure you want to manually verify <strong>{user.name}</strong>? 
            <br />
            <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>
              This will bypass the email OTP requirement and allow them to log in immediately.
            </span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenVerifyDialog(false)} 
            disabled={localLoading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerifyUser} 
            variant="contained" 
            color="success" 
            disabled={localLoading}
            startIcon={localLoading ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
          >
            {localLoading ? 'Verifying...' : 'Yes, Verify User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}