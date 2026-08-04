import JournalEntry from '../models/JournalEntry.js';

/**
 * Get all journal entries for user
 * GET /api/journal
 */
export const getJournalEntries = async (req, res, next) => {
    try {
        const entries = await JournalEntry.find({ userId: req.user._id })
            .sort({ entryDate: -1 });

        res.json({
            entries,
            count: entries.length,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create journal entry
 * POST /api/journal
 */
export const createJournalEntry = async (req, res, next) => {
    try {
        const { entryType, entryDate, cropName, notes, quantity } = req.body;

        const entry = await JournalEntry.create({
            userId: req.user._id,
            entryType,
            entryDate: entryDate || new Date(),
            cropName,
            notes,
            quantity,
        });

        res.status(201).json({
            message: 'Journal entry created successfully',
            entry,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update journal entry
 * PUT /api/journal/:id
 */
export const updateJournalEntry = async (req, res, next) => {
    try {
        const { entryType, entryDate, cropName, notes, quantity } = req.body;

        const entry = await JournalEntry.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { entryType, entryDate, cropName, notes, quantity },
            { new: true, runValidators: true }
        );

        if (!entry) {
            return res.status(404).json({
                error: 'Journal entry not found or unauthorized',
            });
        }

        res.json({
            message: 'Journal entry updated successfully',
            entry,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete journal entry
 * DELETE /api/journal/:id
 */
export const deleteJournalEntry = async (req, res, next) => {
    try {
        const entry = await JournalEntry.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!entry) {
            return res.status(404).json({
                error: 'Journal entry not found or unauthorized',
            });
        }

        res.json({
            message: 'Journal entry deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
