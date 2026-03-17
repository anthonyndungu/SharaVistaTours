import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';
import logger from '../utils/logger.js';

// ✅ Helper to create a limiter with Redis store
const createLimiter = (windowMs, max, message, statusCode = 429) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    statusCode,
    message,
    handler: (req, res, next, options) => {
      logger.warn(`⚠️ Rate Limit Exceeded for IP: ${req.ip} on ${req.path}`);
      res.status(options.statusCode).json({
        status: 'fail',
        message: options.message,
        code: 'RATE_LIMIT_EXCEEDED'
      });
    },
    store: new RedisStore({
      // Send command to redis client
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
  });
};

// ==========================================
// SPECIFIC LIMITERS
// ==========================================

/**
 * Login Limiter: 5 attempts per 15 minutes
 * Prevents brute-force password guessing
 */
export const loginLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  5,              // 5 attempts
  'Too many login attempts from this IP, please try again after 15 minutes.',
  429
);

/**
 * Register Limiter: 3 accounts per 1 hour
 * Prevents spam account creation
 */
export const registerLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  3,              // 3 attempts
  'Too many accounts created from this IP, please try again later.',
  429
);

/**
 * OTP Limiter: 2 requests per 1 minute
 * Prevents SMS/Email bombing
 */
export const otpLimiter = createLimiter(
  60 * 1000,      // 1 minute
  2,              // 2 requests
  'Too many OTP requests, please wait a minute before trying again.',
  429
);

/**
 * General API Limiter: 100 requests per 15 minutes
 * Prevents general API abuse
 */
export const apiLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  100,            // 100 requests
  'Too many requests, please slow down.',
  429
);

export default {
  loginLimiter,
  registerLimiter,
  otpLimiter,
  apiLimiter
};