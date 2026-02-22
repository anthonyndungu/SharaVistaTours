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