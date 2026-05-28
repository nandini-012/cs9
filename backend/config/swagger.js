const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vicharanashala API',
            version: '1.0.0',
            description: 'REST API for the Vicharanashala FAQ & Query platform',
        },
        servers: [{ url: 'http://localhost:5000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['student', 'admin', 'peer'] },
                        token: { type: 'string' },
                    },
                },
                FAQ: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        category: { type: 'string' },
                        question: { type: 'string' },
                        answer: { type: 'string' },
                        upvotes: { type: 'integer' },
                        comments: { type: 'integer' },
                        status: { type: 'string', enum: ['Active', 'Archived'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Query: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        user: { type: 'string' },
                        category: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        status: { type: 'string', enum: ['Submitted', 'Peer Resolving', 'Escalated', 'Resolved'] },
                        resolution: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    peer: { type: 'string' },
                                    message: { type: 'string' },
                                    createdAt: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                        adminNotes: { type: 'string' },
                        isViolating: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
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
        paths: {
            '/api/users': {
                post: {
                    tags: ['Users'],
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email', 'password'],
                                    properties: {
                                        name: { type: 'string', example: 'John Doe' },
                                        email: { type: 'string', example: 'john@example.com' },
                                        password: { type: 'string', example: 'password123' },
                                        role: { type: 'string', enum: ['student', 'admin', 'peer'], example: 'student' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                        400: { description: 'Validation error or user already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
            },
            '/api/users/login': {
                post: {
                    tags: ['Users'],
                    summary: 'Login and receive JWT',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', example: 'john@example.com' },
                                        password: { type: 'string', example: 'password123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                        401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
            },
            '/api/users/me': {
                get: {
                    tags: ['Users'],
                    summary: 'Get current authenticated user',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                        401: { description: 'Not authorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
            },
            '/api/queries': {
                get: {
                    tags: ['Queries'],
                    summary: 'Get all queries',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'List of queries', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Query' } } } } },
                    },
                },
                post: {
                    tags: ['Queries'],
                    summary: 'Submit a new query',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['category', 'title', 'description'],
                                    properties: {
                                        category: { type: 'string', example: 'Academics' },
                                        title: { type: 'string', example: 'How to apply for re-evaluation?' },
                                        description: { type: 'string', example: 'I need help understanding the re-evaluation process.' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'Query created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Query' } } } },
                        400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
            },
            '/api/queries/{id}': {
                put: {
                    tags: ['Queries'],
                    summary: 'Update a query (resolve, escalate, add notes)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Query ID' }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', enum: ['Submitted', 'Peer Resolving', 'Escalated', 'Resolved'] },
                                        adminNotes: { type: 'string' },
                                        resolution: { type: 'object', properties: { message: { type: 'string' } } },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'Query updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Query' } } } },
                        404: { description: 'Query not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
            },
            '/api/queries/{id}/report': {
                post: {
                    tags: ['Queries'],
                    summary: 'Report a query for code of conduct violation',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Query ID' }],
                    responses: {
                        200: { description: 'Query reported', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                        404: { description: 'Query not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
            },
            '/api/faqs': {
                get: {
                    tags: ['FAQs'],
                    summary: 'Get all FAQs',
                    responses: {
                        200: { description: 'List of FAQs', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/FAQ' } } } } },
                    },
                },
                post: {
                    tags: ['FAQs'],
                    summary: 'Create a new FAQ (Admin)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['category', 'question', 'answer'],
                                    properties: {
                                        category: { type: 'string', example: 'Admissions' },
                                        question: { type: 'string', example: 'What is the admission process?' },
                                        answer: { type: 'string', example: 'Apply via the official portal.' },
                                        status: { type: 'string', enum: ['Active', 'Archived'], example: 'Active' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: 'FAQ created', content: { 'application/json': { schema: { $ref: '#/components/schemas/FAQ' } } } },
                        400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
            },
            '/api/faqs/{id}': {
                put: {
                    tags: ['FAQs'],
                    summary: 'Update an FAQ (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'FAQ ID' }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        category: { type: 'string' },
                                        question: { type: 'string' },
                                        answer: { type: 'string' },
                                        status: { type: 'string', enum: ['Active', 'Archived'] },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'FAQ updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/FAQ' } } } },
                        404: { description: 'FAQ not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
                delete: {
                    tags: ['FAQs'],
                    summary: 'Delete an FAQ (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'FAQ ID' }],
                    responses: {
                        200: { description: 'FAQ removed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                        404: { description: 'FAQ not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    },
                },
            },
        },
    },
    apis: [],
};

module.exports = swaggerJsdoc(options);
