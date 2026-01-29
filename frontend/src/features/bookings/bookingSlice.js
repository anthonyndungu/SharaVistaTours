import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking')
    }
  }
)

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()
      if (!auth.isAuthenticated) {
        return rejectWithValue('Not authenticated')
      }
      
      const response = await api.get('/bookings')
      return response.data.data.bookings
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
    }
  }
)

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${id}`)
      return response.data.data.booking
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking not found')
    }
  }
)

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status })
      return response.data.data.booking
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking status')
    }
  }
)

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${id}/cancel`)
      return response.data.data.booking
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking')
    }
  }
)

// ✅ ADD THIS MISSING ACTION CREATOR:
export const getAllBookings = createAsyncThunk(
  'bookings/getAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      // This endpoint should be accessible only to admins
      const response = await api.get('/bookings/admin/all')
      return response.data.data.bookings
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all bookings')
    }
  }
)

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    selectedBooking: null,
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
    clearSelectedBooking: (state) => {
      state.selectedBooking = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.selectedBooking = action.payload.data.booking
        state.successMessage = 'Booking created successfully'
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
        state.error = null
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedBooking = action.payload
        state.error = null
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.bookings.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
        if (state.selectedBooking && state.selectedBooking.id === action.payload.id) {
          state.selectedBooking = action.payload
        }
        state.successMessage = 'Booking status updated successfully'
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false
        const index = state.bookings.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
        if (state.selectedBooking && state.selectedBooking.id === action.payload.id) {
          state.selectedBooking = action.payload
        }
        state.successMessage = 'Booking cancelled successfully'
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // ✅ ADD THIS MISSING CASE:
      // Get all bookings (admin only)
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
        state.error = null
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearSuccess, clearSelectedBooking } = bookingSlice.actions
export default bookingSlice.reducer