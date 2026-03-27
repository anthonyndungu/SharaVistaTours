import { useState, useCallback, useMemo } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CardPaymentForm.css';

const CardPaymentForm = ({ 
  amount, 
  paymentIntentId, 
  onInitiate, 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system not ready. Please refresh the page.');
      return;
    }

    if (!cardComplete) {
      setError('Please enter complete card details');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentId,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: 'Customer', 
            },
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
      console.error('Card confirmation error:', err);
    }
  }, [stripe, elements, cardComplete, paymentIntentId, onSuccess]);

  const cardElementOptions = useMemo(() => ({
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '::placeholder': { color: '#9ca3af' },
        lineHeight: '1.5',
      },
      invalid: { 
        color: '#dc2626', 
        iconColor: '#dc2626',
      },
    },
    hidePostalCode: true,
  }), []);

  return (
    <form onSubmit={handleSubmit} className="card-payment-form">
      
      {/* Card Input Section */}
      <div className="form-group">
        <label className="form-label">Card Details</label>
        <div className={`card-input-wrapper ${error ? 'has-error' : ''} ${cardComplete ? 'is-complete' : ''}`}>
          <CardElement 
            options={cardElementOptions} 
            onChange={(e) => {
              setError(null);
              setCardComplete(e.complete);
            }} 
          />
        </div>
        <div className="security-note">
          <span className="lock-icon">🔒</span>
          Secured by Stripe • We never store your card details
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="button-group">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="btn btn-cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing || !cardComplete}
          className="btn btn-pay"
        >
          {processing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span className="btn-icon">💳</span>
              Pay KES {amount?.toLocaleString()}
            </>
          )}
        </button>
      </div>

      {/* Accepted Cards Footer */}
      <div className="accepted-cards">
        <span className="label">We accept:</span>
        <div className="card-brands">
          <span className="brand visa">Visa</span>
          <span className="brand mastercard">Mastercard</span>
          <span className="brand amex">Amex</span>
        </div>
      </div>
    </form>
  );
};

export default CardPaymentForm;