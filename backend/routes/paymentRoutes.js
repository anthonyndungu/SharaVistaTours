// // routes/paymentRoutes.js
// import express from 'express';
// import {
//   initiateMPESAPayment,
//   initiateCardPayment,
//   verifyPayment,
//   getPaymentHistory,
//   processRefund,
//   checkPaymentStatus
// } from '../controllers/paymentController.js';
// import { protect, restrictTo } from '../middleware/auth.js';
// import { paymentRateLimit } from '../middleware/paymentSecurity.js'; // Optional rate limiting

// const router = express.Router();

// // Payment initiation (with optional rate limiting)
// router.post('/mpesa', paymentRateLimit,protect, initiateMPESAPayment);
// router.post('/card', paymentRateLimit,protect, initiateCardPayment);

// // Payment status & history
// router.get('/status',protect, checkPaymentStatus);
// router.get('/verify/:transactionId',protect, verifyPayment);
// router.get('/history', protect, getPaymentHistory);

// // Admin-only refund
// router.post('/:id/refund', restrictTo('admin', 'super_admin'),protect, processRefund);

// export default router;


// routes/paymentRoutes.js
import express from 'express';
import {
  initiateMPESAPayment,
  initiateCardPayment,
  initiateC2BPayment, // 🆕 NEW: Import C2B controller
  verifyPayment,
  getPaymentHistory,
  processRefund,
  checkPaymentStatus,
  initiateC2BPaymentCallback
} from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { paymentRateLimit } from '../middleware/paymentSecurity.js';

const router = express.Router();

// ===========================
// Payment Initiation Routes
// ===========================

// ✅ MPESA STK Push
router.post('/mpesa', paymentRateLimit, protect, initiateMPESAPayment);

// ✅ Card Payment (Stripe)
router.post('/card', paymentRateLimit, protect, initiateCardPayment);

// 🆕 NEW: C2B Payment (PayBill/Till Manual Payment)
// Route: POST /api/v1/bookings/:bookingId/pay-c2b
// Body: { phone_number, amount, account_reference? }
// Response: { success: true, data: { shortcode, accountRef, amount, type, expiresAt } }
router.post(
  '/bookings/:bookingId/pay-c2b', 
  paymentRateLimit, 
  protect, 
  initiateC2BPayment
);

// ===========================
// Payment Status & History
// ===========================

// ✅ Check payment status (supports MPESA checkoutRequestId, Stripe paymentIntentId, or bookingId)
router.get('/status', protect, checkPaymentStatus);

// ✅ Verify payment by transaction ID
router.get('/verify/:transactionId', protect, verifyPayment);

// ✅ Get payment history for authenticated user
router.get('/history', protect, getPaymentHistory);

// ===========================
// Admin-Only Routes
// ===========================

// ✅ Process refund (admin only)
router.post('/:id/refund', restrictTo('admin', 'super_admin'), protect, processRefund);

router.post('/mpesa/c2b/callback', initiateC2BPaymentCallback);

export default router;