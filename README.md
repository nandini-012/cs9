# Active

This project is split into a Vite React frontend and an Express backend.

## Structure

- `frontend/` - React, Vite, and Tailwind CSS application
- `backend/` - Express API server

## Run Locally

Start the API:

Set `MONGODB_URI` and `MONGODB_DB_NAME` in `backend/.env` before starting the
API. Set `JWT_SECRET` for signed HTTP-only authentication cookies.

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Bootstrap the initial administrator and required role records once:

```bash
cd backend
ADMIN_NAME="Portal Admin" ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="change-me-now" npm run seed:admin
```

In another terminal, start the React app:

```bash
cd frontend
npm install
npm run dev
```

During development, Vite forwards requests from `/api` to the backend at
`http://localhost:3000`.

## API

- `GET /api/docs` serves the interactive Swagger UI documentation.
- `GET /api/docs.json` returns the OpenAPI specification.
- `GET /api/health` returns the backend service status.
- `POST /api/auth/signup` creates a USER account; privileged roles are admin-assigned.
- `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me` manage cookie sessions.
- `GET|PATCH /api/profile/me` and `GET /api/profile/:userId` serve authenticated profiles.
- `/api/questions`, `/api/answers`, and `/api/comments` implement authenticated content workflows.
- `/api/notifications`, `/api/sparks`, `/api/leaderboard`, and `/api/resolver` serve dashboard workflows available to ADMIN.
- `GET /api/users` and `PATCH /api/users/:userId/status` provide ADMIN user management.
- `GET /api/admin/dashboard` returns ADMIN operational metrics.
- `POST /api/admin/users/:userId/roles` and `DELETE /api/admin/users/:userId/roles/:roleName` manage roles.
- `GET /api/admin/sparks/transactions` audits the append-only spark ledger.
- `GET /api/flags` and `PATCH /api/flags/:flagId/resolve` review flags as ADMIN.
- `GET /api/moderation/queue`, `PATCH /api/moderation/content`, and `POST /api/moderation/users/:userId/warn` provide moderation controls.
