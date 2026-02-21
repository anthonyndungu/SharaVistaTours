import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentHistory } from '../../features/payments/paymentSlice';
import { format } from 'date-fns';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ReceiptLong as ReceiptIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#ed6c02',
  info: '#0288d1',
  background: '#f5f7fa'
};

// Helper to get status color config
const getStatusConfig = (status) => {
  switch (status) {
    case 'completed':
      return { label: 'Completed', bg: '#e8f5e9', text: '#2e7d32' };
    case 'failed':
      return { label: 'Failed', bg: '#ffebee', text: '#c62828' };
    case 'refunded':
      return { label: 'Refunded', bg: '#f3e5f5', text: '#7b1fa2' };
    case 'pending':
    default:
      return { label: 'Pending', bg: '#fff3e0', text: '#ef6c00' };
  }
};

export default function PaymentHistory() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { payments, loading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1.5, sm: 2, md: 3 }, 
      maxWidth: '1200px', 
      margin: '0 auto', 
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
          Payment History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View all your transaction records and receipts
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }} variant="filled">
          {error}
        </Alert>
      )}

      {/* Content Area */}
      {payments.length === 0 ? (
        /* Empty State */
        <Paper sx={{ p: { xs: 4, sm: 6, md: 8 }, textAlign: 'center', borderRadius: '12px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: { xs: 60, sm: 80 }, 
              height: { xs: 60, sm: 80 }, 
              borderRadius: '50%', 
              backgroundColor: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ReceiptIcon sx={{ fontSize: { xs: 30, sm: 40 }, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              No payments found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              You haven't made any payments yet. Once you book a tour and pay, your transaction history will appear here.
            </Typography>
          </Box>
        </Paper>
      ) : (
        /* Data Table */
        <Paper sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <TableContainer sx={{ 
            overflowX: 'auto', 
            '&::-webkit-scrollbar': { height: '6px' },
            '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
            '&::-webkit-scrollbar-thumb': { background: '#bdbdbd', borderRadius: '3px' }
          }}>
            <Table sx={{ minWidth: isMobile ? 650 : 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Booking Ref</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Method</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap', align: 'right' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => {
                  const statusConfig = getStatusConfig(payment.status);
                  return (
                    <TableRow 
                      key={payment.id} 
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { backgroundColor: '#f9fafb' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.primary, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {payment.transaction_id || `#${payment.id}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#000' }}>
                          {payment.Booking?.booking_number || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PaymentIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, textTransform: 'capitalize' }}>
                            {payment.payment_method}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#000', fontSize: { xs: '0.8rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
                          KES {parseFloat(payment.amount).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusConfig.label}
                          size="small"
                          sx={{
                            backgroundColor: statusConfig.bg,
                            color: statusConfig.text,
                            fontWeight: 600,
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            height: { xs: 22, sm: 24 }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                            {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}