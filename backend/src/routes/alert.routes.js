import express from 'express';
import { body } from 'express-validator';
import { getAlerts, createAlert, updateAlert } from '../controllers/alert.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ALERT_TYPES, SEVERITY_LEVELS } from '../utils/constants.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const alertValidation = [
    body('alertType').isIn(ALERT_TYPES).withMessage('Invalid alert type'),
    body('severity').isIn(SEVERITY_LEVELS).withMessage('Invalid severity level'),
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('description').notEmpty().withMessage('Description is required').trim(),
    body('preventionTips').optional().trim(),
    body('affectedCrops').optional().isArray().withMessage('Affected crops must be an array'),
];

// Routes
router.get('/', getAlerts);
router.post('/', alertValidation, validate, createAlert);
router.put('/:id', updateAlert); // Less strict validation for updates (e.g., marking as read)

export default router;
