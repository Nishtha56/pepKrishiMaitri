/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));

        return res.status(400).json({
            error: 'Validation error',
            errors,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            error: 'Duplicate value',
            message: `${field} already exists`,
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid ID format',
            message: err.message,
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            message: err.message,
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            message: 'Please login again',
        });
    }

    // Default error
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

/**
 * 404 handler
 */
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.url} not found`,
    });
};
