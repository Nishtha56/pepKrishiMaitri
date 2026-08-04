import mongoose from 'mongoose';
import { ENTRY_TYPES } from '../utils/constants.js';

const journalEntrySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        entryType: {
            type: String,
            required: [true, 'Entry type is required'],
            enum: ENTRY_TYPES,
        },
        entryDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        cropName: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        quantity: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Indexes for efficient queries
journalEntrySchema.index({ userId: 1 });
journalEntrySchema.index({ entryDate: -1 });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;
