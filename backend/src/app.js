import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import { errorHandler, notFound } from './middleware/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import questionRoutes from './routes/question.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerSpec)
})

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Check service health
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Backend service is available.
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'active-backend',
    timestamp: new Date().toISOString(),
  })
})

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get the API welcome message
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running.
 */
app.get('/', (_req, res) => {
  res.json({ message: 'Active API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/questions', questionRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
