// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { fetchBookingById, cancelBooking } from '../../features/bookings/bookingSlice';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Chip,
//   Button,
//   CircularProgress,
//   Alert,
//   Divider,
//   Stack,
//   Paper,
//   Avatar
// } from '@mui/material';
// import {
//   ArrowBack as ArrowBackIcon,
//   CalendarToday as CalendarIcon,
//   LocationOn as LocationIcon,
//   Person as PersonIcon,
//   ConfirmationNumber as TicketIcon,
//   Payment as PaymentIcon,
//   Info as InfoIcon,
//   Cancel as CancelIcon,
//   Edit as EditIcon,
//   SupportAgent as SupportAgentIcon
// } from '@mui/icons-material';

// const COLORS = {
//   primary: '#1976d2',
//   success: '#2e7d32',
//   error: '#c62828',
//   warning: '#ed6c02',
//   info: '#0288d1',
//   background: '#f5f7fa'
// };

// // Helper to get booking status config
// const getBookingStatusConfig = (status) => {
//   switch (status) {
//     case 'confirmed': return { label: 'Confirmed', bg: '#e8f5e9', text: '#2e7d32' };
//     case 'completed': return { label: 'Completed', bg: '#e3f2fd', text: '#0277bd' };
//     case 'cancelled': return { label: 'Cancelled', bg: '#ffebee', text: '#c62828' };
//     case 'pending': default: return { label: 'Pending', bg: '#fff3e0', text: '#ef6c00' };
//   }
// };

// // Helper to get payment status config
// const getPaymentStatusConfig = (status) => {
//   if (status === 'paid') return { label: 'Paid', color: COLORS.success };
//   if (status === 'refunded') return { label: 'Refunded', color: COLORS.info };
//   return { label: status || 'Pending', color: COLORS.warning };
// };

// export default function BookingDetails() {
//   const { bookingId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const { selectedBooking, loading, error } = useSelector((state) => state.bookings);

//   useEffect(() => {
//     if (!selectedBooking || selectedBooking.id !== bookingId) {
//       dispatch(fetchBookingById(bookingId));
//     }
//   }, [dispatch, bookingId, selectedBooking]);

//   const handleCancelBooking = async () => {
//     if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
//       await dispatch(cancelBooking(bookingId));
//       // Refresh booking details
//       dispatch(fetchBookingById(bookingId));
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
//         <Alert severity="error">{error}</Alert>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard/bookings')} sx={{ mt: 2 }}>
//           Back to Bookings
//         </Button>
//       </Box>
//     );
//   }

//   if (!selectedBooking) {
//     return (
//       <Box sx={{ p: 3, textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
//         <Typography variant="h6">Booking not found</Typography>
//         <Button component={Link} to="/dashboard/bookings" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
//           Back to Bookings
//         </Button>
//       </Box>
//     );
//   }

//   const bookingStatus = getBookingStatusConfig(selectedBooking.status);
//   const paymentStatus = getPaymentStatusConfig(selectedBooking.payment_status);

//   return (
//     <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
//       {/* Back Button */}
//       <Button
//         component={Link}
//         to="/dashboard/bookings"
//         startIcon={<ArrowBackIcon />}
//         sx={{ mb: 3, color: COLORS.primary, fontWeight: 600, textTransform: 'none' }}
//       >
//         Back to My Bookings
//       </Button>

//       <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
//         {/* Header */}
//         <Box sx={{ 
//           p: { xs: 2, sm: 3 }, 
//           backgroundColor: '#fafafa', 
//           borderBottom: '1px solid #e0e0e0',
//           display: 'flex',
//           flexDirection: { xs: 'column', sm: 'row' },
//           justifyContent: 'space-between',
//           alignItems: { xs: 'flex-start', sm: 'center' },
//           gap: 2
//         }}>
//           <Box>
//             <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 0.5 }}>
//               Booking Details
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Reference: <strong>{selectedBooking.booking_number}</strong>
//             </Typography>
//           </Box>
//           <Chip
//             label={bookingStatus.label}
//             sx={{
//               backgroundColor: bookingStatus.bg,
//               color: bookingStatus.text,
//               fontWeight: 700,
//               fontSize: '0.875rem',
//               height: 32
//             }}
//           />
//         </Box>

//         <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          
//           {/* Tour Package Info */}
//           <Box sx={{ mb: 4 }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//               <TicketIcon color="primary" fontSize="small" /> Tour Package
//             </Typography>
//             <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '8px', backgroundColor: '#f9fafb' }}>
//               <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
//                 {selectedBooking.TourPackage?.title}
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 2 }}>
//                 <LocationIcon fontSize="small" />
//                 <Typography variant="body2">{selectedBooking.TourPackage?.destination}</Typography>
//               </Box>
//               <Stack direction="row" spacing={2}>
//                 <Chip 
//                   label={`${selectedBooking.TourPackage?.duration_days} Days`} 
//                   size="small" 
//                   variant="outlined" 
//                   sx={{ fontWeight: 600 }}
//                 />
//                 <Chip 
//                   label={selectedBooking.TourPackage?.category} 
//                   size="small" 
//                   variant="outlined" 
//                   sx={{ fontWeight: 600, textTransform: 'capitalize' }}
//                 />
//               </Stack>
//             </Paper>
//           </Box>

//           {/* Travel Dates */}
//           <Box sx={{ mb: 4 }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//               <CalendarIcon color="primary" fontSize="small" /> Travel Dates
//             </Typography>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f9fafb', height: '100%' }}>
//                   <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Start Date</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 600, color: '#000' }}>{selectedBooking.start_date}</Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f9fafb', height: '100%' }}>
//                   <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>End Date</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 600, color: '#000' }}>{selectedBooking.end_date}</Typography>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </Box>

//           {/* Passengers */}
//           <Box sx={{ mb: 4 }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//               <PersonIcon color="primary" fontSize="small" /> Passengers ({selectedBooking.BookingPassengers?.length || 0})
//             </Typography>
//             <Stack spacing={2}>
//               {selectedBooking.BookingPassengers?.map((passenger, index) => (
//                 <Paper key={passenger.id} variant="outlined" sx={{ p: 2, borderRadius: '8px', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <Avatar sx={{ bgcolor: COLORS.primary, width: 40, height: 40 }}>
//                       {passenger.name.charAt(0).toUpperCase()}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{passenger.name}</Typography>
//                       <Typography variant="body2" color="text.secondary">{passenger.email}</Typography>
//                       <Typography variant="body2" color="text.secondary">{passenger.phone}</Typography>
//                     </Box>
//                   </Box>
//                   <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
//                     <Typography variant="body2" sx={{ fontWeight: 600 }}>Age: {passenger.age}</Typography>
//                     {passenger.passport_number && (
//                       <Typography variant="caption" color="text.secondary">Passport: {passenger.passport_number}</Typography>
//                     )}
//                   </Box>
//                 </Paper>
//               ))}
//             </Stack>
//           </Box>

//           {/* Special Requests */}
//           {selectedBooking.special_requests && (
//             <Box sx={{ mb: 4 }}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <InfoIcon color="primary" fontSize="small" /> Special Requests
//               </Typography>
//               <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '8px', backgroundColor: '#fff8e1', borderColor: '#ffe082' }}>
//                 <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
//                   {selectedBooking.special_requests}
//                 </Typography>
//               </Paper>
//             </Box>
//           )}

//           <Divider sx={{ my: 4 }} />

//           {/* Payment Information */}
//           <Box sx={{ mb: 4 }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//               <PaymentIcon color="primary" fontSize="small" /> Payment Information
//             </Typography>
//             <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '8px', backgroundColor: '#f9fafb' }}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                     <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
//                     <Typography variant="body1" sx={{ fontWeight: 700, color: '#000' }}>
//                       KES {parseFloat(selectedBooking.total_amount).toLocaleString()}
//                     </Typography>
//                   </Box>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Typography variant="body2" color="text.secondary">Payment Status:</Typography>
//                     <Typography variant="body2" sx={{ fontWeight: 700, color: paymentStatus.color }}>
//                       {paymentStatus.label}
//                     </Typography>
//                   </Box>
//                 </Grid>
//                 {selectedBooking.Payment && (
//                   <>
//                     <Grid item xs={12} sm={6}>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <Typography variant="body2" color="text.secondary">Method:</Typography>
//                         <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
//                           {selectedBooking.Payment.payment_method}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     {selectedBooking.Payment.transaction_id && (
//                       <Grid item xs={12} sm={6}>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                           <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
//                           <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
//                             {selectedBooking.Payment.transaction_id}
//                           </Typography>
//                         </Box>
//                       </Grid>
//                     )}
//                   </>
//                 )}
//               </Grid>
//             </Paper>
//           </Box>

//           {/* Action Buttons */}
//           <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 4 }}>
//             {selectedBooking.status === 'pending' && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<CancelIcon />}
//                 onClick={handleCancelBooking}
//                 fullWidth
//                 sx={{ fontWeight: 600, borderColor: COLORS.error, color: COLORS.error, '&:hover': { borderColor: COLORS.error, backgroundColor: '#ffebee' } }}
//               >
//                 Cancel Booking
//               </Button>
//             )}
            
//             {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
//               <Button
//                 component={Link}
//                 to={`/tours/${selectedBooking.package_id}/book`}
//                 variant="contained"
//                 startIcon={<EditIcon />}
//                 fullWidth
//                 sx={{ fontWeight: 600, backgroundColor: COLORS.primary, '&:hover': { backgroundColor: '#1565c0' } }}
//               >
//                 Modify Booking
//               </Button>
//             )}
            
//             <Button
//               component={Link}
//               to="/contact"
//               variant="outlined"
//               startIcon={<SupportAgentIcon />}
//               fullWidth
//               sx={{ fontWeight: 600 }}
//             >
//               Contact Support
//             </Button>
//           </Box>

//         </CardContent>
//       </Card>
//     </Box>
//   );
// }




// src/pages/BookingDetails.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBookingById, cancelBooking } from '../../features/bookings/bookingSlice';
import PaymentModal from '../../components/PaymentModal';
import './BookingDetails.css';

// Icons (using simple SVGs to avoid external libraries)
const Icons = {
  Back: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Calendar: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Location: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  User: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Ticket: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  Info: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Card: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Check: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>,
};

export default function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedBooking, loading, error } = useSelector((state) => state.bookings);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!selectedBooking || selectedBooking.id !== bookingId) {
      dispatch(fetchBookingById(bookingId));
    }
  }, [dispatch, bookingId, selectedBooking]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      await dispatch(cancelBooking(bookingId));
      dispatch(fetchBookingById(bookingId));
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Refresh booking data to show updated payment status
    dispatch(fetchBookingById(bookingId));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-box">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard/bookings')} className="btn btn-secondary">
            <Icons.Back /> Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!selectedBooking) {
    return (
      <div className="error-container">
        <div className="error-box">
          <h3>Booking Not Found</h3>
          <p>We couldn't find the booking you're looking for.</p>
          <Link to="/dashboard/bookings" className="btn btn-secondary">
            <Icons.Back /> Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = selectedBooking.payment_status === 'paid';
  const isPending = selectedBooking.status === 'pending';

  return (
    <div className="booking-details-page">
      <div className="container">
        
        {/* Header */}
        <div className="page-header">
          <button onClick={() => navigate('/dashboard/bookings')} className="back-btn">
            <Icons.Back /> Back to My Bookings
          </button>
          
          <div className="status-badge-wrapper">
            <span className={`status-badge status-${selectedBooking.status}`}>
              {selectedBooking.status === 'confirmed' && <Icons.Check />}
              {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="details-grid">
          
          {/* Left Column: Details */}
          <div className="details-column">
            
            {/* Booking Reference Card */}
            <div className="card reference-card">
              <div className="card-header">
                <h2>Booking Details</h2>
                <span className="ref-number">{selectedBooking.booking_number}</span>
              </div>
            </div>

            {/* Tour Package */}
            <div className="card">
              <div className="card-header">
                <Icons.Ticket />
                <h3>Tour Package</h3>
              </div>
              <div className="card-content">
                <h4 className="package-title">{selectedBooking.TourPackage?.title}</h4>
                <div className="info-row">
                  <Icons.Location />
                  <span>{selectedBooking.TourPackage?.destination}</span>
                </div>
                <div className="tags">
                  <span className="tag">{selectedBooking.TourPackage?.duration_days} Days</span>
                  <span className="tag">{selectedBooking.TourPackage?.category}</span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="card">
              <div className="card-header">
                <Icons.Calendar />
                <h3>Travel Dates</h3>
              </div>
              <div className="card-content dates-grid">
                <div className="date-box">
                  <span className="label">Start Date</span>
                  <span className="value">{new Date(selectedBooking.start_date).toLocaleDateString()}</span>
                </div>
                <div className="date-box">
                  <span className="label">End Date</span>
                  <span className="value">{new Date(selectedBooking.end_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Passengers */}
            <div className="card">
              <div className="card-header">
                <Icons.User />
                <h3>Passengers ({selectedBooking.BookingPassengers?.length || 0})</h3>
              </div>
              <div className="card-content">
                <div className="passenger-list">
                  {selectedBooking.BookingPassengers?.map((passenger) => (
                    <div key={passenger.id} className="passenger-item">
                      <div className="passenger-avatar">
                        {passenger.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="passenger-info">
                        <div className="name">{passenger.name}</div>
                        <div className="details">{passenger.email} • {passenger.phone}</div>
                        <div className="details-small">Age: {passenger.age} {passenger.nationality && `• ${passenger.nationality}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {selectedBooking.special_requests && (
              <div className="card info-card">
                <div className="card-header">
                  <Icons.Info />
                  <h3>Special Requests</h3>
                </div>
                <div className="card-content">
                  <p className="special-request-text">{selectedBooking.special_requests}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Payment & Actions */}
          <div className="sidebar-column">
            
            {/* Payment Card */}
            <div className={`card payment-card ${!isPaid ? 'unpaid' : 'paid'}`}>
              <div className="card-header">
                <Icons.Card />
                <h3>Payment Summary</h3>
              </div>
              <div className="card-content">
                <div className="payment-row total">
                  <span>Total Amount</span>
                  <span className="amount">KES {parseFloat(selectedBooking.total_amount).toLocaleString()}</span>
                </div>
                
                <div className="payment-row">
                  <span>Status</span>
                  <span className={`status-text ${selectedBooking.payment_status}`}>
                    {selectedBooking.payment_status.toUpperCase()}
                  </span>
                </div>

                {selectedBooking.Payment && (
                  <>
                    <div className="payment-row">
                      <span>Method</span>
                      <span className="method">{selectedBooking.Payment.payment_method}</span>
                    </div>
                    {selectedBooking.Payment.transaction_id && (
                      <div className="payment-row small">
                        <span>Transaction ID</span>
                        <span className="tx-id">{selectedBooking.Payment.transaction_id}</span>
                      </div>
                    )}
                  </>
                )}

                {/* PAY NOW BUTTON (Only if unpaid) */}
                {!isPaid && (
                  <div className="payment-action">
                    <p className="action-text">Complete your payment to secure this booking.</p>
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="btn btn-primary btn-full"
                    >
                      Pay Now
                    </button>
                    <div className="payment-methods-hint">
                      <span>📱 MPESA</span>
                      <span>💳 Card</span>
                    </div>
                  </div>
                )}

                {isPaid && (
                  <div className="success-message">
                    <div className="check-icon">✓</div>
                    <p>Your booking is fully confirmed.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="actions-card">
              {isPending && !isPaid && (
                <button onClick={handleCancelBooking} className="btn btn-danger btn-full">
                  Cancel Booking
                </button>
              )}
              
              {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
                <Link to={`/tours/${selectedBooking.package_id}/book`} className="btn btn-secondary btn-full">
                  Modify Booking
                </Link>
              )}
              
              <Link to="/contact" className="btn btn-outline btn-full">
                Contact Support
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          booking={selectedBooking}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}