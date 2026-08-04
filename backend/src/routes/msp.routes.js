import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
    getWidgetData,
    getCropsBySeason,
    getCropHistory,
    syncMSPData
} from '../controllers/msp.controller.js';

const router = express.Router();

// Public endpoints (still require auth for security)
router.use(authMiddleware);

// GET /api/msp/widget - Get latest MSP for all crops
router.get('/widget', getWidgetData);

// GET /api/msp/crops/:season - Get list of crops for a season
router.get('/crops/:season', getCropsBySeason);

// GET /api/msp/:season/:crop - Get historical prices for a crop
router.get('/:season/:crop', getCropHistory);

// POST /api/msp/sync - Sync data from data.gov.in (admin only in production)
router.post('/sync', syncMSPData);

export default router;
