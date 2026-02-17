// import { TourPackage, PackageImage, Review } from '../models/index.js';
// import { Op } from 'sequelize';
// import logger from '../utils/logger.js';

// // @desc    Get all tour packages
// // @route   GET /api/v1/packages
// // @access  Public
// export const getAllPackages = async (req, res) => {
//   try {
//     // Build query options
//     const queryOptions = {
//       where: {},
//       include: [
//         {
//           model: PackageImage,
//           attributes: ['id', 'url', 'is_primary', 'caption']
//         },
//         {
//           model: Review,
//           attributes: ['id', 'rating', 'comment', 'created_at']
//         }
//       ],
//       order: [['created_at', 'DESC']]
//     };

//     // Filter by category
//     if (req.query.category) {
//       queryOptions.where.category = req.query.category;
//     }

//     // Filter by destination
//     if (req.query.destination) {
//       queryOptions.where.destination = {
//         [Op.iLike]: `%${req.query.destination}%`
//       };
//     }

//     // Filter by status
//     if (req.query.status) {
//       queryOptions.where.status = req.query.status;
//     }

//     // Filter featured packages
//     if (req.query.is_featured === 'true') {
//       queryOptions.where.is_featured = true;
//     }

//     // Filter by price range
//     if (req.query.min_price) {
//       queryOptions.where.price_adult = {
//         [Op.gte]: parseFloat(req.query.min_price)
//       };
//     }

//     if (req.query.max_price) {
//       if (!queryOptions.where.price_adult) {
//         queryOptions.where.price_adult = {};
//       }
//       queryOptions.where.price_adult[Op.lte] = parseFloat(req.query.max_price);
//     }

//     // Search by title or description
//     if (req.query.search) {
//       queryOptions.where[Op.or] = [
//         { title: { [Op.iLike]: `%${req.query.search}%` } },
//         { description: { [Op.iLike]: `%${req.query.search}%` } }
//       ];
//     }

//     // Pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 12;
//     const offset = (page - 1) * limit;

//     queryOptions.limit = limit;
//     queryOptions.offset = offset;

//     // Execute query
//     const { count, rows: packages } = await TourPackage.findAndCountAll(queryOptions);

//     res.status(200).json({
//       status: 'success',
//       results: packages.length,
//       total: count,
//       page,
//       pages: Math.ceil(count / limit),
//       data: { packages }
//     });
//   } catch (err) {
//     logger.error('Get all packages error:', err);
//     res.status(500).json({
//       status: 'error',
//       message: err.message
//     });
//   }
// };

// // @desc    Get single tour package
// // @route   GET /api/v1/packages/:id
// // @access  Public
// export const getPackageById = async (req, res) => {
//   try {
//     const packageData = await TourPackage.findByPk(req.params.id, {
//       include: [
//         {
//           model: PackageImage,
//           attributes: ['id', 'url', 'is_primary', 'caption']
//         },
//         {
//           model: Review,
//           attributes: ['id', 'rating', 'comment', 'created_at', 'is_verified_booking'],
//           include: [{
//             model: User,
//             attributes: ['name', 'profile_picture']
//           }]
//         }
//       ]
//     });

//     if (!packageData) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Package not found'
//       });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: { package: packageData }
//     });
//   } catch (err) {
//     logger.error('Get package by ID error:', err);
//     res.status(500).json({
//       status: 'error',
//       message: err.message
//     });
//   }
// };

// // @desc    Create new tour package
// // @route   POST /api/v1/packages
// // @access  Private/Admin
// export const createPackage = async (req, res) => {
//   try {
//     const packageData = await TourPackage.create({
//       ...req.body,
//       created_by: req.user.id
//     });

//     // Handle images if provided
//     if (req.body.images && Array.isArray(req.body.images)) {
//       const images = req.body.images.map(img => ({
//         ...img,
//         package_id: packageData.id
//       }));
//       await PackageImage.bulkCreate(images);
//     }

//     const newPackage = await TourPackage.findByPk(packageData.id, {
//       include: [{
//         model: PackageImage,
//         attributes: ['id', 'url', 'is_primary', 'caption']
//       }]
//     });

//     logger.info(`Package created by ${req.user.email}: ${newPackage.title}`);

//     res.status(201).json({
//       status: 'success',
//       message: 'Package created successfully',
//       data: { package: newPackage }
//     });
//   } catch (err) {
//     logger.error('Create package error:', err);
//     res.status(400).json({
//       status: 'fail',
//       message: err.message
//     });
//   }
// };

// // @desc    Update tour package
// // @route   PATCH /api/v1/packages/:id
// // @access  Private/Admin
// export const updatePackage = async (req, res) => {
//   try {
//     const packageData = await TourPackage.findByPk(req.params.id);

//     if (!packageData) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Package not found'
//       });
//     }

//     await packageData.update(req.body);

//     // Handle images update
//     if (req.body.images && Array.isArray(req.body.images)) {
//       // Delete existing images
//       await PackageImage.destroy({ where: { package_id: packageData.id } });
      
//       // Create new images
//       const images = req.body.images.map(img => ({
//         ...img,
//         package_id: packageData.id
//       }));
//       await PackageImage.bulkCreate(images);
//     }

//     const updatedPackage = await TourPackage.findByPk(packageData.id, {
//       include: [{
//         model: PackageImage,
//         attributes: ['id', 'url', 'is_primary', 'caption']
//       }]
//     });

//     logger.info(`Package updated by ${req.user.email}: ${updatedPackage.title}`);

//     res.status(200).json({
//       status: 'success',
//       message: 'Package updated successfully',
//       data: { package: updatedPackage }
//     });
//   } catch (err) {
//     logger.error('Update package error:', err);
//     res.status(400).json({
//       status: 'fail',
//       message: err.message
//     });
//   }
// };

// // @desc    Delete tour package
// // @route   DELETE /api/v1/packages/:id
// // @access  Private/Admin
// export const deletePackage = async (req, res) => {
//   try {
//     const packageData = await TourPackage.findByPk(req.params.id);

//     if (!packageData) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Package not found'
//       });
//     }

//     await packageData.destroy();

//     logger.info(`Package deleted by ${req.user.email}: ${packageData.title}`);

//     res.status(204).json({
//       status: 'success',
//       message: 'Package deleted successfully'
//     });
//   } catch (err) {
//     logger.error('Delete package error:', err);
//     res.status(400).json({
//       status: 'fail',
//       message: err.message
//     });
//   }
// };

// // @desc    Get package statistics
// // @route   GET /api/v1/packages/stats
// // @access  Private/Admin
// export const getPackageStats = async (req, res) => {
//   try {
//     const stats = await TourPackage.findAll({
//       attributes: [
//         'category',
//         [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
//         [sequelize.fn('AVG', sequelize.col('price_adult')), 'avgPrice'],
//         [sequelize.fn('MAX', sequelize.col('price_adult')), 'maxPrice'],
//         [sequelize.fn('MIN', sequelize.col('price_adult')), 'minPrice']
//       ],
//       group: ['category'],
//       raw: true
//     });

//     res.status(200).json({
//       status: 'success',
//       data: { stats }
//     });
//   } catch (err) {
//     logger.error('Get package stats error:', err);
//     res.status(500).json({
//       status: 'error',
//       message: err.message
//     });
//   }
// };


import { TourPackage, PackageImage, Review } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

// @desc    Get all tour packages
// @route   GET /api/v1/packages
// @access  Public
export const getAllPackages = async (req, res) => {
  try {
    // Build query options
    const queryOptions = {
      where: {},
      include: [
        {
          model: PackageImage,
          attributes: ['id', 'url', 'is_primary', 'caption']
        },
        {
          model: Review,
          attributes: ['id', 'rating', 'comment', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']]
    };

    // Filter by category
    if (req.query.category) {
      queryOptions.where.category = req.query.category;
    }

    // Filter by destination
    if (req.query.destination) {
      queryOptions.where.destination = {
        [Op.iLike]: `%${req.query.destination}%`
      };
    }

    // Filter by status
    if (req.query.status) {
      queryOptions.where.status = req.query.status;
    }

    // Filter featured packages
    if (req.query.is_featured === 'true') {
      queryOptions.where.is_featured = true;
    }

    // Filter by price range
    if (req.query.min_price) {
      queryOptions.where.price_adult = {
        [Op.gte]: parseFloat(req.query.min_price)
      };
    }

    if (req.query.max_price) {
      if (!queryOptions.where.price_adult) {
        queryOptions.where.price_adult = {};
      }
      queryOptions.where.price_adult[Op.lte] = parseFloat(req.query.max_price);
    }

    // Search by title or description
    if (req.query.search) {
      queryOptions.where[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;

    // Execute query
    const { count, rows: packages } = await TourPackage.findAndCountAll(queryOptions);

    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Packages retrieved:', packages);

    res.status(200).json({
      status: 'success',
      results: packages.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: { packages }
    });
  } catch (err) {
    logger.error('Get all packages error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Get single tour package
// @route   GET /api/v1/packages/:id
// @access  Public
export const getPackageById = async (req, res) => {
  try {
    // ⚠️ Note: You're including `User` in Review, but `User` is not imported.
    // If you need user data in reviews, import User or remove the include.
    const packageData = await TourPackage.findByPk(req.params.id, {
      include: [
        {
          model: PackageImage,
          attributes: ['id', 'url', 'is_primary', 'caption']
        },
        {
          model: Review,
          attributes: ['id', 'rating', 'comment', 'created_at', 'is_verified_booking'],
          // 👇 Uncomment only if you import User
          // include: [{
          //   model: User,
          //   attributes: ['name', 'profile_picture']
          // }]
        }
      ]
    });

    if (!packageData) {
      return res.status(404).json({
        status: 'fail',
        message: 'Package not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { package: packageData }
    });
  } catch (err) {
    logger.error('Get package by ID error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Create new tour package
// @route   POST /api/v1/packages
// @access  Private/Admin
export const createPackage = async (req, res) => {
  try {
    const packageData = await TourPackage.create({
      ...req.body,
      created_by: req.user.id
    });

    // Handle images if provided
    if (req.body.images && Array.isArray(req.body.images)) {
      const images = req.body.images.map(img => ({
        ...img,
        package_id: packageData.id
      }));
      await PackageImage.bulkCreate(images);
    }

    const newPackage = await TourPackage.findByPk(packageData.id, {
      include: [{
        model: PackageImage,
        attributes: ['id', 'url', 'is_primary', 'caption']
      }]
    });

    logger.info(`Package created by ${req.user.email}: ${newPackage.title}`);

    res.status(201).json({
      status: 'success',
      message: 'Package created successfully',
      data: { package: newPackage }
    });
  } catch (err) {
    logger.error('Create package error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Update tour package
// @route   PATCH /api/v1/packages/:id
// @access  Private/Admin
export const updatePackage = async (req, res) => {
  try {
    const packageData = await TourPackage.findByPk(req.params.id);

    if (!packageData) {
      return res.status(404).json({
        status: 'fail',
        message: 'Package not found'
      });
    }

    await packageData.update(req.body);

    // Handle images update
    if (req.body.images && Array.isArray(req.body.images)) {
      // Delete existing images
      await PackageImage.destroy({ where: { package_id: packageData.id } });
      
      // Create new images
      const images = req.body.images.map(img => ({
        ...img,
        package_id: packageData.id
      }));
      await PackageImage.bulkCreate(images);
    }

    const updatedPackage = await TourPackage.findByPk(packageData.id, {
      include: [{
        model: PackageImage,
        attributes: ['id', 'url', 'is_primary', 'caption']
      }]
    });

    logger.info(`Package updated by ${req.user.email}: ${updatedPackage.title}`);

    res.status(200).json({
      status: 'success',
      message: 'Package updated successfully',
      data: { package: updatedPackage }
    });
  } catch (err) {
    logger.error('Update package error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Delete tour package
// @route   DELETE /api/v1/packages/:id
// @access  Private/Admin
export const deletePackage = async (req, res) => {
  try {
    const packageData = await TourPackage.findByPk(req.params.id);

    if (!packageData) {
      return res.status(404).json({
        status: 'fail',
        message: 'Package not found'
      });
    }

    await packageData.destroy();

    logger.info(`Package deleted by ${req.user.email}: ${packageData.title}`);

    res.status(204).json({
      status: 'success',
      message: 'Package deleted successfully'
    });
  } catch (err) {
    logger.error('Delete package error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Get package statistics
// @route   GET /api/v1/packages/stats
// @access  Private/Admin
export const getPackageStats = async (req, res) => {
  try {
    const stats = await TourPackage.findAll({
      attributes: [
        'category',
        [TourPackage.sequelize.fn('COUNT', TourPackage.sequelize.col('id')), 'count'],
        [TourPackage.sequelize.fn('AVG', TourPackage.sequelize.col('price_adult')), 'avgPrice'],
        [TourPackage.sequelize.fn('MAX', TourPackage.sequelize.col('price_adult')), 'maxPrice'],
        [TourPackage.sequelize.fn('MIN', TourPackage.sequelize.col('price_adult')), 'minPrice']
      ],
      group: ['category'],
      raw: true
    });

    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (err) {
    logger.error('Get package stats error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};