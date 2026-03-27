import { Booking, BookingPassenger, TourPackage, Payment, User, sequelize, ExpectedPayment } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';
import { generateBookingNumber } from '../utils/helpers.js';
import { sendBookingConfirmation, sendMpesaPaymentReminder } from '../utils/email.js';
// ✅ Import Redis helpers
import { getOrSetCache, invalidatePattern, invalidateCache } from '../config/redis.js';

// @desc    Create new booking (INVALIDATES CACHE)
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    console.log('Create booking request body:', req.body);
    const { package_id, start_date, end_date, passengers, special_requests, total_amount } = req.body;

    if (!package_id || !start_date || !end_date || !total_amount) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields: package_id, start_date, end_date, total_amount'
      });
    }

    const tourPackage = await TourPackage.findByPk(package_id, { transaction: t });

    if (!tourPackage) {
      await t.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Tour package not found'
      });
    }

    const bookingNumber = generateBookingNumber();

    const booking = await Booking.create({
      booking_number: bookingNumber,
      user_id: req.user.id,
      package_id,
      start_date,
      end_date,
      total_amount,
      special_requests: special_requests || null,
      status: 'pending',
      payment_status: 'unpaid'
    }, { transaction: t });

    if (passengers && Array.isArray(passengers) && passengers.length > 0) {
      const passengerRecords = passengers.map(passenger => ({
        booking_id: booking.id,
        name: passenger.name,
        email: passenger.email,
        phone: passenger.phone,
        age: passenger.age,
        passport_number: passenger.passport_number,
        nationality: passenger.nationality || 'Kenyan'
      }));

      await BookingPassenger.bulkCreate(passengerRecords, { transaction: t });
    } else {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'At least one passenger is required'
      });
    }

    await t.commit();

    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: TourPackage, attributes: ['id', 'title', 'destination', 'duration_days', 'price_adult', 'price_child'] },
        { model: BookingPassenger, attributes: ['id', 'name', 'email', 'phone', 'age', 'passport_number', 'nationality'] },
        { model: User, attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    const emailSent = await sendBookingConfirmation(completeBooking, completeBooking.User);
    if (!emailSent) {
      logger.warn(`Booking created but confirmation email failed for ${completeBooking.booking_number}`);
    }

    logger.info(`Booking created: ${bookingNumber} by ${req.user.email}`);

    // 🚀 INVALIDATE CACHE: Clear user's booking list and admin lists
    await invalidatePattern(`bookings:user:${req.user.id}:*`);
    await invalidatePattern('bookings:admin:*');

    const paymentInstructions = {
      method: 'MPESA',
      tillNumber: '7915503',
      phoneNumber: '+254 712 345 678',
      amount: completeBooking.total_amount,
      bookingNumber: completeBooking.booking_number,
      instructions: [
        'Open M-Pesa on your phone',
        'Select "Send Money" or "Lipa Na M-Pesa Online"',
        `Enter Till Number: 7915503`,
        `Enter amount: KES ${completeBooking.total_amount.toLocaleString()}`,
        `Include booking number in message: ${completeBooking.booking_number}`,
        'Complete the transaction'
      ],
      note: 'Your booking is pending payment. You will receive a confirmation email with payment details.'
    };

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully. Confirmation email sent with payment instructions.',
      data: {
        booking: completeBooking,
        paymentInstructions
      }
    });
  } catch (err) {
    console.log(err);
    logger.error('Create booking error:', err);
    await t.rollback();
    
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: err.errors.map(e => e.message).join(', ')
      });
    }

    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Get all user bookings (CACHED)
// @route   GET /api/v1/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const queryString = JSON.stringify(req.query);
    const cacheKey = `bookings:user:${req.user.id}:${queryString}`;

    const result = await getOrSetCache(
      cacheKey,
      async () => {
        logger.debug(`Cache MISS for ${cacheKey}. Fetching from DB...`);
        
        const queryOptions = {
          where: { user_id: req.user.id },
          include: [
            { model: TourPackage, attributes: ['id', 'title', 'destination', 'duration_days', 'category'] },
            { model: BookingPassenger, attributes: ['id', 'name', 'email', 'phone', 'age'] },
            { model: Payment, attributes: ['id', 'payment_method', 'amount', 'status', 'created_at'] }
          ],
          order: [['created_at', 'DESC']]
        };

        if (req.query.status) queryOptions.where.status = req.query.status;
        if (req.query.payment_status) queryOptions.where.payment_status = req.query.payment_status;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        queryOptions.limit = limit;
        queryOptions.offset = offset;

        const { count, rows } = await Booking.findAndCountAll(queryOptions);

        return {
          results: rows.length,
          total: count,
          page,
          pages: Math.ceil(count / limit),
          bookings: rows
        };
      },
      300 // Cache for 5 minutes
    );

    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (err) {
    logger.error('Get user bookings error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Get single booking (CACHED)
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const cacheKey = `booking:single:${req.params.id}`;

    const bookingData = await getOrSetCache(
      cacheKey,
      async () => {
        logger.debug(`Cache MISS for ${cacheKey}. Fetching from DB...`);
        
        const booking = await Booking.findByPk(req.params.id, {
          include: [
            { model: TourPackage, attributes: ['id', 'title', 'destination', 'duration_days', 'description', 'price_adult', 'price_child'] },
            { model: BookingPassenger, attributes: ['id', 'name', 'email', 'phone', 'age', 'passport_number', 'nationality'] },
            { model: Payment, attributes: ['id', 'payment_method', 'transaction_id', 'amount', 'status', 'created_at'] },
            { model: User, attributes: ['id', 'name', 'email', 'phone'] }
          ]
        });

        if (!booking) throw new Error('Booking not found');

        // Check permissions
        const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
        if (booking.user_id !== req.user.id && !isAdmin) {
          throw new Error('Permission denied');
        }

        return booking;
      },
      300 // Cache for 5 minutes
    );

    res.status(200).json({ status: 'success', data: { booking: bookingData } });
  } catch (err) {
    if (err.message === 'Booking not found') {
      return res.status(404).json({ status: 'fail', message: err.message });
    }
    if (err.message === 'Permission denied') {
      return res.status(403).json({ status: 'fail', message: err.message });
    }
    logger.error('Get booking by ID error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Update booking status (Admin Only) - INVALIDATES CACHE
// @route   PATCH /api/v1/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      await t.rollback();
      return res.status(403).json({ status: 'fail', message: 'Access denied. Admin privileges required.' });
    }

    const booking = await Booking.findByPk(req.params.id, { transaction: t });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'Booking not found' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    
    if (!status || !validStatuses.includes(status)) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    await booking.update({ status }, { transaction: t });
    await t.commit();

    // 🚀 INVALIDATE CACHE
    await invalidateCache(`booking:single:${booking.id}`);
    await invalidatePattern(`bookings:user:${booking.user_id}:*`);
    await invalidatePattern('bookings:admin:*');

    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: TourPackage, attributes: ['title', 'destination'] },
        { model: User, attributes: ['name', 'email'] }
      ]
    });

    logger.info(`Booking ${booking.booking_number} status updated to ${status} by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Booking status updated successfully',
      data: { booking: updatedBooking }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Update booking status error:', err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Cancel booking - INVALIDATES CACHE
// @route   PATCH /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction: t });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'Booking not found' });
    }

    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    if (booking.user_id !== req.user.id && !isAdmin) {
      await t.rollback();
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to cancel this booking' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: `This booking cannot be cancelled because it is already '${booking.status}'`
      });
    }

    await booking.update({ status: 'cancelled' }, { transaction: t });
    await t.commit();

    // 🚀 INVALIDATE CACHE
    await invalidateCache(`booking:single:${booking.id}`);
    await invalidatePattern(`bookings:user:${booking.user_id}:*`);
    await invalidatePattern('bookings:admin:*');

    logger.info(`Booking ${booking.booking_number} cancelled by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Cancel booking error:', err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Get all bookings (Admin) - CACHED
// @route   GET /api/v1/bookings/admin/all
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    const queryString = JSON.stringify(req.query);
    const cacheKey = `bookings:admin:${queryString}`;

    const result = await getOrSetCache(
      cacheKey,
      async () => {
        logger.debug(`Cache MISS for ${cacheKey}. Fetching from DB...`);
        
        const queryOptions = {
          where: {},
          include: [
            { model: TourPackage, attributes: ['id', 'title', 'destination'] },
            { model: User, attributes: ['id', 'name', 'email', 'phone'] },
            { model: Payment, attributes: ['id', 'payment_method', 'amount', 'status'] }
          ],
          order: [['created_at', 'DESC']]
        };

        if (req.query.status) queryOptions.where.status = req.query.status;

        if (req.query.start_date && req.query.end_date) {
          queryOptions.where.created_at = { [Op.between]: [req.query.start_date, req.query.end_date] };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        queryOptions.limit = limit;
        queryOptions.offset = offset;

        const { count, rows } = await Booking.findAndCountAll(queryOptions);

        return {
          results: rows.length,
          total: count,
          page,
          pages: Math.ceil(count / limit),
          bookings: rows
        };
      },
      300 // Cache for 5 minutes
    );

    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (err) {
    logger.error('Get all bookings error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Initiate C2B Payment
// @route   POST /api/v1/bookings/c2b/initiate
// @access  Private
export const initiateC2BPayment = async (req, res) => {
  const { bookingId, phone } = req.body;

  try {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    await ExpectedPayment.create({
      phone,
      amount: booking.total_amount,
      booking_id: bookingId,
      status: 'pending',
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
      metadata: { booking_number: booking.booking_number }
    });

    res.json({
      success: true,
      message: 'Payment instructions generated',
      data: {
        type: booking.payment_method === 'paybill' ? 'PayBill' : 'Till Number',
        shortcode: process.env.MPESA_SHORTCODE,
        accountRef: booking.booking_number,
        amount: booking.total_amount,
        instructions: booking.payment_method === 'paybill'
          ? `1. Pay Bill\n2. No: ${process.env.MPESA_SHORTCODE}\n3. Acc: ${booking.booking_number}\n4. Amt: ${booking.total_amount}`
          : `1. Buy Goods\n2. Till: ${process.env.MPESA_SHORTCODE}\n3. Amt: ${booking.total_amount}\n4. (Optional) Acc: ${booking.booking_number}`
      }
    });
  } catch (error) {
    logger.error('Initiate C2B Error', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

// @desc    Check Payment Status
// @route   GET /api/v1/bookings/:id/payment-status
// @access  Private
export const checkPaymentStatus = async (req, res) => {
  const { id } = req.params;
  
  try {
    const booking = await Booking.findByPk(id, {
      attributes: ['id', 'booking_number', 'payment_status', 'status']
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      status: booking.payment_status,
      bookingStatus: booking.status
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to check status' });
  }
};

// @desc    Get Booking Receipt Data
// @route   GET /api/v1/bookings/:id/receipt
// @access  Private (User must own the booking OR be Admin)
export const getBookingReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch Booking with all relations
    const booking = await Booking.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: TourPackage,
          attributes: ['id', 'title', 'destination', 'duration_days', 'price_adult', 'price_child']
        },
        {
          model: BookingPassenger,
          attributes: ['id', 'name', 'age', 'passport_number', 'nationality']
        },
        {
          model: Payment,
          where: { status: 'completed' },
          required: true,
          order: [['created_at', 'DESC']],
          limit: 1,
          attributes: [
            'id', 
            'amount', 
            'currency', 
            'payment_method', 
            'transaction_id',       
            'mpesa_checkout_request_id', 
            'mpesa_phone',        
            'paid_at', 
            'card_last4', 
            'card_brand'
          ]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ status: 'fail', message: 'Booking not found or no completed payment exists.' });
    }

    // 2. Security Check
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
    if (!isAdmin && booking.user_id !== req.user.id) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized access to this receipt.' });
    }

    const paymentRecord = booking.Payments[0];

    // 3. Format Data for Frontend
    const receiptData = {
      booking: {
        number: booking.booking_number,
        date: booking.created_at,
        status: booking.status,
        package: booking.TourPackage?.title,
        destination: booking.TourPackage?.destination,
        duration: `${booking.TourPackage?.duration_days} Days`,
        startDate: booking.start_date,
        endDate: booking.end_date
      },
      customer: {
        name: booking.User?.name,
        email: booking.User?.email,
        phone: booking.User?.phone
      },
      passengers: booking.BookingPassengers || [],
      payment: paymentRecord ? {
        id: paymentRecord.id,
        amount: paymentRecord.amount,
        currency: paymentRecord.currency,
        method: paymentRecord.payment_method,
        transactionId: paymentRecord.transaction_id,
        // ✅ FIX: Use transaction_id as the receipt number for MPESA
        receiptNumber: paymentRecord.transaction_id || paymentRecord.mpesa_checkout_request_id,
        date: paymentRecord.paid_at,
        cardDetails: paymentRecord.card_brand ? `**** ${paymentRecord.card_last4}` : null,
        phoneNumber: paymentRecord.mpesa_phone
      } : null,
      company: {
        name: 'Sharavista Tours & Travel',
        address: 'Nairobi, Kenya',
        phone: '+254 700 000 000',
        email: 'info@sharavista.com',
        website: 'https://tours.mogulafric.com'
      }
    };

    res.status(200).json({
      status: 'success',
      data: receiptData
    });

  } catch (error) {
    logger.error('Get Receipt Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to generate receipt' });
  }
};

