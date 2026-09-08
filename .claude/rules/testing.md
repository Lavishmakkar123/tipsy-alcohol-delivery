# Testing

## Backend (Jest + Supertest)

- Tests live in `Backend/tests/`, mirroring the source layout
  (`tests/controllers/`, `tests/middleware/`, `tests/services/`).
- `app.js` exports the Express app without calling `.listen()`, so tests
  import it directly with Supertest instead of spinning up a real server.
- Never hit the real database or Stripe in a test. Mock the data layer at
  the module boundary:
  - When testing a **service**, mock `../../config/db`:
    `jest.mock('../../config/db', () => ({ query: jest.fn(), getConnection: jest.fn() }))`.
  - When testing a **controller**, mock the service module it calls
    (`jest.mock('../../services/x.service')`) so the test exercises
    request validation, status codes, and response shape only.
  - Stripe is mocked at the `stripe` package level (see
    `tests/services/payments.service.test.js`) — mock factory variables must
    be prefixed `mock` (Jest's hoisting rule) e.g. `mockCreate`, `mockRetrieve`.
- `tests/setup.js` seeds `JWT_SECRET`, `FRONTEND_URL`, and `NODE_ENV` so
  tests never depend on a real `.env`.
- Coverage: `npm run test:coverage`. Thresholds live in `jest.config.js`
  under `coverageThreshold` — they were set to match real, achieved coverage
  (currently ~90%+ stmt/func/line, 75%+ branch) after writing tests for every
  controller, middleware, and service. When you add a new
  controller/service, add matching tests and raise the threshold to match —
  never lower a threshold just to make a red CI run green.

## Frontend (Vitest + React Testing Library)

- Config is `Frontend/vitest.config.ts`, kept separate from `vite.config.ts`
  so the build config stays uncluttered. `src/test/setup.ts` wires up
  `@testing-library/jest-dom`.
- Test files sit next to the module they cover (`x.ts` → `x.test.ts`).
- Mock `fetch` with `vi.stubGlobal('fetch', vi.fn().mockResolvedValue(...))`
  and always `vi.unstubAllGlobals()` in `afterEach` — used for anything
  exercising `lib/api.ts` or `lib/geocode.ts`.
- Test context Providers with `renderHook(() => useX(), { wrapper: XProvider })`
  and wrap state-changing calls in `act(...)` from `@testing-library/react`.
- Coverage: `npm run test:coverage`. `vitest.config.ts`'s `coverage.include`
  is deliberately scoped to modules that actually have tests (`src/lib/*.ts`
  plus specific context files) rather than all of `src/` — most page and
  block components have no tests yet. When you add tests for a new
  file, add it to `coverage.include` and keep the threshold honest rather
  than inflating it against untested code.

## General Rule

Coverage thresholds in both projects exist to be raised over time as more
of the codebase gets tests, not to be treated as a ceiling. If a change
would drop coverage below the threshold, add tests for the new code rather
than loosening the config.
