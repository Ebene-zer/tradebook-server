# Tradebook Server

Backend API for **Tradebook** — an offline-first (PWA) stock & credit book for market traders.

## Tech stack

| Concern    | Choice                                  |
| ---------- | --------------------------------------- |
| Runtime    | Node.js 22 + TypeScript (ESM)           |
| HTTP       | Express 5, helmet, cors, compression    |
| Database   | PostgreSQL 16 + Prisma 7 (`adapter-pg`) |
| Validation | Zod                                     |
| Auth       | JWT (email + password, bcrypt)          |
| Logging    | Pino                                    |
| Testing    | Vitest + Supertest                      |
| Tooling    | ESLint, Prettier, Docker Compose        |

## Getting started

```bash
cp .env.example .env
docker compose up -d db      # start Postgres
npm install
npm run db:migrate           # apply migrations + generate Prisma client
npm run dev                  # http://localhost:4000/api/v1
```

Scripts: `dev`, `build`, `start`, `test`, `lint`, `typecheck`, `format`, `db:migrate`, `db:deploy`, `db:studio`.

## Project structure

```
prisma/              schema + migrations
src/
  config/env.ts      validated env vars
  lib/               prisma, logger, jwt, errors, generic CRUD router
  middleware/        auth, validation, error handling
  modules/
    health/          GET /health, /health/db
    auth/            register, login, me
    products/        stock items
    customers/       credit customers
    credit/          credit & payment ledger, balances
    sync/            offline sync (pull / push)
  app.ts, server.ts, routes.ts
tests/
```

## API (v1)

| Method | Path                                 | Notes                                           |
| ------ | ------------------------------------ | ----------------------------------------------- |
| GET    | `/health`, `/health/db`              | liveness / DB check                             |
| POST   | `/auth/register`, `/auth/login`      | returns JWT                                     |
| GET    | `/auth/me`                           |                                                 |
| CRUD   | `/products`, `/customers`, `/credit` | `GET / POST / GET :id / PATCH :id / DELETE :id` |
| GET    | `/credit/summary/balances`           | outstanding balance per customer                |
| GET    | `/sync/pull?since=<ISO date>`        | all changes since last pull                     |
| POST   | `/sync/push`                         | batch upsert of offline changes                 |

## Offline-first design

- **Client-generated UUIDs** — records created offline keep their id when synced.
- **`updatedAt` + `deletedAt` (soft delete)** on every synced table, so changes and deletions propagate.
- **Pull**: client sends its last `serverTime`; server returns every changed record (incl. tombstones).
- **Push**: client sends `{ changes: { products: [...], customers: [...], stockMovements: [...], creditEntries: [...] } }`; server applies last-write-wins.

## TODO (next steps)

- Stock movement endpoints that update product quantity atomically
- Verify referenced `customerId` / `productId` belong to the same user (CRUD + sync)
- Smarter conflict resolution & per-record conflict reporting in sync
- Refresh tokens / email verification / password reset, rate limiting
- Reports (daily sales, low stock, overdue credit)
