// routes/paymentRoutes.js
import express from 'express';
import {
  initiateMPESAPayment,
  initiateCardPayment,
  verifyPayment,
  getPaymentHistory,
  processRefund,
  checkPaymentStatus,
  mpesaCallback,
  c2bValidation,
  c2bConfirmation
} from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { paymentRateLimit } from '../middleware/paymentSecurity.js'; // Optional rate limiting

const router = express.Router();

// Payment initiation (with optional rate limiting)
router.post('/mpesa', paymentRateLimit,protect, initiateMPESAPayment);
router.post('/card', paymentRateLimit,protect, initiateCardPayment);

// Payment status & history
router.get('/status',protect, checkPaymentStatus);
router.get('/verify/:transactionId',protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

// Admin-only refund
router.post('/:id/refund', restrictTo('admin', 'super_admin'),protect, processRefund);

export default router;