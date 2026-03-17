// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';

// // ==========================================
// // 1. ASYNC THUNKS
// // ==========================================

// export const login = createAsyncThunk(
//   'auth/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/login', credentials);
//       localStorage.setItem('token', response.data.token);
//       return response.data;
//     } catch (error) {
//       let message = 'Login failed';
//       let code = null;
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//         code = error.response.data?.code || null;
//       } else if (error.request) {
//         message = 'Network error. Please check your connection.';
//       } else {
//         message = error.message || message;
//       }
//       return rejectWithValue({ message, code, email: credentials.email });
//     }
//   }
// );

// export const register = createAsyncThunk(
//   'auth/register',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/signup', userData);
//       localStorage.setItem('token', response.data.token);
//       return response.data;
//     } catch (error) {
//       let message = 'Registration failed';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error. Please check your connection.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const fetchAllUsers = createAsyncThunk(
//   'auth/fetchAllUsers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/users');
//       return response.data.data.users;
//     } catch (error) {
//       let message = 'Failed to fetch users';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const fetchUserProfile = createAsyncThunk(
//   'auth/fetchProfile',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/auth/me');
//       return response.data.data.user;
//     } catch (error) {
//       localStorage.removeItem('token');
//       let message = 'Failed to fetch profile';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const updateMe = createAsyncThunk(
//   'auth/updateMe',
//   async (updateData, { rejectWithValue }) => {
//     try {
//       const response = await api.patch('/auth/updateMe', updateData);
//       return response.data.data.user;
//     } catch (error) {
//       let message = 'Failed to update profile';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const updateMyPassword = createAsyncThunk(
//   'auth/updateMyPassword',
//   async (passwordData, { rejectWithValue }) => {
//     try {
//       const response = await api.patch('/auth/updateMyPassword', passwordData);
//       return response.data;
//     } catch (error) {
//       let message = 'Failed to update password';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const forgotPassword = createAsyncThunk(
//   'auth/forgotPassword',
//   async (email, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/forgot-password', { email });
//       return response.data;
//     } catch (error) {
//       let message = 'Failed to send reset email';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const resetPassword = createAsyncThunk(
//   'auth/resetPassword',
//   async ({ token, password }, { rejectWithValue }) => {
//     try {
//       const response = await api.patch(`/auth/reset-password/${token}`, { password });
//       return response.data;
//     } catch (error) {
//       let message = 'Failed to reset password';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const logout = createAsyncThunk('auth/logout', async () => {
//   localStorage.removeItem('token');
//   return null;
// });

// export const resendVerification = createAsyncThunk(
//   'auth/resendVerification',
//   async (email, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/resend-verification', { email });
//       return response.data;
//     } catch (error) {
//       let message = 'Failed to resend verification';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const resendVerificationOTP = createAsyncThunk(
//   'auth/resendOTP',
//   async (email, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/resend-otp', { email });
//       return response.data;
//     } catch (error) {
//       let message = 'Failed to send OTP';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const verifyOTP = createAsyncThunk(
//   'auth/verifyOTP',
//   async ({ email, otp }, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/auth/verify-otp', { email, otp });
//       return response.data;
//     } catch (error) {
//       let message = 'Invalid OTP';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const verifyUser = createAsyncThunk(
//   'auth/verifyUser',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await api.patch(`/auth/users/${userId}/verify`);
//       return response.data;
//     } catch (error) {
//       let message = 'Failed to verify user';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// export const initializeAuth = createAsyncThunk(
//   'auth/initialize',
//   async (_, { rejectWithValue }) => {
//     const token = localStorage.getItem('token');
//     if (!token) return null;

//     try {
//       const response = await api.get('/auth/me');
//       return response.data.data.user;
//     } catch (error) {
//       localStorage.removeItem('token');
//       let message = 'Session expired';
//       if (error.response) {
//         message = error.response.data?.message || error.response.data?.msg || message;
//       } else if (error.request) {
//         message = 'Network error.';
//       }
//       return rejectWithValue(message);
//     }
//   }
// );

// // ==========================================
// // 2. SLICE DEFINITION
// // ==========================================

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: localStorage.getItem('token') || null,
//     isAuthenticated: !!localStorage.getItem('token'),
//     loading: false,
//     error: null,
//     users: [],
//     loginMessage: null,
//     loginMessageSeverity: 'info',
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearAuthState: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.loading = false;
//       state.error = null;
//       state.users = [];
//     },
//     setLoginMessage: (state, action) => {
//       state.loginMessage = action.payload.message;
//       state.loginMessageSeverity = action.payload.severity || 'info';
//     },
//     clearLoginMessage: (state) => {
//       state.loginMessage = null;
//       state.loginMessageSeverity = 'info';
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ✅ INITIALIZE AUTH
//       .addCase(initializeAuth.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(initializeAuth.fulfilled, (state, action) => {
//         state.loading = false;
//         if (action.payload) {
//           state.user = action.payload;
//           state.isAuthenticated = true;
//         } else {
//           state.isAuthenticated = false;
//           state.user = null;
//         }
//       })
//       .addCase(initializeAuth.rejected, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = false;
//         state.user = null;
//         state.token = null;
//         state.error = action.payload;
//       })

//       // ✅ LOGIN
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         if (action.payload?.data?.user) {
//           state.isAuthenticated = true;
//           state.user = action.payload.data.user;
//           state.token = action.payload.token;
//         } else {
//           state.isAuthenticated = false;
//           state.user = null;
//           state.token = null;
//         }
//         state.error = null;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || { message: 'Login failed', code: null };
//         state.isAuthenticated = false;
//       })

//       // ✅ REGISTER
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload.data.user;
//         state.token = action.payload.token;
//         state.error = null;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ FETCH ALL USERS
//       .addCase(fetchAllUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchAllUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ FETCH PROFILE
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//         state.user = null;
//       })

//       // ✅ UPDATE ME
//       .addCase(updateMe.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateMe.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.error = null;
//       })
//       .addCase(updateMe.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ UPDATE PASSWORD
//       .addCase(updateMyPassword.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateMyPassword.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(updateMyPassword.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ FORGOT PASSWORD
//       .addCase(forgotPassword.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(forgotPassword.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(forgotPassword.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ RESET PASSWORD
//       .addCase(resetPassword.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(resetPassword.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(resetPassword.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ LOGOUT
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         state.isAuthenticated = false;
//         state.loading = false;
//         state.error = null;
//       })

//       // ✅ RESEND VERIFICATION (Email)
//       .addCase(resendVerification.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(resendVerification.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(resendVerification.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ RESEND OTP
//       .addCase(resendVerificationOTP.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(resendVerificationOTP.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(resendVerificationOTP.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ VERIFY OTP
//       .addCase(verifyOTP.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(verifyOTP.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(verifyOTP.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ VERIFY USER (Admin)
//       .addCase(verifyUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(verifyUser.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(verifyUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError, clearAuthState, setLoginMessage, clearLoginMessage } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ==========================================
// 1. ASYNC THUNKS
// ==========================================

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      let message = 'Login failed';
      let code = null;
      let email = credentials.email; // Default to input email
      
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
        code = error.response.data?.code || null;
        // ✅ Capture email from backend if available (for unverified users)
        if (error.response.data?.email) {
          email = error.response.data.email;
        }
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      } else {
        message = error.message || message;
      }
      return rejectWithValue({ message, code, email });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', userData);
      
      // ❌ REMOVED: Do NOT save token here. 
      // Backend now returns requiresVerification: true and NO token.
      // The frontend should redirect to Verify OTP page instead of logging in.
      
      return response.data; 
    } catch (error) {
      let message = 'Registration failed';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      if (!state.auth.token) throw new Error('No token');
      
      const response = await api.get('/users');
      return response.data.data.users;
    } catch (error) {
      let message = 'Failed to fetch users';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      // Only remove token if 401/403 (invalid token)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
      }
      let message = 'Failed to fetch profile';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
    }
  }
);

export const updateMe = createAsyncThunk(
  'auth/updateMe',
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await api.patch('/auth/updateMe', updateData);
      return response.data.data.user;
    } catch (error) {
      let message = 'Failed to update profile';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
    }
  }
);

export const updateMyPassword = createAsyncThunk(
  'auth/updateMyPassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.patch('/auth/updateMyPassword', passwordData);
      // Optional: Update token if backend rotates it on password change
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      let message = 'Failed to update password';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      let message = 'Failed to send reset email';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password,confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/auth/reset-password/${token}`, { password, confirmPassword });
      // Login automatically after reset if backend returns token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
  
      let message = 'Failed to reset password';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;
});

// ✅ FIXED: Removed unused resendVerification, kept resendVerificationOTP with correct URL
export const resendVerificationOTP = createAsyncThunk(
  'auth/resendOTP',
  async (email, { rejectWithValue }) => {
    try {
      // ✅ URL matches backend: /auth/resend-otp
      const response = await api.post('/auth/resend-otp', { email });
      return response.data; // Contains expiresAt
    } catch (error) {
      let message = 'Failed to send OTP';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
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
      let message = 'Invalid OTP';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
    }
  }
);

export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (userId, { rejectWithValue }) => {
    try {
      // Ensure route matches backend: PATCH /api/v1/users/:id/verify
      const response = await api.patch(`/users/${userId}/verify`); 
      return response.data;
    } catch (error) {
      let message = 'Failed to verify user';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      return response.data.data.user;
    } catch (error) {
      // Clear token only if invalid (401/403)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
      }
      let message = 'Session expired';
      if (error.response) {
        message = error.response.data?.message || error.response.data?.msg || message;
      } else if (error.request) {
        message = 'Network error.';
      }
      return rejectWithValue(message);
    }
  }
);

// ==========================================
// 2. SLICE DEFINITION
// ==========================================

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    users: [],
    loginMessage: null,
    loginMessageSeverity: 'info',
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.users = [];
    },
    setLoginMessage: (state, action) => {
      state.loginMessage = action.payload.message;
      state.loginMessageSeverity = action.payload.severity || 'info';
    },
    clearLoginMessage: (state) => {
      state.loginMessage = null;
      state.loginMessageSeverity = 'info';
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ INITIALIZE AUTH
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // ✅ LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data?.user) {
          state.isAuthenticated = true;
          state.user = action.payload.data.user;
          state.token = action.payload.token;
        }
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Contains { message, code, email }
        state.isAuthenticated = false;
      })

      // ✅ REGISTER (FIXED: No Auto-Login)
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // ❌ Do NOT set isAuthenticated or token here
        // Frontend will handle redirect to Verify OTP page
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ FETCH ALL USERS
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

      // ✅ FETCH PROFILE
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ UPDATE ME
      .addCase(updateMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ UPDATE PASSWORD
      .addCase(updateMyPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateMyPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.users = [];
      })

      // ✅ RESEND OTP (Merged logic from removed resendVerification)
      .addCase(resendVerificationOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendVerificationOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ VERIFY OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // User is verified, but still needs to login manually
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ VERIFY USER (Admin)
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAuthState, setLoginMessage, clearLoginMessage } = authSlice.actions;
export default authSlice.reducer;