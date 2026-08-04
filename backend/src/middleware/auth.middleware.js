import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'No token provided. Please authenticate.',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyToken(token);

        // Find user
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                error: 'User not found. Token invalid.',
            });
        }

        // Attach user to request
        req.user = {
            _id: user._id,
            email: user.email,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid or expired token.',
            message: error.message,
        });
    }
};
