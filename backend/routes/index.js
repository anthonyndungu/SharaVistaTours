import express from 'express';
import authRoutes from './authRoutes.js';
import packageRoutes from './packageRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes); 

export default router;