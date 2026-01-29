import express from 'express';
import {
  initiateMPESAPayment,
  mpesaCallback,
  verifyPayment,
  getPaymentHistory,
  processRefund
} from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for MPESA callback)
router.post('/mpesa/callback', mpesaCallback);

// Protected routes
router.post('/mpesa', protect, initiateMPESAPayment);
router.get('/verify/:transactionId', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);
router.post('/:id/refund', protect, restrictTo('admin', 'super_admin'), processRefund);

export default router;