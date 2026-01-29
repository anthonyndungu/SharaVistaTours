import { Review, TourPackage, User } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { package_id, rating, comment } = req.body;

    // Check if package exists
    const tourPackage = await TourPackage.findByPk(package_id);
    if (!tourPackage) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour package not found'
      });
    }

    // Check if user has already reviewed this package
    const existingReview = await Review.findOne({
      where: {
        user_id: req.user.id,
        package_id
      }
    });

    if (existingReview) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already reviewed this package'
      });
    }

    // Check if user has a completed booking for this package
    const hasBooking = await Booking.findOne({
      where: {
        user_id: req.user.id,
        package_id,
        status: 'completed'
      }
    });

    const isVerifiedBooking = !!hasBooking;

    // Create review
    const review = await Review.create({
      user_id: req.user.id,
      package_id,
      rating,
      comment,
      is_verified_booking: isVerifiedBooking
    });

    // Fetch complete review with user data
    const completeReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        attributes: ['name', 'profile_picture']
      }]
    });

    logger.info(`Review created by ${req.user.email} for package ${tourPackage.title}`);

    res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully',
      data: { review: completeReview }
    });
  } catch (err) {
    logger.error('Create review error:', err);
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
        attributes: ['name', 'profile_picture']
      }],
      order: [['created_at', 'DESC']]
    };

    // Filter by rating
    if (req.query.rating) {
      queryOptions.where.rating = parseInt(req.query.rating);
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;

    const { count, rows: reviews } = await Review.findAndCountAll(queryOptions);

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      total: count,
      average_rating: avgRating.toFixed(1),
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
        attributes: ['id', 'title', 'destination']
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
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own reviews'
      });
    }

    await review.update(req.body);

    logger.info(`Review updated by ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (err) {
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
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    if (review.user_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this review'
      });
    }

    await review.destroy();

    logger.info(`Review deleted by ${req.user.email}`);

    res.status(204).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (err) {
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