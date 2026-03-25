import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ===========================
// 1. ASYNC THUNKS
// ===========================

//Create Review
export const createReview = createAsyncThunk(
  'reviews/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      // Backend returns: { status, message, data: { review } }
      return response.data.data.review;
    } catch (error) {
      let message = 'Failed to create review';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

//Fetch Package Reviews (Supports Filters & Pagination)
export const fetchPackageReviews = createAsyncThunk(
  'reviews/fetchPackageReviews',
  async ({ packageId, rating, verified, page, limit } = {}, { rejectWithValue }) => {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (rating) params.append('rating', rating);
      if (verified !== undefined) params.append('verified', verified);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);

      const response = await api.get(`/packages/${packageId}/reviews?${params.toString()}`);
      
      // Backend returns: { status, results, total, average_rating, page, pages, data: { reviews } }
      return {
        reviews: response.data.data.reviews,
        pagination: {
          page: response.data.page,
          pages: response.data.pages,
          total: response.data.total,
          results: response.data.results,
        },
        average_rating: response.data.average_rating,
      };
    } catch (error) {
      let message = 'Failed to fetch reviews';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

//Fetch User Reviews
export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reviews/my-reviews');
      // Backend returns: { status, results, data: { reviews } }
      return response.data.data.reviews;
    } catch (error) {
      let message = 'Failed to fetch your reviews';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

//Update Review
export const updateReview = createAsyncThunk(
  'reviews/update',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/reviews/${id}`, reviewData);
      // Backend returns: { status, message, data: { review } }
      return response.data.data.review;
    } catch (error) {
      let message = 'Failed to update review';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

//Delete Review
export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${id}`);
      return id;
    } catch (error) {
      let message = 'Failed to delete review';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

// ✅ Fetch All Reviews (Admin) - Supports Pagination
export const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAll',
  async ({ page, limit, status } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (status) params.append('status', status);

      const response = await api.get(`/reviews/admin?${params.toString()}`);
      
      // Backend returns: { status, results, total, page, pages, data: { reviews } }
      return {
        reviews: response.data.data.reviews,
        pagination: {
          page: response.data.page,
          pages: response.data.pages,
          total: response.data.total,
          results: response.data.results,
        },
      };
    } catch (error) {
      let message = 'Failed to fetch reviews';
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
// 2. SLICE DEFINITION
// ===========================

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],           // For package-specific reviews
    userReviews: [],       // For current user's reviews
    allReviews: [],        // For admin dashboard
    selectedReview: null,
    loading: false,
    error: null,
    successMessage: null,
    // Pagination state
    pagination: {
      page: 1,
      pages: 0,
      total: 0,
      results: 0
    },
    averageRating: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedReview: (state) => {
      state.selectedReview = null;
    },
    resetPagination: (state) => {
      state.pagination = { page: 1, pages: 0, total: 0, results: 0 };
      state.averageRating = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // ✅ CREATE REVIEW
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload); // Add to top of list
        state.userReviews.unshift(action.payload); // Also add to user's list
        state.successMessage = 'Review submitted successfully';
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ FETCH PACKAGE REVIEWS
      .addCase(fetchPackageReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
        state.averageRating = action.payload.average_rating;
        state.error = null;
      })
      .addCase(fetchPackageReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ FETCH USER REVIEWS
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload;
        state.error = null;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ UPDATE REVIEW
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        
        // Helper to update in array
        const updateInArray = (arr) => {
          const idx = arr.findIndex(r => r.id === updated.id);
          if (idx !== -1) arr[idx] = updated;
        };

        updateInArray(state.reviews);
        updateInArray(state.userReviews);
        updateInArray(state.allReviews);
        
        state.successMessage = 'Review updated successfully';
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ DELETE REVIEW
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        
        state.reviews = state.reviews.filter(r => r.id !== id);
        state.userReviews = state.userReviews.filter(r => r.id !== id);
        state.allReviews = state.allReviews.filter(r => r.id !== id);
        
        state.successMessage = 'Review deleted successfully';
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ FETCH ALL REVIEWS (ADMIN)
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.allReviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearSelectedReview, resetPagination } = reviewSlice.actions;
export default reviewSlice.reducer;