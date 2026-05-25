# Active

This project is split into a Vite React frontend and an Express backend.

## Structure

- `frontend/` - React, Vite, and Tailwind CSS application
- `backend/` - Express API server

## Run Locally

Start the API:

Set `MONGODB_URI` and `MONGODB_DB_NAME` in `backend/.env` before starting the
API. At startup the backend ensures the `users`, `roles`, and
`user_role_mappers` collections and their indexes exist.

```bash
cd backend
npm install
cp .env.example .env
npm run dev
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
- `POST /api/auth/signup` creates an account with `name`, `email`, and a hashed `password`.
- `POST /api/auth/login` verifies an account email and password.
- `GET /api/users` lists users.
- `POST /api/users` creates a user with `name`, `email`, and a hashed `password`.
- `GET /api/users/:id` retrieves one user by `user_id`.
- `PATCH /api/users/:id` updates `name`, `email`, and/or `password`.
- `DELETE /api/users/:id` deletes a user.
