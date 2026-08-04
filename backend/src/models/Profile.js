import mongoose from 'mongoose';
import { SOIL_TYPES } from '../utils/constants.js';

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        // Location fields
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        district: {
            type: String,
            trim: true,
        },
        village: {
            type: String,
            trim: true,
        },
        pincode: {
            type: String,
            trim: true,
            match: [/^\d{6}$/, 'Pincode must be 6 digits'],
        },
        // Farm details
        soilType: {
            type: String,
            required: [true, 'Soil type is required'],
            enum: [...SOIL_TYPES, 'black', 'red', 'alluvial'],
        },
        landSize: {
            type: Number,
            min: [0, 'Land size must be positive'],
        },
        preferredCrops: {
            type: [String],
            default: [],
        },
        profileImage: {
            type: String, // Base64 encoded image
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster user lookups
profileSchema.index({ userId: 1 });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
