import mongoose from 'mongoose';
import { SEASONS } from '../utils/constants.js';

const cropSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Crop name is required'],
            unique: true,
            trim: true,
        },
        season: {
            type: String,
            required: [true, 'Season is required'],
            enum: SEASONS,
        },
        suitableSoil: {
            type: [String],
            required: true,
            default: [],
        },
        waterRequirement: {
            type: String,
            trim: true,
        },
        fertilizerRequirement: {
            type: String,
            trim: true,
        },
        expectedYieldRange: {
            type: String,
            trim: true,
        },
        idealTemperatureMin: {
            type: Number,
        },
        idealTemperatureMax: {
            type: Number,
        },
        rainfallRequirement: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Index for faster name lookups
cropSchema.index({ name: 1 });
cropSchema.index({ season: 1 });

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;
