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

/**
 * @openapi
 * /api/faqs:
 *   get:
 *     summary: List all published FAQs (public — no auth required)
 *     tags: [FAQs]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g. "noc", "stipend")
 *     responses:
 *       200:
 *         description: List of published FAQs grouped by category
 */
router.get('/faqs', async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default
    const { Question } = await import('../models/question.model.js')
    const { category } = req.query

    const filter = { kind: 'faq', status: 'published' }
    if (category) filter.category = category

    const faqs = await Question.find(filter)
      .sort({ category: 1, created_at: 1 })
      .lean()
      .exec()

    // Group by category
    const grouped = {}
    for (const faq of faqs) {
      const cat = faq.category || 'general'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push({
        id: faq._id.toString(),
        question: faq.title,
        answer: faq.body || '',
        category: cat,
        tags: faq.tags || [],
        updatedAt: faq.updated_at,
      })
    }

    res.json({ faqs: grouped, total: faqs.length })
  } catch (err) {
    console.error('listFaqs error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.use(verifyToken)

/**
 * @openapi
 * /api/questions:
 *   post:
 *     summary: Create a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 300
 *                 example: Internship start date clarification
 *               body:
 *                 type: string
 *                 example: Need clarification regarding internship joining date.
 *               category:
 *                 type: string
 *                 example: internship
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [internship, joining]
 *               sparkBounty:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Question created
 *       400:
 *         description: Validation failed
 *       403:
 *         description: Forbidden
 */
router.post('/', checkRole('USER', 'RESOLVER', 'ADMIN'), createQuestion)

/**
 * @openapi
 * /api/questions:
 *   get:
 *     summary: List questions with optional filters
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search across title, body, and tags
 *         example: internship
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: forms
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         example: joining
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, unanswered, answered, closed, removed]
 *         example: open
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [trending, latest]
 *         example: latest
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 20
 *     responses:
 *       200:
 *         description: Paginated list of questions
 */
router.get('/', checkRole('USER', 'RESOLVER', 'ADMIN'), listQuestions)

/**
 * @openapi
 * /api/questions/{questionId}:
 *   get:
 *     summary: Get question by ID (includes answers and comments)
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *       - in: query
 *         name: includeAnswers
 *         schema:
 *           type: boolean
 *         example: true
 *       - in: query
 *         name: includeComments
 *         schema:
 *           type: boolean
 *         example: true
 *     responses:
 *       200:
 *         description: Question details with answers and comments
 *       404:
 *         description: Question not found
 */
router.get('/:questionId', checkRole('USER', 'RESOLVER', 'ADMIN'), getQuestionById)

/**
 * @openapi
 * /api/questions/{questionId}:
 *   patch:
 *     summary: Update a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Question updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Question not found
 *       409:
 *         description: Question locked or resolved
 */
router.patch('/:questionId', checkRole('USER', 'RESOLVER', 'ADMIN'), updateQuestion)

/**
 * @openapi
 * /api/questions/{questionId}:
 *   delete:
 *     summary: Soft-delete a question (sets status to removed)
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Question not found
 */
router.delete('/:questionId', checkRole('USER', 'ADMIN'), deleteQuestion)

/**
 * @openapi
 * /api/questions/{questionId}/answers:
 *   post:
 *     summary: Submit an answer to a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Answer submitted
 *       404:
 *         description: Question not found
 */
router.post('/:questionId/answers', checkRole('USER', 'RESOLVER', 'ADMIN'), createAnswer)

/**
 * @openapi
 * /api/questions/{questionId}/accept-answer/{answerId}:
 *   post:
 *     summary: Accept an answer and optionally award spark bounty
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Answer accepted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Question or answer not found
 *       409:
 *         description: Answer already accepted
 */
router.post('/:questionId/accept-answer/:answerId', checkRole('USER', 'ADMIN'), acceptAnswer)

export default router
