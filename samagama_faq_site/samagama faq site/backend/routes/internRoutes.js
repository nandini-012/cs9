import express from 'express';
import multer from 'multer';
import { 
  getProfile, 
  confirmDates, 
  uploadNoc, 
  uploadSelfDeclaration, 
  nocEmailForward, 
  acceptOffer,
  getLeaderboardData,
  updateLeaderboard
} from '../controllers/internController.js';
import { handleChatMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Memory storage is perfect for mocking uploads safely
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/profile', protect, getProfile);
router.post('/dates', protect, confirmDates);
router.post('/noc/upload', protect, upload.single('noc'), uploadNoc);
router.post('/noc/declaration', protect, uploadSelfDeclaration);
router.post('/noc/email-forward', protect, nocEmailForward);
router.post('/offer/accept', protect, acceptOffer);
router.post('/chat', protect, handleChatMessage);
router.get('/leaderboard', protect, getLeaderboardData);
router.post('/leaderboard', protect, updateLeaderboard);

export default router;
