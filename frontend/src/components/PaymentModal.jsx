import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './PaymentModal.css';

// ✅ UPDATED: Import C2B actions and selectors from paymentSlice
import {
  createMPESAPayment,
  createCardPayment,
  createC2BPayment, // 🆕 NEW: C2B action
  pollPaymentStatus,
  setShowModal,
  setSelectedMethod,
  clearError,
  clearSuccess,
  clearMPESATransaction,
  clearC2BTransaction, // 🆕 NEW: Clear C2B state
  clearCardPayment,
  resetPaymentState,
  selectMPESATransaction,
  selectCardPayment,
  selectC2BTransaction, // 🆕 NEW: C2B selector
  selectIsC2BInitiated, // 🆕 NEW: C2B initiated flag
  selectC2BExpiresAt,   // 🆕 NEW: C2B expiry timestamp
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
  
  // 🆕 C2B state from Redux
  const c2bTransaction = useSelector(selectC2BTransaction);
  const isC2BInitiated = useSelector(selectIsC2BInitiated);
  const c2bExpiresAt = useSelector(selectC2BExpiresAt);
  
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
  
  // 🆕 C2B timer state (local, since it's UI-only countdown)
  const [c2bTimeLeft, setC2bTimeLeft] = useState(900);

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

  // Handle MPESA STK Push submit
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

  // ✅ UPDATED: Handle C2B Initiation using Redux thunk
  const handleC2BInitiate = useCallback(async () => {
    const validationError = validatePhone(phoneNumber);
    if (validationError) {
      setPhoneError(validationError);
      return;
    }

    // Dispatch the C2B payment action
    const result = await dispatch(createC2BPayment({
      booking_id: booking?.id,
      phone_number: phoneNumber,
      amount: booking?.total_amount,
    }));

    if (createC2BPayment.fulfilled.match(result)) {
      // Success: Redux state updated with c2bTransaction
      dispatch(setSelectedMethod('c2b'));
      // Reset local timer when new instructions received
      setC2bTimeLeft(900);
    } else {
      // Error: show via phoneError field
      setPhoneError(result.payload || 'Failed to generate C2B instructions');
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

  // ✅ UPDATED: C2B Polling & Timer Effect using Redux state
  useEffect(() => {
    let pollInterval;
    let timerInterval;

    // Use Redux state: selectedMethod === 'c2b' && isC2BInitiated && c2bTransaction
    if (selectedMethod === 'c2b' && isC2BInitiated && c2bTransaction && !isCompleted && !isFailed) {
      
      // 1. Countdown Timer (local UI state)
      timerInterval = setInterval(() => {
        setC2bTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Poll for Status using Redux thunk + bookingId for C2B
      pollInterval = setInterval(() => {
        dispatch(pollPaymentStatus({
          bookingId: booking?.id, // 🔧 Required for C2B polling
          checkoutRequestId: selectedMethod === 'mpesa' ? mpesaTransaction?.checkoutRequestId : undefined,
          paymentIntentId: selectedMethod === 'card' ? cardPayment?.paymentIntentId : undefined,
        }));
      }, 5000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [
    selectedMethod, 
    isC2BInitiated, 
    c2bTransaction, 
    isCompleted, 
    isFailed, 
    booking?.id,
    dispatch,
    mpesaTransaction?.checkoutRequestId,
    cardPayment?.paymentIntentId
  ]);

  // Existing Polling effect for STK
  useEffect(() => {
    if (isPolling && mpesaTransaction?.checkoutRequestId && paymentStatus === 'pending') {
      const interval = setInterval(() => {
        dispatch(pollPaymentStatus({
          checkoutRequestId: mpesaTransaction.checkoutRequestId
        }));
      }, 15000);
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
    // 🆕 Clear C2B state explicitly
    dispatch(clearC2BTransaction());
    setPhoneNumber('');
    setPhoneError('');
    onCancel?.();
  }, [dispatch, onCancel]);

  // Handle method selection
  const handleMethodSelect = useCallback((method) => {
    dispatch(setSelectedMethod(method));
    dispatch(clearError());
    setPhoneError('');
    // 🆕 Clear C2B state when switching away from c2b
    if (method !== 'c2b') {
      dispatch(clearC2BTransaction());
    }
  }, [dispatch]);

  // Helper: Format Time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper: Copy to Clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Use snackbar instead of alert
    // dispatch(setSuccessMessage('Copied to clipboard!'));
  };

  // 🆕 Helper: Get C2B display data from Redux state
  const getC2BDisplayData = useCallback(() => {
    if (!c2bTransaction) return null;
    return {
      type: c2bTransaction.type, // 'PayBill' or 'Till'
      shortcode: c2bTransaction.shortcode,
      accountRef: c2bTransaction.accountRef,
      amount: c2bTransaction.amount,
      expiresAt: c2bTransaction.expiresAt,
    };
  }, [c2bTransaction]);

  if (!booking) return null;

  // 🆕 Get C2B data for rendering
  const c2bData = getC2BDisplayData();

  return (
    <>
      <div className="payment-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()} />
      <div className="payment-modal-container">
        <div className="payment-modal-content">

          {/* Header */}
          <div className="payment-modal-header">
            <div>
              <h3>Complete Payment</h3>
              <p>Booking: {booking?.booking_number}</p>
            </div>
            <button onClick={handleClose} className="payment-modal-close" aria-label="Close">
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
              <p className="payment-amount-value">KES {booking?.total_amount?.toLocaleString()}</p>
            </div>

            {successMessage && (
              <div className="payment-message payment-message-success">
                <span className="message-text">{successMessage}</span>
                <button onClick={() => dispatch(clearSuccess())} className="message-close">×</button>
              </div>
            )}

            {error && (
              <div className="payment-message payment-message-error">
                <span className="message-text">{typeof error === 'object' ? error.message : error}</span>
                <button onClick={() => dispatch(clearError())} className="message-close">×</button>
              </div>
            )}

            {/* --- METHOD SELECTION GRID --- */}
            {!mpesaTransaction && !cardPayment && !isProcessing && !isC2BInitiated && (
              <div className="payment-method-selection">
                <h4>Select Payment Method</h4>
                <div className="payment-methods-grid">
                  {/* STK Push */}
                  <button
                    onClick={() => handleMethodSelect('mpesa')}
                    className={`payment-method-btn ${selectedMethod === 'mpesa' ? 'selected mpesa' : ''}`}
                  >
                    <span className="emoji">📱</span>
                    <span className="label">MPESA</span>
                    <span className="sublabel">STK Push</span>
                  </button>
                  
                  {/* C2B */}
                  <button
                    onClick={() => handleMethodSelect('c2b')}
                    className={`payment-method-btn ${selectedMethod === 'c2b' ? 'selected c2b' : ''}`}
                  >
                    <span className="emoji">🏪</span>
                    <span className="label">PayBill / Till</span>
                    <span className="sublabel">Manual Payment</span>
                  </button>

                  {/* Card */}
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

            {/* --- MPESA FORM --- */}
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

            {/* --- C2B INSTRUCTIONS VIEW (Pre-Initiation) --- */}
            {selectedMethod === 'c2b' && !isC2BInitiated && (
              <div className="c2b-init-section">
                <div className="info-box warning">
                  <p>📝 <strong>Manual Payment:</strong> You will receive instructions to pay via M-Pesa menu. Best if STK fails.</p>
                </div>
                <div className="form-group">
                  <label>M-Pesa Phone Number</label>
                  <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={handlePhoneChange} 
                    placeholder="2547XXXXXXXX"
                    className="input-field"
                  />
                  {phoneError && <span className="error-text">{phoneError}</span>}
                </div>
                <button
                  onClick={handleC2BInitiate}
                  disabled={loading || !phoneNumber}
                  className="payment-btn payment-btn-primary"
                >
                  {loading ? 'Generating...' : 'Get Payment Instructions'}
                </button>
              </div>
            )}

            {/* --- C2B DISPLAY INSTRUCTIONS (Post-Initiation) --- */}
            {selectedMethod === 'c2b' && isC2BInitiated && c2bData && (
              <div className="c2b-instructions-view">
                <div className="timer-badge">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Expires in: {formatTime(c2bTimeLeft)}
                </div>
                
                <div className="instruction-card">
                  <h4>1. Open M-Pesa Menu</h4>
                  <p>Select <strong>Lipa na M-Pesa</strong></p>
                </div>

                <div className="instruction-card highlight">
                  <h4>2. Select {c2bData.type}</h4>
                  <div className="copy-row">
                    <span>{c2bData.type === 'PayBill' ? 'Business No:' : 'Till Number:'}</span>
                    <strong>{c2bData.shortcode}</strong>
                    <button onClick={() => copyToClipboard(c2bData.shortcode)}>📋</button>
                  </div>
                  
                  {c2bData.accountRef && (
                    <div className="copy-row">
                      <span>Account No:</span>
                      <strong className="highlight-text">{c2bData.accountRef}</strong>
                      <button onClick={() => copyToClipboard(c2bData.accountRef)}>📋</button>
                    </div>
                  )}
                  
                  <div className="copy-row">
                    <span>Amount:</span>
                    <strong className="amount-text">KES {c2bData.amount}</strong>
                  </div>
                </div>

                <div className="instruction-card">
                  <h4>3. Enter PIN & Send</h4>
                  <p>We are waiting for your payment...</p>
                </div>
              </div>
            )}

            {/* --- CARD FORM --- */}
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

            {selectedMethod === 'card' && !cardPayment?.clientSecret && !loading && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <button onClick={handleCardInitiate} disabled={isProcessing} className="payment-btn payment-btn-primary">
                  {isProcessing ? 'Initializing...' : '💳 Proceed to Card Payment'}
                </button>
              </div>
            )}

            {/* Payment Status (STK/Card) */}
            {(isPolling || paymentStatus === 'pending') && mpesaTransaction && (
              <PaymentStatus method="mpesa" status={paymentStatus} transactionData={mpesaTransaction} pollAttempts={pollAttempts} onCancel={handleClose} />
            )}

            {selectedMethod === 'card' && loading && paymentStatus === 'pending' && (
              <PaymentStatus method="card" status={paymentStatus} transactionData={cardPayment} onCancel={handleClose} />
            )}

            {/* Success */}
            {isCompleted && <PaymentSuccess booking={booking} onClose={handleClose} />}

            {/* Cancel Section */}
            {paymentStatus === 'pending' && !isCompleted && (
              <div className="modal-cancel-section">
                <button type="button" onClick={handleClose} className="cancel-payment-link">
                  Cancel Payment
                </button>
                {selectedMethod === 'mpesa' && <p className="cancel-note">Closing won't stop the prompt on your phone.</p>}
                {selectedMethod === 'c2b' && <p className="cancel-note">You can close. Payment will be detected automatically.</p>}
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