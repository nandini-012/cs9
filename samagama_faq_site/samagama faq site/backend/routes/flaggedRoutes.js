import express from 'express';
import { getAllFlagged, addFlagged, editFlagged, removeFlagged } from '../controllers/flaggedController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllFlagged);
router.post('/', protect, addFlagged);
router.put('/:id', protect, adminOnly, editFlagged);
router.delete('/:id', protect, adminOnly, removeFlagged);

export default router;
