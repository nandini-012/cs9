# Backend File Structure
**Branch:** `nandini`  
**Runtime:** Node.js (ESM) · Express 5 · Mongoose 9 · MongoDB  
**Entry point:** `backend/src/server.js`  
**Base API path:** `/api`  
**Docs:** `/api/docs` (Swagger UI)

---

## Directory Tree

```
backend/
├── package.json                        # Dependencies & npm scripts
├── .env.example                        # Required environment variables template
│
└── src/
    ├── server.js                       # Process entry — DB connect → app.listen()
    ├── app.js                          # Express app setup, CORS, route mounting, error handlers
    │
    ├── config/
    │   ├── db.js                       # Mongoose connection (reads MONGODB_URI)
    │   ├── swagger.js                  # swagger-jsdoc config, merges paths & components
    │   ├── openapi.paths.js            # OpenAPI path definitions (hand-authored)
    │   └── openapi.components.js       # OpenAPI reusable component schemas
    │
    ├── middleware/
    │   ├── authMiddleware.js           # verifyToken (Bearer header + cookie), checkRole()
    │   └── error.middleware.js         # notFound (404) + global errorHandler
    │
    ├── models/                         # Mongoose schemas — all IDs are UUIDs (strings)
    │   ├── user.model.js               # User — auth, role, spark_points, status
    │   ├── user-profile.model.js       # UserProfile — bio, KYC, course, expertise (1:1 User)
    │   ├── user-role-mapper.model.js   # Junction: User ↔ Role (many-to-many)
    │   ├── role.model.js               # Role — USER | RESOLVER | ADMIN
    │   ├── question.model.js           # Question — kind(faq/community), status, is_locked,
    │   │                               #   visibility, spark_bounty, edit_history, last_activity_at
    │   ├── answer.model.js             # Answer — is_accepted, is_official, score, spark_award,
    │   │                               #   edit_history, author_role, visibility
    │   ├── comment.model.js            # Comment — threaded (depth 0|1), author_role,
    │   │                               #   score, visibility, edit_history
    │   ├── vote.model.js               # Vote — polymorphic (question|answer|comment),
    │   │                               #   value +1|-1, unique per user+target
    │   ├── flag.model.js               # Flag — polymorphic report, moderation lifecycle
    │   ├── notification.model.js       # Notification — typed, polymorphic reference, is_read
    │   └── spark-transaction.model.js  # SparkTransaction — immutable ledger of point events
    │
    ├── controllers/                    # Request handlers (thin — business logic in services)
    │   ├── auth.controller.js          # signup, login (argon2), logout, me
    │   ├── user.controller.js          # listUsers, getUserById, updateUserStatus
    │   ├── profile.controller.js       # getMyProfile, updateMyProfile, getPublicProfile
    │   ├── question.controller.js      # CRUD, listQuestions (search/filter/paginate), acceptAnswer
    │   ├── answer.controller.js        # createAnswer, updateAnswer, deleteAnswer, voteAnswer
    │   ├── comment.controller.js       # createComment, listComments, updateComment, deleteComment
    │   ├── flag.controller.js          # createFlag, listFlags, resolveFlag
    │   ├── moderation.controller.js    # getModerationQueue, moderateContent, warnUser
    │   ├── admin.controller.js         # dashboard metrics, assignUserRole, removeUserRole,
    │   │                               #   listAdminSparkTransactions
    │   ├── notification.controller.js  # listNotifications, markRead, markAllRead
    │   ├── resolver.controller.js      # getResolverQueue, getResolverStats, updateExpertise
    │   └── spark.controller.js         # getSparkBalance, listSparkTransactions, getLeaderboard
    │
    ├── routes/                         # Express Router — all under verifyToken guard except auth
    │   ├── auth.routes.js              # POST /signup  POST /login  POST /logout  GET /me
    │   ├── user.routes.js              # GET /  GET /:userId  PATCH /:userId/status
    │   ├── profile.routes.js           # GET /me  PATCH /me  GET /:userId
    │   ├── question.routes.js          # CRUD + POST /:id/answers + POST /:id/accept-answer/:aid
    │   ├── answer.routes.js            # PATCH /:id  DELETE /:id  POST /:id/vote
    │   ├── comment.routes.js           # POST /  GET /  PATCH /:id  DELETE /:id
    │   ├── flag.routes.js              # POST /  GET /  PATCH /:id
    │   ├── moderation.routes.js        # GET /queue  PATCH /content  POST /users/:id/warn  [ADMIN]
    │   ├── admin.routes.js             # GET /dashboard  POST|DELETE /users/:id/roles  [ADMIN]
    │   ├── notification.routes.js      # GET /  PATCH /:id/read  PATCH /read-all
    │   ├── resolver.routes.js          # GET /questions  GET /stats  PATCH /expertise  [RESOLVER+]
    │   ├── spark.routes.js             # GET /balance  GET /transactions
    │   └── leaderboard.routes.js       # GET /
    │
    ├── services/                       # Reusable business logic
    │   ├── spark.service.js            # awardSpark(), reserveBounty(), SPARK_POINTS table
    │   ├── role.service.js             # ensureRole(), getUserRoles(), getPrimaryRole()
    │   └── content.service.js          # findContentTarget(), markContentPending(),
    │                                   #   applyModerationAction() — polymorphic content ops
    │
    ├── utils/
    │   ├── auth-token.js               # Hand-rolled HS256 JWT — signAuthToken(), verifyAuthToken()
    │   └── http.js                     # createHttpError(), getPagination(), paginationResult(),
    │                                   #   getCreatedAtFilter(), escapeRegex()
    │
    └── scripts/
        └── seed-admin.js               # One-shot script: creates the first ADMIN user
```

---

## Route Map

| Prefix | Router file | Auth required | Min role |
|---|---|---|---|
| `/api/auth` | `auth.routes.js` | Partial (login/signup open) | — |
| `/api/users` | `user.routes.js` | ✅ | USER / ADMIN |
| `/api/profile` | `profile.routes.js` | ✅ | USER |
| `/api/questions` | `question.routes.js` | ✅ | USER |
| `/api/answers` | `answer.routes.js` | ✅ | USER |
| `/api/comments` | `comment.routes.js` | ✅ | USER |
| `/api/flags` | `flag.routes.js` | ✅ | USER |
| `/api/notifications` | `notification.routes.js` | ✅ | USER |
| `/api/sparks` | `spark.routes.js` | ✅ | USER |
| `/api/leaderboard` | `leaderboard.routes.js` | ✅ | USER |
| `/api/resolver` | `resolver.routes.js` | ✅ | RESOLVER / ADMIN |
| `/api/admin` | `admin.routes.js` | ✅ | ADMIN |
| `/api/moderation` | `moderation.routes.js` | ✅ | ADMIN |
| `/api/docs` | swagger-ui-express | ❌ | — |

---

## Key Environment Variables

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB_NAME` | Target database name |
| `JWT_SECRET` | HMAC-SHA256 signing secret |
| `PORT` | HTTP port (default `3000`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS whitelist |
| `NODE_ENV` | `production` enables secure cookies |
