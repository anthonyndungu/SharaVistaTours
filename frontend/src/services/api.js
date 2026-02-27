import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
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

// Response interceptor - handle token expiration
let networkErrorLogged = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // handle authentication expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }

    // log network issues once to avoid console spam
    if (!error.response && !networkErrorLogged) {
      console.warn('API network error - server unreachable or network is down');
      networkErrorLogged = true;
    }

    return Promise.reject(error)
  }
)

export default api