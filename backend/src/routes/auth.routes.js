import { Router } from 'express'
import { createUser,loginUser } from '../controllers/user.controller.js'

const router = Router()

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Account created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Input validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email is already registered.
 */
router.post('/signup', createUser)
router.post('/login', loginUser)
export default router
