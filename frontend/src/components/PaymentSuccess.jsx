// src/features/payments/components/PaymentSuccess.jsx
import './PaymentSuccess.css';

const PaymentSuccess = ({ booking, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="payment-success-container">
      {/* Animated Success Icon */}
      <div className="success-icon-wrapper">
        <div className="success-icon-bg"></div>
        <div className="success-icon-circle">
          <svg className="success-checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Success Message */}
      <h4 className="success-title">Payment Successful! 🎉</h4>
      <p className="success-description">
        Your booking has been confirmed. A confirmation email has been sent to your registered address.
      </p>

      {/* Receipt Summary Card */}
      <div className="receipt-card">
        <div className="receipt-header">
          <span className="receipt-label">Booking Reference</span>
          <span className="receipt-value reference-font">{booking?.booking_number}</span>
        </div>
        
        <div className="receipt-divider"></div>

        <div className="receipt-row">
          <span className="receipt-label">Amount Paid</span>
          <span className="receipt-value amount-positive">
            KES {booking?.total_amount?.toLocaleString('en-KE')}
          </span>
        </div>

        <div className="receipt-row">
          <span className="receipt-label">Completed At</span>
          <span className="receipt-value">{formatDate(new Date())}</span>
        </div>
        
        {booking?.TourPackage?.title && (
          <>
            <div className="receipt-divider"></div>
            <div className="receipt-row full-width">
              <span className="receipt-label">Package</span>
              <span className="receipt-value text-normal">{booking.TourPackage.title}</span>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          onClick={onClose}
          className="btn btn-primary"
        >
          View My Bookings
        </button>
        
        <button
          onClick={handlePrint}
          className="btn btn-secondary"
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Receipt
        </button>
      </div>
      
      {/* Hidden print-only message */}
      <div className="print-footer">
        <p>Thank you for choosing Sharavista Tours & Travel!</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;