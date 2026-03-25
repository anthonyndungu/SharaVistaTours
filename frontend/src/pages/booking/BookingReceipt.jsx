import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingReceipt } from '../../features/bookings/bookingSlice';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Divider,
  Stack,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { Print, Download, ArrowBack } from '@mui/icons-material';

export default function BookingReceipt() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentReceipt, receiptLoading, receiptError } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingReceipt(bookingId));
    }
  }, [dispatch, bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (receiptLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (receiptError || !currentReceipt) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{receiptError || 'Receipt not found'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard/bookings')}>
          Back to Bookings
        </Button>
      </Box>
    );
  }

  const { booking, customer, payment, passengers, company } = currentReceipt;

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Action Buttons (Hidden when printing) */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', '@media print': { display: 'none' } }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard/bookings')} variant="outlined">
          Back
        </Button>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<Download />} variant="outlined" onClick={handlePrint}>
            Download PDF
          </Button>
          <Button startIcon={<Print />} variant="contained" onClick={handlePrint}>
            Print Receipt
          </Button>
        </Stack>
      </Box>

      {/* Receipt Paper */}
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 800,
          mx: 'auto',
          borderRadius: 2,
          '@media print': {
            boxShadow: 'none',
            border: '1px solid #ddd',
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            padding: '20px'
          }
        }}
      >
        {/* Header */}
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {company.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {company.address} | {company.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {company.email}
            </Typography>
          </Grid>
          <Grid item textAlign="right">
            <Typography variant="h5" fontWeight="bold">PAYMENT RECEIPT</Typography>
            <Chip label={booking.status.toUpperCase()} color="success" sx={{ mt: 1 }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Receipt #:</strong> {payment.receiptNumber}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Customer & Booking Info */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              BILL TO
            </Typography>
            <Typography variant="body1" fontWeight="bold">{customer.name}</Typography>
            <Typography variant="body2">{customer.email}</Typography>
            <Typography variant="body2">{customer.phone}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              BOOKING DETAILS
            </Typography>
            <Typography variant="body1" fontWeight="bold">#{booking.number}</Typography>
            <Typography variant="body2">{booking.package}</Typography>
            <Typography variant="body2">{booking.destination} ({booking.duration})</Typography>
            <Typography variant="body2">
              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>

        {/* Passengers List */}
        {passengers.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              PASSENGERS
            </Typography>
            <Stack spacing={1}>
              {passengers.map((p, index) => (
                <Typography key={p.id} variant="body2">
                  {index + 1}. {p.name} {p.age ? `(${p.age} yrs)` : ''} {p.nationality}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Payment Summary Table */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            PAYMENT INFORMATION
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Method</Typography>
              <Typography variant="body1" textTransform="capitalize">{payment.method}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
              <Typography variant="body2" fontSize="0.8rem">{payment.transactionId}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Card / Phone</Typography>
              <Typography variant="body1">{payment.cardDetails || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} textAlign="right">
              <Typography variant="caption" color="text.secondary">Amount Paid</Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {payment.currency} {parseFloat(payment.amount).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px dashed #ccc', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Thank you for choosing {company.name}!
          </Typography>
          <Typography variant="caption" color="text.secondary">
            This is a computer-generated receipt and does not require a signature.
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Generated on {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Paper>

      {/* Print Specific Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .MuiPaper-root, .MuiPaper-root * {
            visibility: visible;
          }
          .MuiPaper-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </Box>
  );
}