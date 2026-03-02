// import { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useParams } from 'react-router-dom'
// import { fetchBookingById } from '../../features/bookings/bookingSlice'
// import { Link } from 'react-router-dom'
// import Spinner from '../../components/Spinner'

// export default function BookingConfirmation() {
//   const { bookingId } = useParams()
//   const dispatch = useDispatch()
  
//   const { selectedBooking, loading } = useSelector(state => state.bookings)

//   useEffect(() => {
//     if (!selectedBooking || selectedBooking.id !== bookingId) {
//       dispatch(fetchBookingById(bookingId))
//     }
//   }, [dispatch, bookingId, selectedBooking])

//   if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
//   if (!selectedBooking) return <div className="min-h-screen flex items-center justify-center">Booking not found</div>

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-xl shadow-card p-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Booking Confirmation</h2>
          
//           <div className="space-y-6">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Information</h3>
//               <p className="text-blue-700">
//                 Your booking is currently pending payment confirmation. 
//                 Please complete your payment to secure your reservation.
//               </p>
//             </div>
            
//             <div className="bg-gray-50 rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Booking Number:</span>
//                   <span className="font-medium">{selectedBooking.booking_number}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Tour Package:</span>
//                   <span className="font-medium">{selectedBooking.TourPackage?.title}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Destination:</span>
//                   <span className="font-medium">{selectedBooking.TourPackage?.destination}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Travel Dates:</span>
//                   <span className="font-medium">{selectedBooking.start_date} to {selectedBooking.end_date}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Total Amount:</span>
//                   <span className="font-medium">KES {selectedBooking.total_amount.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Status:</span>
//                   <span className="font-medium capitalize">{selectedBooking.status}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="text-center">
//               <Link
//                 to={`/tours/${selectedBooking.package_id}/book`}
//                 className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
//               >
//                 Complete Payment
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



// src/pages/BookingConfirmation.jsx
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBookingById } from '../../features/bookings/bookingSlice';
import { 
  // Payment slice imports (from your enhanced slice)
  setShowModal,
  setSelectedMethod,
  resetPaymentState,
  selectPaymentStatus,
  selectIsPaymentCompleted,
  selectIsPaymentFailed,
  selectPaymentError,
} from '../../features/payments/paymentSlice';
import Spinner from '../../components/Spinner';
import PaymentModal from '../../components/PaymentModal';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Booking state
  const { selectedBooking, loading: bookingLoading } = useSelector(state => state.bookings);
  
  // Payment state
  const paymentStatus = useSelector(selectPaymentStatus);
  const isPaymentCompleted = useSelector(selectIsPaymentCompleted);
  const isPaymentFailed = useSelector(selectIsPaymentFailed);
  const paymentError = useSelector(selectPaymentError);
  
  // Local UI state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Fetch booking on mount or ID change
  useEffect(() => {
    if (bookingId && (!selectedBooking || selectedBooking.id !== bookingId)) {
      dispatch(fetchBookingById(bookingId));
    }
  }, [dispatch, bookingId, selectedBooking]);

  // Handle payment completion - auto redirect to receipt
  useEffect(() => {
    if (isPaymentCompleted && selectedBooking) {
      const timer = setTimeout(() => {
        // Navigate to receipt/success page with payment data
        navigate(`/bookings/${bookingId}/receipt`, { 
          state: { paymentCompleted: true }
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPaymentCompleted, navigate, bookingId, selectedBooking]);

  // Handle payment failure - show error
  useEffect(() => {
    if (isPaymentFailed) {
      setLocalError(paymentError || 'Payment failed. Please try again.');
      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        setLocalError(null);
        dispatch(resetPaymentState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPaymentFailed, paymentError, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  // Open payment modal handler
  const handleOpenPayment = useCallback((method = null) => {
    if (!selectedBooking) {
      setLocalError('Booking details not loaded. Please refresh.');
      return;
    }
    
    // Prevent payment if already paid
    if (selectedBooking.payment_status === 'paid') {
      setLocalError('This booking has already been paid.');
      return;
    }
    
    dispatch(setShowModal(true));
    if (method) {
      dispatch(setSelectedMethod(method));
    }
    setShowPaymentModal(true);
  }, [dispatch, selectedBooking]);

  // Handle payment success callback from modal
  const handlePaymentSuccess = useCallback(() => {
    // Modal handles redirect via useEffect above
    setShowPaymentModal(false);
  }, []);

  // Handle payment cancel
  const handlePaymentCancel = useCallback(() => {
    setShowPaymentModal(false);
    dispatch(resetPaymentState());
  }, [dispatch]);

  // Loading state
  if (bookingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // Booking not found
  if (!selectedBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking Not Found</h2>
          <Link to="/bookings" className="text-blue-600 hover:underline">
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  // Already paid - show success state
  if (selectedBooking.payment_status === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed! 🎉</h2>
            <p className="text-gray-600 mb-6">Your booking is secured. Check your email for details.</p>
            <div className="flex gap-3 justify-center">
              <Link
                to={`/bookings/${bookingId}/receipt`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                View Receipt
              </Link>
              <Link
                to="/bookings"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
              >
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Complete Your Payment</h2>
          
          {/* Error Alert */}
          {(localError || paymentError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Payment Error</p>
                <p>{localError || paymentError}</p>
              </div>
              <button 
                onClick={() => { setLocalError(null); }}
                className="ml-auto text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* Important Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Payment Required</h3>
            <p className="text-blue-700">
              Your booking is pending payment. Complete your payment now to secure your reservation.
            </p>
          </div>
          
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Number:</span>
                <span className="font-medium font-mono">{selectedBooking.booking_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tour Package:</span>
                <span className="font-medium">{selectedBooking.TourPackage?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destination:</span>
                <span className="font-medium">{selectedBooking.TourPackage?.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travel Dates:</span>
                <span className="font-medium">
                  {new Date(selectedBooking.start_date).toLocaleDateString()} to {new Date(selectedBooking.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-900 font-semibold">Total Amount:</span>
                <span className="font-bold text-blue-600 text-lg">
                  KES {selectedBooking.total_amount?.toLocaleString('en-KE')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium capitalize px-2 py-1 rounded text-xs ${
                  selectedBooking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                  selectedBooking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedBooking.payment_status}
                </span>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">Choose Payment Method</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* MPESA Option */}
              <button
                onClick={() => handleOpenPayment('mpesa')}
                disabled={bookingLoading}
                className="p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left group disabled:opacity-50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform">📱</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">MPESA STK Push</h4>
                    <p className="text-sm text-gray-500">Instant & Secure</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Receive a prompt on your phone. Enter PIN to pay instantly.
                </p>
              </button>
              
              {/* Card Option */}
              <button
                onClick={() => handleOpenPayment('card')}
                disabled={bookingLoading}
                className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group disabled:opacity-50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform">💳</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Credit/Debit Card</h4>
                    <p className="text-sm text-gray-500">Visa • Mastercard • Amex</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Pay securely with your card via Stripe encryption.
                </p>
              </button>
            </div>
          </div>
          
          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              🔒 All payments are secured with 256-bit encryption
            </p>
          </div>
        </div>
        
        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble?{' '}
            <Link to="/support" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>

      {/* Payment Modal - Integrated with Redux state */}
      {showPaymentModal && selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
}