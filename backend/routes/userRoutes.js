import express from 'express';
import { getAllUsers, verifyUser } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, restrictTo('admin', 'super_admin'), getAllUsers);
router.patch('/:id/verify', protect, restrictTo('admin', 'super_admin'), verifyUser);

export default router;