import { createClient } from 'redis';
import logger from '../utils/logger.js';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
});

// ✅ Event Listeners for Monitoring
redisClient.on('error', (err) => {
  logger.error('❌ Redis Client Error:', err.message);
});

redisClient.on('connect', () => {
  logger.info('✅ Connected to Redis successfully');
});

redisClient.on('reconnecting', () => {
  logger.warn('🔄 Redis Client Reconnecting...');
});

redisClient.on('ready', () => {
  logger.info('🟢 Redis Client Ready');
});

// ✅ Connect on Startup
(async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connection established.');
  } catch (err) {
    logger.error('🔥 Failed to connect to Redis:', err.message);
    // Do not crash the app, just log. The app will fallback to DB.
  }
})();

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get data from cache or fetch from DB if missing
 * @param {string} key - Unique cache key
 * @param {Function} fetchFunction - Async function to run if cache miss
 * @param {number} ttl - Time to live in seconds (default: 1 hour)
 */
export const getOrSetCache = async (key, fetchFunction, ttl = 3600) => {
  try {
    // 1. Try to get from Redis
    const cachedData = await redisClient.get(key);
    
    if (cachedData) {
      logger.debug(`🟢 Cache HIT: ${key}`);
      return JSON.parse(cachedData);
    }

    // 2. If miss, fetch from DB
    logger.debug(`🟡 Cache MISS: ${key}. Fetching from DB...`);
    const freshData = await fetchFunction();

    // 3. Save to Redis with expiry if data exists
    if (freshData) {
      await redisClient.setEx(key, ttl, JSON.stringify(freshData));
      logger.debug(`💾 Cached data for: ${key} (TTL: ${ttl}s)`);
    }

    return freshData;
  } catch (error) {
    logger.error('Redis getOrSetCache error:', error.message);
    // Fallback: Return data from DB even if Redis fails
    logger.warn('⚠️ Redis failed, falling back to DB for:', key);
    return await fetchFunction();
  }
};

/**
 * Invalidate (delete) a specific cache key
 */
export const invalidateCache = async (key) => {
  try {
    await redisClient.del(key);
    logger.info(`🔴 Cache invalidated: ${key}`);
  } catch (error) {
    logger.error('Error invalidating cache key:', error.message);
  }
};

/**
 * Invalidate multiple keys by pattern (e.g., 'packages:*')
 */
export const invalidatePattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`🔴 Cache invalidated for pattern: ${pattern} (${keys.length} keys)`);
    }
  } catch (error) {
    logger.error('Error invalidating cache pattern:', error.message);
  }
};

export { redisClient };