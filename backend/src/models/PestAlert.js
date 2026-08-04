import mongoose from 'mongoose';
import { ALERT_TYPES, SEVERITY_LEVELS } from '../utils/constants.js';

const pestAlertSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        alertType: {
            type: String,
            required: [true, 'Alert type is required'],
            enum: ALERT_TYPES,
        },
        severity: {
            type: String,
            required: [true, 'Severity is required'],
            enum: SEVERITY_LEVELS,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        preventionTips: {
            type: String,
            trim: true,
        },
        affectedCrops: {
            type: [String],
            default: [],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Indexes for efficient queries
pestAlertSchema.index({ userId: 1 });
pestAlertSchema.index({ isRead: 1 });
pestAlertSchema.index({ createdAt: -1 });

const PestAlert = mongoose.model('PestAlert', pestAlertSchema);

export default PestAlert;
