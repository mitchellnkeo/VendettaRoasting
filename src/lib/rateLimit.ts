/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiter for API endpoints.
 * For production with high traffic, consider using Redis.
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (clears on server restart)
// For production, consider using Redis or a database
const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  // Contact form: 5 submissions per hour
  CONTACT: { windowMs: 60 * 60 * 1000, maxRequests: 5 },
  // Wholesale form: 3 submissions per hour
  WHOLESALE: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  // Reviews: 3 reviews per hour per IP
  REVIEWS: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  // General API: 100 requests per 15 minutes
  API: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
} as const;

/**
 * Get client identifier from request
 */
function getClientId(req: { headers: any; connection?: any }): string {
  // Try to get real IP from various headers (for proxies/load balancers)
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const ip = forwarded 
    ? forwarded.split(',')[0].trim() 
    : realIp 
    ? realIp 
    : req.connection?.remoteAddress 
    ? req.connection.remoteAddress 
    : 'unknown';

  return ip;
}

/**
 * Check if request is within rate limit
 * 
 * @param req - Next.js API request
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  req: { headers: any; connection?: any },
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const clientId = getClientId(req);
  const key = `${clientId}:${config.windowMs}`;
  const now = Date.now();

  // Get or create entry
  let entry = store[key];

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    store[key] = entry;
  }

  // Increment count
  entry.count++;

  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetTime = entry.resetTime;

  return { allowed, remaining, resetTime };
}

/**
 * Rate limit middleware for Next.js API routes
 * 
 * Usage:
 * ```typescript
 * export default async function handler(req, res) {
 *   const rateLimit = createRateLimit(RATE_LIMITS.CONTACT);
 *   const result = rateLimit(req);
 *   
 *   if (!result.allowed) {
 *     return res.status(429).json({
 *       success: false,
 *       message: 'Too many requests. Please try again later.',
 *       retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
 *     });
 *   }
 *   
 *   // Continue with handler...
 * }
 * ```
 */
export function createRateLimit(config: RateLimitConfig) {
  return (req: { headers: any; connection?: any }) => {
    return checkRateLimit(req, config);
  };
}

