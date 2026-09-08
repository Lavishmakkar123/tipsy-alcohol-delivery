# Security

## Backend Hardening (already in place — don't regress it)

- `helmet()` is applied first in `app.js` for baseline HTTP security headers
  (no `X-Powered-By`, `X-Content-Type-Options: nosniff`, etc.).
- `cors` is locked to `process.env.FRONTEND_URL` — never widen this to `origin: '*'`
  or reflect the request origin.
- `express-rate-limit` throttles `/api/auth/*` (20 requests / 15 min) against
  brute-force and credential-stuffing. Apply the same pattern to any new
  endpoint that's a plausible abuse target (password reset, OTP, etc.).
- Passwords are hashed with `bcryptjs` (cost factor 10) — never store or log
  a plaintext password.
- JWTs are signed with `process.env.JWT_SECRET` and expire after 7 days.
  Never hardcode a secret or fall back to a default value in production code
  (test files seeding a fake secret in `tests/setup.js` are the one
  exception, and only for that purpose).
- The catch-all error handler in `app.js` returns `{ error: message }` only
  — it must never forward a stack trace or raw driver error to the client.
- All SQL is parameterized (see `.claude/rules/backend/database.md`) — this
  is the app's entire SQL-injection defense; never string-interpolate
  request data into a query.
- Payment confirmation re-verifies the PaymentIntent with Stripe server-side
  rather than trusting a client-reported status (see
  `.claude/rules/backend/api.md`).

## Secrets

- Real secrets (`.env` in both `Backend/` and `Frontend/`) are gitignored —
  never commit one, and never print an env var's value in logs or error
  messages. `.env.example` documents which keys are required without values.

## CI Security Gates

These run on every push/PR to `main` plus a weekly schedule — treat a new
HIGH/CRITICAL finding as blocking, not something to suppress inline:

- **CodeQL** (`.github/workflows/codeql.yml`) — JS/TS static analysis with
  the `security-extended` query pack.
- **Trivy** (`.github/workflows/trivy.yml`) — filesystem, dependency, and
  config/IaC scanning (covers `docker-compose.yml` misconfigurations too).
- **Gitleaks** (`.github/workflows/security.yml`) — secret scanning across
  the full git history on every run.
- **Dependency review** (`.github/workflows/security.yml`, PRs only) — fails
  a PR that introduces a new high-severity vulnerable dependency.
- **npm audit** — both `Backend` and `Frontend` are audited at
  `--omit=dev --audit-level=high` in `ci.yml` (blocking) and at
  `--audit-level=moderate` in `security.yml` (informational, weekly).
- **Dependabot** (`.github/dependabot.yml`) opens weekly grouped update PRs
  for `Backend`, `Frontend`, and the GitHub Actions themselves — review and
  merge these promptly rather than letting them accumulate.

Findings from CodeQL and Trivy publish to the repository's Security tab.
