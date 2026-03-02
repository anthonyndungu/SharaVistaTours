// middleware/paymentSecurity.js
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

/**
 * Rate limiter for payment endpoints
 * Prevents abuse and brute-force attacks on payment initiation
 */
export const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each user to 5 payment attempts per window
  message: { 
    status: 'fail', 
    message: 'Too many payment attempts. Please try again after 15 minutes.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Generate key by user ID (if authenticated) or IP
  keyGenerator: (req) => {
    return req.user?.id || req.ip || 'anonymous';
  },
  // Skip rate limiting for successful requests (optional)
  skipSuccessfulRequests: false,
  // Log rate limit hits
  handler: (req, res) => {
    logger.warn('Payment rate limit exceeded', {
      ip: req.ip,
      userId: req.user?.id,
      path: req.path,
      method: req.method
    });
    res.status(429).json({ 
      status: 'fail', 
      message: 'Too many payment attempts. Please try again after 15 minutes.' 
    });
  }
});

/**
 * Verify MPESA callback is from Safaricom IP ranges
 * Prevents spoofed callback attacks
 */
export const verifyMpesaCallback = (req, res, next) => {
  // Skip verification in sandbox/development
  if (process.env.MPESA_ENV === 'sandbox' || process.env.NODE_ENV === 'development') {
    return next();
  }

  // Safaricom production IP ranges (update with current ranges from Daraja docs)
  const safaricomIPs = [
    '196.201.212.0/24',
    '196.201.213.0/24',
    '154.126.160.0/24',
    '196.201.214.0/24'
  ];

  const clientIP = req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'];
  
  // Simple IP check (for production, use ip-range-check package)
  // TODO: Implement proper CIDR matching with 'ip-range-check' package
  const isSafaricomIP = safaricomIPs.some(range => {
    const baseIP = range.split('/')[0];
    return clientIP?.startsWith(baseIP.split('.').slice(0, 3).join('.'));
  });

  if (!isSafaricomIP) {
    logger.warn('MPESA callback from unauthorized IP', { 
      ip: clientIP,
      path: req.path 
    });
    return res.status(403).json({ 
      ResultCode: 1, 
      ResultDesc: 'Unauthorized IP address' 
    });
  }

  logger.debug('MPESA callback IP verified', { ip: clientIP });
  next();
};

/**
 * Verify Stripe webhook signature
 * This should be applied BEFORE parsing JSON body
 */
export const verifyStripeWebhook = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  
  if (!signature) {
    logger.warn('Stripe webhook missing signature', { path: req.path });
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  // Signature verification is handled in stripeService.handleWebhook()
  // This middleware just ensures the header exists
  next();
};

/**
 * Validate payment amount limits
 * Prevents unusually large or small payment attempts
 */
export const validatePaymentAmount = (min = 1, max = 1000000) => {
  return (req, res, next) => {
    const amount = req.body?.amount;
    
    if (!amount) {
      return next(); // Let controller handle validation
    }
    
    if (amount < min || amount > max) {
      logger.warn('Payment amount out of range', { 
        amount, 
        min, 
        max,
        userId: req.user?.id 
      });
      return res.status(400).json({ 
        status: 'fail', 
        message: `Payment amount must be between KES ${min} and KES ${max}` 
      });
    }
    
    next();
  };
};

/**
 * Request fingerprinting for fraud detection
 * Adds metadata to payment requests for audit trail
 */
export const fingerprintPaymentRequest = (req, res, next) => {
  // Add request metadata for audit
  req.paymentMetadata = {
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
    requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  logger.info('Payment request fingerprinted', {
    requestId: req.paymentMetadata.requestId,
    ip: req.paymentMetadata.ip,
    path: req.path
  });
  
  next();
};

export default {
  paymentRateLimit,
  verifyMpesaCallback,
  verifyStripeWebhook,
  validatePaymentAmount,
  fingerprintPaymentRequest
};