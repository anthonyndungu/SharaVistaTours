import { Payment, Booking } from '../models/index.js';
import mpesaService from '../services/mpesaService.js';
import logger from '../utils/logger.js';

// @desc    Initiate MPESA payment
// @route   POST /api/v1/payments/mpesa
// @access  Private
export const initiateMPESAPayment = async (req, res) => {
  try {
    const { booking_id, phone_number, amount, account_reference } = req.body;

    // Validate booking exists
    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to user
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'Unauthorized access to this booking'
      });
    }

    // Initiate MPESA STK Push
    const mpesaResponse = await mpesaService.lipaNaMpesaOnline(
      phone_number,
      amount,
      account_reference || booking.booking_number,
      'Tour Booking Payment'
    );

    if (!mpesaResponse.success) {
      return res.status(400).json({
        status: 'fail',
        message: mpesaResponse.error || 'Failed to initiate MPESA payment'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      booking_id,
      payment_method: 'mpesa',
      amount,
      status: 'pending',
      mpesa_checkout_request_id: mpesaResponse.checkoutRequestId,
      mpesa_merchant_request_id: mpesaResponse.merchantRequestId,
      transaction_id: mpesaResponse.checkoutRequestId
    });

    logger.info(`MPESA payment initiated for booking ${booking.booking_number}`);

    res.status(201).json({
      status: 'success',
      message: 'MPESA payment initiated successfully',
      data: {
        payment,
        checkoutRequestId: mpesaResponse.checkoutRequestId,
        merchantRequestId: mpesaResponse.merchantRequestId,
        customerMessage: mpesaResponse.message
      }
    });
  } catch (err) {
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
  try {
    const callbackResult = await mpesaService.handleCallback(req.body);

    if (callbackResult.success) {
      res.status(200).json({
        status: 'success',
        message: 'Payment confirmed'
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: callbackResult.message
      });
    }
  } catch (err) {
    logger.error('MPESA callback error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Verify payment status
// @route   GET /api/v1/payments/verify/:transactionId
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { transaction_id: req.params.transactionId },
      include: [{
        model: Booking,
        attributes: ['id', 'booking_number', 'status', 'payment_status']
      }]
    });

    if (!payment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Payment not found'
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
        attributes: ['id', 'booking_number', 'total_amount']
      }],
      order: [['created_at', 'DESC']]
    };

    // For regular users, only show their payments
    if (req.user.role === 'client') {
      const userBookings = await Booking.findAll({
        where: { user_id: req.user.id },
        attributes: ['id']
      });
      
      const bookingIds = userBookings.map(b => b.id);
      queryOptions.where.booking_id = { [Op.in]: bookingIds };
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
  const transaction = await sequelize.transaction();
  
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Booking }]
    });

    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Payment not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      await transaction.rollback();
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied'
      });
    }

    // Check if payment can be refunded
    if (payment.status !== 'completed') {
      await transaction.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Only completed payments can be refunded'
      });
    }

    // Process refund (implement actual refund logic here)
    // For now, we'll just update the status
    
    await payment.update({
      status: 'refunded'
    }, { transaction });

    // Update booking payment status
    await payment.Booking.update({
      payment_status: 'refunded'
    }, { transaction });

    await transaction.commit();

    logger.info(`Payment ${payment.transaction_id} refunded by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Refund processed successfully',
      data: { payment }
    });
  } catch (err) {
    await transaction.rollback();
    logger.error('Process refund error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};