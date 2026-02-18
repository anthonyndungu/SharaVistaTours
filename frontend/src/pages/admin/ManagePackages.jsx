// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchPackages, deletePackage } from '../../features/packages/packageSlice';
// import { Link } from 'react-router-dom';
// import Spinner from '../../components/Spinner';

// const COLORS = {
//   primary: '#1976d2',
//   text: '#000',
//   textSecondary: '#555',
//   background: '#fff',
//   border: '#e0e0e0',
//   cardShadow: '0 2px 8px rgba(0,0,0,0.1)'
// };

// export default function ManagePackages() {
//   const dispatch = useDispatch();
//   const { packages, loading } = useSelector((state) => state.packages);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     dispatch(fetchPackages());
//   }, [dispatch]);

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this package?')) {
//       dispatch(deletePackage(id));
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: '48px 0', textAlign: 'center' }}>
//         <Spinner />
//       </div>
//     );
//   }

//   const filteredPackages = packages?.filter(pkg =>
//     pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     pkg.category.toLowerCase().includes(searchTerm.toLowerCase())
//   ) || [];

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
//           Manage Packages
//         </h1>
//         <div style={{ display: 'flex', gap: '12px' }}>
//           <input
//             type="text"
//             placeholder="Search packages..."
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
//           <Link
//             to="/admin/packages/new"
//             style={{
//               padding: '8px 16px',
//               backgroundColor: COLORS.primary,
//               color: '#fff',
//               textDecoration: 'none',
//               borderRadius: '4px',
//               fontWeight: '600'
//             }}
//           >
//             Add New Package
//           </Link>
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
//           <p style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '4px' }}>Total Packages</p>
//           <p style={{ fontSize: '20px', fontWeight: '700', color: COLORS.text }}>{packages?.length || 0}</p>
//         </div>
//         <div style={{
//           backgroundColor: COLORS.background,
//           padding: '16px',
//           borderRadius: '8px',
//           boxShadow: COLORS.cardShadow
//         }}>
//           <p style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '4px' }}>Featured</p>
//           <p style={{ fontSize: '20px', fontWeight: '700', color: COLORS.text }}>
//             {packages?.filter(p => p.is_featured).length || 0}
//           </p>
//         </div>
//       </div>

//       {/* Packages Table */}
//       {filteredPackages.length > 0 ? (
//         <div style={{ overflowX: 'auto', backgroundColor: COLORS.background, borderRadius: '8px', boxShadow: COLORS.cardShadow }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Package</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Category</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Price (Adult)</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Status</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPackages.map((pkg) => (
//                 <tr key={pkg.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
//                   <td style={{ padding: '12px 16px', color: COLORS.text }}>
//                     <div style={{ fontWeight: '600' }}>{pkg.title}</div>
//                     <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginTop: '4px' }}>
//                       {pkg.duration} days
//                     </div>
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.text, textTransform: 'capitalize' }}>
//                     {pkg.category}
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.text }}>
//                     KES {parseFloat(pkg.price_adult).toLocaleString()}
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       borderRadius: '12px',
//                       fontSize: '12px',
//                       fontWeight: '600',
//                       backgroundColor: pkg.status === 'active' ? '#e8f5e9' : '#ffebee',
//                       color: pkg.status === 'active' ? '#2e7d32' : '#c62828'
//                     }}>
//                       {pkg.status}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <Link
//                       to={`/admin/packages/edit/${pkg.id}`}
//                       style={{
//                         marginRight: '8px',
//                         padding: '6px 12px',
//                         backgroundColor: COLORS.primary,
//                         color: '#fff',
//                         textDecoration: 'none',
//                         borderRadius: '4px',
//                         fontSize: '12px'
//                       }}
//                     >
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(pkg.id)}
//                       style={{
//                         padding: '6px 12px',
//                         backgroundColor: '#f44336',
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '4px',
//                         fontSize: '12px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Delete
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
//           No packages found
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/admin/ManagePackages.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages, deletePackage } from '../../features/packages/packageSlice';
import { Link } from 'react-router-dom';
import AdminTable from '../../components/AdminTable';
import {
  Button,
  Chip,
  Box,
  Typography,
  TableRow,
  TableCell,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#e65100'
};

export default function ManagePackages() {
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state) => state.packages);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      dispatch(deletePackage(id));
    }
  };

  const columns = [
    { id: 'title', label: 'Package', minWidth: 200 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'price_adult', label: 'Price (Adult)', minWidth: 120, align: 'right' },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'right' }
  ];

  const renderRow = (pkg) => (
    <TableRow 
      key={pkg.id} 
      hover 
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {pkg.title}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {pkg.duration} days
        </Typography>
      </TableCell>
      <TableCell>
        <Chip 
          label={pkg.category} 
          size="small" 
          sx={{ 
            textTransform: 'capitalize',
            backgroundColor: '#f5f5f5'
          }} 
        />
      </TableCell>
      <TableCell align="right">
        KES {parseFloat(pkg.price_adult).toLocaleString()}
      </TableCell>
      <TableCell>
        <Chip 
          label={pkg.status}
          size="small"
          sx={{
            backgroundColor: pkg.status === 'active' ? '#e8f5e9' : '#ffebee',
            color: pkg.status === 'active' ? COLORS.success : COLORS.error
          }}
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Edit Package">
          <Button
            component={Link}
            to={`/admin/packages/edit/${pkg.id}`}
            size="small"
            startIcon={<EditIcon />}
            sx={{ 
              mr: 1,
              backgroundColor: COLORS.primary,
              color: 'white',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Edit
          </Button>
        </Tooltip>
        <Tooltip title="Delete Package">
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(pkg.id)}
            sx={{ 
              backgroundColor: COLORS.error,
              color: 'white',
              '&:hover': { backgroundColor: '#b71c1c' }
            }}
          >
            Delete
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
          Manage Packages
        </Typography>
        <Button
          component={Link}
          to="/admin/packages/new"
          variant="contained"
          sx={{ 
            backgroundColor: COLORS.primary,
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          Add New Package
        </Button>
      </Box>

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
          <Typography variant="body2" color="textSecondary">Total Packages</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {packages?.length || 0}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="textSecondary">Featured</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {packages?.filter(p => p.is_featured).length || 0}
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={packages || []}
        renderRow={renderRow}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        rowsPerPageOptions={[5, 10, 25, 50]}
        initialRowsPerPage={10}
      />
    </Box>
  );
}