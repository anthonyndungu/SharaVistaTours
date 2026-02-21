import { Payment, Booking, sequelize } from '../models/index.js'; // ✅ Added sequelize
import { Op } from 'sequelize'; // ✅ Added Op
import mpesaService from '../services/mpesaService.js';
import logger from '../utils/logger.js';

// @desc    Initiate MPESA payment
// @route   POST /api/v1/payments/mpesa
// @access  Private
export const initiateMPESAPayment = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { booking_id, phone_number, amount, account_reference } = req.body;

    // 1. Validate Inputs
    if (!booking_id || !phone_number || !amount) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields: booking_id, phone_number, amount'
      });
    }

    // 2. Validate Booking Exists (Lock row for update if possible, standard find ok here)
    const booking = await Booking.findByPk(booking_id, { transaction: t });
    
    if (!booking) {
      await t.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    // 3. Verify Ownership
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      await t.rollback();
      return res.status(403).json({
        status: 'fail',
        message: 'Unauthorized access to this booking'
      });
    }

    // 4. Check if already paid
    if (booking.payment_status === 'paid') {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'This booking has already been paid for.'
      });
    }

    // 5. Initiate MPESA STK Push
    const mpesaResponse = await mpesaService.lipaNaMpesaOnline(
      phone_number,
      amount,
      account_reference || booking.booking_number,
      'Tour Booking Payment'
    );

    if (!mpesaResponse.success) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: mpesaResponse.error || 'Failed to initiate MPESA payment'
      });
    }

    // 6. Create Payment Record
    const payment = await Payment.create({
      booking_id,
      payment_method: 'mpesa',
      amount,
      currency: 'KES',
      status: 'pending',
      mpesa_checkout_request_id: mpesaResponse.checkoutRequestId,
      mpesa_merchant_request_id: mpesaResponse.merchantRequestId,
      transaction_id: mpesaResponse.checkoutRequestId // Temp ID until callback confirms
    }, { transaction: t });

    // 7. Update Booking Status to Pending Payment
    await booking.update({
      payment_status: 'pending'
    }, { transaction: t });

    await t.commit();

    logger.info(`MPESA payment initiated for booking ${booking.booking_number}. CheckoutID: ${mpesaResponse.checkoutRequestId}`);

    res.status(201).json({
      status: 'success',
      message: 'MPESA STK Push sent successfully. Please check your phone.',
      data: {
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount
        },
        checkoutRequestId: mpesaResponse.checkoutRequestId,
        customerMessage: mpesaResponse.message || 'Enter PIN on your phone to complete payment'
      }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Initiate MPESA payment error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    MPESA callback handler
// @route   POST /api/v1/payments/mpesa/callback
// @access  Public (MPESA server)
export const mpesaCallback = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    // ⚠️ SECURITY NOTE: In production, verify the request IP comes from Safaricom ranges
    // before processing to prevent spoofed callbacks.
    
    const callbackResult = await mpesaService.handleCallback(req.body, t);

    if (callbackResult.success) {
      await t.commit();
      // MPESA expects a 200 OK to stop retries
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: 'Accepted'
      });
    } else {
      await t.rollback();
      res.status(400).json({
        ResultCode: 1,
        ResultDesc: callbackResult.message || 'Processing failed'
      });
    }
  } catch (err) {
    await t.rollback();
    logger.error('MPESA callback error:', err);
    // Still return 200 to MPESA to stop retries if it's a local logic error we can't fix by retrying
    // Or return 500 if you want MPESA to retry later. Usually 200 with error code is safer for logic errors.
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Server error processing callback'
    });
  }
};

// @desc    Verify payment status
// @route   GET /api/v1/payments/verify/:transactionId
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { 
        [Op.or]: [
          { transaction_id: req.params.transactionId },
          { mpesa_checkout_request_id: req.params.transactionId }
        ]
      },
      include: [{
        model: Booking,
        attributes: ['id', 'booking_number', 'status', 'payment_status', 'total_amount']
      }]
    });

    if (!payment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Payment not found'
      });
    }

    // Permission check
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    if (!isAdmin && payment.Booking.user_id !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'Unauthorized'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (err) {
    logger.error('Verify payment error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/v1/payments/history
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const queryOptions = {
      where: {},
      include: [{
        model: Booking,
        attributes: ['id', 'booking_number', 'total_amount', 'user_id']
      }],
      order: [['created_at', 'DESC']]
    };

    // For regular users, only show their payments
    if (req.user.role === 'client') {
      // Subquery or join filter: Find bookings belonging to user
      // We can do this by joining and filtering, or pre-fetching IDs
      // Efficient way: Add condition on included model
      queryOptions.include[0].where = { user_id: req.user.id };
      queryOptions.include[0].required = true; // Inner join
    } else if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
       return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    // Filter by payment method
    if (req.query.payment_method) {
      queryOptions.where.payment_method = req.query.payment_method;
    }

    // Filter by status
    if (req.query.status) {
      queryOptions.where.status = req.query.status;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;

    const { count, rows: payments } = await Payment.findAndCountAll(queryOptions);

    res.status(200).json({
      status: 'success',
      results: payments.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: { payments }
    });
  } catch (err) {
    logger.error('Get payment history error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Process refund
// @route   POST /api/v1/payments/:id/refund
// @access  Private/Admin
export const processRefund = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    // 1. Admin Check
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      await t.rollback();
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin privileges required.'
      });
    }

    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Booking }],
      transaction: t
    });

    if (!payment) {
      await t.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Payment not found'
      });
    }

    // 2. Validation
    if (payment.status !== 'completed') {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Only completed payments can be refunded'
      });
    }

    if (payment.Booking.status === 'cancelled') {
       // Optional: Warn if already cancelled, but allow refund
    }

    // 3. Process Refund Logic
    // TODO: Integrate actual MPESA B2C (Business to Customer) API here to send money back
    // For now, we simulate a successful refund by updating status
    
    /* 
    const refundResponse = await mpesaService.b2cTransfer(...);
    if (!refundResponse.success) throw new Error('Refund transfer failed');
    */

    // 4. Update Records
    await payment.update({
      status: 'refunded'
    }, { transaction: t });

    await payment.Booking.update({
      payment_status: 'refunded',
      status: 'cancelled' // Automatically cancel booking if refunded
    }, { transaction: t });

    await t.commit();

    logger.info(`Payment ${payment.transaction_id} refunded by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Refund processed successfully',
      data: { payment }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Process refund error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};