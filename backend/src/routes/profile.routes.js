import express from 'express';
import { body } from 'express-validator';
import { getProfile, createProfile, updateProfile } from '../controllers/profile.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { SOIL_TYPES } from '../utils/constants.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const profileValidation = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('location').notEmpty().withMessage('Location is required').trim(),
    body('soilType').isIn(SOIL_TYPES).withMessage('Invalid soil type'),
    body('pincode').optional().matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
    body('landSize').optional().isFloat({ min: 0 }).withMessage('Land size must be positive'),
];

// Routes
router.get('/', getProfile);
router.post('/', profileValidation, validate, createProfile);
router.put('/', profileValidation, validate, updateProfile);

export default router;
