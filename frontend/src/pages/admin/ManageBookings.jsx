// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllBookings, updateBookingStatus } from '../../features/bookings/bookingSlice';
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

// export default function ManageBookings() {
//   const dispatch = useDispatch();
//   const { bookings, loading } = useSelector((state) => state.bookings);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     dispatch(getAllBookings());
//   }, [dispatch]);

//   const handleStatusChange = (bookingId, newStatus) => {
//     dispatch(updateBookingStatus({ id: bookingId, status: newStatus }));
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: '48px 0', textAlign: 'center' }}>
//         <Spinner />
//       </div>
//     );
//   }

//   const filteredBookings = (bookings || []).filter(booking => {
//     const matchesSearch = 
//       booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       booking.TourPackage?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       booking.User?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'confirmed': return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
//       case 'completed': return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
//       case 'cancelled': return { backgroundColor: '#ffebee', color: '#c62828' };
//       default: return { backgroundColor: '#fff3e0', color: '#e65100' };
//     }
//   };

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
//           Manage Bookings
//         </h1>
//         <div style={{ display: 'flex', gap: '12px' }}>
//           <input
//             type="text"
//             placeholder="Search bookings..."
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
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               border: `1px solid ${COLORS.border}`,
//               borderRadius: '4px',
//               fontSize: '14px',
//               minWidth: '120px'
//             }}
//           >
//             <option value="all">All Statuses</option>
//             <option value="pending">Pending</option>
//             <option value="confirmed">Confirmed</option>
//             <option value="completed">Completed</option>
//             <option value="cancelled">Cancelled</option>
//           </select>
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
//           <p style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '4px' }}>Total Bookings</p>
//           <p style={{ fontSize: '20px', fontWeight: '700', color: COLORS.text }}>{bookings?.length || 0}</p>
//         </div>
//         <div style={{
//           backgroundColor: COLORS.background,
//           padding: '16px',
//           borderRadius: '8px',
//           boxShadow: COLORS.cardShadow
//         }}>
//           <p style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '4px' }}>Revenue</p>
//           <p style={{ fontSize: '20px', fontWeight: '700', color: COLORS.text }}>
//             KES {(bookings || []).reduce((sum, b) => sum + parseFloat(b.total_amount), 0).toLocaleString()}
//           </p>
//         </div>
//       </div>

//       {/* Bookings Table */}
//       {filteredBookings.length > 0 ? (
//         <div style={{ overflowX: 'auto', backgroundColor: COLORS.background, borderRadius: '8px', boxShadow: COLORS.cardShadow }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Booking #</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Package</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Client</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Date</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Amount</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Status</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: COLORS.textSecondary }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBookings.map((booking) => (
//                 <tr key={booking.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
//                   <td style={{ padding: '12px 16px', color: COLORS.text, fontFamily: 'monospace' }}>
//                     {booking.booking_number}
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.text }}>
//                     {booking.TourPackage?.title}
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.text }}>
//                     {booking.User?.name}
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.textSecondary }}>
//                     {new Date(booking.start_date).toLocaleDateString()}
//                   </td>
//                   <td style={{ padding: '12px 16px', color: COLORS.text, fontWeight: '600' }}>
//                     KES {parseFloat(booking.total_amount).toLocaleString()}
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <select
//                       value={booking.status}
//                       onChange={(e) => handleStatusChange(booking.id, e.target.value)}
//                       style={{
//                         padding: '4px 8px',
//                         borderRadius: '12px',
//                         fontSize: '12px',
//                         fontWeight: '600',
//                         border: '1px solid',
//                         ...getStatusStyle(booking.status)
//                       }}
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="confirmed">Confirmed</option>
//                       <option value="completed">Completed</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                   <td style={{ padding: '12px 16px' }}>
//                     <Link
//                       to={`/admin/bookings/${booking.id}`}
//                       style={{
//                         padding: '6px 12px',
//                         backgroundColor: COLORS.primary,
//                         color: '#fff',
//                         textDecoration: 'none',
//                         borderRadius: '4px',
//                         fontSize: '12px'
//                       }}
//                     >
//                       View Details
//                     </Link>
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
//           No bookings found
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/admin/ManageBookings.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookings, updateBookingStatus } from '../../features/bookings/bookingSlice';
import { Link } from 'react-router-dom';
import AdminTable from '../../components/AdminTable';
import { 
  Button, 
  Chip, 
  Box, 
  Typography, 
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#e65100',
  info: '#1976d2'
};

const STATUS_COLORS = {
  pending: { bg: '#fff3e0', color: COLORS.warning },
  confirmed: { bg: '#e8f5e9', color: COLORS.success },
  completed: { bg: '#f3e5f5', color: COLORS.info },
  cancelled: { bg: '#ffebee', color: COLORS.error }
};

export default function ManageBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  const handleStatusChange = (bookingId, newStatus) => {
    dispatch(updateBookingStatus({ id: bookingId, status: newStatus }));
  };

  // Apply status filter
  const filteredBookings = (bookings || []).filter(booking => {
    return statusFilter === 'all' || booking.status === statusFilter;
  });

  const columns = [
    { id: 'booking_number', label: 'Booking #', minWidth: 120 },
    { id: 'package', label: 'Package', minWidth: 200 },
    { id: 'client', label: 'Client', minWidth: 150 },
    { id: 'date', label: 'Date', minWidth: 120 },
    { id: 'amount', label: 'Amount', minWidth: 120, align: 'right' },
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'actions', label: 'Actions', minWidth: 120, align: 'right' }
  ];

  const renderRow = (booking) => (
    <TableRow 
      key={booking.id} 
      hover 
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell sx={{ fontFamily: 'monospace' }}>
        {booking.booking_number}
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {booking.TourPackage?.title}
        </Typography>
      </TableCell>
      <TableCell>{booking.User?.name}</TableCell>
      <TableCell>
        {new Date(booking.start_date).toLocaleDateString()}
      </TableCell>
      <TableCell align="right">
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          KES {parseFloat(booking.total_amount).toLocaleString()}
        </Typography>
      </TableCell>
      <TableCell>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={booking.status}
            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
            sx={{
              backgroundColor: STATUS_COLORS[booking.status]?.bg || '#f5f5f5',
              color: STATUS_COLORS[booking.status]?.color || '#000',
              '& .MuiSelect-select': {
                py: 0.5,
                px: 1,
                fontSize: '0.875rem'
              }
            }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      <TableCell align="right">
        <Button
          component={Link}
          to={`/admin/bookings/${booking.id}`}
          size="small"
          variant="contained"
          sx={{ 
            backgroundColor: COLORS.primary,
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          View Details
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
          Manage Bookings
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ backgroundColor: '#fff' }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
          <Typography variant="body2" color="textSecondary">Total Bookings</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {bookings?.length || 0}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="textSecondary">Total Revenue</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            KES {(bookings || []).reduce((sum, b) => sum + parseFloat(b.total_amount), 0).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredBookings}
        renderRow={renderRow}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        rowsPerPageOptions={[5, 10, 25, 50]}
        initialRowsPerPage={10}
      />
    </Box>
  );
}