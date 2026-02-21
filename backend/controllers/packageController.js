import { TourPackage, PackageImage, Review, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all tour packages
// @route   GET /api/v1/packages
// @access  Public
export const getAllPackages = async (req, res) => {
  // READ operations do not need transactions unless you need strict isolation levels
  try {
    const queryOptions = {
      where: {},
      include: [
        { model: PackageImage, attributes: ['id', 'url', 'is_primary', 'caption'] },
        { model: Review, attributes: ['id', 'rating', 'comment', 'created_at'] }
      ],
      order: [['created_at', 'DESC']]
    };

    // Filters
    if (req.query.category) queryOptions.where.category = req.query.category;
    if (req.query.destination) {
      queryOptions.where.destination = { [Op.iLike]: `%${req.query.destination}%` };
    }
    if (req.query.status) queryOptions.where.status = req.query.status;
    if (req.query.is_featured === 'true') queryOptions.where.is_featured = true;
    
    // Price Range
    if (req.query.min_price || req.query.max_price) {
      queryOptions.where.price_adult = {};
      if (req.query.min_price) queryOptions.where.price_adult[Op.gte] = parseFloat(req.query.min_price);
      if (req.query.max_price) queryOptions.where.price_adult[Op.lte] = parseFloat(req.query.max_price);
    }

    // Search
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

    const { count, rows: packages } = await TourPackage.findAndCountAll(queryOptions);

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
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Get single tour package
// @route   GET /api/v1/packages/:id
// @access  Public
export const getPackageById = async (req, res) => {
  try {
    const packageData = await TourPackage.findByPk(req.params.id, {
      include: [
        { model: PackageImage, attributes: ['id', 'url', 'is_primary', 'caption'] },
        { model: Review, attributes: ['id', 'rating', 'comment', 'created_at', 'is_verified_booking'] }
      ]
    });

    if (!packageData) {
      return res.status(404).json({ status: 'fail', message: 'Package not found' });
    }

    res.status(200).json({ status: 'success', data: { package: packageData } });
  } catch (err) {
    logger.error('Get package by ID error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Create new tour package
// @route   POST /api/v1/packages
// @access  Private/Admin
export const createPackage = async (req, res) => {
  // Start a transaction
  const t = await sequelize.transaction();

  try {
    let { title, destination, images, ...packageFields } = req.body;

    // Parse images if stringified
    let parsedImages = [];
    if (typeof images === 'string') {
      try { parsedImages = JSON.parse(images); } 
      catch (e) { throw new Error('Invalid images data format.'); }
    } else if (Array.isArray(images)) {
      parsedImages = images;
    }

    // Validation
    if (!title) throw new Error('Package title is required.');

    // Check Duplicate
    const existingPackage = await TourPackage.findOne({
      where: { title: { [Op.iLike]: title.trim() } },
      transaction: t // Use transaction for consistency check
    });

    if (existingPackage) {
      await t.rollback();
      return res.status(409).json({
        status: 'fail',
        message: `A package with the title "${title}" already exists.`
      });
    }

    // 1. Create Package
    const newPackage = await TourPackage.create({
      ...packageFields,
      title,
      destination,
      created_by: req.user ? req.user.id : null
    }, { transaction: t });

    // 2. Handle Images
    if (parsedImages.length > 0) {
      const imagesToSave = [];
      const uploadedFiles = req.files || [];
      let fileIndex = 0;

      for (const img of parsedImages) {
        let imageUrl = img.url;

        // If new image (no ID) and file exists
        if (!img.id && uploadedFiles[fileIndex]) {
          const file = uploadedFiles[fileIndex];
          // Save relative path: packages/filename.jpg
          imageUrl = `packages/${file.filename}`; 
          fileIndex++;
        }

        if (imageUrl) {
          imagesToSave.push({
            tourPackageId: newPackage.id, // Match your FK name
            url: imageUrl,
            caption: img.caption || '',
            is_primary: img.is_primary || (fileIndex === 1) // First uploaded is primary
          });
        }
      }

      if (imagesToSave.length > 0) {
        await PackageImage.bulkCreate(imagesToSave, { transaction: t });
      }
    }

    // Commit Transaction
    await t.commit();

    // Fetch full data (outside transaction to avoid locking issues on read)
    const createdPackageWithImages = await TourPackage.findByPk(newPackage.id, {
      include: [{ model: PackageImage, attributes: ['id', 'url', 'is_primary', 'caption'] }]
    });

    logger.info(`Package created: ${createdPackageWithImages.title}`);

    res.status(201).json({
      status: 'success',
      message: 'Package created successfully',
      data: { package: createdPackageWithImages }
    });

  } catch (err) {
    // Rollback on error
    await t.rollback();
    logger.error('Create package error:', err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ status: 'fail', message: 'Duplicate entry detected.' });
    }

    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Update tour package
// @route   PATCH /api/v1/packages/:id
// @access  Private/Admin
export const updatePackage = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    let { images, ...packageFields } = req.body;

    if (typeof images === 'string') {
      images = JSON.parse(images);
    }

    const packageData = await TourPackage.findByPk(id, { transaction: t });
    if (!packageData) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'Package not found' });
    }

    // 1. Update Text Fields
    await packageData.update(packageFields, { transaction: t });

    // 2. Handle Images (Replace All)
    if (images && Array.isArray(images)) {
      // A. Delete old images from DB
      await PackageImage.destroy({ where: { tourPackageId: id }, transaction: t });

      // B. Prepare new images
      const validImages = [];
      const uploadedFiles = req.files || [];
      let fileIndex = 0;

      for (const img of images) {
        let imageUrl = img.url;

        // If new image (no ID) and we have an uploaded file
        if (!img.id && uploadedFiles[fileIndex]) {
          const file = uploadedFiles[fileIndex];
          imageUrl = `packages/${file.filename}`;
          fileIndex++;
        } else if (img.id) {
          // Existing image reference (keep URL)
          imageUrl = img.url;
        }

        if (imageUrl) {
          validImages.push({
            tourPackageId: id,
            url: imageUrl,
            caption: img.caption || '',
            is_primary: img.is_primary || false
          });
        }
      }

      if (validImages.length > 0) {
        await PackageImage.bulkCreate(validImages, { transaction: t });
      }
    }

    await t.commit();

    const updatedPackage = await TourPackage.findByPk(id, {
      include: [{ model: PackageImage, attributes: ['id', 'url', 'is_primary', 'caption'] }]
    });

    res.status(200).json({
      status: 'success',
      message: 'Package updated successfully',
      data: { package: updatedPackage }
    });

  } catch (err) {
    await t.rollback();
    logger.error('Update package error:', err);
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @desc    Delete tour package
// @route   DELETE /api/v1/packages/:id
// @access  Private/Admin
export const deletePackage = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const packageData = await TourPackage.findByPk(req.params.id, { transaction: t });

    if (!packageData) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'Package not found' });
    }

    // Optional: Manually delete files from disk before DB deletion
    // Note: Since you have onDelete: 'CASCADE' in models, 
    // deleting the package will automatically delete PackageImage rows.
    // But it won't delete the physical files. You might want to do that here.
    
 
    const images = await PackageImage.findAll({ 
      where: { tourPackageId: packageData.id }, 
      transaction: t 
    });
    images.forEach(img => {
       const filePath = path.join(__dirname, '../uploads', img.url);
       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    

    await packageData.destroy({ transaction: t });

    await t.commit();

    logger.info(`Package deleted: ${packageData.title}`);

    res.status(200).json({
      status: 'success',
      message: 'Package deleted successfully'
    });
  } catch (err) {
    await t.rollback();
    logger.error('Delete package error:', err);
    res.status(400).json({ status: 'fail', message: err.message });
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
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('price_adult')), 'avgPrice'],
        [sequelize.fn('MAX', sequelize.col('price_adult')), 'maxPrice'],
        [sequelize.fn('MIN', sequelize.col('price_adult')), 'minPrice']
      ],
      group: ['category'],
      raw: true
    });

    res.status(200).json({ status: 'success', data: { stats } });
  } catch (err) {
    logger.error('Get package stats error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};