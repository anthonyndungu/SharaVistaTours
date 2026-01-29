import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import packageReducer from '../features/packages/packageSlice'
import bookingReducer from '../features/bookings/bookingSlice'
import paymentReducer from '../features/payments/paymentSlice'
import reviewReducer from '../features/reviews/reviewSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packageReducer,
    bookings: bookingReducer,
    payments: paymentReducer,
    reviews: reviewReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})