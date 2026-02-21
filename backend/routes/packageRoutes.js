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
import upload from '../utils/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllPackages);
router.get('/stats', getPackageStats);
router.get('/:id', getPackageById);

// Admin routes
router.post('/', protect, restrictTo('admin', 'super_admin'),upload.array('newImages', 10), createPackage);
router.put('/:id', protect, restrictTo('admin', 'super_admin'),upload.array('newImages', 10), updatePackage);
router.delete('/:id', protect, restrictTo('admin', 'super_admin'), deletePackage);

export default router;