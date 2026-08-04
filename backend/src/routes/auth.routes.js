import express from 'express';
import { body } from 'express-validator';
import { register, login, me, logout, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

// Validation rules
const registerValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);

// Password reset routes
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Please provide a valid email'),
], validate, forgotPassword);

router.post('/reset-password', [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, resetPassword);

export default router;
