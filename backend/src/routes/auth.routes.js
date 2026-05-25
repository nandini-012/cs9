import { Router } from 'express'
import { createUser,loginUser} from '../controllers/user.controller.js'

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

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in with an email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Credentials accepted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', loginUser)


/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Cookie based JWT authentication
 *
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum:
 *                   - USER
 *                   - RESOLVER
 *                   - ADMIN
 *                 example: USER
 *     responses:
 *       201:
 *         description: Registered successfully
 *       401:
 *         description: Missing credentials
 *       403:
 *         description: User already exists
 *       500:
 *         description: Registration failed
 *
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Logged in successfully and set httpOnly cookie
 *       401:
 *         description: Missing credentials or invalid email/password
 *       500:
 *         description: Login failed
 *
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logged out successfully and cleared auth cookie
 *
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Current user fetched
 *       401:
 *         description: Missing token, invalid token, or expired token
 *       500:
 *         description: Failed to fetch current user
 */
export default router

