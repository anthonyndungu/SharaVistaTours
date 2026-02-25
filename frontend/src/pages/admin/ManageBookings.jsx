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
  InputLabel,
  TableRow,
  TableCell  
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