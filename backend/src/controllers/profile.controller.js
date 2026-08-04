import Profile from '../models/Profile.js';

/**
 * Get user's profile
 * GET /api/profile
 */
export const getProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                error: 'Profile not found',
            });
        }

        res.json({ profile });
    } catch (error) {
        next(error);
    }
};

/**
 * Create user profile
 * POST /api/profile
 */
export const createProfile = async (req, res, next) => {
    try {
        const { name, phone, location, state, district, village, pincode, soilType, landSize, preferredCrops, profileImage } = req.body;

        // Check if profile already exists
        const existingProfile = await Profile.findOne({ userId: req.user._id });
        if (existingProfile) {
            return res.status(400).json({
                error: 'Profile already exists. Use PUT to update.',
            });
        }

        // Create profile
        const profile = await Profile.create({
            userId: req.user._id,
            name,
            phone,
            location: location || village,
            state,
            district,
            village,
            pincode,
            soilType,
            landSize,
            preferredCrops,
            profileImage,
        });

        res.status(201).json({
            message: 'Profile created successfully',
            profile,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 * PUT /api/profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, location, state, district, village, pincode, soilType, landSize, preferredCrops, profileImage } = req.body;

        const profile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            {
                name,
                phone,
                location: location || village,
                state,
                district,
                village,
                pincode,
                soilType,
                landSize,
                preferredCrops,
                profileImage,
            },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                error: 'Profile not found',
            });
        }

        res.json({
            message: 'Profile updated successfully',
            profile,
        });
    } catch (error) {
        next(error);
    }
};
