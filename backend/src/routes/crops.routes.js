import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { getCropSuggestions } from '../controllers/crops.controller.js';
import { chatRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/crops/suggestions - Get AI-powered crop suggestions
router.post('/suggestions', chatRateLimiter, getCropSuggestions);

export default router;
