import mongoose from 'mongoose';
import { ADVISORY_TYPES } from '../utils/constants.js';

const advisorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, // null means public advisory
        },
        advisoryType: {
            type: String,
            required: [true, 'Advisory type is required'],
            enum: ADVISORY_TYPES,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true,
        },
        crops: {
            type: [String],
            default: [],
        },
        scheduledFor: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Indexes for efficient queries
advisorySchema.index({ userId: 1 });
advisorySchema.index({ isActive: 1 });
advisorySchema.index({ advisoryType: 1 });

const Advisory = mongoose.model('Advisory', advisorySchema);

export default Advisory;
