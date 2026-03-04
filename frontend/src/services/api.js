import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle token expiration and retry on network errors
let networkErrorLogged = false;

api.interceptors.response.use(
  (response) => {
    networkErrorLogged = false;
    return response;
  },
  (error) => {
    // Handle authentication expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }

    // Retry logic for network errors (simple retry after delay)
    if (error.config && error.code === 'ECONNABORTED' && !error.config.__retryCount) {
      error.config.__retryCount = 1;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(api(error.config));
        }, 1000); // Wait 1 second before retrying
      });
    }

    // Log network issues once to avoid console spam
    if (!error.response && !networkErrorLogged) {
      console.warn('API network error - server unreachable or network is down');
      networkErrorLogged = true;
    }

    return Promise.reject(error)
  }
)

export default api