import Advisory from '../models/Advisory.js';

/**
 * Get advisories (user's own + public)
 * GET /api/advisories?advisoryType=government_scheme
 */
export const getAdvisories = async (req, res, next) => {
    try {
        const { advisoryType } = req.query;

        // User can see their own advisories OR public advisories (userId = null)
        const filter = {
            $or: [
                { userId: req.user._id },
                { userId: null },
            ],
            isActive: true,
        };

        if (advisoryType) {
            filter.advisoryType = advisoryType;
        }

        const advisories = await Advisory.find(filter)
            .sort({ createdAt: -1 });

        res.json({
            advisories,
            count: advisories.length,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create advisory
 * POST /api/advisories
 */
export const createAdvisory = async (req, res, next) => {
    try {
        const { advisoryType, title, content, crops, scheduledFor } = req.body;

        const advisory = await Advisory.create({
            userId: req.user._id,
            advisoryType,
            title,
            content,
            crops,
            scheduledFor,
        });

        res.status(201).json({
            message: 'Advisory created successfully',
            advisory,
        });
    } catch (error) {
        next(error);
    }
};
