import cors from 'cors'
import express from 'express'
import { errorHandler, notFound } from './middleware/error.middleware.js'
import userRoutes from './routes/user.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'active-backend',
    timestamp: new Date().toISOString(),
  })
})

app.get('/', (_req, res) => {
  res.json({ message: 'Active API is running' })
})

app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
