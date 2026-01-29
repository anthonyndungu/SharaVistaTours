import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method
  });

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development environment - send stack trace
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // Production environment - send generic error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Programming or unknown error - don't leak details
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong! Please try again later.'
  });
};

export default errorHandler;