import express from 'express';
import { getFaqs, searchFaqs, addFaq, editFaq, removeFaq } from '../controllers/faqController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getFaqs);
router.get('/search', searchFaqs);
router.post('/', protect, adminOnly, addFaq);
router.put('/:id', protect, adminOnly, editFaq);
router.delete('/:id', protect, adminOnly, removeFaq);

export default router;

