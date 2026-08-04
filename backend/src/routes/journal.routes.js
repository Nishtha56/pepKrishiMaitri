import express from 'express';
import { body } from 'express-validator';
import {
    getJournalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
} from '../controllers/journal.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ENTRY_TYPES } from '../utils/constants.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const journalValidation = [
    body('entryType').isIn(ENTRY_TYPES).withMessage('Invalid entry type'),
    body('entryDate').optional().isISO8601().withMessage('Invalid date format'),
    body('cropName').optional().trim(),
    body('notes').optional().trim(),
    body('quantity').optional().trim(),
];

// Routes
router.get('/', getJournalEntries);
router.post('/', journalValidation, validate, createJournalEntry);
router.put('/:id', journalValidation, validate, updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

export default router;
