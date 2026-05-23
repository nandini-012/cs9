# Active

This project is split into a Vite React frontend and an Express backend.

## Structure

- `frontend/` - React, Vite, and Tailwind CSS application
- `backend/` - Express API server

## Run Locally

Start the API:

Set `MONGODB_URI` in `backend/.env` to your MongoDB connection string before
starting the API.

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

- `GET /api/health` returns the backend service status.
- `GET /api/users` lists users.
- `POST /api/users` creates a user with `name` and `email`.
- `GET /api/users/:id` retrieves one user.
- `PATCH /api/users/:id` updates `name` and/or `email`.
- `DELETE /api/users/:id` deletes a user.
