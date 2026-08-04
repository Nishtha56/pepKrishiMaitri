import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
    listSchemes,
    getCategories,
    getSchemeSummary,
    clearCache
} from '../controllers/schemes.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/discover/schemes - List schemes with optional filters
router.get('/schemes', listSchemes);

// GET /api/discover/categories - Get scheme categories
router.get('/categories', getCategories);

// GET /api/schemes/:schemeId/summary - Get AI summary (mounted separately in app.js)
// This is just for documentation, actual route is in app.js

// POST /api/discover/clear-cache - Clear summary cache (admin)
router.post('/clear-cache', clearCache);

export default router;
