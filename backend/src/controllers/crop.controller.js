import Crop from '../models/Crop.js';

/**
 * Get all crops (with optional season filter)
 * GET /api/crops?season=kharif
 */
export const getCrops = async (req, res, next) => {
    try {
        const { season } = req.query;

        const filter = {};
        if (season) {
            filter.season = season;
        }

        const crops = await Crop.find(filter).sort({ name: 1 });

        res.json({
            crops,
            count: crops.length,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single crop by ID
 * GET /api/crops/:id
 */
export const getCropById = async (req, res, next) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (!crop) {
            return res.status(404).json({
                error: 'Crop not found',
            });
        }

        res.json({ crop });
    } catch (error) {
        next(error);
    }
};
