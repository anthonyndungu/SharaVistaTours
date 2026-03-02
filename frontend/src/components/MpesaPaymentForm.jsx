import './PaymentModal.css'; // Import the same CSS file

const MpesaPaymentForm = ({ 
  phoneNumber, 
  onPhoneChange, 
  phoneError, 
  onSubmit, 
  loading, 
  onCancel 
}) => {
  return (
    <form onSubmit={onSubmit} className="payment-form">
      <div className="form-group">
        <label htmlFor="mpesa-phone">MPESA Phone Number</label>
        <div style={{ position: 'relative' }}>
          <span style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#64748b',
            fontSize: '16px'
          }}>
            🇰🇪
          </span>
          <input
            id="mpesa-phone"
            type="tel"
            value={phoneNumber}
            onChange={onPhoneChange}
            placeholder="0712 345 678"
            className={phoneError ? 'error' : ''}
            style={{ paddingLeft: '40px' }}
            disabled={loading}
            pattern="^254[0-9]{9}$"
            required
          />
        </div>
        <p className="form-hint">Enter the phone number registered with MPESA</p>
        {phoneError && <p className="form-error">{phoneError}</p>}
      </div>

      <div className="payment-info-box">
        <span className="icon">ℹ️</span>
        <span>
          After clicking "Pay", you'll receive an MPESA prompt on your phone. 
          Enter your PIN to complete the payment.
        </span>
      </div>

      <div className="payment-button-group">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="payment-btn payment-btn-cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !phoneNumber || phoneNumber.length !== 12}
          className="payment-btn payment-btn-primary"
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Sending...
            </>
          ) : (
            <>
              <span className="button-icon">📱</span>
              Pay with MPESA
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default MpesaPaymentForm;