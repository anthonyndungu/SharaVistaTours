import { Booking, BookingPassenger, TourPackage, Payment, User } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';
import { generateBookingNumber } from '../utils/helpers.js';

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { package_id, start_date, end_date, passengers, special_requests, total_amount } = req.body;

    // Validate package exists
    const tourPackage = await TourPackage.findByPk(package_id);
    if (!tourPackage) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Tour package not found'
      });
    }

    // Generate unique booking number
    const bookingNumber = generateBookingNumber();

    // Create booking
    const booking = await Booking.create({
      booking_number: bookingNumber,
      user_id: req.user.id,
      package_id,
      start_date,
      end_date,
      total_amount,
      special_requests,
      status: 'pending',
      payment_status: 'unpaid'
    }, { transaction });

    // Create passengers
    if (passengers && passengers.length > 0) {
      const passengerRecords = passengers.map(passenger => ({
        ...passenger,
        booking_id: booking.id
      }));
      
      await BookingPassenger.bulkCreate(passengerRecords, { transaction });
    }

    await transaction.commit();

    // Fetch complete booking with relations
    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: TourPackage,
          attributes: ['id', 'title', 'destination', 'duration_days', 'price_adult', 'price_child']
        },
        {
          model: BookingPassenger,
          attributes: ['id', 'name', 'email', 'phone', 'age', 'passport_number', 'nationality']
        },
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    logger.info(`Booking created: ${bookingNumber} by ${req.user.email}`);

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: { booking: completeBooking }
    });
  } catch (err) {
    await transaction.rollback();
    logger.error('Create booking error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Get all user bookings
// @route   GET /api/v1/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const queryOptions = {
      where: { user_id: req.user.id },
      include: [
        {
          model: TourPackage,
          attributes: ['id', 'title', 'destination', 'duration_days', 'category']
        },
        {
          model: BookingPassenger,
          attributes: ['id', 'name', 'email', 'phone', 'age']
        },
        {
          model: Payment,
          attributes: ['id', 'payment_method', 'amount', 'status', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']]
    };

    // Filter by status
    if (req.query.status) {
      queryOptions.where.status = req.query.status;
    }

    // Filter by payment status
    if (req.query.payment_status) {
      queryOptions.where.payment_status = req.query.payment_status;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;

    const { count, rows: bookings } = await Booking.findAndCountAll(queryOptions);

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: { bookings }
    });
  } catch (err) {
    logger.error('Get user bookings error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: TourPackage,
          attributes: ['id', 'title', 'destination', 'duration_days', 'description', 'price_adult', 'price_child']
        },
        {
          model: BookingPassenger,
          attributes: ['id', 'name', 'email', 'phone', 'age', 'passport_number', 'nationality']
        },
        {
          model: Payment,
          attributes: ['id', 'payment_method', 'transaction_id', 'amount', 'status', 'created_at']
        },
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this booking'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  } catch (err) {
    logger.error('Get booking by ID error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Update booking status (Admin)
// @route   PATCH /api/v1/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid status value'
      });
    }

    await booking.update({ status });

    logger.info(`Booking ${booking.booking_number} status updated to ${status} by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Booking status updated successfully',
      data: { booking }
    });
  } catch (err) {
    logger.error('Update booking status error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Cancel booking
// @route   PATCH /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        status: 'fail',
        message: 'This booking cannot be cancelled'
      });
    }

    await booking.update({ status: 'cancelled' });

    logger.info(`Booking ${booking.booking_number} cancelled by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (err) {
    logger.error('Cancel booking error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/v1/bookings/admin/all
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    // Only admins can access this
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied'
      });
    }

    const queryOptions = {
      include: [
        {
          model: TourPackage,
          attributes: ['id', 'title', 'destination']
        },
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Payment,
          attributes: ['id', 'payment_method', 'amount', 'status']
        }
      ],
      order: [['created_at', 'DESC']]
    };

    // Filter by status
    if (req.query.status) {
      queryOptions.where = { status: req.query.status };
    }

    // Filter by date range
    if (req.query.start_date && req.query.end_date) {
      if (!queryOptions.where) queryOptions.where = {};
      queryOptions.where.created_at = {
        [Op.between]: [req.query.start_date, req.query.end_date]
      };
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;

    const { count, rows: bookings } = await Booking.findAndCountAll(queryOptions);

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: { bookings }
    });
  } catch (err) {
    logger.error('Get all bookings error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};