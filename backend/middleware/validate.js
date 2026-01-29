import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';

// Validate request data
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', errors.array());
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Validate file upload
export const validateFileUpload = (fieldName = 'image') => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: `Please upload a file for field: ${fieldName}`
      });
    }
    
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB
    
    if (req.file.size > maxSize) {
      return res.status(400).json({
        status: 'fail',
        message: `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`
      });
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Only JPEG, PNG, JPG and WebP files are allowed'
      });
    }
    
    next();
  };
};