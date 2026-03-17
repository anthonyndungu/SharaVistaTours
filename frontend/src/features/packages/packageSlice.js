// // src/features/packages/packageSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';

// // Async thunks
// export const fetchPackages = createAsyncThunk(
//   'packages/fetchAll',
//   async (_, { rejectWithValue }) => {
//     // bail out early if browser reports offline status
//     if (typeof navigator !== 'undefined' && !navigator.onLine) {
//       return rejectWithValue('Offline: please check your network connection');
//     }
//     try {
//       const response = await api.get('/packages');
//       return response.data.data.packages;
//     } catch (error) {
//       // differentiate network errors (no response) from API errors
//       let msg;
//       if (!error.response) {
//         // network error (server unreachable, DNS, etc.)
//         msg = 'Network error: please check your connection or try again later';
//       } else {
//         msg = error.response.data?.message || 'Failed to fetch packages';
//       }
//       // only log once for debugging, avoid flooding console
//       console.error('Error fetching packages:', msg, error);
//       return rejectWithValue(msg);
//     }
//   }
// );

// export const fetchPackageById = createAsyncThunk(
//   'packages/fetchById',
//   async (id, { rejectWithValue }) => {
//     if (typeof navigator !== 'undefined' && !navigator.onLine) {
//       return rejectWithValue('Offline: unable to fetch package');
//     }
//     try {
//       const response = await api.get(`/packages/${id}`);
//       return response.data.data.package;
//     } catch (error) {
//       let msg;
//       if (!error.response) {
//         msg = 'Network error: unable to load package';
//       } else {
//         msg = error.response.data?.message || 'Package not found';
//       }
//       return rejectWithValue(msg);
//     }
//   }
// );

// export const fetchFeaturedPackages = createAsyncThunk(
//   'packages/fetchFeatured',
//   async (_, { rejectWithValue }) => {
//     if (typeof navigator !== 'undefined' && !navigator.onLine) {
//       return rejectWithValue('Offline: unable to fetch featured packages');
//     }
//     try {
//       const response = await api.get('/packages?is_featured=true');
//       return response.data.data.packages;
//     } catch (error) {
//       let msg;
//       if (!error.response) {
//         msg = 'Network error: unable to load featured packages';
//       } else {
//         msg = error.response.data?.message || 'Failed to fetch featured packages';
//       }
//       return rejectWithValue(msg);
//     }
//   }
// );

// export const createPackage = createAsyncThunk(
//   'packages/createPackage',
//   async (formData, { rejectWithValue }) => {
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       };
//       const response = await api.post('/packages', formData, config);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const updatePackage = createAsyncThunk(
//   'packages/updatePackage',
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       };
//       const response = await api.put(`/packages/${id}`, data, config);
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const deletePackage = createAsyncThunk(
//   'packages/delete',
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/packages/${id}`);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete package');
//     }
//   }
// );

// // ✅ ADDED: Fetch package statistics
// export const fetchPackageStats = createAsyncThunk(
//   'packages/fetchStats',
//   async (_, { rejectWithValue }) => {
//     if (typeof navigator !== 'undefined' && !navigator.onLine) {
//       return rejectWithValue('Offline: unable to fetch package statistics');
//     }
//     try {
//       const response = await api.get('/packages/stats');
//       return response.data.data.stats;
//     } catch (error) {
//       let msg;
//       if (!error.response) {
//         msg = 'Network error: unable to retrieve package stats';
//       } else {
//         msg = error.response.data?.message || 'Failed to fetch package statistics';
//       }
//       return rejectWithValue(msg);
//     }
//   }
// );

// const packageSlice = createSlice({
//   name: 'packages',
//   initialState: {
//     packages: [],
//     selectedPackage: null,
//     featuredPackages: [],
//     stats: null, // 👈 CRITICAL: Added stats field
//     loading: false,
//     error: null,
//     successMessage: null
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccess: (state) => {
//       state.successMessage = null;
//     },
//     clearSelectedPackage: (state) => {
//       state.selectedPackage = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all packages
//       .addCase(fetchPackages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPackages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.packages = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchPackages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch package by ID
//       .addCase(fetchPackageById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPackageById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedPackage = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchPackageById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch featured packages
//       .addCase(fetchFeaturedPackages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchFeaturedPackages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.featuredPackages = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchFeaturedPackages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Create package
//       .addCase(createPackage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createPackage.fulfilled, (state, action) => {
//         state.loading = false;
//         state.packages.push(action.payload);
//         state.successMessage = 'Package created successfully';
//       })
//       .addCase(createPackage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Update package
//       .addCase(updatePackage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updatePackage.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedPackage = action.payload;
//         const index = state.packages.findIndex(p => p.id === action.payload.id);
//         if (index !== -1) {
//           state.packages[index] = action.payload;
//         }
//         state.successMessage = 'Package updated successfully';
//       })
//       .addCase(updatePackage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Delete package
//       .addCase(deletePackage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deletePackage.fulfilled, (state, action) => {
//         state.loading = false;
//         state.packages = state.packages.filter(p => p.id !== action.payload);
//         state.successMessage = 'Package deleted successfully';
//       })
//       .addCase(deletePackage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ FIXED: Fetch package stats
//       .addCase(fetchPackageStats.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPackageStats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.stats = action.payload; // 👈 SAVE STATS TO STATE
//         state.error = null;
//       })
//       .addCase(fetchPackageStats.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { clearError, clearSuccess, clearSelectedPackage } = packageSlice.actions;
// export default packageSlice.reducer;




// src/features/packages/packageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchPackages = createAsyncThunk(
  'packages/fetchAll',
  async (_, { rejectWithValue }) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return rejectWithValue('Offline: please check your network connection');
    }
    try {
      const response = await api.get('/packages');
      
      // UPDATED: Access packages directly from response.data
      // Old: return response.data.data.packages;
      return response.data.packages || []; 
    } catch (error) {
      let msg;
      if (!error.response) {
        msg = 'Network error: please check your connection or try again later';
      } else {
        msg = error.response.data?.message || 'Failed to fetch packages';
      }
      console.error('Error fetching packages:', msg, error);
      return rejectWithValue(msg);
    }
  }
);

export const fetchPackageById = createAsyncThunk(
  'packages/fetchById',
  async (id, { rejectWithValue }) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return rejectWithValue('Offline: unable to fetch package');
    }
    try {
      const response = await api.get(`/packages/${id}`);
      
      // ✅ UPDATED: Access package directly from response.data.data.package
      // Note: Single item endpoint still wraps in 'data' in our controller
      return response.data.data?.package || null; 
    } catch (error) {
      let msg;
      if (!error.response) {
        msg = 'Network error: unable to load package';
      } else {
        msg = error.response.data?.message || 'Package not found';
      }
      return rejectWithValue(msg);
    }
  }
);

export const fetchFeaturedPackages = createAsyncThunk(
  'packages/fetchFeatured',
  async (_, { rejectWithValue }) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return rejectWithValue('Offline: unable to fetch featured packages');
    }
    try {
      const response = await api.get('/packages?is_featured=true');
      // ✅ UPDATED
      return response.data.packages || []; 
    } catch (error) {
      let msg;
      if (!error.response) {
        msg = 'Network error: unable to load featured packages';
      } else {
        msg = error.response.data?.message || 'Failed to fetch featured packages';
      }
      return rejectWithValue(msg);
    }
  }
);

export const createPackage = createAsyncThunk(
  'packages/createPackage',
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await api.post('/packages', formData, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updatePackage = createAsyncThunk(
  'packages/updatePackage',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await api.put(`/packages/${id}`, data, config);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deletePackage = createAsyncThunk(
  'packages/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/packages/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete package');
    }
  }
);

export const fetchPackageStats = createAsyncThunk(
  'packages/fetchStats',
  async (_, { rejectWithValue }) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return rejectWithValue('Offline: unable to fetch package statistics');
    }
    try {
      const response = await api.get('/packages/stats');
      return response.data.data?.stats || [];
    } catch (error) {
      let msg;
      if (!error.response) {
        msg = 'Network error: unable to retrieve package stats';
      } else {
        msg = error.response.data?.message || 'Failed to fetch package statistics';
      }
      return rejectWithValue(msg);
    }
  }
);

const packageSlice = createSlice({
  name: 'packages',
  initialState: {
    packages: [],
    selectedPackage: null,
    featuredPackages: [],
    stats: null,
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
    clearSelectedPackage: (state) => {
      state.selectedPackage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all packages
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
        state.error = null;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch package by ID
      .addCase(fetchPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPackage = action.payload;
        state.error = null;
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch featured packages
      .addCase(fetchFeaturedPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredPackages = action.payload;
        state.error = null;
      })
      .addCase(fetchFeaturedPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create package
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.loading = false;
        // Action payload is the whole response { status, message, data: { package } }
        if (action.payload.data?.package) {
            state.packages.push(action.payload.data.package);
        }
        state.successMessage = 'Package created successfully';
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update package
      .addCase(updatePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data?.package) {
            state.selectedPackage = action.payload.data.package;
            const index = state.packages.findIndex(p => p.id === action.payload.data.package.id);
            if (index !== -1) {
              state.packages[index] = action.payload.data.package;
            }
        }
        state.successMessage = 'Package updated successfully';
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete package
      .addCase(deletePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = state.packages.filter(p => p.id !== action.payload);
        state.successMessage = 'Package deleted successfully';
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch package stats
      .addCase(fetchPackageStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchPackageStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, clearSelectedPackage } = packageSlice.actions;
export default packageSlice.reducer;