import mongoose from 'mongoose';

const mspPriceSchema = new mongoose.Schema(
    {
        crop: {
            type: String,
            required: [true, 'Crop name is required'],
            lowercase: true,
            trim: true,
        },
        displayName: {
            type: String,
            required: [true, 'Display name is required'],
            trim: true,
        },
        season: {
            type: String,
            required: [true, 'Season is required'],
            enum: ['kharif', 'rabi'],
            lowercase: true,
        },
        year: {
            type: String,
            required: [true, 'Year is required'],
            trim: true,
        },
        msp: {
            type: Number,
            required: [true, 'MSP value is required'],
            min: [0, 'MSP must be positive'],
        },
        unit: {
            type: String,
            default: 'Rs/Quintal',
        },
        source: {
            type: String,
            default: 'data.gov.in',
        },
        resourceId: {
            type: String,
            required: true,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index to prevent duplicates
mspPriceSchema.index({ crop: 1, season: 1, year: 1 }, { unique: true });

// Index for faster queries
mspPriceSchema.index({ season: 1 });
mspPriceSchema.index({ crop: 1 });

const MSPPrice = mongoose.model('MSPPrice', mspPriceSchema);

export default MSPPrice;
