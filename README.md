# Tipsy

A full-stack alcohol delivery app: a Node/Express/MySQL API and a React
storefront with cart, wishlist, guest and account checkout, and Stripe
payments.

## Stack

- **Backend** (`Backend/`) — Node 22, Express 5, MySQL (`mysql2/promise`),
  JWT auth, Stripe, Jest + Supertest.
- **Frontend** (`Frontend/`) — React 19, TypeScript, Vite, Tailwind CSS v4,
  Vitest + React Testing Library.

## Getting Started

### Prerequisites

- Node 22+
- Docker (for the bundled MySQL service), or a MySQL 8 instance of your own

### 1. Backend

```bash
cd Backend
cp .env.example .env   # fill in DB_PASSWORD, STRIPE_SECRET_KEY, JWT_SECRET
docker compose up -d   # starts MySQL, using DB_PASSWORD/DB_NAME from .env
npm install
node db/migrate.js     # applies db/schema.sql and seeds the product catalog
npm run dev             # http://localhost:5000
```

### 2. Frontend

```bash
cd Frontend
cp .env.example .env   # fill in VITE_STRIPE_PUBLISHABLE_KEY, etc.
npm install
npm run dev             # http://localhost:5173
```

See `Backend/.env.example` and `Frontend/.env.example` for what each
variable is for and where to get it (Stripe test keys, Google/Facebook
OAuth client IDs, etc.) — everything needed for local development is free.

## Commands

| Task | Backend | Frontend |
| --- | --- | --- |
| Dev server | `npm run dev` | `npm run dev` |
| Test | `npm test` | `npm test` |
| Test with coverage | `npm run test:coverage` | `npm run test:coverage` |
| Lint | `npm run lint` | `npm run lint` |
| Type check | — | `npm run typecheck` |
| Format | `npm run format` | — |
| Build | — | `npm run build` |

## Project Structure

```
Backend/
  routes/        URL + middleware wiring
  controllers/    request validation, response shaping
  services/       business logic, DB and Stripe access
  middleware/     auth (requireAuth / optionalAuth)
  config/db.js    shared mysql2 connection pool
  db/             schema.sql, migrate.js, seed-products.js
  tests/          Jest/Supertest, mirrors the source layout

Frontend/
  src/components/ui/      shared UI primitives
  src/components/blocks/  page sections (hero, header, product-card, ...)
  src/context/            cross-cutting state (auth, cart, wishlist, theme, address)
  src/lib/                api.ts (fetch layer), products.ts, geocode.ts, utils.ts
  src/pages/               route-level components
```

Each backend feature follows the same routes → controllers → services
layering; controllers stay thin, all business logic and DB/Stripe access
lives in services. Payments never trust a client-reported status: a
PaymentIntent is created server-side and re-verified with Stripe before an
order is marked paid.

## Security

This repo runs CodeQL, Trivy, Gitleaks, dependency review, and npm audit on
every push/PR to `main` plus a weekly schedule — see
[`SECURITY.md`](SECURITY.md) for details and how to report a vulnerability.

## Contributing Guidance for Claude Code

See [`.claude/CLAUDE.md`](.claude/CLAUDE.md) and `.claude/rules/` for the
full set of architectural conventions, code style, testing, and design
system rules this project follows.
