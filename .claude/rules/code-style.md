# Code Style

This repo is two independently-linted projects — don't cross-apply one's
tooling to the other.

## Backend (`Backend/`)

- CommonJS (`require`/`module.exports`), Node 22, Express 5.
- Linted with a flat ESLint config (`eslint.config.js`): `eslint:recommended`
  + `eslint-plugin-security` + `eslint-plugin-n`. Run `npm run lint` /
  `npm run lint:fix`.
- Formatted with Prettier (`.prettierrc.json`: single quotes, semicolons,
  120 print width). Run `npm run format` / `npm run format:check`.
- `db/**/*.js` (migration/seed scripts) are allowed to use `process.exit()`
  — that rule is disabled only for that directory, on purpose.
- An unused function parameter that must stay for arity (e.g. Express error
  middleware's `(err, req, res, next)`) is prefixed `_` to satisfy
  `no-unused-vars` — see `_next` in `app.js`.

## Frontend (`Frontend/`)

- React 19 + TypeScript, Vite, Tailwind CSS v4.
- House style is **no semicolons, double quotes** — this is intentional.
  Do not add Prettier or ESLint here.
- Linted with `oxlint` only (`.oxlintrc.json`, `npm run lint`). Type-checked
  with `npm run typecheck` (`tsc -b --noEmit`).
- Path alias `@/` → `src/`, configured in both `tsconfig.app.json` and
  `vite.config.ts`/`vitest.config.ts` — keep them in sync if either changes.

## Both Projects

- No dead code or unused exports — delete rather than comment out.
- Comments explain non-obvious *why* (a hidden constraint, a workaround, a
  subtle invariant) — never restate what well-named code already shows.
- Keep business logic out of the transport layer: backend controllers stay
  thin (see `.claude/rules/backend/api.md`); frontend components read from
  hooks/contexts rather than embedding fetch/state logic inline.
- Before considering a change done, run that project's `lint` (and
  `format:check` / `typecheck` where it exists) — both are wired into CI
  (`.github/workflows/ci.yml`) and will fail the build otherwise.
