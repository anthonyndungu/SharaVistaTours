import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      // return rejectWithValue(error.response?.data?.message || 'Login failed')
      const message = error.response?.data?.message || 'Login failed';
      const code = error.response?.data?.code;

      // Pass both message and code to the UI
      return rejectWithValue({ message, code });
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', userData)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

// Add this with your other action creators
export const fetchAllUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users')
      return response.data.data.users
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me')
      return response.data.data.user
    } catch (error) {
      localStorage.removeItem('token')
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

export const updateMe = createAsyncThunk(
  'auth/updateMe',
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await api.patch('/auth/updateMe', updateData)
      return response.data.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile')
    }
  }
)

export const updateMyPassword = createAsyncThunk(
  'auth/updateMyPassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.patch('/auth/updateMyPassword', passwordData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update password')
    }
  }
)

// ✅ ADD THESE MISSING ACTION CREATORS:
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email')
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/auth/reset-password/${token}`, { password })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token')
  return null
})

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const resendVerificationOTP = createAsyncThunk(
  'auth/resendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      console.log('OTP resend response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

// ✅ NEW: Admin Manual Verify Thunk
export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/auth/users/${userId}/verify`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    users: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.users = []; // Clear users on logout too
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.data.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
        state.isAuthenticated = false
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.data.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Verify User
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the users list in state if you store it here
        // Or just let the component re-fetch via fetchAllUsers
        state.error = null;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
      })

      // Update Me
      .addCase(updateMe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      // .addCase(updateMe.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.payload
      // })
      .addCase(updateMe.rejected, (state, action) => {
        state.loading = false;
        let errorMessage = 'Failed to update profile';

        if (action.payload) {
          if (typeof action.payload === 'object' && !Array.isArray(action.payload)) {
            const firstErrorKey = Object.keys(action.payload).find(key => !isNaN(key));
            if (firstErrorKey && action.payload[firstErrorKey].msg) {
              errorMessage = action.payload[firstErrorKey].msg;
            } else if (action.payload.message) {
              errorMessage = action.payload.message;
            }
          } else if (typeof action.payload === 'string') {
            errorMessage = action.payload;
          }
        }
        state.error = errorMessage;
      })

      // Update Password
      .addCase(updateMyPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMyPassword.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
      })

      // .addCase(updateMyPassword.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.payload
      // })
      // In authSlice.js (Simplified version)
      .addCase(updateMyPassword.rejected, (state, action) => {
        state.loading = false;

        let errorMessage = 'Failed to update password'; // Default fallback

        if (action.payload) {
          // ✅ Check for the specific message field first
          if (typeof action.payload === 'object' && action.payload.message) {
            errorMessage = action.payload.message;
          }
          // Fallback for weird nested structures if any
          else if (action.payload['0'] && action.payload['0'].msg) {
            errorMessage = action.payload['0'].msg;
          }
          // Fallback if payload is just a string
          else if (typeof action.payload === 'string') {
            errorMessage = action.payload;
          }
        }

        state.error = errorMessage;

        // Optional: Log to console to debug what the slice received
        console.log('Redux Error Caught:', errorMessage);
      })

      // ✅ ADD THESE MISSING CASES:
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
  }
})

export const { clearError, clearAuthState } = authSlice.actions
export default authSlice.reducer