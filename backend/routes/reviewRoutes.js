import express from 'express';
import {
  createReview,
  getPackageReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  getReviewStats
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/stats', getReviewStats);
router.get('/package/:packageId', getPackageReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getUserReviews);
router.patch('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;