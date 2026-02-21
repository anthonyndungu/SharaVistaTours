// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllUsers } from '../../features/auth/authSlice';
// import AdminTable from '../../components/AdminTable';
// import { 
//   Box, 
//   Typography, 
//   Chip,
//   Avatar,
//   TableRow,   
//   TableCell 
// } from '@mui/material';

// const COLORS = {
//   primary: '#1976d2',
//   success: '#2e7d32',
//   error: '#c62828',
//   warning: '#e65100'
// };

// export default function ManageUsers() {
//   const dispatch = useDispatch();
//   const { users, loading } = useSelector((state) => state.auth);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     dispatch(fetchAllUsers());
//   }, [dispatch]);


//   const columns = [
//     { id: 'name', label: 'Name', minWidth: 180 },
//     { id: 'email', label: 'Email', minWidth: 200 },
//     { id: 'phone', label: 'Phone', minWidth: 150 },
//     { id: 'role', label: 'Role', minWidth: 120 },
//     { id: 'status', label: 'Status', minWidth: 120 },
//     { id: 'actions', label: 'Actions', minWidth: 120, align: 'right' }
//   ];

//   const renderRow = (user) => (
//     <TableRow 
//       key={user.id} 
//       hover 
//       sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//     >
//       <TableCell>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Avatar 
//             sx={{ 
//               width: 32, 
//               height: 32, 
//               bgcolor: COLORS.primary,
//               fontSize: '0.875rem'
//             }}
//           >
//             {user.name.charAt(0).toUpperCase()}
//           </Avatar>
//           <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//             {user.name}
//           </Typography>
//         </Box>
//       </TableCell>
//       <TableCell>{user.email}</TableCell>
//       <TableCell>{user.phone}</TableCell>
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
//               : '#666'
//           }}
//         />
//       </TableCell>
//       <TableCell>
//         <Chip 
//           label={user.is_verified ? 'Verified' : 'Pending'}
//           size="small"
//           sx={{
//             backgroundColor: user.is_verified ? '#e8f5e9' : '#fff3e0',
//             color: user.is_verified ? COLORS.success : COLORS.warning
//           }}
//         />
//       </TableCell>
//       <TableCell align="right">
//         {/* Add edit button if needed */}
//         <Typography variant="body2" color="textSecondary">
//           View Profile
//         </Typography>
//       </TableCell>
//     </TableRow>
//   );

//   return (
//     <Box sx={{ p: 0 }}>
//       <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 3 }}>
//         Manage Clients
//       </Typography>

//       {/* Stats Summary */}
//       <Box sx={{ 
//         display: 'grid', 
//         gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
//         gap: 2, 
//         mb: 3 
//       }}>
//         <Box sx={{ 
//           p: 2, 
//           backgroundColor: '#fff', 
//           borderRadius: '8px', 
//           boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//           border: '1px solid #e0e0e0'
//         }}>
//           <Typography variant="body2" color="textSecondary">Total Users</Typography>
//           <Typography variant="h6" sx={{ fontWeight: 700 }}>
//             {users?.length || 0}
//           </Typography>
//         </Box>
//         <Box sx={{ 
//           p: 2, 
//           backgroundColor: '#fff', 
//           borderRadius: '8px', 
//           boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//           border: '1px solid #e0e0e0'
//         }}>
//           <Typography variant="body2" color="textSecondary">Admin Users</Typography>
//           <Typography variant="h6" sx={{ fontWeight: 700 }}>
//             {(users || []).filter(u => u.role === 'admin' || u.role === 'super_admin').length}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Table */}
//       <AdminTable
//         columns={columns}
//         data={users || []}
//         renderRow={renderRow}
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         rowsPerPageOptions={[5, 10, 25, 50]}
//         initialRowsPerPage={10}
//       />
//     </Box>
//   );
// }


// ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
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
import { Visibility as ViewIcon } from '@mui/icons-material'; // ✅ Import Icon

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#e65100'
};

export default function ManageUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize navigate
  const { users, loading } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const columns = [
    { id: 'name', label: 'Name', minWidth: 180 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    { id: 'role', label: 'Role', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'actions', label: 'Actions', minWidth: 120, align: 'right' }
  ];

  const handleViewProfile = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const renderRow = (user) => (
    <TableRow 
      key={user.id} 
      hover 
      sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
      onClick={() => handleViewProfile(user.id)} // Optional: Click row to view
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: COLORS.primary,
              fontSize: '0.875rem'
            }}
          >
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
            backgroundColor: user.role === 'admin' || user.role === 'super_admin' 
              ? '#e3f2fd' 
              : '#f5f5f5',
            color: user.role === 'admin' || user.role === 'super_admin' 
              ? COLORS.primary 
              : '#666',
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
        {/* ✅ Activated Button */}
        <Tooltip title="View Profile">
          <IconButton 
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
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

  if (loading && !users.length) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Loading users...</Box>;
  }

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 3 }}>
        Manage Clients & Admins
      </Typography>

      {/* Stats Summary */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, 
        gap: 2, 
        mb: 3 
      }}>
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="textSecondary">Total Users</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{users?.length || 0}</Typography>
        </Box>
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="textSecondary">Admins</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.primary }}>
            {(users || []).filter(u => u.role === 'admin' || u.role === 'super_admin').length}
          </Typography>
        </Box>
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="textSecondary">Clients</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.success }}>
            {(users || []).filter(u => u.role === 'client').length}
          </Typography>
        </Box>
      </Box>

      {/* Table */}
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
  );
}