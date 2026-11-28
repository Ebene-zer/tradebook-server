# Tradebook Server

Backend API for Tradebook, an offline-first stock and credit book.

## Tech stack

- Node.js 20+ and TypeScript
- Express 5
- PostgreSQL and Prisma 7
- Zod validation, JWT authentication, and bcrypt password hashing
- Pino logging
- Vitest and Supertest
- Docker Compose

## Implemented

- Health and database health checks
- User registration, login, and current-user endpoint
- Product and customer CRUD
- Credit entries and customer balance summaries
- Offline sync pull and push for products, customers, stock movements, and credit entries
- Sync support for client-generated IDs, incremental updates, and soft deletions

## Run locally

```bash
cp .env.example .env
docker compose up -d db
npm install
npm run db:migrate
npm run dev
```

The API runs at `http://localhost:4000/api/v1`.
