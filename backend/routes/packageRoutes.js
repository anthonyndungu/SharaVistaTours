import express from 'express';
import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageStats
} from '../controllers/packageController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPackages);
router.get('/stats', getPackageStats);
router.get('/:id', getPackageById);

// Admin routes
router.post('/', protect, restrictTo('admin', 'super_admin'), createPackage);
router.patch('/:id', protect, restrictTo('admin', 'super_admin'), updatePackage);
router.delete('/:id', protect, restrictTo('admin', 'super_admin'), deletePackage);

export default router;