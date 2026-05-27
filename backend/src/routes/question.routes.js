import { Router } from 'express'

import {
createQuestion,
getQuestions,
searchQuestions,
getQuestionById,
updateQuestion,
deleteQuestion,
acceptAnswer,
getQuestionsByCategory
}
from '../controllers/question.controller.js'

const router = Router()

/**
 * @openapi
 * /api/questions:
 *   post:
 *     summary: Create a question or FAQ
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kind
 *               - title
 *               - slug
 *               - body
 *               - authorId
 *             properties:
 *               kind:
 *                 type: string
 *                 enum:
 *                   - faq
 *                   - community
 *                 example: community
 *
 *               title:
 *                 type: string
 *                 maxLength: 300
 *                 example: Internship start date clarification
 *
 *               slug:
 *                 type: string
 *                 example: internship-start-date
 *
 *               body:
 *                 type: string
 *                 example: Need clarification regarding internship joining date.
 *
 *               category:
 *                 type: string
 *                 example: internship
 *
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - internship
 *                   - joining
 *
 *               authorId:
 *                 type: string
 *                 example: 6a130c4ad2e10060e34b73e5
 *
 *               status:
 *                 type: string
 *                 enum:
 *                   - open
 *                   - answered
 *                   - closed
 *                   - resolved
 *                   - duplicate
 *                   - draft
 *                   - published
 *                   - archived
 *                 example: open
 *
 *               visibility:
 *                 type: string
 *                 enum:
 *                   - public
 *                   - hidden
 *                   - deleted
 *                 example: public
 *
 *               isPinned:
 *                 type: boolean
 *                 example: false
 *
 *               isLocked:
 *                 type: boolean
 *                 example: false
 *
 *               sparkBounty:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 20
 *
 *                   currency:
 *                     type: string
 *                     example: spark
 *
 *                   status:
 *                     type: string
 *                     enum:
 *                       - none
 *                       - reserved
 *                       - awarded
 *                       - refunded
 *                     example: reserved
 *
 *               stats:
 *                 type: object
 *                 properties:
 *                   viewCount:
 *                     type: number
 *                     example: 5
 *
 *                   answerCount:
 *                     type: number
 *                     example: 0
 *
 *                   replyCount:
 *                     type: number
 *                     example: 0
 *
 *                   upvoteCount:
 *                     type: number
 *                     example: 2
 *
 *                   downvoteCount:
 *                     type: number
 *                     example: 0
 *
 *                   flagCount:
 *                     type: number
 *                     example: 0
 *
 *                   followerCount:
 *                     type: number
 *                     example: 1
 *
 *               moderation:
 *                 type: object
 *                 properties:
 *                   isFlagged:
 *                     type: boolean
 *                     example: false
 *
 *                   moderationNote:
 *                     type: string
 *                     example: ""
 *
 *     responses:
 *       201:
 *         description: Question created
 *
 *       400:
 *         description: Validation failed
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Server error
 */

router.post('/',createQuestion)

/**
 * @openapi
 * /api/questions:
 *   get:
 *     summary: Get questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Questions fetched
 */

router.get('/',getQuestions)

/**
 * @openapi
 * /api/questions/search:
 *   get:
 *     summary: Search questions
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example:
 *           internship
 *     responses:
 *       200:
 *         description: Search results
 */

router.get('/search',searchQuestions)

/**
 * @openapi
 * /api/questions/category:
 *   get:
 *     summary: Filter questions by category
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         example:
 *           forms
 *     responses:
 *       200:
 *         description: Filtered questions
 */

router.get('/category',getQuestionsByCategory)

/**
 * @openapi
 * /api/questions/{id}:
 *   get:
 *     summary: Get question by id
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example:
 *           6a1598911e523ae3366db579
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 */



router.get('/:id',getQuestionById)

/**
 * @openapi
 * /api/questions/{id}:
 *   patch:
 *     summary: Update question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example:
 *           6a1598911e523ae3366db579
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
 *       404:
 *         description: Question not found
 */

router.patch('/:id',updateQuestion)

/**
 * @openapi
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example:
 *           6a1598911e523ae3366db579
 *     responses:
 *       200:
 *         description: Question deleted
 *       404:
 *         description: Question not found
 */

router.delete('/:id',deleteQuestion)

/**
 * @openapi
 * /api/questions/{id}/accept-answer/{answerId}:
 *   post:
 *     summary: Accept answer
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
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
 *       404:
 *         description: Question not found
 */

router.post('/:id/accept-answer/:answerId',acceptAnswer)

export default router