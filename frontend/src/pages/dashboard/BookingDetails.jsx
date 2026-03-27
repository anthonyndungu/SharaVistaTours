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

  //for c2b
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  
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