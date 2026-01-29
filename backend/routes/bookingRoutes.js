import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);

// Admin routes
router.patch('/:id/status', protect, restrictTo('admin', 'super_admin'), updateBookingStatus);
router.get('/admin/all', protect, restrictTo('admin', 'super_admin'), getAllBookings);

export default router;