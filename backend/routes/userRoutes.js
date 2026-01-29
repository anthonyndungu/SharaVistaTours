import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, restrictTo('admin', 'super_admin'), getAllUsers);

export default router;