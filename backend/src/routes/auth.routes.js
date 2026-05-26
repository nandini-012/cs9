import { Router } from 'express'
import { login, logout, me, signup } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = Router()

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Register a user account with the USER role
 *     tags: [Authentication]
 *     responses:
 *       201:
 *         description: Signup successful.
 *       403:
 *         description: Privileged roles must be assigned by an admin.
 */
router.post('/signup', signup)
router.post('/register', signup)

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticate and set the HTTP-only session cookie
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials.
 */
router.post('/login', login)
router.post('/admin/login', login)
router.post('/logout', verifyToken, logout)
router.get('/me', verifyToken, me)

export default router
