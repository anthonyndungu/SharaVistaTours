// import { Booking, BookingPassenger, TourPackage, Payment, User, sequelize } from '../models/index.js'; // ✅ Added sequelize import
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
//     await t.rollback();
//     logger.error('Create booking error:', err);
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


import { Booking, BookingPassenger, TourPackage, Payment, User, sequelize } from '../models/index.js'; // ✅ Added sequelize import
import { Op } from 'sequelize';
import logger from '../utils/logger.js';
import { generateBookingNumber } from '../utils/helpers.js';
import { sendBookingConfirmation, sendMpesaPaymentReminder } from '../utils/email.js';

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    console.log('Create booking request body:', req.body); // Debug log
    const { package_id, start_date, end_date, passengers, special_requests, total_amount } = req.body;

    // 1. Validate Inputs
    if (!package_id || !start_date || !end_date || !total_amount) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields: package_id, start_date, end_date, total_amount'
      });
    }

    // 2. Validate Package Exists (with lock to prevent race conditions if needed, but standard find is ok here)
    const tourPackage = await TourPackage.findByPk(package_id, { transaction: t });
    
    if (!tourPackage) {
      await t.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Tour package not found'
      });
    }

    // 3. Check Capacity (Optional but recommended)
    // You could count existing confirmed bookings for these dates here if you track capacity strictly

    // 4. Generate unique booking number
    const bookingNumber = generateBookingNumber();

    // 5. Create Booking
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

    // 6. Create Passengers
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

    // 7. Fetch complete booking (outside transaction to avoid locking)
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

    // 8. Send confirmation email with payment instructions
    const emailSent = await sendBookingConfirmation(completeBooking, completeBooking.User);
    
    if (!emailSent) {
      logger.warn(`Booking created but confirmation email failed for ${completeBooking.booking_number}`);
    }

    logger.info(`Booking created: ${bookingNumber} by ${req.user.email}`);

    // 9. Prepare response with payment instructions
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
    await t.rollback();
    logger.error('Create booking error:', err);
    // Handle specific errors
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

    // Check permissions: Owner or Admin
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    if (booking.user_id !== req.user.id && !isAdmin) {
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

// @desc    Update booking status (Admin Only)
// @route   PATCH /api/v1/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // 1. Check Admin Role
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      await t.rollback();
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin privileges required.'
      });
    }

    const booking = await Booking.findByPk(req.params.id, { transaction: t });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    const { status } = req.body;

    // 2. Validate Status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // 3. Update
    await booking.update({ status }, { transaction: t });
    
    // Optional: If status becomes 'confirmed', you might want to decrement package capacity here

    await t.commit();

    // Fetch updated data
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
  const t = await sequelize.transaction();
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction: t });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
    }

    // 1. Check Permissions
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    if (booking.user_id !== req.user.id && !isAdmin) {
      await t.rollback();
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to cancel this booking'
      });
    }

    // 2. Check Validity of Cancellation
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: `This booking cannot be cancelled because it is already '${booking.status}'`
      });
    }

    // 3. Update Status
    await booking.update({ status: 'cancelled' }, { transaction: t });
    
    // Optional: Trigger refund logic here if payment_status is 'paid'

    await t.commit();

    logger.info(`Booking ${booking.booking_number} cancelled by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (err) {
    await t.rollback();
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
    // 1. Admin Check
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied'
      });
    }

    const queryOptions = {
      where: {},
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
      queryOptions.where.status = req.query.status;
    }

    // Filter by date range
    if (req.query.start_date && req.query.end_date) {
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


