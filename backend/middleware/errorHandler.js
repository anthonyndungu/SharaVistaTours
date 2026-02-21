import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || 'error';
  let message = err.message || 'Something went wrong';
  let errors = null; // To hold formatted validation errors

  // ✅ 1. HANDLE EXPRESS-VALIDATOR ERRORS (The {"0": {...}} case)
  // Check if the error has an .array() method (standard for express-validator)
  if (err.array && typeof err.array === 'function') {
    const validationErrors = err.array();
    
    // Extract the first meaningful message
    if (validationErrors.length > 0) {
      message = validationErrors[0].msg; 
      
      // Optional: Format them exactly like your frontend expects if you want the full object
      // This creates the { "0": { msg: ... } } structure explicitly
      const formattedErrors = {};
      validationErrors.forEach((error, index) => {
        formattedErrors[index] = {
          location: error.location,
          msg: error.msg,
          path: error.path,
          type: error.type
        };
      });
      errors = formattedErrors;
    }
    
    statusCode = 400;
    status = 'fail';
  }

  // 2. Log the error
  logger.error('Error:', {
    message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
    isOperational: err.isOperational
  });

  // 3. Development environment - send stack trace & full error details
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status,
      message,
      errors, // Include formatted validation errors
      stack: err.stack,
      error: err
    });
  }

  // 4. Production environment
  if (err.isOperational || errors) {
    // If it's operational OR a validation error, show the message
    const response = {
      status,
      message
    };
    
    // Optionally include the structured errors in production if your frontend needs them
    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  // 5. Programming or unknown error - don't leak details
  logger.error('🔥 UNHANDLED ERROR:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong! Please try again later.'
  });
};

export default errorHandler;