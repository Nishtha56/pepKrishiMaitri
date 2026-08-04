import express from 'express';
import { body } from 'express-validator';
import { chat } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { chatRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Apply rate limiter to chat endpoint (10 requests per minute)
router.use(chatRateLimiter);

// Validation rules
const chatValidation = [
    body('message').notEmpty().withMessage('Message is required').trim(),
];

// Routes
router.post('/', chatValidation, validate, chat);

export default router;
