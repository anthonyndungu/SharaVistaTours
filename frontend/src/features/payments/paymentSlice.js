import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const createMPESAPayment = createAsyncThunk(
  'payments/createMPESA',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/mpesa', paymentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initiate MPESA payment')
    }
  }
)

export const createCardPayment = createAsyncThunk(
  'payments/createCard',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments/card', paymentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process card payment')
    }
  }
)

export const fetchPaymentHistory = createAsyncThunk(
  'payments/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payments/history')
      return response.data.data.payments
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment history')
    }
  }
)

export const verifyPayment = createAsyncThunk(
  'payments/verify',
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payments/verify/${transactionId}`)
      return response.data.data.payment
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify payment')
    }
  }
)

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    selectedPayment: null,
    mpesaTransaction: null,
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.successMessage = null
    },
    clearMPESATransaction: (state) => {
      state.mpesaTransaction = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Create MPESA payment
      .addCase(createMPESAPayment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createMPESAPayment.fulfilled, (state, action) => {
        state.loading = false
        state.mpesaTransaction = action.payload.data
        state.successMessage = 'MPESA payment initiated successfully'
      })
      .addCase(createMPESAPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Create Card payment
      .addCase(createCardPayment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCardPayment.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPayment = action.payload.data.payment
        state.successMessage = 'Card payment processed successfully'
      })
      .addCase(createCardPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch payment history
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false
        state.payments = action.payload
        state.error = null
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPayment = action.payload
        state.successMessage = 'Payment verified successfully'
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearSuccess, clearMPESATransaction } = paymentSlice.actions
export default paymentSlice.reducer