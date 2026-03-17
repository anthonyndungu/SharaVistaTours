// // controllers/paymentController.js
// import { Payment, Booking, sequelize, Op, C2BPayment } from '../models/index.js';
// import mpesaService from '../services/MpesaService.js';
// import stripeService from '../services/stripeService.js';
// import logger from '../utils/logger.js';

// // ===========================
// // @desc    Initiate MPESA STK Push Payment
// // @route   POST /api/v1/payments/mpesa
// // @access  Private (Authenticated users)
// // ===========================
// export const initiateMPESAPayment = async (req, res) => {
//   const t = await sequelize.transaction();
  
//   try {
//     const { booking_id, phone_number, amount, account_reference } = req.body;

//     // 1. Validate Inputs
//     if (!booking_id || !phone_number || !amount || amount <= 0) {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Missing required fields: booking_id, phone_number, amount (must be > 0)'
//       });
//     }

//     // 2. Validate Booking Exists (with row lock for concurrency safety)
//     const booking = await Booking.findByPk(booking_id, { 
//       transaction: t,
//       lock: t.LOCK.UPDATE // Prevent race conditions on same booking
//     });
    
//     if (!booking) {
//       await t.rollback();
//       return res.status(404).json({ status: 'fail', message: 'Booking not found' });
//     }

//     // 3. Verify Ownership
//     const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
//     if (!isAdmin && booking.user_id !== req.user.id) {
//       await t.rollback();
//       return res.status(403).json({ status: 'fail', message: 'Unauthorized access to this booking' });
//     }

//     // 4. Check if already paid
//     if (booking.payment_status === 'paid') {
//       await t.rollback();
//       return res.status(400).json({ status: 'fail', message: 'This booking has already been paid for.' });
//     }

//     // 5. Initiate MPESA STK Push
//     const mpesaResponse = await mpesaService.lipaNaMpesaOnline(
//       phone_number,
//       amount,
//       account_reference || booking.booking_number,
//       'Tour Booking Payment'
//     );

//     if (!mpesaResponse.success) {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: mpesaResponse.error || 'Failed to initiate MPESA payment',
//         mpesaCode: mpesaResponse.responseCode
//       });
//     }

//     // 6. Create Payment Record (pending until callback confirms)
//     const payment = await Payment.create({
//       booking_id,
//       payment_method: 'mpesa',
//       amount,
//       currency: 'KES',
//       status: 'pending',
//       mpesa_checkout_request_id: mpesaResponse.checkoutRequestId,
//       mpesa_merchant_request_id: mpesaResponse.merchantRequestId,
//       transaction_id: mpesaResponse.checkoutRequestId // Temp ID until callback confirms
//     }, { transaction: t });

//     // 7. Update Booking Status to Pending Payment
//     await booking.update({ payment_status: 'pending' }, { transaction: t });

//     await t.commit();

//     logger.info('MPESA payment initiated', {
//       bookingNumber: booking.booking_number,
//       checkoutRequestId: mpesaResponse.checkoutRequestId,
//       amount,
//       phone: phone_number,
//       userId: req.user.id
//     });

//     res.status(201).json({
//       status: 'success',
//       message: 'MPESA STK Push sent successfully. Please check your phone.',
//       data: {
//         payment: {
//           id: payment.id,
//           status: payment.status,
//           amount: payment.amount,
//           currency: payment.currency
//         },
//         checkoutRequestId: mpesaResponse.checkoutRequestId,
//         customerMessage: mpesaResponse.customerMessage || 'Enter PIN on your phone to complete payment',
//         // Optional: Return polling endpoint for frontend
//         statusCheckUrl: `/api/v1/payments/status?checkout_request_id=${mpesaResponse.checkoutRequestId}`
//       }
//     });
//   } catch (err) {
//     await t.rollback();
//     logger.error('Initiate MPESA payment error', { 
//       error: err.message, 
//       stack: err.stack,
//       booking_id: req.body.booking_id 
//     });
//     res.status(500).json({
//       status: 'error',
//       message: process.env.NODE_ENV === 'development' ? err.message : 'Payment initiation failed'
//     });
//   }
// };

// // ===========================
// // @desc    MPESA STK Push Callback Handler
// // @route   POST /api/v1/payments/mpesa/callback
// // @access  Public (MPESA server only)
// // ===========================
// export const mpesaCallback = async (req, res) => {
//   logger.info('MPESA callback received', { body: req.body });
//   const t = await sequelize.transaction();
  
//   try {
//     // 🔐 SECURITY: In production, verify request IP is from Safaricom ranges
//     // if (process.env.MPESA_ENV === 'production' && !isSafaricomIP(req.ip)) {
//     //   logger.warn('MPESA callback from unauthorized IP', { ip: req.ip });
//     //   return res.status(403).json({ ResultCode: 1, ResultDesc: 'Unauthorized' });
//     // }

//     logger.debug('MPESA callback received', {
//       checkoutRequestId: req.body.Body?.stkCallback?.CheckoutRequestID,
//       resultCode: req.body.Body?.stkCallback?.ResultCode
//     });
    
//     const callbackResult = await mpesaService.handleCallback(req.body, t);

//     if (callbackResult.success) {
//       await t.commit();
//       // ✅ MPESA expects 200 OK with ResultCode: 0 to stop retries
//       res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
//     } else {
//       await t.rollback();
//       // Return 200 with error code to stop retries for logic errors we can't fix
//       res.status(200).json({ 
//         ResultCode: 1, 
//         ResultDesc: callbackResult.message || 'Processing failed' 
//       });
//     }
//   } catch (err) {
//     await t.rollback();
//     logger.error('MPESA callback error', { 
//       error: err.message, 
//       stack: err.stack,
//       checkoutRequestId: req.body.Body?.stkCallback?.CheckoutRequestID 
//     });
//     // Return 200 to stop retries for unfixable errors (prevent infinite loops)
//     // Or return 500 if you want MPESA to retry later for transient errors
//     res.status(200).json({ ResultCode: 1, ResultDesc: 'Server error' });
//   }
// };

// // ===========================
// // @desc    Initiate Stripe Card Payment
// // @route   POST /api/v1/payments/card
// // @access  Private (Authenticated users)
// // ===========================
// export const initiateCardPayment = async (req, res) => {
//   const t = await sequelize.transaction();
  
//   try {
//     const { booking_id, amount, currency = 'KES' } = req.body;

//     // Validate inputs
//     if (!booking_id || !amount || amount <= 0) {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Missing required fields: booking_id, amount (must be > 0)'
//       });
//     }

//     // Validate booking
//     const booking = await Booking.findByPk(booking_id, { transaction: t });
//     if (!booking) {
//       await t.rollback();
//       return res.status(404).json({ status: 'fail', message: 'Booking not found' });
//     }

//     // Verify ownership
//     const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
//     if (!isAdmin && booking.user_id !== req.user.id) {
//       await t.rollback();
//       return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
//     }

//     if (booking.payment_status === 'paid') {
//       await t.rollback();
//       return res.status(400).json({ status: 'fail', message: 'Booking already paid' });
//     }

//     // Create Stripe Payment Intent
//     const stripeResult = await stripeService.createPaymentIntent(
//       amount,
//       currency.toLowerCase(),
//       { booking_id, booking_number: booking.booking_number, user_id: req.user.id }
//     );

//     if (!stripeResult.success) {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: stripeResult.error || 'Failed to initiate card payment',
//         stripeCode: stripeResult.stripeCode
//       });
//     }

//     // Create Payment Record (pending until webhook confirms)
//     const payment = await Payment.create({
//       booking_id,
//       payment_method: 'card',
//       amount,
//       currency: currency.toUpperCase(),
//       status: 'pending',
//       transaction_id: stripeResult.paymentIntentId,
//       stripe_payment_intent_id: stripeResult.paymentIntentId
//     }, { transaction: t });

//     // Update booking
//     await booking.update({ payment_status: 'pending' }, { transaction: t });

//     await t.commit();

//     logger.info('Card payment initialized', {
//       paymentId: payment.id,
//       paymentIntentId: stripeResult.paymentIntentId,
//       amount,
//       bookingNumber: booking.booking_number,
//       userId: req.user.id
//     });

//     res.status(201).json({
//       status: 'success',
//       message: 'Card payment initialized',
//       data: {
//         payment: {
//           id: payment.id,
//           status: payment.status,
//           amount: payment.amount,
//           currency: payment.currency
//         },
//         clientSecret: stripeResult.clientSecret, // Send to frontend for Stripe Elements
//         paymentIntentId: stripeResult.paymentIntentId,
//         // Optional: Frontend polling endpoint
//         statusCheckUrl: `/api/v1/payments/status?payment_intent_id=${stripeResult.paymentIntentId}`
//       }
//     });
//   } catch (err) {
//     await t.rollback();
//     logger.error('Initiate card payment error', { 
//       error: err.message, 
//       stack: err.stack,
//       booking_id: req.body.booking_id 
//     });
//     res.status(500).json({ 
//       status: 'error', 
//       message: process.env.NODE_ENV === 'development' ? err.message : 'Payment initiation failed' 
//     });
//   }
// };

// // ===========================
// // @desc    Stripe Webhook Handler
// // @route   POST /api/v1/payments/stripe/webhook
// // @access  Public (Stripe server only)
// // ===========================
// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
  
//   try {
//     // ✅ CRITICAL: Raw body required for webhook signature verification
//     // Ensure express.raw({ type: 'application/json' }) middleware is applied BEFORE this route
//     const payload = req.rawBody || JSON.stringify(req.body);
    
//     logger.debug('Stripe webhook received', {
//       signature: sig ? 'present' : 'missing',
//       payloadLength: payload?.length
//     });
    
//     const result = await stripeService.handleWebhook(payload, sig);

//     if (result.success) {
//       // ✅ Stripe expects 200 OK to stop retries
//       res.status(200).json({ received: true, eventId: result.eventId });
//     } else {
//       // Return 400 for processing errors (Stripe may retry for transient errors)
//       res.status(400).json({ error: result.error });
//     }
//   } catch (err) {
//     logger.error('Stripe webhook error', { 
//       error: err.message, 
//       signature: sig ? 'present' : 'missing',
//       type: err.type
//     });
    
//     // ✅ Re-throw signature verification errors to trigger Stripe retry with proper HTTP status
//     if (err.type === 'StripeSignatureVerificationError') {
//       res.status(400).send(`Webhook signature verification failed: ${err.message}`);
//     } else {
//       // Return 500 for server errors (Stripe will retry with exponential backoff)
//       res.status(500).send(`Webhook processing error: ${err.message}`);
//     }
//   }
// };

// // ===========================
// // @desc    MPESA C2B Validation Endpoint
// // @route   POST /api/v1/payments/mpesa/c2b/validation
// // @access  Public (MPESA server only)
// // ===========================
// export const c2bValidation = async (req, res) => {
//   try {
//     logger.info('C2B Validation Request', { 
//       TransID: req.body.TransID,
//       Amount: req.body.TransAmount,
//       BillRefNumber: req.body.BillRefNumber,
//       MSISDN: req.body.Msisdn
//     });
    
//     // ✅ Always return success to allow payment to proceed
//     // Add custom validation logic here if needed:
//     // - Check if BillRefNumber matches a valid booking
//     // - Verify amount matches booking total (within tolerance)
//     // - Check for duplicate transactions
    
//     // Example validation (optional):
//     // if (req.body.BillRefNumber && !await isValidBookingRef(req.body.BillRefNumber)) {
//     //   return res.status(200).json({ ResultCode: 1, ResultDesc: 'Invalid booking reference' });
//     // }
    
//     res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
//   } catch (err) {
//     logger.error('C2B Validation Error', { error: err.message, stack: err.stack });
//     // Return success anyway to avoid blocking legitimate payments for server errors
//     res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
//   }
// };

// // ===========================
// // @desc    MPESA C2B Confirmation Endpoint
// // @route   POST /api/v1/payments/mpesa/c2b/confirmation
// // @access  Public (MPESA server only)
// // ===========================
// export const c2bConfirmation = async (req, res) => {
//   const t = await sequelize.transaction();
  
//   try {
//     const {
//       TransID,
//       TransTime,
//       TransAmount,
//       Msisdn,
//       BillRefNumber,
//       OrgShortCode,
//       ResultCode,
//       ResultDesc
//     } = req.body;

//     logger.info('C2B Confirmation', { 
//       TransID, 
//       BillRefNumber, 
//       TransAmount,
//       ResultCode,
//       Msisdn
//     });

//     if (ResultCode !== 0) {
//       logger.warn('C2B Payment failed', { TransID, ResultDesc, ResultCode });
//       res.status(200).json({ ResultCode: 0, ResultDesc: 'Received' });
//       return;
//     }

//     // ✅ Find booking by BillRefNumber (should match booking_number)
//     const booking = await Booking.findOne({
//       where: { booking_number: BillRefNumber },
//       transaction: t
//     });

//     if (!booking) {
//       logger.warn('Booking not found for C2B payment', { BillRefNumber });
//       // Still return success to MPESA to stop retries for unknown references
//       res.status(200).json({ ResultCode: 0, ResultDesc: 'Received' });
//       return;
//     }

//     // ✅ IDEMPOTENCY: Check for duplicate transaction (prevent double-processing)
//     const existingPayment = await Payment.findOne({
//       where: { transaction_id: TransID },
//       transaction: t
//     });

//     if (existingPayment) {
//       logger.info('Duplicate C2B payment ignored (idempotent)', { TransID });
//       res.status(200).json({ ResultCode: 0, ResultDesc: 'Received' });
//       return;
//     }

//     // Create payment record
//     await Payment.create({
//       booking_id: booking.id,
//       payment_method: 'mpesa',
//       transaction_id: TransID,
//       amount: TransAmount,
//       currency: 'KES',
//       status: 'completed',
//       mpesa_result_code: ResultCode,
//       mpesa_result_desc: ResultDesc,
//       paid_at: new Date(),
//       // Optional: Store C2B-specific metadata for audit/reconciliation
//       mpesa_phone: Msisdn,
//       mpesa_transaction_date: TransTime
//     }, { transaction: t });

//     // Update booking status
//     await booking.update({
//       payment_status: 'paid',
//       status: 'confirmed'
//     }, { transaction: t });

//     await t.commit();

//     logger.info('C2B Payment confirmed successfully', { 
//       TransID, 
//       bookingNumber: BillRefNumber,
//       amount: TransAmount,
//       customerPhone: Msisdn
//     });
    
//     res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
//   } catch (err) {
//     await t.rollback();
//     logger.error('C2B Confirmation Error', { error: err.message, stack: err.stack });
//     // Return 200 with error code to stop MPESA retries for unfixable errors
//     res.status(200).json({ ResultCode: 1, ResultDesc: 'Processing failed' });
//   }
// };

// // ===========================
// // @desc    Verify Payment Status
// // @route   GET /api/v1/payments/verify/:transactionId
// // @access  Private (Authenticated users)
// // ===========================
// export const verifyPayment = async (req, res) => {
//   try {
//     const payment = await Payment.findOne({
//       where: { 
//         [Op.or]: [
//           { transaction_id: req.params.transactionId },
//           { mpesa_checkout_request_id: req.params.transactionId },
//           { stripe_payment_intent_id: req.params.transactionId }
//         ]
//       },
//       include: [{
//         model: Booking,
//         as: 'Booking', // ✅ Must match association alias in models/index.js
//         attributes: ['id', 'booking_number', 'status', 'payment_status', 'total_amount', 'user_id']
//       }]
//     });

//     if (!payment) {
//       return res.status(404).json({ status: 'fail', message: 'Payment not found' });
//     }

//     // ✅ SAFE: Permission check with optional chaining
//     const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
//     if (!isAdmin && payment.Booking?.user_id !== req.user.id) {
//       return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
//     }

//     // ✅ Verify Booking association loaded correctly
//     if (!payment.Booking) {
//       logger.warn('Payment has no associated booking', { paymentId: payment.id });
//       return res.status(400).json({ status: 'fail', message: 'Invalid payment record' });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: { 
//         payment: {
//           id: payment.id,
//           status: payment.status,
//           payment_method: payment.payment_method,
//           amount: payment.amount,
//           currency: payment.currency,
//           transaction_id: payment.transaction_id,
//           booking_number: payment.Booking.booking_number,
//           created_at: payment.created_at,
//           updated_at: payment.updated_at,
//           paid_at: payment.paid_at,
//           // MPESA-specific fields
//           mpesa_result_code: payment.mpesa_result_code,
//           mpesa_result_desc: payment.mpesa_result_desc,
//           mpesa_checkout_request_id: payment.mpesa_checkout_request_id,
//           // Stripe-specific fields
//           stripe_payment_intent_id: payment.stripe_payment_intent_id,
//           stripe_charge_id: payment.stripe_charge_id,
//           card_brand: payment.card_brand,
//           card_last4: payment.card_last4
//         }
//       }
//     });
//   } catch (err) {
//     logger.error('Verify payment error', { error: err.message, transactionId: req.params.transactionId });
//     res.status(500).json({ status: 'error', message: 'Verification failed' });
//   }
// };

// // ===========================
// // @desc    Get Payment History
// // @route   GET /api/v1/payments/history
// // @access  Private (Authenticated users)
// // ===========================
// export const getPaymentHistory = async (req, res) => {
//   try {
//     const queryOptions = {
//       where: {},
//       include: [{
//         model: Booking,
//         as: 'Booking', // ✅ Match association alias
//         attributes: ['id', 'booking_number', 'total_amount', 'user_id']
//       }],
//       order: [['created_at', 'DESC']],
//       attributes: {
//         exclude: [] // Add fields to exclude if needed for security
//       }
//     };

//     // For regular users, only show their own payments
//     if (req.user.role === 'client') {
//       queryOptions.include[0].where = { user_id: req.user.id };
//       queryOptions.include[0].required = true; // Inner join to filter
//     } else if (!['admin', 'super_admin'].includes(req.user.role)) {
//        return res.status(403).json({ status: 'fail', message: 'Access denied' });
//     }

//     // Filter by payment method
//     if (req.query.payment_method && ['mpesa', 'card', 'bank_transfer'].includes(req.query.payment_method)) {
//       queryOptions.where.payment_method = req.query.payment_method;
//     }

//     // Filter by status
//     if (req.query.status && ['pending', 'completed', 'failed', 'refunded'].includes(req.query.status)) {
//       queryOptions.where.status = req.query.status;
//     }

//     // Date range filter (optional)
//     if (req.query.start_date || req.query.end_date) {
//       queryOptions.where.created_at = {};
//       if (req.query.start_date) {
//         queryOptions.where.created_at[Op.gte] = new Date(req.query.start_date);
//       }
//       if (req.query.end_date) {
//         queryOptions.where.created_at[Op.lte] = new Date(req.query.end_date);
//       }
//     }

//     // Pagination with limits to prevent abuse
//     const page = Math.max(1, parseInt(req.query.page) || 1);
//     const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Clamp 1-100
//     const offset = (page - 1) * limit;

//     queryOptions.limit = limit;
//     queryOptions.offset = offset;

//     const { count, rows: payments } = await Payment.findAndCountAll(queryOptions);

//     res.status(200).json({
//       status: 'success',
//       results: payments.length,
//       total: count,
//       page,
//       pages: Math.ceil(count / limit),
//       data: { 
//         payments: payments.map(p => ({
//           id: p.id,
//           payment_method: p.payment_method,
//           amount: p.amount,
//           currency: p.currency,
//           status: p.status,
//           transaction_id: p.transaction_id,
//           booking_number: p.Booking?.booking_number,
//           created_at: p.created_at,
//           paid_at: p.paid_at,
//           refunded_at: p.refunded_at,
//           // Include card details (masked) for receipts
//           card_brand: p.card_brand,
//           card_last4: p.card_last4 ? `****${p.card_last4}` : null
//         }))
//       }
//     });
//   } catch (err) {
//     logger.error('Get payment history error', { error: err.message, userId: req.user?.id });
//     res.status(500).json({ status: 'error', message: 'Failed to retrieve payment history' });
//   }
// };

// // ===========================
// // @desc    Process Refund (Admin Only)
// // @route   POST /api/v1/payments/:id/refund
// // @access  Private (Admin/Super Admin only)
// // ===========================
// export const processRefund = async (req, res) => {
//   const t = await sequelize.transaction();
  
//   try {
//     // 1. Admin Authorization Check
//     if (!['admin', 'super_admin'].includes(req.user.role)) {
//       await t.rollback();
//       return res.status(403).json({ status: 'fail', message: 'Access denied. Admin privileges required.' });
//     }

//     const payment = await Payment.findByPk(req.params.id, {
//       include: [{ model: Booking, as: 'Booking' }], // ✅ Use association alias
//       transaction: t
//     });

//     if (!payment) {
//       await t.rollback();
//       return res.status(404).json({ status: 'fail', message: 'Payment not found' });
//     }

//     // ✅ Safe Booking access check
//     if (!payment.Booking) {
//       await t.rollback();
//       return res.status(400).json({ status: 'fail', message: 'Payment has no associated booking' });
//     }

//     // 2. Validation: Only completed payments can be refunded
//     if (payment.status !== 'completed') {
//       await t.rollback();
//       return res.status(400).json({ status: 'fail', message: 'Only completed payments can be refunded' });
//     }

//     // 3. Process ACTUAL Refund via payment provider
//     let refundResult;
//     const refundReason = req.body.reason || 'requested_by_customer';
    
//     if (payment.payment_method === 'mpesa') {
//       // ✅ Get customer phone for B2C refund
//       // Option A: From booking passenger (adjust query based on your schema)
//       const { BookingPassenger } = await import('../models/index.js');
//       const passenger = await BookingPassenger.findOne({
//         where: { booking_id: payment.booking_id },
//         attributes: ['phone'],
//         order: [['id', 'ASC']], // Get first passenger
//         transaction: t
//       });
      
//       const customerPhone = passenger?.phone || req.body.customer_phone;
      
//       if (!customerPhone) {
//         await t.rollback();
//         return res.status(400).json({ 
//           status: 'fail', 
//           message: 'Customer phone number required for MPESA refund. Provide customer_phone in request body.' 
//         });
//       }

//       // Call MPESA B2C API to send money back
//       refundResult = await mpesaService.b2cRefund(
//         customerPhone,
//         payment.amount,
//         `Refund for booking ${payment.Booking.booking_number}`,
//         'TourRefund'
//       );
      
//       if (!refundResult.success) {
//         await t.rollback();
//         return res.status(400).json({
//           status: 'fail',
//           message: `MPESA refund failed: ${refundResult.error}`,
//           mpesaResponse: {
//             error: refundResult.error,
//             conversationId: refundResult.conversationId
//           }
//         });
//       }
      
//       logger.info('MPESA B2C refund initiated', {
//         paymentId: payment.id,
//         conversationId: refundResult.conversationId,
//         amount: payment.amount,
//         customerPhone
//       });
      
//     } else if (payment.payment_method === 'card') {
//       // Call Stripe Refund API
//       const stripeId = payment.stripe_payment_intent_id || payment.transaction_id;
      
//       if (!stripeId) {
//         await t.rollback();
//         return res.status(400).json({ 
//           status: 'fail', 
//           message: 'Cannot refund: No Stripe payment intent ID found' 
//         });
//       }

//       refundResult = await stripeService.refundPayment(
//         stripeId,
//         payment.amount,
//         refundReason
//       );
      
//       if (!refundResult.success) {
//         await t.rollback();
//         return res.status(400).json({
//           status: 'fail',
//           message: `Stripe refund failed: ${refundResult.error}`,
//           stripeResponse: {
//             error: refundResult.error,
//             stripeCode: refundResult.stripeCode
//           }
//         });
//       }
      
//       logger.info('Stripe refund initiated', {
//         paymentId: payment.id,
//         refundId: refundResult.refundId,
//         amount: payment.amount,
//         paymentIntentId: stripeId
//       });
//     } else {
//       // Bank transfer or other methods: manual refund workflow
//       logger.warn('Manual refund required for payment method', {
//         paymentId: payment.id,
//         method: payment.payment_method
//       });
      
//       // For now, just update status (admin should process refund externally)
//       refundResult = { success: true, manual: true };
//     }

//     // 4. Update Records (ONLY after successful refund initiation)
//     await payment.update({
//       status: 'refunded',
//       refunded_at: new Date(),
//       // Store refund reference for audit trail
//       transaction_id: refundResult.transactionId || refundResult.refundId || refundResult.conversationId || payment.transaction_id
//     }, { transaction: t });

//     await payment.Booking.update({
//       payment_status: 'refunded',
//       status: 'cancelled' // Automatically cancel booking when refunded
//     }, { transaction: t });

//     await t.commit();

//     logger.info('Payment refunded successfully', {
//       paymentId: payment.id,
//       transactionId: payment.transaction_id,
//       bookingNumber: payment.Booking.booking_number,
//       amount: payment.amount,
//       method: payment.payment_method,
//       refundedBy: req.user.email,
//       refundReference: refundResult.refundId || refundResult.conversationId
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Refund processed successfully',
//       data: { 
//         payment: {
//           id: payment.id,
//           status: payment.status,
//           refunded_at: payment.refunded_at,
//           refund_reference: refundResult.refundId || refundResult.conversationId,
//           amount: payment.amount,
//           currency: payment.currency
//         },
//         // Return provider-specific reference for tracking
//         mpesa: payment.payment_method === 'mpesa' ? {
//           conversationId: refundResult.conversationId
//         } : undefined,
//         stripe: payment.payment_method === 'card' ? {
//           refundId: refundResult.refundId
//         } : undefined
//       }
//     });
//   } catch (err) {
//     await t.rollback();
//     logger.error('Process refund error', { 
//       error: err.message, 
//       stack: err.stack,
//       paymentId: req.params.id,
//       userId: req.user?.id 
//     });
//     res.status(400).json({
//       status: 'fail',
//       message: process.env.NODE_ENV === 'development' ? err.message : 'Refund processing failed'
//     });
//   }
// };

// // ===========================
// // @desc    Unified Payment Status Check
// // @route   GET /api/v1/payments/status
// // @access  Private (Authenticated users)
// // ===========================
// export const checkPaymentStatus = async (req, res) => {
//   try {
//     const { payment_id, checkout_request_id, payment_intent_id } = req.query;

//     let payment;
    
//     // Determine lookup method based on provided identifier
//     if (payment_id) {
//       payment = await Payment.findByPk(payment_id, {
//         include: [{ model: Booking, as: 'Booking', attributes: ['booking_number', 'payment_status', 'user_id'] }]
//       });
//     } else if (checkout_request_id) {
//       payment = await Payment.findOne({
//         where: { mpesa_checkout_request_id: checkout_request_id },
//         include: [{ model: Booking, as: 'Booking', attributes: ['booking_number', 'payment_status', 'user_id'] }]
//       });
//     } else if (payment_intent_id) {
//       payment = await Payment.findOne({
//         where: { stripe_payment_intent_id: payment_intent_id },
//         include: [{ model: Booking, as: 'Booking', attributes: ['booking_number', 'payment_status', 'user_id'] }]
//       });
//     } else {
//       return res.status(400).json({ 
//         status: 'fail', 
//         message: 'Provide one of: payment_id, checkout_request_id, or payment_intent_id' 
//       });
//     }

//     if (!payment) {
//       return res.status(404).json({ status: 'fail', message: 'Payment not found' });
//     }

//     // ✅ SAFE: Permission check with optional chaining
//     const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
//     if (!isAdmin && payment.Booking?.user_id !== req.user.id) {
//       return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
//     }

//     // ✅ Verify Booking association loaded
//     if (!payment.Booking) {
//       logger.warn('Payment has no associated booking', { paymentId: payment.id });
//       return res.status(400).json({ status: 'fail', message: 'Invalid payment record' });
//     }

//     // For pending MPESA payments, optionally query MPESA for latest status (polling fallback, rate-limited)
//     if (payment.status === 'pending' && 
//         payment.payment_method === 'mpesa' && 
//         payment.mpesa_checkout_request_id) {
      
//       logger.debug('Querying MPESA status (rate-limited)', {
//         checkoutRequestId: payment.mpesa_checkout_request_id,
//         paymentId: payment.id
//       });

//       const mpesaStatus = await mpesaService.querySTKStatus(payment.mpesa_checkout_request_id);
      
//       // Optional: Auto-update local status if MPESA reports completion
//       // (Be careful with race conditions - callbacks are source of truth)
//       if (mpesaStatus.success && mpesaStatus.data?.status === 'completed') {
//         // Could trigger async status sync here, but prefer letting callback handle it
//         logger.debug('MPESA polling shows completed, awaiting callback', {
//           checkoutRequestId: payment.mpesa_checkout_request_id,
//           resultCode: mpesaStatus.data?.resultCode
//         });
//       } else if (mpesaStatus.success) {
//         logger.debug('MPESA polling returned status', {
//           checkoutRequestId: payment.mpesa_checkout_request_id,
//           status: mpesaStatus.data?.status,
//           resultCode: mpesaStatus.data?.resultCode
//         });
//       } else {
//         logger.warn('MPESA query failed or rate-limited', {
//           checkoutRequestId: payment.mpesa_checkout_request_id,
//           error: mpesaStatus.error,
//           statusCode: mpesaStatus.statusCode
//         });
//       }
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         payment: {
//           id: payment.id,
//           status: payment.status,
//           payment_method: payment.payment_method,
//           amount: payment.amount,
//           currency: payment.currency,
//           transaction_id: payment.transaction_id,
//           booking_number: payment.Booking.booking_number,
//           created_at: payment.created_at,
//           updated_at: payment.updated_at,
//           paid_at: payment.paid_at,
//           refunded_at: payment.refunded_at,
//           // MPESA-specific fields
//           mpesa_result_code: payment.mpesa_result_code,
//           mpesa_result_desc: payment.mpesa_result_desc,
//           mpesa_checkout_request_id: payment.mpesa_checkout_request_id,
//           // Stripe-specific fields
//           stripe_payment_intent_id: payment.stripe_payment_intent_id,
//           stripe_charge_id: payment.stripe_charge_id,
//           card_brand: payment.card_brand,
//           card_last4: payment.card_last4 ? `****${payment.card_last4}` : null,
//           // Helpful frontend fields
//           canPoll: payment.status === 'pending' && payment.payment_method === 'mpesa',
//           nextPollIn: payment.status === 'pending' ? 5000 : null // Suggest 5s polling interval
//         }
//       }
//     });
//   } catch (err) {
//     logger.error('Check payment status error', { error: err.message, query: req.query });
//     res.status(500).json({ status: 'error', message: 'Status check failed' });
//   }
// };

// // 🆕 NEW: Initiate C2B Payment (PayBill/Till Manual Payment)
// // export const initiateC2BPayment = async (req, res, next) => {
// //   console.log('Initiate C2B payment request received', {
// //     bookingId: req.params.bookingId,
// //     body: req.body,
// //     userId: req.user.id
// //   });
  
// //   try {
// //     const { bookingId } = req.params;
// //     const { phone, amount, account_reference } = req.body;
// //     const userId = req.user.id;

// //     const phone_number = phone || req.body?.phone; // Support both 'phone' and 'phone_number' for flexibility
 

// //     // 1. Validate input
// //     if (!phone_number || !amount) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Phone number and amount are required'
// //       });
// //     }

// //     // 2. Validate phone format (Kenyan)
// //     const phoneRegex = /^254\d{9}$/;
// //     if (!phoneRegex.test(phone_number)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid phone number format. Use 2547XXXXXXXX'
// //       });
// //     }

// //     // 3. Fetch booking & validate ownership + status
// //     const booking = await Booking.findByPk(bookingId);
// //     if (!booking) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Booking not found'
// //       });
// //     }
    
// //     if (booking.user.toString() !== userId) {
// //       return res.status(403).json({
// //         success: false,
// //         message: 'Not authorized to pay for this booking'
// //       });
// //     }

// //     if (booking.payment_status === 'paid') {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'This booking is already paid'
// //       });
// //     }

// //     // 4. Generate C2B instructions (PayBill or Till)
// //     // 🔧 Replace with your actual Safaricom Daraja C2B logic
// //     const c2bConfig = {
// //       shortcode: process.env.MPESA_C2B_SHORTCODE, // e.g., "123456"
// //       accountRef: account_reference || booking.booking_number,
// //       amount: amount || booking.total_amount,
// //       type: process.env.MPESA_C2B_TYPE || 'PayBill', // 'PayBill' or 'Till'
// //       expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
// //     };

// //     // 5. Create payment record in database
// //     const payment = await Payment.create({
// //       booking: bookingId,
// //       user: userId,
// //       method: 'c2b',
// //       amount: c2bConfig.amount,
// //       currency: 'KES',
// //       status: 'pending',
// //       c2b_data: {
// //         shortcode: c2bConfig.shortcode,
// //         account_ref: c2bConfig.accountRef,
// //         type: c2bConfig.type,
// //         expires_at: c2bConfig.expiresAt,
// //       },
// //       phone_number,
// //       transaction_reference: `C2B_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
// //     });

// //     // 6. Return instructions to frontend
// //     res.status(201).json({
// //       success: true,
// //       message: 'C2B payment instructions generated',
// //       data: {
// //         paymentId: payment._id,
// //         shortcode: c2bConfig.shortcode,
// //         accountRef: c2bConfig.accountRef,
// //         amount: c2bConfig.amount,
// //         type: c2bConfig.type,
// //         expiresAt: c2bConfig.expiresAt,
// //         instructions: `Go to Lipa na M-Pesa → ${c2bConfig.type === 'PayBill' ? 'PayBill' : 'Buy Goods'} → Enter ${c2bConfig.shortcode} → ${c2bConfig.accountRef ? `Account: ${c2bConfig.accountRef} → ` : ''}Amount: ${c2bConfig.amount} → Enter PIN`,
// //       }
// //     });

// //   } catch (error) {
// //     console.error('C2B Payment Initiation Error:', error);
// //     next(error);
// //   }
// // };

// export const initiateC2BPayment = async (req, res, next) => {
//   console.log('Initiate C2B payment request received', {
//     bookingId: req.params.bookingId,
//     body: req.body,
//     userId: req.user?.id
//   });
  
//   try {
//     const { bookingId } = req.params;
//     const { phone, amount, account_reference } = req.body;
//     const userId = req.user?.id;

//     // 🔧 Clean phone extraction
//     const phone_number = phone;

//     // 🔧 Parse amount to number (handles string "85000.00")
//     const finalAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

//     // 1. Validate input
//     if (!phone_number) {
//       return res.status(400).json({
//         success: false,
//         message: 'Phone number is required',
//         hint: 'Send field as "phone" with value like 2547XXXXXXXX'
//       });
//     }

//     if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid amount is required',
//         hint: 'Send amount as a number or numeric string (e.g., 85000 or "85000.00")'
//       });
//     }

//     // 2. Validate phone format (Kenyan)
//     const phoneRegex = /^254\d{9}$/;
//     if (!phoneRegex.test(phone_number)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid phone number format',
//         hint: 'Use format: 2547XXXXXXXX (e.g., 254793720489)',
//         received: phone_number
//       });
//     }

//     // 3. Fetch booking & validate ownership + status
//     const booking = await Booking.findByPk(bookingId, {
//       attributes: ['id', 'booking_number', 'payment_status', 'total_amount', 'user_id']
//     });
    
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found',
//         bookingId
//       });
//     }
    
//     // Handle Sequelize model field access
//     const bookingUserId = booking.user_id || booking.getDataValue?.('user_id');
//     if (bookingUserId?.toString() !== userId?.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to pay for this booking'
//       });
//     }

//     const bookingPaymentStatus = booking.payment_status || booking.getDataValue?.('payment_status');
//     if (bookingPaymentStatus === 'paid') {
//       return res.status(400).json({
//         success: false,
//         message: 'This booking is already paid'
//       });
//     }

//     // 4. Generate C2B instructions (PayBill or Till)
//     const c2bConfig = {
//       shortcode: process.env.MPESA_SHORTCODE || '174379',
//       accountRef: account_reference || booking.booking_number || booking.getDataValue?.('booking_number'),
//       amount: finalAmount,
//       type: process.env.MPESA_C2B_TYPE || 'PayBill',
//       expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
//     };

//     // 🔧 Generate unique trans_id for C2BPayment record
//     const transId = `C2B_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

//     // 5. Create C2BPayment record using YOUR model fields
//     const c2bPayment = await C2BPayment.create({
//       trans_id: transId,                           // ✅ Unique transaction ID
//       trans_type: c2bConfig.type,                  // ✅ 'PayBill' or 'Till'
//       trans_time: Date.now(),                      // ✅ Timestamp in milliseconds
//       trans_amount: c2bConfig.amount,              // ✅ Amount to pay
//       business_shortcode: c2bConfig.shortcode,     // ✅ PayBill/Till number
//       msisdn: phone_number,                        // ✅ Customer phone
//       account_number: c2bConfig.accountRef,        // ✅ Account reference (BillRefNumber)
//       org_account_balance: 0,                      // ✅ Placeholder (updated by callback)
      
//       // Link to booking
//       booking_id: bookingId,                       // ✅ Foreign key to bookings table
      
//       // Initial status for instruction record
//       status: 'completed',                         // ✅ Default: instruction generated
//       match_confidence: 'high',                    // ✅ We generated this, so high confidence
      
//       // Store full config for frontend reference + callback matching
//       raw_callback: {                              // ✅ JSONB field for flexible data
//         instructions: `Go to Lipa na M-Pesa → ${c2bConfig.type} → Enter ${c2bConfig.shortcode} → ${c2bConfig.accountRef ? `Account: ${c2bConfig.accountRef} → ` : ''}Amount: ${c2bConfig.amount} → Enter PIN`,
//         expiresAt: c2bConfig.expiresAt,
//         booking_number: booking.booking_number || booking.getDataValue?.('booking_number'),
//         initiated_by: userId,
//         initiated_at: new Date().toISOString(),
//       },
      
//       processed_at: new Date(),                    // ✅ Mark as processed immediately
//     });

//     // 6. Return instructions to frontend
//     res.status(201).json({
//       success: true,
//       message: 'C2B payment instructions generated',
//       data: {
//         paymentId: c2bPayment.id,
//         transId: c2bPayment.trans_id,              // ✅ Return the unique trans_id
//         shortcode: c2bConfig.shortcode,
//         accountRef: c2bConfig.accountRef,
//         amount: c2bConfig.amount,
//         type: c2bConfig.type,
//         expiresAt: c2bConfig.expiresAt,
//         instructions: c2bPayment.raw_callback?.instructions,
//         // Helpful for polling
//         canPoll: true,
//         nextPollIn: 5000,
//       }
//     });

//   } catch (error) {
//     console.error('C2B Payment Initiation Error:', {
//       name: error.name,
//       message: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
    
//     // Handle Sequelize validation errors
//     if (error.name === 'SequelizeValidationError' || error.name === 'ValidationError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid payment data',
//         details: error.errors?.map(err => err.message) || [error.message]
//       });
//     }
    
//     // Handle Sequelize unique constraint errors (trans_id collision)
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(409).json({
//         success: false,
//         message: 'Payment instruction already exists. Please try again.'
//       });
//     }
    
//     next(error);
//   }
// };

// export const initiateC2BPaymentCallback = async (req, res, next) => {
//   try {
//     const { Body: { stkCallback } } = req.body;
//     const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

//     // Find payment by checkout request ID
//     const payment = await Payment.findOne({ 'c2b_data.checkout_request_id': CheckoutRequestID });
//     if (!payment) {
//       return res.status(404).json({ ResultCode: 404, ResultDesc: 'Payment not found' });
//     }

//     // Update payment status based on Safaricom response
//     if (ResultCode === 0) {
//       payment.status = 'completed';
//       payment.c2b_data.confirmed_at = new Date();
//       await payment.save();
      
//       // Update booking status
//       await Booking.findByIdAndUpdate(payment.booking, {
//         payment_status: 'paid',
//         paid_at: new Date()
//       });
//     } else {
//       payment.status = 'failed';
//       payment.c2b_data.failure_reason = ResultDesc;
//       await payment.save();
//     }

//     // Acknowledge receipt to Safaricom
//     res.json({ ResultCode: 0, ResultDesc: 'Success' });

//   } catch (error) {
//     console.error('C2B Callback Error:', error);
//     res.status(500).json({ ResultCode: 500, ResultDesc: 'Internal server error' });
//   }
// };





import { Payment, Booking, sequelize, Op, C2BPayment, BookingPassenger } from '../models/index.js';
import mpesaService from '../services/MpesaService.js';
import stripeService from '../services/stripeService.js';
import logger from '../utils/logger.js';
// ✅ Import Redis helpers
import { getOrSetCache, invalidateCache, invalidatePattern } from '../config/redis.js';

// ===========================
// @desc    Initiate MPESA STK Push Payment
// @route   POST /api/v1/payments/mpesa
// @access  Private
// ===========================
export const initiateMPESAPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { booking_id, phone_number, amount, account_reference } = req.body;

    if (!booking_id || !phone_number || !amount || amount <= 0) {
      await t.rollback();
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const booking = await Booking.findByPk(booking_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'Booking not found' });
    }

    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
    if (!isAdmin && booking.user_id !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    }

    if (booking.payment_status === 'paid') {
      await t.rollback();
      return res.status(400).json({ status: 'fail', message: 'Already paid' });
    }

    const mpesaResponse = await mpesaService.lipaNaMpesaOnline(phone_number, amount, account_reference || booking.booking_number, 'Tour Booking Payment');

    if (!mpesaResponse.success) {
      await t.rollback();
      return res.status(400).json({ status: 'fail', message: mpesaResponse.error || 'Failed to initiate MPESA payment' });
    }

    const payment = await Payment.create({
      booking_id,
      payment_method: 'mpesa',
      amount,
      currency: 'KES',
      status: 'pending',
      mpesa_checkout_request_id: mpesaResponse.checkoutRequestId,
      mpesa_merchant_request_id: mpesaResponse.merchantRequestId,
      transaction_id: mpesaResponse.checkoutRequestId
    }, { transaction: t });

    await booking.update({ payment_status: 'pending' }, { transaction: t });
    await t.commit();

    logger.info('MPESA payment initiated', { bookingNumber: booking.booking_number, checkoutRequestId: mpesaResponse.checkoutRequestId });

    // 🚀 Invalidate Caches
    await invalidatePattern(`payments:history:${booking.user_id}:*`);
    await invalidateCache(`payment:status:${mpesaResponse.checkoutRequestId}`);

    res.status(201).json({
      status: 'success',
      message: 'MPESA STK Push sent successfully.',
      data: {
        payment: { id: payment.id, status: payment.status, amount: payment.amount, currency: payment.currency },
        checkoutRequestId: mpesaResponse.checkoutRequestId,
        customerMessage: mpesaResponse.customerMessage || 'Enter PIN on your phone',
        statusCheckUrl: `/api/v1/payments/status?checkout_request_id=${mpesaResponse.checkoutRequestId}`
      }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Initiate MPESA payment error', { error: err.message });
    res.status(500).json({ status: 'error', message: 'Payment initiation failed' });
  }
};

// ===========================
// @desc    MPESA STK Push Callback Handler
// @route   POST /api/v1/payments/mpesa/callback
// @access  Public
// ===========================
export const mpesaCallback = async (req, res) => {
  logger.info('MPESA callback received', { body: req.body });
  const t = await sequelize.transaction();
  try {
    const callbackResult = await mpesaService.handleCallback(req.body, t);
    
    if (callbackResult.success) {
      await t.commit();
      
      // 🚀 Invalidate Caches on Success
      if (callbackResult.bookingId) {
        const booking = await Booking.findByPk(callbackResult.bookingId);
        if (booking) {
          await invalidatePattern(`payments:history:${booking.user_id}:*`);
          await invalidateCache(`payment:status:${callbackResult.checkoutRequestId}`);
          await invalidateCache(`booking:single:${booking.id}`);
          await invalidatePattern(`bookings:user:${booking.user_id}:*`);
        }
      }
      
      res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    } else {
      await t.rollback();
      res.status(200).json({ ResultCode: 1, ResultDesc: callbackResult.message || 'Processing failed' });
    }
  } catch (err) {
    await t.rollback();
    logger.error('MPESA callback error', { error: err.message });
    res.status(200).json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
};

// ===========================
// @desc    Initiate Stripe Card Payment
// @route   POST /api/v1/payments/card
// @access  Private
// ===========================
export const initiateCardPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { booking_id, amount, currency = 'KES' } = req.body;

    if (!booking_id || !amount || amount <= 0) {
      await t.rollback();
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const booking = await Booking.findByPk(booking_id, { transaction: t });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'Booking not found' });
    }

    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
    if (!isAdmin && booking.user_id !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ status: 'fail', message: 'Unauthorized' });
    }

    if (booking.payment_status === 'paid') {
      await t.rollback();
      return res.status(400).json({ status: 'fail', message: 'Already paid' });
    }

    const stripeResult = await stripeService.createPaymentIntent(amount, currency.toLowerCase(), { booking_id, booking_number: booking.booking_number, user_id: req.user.id });

    if (!stripeResult.success) {
      await t.rollback();
      return res.status(400).json({ status: 'fail', message: stripeResult.error });
    }

    const payment = await Payment.create({
      booking_id,
      payment_method: 'card',
      amount,
      currency: currency.toUpperCase(),
      status: 'pending',
      transaction_id: stripeResult.paymentIntentId,
      stripe_payment_intent_id: stripeResult.paymentIntentId
    }, { transaction: t });

    await booking.update({ payment_status: 'pending' }, { transaction: t });
    await t.commit();

    logger.info('Card payment initialized', { paymentIntentId: stripeResult.paymentIntentId });

    // 🚀 Invalidate Caches
    await invalidatePattern(`payments:history:${booking.user_id}:*`);
    await invalidateCache(`payment:status:${stripeResult.paymentIntentId}`);

    res.status(201).json({
      status: 'success',
      message: 'Card payment initialized',
      data: {
        payment: { id: payment.id, status: payment.status, amount: payment.amount, currency: payment.currency },
        clientSecret: stripeResult.clientSecret,
        paymentIntentId: stripeResult.paymentIntentId
      }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Initiate card payment error', { error: err.message });
    res.status(500).json({ status: 'error', message: 'Payment initiation failed' });
  }
};

// ===========================
// @desc    Stripe Webhook Handler
// @route   POST /api/v1/payments/stripe/webhook
// @access  Public
// ===========================
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const payload = req.rawBody || JSON.stringify(req.body);
    const result = await stripeService.handleWebhook(payload, sig);

    if (result.success) {
      // 🚀 Invalidate Caches on Success
      if (result.bookingId) {
        const booking = await Booking.findByPk(result.bookingId);
        if (booking) {
          await invalidatePattern(`payments:history:${booking.user_id}:*`);
          await invalidateCache(`payment:status:${result.paymentIntentId}`);
          await invalidateCache(`booking:single:${booking.id}`);
          await invalidatePattern(`bookings:user:${booking.user_id}:*`);
        }
      }
      res.status(200).json({ received: true, eventId: result.eventId });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    logger.error('Stripe webhook error', { error: err.message });
    if (err.type === 'StripeSignatureVerificationError') {
      res.status(400).send(`Webhook signature verification failed: ${err.message}`);
    } else {
      res.status(500).send(`Webhook processing error: ${err.message}`);
    }
  }
};

// ===========================
// @desc    MPESA C2B Validation Endpoint
// @route   POST /api/v1/payments/mpesa/c2b/validation
// @access  Public
// ===========================
export const c2bValidation = async (req, res) => {
  try {
    logger.info('C2B Validation Request', { TransID: req.body.TransID, BillRefNumber: req.body.BillRefNumber });
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    logger.error('C2B Validation Error', { error: err.message });
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
};

// ===========================
// @desc    MPESA C2B Confirmation Endpoint
// @route   POST /api/v1/payments/mpesa/c2b/confirmation
// @access  Public
// ===========================
export const c2bConfirmation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { TransID, TransTime, TransAmount, Msisdn, BillRefNumber, ResultCode } = req.body;

    if (ResultCode !== 0) {
      logger.warn('C2B Payment failed', { TransID, ResultCode });
      res.status(200).json({ ResultCode: 0, ResultDesc: 'Received' });
      return;
    }

    const booking = await Booking.findOne({ where: { booking_number: BillRefNumber }, transaction: t });
    if (!booking) {
      logger.warn('Booking not found for C2B payment', { BillRefNumber });
      res.status(200).json({ ResultCode: 0, ResultDesc: 'Received' });
      return;
    }

    const existingPayment = await Payment.findOne({ where: { transaction_id: TransID }, transaction: t });
    if (existingPayment) {
      logger.info('Duplicate C2B payment ignored', { TransID });
      res.status(200).json({ ResultCode: 0, ResultDesc: 'Received' });
      return;
    }

    await Payment.create({
      booking_id: booking.id,
      payment_method: 'mpesa',
      transaction_id: TransID,
      amount: TransAmount,
      currency: 'KES',
      status: 'completed',
      mpesa_result_code: ResultCode,
      mpesa_phone: Msisdn,
      paid_at: new Date()
    }, { transaction: t });

    await booking.update({ payment_status: 'paid', status: 'confirmed' }, { transaction: t });
    await t.commit();

    logger.info('C2B Payment confirmed', { TransID, bookingNumber: BillRefNumber });

    // 🚀 Invalidate Caches
    await invalidatePattern(`payments:history:${booking.user_id}:*`);
    await invalidateCache(`payment:status:${TransID}`);
    await invalidateCache(`booking:single:${booking.id}`);
    await invalidatePattern(`bookings:user:${booking.user_id}:*`);

    res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (err) {
    await t.rollback();
    logger.error('C2B Confirmation Error', { error: err.message });
    res.status(200).json({ ResultCode: 1, ResultDesc: 'Processing failed' });
  }
};

// ===========================
// @desc    Verify Payment Status (CACHED)
// @route   GET /api/v1/payments/verify/:transactionId
// @access  Private
// ===========================
export const verifyPayment = async (req, res) => {
  try {
    const cacheKey = `payment:status:${req.params.transactionId}`;

    const paymentData = await getOrSetCache(
      cacheKey,
      async () => {
        logger.debug(`Cache MISS for ${cacheKey}. Fetching from DB...`);
        const payment = await Payment.findOne({
          where: {
            [Op.or]: [
              { transaction_id: req.params.transactionId },
              { mpesa_checkout_request_id: req.params.transactionId },
              { stripe_payment_intent_id: req.params.transactionId }
            ]
          },
          include: [{ model: Booking, as: 'Booking', attributes: ['id', 'booking_number', 'status', 'payment_status', 'user_id'] }]
        });

        if (!payment) throw new Error('Payment not found');

        const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
        if (!isAdmin && payment.Booking?.user_id !== req.user.id) throw new Error('Unauthorized');
        if (!payment.Booking) throw new Error('Invalid payment record');

        return {
          id: payment.id,
          status: payment.status,
          payment_method: payment.payment_method,
          amount: payment.amount,
          currency: payment.currency,
          transaction_id: payment.transaction_id,
          booking_number: payment.Booking.booking_number,
          created_at: payment.created_at,
          paid_at: payment.paid_at,
          mpesa_result_code: payment.mpesa_result_code,
          stripe_payment_intent_id: payment.stripe_payment_intent_id,
          card_last4: payment.card_last4 ? `****${payment.card_last4}` : null
        };
      },
      60 // Cache for 1 minute
    );

    res.status(200).json({ status: 'success', data: { payment: paymentData } });
  } catch (err) {
    if (err.message === 'Payment not found') return res.status(404).json({ status: 'fail', message: err.message });
    if (err.message === 'Unauthorized') return res.status(403).json({ status: 'fail', message: err.message });
    logger.error('Verify payment error', { error: err.message });
    res.status(500).json({ status: 'error', message: 'Verification failed' });
  }
};

// ===========================
// @desc    Get Payment History (CACHED)
// @route   GET /api/v1/payments/history
// @access  Private
// ===========================
export const getPaymentHistory = async (req, res) => {
  try {
    const queryString = JSON.stringify(req.query);
    const cacheKey = `payments:history:${req.user.id}:${queryString}`;

    const result = await getOrSetCache(
      cacheKey,
      async () => {
        logger.debug(`Cache MISS for ${cacheKey}. Fetching from DB...`);
        const queryOptions = {
          where: {},
          include: [{ model: Booking, as: 'Booking', attributes: ['id', 'booking_number', 'total_amount', 'user_id'] }],
          order: [['created_at', 'DESC']]
        };

        if (req.user.role === 'client') {
          queryOptions.include[0].where = { user_id: req.user.id };
          queryOptions.include[0].required = true;
        } else if (!['admin', 'super_admin'].includes(req.user.role)) {
          throw new Error('Access denied');
        }

        if (req.query.payment_method) queryOptions.where.payment_method = req.query.payment_method;
        if (req.query.status) queryOptions.where.status = req.query.status;
        
        if (req.query.start_date || req.query.end_date) {
          queryOptions.where.created_at = {};
          if (req.query.start_date) queryOptions.where.created_at[Op.gte] = new Date(req.query.start_date);
          if (req.query.end_date) queryOptions.where.created_at[Op.lte] = new Date(req.query.end_date);
        }

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        queryOptions.limit = limit;
        queryOptions.offset = (page - 1) * limit;

        const { count, rows } = await Payment.findAndCountAll(queryOptions);

        return {
          results: rows.length,
          total: count,
          page,
          pages: Math.ceil(count / limit),
          payments: rows.map(p => ({
            id: p.id,
            payment_method: p.payment_method,
            amount: p.amount,
            currency: p.currency,
            status: p.status,
            transaction_id: p.transaction_id,
            booking_number: p.Booking?.booking_number,
            created_at: p.created_at,
            paid_at: p.paid_at,
            card_last4: p.card_last4 ? `****${p.card_last4}` : null
          }))
        };
      },
      300 // Cache for 5 minutes
    );

    res.status(200).json({ status: 'success', ...result });
  } catch (err) {
    if (err.message === 'Access denied') return res.status(403).json({ status: 'fail', message: err.message });
    logger.error('Get payment history error', { error: err.message });
    res.status(500).json({ status: 'error', message: 'Failed to retrieve payment history' });
  }
};

// ===========================
// @desc    Process Refund (Admin Only) - INVALIDATES CACHE
// @route   POST /api/v1/payments/:id/refund
// @access  Private/Admin
// ===========================
export const processRefund = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      await t.rollback();
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Booking, as: 'Booking' }],
      transaction: t
    });

    if (!payment || !payment.Booking) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'Payment or Booking not found' });
    }

    if (payment.status !== 'completed') {
      await t.rollback();
      return res.status(400).json({ status: 'fail', message: 'Only completed payments can be refunded' });
    }

    let refundResult;
    const refundReason = req.body.reason || 'requested_by_customer';

    if (payment.payment_method === 'mpesa') {
      const passenger = await BookingPassenger.findOne({
        where: { booking_id: payment.booking_id },
        attributes: ['phone'],
        order: [['id', 'ASC']],
        transaction: t
      });
      const customerPhone = passenger?.phone || req.body.customer_phone;
      
      if (!customerPhone) {
        await t.rollback();
        return res.status(400).json({ status: 'fail', message: 'Customer phone required for MPESA refund' });
      }

      refundResult = await mpesaService.b2cRefund(customerPhone, payment.amount, `Refund for ${payment.Booking.booking_number}`, 'TourRefund');
      if (!refundResult.success) {
        await t.rollback();
        return res.status(400).json({ status: 'fail', message: `MPESA refund failed: ${refundResult.error}` });
      }
    } else if (payment.payment_method === 'card') {
      const stripeId = payment.stripe_payment_intent_id || payment.transaction_id;
      if (!stripeId) {
        await t.rollback();
        return res.status(400).json({ status: 'fail', message: 'No Stripe ID found' });
      }
      refundResult = await stripeService.refundPayment(stripeId, payment.amount, refundReason);
      if (!refundResult.success) {
        await t.rollback();
        return res.status(400).json({ status: 'fail', message: `Stripe refund failed: ${refundResult.error}` });
      }
    } else {
      refundResult = { success: true, manual: true };
    }

    await payment.update({
      status: 'refunded',
      refunded_at: new Date(),
      transaction_id: refundResult.transactionId || refundResult.refundId || payment.transaction_id
    }, { transaction: t });

    await payment.Booking.update({ payment_status: 'refunded', status: 'cancelled' }, { transaction: t });
    await t.commit();

    logger.info('Payment refunded', { paymentId: payment.id, bookingNumber: payment.Booking.booking_number });

    // 🚀 Invalidate Caches
    await invalidatePattern(`payments:history:${payment.Booking.user_id}:*`);
    await invalidateCache(`payment:status:${payment.transaction_id}`);
    await invalidateCache(`booking:single:${payment.Booking.id}`);
    await invalidatePattern(`bookings:user:${payment.Booking.user_id}:*`);

    res.status(200).json({
      status: 'success',
      message: 'Refund processed successfully',
      data: { payment: { id: payment.id, status: 'refunded', refunded_at: payment.refunded_at } }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Process refund error', { error: err.message });
    res.status(400).json({ status: 'fail', message: 'Refund processing failed' });
  }
};

// ===========================
// @desc    Unified Payment Status Check (CACHED)
// @route   GET /api/v1/payments/status
// @access  Private
// ===========================
export const checkPaymentStatus = async (req, res) => {
  try {
    const { payment_id, checkout_request_id, payment_intent_id } = req.query;
    const identifier = payment_id || checkout_request_id || payment_intent_id;
    
    if (!identifier) {
      return res.status(400).json({ status: 'fail', message: 'Provide an identifier' });
    }

    const cacheKey = `payment:status:${identifier}`;

    const paymentData = await getOrSetCache(
      cacheKey,
      async () => {
        logger.debug(`Cache MISS for ${cacheKey}. Fetching from DB...`);
        let payment;
        if (payment_id) {
          payment = await Payment.findByPk(payment_id, { include: [{ model: Booking, as: 'Booking', attributes: ['booking_number', 'payment_status', 'user_id'] }] });
        } else if (checkout_request_id) {
          payment = await Payment.findOne({ where: { mpesa_checkout_request_id: checkout_request_id }, include: [{ model: Booking, as: 'Booking', attributes: ['booking_number', 'payment_status', 'user_id'] }] });
        } else if (payment_intent_id) {
          payment = await Payment.findOne({ where: { stripe_payment_intent_id: payment_intent_id }, include: [{ model: Booking, as: 'Booking', attributes: ['booking_number', 'payment_status', 'user_id'] }] });
        }

        if (!payment) throw new Error('Payment not found');

        const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
        if (!isAdmin && payment.Booking?.user_id !== req.user.id) throw new Error('Unauthorized');
        if (!payment.Booking) throw new Error('Invalid record');

        return {
          id: payment.id,
          status: payment.status,
          payment_method: payment.payment_method,
          amount: payment.amount,
          currency: payment.currency,
          booking_number: payment.Booking.booking_number,
          created_at: payment.created_at,
          paid_at: payment.paid_at,
          canPoll: payment.status === 'pending' && payment.payment_method === 'mpesa'
        };
      },
      30 // Short cache for status checks
    );

    res.status(200).json({ status: 'success', data: { payment: paymentData } });
  } catch (err) {
    if (err.message === 'Payment not found') return res.status(404).json({ status: 'fail', message: err.message });
    if (err.message === 'Unauthorized') return res.status(403).json({ status: 'fail', message: err.message });
    logger.error('Check payment status error', { error: err.message });
    res.status(500).json({ status: 'error', message: 'Status check failed' });
  }
};

// ===========================
// @desc    Initiate C2B Payment (Manual Instructions)
// @route   POST /api/v1/payments/c2b/:bookingId
// @access  Private
// ===========================
export const initiateC2BPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { phone, amount, account_reference } = req.body;
    const userId = req.user?.id;
    const phone_number = phone;
    const finalAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (!phone_number) return res.status(400).json({ success: false, message: 'Phone number is required' });
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) return res.status(400).json({ success: false, message: 'Valid amount is required' });

    const phoneRegex = /^254\d{9}$/;
    if (!phoneRegex.test(phone_number)) return res.status(400).json({ success: false, message: 'Invalid phone format' });

    const booking = await Booking.findByPk(bookingId, { attributes: ['id', 'booking_number', 'payment_status', 'user_id'] });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const bookingUserId = booking.user_id || booking.getDataValue?.('user_id');
    if (bookingUserId?.toString() !== userId?.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    
    const bookingPaymentStatus = booking.payment_status || booking.getDataValue?.('payment_status');
    if (bookingPaymentStatus === 'paid') return res.status(400).json({ success: false, message: 'Already paid' });

    const c2bConfig = {
      shortcode: process.env.MPESA_SHORTCODE || '174379',
      accountRef: account_reference || booking.booking_number || booking.getDataValue?.('booking_number'),
      amount: finalAmount,
      type: process.env.MPESA_C2B_TYPE || 'PayBill',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    };

    const transId = `C2B_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const c2bPayment = await C2BPayment.create({
      trans_id: transId,
      trans_type: c2bConfig.type,
      trans_time: Date.now(),
      trans_amount: c2bConfig.amount,
      business_shortcode: c2bConfig.shortcode,
      msisdn: phone_number,
      account_number: c2bConfig.accountRef,
      org_account_balance: 0,
      booking_id: bookingId,
      status: 'completed',
      match_confidence: 'high',
      raw_callback: {
        instructions: `Go to Lipa na M-Pesa → ${c2bConfig.type} → Enter ${c2bConfig.shortcode} → Amount: ${c2bConfig.amount} → Enter PIN`,
        expiresAt: c2bConfig.expiresAt,
        booking_number: c2bConfig.accountRef
      },
      processed_at: new Date()
    });

    // 🚀 Invalidate Caches
    await invalidatePattern(`payments:history:${bookingUserId}:*`);
    await invalidateCache(`payment:status:${transId}`);

    res.status(201).json({
      success: true,
      message: 'C2B payment instructions generated',
      data: {
        paymentId: c2bPayment.id,
        transId: c2bPayment.trans_id,
        shortcode: c2bConfig.shortcode,
        accountRef: c2bConfig.accountRef,
        amount: c2bConfig.amount,
        type: c2bConfig.type,
        expiresAt: c2bConfig.expiresAt,
        instructions: c2bPayment.raw_callback?.instructions
      }
    });
  } catch (error) {
    console.error('C2B Payment Initiation Error:', error);
    next(error);
  }
};

// ===========================
// @desc    Initiate C2B Payment Callback (INCLUDED)
// @route   POST /api/v1/payments/c2b/callback
// @access  Public
// ===========================
export const initiateC2BPaymentCallback = async (req, res, next) => {
  try {
    const { Body: { stkCallback } } = req.body;
    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    // Find payment by checkout request ID (adjust field name if your C2BPayment model uses a different key)
    // Assuming you store CheckoutRequestID in C2BPayment or link it via trans_id
    const payment = await C2BPayment.findOne({ 
      where: { 
        [Op.or]: [
          { trans_id: CheckoutRequestID }, 
          { '$raw_callback.checkout_request_id$': CheckoutRequestID } 
        ] 
      } 
    });

    if (!payment) {
      logger.warn('C2B Callback: Payment not found', { CheckoutRequestID });
      return res.status(404).json({ ResultCode: 404, ResultDesc: 'Payment not found' });
    }

    const t = await sequelize.transaction();
    try {
      if (ResultCode === 0) {
        payment.status = 'completed';
        if (payment.raw_callback) {
          payment.raw_callback.confirmed_at = new Date();
        }
        await payment.save({ transaction: t });

        // Update associated booking if exists
        if (payment.booking_id) {
          const booking = await Booking.findByPk(payment.booking_id, { transaction: t });
          if (booking) {
            await booking.update({
              payment_status: 'paid',
              paid_at: new Date()
            }, { transaction: t });
            
            // 🚀 Invalidate Caches
            await invalidatePattern(`payments:history:${booking.user_id}:*`);
            await invalidateCache(`booking:single:${booking.id}`);
            await invalidatePattern(`bookings:user:${booking.user_id}:*`);
          }
        }
        await t.commit();
        logger.info('C2B Callback: Payment completed', { CheckoutRequestID });
      } else {
        payment.status = 'failed';
        if (payment.raw_callback) {
          payment.raw_callback.failure_reason = ResultDesc;
        }
        await payment.save({ transaction: t });
        await t.commit();
        logger.warn('C2B Callback: Payment failed', { CheckoutRequestID, ResultDesc });
      }

      // Acknowledge receipt to Safaricom
      res.json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (dbErr) {
      await t.rollback();
      throw dbErr;
    }
  } catch (error) {
    console.error('C2B Callback Error:', error);
    res.status(500).json({ ResultCode: 500, ResultDesc: 'Internal server error' });
  }
};