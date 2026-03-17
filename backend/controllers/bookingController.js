// import { Booking, BookingPassenger, TourPackage, Payment, User, sequelize, ExpectedPayment } from '../models/index.js'; // ✅ Added sequelize import
// import { Op } from 'sequelize';
// import logger from '../utils/logger.js';
// import { generateBookingNumber } from '../utils/helpers.js';
// import { sendBookingConfirmation, sendMpesaPaymentReminder } from '../utils/email.js';

// // @desc    Create new booking
// // @route   POST /api/v1/bookings
// // @access  Private
// export const createBooking = async (req, res) => {
//   const t = await sequelize.transaction();

//   try {
//     console.log('Create booking request body:', req.body); // Debug log
//     const { package_id, start_date, end_date, passengers, special_requests, total_amount } = req.body;

//     // 1. Validate Inputs
//     if (!package_id || !start_date || !end_date || !total_amount) {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Missing required fields: package_id, start_date, end_date, total_amount'
//       });
//     }

//     // 2. Validate Package Exists (with lock to prevent race conditions if needed, but standard find is ok here)
//     const tourPackage = await TourPackage.findByPk(package_id, { transaction: t });

//     if (!tourPackage) {
//       await t.rollback();
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Tour package not found'
//       });
//     }

//     // 3. Check Capacity (Optional but recommended)
//     // You could count existing confirmed bookings for these dates here if you track capacity strictly

//     // 4. Generate unique booking number
//     const bookingNumber = generateBookingNumber();

//     // 5. Create Booking
//     const booking = await Booking.create({
//       booking_number: bookingNumber,
//       user_id: req.user.id,
//       package_id,
//       start_date,
//       end_date,
//       total_amount,
//       special_requests: special_requests || null,
//       status: 'pending',
//       payment_status: 'unpaid'
//     }, { transaction: t });

//     // 6. Create Passengers
//     if (passengers && Array.isArray(passengers) && passengers.length > 0) {
//       const passengerRecords = passengers.map(passenger => ({
//         booking_id: booking.id,
//         name: passenger.name,
//         email: passenger.email,
//         phone: passenger.phone,
//         age: passenger.age,
//         passport_number: passenger.passport_number,
//         nationality: passenger.nationality || 'Kenyan'
//       }));

//       await BookingPassenger.bulkCreate(passengerRecords, { transaction: t });
//     } else {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: 'At least one passenger is required'
//       });
//     }

//     await t.commit();

//     // 7. Fetch complete booking (outside transaction to avoid locking)
//     const completeBooking = await Booking.findByPk(booking.id, {
//       include: [
//         {
//           model: TourPackage,
//           attributes: ['id', 'title', 'destination', 'duration_days', 'price_adult', 'price_child']
//         },
//         {
//           model: BookingPassenger,
//           attributes: ['id', 'name', 'email', 'phone', 'age', 'passport_number', 'nationality']
//         },
//         {
//           model: User,
//           attributes: ['id', 'name', 'email', 'phone']
//         }
//       ]
//     });

//     // 8. Send confirmation email with payment instructions
//     const emailSent = await sendBookingConfirmation(completeBooking, completeBooking.User);

//     if (!emailSent) {
//       logger.warn(`Booking created but confirmation email failed for ${completeBooking.booking_number}`);
//     }

//     logger.info(`Booking created: ${bookingNumber} by ${req.user.email}`);

//     // 9. Prepare response with payment instructions
//     const paymentInstructions = {
//       method: 'MPESA',
//       tillNumber: '7915503',
//       phoneNumber: '+254 712 345 678',
//       amount: completeBooking.total_amount,
//       bookingNumber: completeBooking.booking_number,
//       instructions: [
//         'Open M-Pesa on your phone',
//         'Select "Send Money" or "Lipa Na M-Pesa Online"',
//         `Enter Till Number: 7915503`,
//         `Enter amount: KES ${completeBooking.total_amount.toLocaleString()}`,
//         `Include booking number in message: ${completeBooking.booking_number}`,
//         'Complete the transaction'
//       ],
//       note: 'Your booking is pending payment. You will receive a confirmation email with payment details.'
//     };

//     res.status(201).json({
//       status: 'success',
//       message: 'Booking created successfully. Confirmation email sent with payment instructions.',
//       data: {
//         booking: completeBooking,
//         paymentInstructions
//       }
//     });
//   } catch (err) {
//     console.log(err)
//     logger.error('Create booking error:', err);
//     await t.rollback();
//     //  logger.error('Create booking error:', err);
//     // Handle specific errors
//     if (err.name === 'SequelizeValidationError') {
//       return res.status(400).json({
//         status: 'fail',
//         message: err.errors.map(e => e.message).join(', ')
//       });
//     }

//     res.status(400).json({
//       status: 'fail',
//       message: err.message
//     });
//   }
// };

// // @desc    Get all user bookings
// // @route   GET /api/v1/bookings
// // @access  Private
// export const getUserBookings = async (req, res) => {
//   try {
//     const queryOptions = {
//       where: { user_id: req.user.id },
//       include: [
//         {
//           model: TourPackage,
//           attributes: ['id', 'title', 'destination', 'duration_days', 'category']
//         },
//         {
//           model: BookingPassenger,
//           attributes: ['id', 'name', 'email', 'phone', 'age']
//         },
//         {
//           model: Payment,
//           attributes: ['id', 'payment_method', 'amount', 'status', 'created_at']
//         }
//       ],
//       order: [['created_at', 'DESC']]
//     };

//     // Filter by status
//     if (req.query.status) {
//       queryOptions.where.status = req.query.status;
//     }

//     // Filter by payment status
//     if (req.query.payment_status) {
//       queryOptions.where.payment_status = req.query.payment_status;
//     }

//     // Pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     queryOptions.limit = limit;
//     queryOptions.offset = offset;

//     const { count, rows: bookings } = await Booking.findAndCountAll(queryOptions);

//     res.status(200).json({
//       status: 'success',
//       results: bookings.length,
//       total: count,
//       page,
//       pages: Math.ceil(count / limit),
//       data: { bookings }
//     });
//   } catch (err) {
//     logger.error('Get user bookings error:', err);
//     res.status(500).json({
//       status: 'error',
//       message: err.message
//     });
//   }
// };

// // @desc    Get single booking
// // @route   GET /api/v1/bookings/:id
// // @access  Private
// export const getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findByPk(req.params.id, {
//       include: [
//         {
//           model: TourPackage,
//           attributes: ['id', 'title', 'destination', 'duration_days', 'description', 'price_adult', 'price_child']
//         },
//         {
//           model: BookingPassenger,
//           attributes: ['id', 'name', 'email', 'phone', 'age', 'passport_number', 'nationality']
//         },
//         {
//           model: Payment,
//           attributes: ['id', 'payment_method', 'transaction_id', 'amount', 'status', 'created_at']
//         },
//         {
//           model: User,
//           attributes: ['id', 'name', 'email', 'phone']
//         }
//       ]
//     });

//     if (!booking) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Booking not found'
//       });
//     }

//     // Check permissions: Owner or Admin
//     const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
//     if (booking.user_id !== req.user.id && !isAdmin) {
//       return res.status(403).json({
//         status: 'fail',
//         message: 'You do not have permission to view this booking'
//       });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: { booking }
//     });
//   } catch (err) {
//     logger.error('Get booking by ID error:', err);
//     res.status(500).json({
//       status: 'error',
//       message: err.message
//     });
//   }
// };

// // @desc    Update booking status (Admin Only)
// // @route   PATCH /api/v1/bookings/:id/status
// // @access  Private/Admin
// export const updateBookingStatus = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     // 1. Check Admin Role
//     if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
//       await t.rollback();
//       return res.status(403).json({
//         status: 'fail',
//         message: 'Access denied. Admin privileges required.'
//       });
//     }

//     const booking = await Booking.findByPk(req.params.id, { transaction: t });

//     if (!booking) {
//       await t.rollback();
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Booking not found'
//       });
//     }

//     const { status } = req.body;

//     // 2. Validate Status
//     const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
//     if (!status || !validStatuses.includes(status)) {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
//       });
//     }

//     // 3. Update
//     await booking.update({ status }, { transaction: t });

//     // Optional: If status becomes 'confirmed', you might want to decrement package capacity here

//     await t.commit();

//     // Fetch updated data
//     const updatedBooking = await Booking.findByPk(booking.id, {
//       include: [
//         { model: TourPackage, attributes: ['title', 'destination'] },
//         { model: User, attributes: ['name', 'email'] }
//       ]
//     });

//     logger.info(`Booking ${booking.booking_number} status updated to ${status} by ${req.user.email}`);

//     res.status(200).json({
//       status: 'success',
//       message: 'Booking status updated successfully',
//       data: { booking: updatedBooking }
//     });
//   } catch (err) {
//     await t.rollback();
//     logger.error('Update booking status error:', err);
//     res.status(400).json({
//       status: 'fail',
//       message: err.message
//     });
//   }
// };

// // @desc    Cancel booking
// // @route   PATCH /api/v1/bookings/:id/cancel
// // @access  Private
// export const cancelBooking = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const booking = await Booking.findByPk(req.params.id, { transaction: t });

//     if (!booking) {
//       await t.rollback();
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Booking not found'
//       });
//     }

//     // 1. Check Permissions
//     const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
//     if (booking.user_id !== req.user.id && !isAdmin) {
//       await t.rollback();
//       return res.status(403).json({
//         status: 'fail',
//         message: 'You do not have permission to cancel this booking'
//       });
//     }

//     // 2. Check Validity of Cancellation
//     if (booking.status === 'completed' || booking.status === 'cancelled') {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: `This booking cannot be cancelled because it is already '${booking.status}'`
//       });
//     }

//     // 3. Update Status
//     await booking.update({ status: 'cancelled' }, { transaction: t });

//     // Optional: Trigger refund logic here if payment_status is 'paid'

//     await t.commit();

//     logger.info(`Booking ${booking.booking_number} cancelled by ${req.user.email}`);

//     res.status(200).json({
//       status: 'success',
//       message: 'Booking cancelled successfully',
//       data: { booking }
//     });
//   } catch (err) {
//     await t.rollback();
//     logger.error('Cancel booking error:', err);
//     res.status(400).json({
//       status: 'fail',
//       message: err.message
//     });
//   }
// };

// // @desc    Get all bookings (Admin)
// // @route   GET /api/v1/bookings/admin/all
// // @access  Private/Admin
// export const getAllBookings = async (req, res) => {
//   try {
//     // 1. Admin Check
//     if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
//       return res.status(403).json({
//         status: 'fail',
//         message: 'Access denied'
//       });
//     }

//     const queryOptions = {
//       where: {},
//       include: [
//         {
//           model: TourPackage,
//           attributes: ['id', 'title', 'destination']
//         },
//         {
//           model: User,
//           attributes: ['id', 'name', 'email', 'phone']
//         },
//         {
//           model: Payment,
//           attributes: ['id', 'payment_method', 'amount', 'status']
//         }
//       ],
//       order: [['created_at', 'DESC']]
//     };

//     // Filter by status
//     if (req.query.status) {
//       queryOptions.where.status = req.query.status;
//     }

//     // Filter by date range
//     if (req.query.start_date && req.query.end_date) {
//       queryOptions.where.created_at = {
//         [Op.between]: [req.query.start_date, req.query.end_date]
//       };
//     }

//     // Pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;

//     queryOptions.limit = limit;
//     queryOptions.offset = offset;

//     const { count, rows: bookings } = await Booking.findAndCountAll(queryOptions);

//     res.status(200).json({
//       status: 'success',
//       results: bookings.length,
//       total: count,
//       page,
//       pages: Math.ceil(count / limit),
//       data: { bookings }
//     });
//   } catch (err) {
//     logger.error('Get all bookings error:', err);
//     res.status(500).json({
//       status: 'error',
//       message: err.message
//     });
//   }
// };
// //c2b
// export const initiateC2BPayment = async (req, res) => {
//   const { bookingId, phone } = req.body;

//   try {
//     const booking = await Booking.findByPk(bookingId);
//     if (!booking) return res.status(404).json({ error: 'Booking not found' });

//     // Create Expected Payment record for Strategy 2 matching
//     await ExpectedPayment.create({
//       phone,
//       amount: booking.total_amount,
//       booking_id: bookingId,
//       status: 'pending',
//       expires_at: new Date(Date.now() + 15 * 60 * 1000),
//       metadata: { booking_number: booking.booking_number }
//     });

//     res.json({
//       success: true,
//       message: 'Payment instructions generated',
//       data: {
//         type: booking.payment_method === 'paybill' ? 'PayBill' : 'Till Number',
//         shortcode: process.env.MPESA_SHORTCODE,
//         accountRef: booking.booking_number, // Tell user what to enter for PayBill
//         amount: booking.total_amount,
//         instructions: booking.payment_method === 'paybill'
//           ? `1. Pay Bill\n2. No: ${process.env.MPESA_SHORTCODE}\n3. Acc: ${booking.booking_number}\n4. Amt: ${booking.total_amount}`
//           : `1. Buy Goods\n2. Till: ${process.env.MPESA_SHORTCODE}\n3. Amt: ${booking.total_amount}\n4. (Optional) Acc: ${booking.booking_number}`
//       }
//     });
//   } catch (error) {
//     logger.error('Initiate C2B Error', error);
//     res.status(500).json({ error: 'Failed to initiate payment' });
//   }
// };
// export const checkPaymentStatus = async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     const booking = await Booking.findByPk(id, {
//       attributes: ['id', 'booking_number', 'payment_status', 'status']
//     });

//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     // Check for unmatched C2B payments linked to this booking's phone recently?
//     // For simplicity, we just return the booking status. 
//     // If you want to detect "unmatched" specifically, you might need a separate endpoint 
//     // that checks C2BPayment table for recent unmatched transactions from this user's phone.
    
//     res.json({
//       status: booking.payment_status, // 'pending', 'paid', 'unpaid'
//       bookingStatus: booking.status
//     });

//   } catch (error) {
//     res.status(500).json({ error: 'Failed to check status' });
//   }
// };



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

