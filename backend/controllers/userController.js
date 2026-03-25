import { User, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';
//Import Redis helpers
import { getOrSetCache, invalidateCache, invalidatePattern } from '../config/redis.js';

// @desc    Get all users (Admin only) - CACHED
// @route   GET /api/v1/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    // 1. Permission Check
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin privileges required.'
      });
    }

    // 2. Create Cache Key based on Query Params
    // This ensures filtered views are cached separately
    const queryString = JSON.stringify(req.query);
    const cacheKey = `users:list:${queryString}`;

    const result = await getOrSetCache(
      cacheKey,
      async () => {
        logger.debug(`Cache MISS for ${cacheKey}. Fetching users from DB...`);
        
        // 3. Build Query Options
        const queryOptions = {
          attributes: { 
            exclude: ['password', 'password_reset_token', 'password_reset_expires', 'password_changed_at'] 
          },
          order: [['created_at', 'DESC']],
          where: {}
        };

        // 4. Filter by Role
        if (req.query.role) {
          const validRoles = ['client', 'admin', 'super_admin'];
          if (validRoles.includes(req.query.role)) {
            queryOptions.where.role = req.query.role;
          } else {
            throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
          }
        }

        // 5. Search by Name or Email
        if (req.query.search) {
          const searchTerm = `%${req.query.search}%`;
          queryOptions.where[Op.or] = [
            { name: { [Op.iLike]: searchTerm } },
            { email: { [Op.iLike]: searchTerm } }
          ];
        }

        // 6. Filter by Verification Status
        if (req.query.is_verified !== undefined) {
          const isVerified = req.query.is_verified === 'true';
          queryOptions.where.is_verified = isVerified;
        }

        // 7. Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 15;
        const offset = (page - 1) * limit;

        queryOptions.limit = limit;
        queryOptions.offset = offset;

        const { count, rows } = await User.findAndCountAll(queryOptions);

        return {
          results: rows.length,
          total: count,
          page,
          pages: Math.ceil(count / limit),
          users: rows
        };
      },
      300 // Cache for 5 minutes
    );

    res.status(200).json({
      status: 'success',
      ...result
    });

  } catch (err) {
    if (err.message.includes('Invalid role')) {
      return res.status(400).json({ status: 'fail', message: err.message });
    }
    logger.error('Get all users error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Verify a user (Admin only) - INVALIDATES CACHE
// @route   PATCH /api/v1/users/:id/verify
// @access  Private/Admin
export const verifyUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      await t.rollback();
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    const user = await User.findByPk(req.params.id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    await user.update({ is_verified: true }, { transaction: t });
    await t.commit();

    // 🚀 INVALIDATE CACHE:
    // 1. Clear specific user profile cache
    await invalidateCache(`user:profile:${user.id}`);
    // 2. Clear all user list caches (since verification status changed)
    await invalidatePattern('users:list:*');

    res.status(200).json({
      status: 'success',
      message: `User ${user.name} has been verified and can now log in.`,
      data: { user }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Verify user error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Get single user by ID (Optional Helper - CACHED)
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    const cacheKey = `user:profile:${req.params.id}`;

    const user = await getOrSetCache(
      cacheKey,
      async () => {
        logger.debug(`Cache MISS for ${cacheKey}. Fetching user from DB...`);
        return await User.findByPk(req.params.id, {
          attributes: { 
            exclude: ['password', 'password_reset_token', 'password_reset_expires', 'password_changed_at'] 
          }
        });
      },
      600 // Cache for 10 minutes
    );

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    logger.error('Get user by ID error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};