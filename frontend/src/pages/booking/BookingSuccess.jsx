import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBookingById } from '../../features/bookings/bookingSlice';
import { 
  setShowModal,
  setSelectedMethod,
  resetPaymentState,
  selectPaymentStatus,
  selectIsPaymentCompleted,
} from '../../features/payments/paymentSlice';
import PaymentModal from '../../components/PaymentModal';
import './BookingSuccess.css'; 

export default function BookingSuccess() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedBooking, loading } = useSelector(state => state.bookings);
  const isPaymentCompleted = useSelector(selectIsPaymentCompleted);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  //Fetch booking
  useEffect(() => {
    if (bookingId && (!selectedBooking || selectedBooking.id !== bookingId)) {
      dispatch(fetchBookingById(bookingId));
    }
  }, [dispatch, bookingId, selectedBooking]);

  //Redirect if payment just completed via modal
  useEffect(() => {
    if (isPaymentCompleted) {
      const timer = setTimeout(() => {
        navigate(`/dashboard/bookings/${bookingId}/receipt`, { state: { paymentCompleted: true } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPaymentCompleted, navigate, bookingId]);

  //Cleanup
  useEffect(() => {
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  //Open payment modal for STK Push
  const handleOpenSTKPush = useCallback(() => {
    if (!selectedBooking) return;
    
    // Check if already paid
    if (selectedBooking.payment_status === 'paid') {
      alert('This booking has already been paid.');
      return;
    }
    
    // Open modal via Redux
    dispatch(setShowModal(true));
    dispatch(setSelectedMethod('mpesa'));
    setShowPaymentModal(true);
  }, [dispatch, selectedBooking]);

  const handlePaymentSuccess = useCallback(() => {
    setShowPaymentModal(false);
  }, []);

  const handlePaymentCancel = useCallback(() => {
    setShowPaymentModal(false);
    dispatch(resetPaymentState());
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="single-product travel_tour-page travel_tour">
        <section className="content-area single-woo-tour">
          <div className="container">
            <div className="text-center" style={{ padding: '60px 20px' }}>
              <p>Loading booking confirmation...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Not found
  if (!selectedBooking) {
    return (
      <div className="single-product travel_tour-page travel_tour">
        <section className="content-area single-woo-tour">
          <div className="container">
            <div className="text-center" style={{ padding: '60px 20px' }}>
              <p>Booking not found</p>
              <Link to="/bookings" className="text-blue-600 hover:underline mt-2 inline-block">
                View My Bookings
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="single-product travel_tour-page travel_tour">
      <section className="content-area single-woo-tour">
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="item_content_tour">
                 
                {/* Success Header */}
                <div className="booking-success-header">
                  <div className="success-icon">
                    <i className="fa fa-check-circle"></i>
                  </div>
                  <h2 className="success-title">Booking Confirmed!</h2>
                  <p className="success-message">
                    Your booking has been successfully created. 
                    {selectedBooking.payment_status !== 'paid' 
                      ? ' Complete payment to secure your reservation.' 
                      : ' A confirmation email has been sent to you.'
                    }
                  </p>
                </div>

                {/* Booking Details */}
                <div className="booking-details-card">
                  <h3 className="card-title">Booking Details</h3>
                  
                  <div className="details-grid">
                    <div className="detail-item">
                      <p className="detail-label">Booking Number</p>
                      <p className="detail-value booking-number">{selectedBooking.booking_number}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Payment Status</p>
                      <p className={`detail-value status-${selectedBooking.payment_status}`}>
                        {selectedBooking.payment_status}
                      </p>
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <p className="detail-label">Tour Package</p>
                      <p className="detail-value">{selectedBooking.TourPackage?.title}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Destination</p>
                      <p className="detail-value">{selectedBooking.TourPackage?.destination}</p>
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <p className="detail-label">Travel Dates</p>
                      <p className="detail-value">
                        {new Date(selectedBooking.start_date).toLocaleDateString()} to {new Date(selectedBooking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Total Amount</p>
                      <p className="detail-value amount">
                        KES {selectedBooking.total_amount?.toLocaleString('en-KE')}
                      </p>
                    </div>
                  </div>

                  {/* Passengers */}
                  {selectedBooking.BookingPassengers?.length > 0 && (
                    <div className="passengers-section">
                      <p className="section-label">Passengers</p>
                      <div className="passengers-list">
                        {selectedBooking.BookingPassengers.map((passenger, idx) => (
                          <div key={idx} className="passenger-item">
                            <p className="passenger-name">
                              <strong>{passenger.name}</strong> {passenger.email && `(${passenger.email})`}
                            </p>
                            {passenger.phone && <p className="passenger-detail">Phone: {passenger.phone}</p>}
                            {passenger.age && <p className="passenger-detail">Age: {passenger.age}</p>}
                            {passenger.nationality && <p className="passenger-detail">Nationality: {passenger.nationality}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  {selectedBooking.special_requests && (
                    <div className="special-requests-section">
                      <p className="section-label">Special Requests</p>
                      <p className="special-requests-text">{selectedBooking.special_requests}</p>
                    </div>
                  )}
                </div>

                {/* Payment Section - Show based on payment status */}
                {selectedBooking.payment_status !== 'paid' ? (
                  <>
                    {/* Modern STK Push Option */}
                    <div className="stk-push-card">
                      <h3 className="stk-push-title">
                        <span className="icon">⚡</span>
                        Pay Instantly with MPESA STK Push
                      </h3>
                      
                      <p className="stk-push-description">
                        Skip the manual steps! We'll send a secure payment prompt directly to your phone. 
                        Just enter your MPESA PIN to complete payment instantly.
                      </p>
                      
                      {/* ✅ BUTTON TO OPEN PAYMENT MODAL */}
                      <button
                        onClick={handleOpenSTKPush}
                        className="stk-push-button"
                      >
                        <span className="button-icon">📱</span>
                        Pay with MPESA STK Push
                      </button>
                      
                      <p className="stk-push-benefits">
                        ✓ No till number needed • ✓ Instant confirmation • ✓ Secure & encrypted
                      </p>
                    </div>

                    {/* Manual MPESA Instructions (Collapsible) */}
                    <details className="manual-payment-details">
                      <summary className="manual-payment-summary">
                        <span className="icon">📋</span>
                        Prefer to pay manually? Show MPESA Till instructions
                      </summary>
                      
                      <div className="manual-payment-content">
                        <h4 className="manual-title">
                          <i className="fa fa-mobile"></i>
                          Manual MPESA Payment Instructions
                        </h4>
                        
                        <div className="payment-details-box">
                          <div className="payment-detail-row">
                            <span className="detail-label">Till Number:</span>
                            <span className="detail-value">7915503</span>
                          </div>
                          <div className="payment-detail-row">
                            <span className="detail-label">Amount to Send:</span>
                            <span className="detail-value amount">
                              KES {selectedBooking.total_amount?.toLocaleString('en-KE')}
                            </span>
                          </div>
                          <div className="payment-detail-row">
                            <span className="detail-label">Account Reference:</span>
                            <span className="detail-value reference">{selectedBooking.booking_number}</span>
                          </div>
                        </div>

                        <div className="payment-steps">
                          <p className="steps-title">Steps:</p>
                          <ol className="steps-list">
                            <li>Open M-Pesa app → <strong>"Lipa Na M-Pesa"</strong></li>
                            <li>Select <strong>"Pay Bill"</strong></li>
                            <li>Enter Till Number: <strong>7915503</strong></li>
                            <li>Enter Amount: <strong>KES {selectedBooking.total_amount?.toLocaleString('en-KE')}</strong></li>
                            <li>Enter Account Reference: <strong>{selectedBooking.booking_number}</strong></li>
                            <li>Enter your M-Pesa PIN to confirm</li>
                            <li>Payment will be verified automatically within 2-5 minutes</li>
                          </ol>
                        </div>

                        <div className="payment-warning">
                          <p>
                            <strong>⚠️ Important:</strong> Always include your booking number <strong>{selectedBooking.booking_number}</strong> as the account reference. 
                            Payments without the correct reference may experience delays.
                          </p>
                        </div>
                      </div>
                    </details>

                    {/* Next Steps */}
                    <div className="next-steps-card">
                      <p>
                        <strong>✓ After Payment:</strong> Once payment is received, you'll receive a confirmation email with your e-ticket and full itinerary. 
                        You can also check your booking status anytime in your dashboard.
                      </p>
                    </div>
                  </>
                ) : (
                  /* Already Paid */
                  <div className="payment-received-card">
                    <i className="fa fa-check-circle payment-received-icon"></i>
                    <h3 className="payment-received-title">Payment Received! ✓</h3>
                    <p className="payment-received-message">
                      Your booking is fully confirmed. Check your email for your e-ticket and itinerary.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                  <Link
                    to={`/dashboard/bookings/${bookingId}/receipt`}
                    className="btn btn-primary"
                  >
                    {selectedBooking.payment_status === 'paid' ? 'View Receipt' : 'View Booking Details'}
                  </Link>
                  <Link
                    to="/tours"
                    className="btn btn-secondary"
                  >
                    Browse More Tours
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Payment Modal - Opens when STK Push button is clicked */}
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