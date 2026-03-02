// src/features/payments/components/PaymentModal.jsx
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './PaymentModal.css';

// Import from your payment slice
import {
  createMPESAPayment,
  createCardPayment,
  pollPaymentStatus,
  setShowModal,
  setSelectedMethod,
  clearError,
  clearSuccess,
  clearMPESATransaction,
  clearCardPayment,
  resetPaymentState,
  selectMPESATransaction,
  selectCardPayment,
  selectPaymentStatus,
  selectPaymentLoading,
  selectPaymentError,
  selectPaymentSuccess,
  selectIsPolling,
  selectPollAttempts,
  selectSelectedMethod,
  selectIsPaymentCompleted,
  selectIsPaymentFailed,
  selectIsProcessing,
} from '../features/payments/paymentSlice';

// Import sub-components
import CardPaymentForm from './CardPaymentForm';
import MpesaPaymentForm from './MpesaPaymentForm';
import PaymentStatus from './PaymentStatus';
import PaymentSuccess from './PaymentSuccess';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PaymentModal = ({ booking, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  // Select state
  const mpesaTransaction = useSelector(selectMPESATransaction);
  const cardPayment = useSelector(selectCardPayment);
  const paymentStatus = useSelector(selectPaymentStatus);
  const loading = useSelector(selectPaymentLoading);
  const error = useSelector(selectPaymentError);
  const successMessage = useSelector(selectPaymentSuccess);
  const isPolling = useSelector(selectIsPolling);
  const pollAttempts = useSelector(selectPollAttempts);
  const selectedMethod = useSelector(selectSelectedMethod);
  const isCompleted = useSelector(selectIsPaymentCompleted);
  const isFailed = useSelector(selectIsPaymentFailed);
  const isProcessing = useSelector(selectIsProcessing);

  // Local state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Format phone number
  const handlePhoneChange = useCallback((e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.startsWith('0') && value.length === 10) {
      value = '254' + value.slice(1);
    } else if (value.length === 9 && !value.startsWith('254')) {
      value = '254' + value;
    } else if (value.length > 12) {
      value = value.slice(0, 12);
    }

    setPhoneNumber(value);
    setPhoneError('');
  }, []);

  // Validate phone
  const validatePhone = useCallback((phone) => {
    if (!phone) return 'Phone number is required';
    if (!/^254\d{9}$/.test(phone)) {
      return 'Enter a valid Kenyan number (e.g., 0712345678)';
    }
    return null;
  }, []);

  // Handle MPESA submit
  const handleMpesaSubmit = useCallback(async (e) => {
    e?.preventDefault();

    const validationError = validatePhone(phoneNumber);
    if (validationError) {
      setPhoneError(validationError);
      return;
    }

    const result = await dispatch(createMPESAPayment({
      booking_id: booking?.id,
      phone_number: phoneNumber,
      amount: booking?.total_amount,
      account_reference: booking?.booking_number || `TOUR_${Date.now()}`,
    }));

    if (createMPESAPayment.fulfilled.match(result)) {
      dispatch(setSelectedMethod('mpesa'));
    } else {
      setPhoneError(result.payload || 'Failed to initiate payment');
    }
  }, [dispatch, booking, phoneNumber, validatePhone]);

  // Handle card initiation
  const handleCardInitiate = useCallback(async () => {
    const result = await dispatch(createCardPayment({
      booking_id: booking?.id,
      amount: booking?.total_amount,
      currency: 'KES',
    }));

    if (createCardPayment.fulfilled.match(result)) {
      dispatch(setSelectedMethod('card'));
      return true;
    }
    return false;
  }, [dispatch, booking]);

  // Handle card success
  const handleCardSuccess = useCallback((paymentIntent) => {
    if (cardPayment?.paymentIntentId) {
      dispatch(pollPaymentStatus({ paymentIntentId: cardPayment.paymentIntentId }));
    }
  }, [dispatch, cardPayment]);

  // Polling effect
  useEffect(() => {
    if (isPolling && mpesaTransaction?.checkoutRequestId && paymentStatus === 'pending') {
      const interval = setInterval(() => {
        dispatch(pollPaymentStatus({
          checkoutRequestId: mpesaTransaction.checkoutRequestId
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isPolling, mpesaTransaction?.checkoutRequestId, paymentStatus, dispatch]);

  // Auto-close on completion
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        dispatch(setShowModal(false));
        dispatch(resetPaymentState());
        onSuccess?.(booking);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, dispatch, onSuccess, booking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  // Handle close
  const handleClose = useCallback(() => {
    dispatch(setShowModal(false));
    dispatch(resetPaymentState());
    setPhoneNumber('');
    setPhoneError('');
    onCancel?.();
  }, [dispatch, onCancel]);

  // Handle method selection
  const handleMethodSelect = useCallback((method) => {
    dispatch(setSelectedMethod(method));
    dispatch(clearError());
    setPhoneError('');
  }, [dispatch]);

  // Don't render if no booking
  if (!booking) return null;

  return (
    <>
      {/* Overlay/Backdrop */}
      <div
        className="payment-modal-overlay"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      />

      {/* Modal Container */}
      <div className="payment-modal-container">
        {/* Modal Content */}
        <div className="payment-modal-content">

          {/* Header */}
          <div className="payment-modal-header">
            <div>
              <h3>Complete Payment</h3>
              <p>Booking: {booking?.booking_number}</p>
            </div>
            <button
              onClick={handleClose}
              className="payment-modal-close"
              aria-label="Close payment modal"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="payment-modal-body">

            {/* Amount Display */}
            <div className="payment-amount-display">
              <p className="payment-amount-label">Total Amount</p>
              <p className="payment-amount-value">
                KES {booking?.total_amount?.toLocaleString()}
              </p>
            </div>

            {successMessage && (
              <div className="payment-message payment-message-success">
                <div className="message-icon">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="message-text">{successMessage}</span>
                <button
                  type="button"
                  onClick={() => dispatch(clearSuccess())}
                  className="message-close"
                  aria-label="Dismiss message"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}


            {/* Error Message */}
            {/* {error && (
              <div className="payment-message payment-message-error">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {typeof error === 'object' ? error.message : error}
                <button onClick={() => dispatch(clearError())}>✕</button>
              </div>
            )} */}

            {/* Error Message */}
            {error && (
              <div className="payment-message payment-message-error">
                <div className="message-icon error-icon-bg">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="message-text">
                  {typeof error === 'object' ? error.message : error}
                </span>
                <button
                  type="button"
                  onClick={() => dispatch(clearError())}
                  className="message-close"
                  aria-label="Dismiss error"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Payment Method Selection */}
            {!mpesaTransaction && !cardPayment && !isProcessing && (
              <div className="payment-method-selection">
                <h4>Select Payment Method</h4>
                <div className="payment-methods-grid">
                  <button
                    onClick={() => handleMethodSelect('mpesa')}
                    className={`payment-method-btn ${selectedMethod === 'mpesa' ? 'selected mpesa' : ''}`}
                  >
                    <span className="emoji">📱</span>
                    <span className="label">MPESA</span>
                    <span className="sublabel">STK Push</span>
                  </button>
                  <button
                    onClick={() => handleMethodSelect('card')}
                    className={`payment-method-btn ${selectedMethod === 'card' ? 'selected' : ''}`}
                  >
                    <span className="emoji">💳</span>
                    <span className="label">Card</span>
                    <span className="sublabel">Visa/Mastercard</span>
                  </button>
                </div>
              </div>
            )}

            {/* MPESA Form */}
            {selectedMethod === 'mpesa' && !mpesaTransaction && (
              <MpesaPaymentForm
                phoneNumber={phoneNumber}
                onPhoneChange={handlePhoneChange}
                phoneError={phoneError}
                onSubmit={handleMpesaSubmit}
                loading={loading}
                onCancel={handleClose}
              />
            )}

            {/* Card Form */}
            {selectedMethod === 'card' && cardPayment?.clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret: cardPayment.clientSecret }}>
                <CardPaymentForm
                  amount={booking?.total_amount}
                  paymentIntentId={cardPayment.paymentIntentId}
                  onInitiate={handleCardInitiate}
                  onSuccess={handleCardSuccess}
                  onCancel={() => {
                    dispatch(clearCardPayment());
                    dispatch(setSelectedMethod(null));
                  }}
                />
              </Elements>
            )}

            {/* Card Init Button */}
            {selectedMethod === 'card' && !cardPayment?.clientSecret && !loading && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <button
                  onClick={handleCardInitiate}
                  disabled={isProcessing}
                  className="payment-btn payment-btn-primary"
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner"></div>
                      Initializing...
                    </>
                  ) : (
                    <>
                      <span>💳</span>
                      Proceed to Card Payment
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Payment Status */}
            {(isPolling || paymentStatus === 'pending') && mpesaTransaction && (
              <PaymentStatus
                method="mpesa"
                status={paymentStatus}
                transactionData={mpesaTransaction}
                pollAttempts={pollAttempts}
                onCancel={handleClose}
              />
            )}

            {/* Card Processing */}
            {selectedMethod === 'card' && loading && paymentStatus === 'pending' && (
              <PaymentStatus
                method="card"
                status={paymentStatus}
                transactionData={cardPayment}
                onCancel={handleClose}
              />
            )}

            {/* Success */}
            {isCompleted && (
              <PaymentSuccess
                booking={booking}
                onClose={handleClose}
              />
            )}

            {paymentStatus === 'pending' && !isCompleted && (
              <div className="modal-cancel-section">
                <button
                  type="button"
                  onClick={handleClose}
                  className="cancel-payment-link"
                >
                  <svg className="cancel-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Payment
                </button>

                {/* Warning Note - Only shows for MPESA */}
                {selectedMethod === 'mpesa' && (
                  <p className="cancel-note">
                    Closing this window will not stop the prompt on your phone.
                  </p>
                )}

                {/* Optional: Different note for Card if needed */}
                {selectedMethod === 'card' && (
                  <p className="cancel-note">
                    You can safely close this window. You won't be charged unless you confirmed in Stripe.
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="payment-modal-footer">
            <p>🔒 Secured by MPESA & Stripe • 256-bit encryption</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;