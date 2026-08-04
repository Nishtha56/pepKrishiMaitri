import PestAlert from '../models/PestAlert.js';

/**
 * Get all alerts for user (with optional isRead filter)
 * GET /api/alerts?isRead=false
 */
export const getAlerts = async (req, res, next) => {
    try {
        const { isRead } = req.query;

        const filter = { userId: req.user._id };
        if (isRead !== undefined) {
            filter.isRead = isRead === 'true';
        }

        const alerts = await PestAlert.find(filter)
            .sort({ createdAt: -1 });

        res.json({
            alerts,
            count: alerts.length,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create alert
 * POST /api/alerts
 */
export const createAlert = async (req, res, next) => {
    try {
        const { alertType, severity, title, description, preventionTips, affectedCrops } = req.body;

        const alert = await PestAlert.create({
            userId: req.user._id,
            alertType,
            severity,
            title,
            description,
            preventionTips,
            affectedCrops,
        });

        res.status(201).json({
            message: 'Alert created successfully',
            alert,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update alert (mainly for marking as read)
 * PUT /api/alerts/:id
 */
export const updateAlert = async (req, res, next) => {
    try {
        const { isRead, alertType, severity, title, description, preventionTips, affectedCrops } = req.body;

        const alert = await PestAlert.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { isRead, alertType, severity, title, description, preventionTips, affectedCrops },
            { new: true, runValidators: true }
        );

        if (!alert) {
            return res.status(404).json({
                error: 'Alert not found or unauthorized',
            });
        }

        res.json({
            message: 'Alert updated successfully',
            alert,
        });
    } catch (error) {
        next(error);
    }
};
