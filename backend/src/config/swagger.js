import swaggerJsdoc from 'swagger-jsdoc'
import components from './openapi.components.js'
import paths from './openapi.paths.js'

const port = process.env.PORT || 5000

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Active API',
      version: '1.0.0',
      description:
        'REST API for the Active crowdsourced FAQ platform — Vicharanashala Lab (IIT Ropar). ' +
        'Covers authentication, questions, answers, comments, flags, notifications, spark economy, ' +
        'resolver queue, leaderboard, and admin management.',
      contact: {
        name: 'Vicharanashala Lab',
        url: 'https://github.com/your-org/active',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local development',
      },
    ],
    tags: [
      { name: 'System', description: 'Health check and root endpoints' },
      { name: 'Authentication', description: 'Signup, login, logout, current user' },
      { name: 'Users', description: 'User profiles and public data' },
      { name: 'Questions', description: 'CRUD, search, and answer management' },
      { name: 'Answers', description: 'Posting, editing, voting, and accepting answers' },
      { name: 'Comments', description: 'Comment threads on questions and answers' },
      { name: 'Flags', description: 'Report inappropriate content' },
      { name: 'Notifications', description: 'User notification inbox' },
      { name: 'Leaderboard', description: 'Spark economy and ranking' },
      { name: 'Admin', description: 'Platform administration endpoints' },
    ],
    components,
    paths,
  },
  apis: [],
})

export default swaggerSpec