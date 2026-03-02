// routes/paymentRoutes.js
import express from 'express';
import {
  initiateMPESAPayment,
  initiateCardPayment,
  verifyPayment,
  getPaymentHistory,
  processRefund,
  checkPaymentStatus
} from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { paymentRateLimit } from '../middleware/paymentSecurity.js'; // Optional rate limiting

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(protect);

// Payment initiation (with optional rate limiting)
router.post('/mpesa', paymentRateLimit, initiateMPESAPayment);
router.post('/card', paymentRateLimit, initiateCardPayment);

// Payment status & history
router.get('/status', checkPaymentStatus);
router.get('/verify/:transactionId', verifyPayment);
router.get('/history', getPaymentHistory);

// Admin-only refund
router.post('/:id/refund', restrictTo('admin', 'super_admin'), processRefund);

export default router;