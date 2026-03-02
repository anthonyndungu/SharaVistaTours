// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import api from '../../services/api'

// export const createMPESAPayment = createAsyncThunk(
//   'payments/createMPESA',
//   async (paymentData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/payments/mpesa', paymentData)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to initiate MPESA payment')
//     }
//   }
// )

// export const createCardPayment = createAsyncThunk(
//   'payments/createCard',
//   async (paymentData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/payments/card', paymentData)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to process card payment')
//     }
//   }
// )

// export const fetchPaymentHistory = createAsyncThunk(
//   'payments/fetchHistory',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/payments/history')
//       return response.data.data.payments
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment history')
//     }
//   }
// )

// export const verifyPayment = createAsyncThunk(
//   'payments/verify',
//   async (transactionId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/payments/verify/${transactionId}`)
//       return response.data.data.payment
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to verify payment')
//     }
//   }
// )

// const paymentSlice = createSlice({
//   name: 'payments',
//   initialState: {
//     payments: [],
//     selectedPayment: null,
//     mpesaTransaction: null,
//     loading: false,
//     error: null,
//     successMessage: null
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null
//     },
//     clearSuccess: (state) => {
//       state.successMessage = null
//     },
//     clearMPESATransaction: (state) => {
//       state.mpesaTransaction = null
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create MPESA payment
//       .addCase(createMPESAPayment.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(createMPESAPayment.fulfilled, (state, action) => {
//         state.loading = false
//         state.mpesaTransaction = action.payload.data
//         state.successMessage = 'MPESA payment initiated successfully'
//       })
//       .addCase(createMPESAPayment.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Create Card payment
//       .addCase(createCardPayment.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(createCardPayment.fulfilled, (state, action) => {
//         state.loading = false
//         state.selectedPayment = action.payload.data.payment
//         state.successMessage = 'Card payment processed successfully'
//       })
//       .addCase(createCardPayment.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Fetch payment history
//       .addCase(fetchPaymentHistory.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
//         state.loading = false
//         state.payments = action.payload
//         state.error = null
//       })
//       .addCase(fetchPaymentHistory.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Verify payment
//       .addCase(verifyPayment.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(verifyPayment.fulfilled, (state, action) => {
//         state.loading = false
//         state.selectedPayment = action.payload
//         state.successMessage = 'Payment verified successfully'
//       })
//       .addCase(verifyPayment.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
//   }
// })

// export const { clearError, clearSuccess, clearMPESATransaction } = paymentSlice.actions
// export default paymentSlice.reducer




// src/features/payments/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ===========================
// Async Thunks
// ===========================

// ✅ Existing: Create MPESA Payment (enhanced return handling)
export const createMPESAPayment = createAsyncThunk(
  'payments/createMPESA',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/mpesa', paymentData);
      return {
        ...response.data,
        method: 'mpesa',
        // Extract useful fields for frontend
        checkoutRequestId: response.data.data?.checkoutRequestId,
        customerMessage: response.data.data?.customerMessage,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initiate MPESA payment');
    }
  }
);

// ✅ Existing: Create Card Payment (enhanced for Stripe Elements)
export const createCardPayment = createAsyncThunk(
  'payments/createCard',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/card', paymentData);
      return {
        ...response.data,
        method: 'card',
        // Critical for Stripe Elements confirmation
        clientSecret: response.data.data?.clientSecret,
        paymentIntentId: response.data.data?.paymentIntentId,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process card payment');
    }
  }
);

// ✅ Existing: Fetch Payment History
export const fetchPaymentHistory = createAsyncThunk(
  'payments/fetchHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/payments/history', { params });
      return {
        payments: response.data.data?.payments || [],
        pagination: {
          page: response.data.page,
          pages: response.data.pages,
          total: response.data.total,
          results: response.data.results,
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment history');
    }
  }
);

// ✅ Existing: Verify Payment (enhanced to support all ID types)
export const verifyPayment = createAsyncThunk(
  'payments/verify',
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payments/verify/${transactionId}`);
      return response.data.data.payment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify payment');
    }
  }
);

// 🆕 NEW: Poll Payment Status (for MPESA STK Push fallback)
export const pollPaymentStatus = createAsyncThunk(
  'payments/pollStatus',
  async ({ checkoutRequestId, paymentIntentId }, { rejectWithValue }) => {
    try {
      const params = {};
      if (checkoutRequestId) params.checkout_request_id = checkoutRequestId;
      if (paymentIntentId) params.payment_intent_id = paymentIntentId;
      
      const response = await api.get('/payments/status', { params });
      return {
        ...response.data.data.payment,
        canPoll: response.data.data.payment?.canPoll,
        nextPollIn: response.data.data.payment?.nextPollIn,
      };
    } catch (error) {
      // Don't reject on polling errors - they're expected during wait time
      console.warn('Polling error (non-fatal):', error);
      return rejectWithValue(error.response?.data?.message || 'Status check failed');
    }
  }
);

// 🆕 NEW: Process Refund (Admin only)
export const processRefund = createAsyncThunk(
  'payments/refund',
  async ({ paymentId, reason, customerPhone }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, {
        reason,
        customer_phone: customerPhone, // Required for MPESA B2C refunds
      });
      return response.data.data.payment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Refund processing failed');
    }
  }
);

// ===========================
// Initial State (Enhanced)
// ===========================
const initialState = {
  // Payment lists & selection
  payments: [],
  selectedPayment: null,
  
  // MPESA-specific state
  mpesaTransaction: null, // { checkoutRequestId, customerMessage, ... }
  
  // Card/Stripe-specific state
  cardPayment: null, // { clientSecret, paymentIntentId, ... }
  
  // UI State for Modal/Flow Control
  showModal: false,
  selectedMethod: null, // 'mpesa' | 'card'
  polling: false,
  pollInterval: null,
  pollAttempts: 0,
  
  // Async operation state
  loading: false,
  error: null,
  successMessage: null,
  
  // Payment result tracking
  paymentStatus: null, // 'pending' | 'completed' | 'failed' | 'refunded'
  lastPolled: null,
};

// ===========================
// Slice Definition
// ===========================
const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  
  reducers: {
    // Clear error messages
    clearError: (state) => { state.error = null; },
    
    // Clear success messages
    clearSuccess: (state) => { state.successMessage = null; },
    
    // Clear MPESA transaction state
    clearMPESATransaction: (state) => { 
      state.mpesaTransaction = null;
      state.polling = false;
    },
    
    // Clear card payment state
    clearCardPayment: (state) => { 
      state.cardPayment = null;
      state.polling = false;
    },
    
    // Control modal visibility
    setShowModal: (state, action) => {
      state.showModal = action.payload;
      if (!action.payload) {
        // Reset polling when modal closes
        state.polling = false;
        state.pollAttempts = 0;
        if (state.pollInterval) {
          clearInterval(state.pollInterval);
          state.pollInterval = null;
        }
      }
    },
    
    // Set selected payment method
    setSelectedMethod: (state, action) => {
      state.selectedMethod = action.payload;
      state.pollAttempts = 0; // Reset counter on method change
    },
    
    // Start polling for payment status
    startPolling: (state) => {
      state.polling = true;
      state.pollAttempts = 0;
      state.lastPolled = new Date().toISOString();
    },
    
    // Stop polling
    stopPolling: (state) => {
      state.polling = false;
      if (state.pollInterval) {
        clearInterval(state.pollInterval);
        state.pollInterval = null;
      }
    },
    
    // Reset entire payment state (for cleanup)
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
        state.successMessage = 'MPESA STK Push sent! Check your phone for the PIN prompt.';
        // Auto-start polling for MPESA
        state.polling = true;
      })
      .addCase(createMPESAPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
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
        state.successMessage = 'Card payment initialized. Please confirm with your card details.';
      })
      .addCase(createCardPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      })
      
      // ===========================
      // Poll Payment Status (MPESA fallback)
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
        
        // Auto-stop polling if payment completed/failed
        if (['completed', 'failed', 'refunded'].includes(action.payload.status)) {
          state.polling = false;
          state.successMessage = action.payload.status === 'completed' 
            ? 'Payment confirmed successfully!' 
            : 'Payment status updated.';
        }
      })
      .addCase(pollPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        // Don't set error here - polling failures are expected during wait
        console.warn('Polling failed (non-fatal):', action.payload);
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
      // Process Refund (Admin)
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
        
        // Update payment in history list if present
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
// Selectors (Reusable Queries)
// ===========================
export const selectPayments = (state) => state.payments.payments;
export const selectPaymentPagination = (state) => state.payments.pagination;
export const selectSelectedPayment = (state) => state.payments.selectedPayment;
export const selectMPESATransaction = (state) => state.payments.mpesaTransaction;
export const selectCardPayment = (state) => state.payments.cardPayment;
export const selectPaymentLoading = (state) => state.payments.loading;
export const selectPaymentError = (state) => state.payments.error;
export const selectPaymentSuccess = (state) => state.payments.successMessage;
export const selectPaymentStatus = (state) => state.payments.paymentStatus;
export const selectIsPolling = (state) => state.payments.polling;
export const selectPollAttempts = (state) => state.payments.pollAttempts;
export const selectShowModal = (state) => state.payments.showModal;
export const selectSelectedMethod = (state) => state.payments.selectedMethod;

// Derived selector: Is payment processing (any async operation)
export const selectIsProcessing = (state) => 
  state.payments.loading || state.payments.polling;

// Derived selector: Is payment completed
export const selectIsPaymentCompleted = (state) => 
  state.payments.paymentStatus === 'completed';

// Derived selector: Is payment failed
export const selectIsPaymentFailed = (state) => 
  state.payments.paymentStatus === 'failed';

// ===========================
// Export Actions & Reducer
// ===========================
export const {
  clearError,
  clearSuccess,
  clearMPESATransaction,
  clearCardPayment,
  setShowModal,
  setSelectedMethod,
  startPolling,
  stopPolling,
  resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;