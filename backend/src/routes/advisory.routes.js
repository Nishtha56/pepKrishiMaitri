import express from 'express';
import { body } from 'express-validator';
import { getAdvisories, createAdvisory } from '../controllers/advisory.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ADVISORY_TYPES } from '../utils/constants.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const advisoryValidation = [
    body('advisoryType').isIn(ADVISORY_TYPES).withMessage('Invalid advisory type'),
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('content').notEmpty().withMessage('Content is required').trim(),
    body('crops').optional().isArray().withMessage('Crops must be an array'),
    body('scheduledFor').optional().isISO8601().withMessage('Invalid date format'),
];

// Routes
router.get('/', getAdvisories);
router.post('/', advisoryValidation, validate, createAdvisory);

export default router;
