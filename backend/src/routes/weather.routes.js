import express from 'express';
import { getWeather } from '../controllers/weather.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', getWeather);

export default router;
