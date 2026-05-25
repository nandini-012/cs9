import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import swaggerJsdoc from 'swagger-jsdoc'

const configDirectory = dirname(fileURLToPath(import.meta.url))

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Active API',
      version: '1.0.0',
      description: 'API documentation for the Active backend service.',
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        description: 'Local development server',
        variables: {
          port: {
            default: '3000',
          },
        },
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: {
              type: 'string',
              format: 'uuid',
              example: '8f70bc5a-40e2-4b49-9d83-e54a942983e0',
            },
            name: { type: 'string', example: 'Samya Roy' },
            email: { type: 'string', format: 'email', example: 'samya@example.com' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', maxLength: 100, example: 'Samya Roy' },
            email: { type: 'string', format: 'email', example: 'samya@example.com' },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              writeOnly: true,
            },
          },
        },
        UserUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', maxLength: 100, example: 'Samya Roy' },
            email: { type: 'string', format: 'email', example: 'samya@example.com' },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              writeOnly: true,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [
  './src/routes/*.js',
  './src/controllers/*.js',
  './src/**/*.js'
]
})

export default swaggerSpec
