import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❌ REMOVED: window.location.href = '/'
    // We let the component handle the 401 error via Redux
    
    if (error.response?.status === 401) {
      // Optional: Clear token silently, but DO NOT redirect here
      // localStorage.removeItem('token'); 
    }

    // Retry logic for timeouts
    if (error.config && error.code === 'ECONNABORTED' && !error.config.__retryCount) {
      error.config.__retryCount = 1;
      return new Promise((resolve) => {
        setTimeout(() => resolve(api(error.config)), 1000);
      });
    }

    // Pass the error to Redux
    return Promise.reject(error);
  }
);

export default api;