// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import api from '../../services/api'

// // Async thunks
// export const createReview = createAsyncThunk(
//   'reviews/create',
//   async (reviewData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/reviews', reviewData)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to create review')
//     }
//   }
// )

// export const fetchPackageReviews = createAsyncThunk(
//   'reviews/fetchPackageReviews',
//   async (packageId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/reviews/package/${packageId}`)
//       return response.data.data.reviews
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews')
//     }
//   }
// )

// export const fetchUserReviews = createAsyncThunk(
//   'reviews/fetchUserReviews',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/reviews/my-reviews')
//       return response.data.data.reviews
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch your reviews')
//     }
//   }
// )

// export const updateReview = createAsyncThunk(
//   'reviews/update',
//   async ({ id, reviewData }, { rejectWithValue }) => {
//     try {
//       const response = await api.patch(`/reviews/${id}`, reviewData)
//       return response.data.data.review
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update review')
//     }
//   }
// )

// export const deleteReview = createAsyncThunk(
//   'reviews/delete',
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/reviews/${id}`)
//       return id
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete review')
//     }
//   }
// )

// const reviewSlice = createSlice({
//   name: 'reviews',
//   initialState: {
//     reviews: [],
//     userReviews: [],
//     selectedReview: null,
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
//     clearSelectedReview: (state) => {
//       state.selectedReview = null
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create review
//       .addCase(createReview.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(createReview.fulfilled, (state, action) => {
//         state.loading = false
//         state.reviews.push(action.payload.data.review)
//         state.successMessage = 'Review submitted successfully'
//       })
//       .addCase(createReview.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Fetch package reviews
//       .addCase(fetchPackageReviews.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchPackageReviews.fulfilled, (state, action) => {
//         state.loading = false
//         state.reviews = action.payload
//         state.error = null
//       })
//       .addCase(fetchPackageReviews.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Fetch user reviews
//       .addCase(fetchUserReviews.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(fetchUserReviews.fulfilled, (state, action) => {
//         state.loading = false
//         state.userReviews = action.payload
//         state.error = null
//       })
//       .addCase(fetchUserReviews.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Update review
//       .addCase(updateReview.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(updateReview.fulfilled, (state, action) => {
//         state.loading = false
//         const index = state.reviews.findIndex(r => r.id === action.payload.id)
//         if (index !== -1) {
//           state.reviews[index] = action.payload
//         }
//         const userIndex = state.userReviews.findIndex(r => r.id === action.payload.id)
//         if (userIndex !== -1) {
//           state.userReviews[userIndex] = action.payload
//         }
//         state.successMessage = 'Review updated successfully'
//       })
//       .addCase(updateReview.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Delete review
//       .addCase(deleteReview.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(deleteReview.fulfilled, (state, action) => {
//         state.loading = false
//         state.reviews = state.reviews.filter(r => r.id !== action.payload)
//         state.userReviews = state.userReviews.filter(r => r.id !== action.payload)
//         state.successMessage = 'Review deleted successfully'
//       })
//       .addCase(deleteReview.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
//   }
// })

// export const { clearError, clearSuccess, clearSelectedReview } = reviewSlice.actions
// export default reviewSlice.reducer



// src/features/reviews/reviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// === EXISTING ACTIONS (unchanged) ===
export const createReview = createAsyncThunk(
  'reviews/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data.data.review; // Fixed: return review object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const fetchPackageReviews = createAsyncThunk(
  'reviews/fetchPackageReviews',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/package/${packageId}`);
      return response.data.data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reviews/my-reviews');
      return response.data.data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your reviews');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/reviews/${id}`, reviewData);
      return response.data.data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

// === NEW ADMIN ACTION ===
export const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/reviews/admin');
      return response.data.data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],        // For package-specific reviews
    userReviews: [],    // For current user's reviews
    allReviews: [],     // 👈 NEW: For admin dashboard
    selectedReview: null,
    loading: false,
    error: null,
    successMessage: null
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
        state.successMessage = 'Review submitted successfully';
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch package reviews
      .addCase(fetchPackageReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
        state.error = null;
      })
      .addCase(fetchPackageReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user reviews
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
      
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        // Update in all relevant arrays
        const updateReviewInArray = (array) => {
          const index = array.findIndex(r => r.id === action.payload.id);
          if (index !== -1) array[index] = action.payload;
        };
        updateReviewInArray(state.reviews);
        updateReviewInArray(state.userReviews);
        updateReviewInArray(state.allReviews); // Also update admin list
        state.successMessage = 'Review updated successfully';
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from all arrays
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
        state.userReviews = state.userReviews.filter(r => r.id !== action.payload);
        state.allReviews = state.allReviews.filter(r => r.id !== action.payload); // Also remove from admin list
        state.successMessage = 'Review deleted successfully';
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // === NEW ADMIN CASE ===
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.allReviews = action.payload;
        state.error = null;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, clearSelectedReview } = reviewSlice.actions;
export default reviewSlice.reducer;