import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getSchemeSummary } from '../controllers/schemes.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/schemes/:schemeId/summary - Get AI-generated summary
router.get('/:schemeId/summary', getSchemeSummary);

export default router;
