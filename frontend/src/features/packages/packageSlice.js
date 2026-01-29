import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunks
export const fetchPackages = createAsyncThunk(
  'packages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/packages')
      return response.data.data.packages
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch packages')
    }
  }
)

export const fetchPackageById = createAsyncThunk(
  'packages/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/packages/${id}`)
      return response.data.data.package
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Package not found')
    }
  }
)

export const fetchFeaturedPackages = createAsyncThunk(
  'packages/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/packages?is_featured=true')
      return response.data.data.packages
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured packages')
    }
  }
)

export const createPackage = createAsyncThunk(
  'packages/create',
  async (packageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/packages', packageData)
      return response.data.data.package
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create package')
    }
  }
)

export const updatePackage = createAsyncThunk(
  'packages/update',
  async ({ id, packageData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/packages/${id}`, packageData)
      return response.data.data.package
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update package')
    }
  }
)

export const deletePackage = createAsyncThunk(
  'packages/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/packages/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete package')
    }
  }
)

// ✅ ADD THIS MISSING ACTION CREATOR:
export const fetchPackageStats = createAsyncThunk(
  'packages/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/packages/stats')
      return response.data.data.stats
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch package statistics')
    }
  }
)

const packageSlice = createSlice({
  name: 'packages',
  initialState: {
    packages: [],
    selectedPackage: null,
    featuredPackages: [],
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
    clearSelectedPackage: (state) => {
      state.selectedPackage = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all packages
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false
        state.packages = action.payload
        state.error = null
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch package by ID
      .addCase(fetchPackageById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPackage = action.payload
        state.error = null
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch featured packages
      .addCase(fetchFeaturedPackages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFeaturedPackages.fulfilled, (state, action) => {
        state.loading = false
        state.featuredPackages = action.payload
        state.error = null
      })
      .addCase(fetchFeaturedPackages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Create package
      .addCase(createPackage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.loading = false
        state.packages.push(action.payload)
        state.successMessage = 'Package created successfully'
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update package
      .addCase(updatePackage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPackage = action.payload
        const index = state.packages.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.packages[index] = action.payload
        }
        state.successMessage = 'Package updated successfully'
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete package
      .addCase(deletePackage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.loading = false
        state.packages = state.packages.filter(p => p.id !== action.payload)
        state.successMessage = 'Package deleted successfully'
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // ✅ ADD THIS MISSING CASE:
      // Fetch package stats
      .addCase(fetchPackageStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPackageStats.fulfilled, (state, action) => {
        state.loading = false
        // Note: stats are stored in a different place or you can add a stats field to state
        // For now, we'll just handle the loading/error states
        state.error = null
      })
      .addCase(fetchPackageStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearSuccess, clearSelectedPackage } = packageSlice.actions
export default packageSlice.reducer