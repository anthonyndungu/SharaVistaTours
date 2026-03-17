// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';

// // ===========================
// // Async Thunks
// // ===========================

// // ✅ Existing: Create MPESA Payment (STK Push)
// export const createMPESAPayment = createAsyncThunk(
//   'payments/createMPESA',
//   async (paymentData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/payments/mpesa', paymentData);
//       return {
//         ...response.data,
//         method: 'mpesa',
//         checkoutRequestId: response.data.data?.checkoutRequestId,
//         customerMessage: response.data.data?.customerMessage,
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to initiate MPESA payment');
//     }
//   }
// );

// // ✅ Existing: Create Card Payment (Stripe)
// export const createCardPayment = createAsyncThunk(
//   'payments/createCard',
//   async (paymentData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/payments/card', paymentData);
//       return {
//         ...response.data,
//         method: 'card',
//         clientSecret: response.data.data?.clientSecret,
//         paymentIntentId: response.data.data?.paymentIntentId,
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to process card payment');
//     }
//   }
// );

// // 🆕 NEW: Create C2B Payment (PayBill/Till Manual Payment)
// export const createC2BPayment = createAsyncThunk(
//   'payments/createC2B',
//   async (paymentData, { rejectWithValue }) => {
//     try {
//       // Endpoint: POST /v1/bookings/:id/pay-c2b
//       const response = await api.post(`/payments/bookings/${paymentData.booking_id}/pay-c2b`, {
//         bookingId: paymentData.booking_id,
//         phone: paymentData.phone_number,
//         method: 'c2b',
//         amount: paymentData.amount,
//       });
      
//       return {
//         ...response.data,
//         method: 'c2b',
//         // C2B-specific fields returned from backend
//         shortcode: response.data.data?.shortcode,      // PayBill or Till number
//         accountRef: response.data.data?.accountRef,    // Account reference (optional)
//         amount: response.data.data?.amount,            // Exact amount to pay
//         type: response.data.data?.type,                // 'PayBill' or 'Till'
//         expiresAt: response.data.data?.expiresAt,      // ISO timestamp for expiry
//         instructions: response.data.data?.instructions,// Human-readable steps
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to generate C2B payment instructions');
//     }
//   }
// );

// // ✅ Existing: Fetch Payment History
// export const fetchPaymentHistory = createAsyncThunk(
//   'payments/fetchHistory',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/payments/history', { params });
//       return {
//         payments: response.data.data?.payments || [],
//         pagination: {
//           page: response.data.page,
//           pages: response.data.pages,
//           total: response.data.total,
//           results: response.data.results,
//         },
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment history');
//     }
//   }
// );

// // ✅ Existing: Verify Payment
// export const verifyPayment = createAsyncThunk(
//   'payments/verify',
//   async (transactionId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/payments/verify/${transactionId}`);
//       return response.data.data.payment;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to verify payment');
//     }
//   }
// );

// // ✅ Existing: Poll Payment Status (MPESA STK + C2B fallback)
// export const pollPaymentStatus = createAsyncThunk(
//   'payments/pollStatus',
//   async ({ checkoutRequestId, paymentIntentId, bookingId }, { rejectWithValue }) => {
//     try {
//       const params = {};
//       if (checkoutRequestId) params.checkout_request_id = checkoutRequestId;
//       if (paymentIntentId) params.payment_intent_id = paymentIntentId;
//       if (bookingId) params.booking_id = bookingId; // 🔧 For C2B polling
      
//       const response = await api.get('/payments/status', { params });
//       return {
//         ...response.data.data.payment,
//         canPoll: response.data.data.payment?.canPoll,
//         nextPollIn: response.data.data.payment?.nextPollIn,
//       };
//     } catch (error) {
//       console.warn('Polling error (non-fatal):', error);
//       return rejectWithValue(error.response?.data?.message || 'Status check failed');
//     }
//   }
// );

// // ✅ Existing: Process Refund (Admin only)
// export const processRefund = createAsyncThunk(
//   'payments/refund',
//   async ({ paymentId, reason, customerPhone }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`/payments/${paymentId}/refund`, {
//         reason,
//         customer_phone: customerPhone,
//       });
//       return response.data.data.payment;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Refund processing failed');
//     }
//   }
// );

// // ===========================
// // Initial State (Enhanced with C2B)
// // ===========================
// const initialState = {
//   // Payment lists & selection
//   payments: [],
//   selectedPayment: null,
  
//   // MPESA-specific state
//   mpesaTransaction: null, // { checkoutRequestId, customerMessage, ... }
  
//   // 🆕 C2B-specific state
//   c2bTransaction: null,   // { shortcode, accountRef, amount, type, expiresAt, ... }
//   isC2BInitiated: false,  // Flag: has C2B flow started?
//   c2bExpiresAt: null,     // ISO timestamp when instructions expire
  
//   // Card/Stripe-specific state
//   cardPayment: null, // { clientSecret, paymentIntentId, ... }
  
//   // UI State for Modal/Flow Control
//   showModal: false,
//   selectedMethod: null, // 'mpesa' | 'card' | 'c2b'
//   polling: false,
//   pollInterval: null,
//   pollAttempts: 0,
  
//   // Async operation state
//   loading: false,
//   error: null,
//   successMessage: null,
  
//   // Payment result tracking
//   paymentStatus: null, // 'pending' | 'completed' | 'failed' | 'refunded'
//   lastPolled: null,
// };

// // ===========================
// // Slice Definition
// // ===========================
// const paymentSlice = createSlice({
//   name: 'payments',
//   initialState,
  
//   reducers: {
//     // Clear error messages
//     clearError: (state) => { state.error = null; },
    
//     // Clear success messages
//     clearSuccess: (state) => { state.successMessage = null; },
    
//     // Clear MPESA transaction state
//     clearMPESATransaction: (state) => { 
//       state.mpesaTransaction = null;
//       state.polling = false;
//     },
    
//     // 🆕 Clear C2B transaction state
//     clearC2BTransaction: (state) => { 
//       state.c2bTransaction = null;
//       state.isC2BInitiated = false;
//       state.c2bExpiresAt = null;
//       state.polling = false;
//     },
    
//     // Clear card payment state
//     clearCardPayment: (state) => { 
//       state.cardPayment = null;
//       state.polling = false;
//     },
    
//     // Control modal visibility
//     setShowModal: (state, action) => {
//       state.showModal = action.payload;
//       if (!action.payload) {
//         state.polling = false;
//         state.pollAttempts = 0;
//         if (state.pollInterval) {
//           clearInterval(state.pollInterval);
//           state.pollInterval = null;
//         }
//       }
//     },
    
//     // Set selected payment method
//     setSelectedMethod: (state, action) => {
//       state.selectedMethod = action.payload;
//       state.pollAttempts = 0;
//       // 🔧 Clear other method states when switching
//       if (action.payload !== 'c2b') {
//         state.c2bTransaction = null;
//         state.isC2BInitiated = false;
//       }
//       if (action.payload !== 'mpesa') {
//         state.mpesaTransaction = null;
//       }
//       if (action.payload !== 'card') {
//         state.cardPayment = null;
//       }
//     },
    
//     // 🆕 Mark C2B as initiated (after receiving instructions)
//     setC2BInitiated: (state, action) => {
//       state.isC2BInitiated = action.payload ?? true;
//       if (action.payload) {
//         state.paymentStatus = 'pending';
//       }
//     },
    
//     // Start polling for payment status
//     startPolling: (state) => {
//       state.polling = true;
//       state.pollAttempts = 0;
//       state.lastPolled = new Date().toISOString();
//     },
    
//     // Stop polling
//     stopPolling: (state) => {
//       state.polling = false;
//       if (state.pollInterval) {
//         clearInterval(state.pollInterval);
//         state.pollInterval = null;
//       }
//     },
    
//     // Reset entire payment state (for cleanup)
//     resetPaymentState: (state) => {
//       return { ...initialState };
//     },
//   },
  
//   extraReducers: (builder) => {
//     builder
//       // ===========================
//       // Create MPESA Payment (STK)
//       // ===========================
//       .addCase(createMPESAPayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.paymentStatus = 'pending';
//       })
//       .addCase(createMPESAPayment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.mpesaTransaction = {
//           checkoutRequestId: action.payload.checkoutRequestId,
//           customerMessage: action.payload.customerMessage,
//           amount: action.payload.data?.payment?.amount,
//           currency: action.payload.data?.payment?.currency,
//         };
//         state.paymentStatus = 'pending';
//         state.successMessage = 'MPESA STK Push sent! Check your phone for the PIN prompt.';
//         state.polling = true;
//       })
//       .addCase(createMPESAPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.paymentStatus = 'failed';
//       })
      
//       // ===========================
//       // 🆕 Create C2B Payment
//       // ===========================
//       .addCase(createC2BPayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.paymentStatus = 'pending';
//       })
//       .addCase(createC2BPayment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.c2bTransaction = {
//           shortcode: action.payload.shortcode,
//           accountRef: action.payload.accountRef,
//           amount: action.payload.amount,
//           type: action.payload.type, // 'PayBill' or 'Till'
//           expiresAt: action.payload.expiresAt,
//           instructions: action.payload.instructions,
//           bookingId: action.payload.data?.bookingId,
//         };
//         state.c2bExpiresAt = action.payload.expiresAt;
//         state.isC2BInitiated = true;
//         state.paymentStatus = 'pending';
//         state.successMessage = `Payment instructions generated. Pay ${action.payload.type === 'PayBill' ? 'PayBill' : 'Till'} ${action.payload.shortcode} before expiry.`;
//         // Auto-start polling for C2B confirmation via backend callbacks
//         state.polling = true;
//       })
//       .addCase(createC2BPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.paymentStatus = 'failed';
//         state.isC2BInitiated = false;
//       })
      
//       // ===========================
//       // Create Card Payment
//       // ===========================
//       .addCase(createCardPayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.paymentStatus = 'pending';
//       })
//       .addCase(createCardPayment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.cardPayment = {
//           clientSecret: action.payload.clientSecret,
//           paymentIntentId: action.payload.paymentIntentId,
//           amount: action.payload.data?.payment?.amount,
//           currency: action.payload.data?.payment?.currency,
//         };
//         state.paymentStatus = 'pending';
//         state.successMessage = 'Card payment initialized. Please confirm with your card details.';
//       })
//       .addCase(createCardPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.paymentStatus = 'failed';
//       })
      
//       // ===========================
//       // Poll Payment Status (MPESA STK + C2B)
//       // ===========================
//       .addCase(pollPaymentStatus.pending, (state) => {
//         state.loading = true;
//         state.pollAttempts += 1;
//         state.lastPolled = new Date().toISOString();
//       })
//       .addCase(pollPaymentStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedPayment = action.payload;
//         state.paymentStatus = action.payload.status;
        
//         // Auto-stop polling if payment completed/failed
//         if (['completed', 'failed', 'refunded'].includes(action.payload.status)) {
//           state.polling = false;
//           state.successMessage = action.payload.status === 'completed' 
//             ? 'Payment confirmed successfully!' 
//             : 'Payment status updated.';
//         }
//       })
//       .addCase(pollPaymentStatus.rejected, (state, action) => {
//         state.loading = false;
//         console.warn('Polling failed (non-fatal):', action.payload);
//       })
      
//       // ===========================
//       // Fetch Payment History
//       // ===========================
//       .addCase(fetchPaymentHistory.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
//         state.loading = false;
//         state.payments = action.payload.payments;
//         state.pagination = action.payload.pagination;
//         state.error = null;
//       })
//       .addCase(fetchPaymentHistory.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // ===========================
//       // Verify Payment
//       // ===========================
//       .addCase(verifyPayment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(verifyPayment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedPayment = action.payload;
//         state.paymentStatus = action.payload.status;
//         state.successMessage = 'Payment verified successfully';
//       })
//       .addCase(verifyPayment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // ===========================
//       // Process Refund (Admin)
//       // ===========================
//       .addCase(processRefund.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(processRefund.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedPayment = action.payload;
//         state.paymentStatus = 'refunded';
//         state.successMessage = 'Refund processed successfully';
        
//         const index = state.payments.findIndex(p => p.id === action.payload.id);
//         if (index !== -1) {
//           state.payments[index] = action.payload;
//         }
//       })
//       .addCase(processRefund.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // ===========================
// // Selectors (Reusable Queries)
// // ===========================
// export const selectPayments = (state) => state.payments.payments;
// export const selectPaymentPagination = (state) => state.payments.pagination;
// export const selectSelectedPayment = (state) => state.payments.selectedPayment;
// export const selectMPESATransaction = (state) => state.payments.mpesaTransaction;

// // 🆕 C2B Selectors
// export const selectC2BTransaction = (state) => state.payments.c2bTransaction;
// export const selectIsC2BInitiated = (state) => state.payments.isC2BInitiated;
// export const selectC2BExpiresAt = (state) => state.payments.c2bExpiresAt;

// export const selectCardPayment = (state) => state.payments.cardPayment;
// export const selectPaymentLoading = (state) => state.payments.loading;
// export const selectPaymentError = (state) => state.payments.error;
// export const selectPaymentSuccess = (state) => state.payments.successMessage;
// export const selectPaymentStatus = (state) => state.payments.paymentStatus;
// export const selectIsPolling = (state) => state.payments.polling;
// export const selectPollAttempts = (state) => state.payments.pollAttempts;
// export const selectShowModal = (state) => state.payments.showModal;
// export const selectSelectedMethod = (state) => state.payments.selectedMethod;

// // Derived selectors
// export const selectIsProcessing = (state) => 
//   state.payments.loading || state.payments.polling;

// export const selectIsPaymentCompleted = (state) => 
//   state.payments.paymentStatus === 'completed';

// export const selectIsPaymentFailed = (state) => 
//   state.payments.paymentStatus === 'failed';

// // ===========================
// // Export Actions & Reducer
// // ===========================
// export const {
//   clearError,
//   clearSuccess,
//   clearMPESATransaction,
//   clearC2BTransaction, // 🆕 Export new action
//   clearCardPayment,
//   setShowModal,
//   setSelectedMethod,
//   setC2BInitiated,     // 🆕 Export new action
//   startPolling,
//   stopPolling,
//   resetPaymentState,
// } = paymentSlice.actions;

// export default paymentSlice.reducer;




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ===========================
// 1. ASYNC THUNKS
// ===========================

// ✅ Create MPESA Payment (STK Push)
export const createMPESAPayment = createAsyncThunk(
  'payments/createMPESA',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/mpesa', paymentData);
      // Backend returns: { status, message, data: { payment, checkoutRequestId, customerMessage... } }
      return {
        ...response.data,
        method: 'mpesa',
        checkoutRequestId: response.data.data?.checkoutRequestId,
        customerMessage: response.data.data?.customerMessage,
      };
    } catch (error) {
      let message = 'Failed to initiate MPESA payment';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

// ✅ Create Card Payment (Stripe)
export const createCardPayment = createAsyncThunk(
  'payments/createCard',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/card', paymentData);
      // Backend returns: { status, message, data: { payment, clientSecret, paymentIntentId... } }
      return {
        ...response.data,
        method: 'card',
        clientSecret: response.data.data?.clientSecret,
        paymentIntentId: response.data.data?.paymentIntentId,
      };
    } catch (error) {
      let message = 'Failed to process card payment';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

// 🆕 Create C2B Payment (PayBill/Till Manual Payment)
export const createC2BPayment = createAsyncThunk(
  'payments/createC2B',
  async (paymentData, { rejectWithValue }) => {
    try {
      // Endpoint matches backend: POST /api/v1/payments/c2b/:bookingId
      const response = await api.post(`/payments/c2b/${paymentData.booking_id}`, {
        phone: paymentData.phone_number,
        amount: paymentData.amount,
        account_reference: paymentData.account_reference,
      });
      
      // Backend returns: { success, message, data: { paymentId, transId, shortcode, accountRef, amount, type, expiresAt, instructions... } }
      return {
        ...response.data,
        method: 'c2b',
        shortcode: response.data.data?.shortcode,
        accountRef: response.data.data?.accountRef,
        amount: response.data.data?.amount,
        type: response.data.data?.type,
        expiresAt: response.data.data?.expiresAt,
        instructions: response.data.data?.instructions,
        transId: response.data.data?.transId,
      };
    } catch (error) {
      let message = 'Failed to generate C2B payment instructions';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

// ✅ Fetch Payment History (CACHED in backend)
export const fetchPaymentHistory = createAsyncThunk(
  'payments/fetchHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/payments/history', { params });
      // Backend returns: { status, results, total, page, pages, data: { payments: [...] } }
      return {
        payments: response.data?.payments || [],
        pagination: {
          page: response.data.page || 1,
          pages: response.data.pages || 0,
          total: response.data.total || 0,
          results: response.data.results || 0,
        },
      };
    } catch (error) {
      let message = 'Failed to fetch payment history';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

// ✅ Verify Payment (CACHED in backend)
export const verifyPayment = createAsyncThunk(
  'payments/verify',
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payments/verify/${transactionId}`);
      // Backend returns: { status, data: { payment: {...} } }
      return response.data.data.payment;
    } catch (error) {
      let message = 'Failed to verify payment';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

// ✅ Poll Payment Status (MPESA STK + C2B + Stripe)
export const pollPaymentStatus = createAsyncThunk(
  'payments/pollStatus',
  async ({ checkoutRequestId, paymentIntentId, bookingId }, { rejectWithValue }) => {
    try {
      const params = {};
      if (checkoutRequestId) params.checkout_request_id = checkoutRequestId;
      if (paymentIntentId) params.payment_intent_id = paymentIntentId;
      if (bookingId) params.booking_id = bookingId;
      
      const response = await api.get('/payments/status', { params });
      // Backend returns: { status, data: { payment: { status, canPoll, nextPollIn... } } }
      return {
        ...response.data.data.payment,
        canPoll: response.data.data.payment?.canPoll,
        nextPollIn: response.data.data.payment?.nextPollIn,
      };
    } catch (error) {
      // Non-fatal error for polling
      console.warn('Polling error:', error);
      let message = 'Status check failed';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      }
      return rejectWithValue(message);
    }
  }
);

// ✅ Process Refund (Admin Only)
export const processRefund = createAsyncThunk(
  'payments/refund',
  async ({ paymentId, reason, customerPhone }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, {
        reason,
        customer_phone: customerPhone,
      });
      // Backend returns: { status, message, data: { payment: {...} } }
      return response.data.data.payment;
    } catch (error) {
      let message = 'Refund processing failed';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

// ===========================
// 2. INITIAL STATE
// ===========================
const initialState = {
  // Payment lists & selection
  payments: [],
  selectedPayment: null,
  
  // Pagination
  pagination: {
    page: 1,
    pages: 0,
    total: 0,
    results: 0
  },
  
  // MPESA-specific state
  mpesaTransaction: null,
  
  // 🆕 C2B-specific state
  c2bTransaction: null,
  isC2BInitiated: false,
  c2bExpiresAt: null,
  
  // Card/Stripe-specific state
  cardPayment: null,
  
  // UI State
  showModal: false,
  selectedMethod: null, // 'mpesa' | 'card' | 'c2b'
  polling: false,
  pollInterval: null,
  pollAttempts: 0,
  
  // Async operation state
  loading: false,
  error: null,
  successMessage: null,
  
  // Result tracking
  paymentStatus: null,
  lastPolled: null,
};

// ===========================
// 3. SLICE DEFINITION
// ===========================
const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.successMessage = null; },
    
    clearMPESATransaction: (state) => { 
      state.mpesaTransaction = null;
      state.polling = false;
    },
    
    // 🆕 Clear C2B transaction state
    clearC2BTransaction: (state) => { 
      state.c2bTransaction = null;
      state.isC2BInitiated = false;
      state.c2bExpiresAt = null;
      state.polling = false;
    },
    
    clearCardPayment: (state) => { 
      state.cardPayment = null;
      state.polling = false;
    },
    
    setShowModal: (state, action) => {
      state.showModal = action.payload;
      if (!action.payload) {
        state.polling = false;
        state.pollAttempts = 0;
        if (state.pollInterval) {
          clearInterval(state.pollInterval);
          state.pollInterval = null;
        }
      }
    },
    
    setSelectedMethod: (state, action) => {
      state.selectedMethod = action.payload;
      state.pollAttempts = 0;
      // Clear other method states when switching
      if (action.payload !== 'c2b') {
        state.c2bTransaction = null;
        state.isC2BInitiated = false;
      }
      if (action.payload !== 'mpesa') {
        state.mpesaTransaction = null;
      }
      if (action.payload !== 'card') {
        state.cardPayment = null;
      }
    },
    
    // 🆕 Mark C2B as initiated
    setC2BInitiated: (state, action) => {
      state.isC2BInitiated = action.payload ?? true;
      if (action.payload) {
        state.paymentStatus = 'pending';
      }
    },
    
    startPolling: (state) => {
      state.polling = true;
      state.pollAttempts = 0;
      state.lastPolled = new Date().toISOString();
    },
    
    stopPolling: (state) => {
      state.polling = false;
      if (state.pollInterval) {
        clearInterval(state.pollInterval);
        state.pollInterval = null;
      }
    },
    
    resetPaymentState: (state) => {
      return { ...initialState };
    },
  },
  
  extraReducers: (builder) => {
    builder
      // ===========================
      // Create MPESA Payment
      // ===========================
      .addCase(createMPESAPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = 'pending';
      })
      .addCase(createMPESAPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.mpesaTransaction = {
          checkoutRequestId: action.payload.checkoutRequestId,
          customerMessage: action.payload.customerMessage,
          amount: action.payload.data?.payment?.amount,
          currency: action.payload.data?.payment?.currency,
        };
        state.paymentStatus = 'pending';
        state.successMessage = 'MPESA STK Push sent! Check your phone.';
        state.polling = true;
      })
      .addCase(createMPESAPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      })
      
      // ===========================
      // 🆕 Create C2B Payment
      // ===========================
      .addCase(createC2BPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = 'pending';
      })
      .addCase(createC2BPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.c2bTransaction = {
          shortcode: action.payload.shortcode,
          accountRef: action.payload.accountRef,
          amount: action.payload.amount,
          type: action.payload.type,
          expiresAt: action.payload.expiresAt,
          instructions: action.payload.instructions,
          transId: action.payload.transId,
        };
        state.c2bExpiresAt = action.payload.expiresAt;
        state.isC2BInitiated = true;
        state.paymentStatus = 'pending';
        state.successMessage = `Pay ${action.payload.type} ${action.payload.shortcode} before expiry.`;
        state.polling = true;
      })
      .addCase(createC2BPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
        state.isC2BInitiated = false;
      })
      
      // ===========================
      // Create Card Payment
      // ===========================
      .addCase(createCardPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = 'pending';
      })
      .addCase(createCardPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.cardPayment = {
          clientSecret: action.payload.clientSecret,
          paymentIntentId: action.payload.paymentIntentId,
          amount: action.payload.data?.payment?.amount,
          currency: action.payload.data?.payment?.currency,
        };
        state.paymentStatus = 'pending';
        state.successMessage = 'Card payment initialized.';
      })
      .addCase(createCardPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      })
      
      // ===========================
      // Poll Payment Status
      // ===========================
      .addCase(pollPaymentStatus.pending, (state) => {
        state.loading = true;
        state.pollAttempts += 1;
        state.lastPolled = new Date().toISOString();
      })
      .addCase(pollPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayment = action.payload;
        state.paymentStatus = action.payload.status;
        
        if (['completed', 'failed', 'refunded'].includes(action.payload.status)) {
          state.polling = false;
          state.successMessage = action.payload.status === 'completed' 
            ? 'Payment confirmed successfully!' 
            : 'Payment status updated.';
        }
      })
      .addCase(pollPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        // Non-fatal, do not set global error
      })
      
      // ===========================
      // Fetch Payment History
      // ===========================
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===========================
      // Verify Payment
      // ===========================
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayment = action.payload;
        state.paymentStatus = action.payload.status;
        state.successMessage = 'Payment verified successfully';
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===========================
      // Process Refund
      // ===========================
      .addCase(processRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayment = action.payload;
        state.paymentStatus = 'refunded';
        state.successMessage = 'Refund processed successfully';
        
        const index = state.payments.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ===========================
// 4. SELECTORS
// ===========================
export const selectPayments = (state) => state.payments.payments;
export const selectPaymentPagination = (state) => state.payments.pagination;
export const selectSelectedPayment = (state) => state.payments.selectedPayment;
export const selectMPESATransaction = (state) => state.payments.mpesaTransaction;

// 🆕 C2B Selectors
export const selectC2BTransaction = (state) => state.payments.c2bTransaction;
export const selectIsC2BInitiated = (state) => state.payments.isC2BInitiated;
export const selectC2BExpiresAt = (state) => state.payments.c2bExpiresAt;

export const selectCardPayment = (state) => state.payments.cardPayment;
export const selectPaymentLoading = (state) => state.payments.loading;
export const selectPaymentError = (state) => state.payments.error;
export const selectPaymentSuccess = (state) => state.payments.successMessage;
export const selectPaymentStatus = (state) => state.payments.paymentStatus;
export const selectIsPolling = (state) => state.payments.polling;
export const selectPollAttempts = (state) => state.payments.pollAttempts;
export const selectShowModal = (state) => state.payments.showModal;
export const selectSelectedMethod = (state) => state.payments.selectedMethod;

export const selectIsProcessing = (state) => 
  state.payments.loading || state.payments.polling;

export const selectIsPaymentCompleted = (state) => 
  state.payments.paymentStatus === 'completed';

export const selectIsPaymentFailed = (state) => 
  state.payments.paymentStatus === 'failed';

// ===========================
// 5. EXPORTS
// ===========================
export const {
  clearError,
  clearSuccess,
  clearMPESATransaction,
  clearC2BTransaction,
  clearCardPayment,
  setShowModal,
  setSelectedMethod,
  setC2BInitiated,
  startPolling,
  stopPolling,
  resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;