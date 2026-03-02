import './PaymentStatus.css';

const PaymentStatus = ({ method, status, transactionData, pollAttempts, onCancel }) => {
  const isMpesa = method === 'mpesa';
  const maxAttempts = 60; // 5 minutes at 5s intervals
  const progress = Math.min((pollAttempts / maxAttempts) * 100, 100);
  const elapsedSeconds = pollAttempts * 5;

  return (
    <div className="payment-status-container">
      {/* Animated Status Icon */}
      <div className="status-icon-wrapper">
        <div className="status-icon-ring"></div>
        <div className="status-icon-circle">
          <span className="icon-emoji">{isMpesa ? '📱' : '💳'}</span>
        </div>
      </div>

      {/* Status Message */}
      <h4 className="status-title">
        {isMpesa ? 'Waiting for MPESA Confirmation' : 'Processing Payment'}
      </h4>
      
      <p className="status-description">
        {isMpesa 
          ? 'Check your phone for the MPESA prompt and enter your PIN to complete payment.'
          : 'Please wait while we securely process your card payment...'
        }
      </p>

      {/* Progress Bar (Only for MPESA polling) */}
      {isMpesa && pollAttempts > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Waiting for confirmation</span>
            <span className="progress-timer">{elapsedSeconds}s / 300s</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Transaction Reference */}
      {transactionData?.checkoutRequestId && (
        <div className="reference-box">
          <p className="reference-label">Transaction Reference ID</p>
          <p className="reference-value">{transactionData.checkoutRequestId}</p>
        </div>
      )}

      {/* Cancel Button */}
      {/* <button
        type="button"
        onClick={onCancel}
        className="cancel-button"
      >
        Cancel Payment
      </button> */}
    </div>
  );
};

export default PaymentStatus;