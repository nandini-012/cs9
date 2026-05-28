import express from 'express';
import { getAllQueries, addQuery, editQuery, removeQuery } from '../controllers/queryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllQueries);
router.post('/', protect, addQuery);
router.put('/:id', protect, editQuery);
router.delete('/:id', protect, adminOnly, removeQuery);

export default router;
