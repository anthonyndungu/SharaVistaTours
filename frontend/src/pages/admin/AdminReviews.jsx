// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllReviews } from '../../features/reviews/reviewSlice';
// import Spinner from '../../components/Spinner';

// const COLORS = {
//   primary: '#1976d2',
//   text: '#000',
//   textSecondary: '#555',
//   background: '#fff',
//   border: '#e0e0e0',
//   cardShadow: '0 2px 8px rgba(0,0,0,0.1)'
// };

// export default function AdminReviews() {
//   const dispatch = useDispatch();
//   const { allReviews: reviews, loading } = useSelector((state) => state.reviews);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     dispatch(fetchAllReviews());
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <div style={{ padding: '48px 0', textAlign: 'center' }}>
//         <Spinner />
//       </div>
//     );
//   }

//   const filteredReviews = (reviews || []).filter(review =>
//     review.TourPackage?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     review.User?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
//           Reviews Management
//         </h1>
//         <div style={{ display: 'flex', gap: '12px' }}>
//           <input
//             type="text"
//             placeholder="Search reviews..."
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
//           <p style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '4px' }}>Total Reviews</p>
//           <p style={{ fontSize: '20px', fontWeight: '700', color: COLORS.text }}>{reviews?.length || 0}</p>
//         </div>
//         <div style={{
//           backgroundColor: COLORS.background,
//           padding: '16px',
//           borderRadius: '8px',
//           boxShadow: COLORS.cardShadow
//         }}>
//           <p style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '4px' }}>Average Rating</p>
//           <p style={{ fontSize: '20px', fontWeight: '700', color: COLORS.text }}>
//             {reviews?.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
//           </p>
//         </div>
//       </div>

//       {/* Reviews Table */}
//       {filteredReviews.length > 0 ? (
//         <div style={{ overflowX: 'auto', backgroundColor: COLORS.background, borderRadius: '8px', boxShadow: COLORS.cardShadow }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Package</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Client</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Rating</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Date</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Status</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredReviews.map((review) => (
//                 <tr key={review.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
//                   <td style={{ padding: '12px 16px', color: COLORS.text }}>
//                     {review.TourPackage?.title || 'N/A'}
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.text }}>
//                     {review.User?.name || 'Anonymous'}
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     {[...Array(5)].map((_, i) => (
//                       <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#e0e0e0' }}>★</span>
//                     ))}
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.textSecondary }}>
//                     {new Date(review.created_at).toLocaleDateString()}
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       borderRadius: '12px',
//                       fontSize: '12px',
//                       fontWeight: '600',
//                       backgroundColor: review.is_approved ? '#e8f5e9' : '#fff3e0',
//                       color: review.is_approved ? '#2e7d32' : '#e65100'
//                     }}>
//                       {review.is_approved ? 'Approved' : 'Pending'}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <button
//                       style={{
//                         marginRight: '8px',
//                         padding: '6px 12px',
//                         backgroundColor: COLORS.primary,
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Approve
//                     </button>
//                     <button
//                       style={{
//                         padding: '6px 12px',
//                         backgroundColor: '#f44336',
//                         color: '#fff',
//                         border: 'none',
//                         borderRadius: '4px',
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
//           No reviews found
//         </div>
//       )}
//     </div>
//   );
// }



// src/pages/admin/AdminReviews.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews } from '../../features/reviews/reviewSlice';
import AdminTable from '../../components/AdminTable';
import { 
  Box, 
  Typography, 
  Chip,
  Rating,
  Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#e65100'
};

export default function AdminReviews() {
  const dispatch = useDispatch();
  const { allReviews: reviews, loading } = useSelector((state) => state.reviews);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const columns = [
    { id: 'package', label: 'Package', minWidth: 200 },
    { id: 'client', label: 'Client', minWidth: 150 },
    { id: 'rating', label: 'Rating', minWidth: 120 },
    { id: 'date', label: 'Date', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'right' }
  ];

  const renderRow = (review) => (
    <TableRow 
      key={review.id} 
      hover 
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {review.TourPackage?.title || 'N/A'}
        </Typography>
      </TableCell>
      <TableCell>{review.User?.name || 'Anonymous'}</TableCell>
      <TableCell>
        <Rating 
          value={review.rating} 
          readOnly 
          size="small" 
          sx={{ color: '#ffc107' }}
        />
      </TableCell>
      <TableCell>
        {new Date(review.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Chip 
          label={review.is_approved ? 'Approved' : 'Pending'}
          size="small"
          sx={{
            backgroundColor: review.is_approved ? '#e8f5e9' : '#fff3e0',
            color: review.is_approved ? COLORS.success : COLORS.warning
          }}
        />
      </TableCell>
      <TableCell align="right">
        <Button
          size="small"
          startIcon={<CheckCircleIcon />}
          sx={{ 
            mr: 1,
            backgroundColor: COLORS.success,
            color: 'white',
            '&:hover': { backgroundColor: '#1b5e20' }
          }}
        >
          Approve
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          sx={{ 
            backgroundColor: COLORS.error,
            color: 'white',
            '&:hover': { backgroundColor: '#b71c1c' }
          }}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 3 }}>
        Reviews Management
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
          <Typography variant="body2" color="textSecondary">Total Reviews</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {reviews?.length || 0}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="textSecondary">Average Rating</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {reviews?.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={reviews || []}
        renderRow={renderRow}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        rowsPerPageOptions={[5, 10, 25, 50]}
        initialRowsPerPage={10}
      />
    </Box>
  );
}