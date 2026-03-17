// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import api from '../../services/api'

// export const createBooking = createAsyncThunk(
//   'bookings/create',
//   async (bookingData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/bookings', bookingData)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to create booking')
//     }
//   }
// )

// export const fetchUserBookings = createAsyncThunk(
//   'bookings/fetchUserBookings',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState()
//       if (!auth.isAuthenticated) {
//         return rejectWithValue('Not authenticated')
//       }
      
//       const response = await api.get('/bookings')
//       return response.data.data.bookings
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
//     }
//   }
// )

// export const fetchBookingById = createAsyncThunk(
//   'bookings/fetchById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/bookings/${id}`)
//       return response.data.data.booking
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Booking not found')
//     }
//   }
// )

// export const updateBookingStatus = createAsyncThunk(
//   'bookings/updateStatus',
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const response = await api.patch(`/bookings/${id}/status`, { status })
//       return response.data.data.booking
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update booking status')
//     }
//   }
// )

// export const cancelBooking = createAsyncThunk(
//   'bookings/cancel',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await api.patch(`/bookings/${id}/cancel`)
//       return response.data.data.booking
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking')
//     }
//   }
// )

// // ✅ ADD THIS MISSING ACTION CREATOR:
// export const getAllBookings = createAsyncThunk(
//   'bookings/getAllBookings',
//   async (_, { rejectWithValue }) => {
//     try {
//       // This endpoint should be accessible only to admins
//       const response = await api.get('/bookings/admin/all')
//       return response.data.data.bookings
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch all bookings')
//     }
//   }
// )

// const bookingSlice = createSlice({
//   name: 'bookings',
//   initialState: {
//     bookings: [],
//     selectedBooking: null,
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
//     clearSelectedBooking: (state) => {
//       state.selectedBooking = null
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create booking
//       .addCase(createBooking.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(createBooking.fulfilled, (state, action) => {
//         state.loading = false
//         state.selectedBooking = action.payload.data.booking
//         state.successMessage = 'Booking created successfully'
//       })
//       .addCase(createBooking.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Fetch user bookings
//       .addCase(fetchUserBookings.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchUserBookings.fulfilled, (state, action) => {
//         state.loading = false
//         state.bookings = action.payload
//         state.error = null
//       })
//       .addCase(fetchUserBookings.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Fetch booking by ID
//       .addCase(fetchBookingById.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchBookingById.fulfilled, (state, action) => {
//         state.loading = false
//         state.selectedBooking = action.payload
//         state.error = null
//       })
//       .addCase(fetchBookingById.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Update booking status
//       .addCase(updateBookingStatus.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(updateBookingStatus.fulfilled, (state, action) => {
//         state.loading = false
//         const index = state.bookings.findIndex(b => b.id === action.payload.id)
//         if (index !== -1) {
//           state.bookings[index] = action.payload
//         }
//         if (state.selectedBooking && state.selectedBooking.id === action.payload.id) {
//           state.selectedBooking = action.payload
//         }
//         state.successMessage = 'Booking status updated successfully'
//       })
//       .addCase(updateBookingStatus.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Cancel booking
//       .addCase(cancelBooking.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(cancelBooking.fulfilled, (state, action) => {
//         state.loading = false
//         const index = state.bookings.findIndex(b => b.id === action.payload.id)
//         if (index !== -1) {
//           state.bookings[index] = action.payload
//         }
//         if (state.selectedBooking && state.selectedBooking.id === action.payload.id) {
//           state.selectedBooking = action.payload
//         }
//         state.successMessage = 'Booking cancelled successfully'
//       })
//       .addCase(cancelBooking.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // ✅ ADD THIS MISSING CASE:
//       // Get all bookings (admin only)
//       .addCase(getAllBookings.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(getAllBookings.fulfilled, (state, action) => {
//         state.loading = false
//         state.bookings = action.payload
//         state.error = null
//       })
//       .addCase(getAllBookings.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
//   }
// })

// export const { clearError, clearSuccess, clearSelectedBooking } = bookingSlice.actions
// export default bookingSlice.reducer



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==========================================
// 1. ASYNC THUNKS
// ==========================================

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      // Backend returns: { status, message, data: { booking, paymentInstructions } }
      return response.data;
    } catch (error) {
      let message = 'Failed to create booking';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async ({ page, limit, status, payment_status } = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return rejectWithValue('Not authenticated');
      }

      // Build query params
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (status) params.append('status', status);
      if (payment_status) params.append('payment_status', payment_status);

      const response = await api.get(`/bookings?${params.toString()}`);
      console.log('Fetch user bookings response:', response.data);
      return response.data; 
    } catch (error) {
      console.error('Fetch user bookings error:', error);
      let message = 'Failed to fetch bookings';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      // Backend returns: { status, data: { booking } }
      return response.data.data.booking;
    } catch (error) {
      let message = 'Booking not found';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      // Backend returns: { status, message, data: { booking } }
      return response.data.data.booking;
    } catch (error) {
      let message = 'Failed to update booking status';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${id}/cancel`);
      // Backend returns: { status, message, data: { booking } }
      return response.data.data.booking;
    } catch (error) {
      let message = 'Failed to cancel booking';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

export const getAllBookings = createAsyncThunk(
  'bookings/getAllBookings',
  async ({ page, limit, status, start_date, end_date } = {}, { rejectWithValue }) => {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (status) params.append('status', status);
      if (start_date) params.append('start_date', start_date);
      if (end_date) params.append('end_date', end_date);

      const response = await api.get(`/bookings/admin/all?${params.toString()}`);
      
      // Backend returns: { status, results, total, page, pages, data: { bookings } }
      return response.data;
    } catch (error) {
      let message = 'Failed to fetch all bookings';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

// ==========================================
// 2. SLICE DEFINITION
// ==========================================

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    selectedBooking: null,
    loading: false,
    error: null,
    successMessage: null,
    // Pagination state
    total: 0,
    page: 1,
    pages: 0,
    results: 0
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
    resetPagination: (state) => {
      state.total = 0;
      state.page = 1;
      state.pages = 0;
      state.results = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // ✅ CREATE BOOKING
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is the whole response { status, message, data: { booking... } }
        if (action.payload.data?.booking) {
          state.selectedBooking = action.payload.data.booking;
          // Optionally add to list immediately, though a re-fetch is cleaner
          // state.bookings.unshift(action.payload.data.booking); 
        }
        state.successMessage = action.payload.message || 'Booking created successfully';
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ FETCH USER BOOKINGS
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is the whole response { status, results, total, page, pages, data: { bookings } }
        state.bookings = action.payload?.bookings || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.pages = action.payload?.pages || 0;
        state.results = action.payload?.results || 0;
        state.error = null;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ FETCH BOOKING BY ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload;
        state.error = null;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ UPDATE BOOKING STATUS
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBooking = action.payload;
        
        // Update in list
        const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        
        // Update selected
        if (state.selectedBooking && state.selectedBooking.id === updatedBooking.id) {
          state.selectedBooking = updatedBooking;
        }
        
        state.successMessage = 'Booking status updated successfully';
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ CANCEL BOOKING
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledBooking = action.payload;
        
        // Update in list
        const index = state.bookings.findIndex(b => b.id === cancelledBooking.id);
        if (index !== -1) {
          state.bookings[index] = cancelledBooking;
        }
        
        // Update selected
        if (state.selectedBooking && state.selectedBooking.id === cancelledBooking.id) {
          state.selectedBooking = cancelledBooking;
        }
        
        state.successMessage = 'Booking cancelled successfully';
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ GET ALL BOOKINGS (ADMIN)
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is the whole response { status, results, total, page, pages, data: { bookings } }
        state.bookings = action.payload?.bookings || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.pages = action.payload?.pages || 0;
        state.results = action.payload?.results || 0;
        state.error = null;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, clearSelectedBooking, resetPagination } = bookingSlice.actions;
export default bookingSlice.reducer;