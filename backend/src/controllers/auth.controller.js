import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists with this email',
            });
        }

        // Create user
        const user = await User.create({ email, password });

        // Generate token
        const token = generateToken({
            userId: user._id,
            email: user.email,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: user.toSafeObject(),
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password',
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid email or password',
            });
        }

        // Generate token
        const token = generateToken({
            userId: user._id,
            email: user.email,
        });

        res.json({
            message: 'Login successful',
            user: user.toSafeObject(),
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user with profile
 * GET /api/auth/me
 */
export const me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const profile = await Profile.findOne({ userId: req.user._id });

        res.json({
            user: user.toSafeObject(),
            profile,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout (client-side token removal)
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
    res.json({
        message: 'Logout successful. Please remove token from client.',
    });
};

/**
 * Forgot password - Generate and send reset token
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email });

        // Generic message for security (don't reveal if email exists)
        const message = 'If an account exists with this email, a password reset code has been sent.';

        if (!user) {
            return res.json({ message });
        }

        // Generate 6-digit reset token
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiry to 15 minutes from now
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

        // Save token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // TODO: Send email with resetToken
        // For MVP/demo: return token in response
        console.log('Password reset token for', email, ':', resetToken);

        res.json({
            message,
            // IMPORTANT: Remove this in production! Only for testing
            resetToken, // Exposed for demo purposes
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        // Find user with valid reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        }).select('+resetToken +resetTokenExpiry');

        if (!user) {
            return res.status(400).json({
                error: 'Invalid or expired reset token',
            });
        }

        // Update password
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({
            message: 'Password reset successful. You can now login with your new password.',
        });
    } catch (error) {
        next(error);
    }
};
