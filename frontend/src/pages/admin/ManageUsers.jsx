import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { fetchAllUsers } from '../../features/auth/authSlice';
import AdminTable from '../../components/AdminTable';
import { 
  Box, 
  Typography, 
  Chip,
  Avatar,
  TableRow,    
  TableCell,
  IconButton,
  Tooltip,
  Button,
  InputAdornment
} from '@mui/material';
import { 
  Visibility as ViewIcon, 
  Phone as PhoneIcon, 
  Email as EmailIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Search as SearchIcon
} from '@mui/icons-material'; 

const COLORS = {
  primary: '#2563eb',
  primaryLight: '#eff6ff',
  success: '#16a34a',
  successLight: '#f0fdf4',
  warning: '#ca8a04',
  warningLight: '#fffbeb',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray700: '#374151',
  gray900: '#111827'
};

export default function ManageUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const columns = [
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 180 },
    { id: 'phone', label: 'Phone', minWidth: 120 },
    { id: 'role', label: 'Role', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 80, align: 'right' }
  ];

  const handleViewProfile = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  // ✅ Responsive Row Renderer
  const renderRow = (user, isMobile = false) => {
    
    // 📱 MOBILE CARD VIEW (Enhanced)
    if (isMobile) {
      return (
        <TableRow 
          key={user.id} 
          sx={{ 
            display: 'block', 
            mb: 2, 
            borderRadius: '12px', 
            border: `1px solid ${COLORS.gray200}`, 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#fff',
            overflow: 'hidden',
            '&:last-child': { mb: 0 },
            width: '100%', 
            boxSizing: 'border-box',
            transition: 'transform 0.2s',
            '&:active': { transform: 'scale(0.98)' }
          }}
        >
          {/* Card Header */}
          <Box sx={{ 
            p: 2.5, 
            borderBottom: `1px solid ${COLORS.gray100}`, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: COLORS.gray50,
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', flex: 1 }}>
              <Avatar sx={{ 
                width: 48, height: 48, bgcolor: COLORS.primary, fontSize: '1.2rem', flexShrink: 0,
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLORS.gray900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 0.5 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.gray500, fontFamily: 'monospace', bgcolor: COLORS.gray200, px: 1, py: 0.5, borderRadius: 1 }}>
                  ID: {user.id}
                </Typography>
              </Box>
            </Box>
            <Tooltip title="View Profile">
              <IconButton 
                onClick={(e) => { e.stopPropagation(); handleViewProfile(user.id); }}
                sx={{ color: COLORS.primary, flexShrink: 0, bgcolor: COLORS.primaryLight, '&:hover': { bgcolor: '#dbeafe' } }}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Card Body */}
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%', boxSizing: 'border-box' }}>
            
            {/* Contact Info */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ mt: 0.5, color: COLORS.gray400 }}><EmailIcon fontSize="small" /></Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: COLORS.gray500, fontWeight: 600, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Email Address</Typography>
                  <Typography variant="body2" sx={{ color: COLORS.gray700, wordBreak: 'break-word', lineHeight: 1.5 }}>{user.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ mt: 0.5, color: COLORS.gray400 }}><PhoneIcon fontSize="small" /></Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: COLORS.gray500, fontWeight: 600, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Phone Number</Typography>
                  <Typography variant="body2" sx={{ color: COLORS.gray700, lineHeight: 1.5 }}>{user.phone || 'N/A'}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Badges */}
            <Box sx={{ display: 'flex', gap: 2, pt: 1, borderTop: `1px dashed ${COLORS.gray200}` }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: COLORS.gray500, fontWeight: 600, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Role</Typography>
                <Chip 
                  label={user.role.replace('_', ' ').toUpperCase()}
                  size="small"
                  sx={{
                    justifyContent: 'flex-start',
                    backgroundColor: user.role.includes('admin') ? COLORS.primaryLight : COLORS.gray100,
                    color: user.role.includes('admin') ? COLORS.primary : COLORS.gray700,
                    fontWeight: 700, height: 28
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: COLORS.gray500, fontWeight: 600, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Status</Typography>
                <Chip 
                  label={user.is_verified ? 'Verified' : 'Pending'}
                  size="small"
                  sx={{
                    justifyContent: 'flex-start',
                    backgroundColor: user.is_verified ? COLORS.successLight : COLORS.warningLight,
                    color: user.is_verified ? COLORS.success : COLORS.warning,
                    fontWeight: 700, height: 28
                  }}
                />
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ mt: 1 }}>
              <Button 
                fullWidth variant="contained" onClick={() => handleViewProfile(user.id)}
                startIcon={<ViewIcon />}
                sx={{ 
                  borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1.2,
                  bgcolor: COLORS.primary,
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                  '&:hover': { bgcolor: '#1d4ed8' }
                }}
              >
                View Full Profile
              </Button>
            </Box>
          </Box>
        </TableRow>
      );
    }

    // 💻 DESKTOP TABLE VIEW
    return (
      <TableRow 
        key={user.id} 
        hover 
        sx={{ 
          '&:last-child td, &:last-child th': { border: 0 }, 
          cursor: 'pointer',
          '&:active': { backgroundColor: COLORS.primaryLight }
        }}
        onClick={() => handleViewProfile(user.id)}
      >
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: COLORS.primary, fontSize: '0.9rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.gray900 }}>
              {user.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ color: COLORS.gray700 }}>{user.email}</TableCell>
        <TableCell sx={{ color: COLORS.gray700 }}>{user.phone || 'N/A'}</TableCell>
        <TableCell>
          <Chip 
            label={user.role.replace('_', ' ')}
            size="small"
            sx={{
              backgroundColor: user.role.includes('admin') ? COLORS.primaryLight : COLORS.gray100,
              color: user.role.includes('admin') ? COLORS.primary : COLORS.gray700,
              fontWeight: 700, height: 24
            }}
          />
        </TableCell>
        <TableCell>
          <Chip 
            label={user.is_verified ? 'Verified' : 'Pending'}
            size="small"
            icon={user.is_verified ? <CheckIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
            sx={{
              backgroundColor: user.is_verified ? COLORS.successLight : COLORS.warningLight,
              color: user.is_verified ? COLORS.success : COLORS.warning,
              fontWeight: 700, height: 24
            }}
          />
        </TableCell>
        <TableCell align="right">
          <Tooltip title="View Profile">
            <IconButton 
              onClick={(e) => { e.stopPropagation(); handleViewProfile(user.id); }}
              sx={{ color: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryLight } }}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  if (loading && !users?.length) {
    return <Box sx={{ p: 4, textAlign: 'center', color: COLORS.gray500 }}>Loading users...</Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.gray900, mb: 1 }}>Manage Clients & Admins</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>View and manage all system users</Typography>

      {/* Stats Summary */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        <Box sx={{ p: 2.5, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: `1px solid ${COLORS.gray200}` }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>Total Users</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>{users?.length || 0}</Typography>
        </Box>
        <Box sx={{ p: 2.5, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: `1px solid ${COLORS.gray200}` }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>Admins</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: COLORS.primary }}>
            {(users || []).filter(u => u.role.includes('admin')).length}
          </Typography>
        </Box>
        <Box sx={{ p: 2.5, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: `1px solid ${COLORS.gray200}` }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>Clients</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: COLORS.success }}>
            {(users || []).filter(u => u.role === 'client').length}
          </Typography>
        </Box>
      </Box>

      {/* Table Wrapper */}
      <Box sx={{ width: '100%', overflowX: { xs: 'hidden', md: 'auto' }, borderRadius: 3, boxSizing: 'border-box' }}>
        <AdminTable
          columns={columns}
          data={users || []}
          renderRow={renderRow}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          rowsPerPageOptions={[5, 10, 25, 50]}
          initialRowsPerPage={10}
          searchInputProps={{
            placeholder: "Search by name, email, or phone...",
            InputProps: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: '#fff',
                '& fieldset': { borderColor: COLORS.gray200 },
                '&:hover fieldset': { borderColor: COLORS.gray400 },
                '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
              }
            },
            sx: { '& .MuiInputBase-root': { height: '44px', fontSize: '0.9rem' } }
          }}
        />
      </Box>
    </Box>
  );
}