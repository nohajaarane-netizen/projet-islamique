/**
 * Rate Limiting Middleware
 * Redis-backed rate limiting with different tiers
 */

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';

/**
 * Create rate limiter with Redis store
 */
function createRateLimiter(
  windowMs: number,
  maxRequests: number,
  keyPrefix: string
) {
  return rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return `${keyPrefix}:${req.ip || 'unknown'}`;
    },
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: 'Trop de requêtes. Veuillez réessayer plus tard.',
        code: 'RATE_LIMIT',
        data: null,
        meta: {
          timestamp: new Date().toISOString(),
          language: 'fr',
        },
      });
    },
  });
}

/**
 * Standard API rate limiter: 100 requests per minute
 */
export const standardLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  100,
  'api'
);

/**
 * Strict rate limiter for auth routes: 20 requests per minute
 */
export const authLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  20,
  'auth'
);

/**
 * Prayer calculation rate limiter: 20 requests per minute
 * (computationally expensive)
 */
export const prayerCalcLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  20,
  'prayer'
);

/**
 * Weather API rate limiter: 30 requests per minute
 */
export const weatherLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  30,
  'weather'
);

export default {
  standardLimiter,
  authLimiter,
  prayerCalcLimiter,
  weatherLimiter,
};
