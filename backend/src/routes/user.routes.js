import { Router } from 'express'
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../controllers/user.controller.js'

const router = Router()

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: List users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users sorted by creation date.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email is already registered.
 */
router.route('/').get(getUsers).post(createUser)

/**
 * @openapi
 * /api/users/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: Public user UUID.
 *       schema:
 *         type: string
 *         format: uuid
 *   get:
 *     summary: Get a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     responses:
 *       204:
 *         description: User deleted.
 *       404:
 *         description: User not found.
 */
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

export default router
