import { Router } from 'express'
import { createAnswer } from '../controllers/answer.controller.js'
import {
  acceptAnswer,
  createQuestion,
  deleteQuestion,
  getQuestionById,
  listQuestions,
  updateQuestion,
} from '../controllers/question.controller.js'
import { checkRole, verifyToken } from '../middleware/authMiddleware.js'

const router = Router()

router.use(verifyToken)
router.post('/', checkRole('USER', 'RESOLVER', 'ADMIN'), createQuestion)
router.get('/', checkRole('USER', 'RESOLVER', 'ADMIN'), listQuestions)
router.get('/:questionId', checkRole('USER', 'RESOLVER', 'ADMIN'), getQuestionById)
router.patch('/:questionId', checkRole('USER', 'RESOLVER', 'ADMIN'), updateQuestion)
router.delete('/:questionId', checkRole('USER', 'ADMIN'), deleteQuestion)
router.post('/:questionId/answers', checkRole('USER', 'RESOLVER', 'ADMIN'), createAnswer)
router.post('/:questionId/accept-answer/:answerId', checkRole('USER', 'ADMIN'), acceptAnswer)

export default router
