import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for chat endpoint
 * Limits: 10 requests per minute per IP
 * This helps prevent exceeding Gemini API free tier limits:
 * - Free tier: 15 RPM (requests per minute)
 * - We limit to 10 RPM to stay safe
 */
export const chatRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute per IP
    message: {
        error: 'Too many requests',
        message: 'You are sending messages too quickly. Please wait a minute before trying again.',
        retryAfter: '1 minute'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    // Skip successful requests from count (only count errors)
    skipSuccessfulRequests: false,
    // Skip failed requests from count
    skipFailedRequests: false,
});

/**
 * General API rate limiter
 * Limits: 100 requests per 15 minutes per IP
 */
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: {
        error: 'Too many requests',
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
