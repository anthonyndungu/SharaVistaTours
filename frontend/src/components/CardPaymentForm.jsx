// // src/features/payments/components/CardPaymentForm.jsx
// import { useState, useCallback, useMemo } from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const CardPaymentForm = ({ 
//   amount, 
//   paymentIntentId, 
//   onInitiate, 
//   onSuccess, 
//   onCancel 
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState(null);
//   const [cardComplete, setCardComplete] = useState(false);

//   const handleSubmit = useCallback(async (e) => {
//     e.preventDefault();
    
//     if (!stripe || !elements) {
//       setError('Payment system not ready. Please refresh the page.');
//       return;
//     }

//     if (!cardComplete) {
//       setError('Please enter complete card details');
//       return;
//     }

//     setProcessing(true);
//     setError(null);

//     try {
//       const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
//         paymentIntentId, // This is the client_secret from backend
//         {
//           payment_method: {
//             card: elements.getElement(CardElement),
//             billing_details: {
//               name: 'Customer', // Replace with actual form input if collecting name
//             },
//           },
//         }
//       );

//       if (confirmError) {
//         setError(confirmError.message);
//         setProcessing(false);
//       } else if (paymentIntent?.status === 'succeeded') {
//         // Payment succeeded on Stripe side - notify parent to poll backend
//         onSuccess?.(paymentIntent);
//       }
//     } catch (err) {
//       setError('An unexpected error occurred. Please try again.');
//       setProcessing(false);
//       console.error('Card confirmation error:', err);
//     }
//   }, [stripe, elements, cardComplete, paymentIntentId, onSuccess]);

//   const cardElementOptions = useMemo(() => ({
//     style: {
//       base: {
//         fontSize: '16px',
//         color: '#32325d',
//         fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
//         '::placeholder': { color: '#aab7c4' },
//         lineHeight: '1.5',
//       },
//       invalid: { 
//         color: '#fa755a', 
//         iconColor: '#fa755a',
//       },
//     },
//     hidePostalCode: true,
//   }), []);

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Card Details
//         </label>
//         <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors bg-white">
//           <CardElement 
//             options={cardElementOptions} 
//             onChange={(e) => {
//               setError(null);
//               setCardComplete(e.complete);
//             }} 
//           />
//         </div>
//         <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
//           🔒 Secured by Stripe • We never store your card details
//         </p>
//       </div>

//       {error && (
//         <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
//           <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           {error}
//         </div>
//       )}

//       <div className="flex gap-3 pt-2">
//         <button
//           type="button"
//           onClick={onCancel}
//           disabled={processing}
//           className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={!stripe || processing || !cardComplete}
//           className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
//         >
//           {processing ? (
//             <>
//               <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//               </svg>
//               Processing...
//             </>
//           ) : (
//             <>
//               <span>💳</span>
//               Pay KES {amount?.toLocaleString()}
//             </>
//           )}
//         </button>
//       </div>

//       {/* Accepted Cards */}
//       <div className="flex items-center justify-center gap-2 pt-2">
//         <span className="text-xs text-gray-500">We accept:</span>
//         <div className="flex gap-1">
//           {['visa', 'mastercard', 'amex'].map((card) => (
//             <span 
//               key={card}
//               className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600 uppercase"
//             >
//               {card}
//             </span>
//           ))}
//         </div>
//       </div>
//     </form>
//   );
// };

// export default CardPaymentForm;




// src/features/payments/components/CardPaymentForm.jsx
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