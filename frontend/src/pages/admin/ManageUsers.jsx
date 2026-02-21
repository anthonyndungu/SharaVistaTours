// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom'; 
// import { fetchAllUsers } from '../../features/auth/authSlice';
// import AdminTable from '../../components/AdminTable';
// import { 
//   Box, 
//   Typography, 
//   Chip,
//   Avatar,
//   TableRow,    
//   TableCell,
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import { Visibility as ViewIcon } from '@mui/icons-material'; 

// const COLORS = {
//   primary: '#1976d2',
//   success: '#2e7d32',
//   error: '#c62828',
//   warning: '#e65100'
// };

// export default function ManageUsers() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { users, loading } = useSelector((state) => state.auth);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     dispatch(fetchAllUsers());
//   }, [dispatch]);

//   // Define columns with responsive visibility hints if your AdminTable supports it
//   // Otherwise, we handle visibility inside renderRow
//   const columns = [
//     { id: 'name', label: 'Name', minWidth: 150 },
//     { id: 'email', label: 'Email', minWidth: 180 },
//     { id: 'phone', label: 'Phone', minWidth: 120 },
//     { id: 'role', label: 'Role', minWidth: 100 },
//     { id: 'status', label: 'Status', minWidth: 100 },
//     { id: 'actions', label: 'Actions', minWidth: 80, align: 'right' }
//   ];

//   const handleViewProfile = (userId) => {
//     navigate(`/admin/users/${userId}`);
//   };

//   const renderRow = (user) => (
//     <TableRow 
//       key={user.id} 
//       hover 
//       sx={{ 
//         '&:last-child td, &:last-child th': { border: 0 }, 
//         cursor: 'pointer',
//         // Optional: Highlight row on mobile tap
//         '&:active': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
//       }}
//       onClick={() => handleViewProfile(user.id)}
//     >
//       {/* Name Column - Always Visible */}
//       <TableCell>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Avatar 
//             sx={{ 
//               width: { xs: 28, sm: 32 }, 
//               height: { xs: 28, sm: 32 }, 
//               bgcolor: COLORS.primary,
//               fontSize: { xs: '0.75rem', sm: '0.875rem' }
//             }}
//           >
//             {user.name.charAt(0).toUpperCase()}
//           </Avatar>
//           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//             <Typography 
//               variant="subtitle2" 
//               sx={{ 
//                 fontWeight: 600, 
//                 fontSize: { xs: '0.8rem', sm: '0.875rem' },
//                 maxWidth: { xs: '120px', sm: 'none' },
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 whiteSpace: 'nowrap'
//               }}
//             >
//               {user.name}
//             </Typography>
//             {/* Show Email on mobile only inside name column if desired, otherwise hidden */}
//             <Typography 
//               variant="caption" 
//               color="text.secondary" 
//               sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '0.7rem' }}
//             >
//               {user.email}
//             </Typography>
//           </Box>
//         </Box>
//       </TableCell>

//       {/* Email Column - Hidden on XS, Visible on SM+ */}
//       <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
//         <Typography 
//           variant="body2" 
//           sx={{ 
//             maxWidth: '180px', 
//             overflow: 'hidden', 
//             textOverflow: 'ellipsis', 
//             whiteSpace: 'nowrap' 
//           }}
//         >
//           {user.email}
//         </Typography>
//       </TableCell>

//       {/* Phone Column - Hidden on XS, Visible on MD+ (Optional: keep on SM if needed) */}
//       <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
//         <Typography variant="body2">{user.phone}</Typography>
//       </TableCell>

//       {/* Role Column - Visible on all, smaller on mobile */}
//       <TableCell>
//         <Chip 
//           label={user.role}
//           size="small"
//           sx={{
//             backgroundColor: user.role === 'admin' || user.role === 'super_admin' 
//               ? '#e3f2fd' 
//               : '#f5f5f5',
//             color: user.role === 'admin' || user.role === 'super_admin' 
//               ? COLORS.primary 
//               : '#666',
//             fontWeight: 600,
//             height: { xs: 24, sm: 32 },
//             fontSize: { xs: '0.65rem', sm: '0.75rem' }
//           }}
//         />
//       </TableCell>

//       {/* Status Column - Visible on all */}
//       <TableCell>
//         <Chip 
//           label={user.is_verified ? 'Verified' : 'Pending'}
//           size="small"
//           sx={{
//             backgroundColor: user.is_verified ? '#e8f5e9' : '#fff3e0',
//             color: user.is_verified ? COLORS.success : COLORS.warning,
//             fontWeight: 600,
//             height: { xs: 24, sm: 32 },
//             fontSize: { xs: '0.65rem', sm: '0.75rem' }
//           }}
//         />
//       </TableCell>

//       {/* Actions Column - Always Visible */}
//       <TableCell align="right">
//         <Tooltip title="View Profile">
//           <IconButton 
//             onClick={(e) => {
//               e.stopPropagation();
//               handleViewProfile(user.id);
//             }}
//             sx={{ 
//               color: COLORS.primary,
//               padding: { xs: '4px', sm: '8px' } // Smaller touch target on mobile if needed
//             }}
//           >
//             <ViewIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
//           </IconButton>
//         </Tooltip>
//       </TableCell>
//     </TableRow>
//   );

//   if (loading && !users.length) {
//     return <Box sx={{ p: 4, textAlign: 'center' }}>Loading users...</Box>;
//   }

//   return (
//     <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
//       <Typography 
//         variant="h5" 
//         sx={{ 
//           fontWeight: 700, 
//           color: '#000', 
//           mb: 3,
//           fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.875rem' }
//         }}
//       >
//         Manage Clients & Admins
//       </Typography>

//       {/* Stats Summary - Fully Responsive Grid */}
//       <Box sx={{ 
//         display: 'grid', 
//         gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
//         gap: { xs: 2, sm: 3 }, 
//         mb: 4 
//       }}>
//         <Box sx={{ 
//           p: 2, 
//           backgroundColor: '#fff', 
//           borderRadius: '8px', 
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
//           border: '1px solid #e0e0e0',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center'
//         }}>
//           <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//             Total Users
//           </Typography>
//           <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//             {users?.length || 0}
//           </Typography>
//         </Box>
        
//         <Box sx={{ 
//           p: 2, 
//           backgroundColor: '#fff', 
//           borderRadius: '8px', 
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
//           border: '1px solid #e0e0e0',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center'
//         }}>
//           <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//             Admins
//           </Typography>
//           <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.primary, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//             {(users || []).filter(u => u.role === 'admin' || u.role === 'super_admin').length}
//           </Typography>
//         </Box>
        
//         <Box sx={{ 
//           p: 2, 
//           backgroundColor: '#fff', 
//           borderRadius: '8px', 
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
//           border: '1px solid #e0e0e0',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           // On mobile, make this span full width if only 2 cols used above, 
//           // but gridTemplateColumns handles the layout automatically.
//         }}>
//           <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
//             Clients
//           </Typography>
//           <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.success, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//             {(users || []).filter(u => u.role === 'client').length}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Table Container with Horizontal Scroll for very small screens if needed */}
//       <Box sx={{ 
//         width: '100%', 
//         overflowX: 'auto', 
//         borderRadius: '8px',
//         boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//         backgroundColor: '#fff'
//       }}>
//         <AdminTable
//           columns={columns}
//           data={users || []}
//           renderRow={renderRow}
//           searchTerm={searchTerm}
//           onSearchChange={setSearchTerm}
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           initialRowsPerPage={10}
//         />
//       </Box>
//     </Box>
//   );
// }



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
  Tooltip
} from '@mui/material';
import { 
  Visibility as ViewIcon, 
  Phone as PhoneIcon, 
  Email as EmailIcon 
} from '@mui/icons-material'; 

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#e65100'
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
    
    // 📱 MOBILE CARD VIEW
    if (isMobile) {
      return (
        <TableRow 
          key={user.id} 
          sx={{ 
            display: 'block', 
            mb: 2, 
            borderRadius: '8px', 
            border: '1px solid #e0e0e0', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            backgroundColor: '#fff',
            overflow: 'hidden',
            '&:last-child': { mb: 0 },
            // Critical: Force full width within parent
            width: '100%', 
            boxSizing: 'border-box' 
          }}
        >
          {/* Card Header: Name & Action */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #f0f0f0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: '#fafafa',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden', flex: 1 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: COLORS.primary, fontSize: '1rem', flexShrink: 0 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {user.id}
                </Typography>
              </Box>
            </Box>
            <Tooltip title="View Profile">
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProfile(user.id);
                }}
                sx={{ color: COLORS.primary, flexShrink: 0 }}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Card Body: Details as Key-Value Pairs */}
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', boxSizing: 'border-box' }}>
            
            {/* Email Row */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
              <EmailIcon sx={{ color: 'text.secondary', mt: 0.5, fontSize: 20, flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Email Address
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>

            {/* Phone Row */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
              <PhoneIcon sx={{ color: 'text.secondary', mt: 0.5, fontSize: 20, flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Phone Number
                </Typography>
                <Typography variant="body2">
                  {user.phone || 'N/A'}
                </Typography>
              </Box>
            </Box>

            {/* Role & Status Row (Side by Side) */}
            <Box sx={{ display: 'flex', gap: 2, mt: 1, width: '100%' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Role
                </Typography>
                <Chip 
                  label={user.role}
                  size="small"
                  sx={{
                    backgroundColor: user.role === 'admin' || user.role === 'super_admin' ? '#e3f2fd' : '#f5f5f5',
                    color: user.role === 'admin' || user.role === 'super_admin' ? COLORS.primary : '#666',
                    fontWeight: 600,
                    height: 24,
                    maxWidth: '100%'
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Status
                </Typography>
                <Chip 
                  label={user.is_verified ? 'Verified' : 'Pending'}
                  size="small"
                  sx={{
                    backgroundColor: user.is_verified ? '#e8f5e9' : '#fff3e0',
                    color: user.is_verified ? COLORS.success : COLORS.warning,
                    fontWeight: 600,
                    height: 24,
                    maxWidth: '100%'
                  }}
                />
              </Box>
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
          '&:active': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
        }}
        onClick={() => handleViewProfile(user.id)}
      >
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primary, fontSize: '0.875rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.phone}</TableCell>
        <TableCell>
          <Chip 
            label={user.role}
            size="small"
            sx={{
              backgroundColor: user.role === 'admin' || user.role === 'super_admin' ? '#e3f2fd' : '#f5f5f5',
              color: user.role === 'admin' || user.role === 'super_admin' ? COLORS.primary : '#666',
              fontWeight: 600
            }}
          />
        </TableCell>
        <TableCell>
          <Chip 
            label={user.is_verified ? 'Verified' : 'Pending'}
            size="small"
            sx={{
              backgroundColor: user.is_verified ? '#e8f5e9' : '#fff3e0',
              color: user.is_verified ? COLORS.success : COLORS.warning,
              fontWeight: 600
            }}
          />
        </TableCell>
        <TableCell align="right">
          <Tooltip title="View Profile">
            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                handleViewProfile(user.id);
              }}
              sx={{ color: COLORS.primary }}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  if (loading && !users.length) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Loading users...</Box>;
  }

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      width: '100%', 
      maxWidth: '100%', 
      overflowX: 'hidden', // Prevent parent from scrolling horizontally
      boxSizing: 'border-box'
    }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        Manage Clients & Admins
      </Typography>

      {/* Stats Summary */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
        gap: { xs: 2, sm: 3 }, 
        mb: 4 
      }}>
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
          <Typography variant="caption" color="textSecondary">Total Users</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{users?.length || 0}</Typography>
        </Box>
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
          <Typography variant="caption" color="textSecondary">Admins</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.primary }}>
            {(users || []).filter(u => u.role === 'admin' || u.role === 'super_admin').length}
          </Typography>
        </Box>
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
          <Typography variant="caption" color="textSecondary">Clients</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.success }}>
            {(users || []).filter(u => u.role === 'client').length}
          </Typography>
        </Box>
      </Box>

      {/* Table Wrapper */}
      <Box sx={{ 
        width: '100%', 
        // Only allow horizontal scroll on desktop where table exists
        overflowX: { xs: 'hidden', md: 'auto' }, 
        borderRadius: '8px',
        boxSizing: 'border-box'
      }}>
        <AdminTable
          columns={columns}
          data={users || []}
          renderRow={renderRow}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          rowsPerPageOptions={[5, 10, 25, 50]}
          initialRowsPerPage={10}
        />
      </Box>
    </Box>
  );
}