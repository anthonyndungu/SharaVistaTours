import { Payment, Booking, sequelize, Op, C2BPayment, BookingPassenger } from '../models/index.js';
import mpesaService from '../services/MpesaService.js';
import stripeService from '../services/stripeService.js';
import logger from '../utils/logger.js';
//Import Redis helpers
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