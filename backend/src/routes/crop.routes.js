import express from 'express';
import { getCrops, getCropById } from '../controllers/crop.controller.js';
import { getCropSuggestions } from '../controllers/crops.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { chatRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getCrops);
router.get('/:id', getCropById);

// AI-powered crop suggestions
router.post('/suggestions', chatRateLimiter, getCropSuggestions);

export default router;
