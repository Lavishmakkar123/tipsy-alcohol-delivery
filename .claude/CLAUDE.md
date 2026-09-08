# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Tipsy — Project Instructions

Full-stack alcohol delivery app: `Backend/` (Node/Express/MySQL) and
`Frontend/` (React 19/Vite/Tailwind). You are an expert product designer +
full-stack engineer working on it.

## Commands

Backend and Frontend are independent npm projects — run commands from
inside the respective directory.

### Backend (`Backend/`)

- `npm run dev` — start the API with nodemon (port `5000` unless `PORT` is set)
- `npm start` — start without nodemon (`server.js`)
- `npm test` — run the Jest suite; `npx jest tests/services/orders.service.test.js`
  for a single file, `npx jest -t "name pattern"` for a single test
- `npm run test:coverage` — Jest with coverage; thresholds are enforced via
  `jest.config.js` `coverageThreshold` (see `.claude/rules/testing.md`)
- `npm run lint` / `npm run lint:fix` — ESLint (`eslint:recommended` +
  `eslint-plugin-security` + `eslint-plugin-n`)
- `npm run format` / `npm run format:check` — Prettier
- `node db/migrate.js` — apply `db/schema.sql` (and any `ALTER TABLE` add-ons
  inside `migrate.js`) against the DB in `.env`, then seeds products
- `docker compose up -d` — start the local MySQL container (reads
  `Backend/.env`; `DB_PASSWORD` doubles as the container's root password on
  first start)

### Frontend (`Frontend/`)

- `npm run dev` — Vite dev server at `http://localhost:5173`
- `npm run build` — production build (runs through `tsc -b` via Vite)
- `npm run typecheck` — `tsc -b --noEmit`
- `npm run lint` — `oxlint` (the only frontend linter — see
  `.claude/rules/code-style.md`)
- `npm test` — run the Vitest suite once; `npx vitest run src/lib/api.test.ts`
  for a single file, `npx vitest run -t "name pattern"` for a single test
- `npm run test:coverage` — Vitest with coverage (`coverage.include` in
  `vitest.config.ts` is scoped to modules that actually have tests)
- `npm run preview` — preview a production build locally

There is no top-level script that runs both projects together — start the
Backend and Frontend dev servers in separate terminals.

## Architecture

**Backend** (`Backend/`, CommonJS, Express 5) is a strict three-layer stack
per feature — see `.claude/rules/backend/api.md` for the full convention:

```
routes/<x>.routes.js       → wires URLs + middleware to controller functions
controllers/<x>.controller.js → validates input, calls services, shapes HTTP response
services/<x>.service.js    → all business logic + DB/Stripe access (no req/res)
```

- `app.js` builds and exports the Express app with no `listen()` call, so
  tests import it directly with Supertest; `server.js` is the only file that
  calls `app.listen()`. Middleware order in `app.js`: `helmet()` → `morgan`
  → CORS (locked to `FRONTEND_URL`) → `express.json()` → an auth-only rate
  limiter → the four route mounts (`/api/products`, `/api/orders`,
  `/api/auth`, `/api/wishlist`) → a catch-all error handler that returns
  `{ error: message }` only (never a stack trace).
- `config/db.js` exports one shared `mysql2/promise` pool
  (`decimalNumbers: true` so DECIMAL columns come back as real numbers, not
  strings) — every service imports this pool rather than creating its own.
- `middleware/auth.middleware.js` provides `requireAuth` (401s without a
  valid JWT) and `optionalAuth` (attaches `req.user` if present, never
  blocks) — used for guest-checkout-capable routes like orders.
- Schema (`db/schema.sql`, five tables: `users`, `products`, `orders`,
  `order_items`, `wishlist_items`) is the source of truth, applied via
  `db/migrate.js`; product catalog seed data lives in `db/seed-products.js`.
- Payments (Stripe) never trust a client-reported status: a PaymentIntent is
  created server-side, the client confirms it with Stripe directly, then
  `confirm-payment` re-fetches the PaymentIntent from Stripe and checks
  `metadata.orderId` + `status === 'succeeded'` before marking an order paid
  — see `.claude/rules/backend/api.md`.
- Tests in `Backend/tests/` mirror the source layout and never hit a real
  DB or Stripe — they mock `config/db` (for services) or the service module
  (for controllers). See `.claude/rules/testing.md`.

**Frontend** (`Frontend/src/`, React 19 + TypeScript, Vite, Tailwind v4,
path alias `@/` → `src/`) is organized as:

```
components/ui/      shared UI primitives (shadcn/ui-style: Radix + cva + cn())
components/blocks/  page sections/blocks (hero, header, footer, product-card, ...)
context/             cross-cutting state: Provider + useX() hook pair per concern
lib/                 api.ts (fetch wrapper), products.ts, geocode.ts, types.ts, utils.ts
pages/               route-level components, wired up in App.tsx
```

- `App.tsx` nests providers in a fixed order — `ThemeProvider` →
  `AuthProvider` → `WishlistProvider` → `AddressProvider` → `CartProvider` —
  around a `react-router-dom` `<Routes>` tree (`/`, `/shop`, `/product/:id`,
  `/wishlist`, `/cart`, `/checkout`, `/sign-in`), wrapped by a persistent
  `Header`/`Footer`.
- `lib/api.ts` is the single fetch boundary: a `request<T>()` helper reads
  the JWT from `localStorage` (`tipsy-token`), attaches it as a `Bearer`
  header, and throws on a non-OK response — page/components call the
  exported functions (`createOrder`, `createPaymentIntent`,
  `confirmPayment`, etc.) rather than calling `fetch` directly.
  `VITE_API_URL` (default `http://localhost:5000`) points it at the Backend.
- House code style is **no semicolons, double quotes** (intentional — see
  `.claude/rules/code-style.md`); `oxlint` is the only linter, no
  Prettier/ESLint here.
- The mandatory design screenshot loop (implement → screenshot → critique
  → iterate to ≥8.5/10) applies to any visual change — see
  `.claude/rules/frontend/react.md`.

## Core Principles (Never Violate)

- **Avoid AI slop**: no Inter/Roboto default stacks, no purple-to-blue
  gradient heroes, no endless rounded cards with soft shadows, no generic
  "trusted by" logo strips, no left-sidebar + card-grid SaaS default unless
  the product truly needs it.
- Commit to a **bold, specific aesthetic** first (brutalist, editorial,
  glass + depth, neo-brutal, high-contrast typography-led, cinematic dark,
  warm organic, sharp minimal, etc.) and state the direction before writing
  UI code.
- Mobile-first, fully responsive, accessible (WCAG 2.2 AA minimum),
  performant (Core Web Vitals friendly).
- Real hierarchy, generous but intentional whitespace, strong typography
  scale, purposeful micro-interactions only.
- Every SQL query is parameterized — never string-interpolate request data
  into a query (see `rules/backend/database.md`).
- Never commit a secret, log a plaintext password, or leak a stack trace to
  an API client (see `rules/security.md`).
- Don't lower a test coverage threshold to make CI pass — add tests instead
  (see `rules/testing.md`).

## Scoped Rules

Detailed, topic-specific instructions live under `rules/` (i.e.
`.claude/rules/` from the repo root) — read whichever files are relevant to
what you're changing before starting:

- [`code-style.md`](rules/code-style.md) — linting/formatting conventions
  for `Backend/` and `Frontend/`
- [`testing.md`](rules/testing.md) — test structure, mocking patterns,
  coverage thresholds for Jest and Vitest
- [`security.md`](rules/security.md) — security hardening and the CI
  security gates (CodeQL, Trivy, Gitleaks, Dependabot)
- [`frontend/react.md`](rules/frontend/react.md) — component/state
  conventions and the mandatory design screenshot loop
- [`frontend/styles.md`](rules/frontend/styles.md) — the full visual
  design system (per-page-type guidance, typography, spacing, color)
- [`backend/api.md`](rules/backend/api.md) — Express
  routing/controller/service layering and response conventions
- [`backend/database.md`](rules/backend/database.md) — MySQL access
  patterns, transactions, schema and migrations
