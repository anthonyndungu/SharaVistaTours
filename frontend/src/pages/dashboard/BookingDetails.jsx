// import { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
// import { fetchBookingById } from '../../features/bookings/bookingSlice'
// import { cancelBooking } from '../../features/bookings/bookingSlice'
// import { Link } from 'react-router-dom'
// import { ArrowLeftIcon } from '@heroicons/react/24/outline'
// import Spinner from '../../components/Spinner'

// export default function BookingDetails() {
//   const { bookingId } = useParams()
//   const dispatch = useDispatch()
  
//   const { selectedBooking, loading, error } = useSelector(state => state.bookings)

//   useEffect(() => {
//     if (!selectedBooking || selectedBooking.id !== bookingId) {
//       dispatch(fetchBookingById(bookingId))
//     }
//   }, [dispatch, bookingId, selectedBooking])

//   const handleCancelBooking = async () => {
//     if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
//       await dispatch(cancelBooking(bookingId))
//       // Refresh booking details
//       dispatch(fetchBookingById(bookingId))
//     }
//   }

//   if (loading) return <div className="py-12"><Spinner /></div>
//   if (error) return <div className="py-12 text-red-500 text-center">{error}</div>
//   if (!selectedBooking) return <div className="py-12 text-center">Booking not found</div>

//   return (
//     <div className="py-8">
//       <div className="mb-6">
//         <Link
//           to="/dashboard/bookings"
//           className="inline-flex items-center text-primary-600 hover:text-primary-700"
//         >
//           <ArrowLeftIcon className="h-4 w-4 mr-1" />
//           Back to My Bookings
//         </Link>
//       </div>

//       <div className="bg-white rounded-xl shadow-card overflow-hidden">
//         {/* Booking Header */}
//         <div className="bg-gray-50 px-6 py-4 border-b">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
//               <p className="text-gray-600 mt-1">Booking #{selectedBooking.booking_number}</p>
//             </div>
//             <div className="mt-4 sm:mt-0">
//               <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
//                 selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                 selectedBooking.status === 'completed' ? 'bg-purple-100 text-purple-800' :
//                 selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                 'bg-yellow-100 text-yellow-800'
//               }`}>
//                 {selectedBooking.status.toUpperCase()}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           {/* Tour Package Info */}
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Tour Package</h2>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h3 className="text-lg font-medium text-gray-900">{selectedBooking.TourPackage?.title}</h3>
//               <p className="text-gray-600">{selectedBooking.TourPackage?.destination}</p>
//               <div className="mt-2 flex items-center">
//                 <span className="text-sm text-gray-500 mr-4">
//                   {selectedBooking.TourPackage?.duration_days} days
//                 </span>
//                 <span className="text-sm text-gray-500">
//                   {selectedBooking.TourPackage?.category}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Travel Dates */}
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Travel Dates</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-sm text-gray-500">Start Date</p>
//                 <p className="text-lg font-medium text-gray-900">{selectedBooking.start_date}</p>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-sm text-gray-500">End Date</p>
//                 <p className="text-lg font-medium text-gray-900">{selectedBooking.end_date}</p>
//               </div>
//             </div>
//           </div>

//           {/* Passengers */}
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Passengers ({selectedBooking.BookingPassengers?.length || 0})</h2>
//             <div className="space-y-3">
//               {selectedBooking.BookingPassengers?.map((passenger, index) => (
//                 <div key={passenger.id} className="bg-gray-50 rounded-lg p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-medium text-gray-900">{passenger.name}</h3>
//                       <p className="text-sm text-gray-600">{passenger.email}</p>
//                       <p className="text-sm text-gray-600">{passenger.phone}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm text-gray-600">Age: {passenger.age}</p>
//                       {passenger.passport_number && (
//                         <p className="text-sm text-gray-600">Passport: {passenger.passport_number}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Special Requests */}
//           {selectedBooking.special_requests && (
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h2>
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-gray-600">{selectedBooking.special_requests}</p>
//               </div>
//             </div>
//           )}

//           {/* Payment Information */}
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-gray-600">Total Amount:</span>
//                 <span className="font-medium text-gray-900">KES {selectedBooking.total_amount.toLocaleString()}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Payment Status:</span>
//                 <span className={`font-medium ${
//                   selectedBooking.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
//                 }`}>
//                   {selectedBooking.payment_status.toUpperCase()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Payment Method */}
//           {selectedBooking.Payment && (
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Method:</span>
//                   <span className="font-medium text-gray-900 capitalize">{selectedBooking.Payment.payment_method}</span>
//                 </div>
//                 {selectedBooking.Payment.transaction_id && (
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-gray-600">Transaction ID:</span>
//                     <span className="font-medium text-gray-900">{selectedBooking.Payment.transaction_id}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
//             {selectedBooking.status === 'pending' && (
//               <button
//                 onClick={handleCancelBooking}
//                 className="flex-1 px-4 py-2 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
//               >
//                 Cancel Booking
//               </button>
//             )}
            
//             {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
//               <Link
//                 to={`/tours/${selectedBooking.package_id}/book`}
//                 className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-center"
//               >
//                 Modify Booking
//               </Link>
//             )}
            
//             <Link
//               to="/contact"
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
//             >
//               Contact Support
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBookingById, cancelBooking } from '../../features/bookings/bookingSlice';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Paper,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  ConfirmationNumber as TicketIcon,
  Payment as PaymentIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  SupportAgent as SupportAgentIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#ed6c02',
  info: '#0288d1',
  background: '#f5f7fa'
};

// Helper to get booking status config
const getBookingStatusConfig = (status) => {
  switch (status) {
    case 'confirmed': return { label: 'Confirmed', bg: '#e8f5e9', text: '#2e7d32' };
    case 'completed': return { label: 'Completed', bg: '#e3f2fd', text: '#0277bd' };
    case 'cancelled': return { label: 'Cancelled', bg: '#ffebee', text: '#c62828' };
    case 'pending': default: return { label: 'Pending', bg: '#fff3e0', text: '#ef6c00' };
  }
};

// Helper to get payment status config
const getPaymentStatusConfig = (status) => {
  if (status === 'paid') return { label: 'Paid', color: COLORS.success };
  if (status === 'refunded') return { label: 'Refunded', color: COLORS.info };
  return { label: status || 'Pending', color: COLORS.warning };
};

export default function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedBooking, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (!selectedBooking || selectedBooking.id !== bookingId) {
      dispatch(fetchBookingById(bookingId));
    }
  }, [dispatch, bookingId, selectedBooking]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      await dispatch(cancelBooking(bookingId));
      // Refresh booking details
      dispatch(fetchBookingById(bookingId));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard/bookings')} sx={{ mt: 2 }}>
          Back to Bookings
        </Button>
      </Box>
    );
  }

  if (!selectedBooking) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h6">Booking not found</Typography>
        <Button component={Link} to="/dashboard/bookings" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to Bookings
        </Button>
      </Box>
    );
  }

  const bookingStatus = getBookingStatusConfig(selectedBooking.status);
  const paymentStatus = getPaymentStatusConfig(selectedBooking.payment_status);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* Back Button */}
      <Button
        component={Link}
        to="/dashboard/bookings"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: COLORS.primary, fontWeight: 600, textTransform: 'none' }}
      >
        Back to My Bookings
      </Button>

      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          backgroundColor: '#fafafa', 
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 0.5 }}>
              Booking Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reference: <strong>{selectedBooking.booking_number}</strong>
            </Typography>
          </Box>
          <Chip
            label={bookingStatus.label}
            sx={{
              backgroundColor: bookingStatus.bg,
              color: bookingStatus.text,
              fontWeight: 700,
              fontSize: '0.875rem',
              height: 32
            }}
          />
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          
          {/* Tour Package Info */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TicketIcon color="primary" fontSize="small" /> Tour Package
            </Typography>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '8px', backgroundColor: '#f9fafb' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedBooking.TourPackage?.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 2 }}>
                <LocationIcon fontSize="small" />
                <Typography variant="body2">{selectedBooking.TourPackage?.destination}</Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Chip 
                  label={`${selectedBooking.TourPackage?.duration_days} Days`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  label={selectedBooking.TourPackage?.category} 
                  size="small" 
                  variant="outlined" 
                  sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                />
              </Stack>
            </Paper>
          </Box>

          {/* Travel Dates */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="primary" fontSize="small" /> Travel Dates
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f9fafb', height: '100%' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Start Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#000' }}>{selectedBooking.start_date}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f9fafb', height: '100%' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>End Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#000' }}>{selectedBooking.end_date}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Passengers */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" fontSize="small" /> Passengers ({selectedBooking.BookingPassengers?.length || 0})
            </Typography>
            <Stack spacing={2}>
              {selectedBooking.BookingPassengers?.map((passenger, index) => (
                <Paper key={passenger.id} variant="outlined" sx={{ p: 2, borderRadius: '8px', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: COLORS.primary, width: 40, height: 40 }}>
                      {passenger.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{passenger.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{passenger.email}</Typography>
                      <Typography variant="body2" color="text.secondary">{passenger.phone}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Age: {passenger.age}</Typography>
                    {passenger.passport_number && (
                      <Typography variant="caption" color="text.secondary">Passport: {passenger.passport_number}</Typography>
                    )}
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>

          {/* Special Requests */}
          {selectedBooking.special_requests && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="primary" fontSize="small" /> Special Requests
              </Typography>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '8px', backgroundColor: '#fff8e1', borderColor: '#ffe082' }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
                  {selectedBooking.special_requests}
                </Typography>
              </Paper>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Payment Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon color="primary" fontSize="small" /> Payment Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '8px', backgroundColor: '#f9fafb' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#000' }}>
                      KES {parseFloat(selectedBooking.total_amount).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Payment Status:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: paymentStatus.color }}>
                      {paymentStatus.label}
                    </Typography>
                  </Box>
                </Grid>
                {selectedBooking.Payment && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Method:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {selectedBooking.Payment.payment_method}
                        </Typography>
                      </Box>
                    </Grid>
                    {selectedBooking.Payment.transaction_id && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                            {selectedBooking.Payment.transaction_id}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Paper>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 4 }}>
            {selectedBooking.status === 'pending' && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleCancelBooking}
                fullWidth
                sx={{ fontWeight: 600, borderColor: COLORS.error, color: COLORS.error, '&:hover': { borderColor: COLORS.error, backgroundColor: '#ffebee' } }}
              >
                Cancel Booking
              </Button>
            )}
            
            {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
              <Button
                component={Link}
                to={`/tours/${selectedBooking.package_id}/book`}
                variant="contained"
                startIcon={<EditIcon />}
                fullWidth
                sx={{ fontWeight: 600, backgroundColor: COLORS.primary, '&:hover': { backgroundColor: '#1565c0' } }}
              >
                Modify Booking
              </Button>
            )}
            
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              startIcon={<SupportAgentIcon />}
              fullWidth
              sx={{ fontWeight: 600 }}
            >
              Contact Support
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}