import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';

// Validate request data
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Convert to array to easily access the first error
    const errorArray = errors.array();
    
    // Log the raw mapped object for your debugging (this is what you saw in logs)
    logger.warn('Validation errors (Mapped):', errors.mapped());
    logger.warn('Validation errors (Array):', errorArray);

    // ✅ CRITICAL FIX: Extract the specific message from the FIRST error
    const specificMessage = errorArray.length > 0 ? errorArray[0].msg : 'Validation failed';

    // Construct the response explicitly
    const responseBody = {
      status: 'fail',
      message: specificMessage, // This MUST be the specific string "New passwords do not match"
      errors: errorArray.map(err => ({
        field: err.param,
        message: err.msg,
        location: err.location
      })),
      timestamp: new Date().toISOString()
    };

    // Log what we are actually sending to the client
    logger.info('Sending validation response:', responseBody);

    return res.status(400).json(responseBody);
  }
  
  next();
};

// Validate file upload (Unchanged)
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