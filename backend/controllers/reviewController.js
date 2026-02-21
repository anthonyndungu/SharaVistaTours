import { Review, TourPackage, User, Booking, sequelize } from '../models/index.js'; // ✅ Added Booking and sequelize
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { package_id, rating, comment } = req.body;

    // 1. Validate Inputs
    if (!package_id || !rating) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide package_id and rating'
      });
    }

    if (rating < 1 || rating > 5) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Rating must be between 1 and 5'
      });
    }

    // 2. Check if package exists
    const tourPackage = await TourPackage.findByPk(package_id, { transaction: t });
    if (!tourPackage) {
      await t.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Tour package not found'
      });
    }

    // 3. Check if user has already reviewed this package (Locking read)
    const existingReview = await Review.findOne({
      where: {
        user_id: req.user.id,
        package_id
      },
      transaction: t
    });

    if (existingReview) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'You have already reviewed this package. Please update your existing review instead.'
      });
    }

    // 4. Check if user has a completed booking for this package
    // This determines if the review gets the "Verified" badge
    const hasBooking = await Booking.findOne({
      where: {
        user_id: req.user.id,
        package_id,
        status: 'completed' // Only count completed trips as verified
      },
      transaction: t
    });

    const isVerifiedBooking = !!hasBooking;

    if (!isVerifiedBooking) {
      logger.info(`Unverified review submitted by ${req.user.email} for package ${package_id}`);
    }

    // 5. Create Review
    const review = await Review.create({
      user_id: req.user.id,
      package_id,
      rating,
      comment: comment || '',
      is_verified_booking: isVerifiedBooking
    }, { transaction: t });

    await t.commit();

    // 6. Fetch complete review with user data (outside transaction)
    const completeReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'profile_picture']
      }]
    });

    logger.info(`Review created by ${req.user.email} for package ${tourPackage.title}`);

    res.status(201).json({
      status: 'success',
      message: isVerifiedBooking ? 'Verified review submitted successfully' : 'Review submitted successfully',
      data: { review: completeReview }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Create review error:', err);
    
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

// @desc    Get all reviews for a package
// @route   GET /api/v1/packages/:packageId/reviews
// @access  Public
export const getPackageReviews = async (req, res) => {
  try {
    const queryOptions = {
      where: { package_id: req.params.packageId },
      include: [{
        model: User,
        attributes: ['id', 'name', 'profile_picture']
      }],
      order: [['created_at', 'DESC']]
    };

    // Filter by rating
    if (req.query.rating) {
      const ratingVal = parseInt(req.query.rating);
      if (ratingVal >= 1 && ratingVal <= 5) {
        queryOptions.where.rating = ratingVal;
      }
    }

    // Filter verified only
    if (req.query.verified === 'true') {
      queryOptions.where.is_verified_booking = true;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;

    const { count, rows: reviews } = await Review.findAndCountAll(queryOptions);

    // Calculate average rating for this package (considering filters)
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      total: count,
      average_rating: parseFloat(avgRating.toFixed(1)),
      page,
      pages: Math.ceil(count / limit),
      data: { reviews }
    });
  } catch (err) {
    logger.error('Get package reviews error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Get user reviews
// @route   GET /api/v1/reviews/my-reviews
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const queryOptions = {
      where: { user_id: req.user.id },
      include: [{
        model: TourPackage,
        attributes: ['id', 'title', 'destination', 'cover_image']
      }],
      order: [['created_at', 'DESC']]
    };

    const reviews = await Review.findAll(queryOptions);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews }
    });
  } catch (err) {
    logger.error('Get user reviews error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Update review
// @route   PATCH /api/v1/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const review = await Review.findByPk(req.params.id, { transaction: t });

    if (!review) {
      await t.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user_id !== req.user.id) {
      await t.rollback();
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own reviews'
      });
    }

    // Validate rating if being updated
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Rating must be between 1 and 5'
      });
    }

    // Note: We do NOT allow updating is_verified_booking manually. It's system-controlled.
    const { rating, comment } = req.body;
    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    await review.update(updateData, { transaction: t });
    
    await t.commit();

    logger.info(`Review updated by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Update review error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const review = await Review.findByPk(req.params.id, { transaction: t });

    if (!review) {
      await t.rollback();
      return res.status(404).json({
        status: 'fail',
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    if (review.user_id !== req.user.id && !isAdmin) {
      await t.rollback();
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this review'
      });
    }

    await review.destroy({ transaction: t });
    await t.commit();

    logger.info(`Review deleted by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (err) {
    await t.rollback();
    logger.error('Delete review error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Get review statistics
// @route   GET /api/v1/reviews/stats
// @access  Public
export const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.findAll({
      attributes: [
        'package_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
      ],
      group: ['package_id'],
      raw: true
    });

    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (err) {
    logger.error('Get review stats error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};