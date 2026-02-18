// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllUsers } from '../../features/auth/authSlice';
// import Spinner from '../../components/Spinner';

// const COLORS = {
//   primary: '#1976d2',
//   text: '#000',
//   textSecondary: '#555',
//   background: '#fff',
//   border: '#e0e0e0',
//   cardShadow: '0 2px 8px rgba(0,0,0,0.1)'
// };

// export default function ManageUsers() {
//   const dispatch = useDispatch();
//   const { users, loading } = useSelector((state) => state.auth);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     dispatch(fetchAllUsers());
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <div style={{ padding: '48px 0', textAlign: 'center' }}>
//         <Spinner />
//       </div>
//     );
//   }

//   const filteredUsers = (users || []).filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div>
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '24px'
//       }}>
//         <h1 style={{
//           fontSize: '24px',
//           fontWeight: '700',
//           color: COLORS.text
//         }}>
//           Manage Clients
//         </h1>
//         <div style={{ display: 'flex', gap: '12px' }}>
//           <input
//             type="text"
//             placeholder="Search clients..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               border: `1px solid ${COLORS.border}`,
//               borderRadius: '4px',
//               fontSize: '14px',
//               minWidth: '200px'
//             }}
//           />
//         </div>
//       </div>

//       {/* Stats Summary */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//         gap: '16px',
//         marginBottom: '24px'
//       }}>
//         <div style={{
//           backgroundColor: COLORS.background,
//           padding: '16px',
//           borderRadius: '8px',
//           boxShadow: COLORS.cardShadow
//         }}>
//           <p style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '4px' }}>Total Users</p>
//           <p style={{ fontSize: '20px', fontWeight: '700', color: COLORS.text }}>{users?.length || 0}</p>
//         </div>
//         <div style={{
//           backgroundColor: COLORS.background,
//           padding: '16px',
//           borderRadius: '8px',
//           boxShadow: COLORS.cardShadow
//         }}>
//           <p style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '4px' }}>Admins</p>
//           <p style={{ fontSize: '20px', fontWeight: '700', color: COLORS.text }}>
//             {(users || []).filter(u => u.role === 'admin' || u.role === 'super_admin').length}
//           </p>
//         </div>
//       </div>

//       {/* Users Table */}
//       {filteredUsers.length > 0 ? (
//         <div style={{ overflowX: 'auto', backgroundColor: COLORS.background, borderRadius: '8px', boxShadow: COLORS.cardShadow }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Name</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Email</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Phone</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Role</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Status</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((user) => (
//                 <tr key={user.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
//                   <td style={{ padding: '12px 16px', color: COLORS.text, fontWeight: '600' }}>
//                     {user.name}
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.text }}>
//                     {user.email}
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.text }}>
//                     {user.phone}
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       borderRadius: '12px',
//                       fontSize: '12px',
//                       fontWeight: '600',
//                       backgroundColor: user.role === 'admin' || user.role === 'super_admin' ? '#e3f2fd' : '#f5f5f5',
//                       color: user.role === 'admin' || user.role === 'super_admin' ? COLORS.primary : COLORS.textSecondary
//                     }}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       borderRadius: '12px',
//                       fontSize: '12px',
//                       fontWeight: '600',
//                       backgroundColor: user.is_verified ? '#e8f5e9' : '#fff3e0',
//                       color: user.is_verified ? '#2e7d32' : '#e65100'
//                     }}>
//                       {user.is_verified ? 'Verified' : 'Pending'}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <button
//                       style={{
//                         padding: '6px 12px',
//                         backgroundColor: COLORS.primary,
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '4px',
//                         fontSize: '12px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div style={{
//           textAlign: 'center',
//           padding: '48px 0',
//           color: COLORS.textSecondary,
//           backgroundColor: COLORS.background,
//           borderRadius: '8px',
//           boxShadow: COLORS.cardShadow
//         }}>
//           No users found
//         </div>
//       )}
//     </div>
//   );
// }


// src/pages/admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../features/auth/authSlice';
import AdminTable from '../../components/AdminTable';
import { 
  Box, 
  Typography, 
  Chip,
  Avatar
} from '@mui/material';

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#e65100'
};

export default function ManageUsers() {
  const dispatch = useDispatch();
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

  const renderRow = (user) => (
    <TableRow 
      key={user.id} 
      hover 
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
              : '#666'
          }}
        />
      </TableCell>
      <TableCell>
        <Chip 
          label={user.is_verified ? 'Verified' : 'Pending'}
          size="small"
          sx={{
            backgroundColor: user.is_verified ? '#e8f5e9' : '#fff3e0',
            color: user.is_verified ? COLORS.success : COLORS.warning
          }}
        />
      </TableCell>
      <TableCell align="right">
        {/* Add edit button if needed */}
        <Typography variant="body2" color="textSecondary">
          View Profile
        </Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 3 }}>
        Manage Clients
      </Typography>

      {/* Stats Summary */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
        gap: 2, 
        mb: 3 
      }}>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="textSecondary">Total Users</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {users?.length || 0}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="textSecondary">Admin Users</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {(users || []).filter(u => u.role === 'admin' || u.role === 'super_admin').length}
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