# Backend API Conventions

## Layering

Every feature follows the same three-layer shape — keep new endpoints
consistent with it:

```
routes/<x>.routes.js      → wires URLs + middleware to controller functions
controllers/<x>.controller.js → validates input, calls the service, shapes the HTTP response
services/<x>.service.js   → all business logic and DB/Stripe access, no req/res
```

Controllers stay thin: validate, call one or more services, map the result
(or thrown error) to a status code and JSON body. Anything that touches
`pool` or an external API belongs in a service, never in a controller — this
is what makes controllers testable by mocking the service module.

`app.js` builds and exports the Express app (no `listen()`), so it can be
imported directly in tests with Supertest; `server.js` is the only file that
calls `app.listen()`. Keep it that way — don't merge them back together.

## Auth Middleware

- `requireAuth` (in `middleware/auth.middleware.js`) rejects the request
  with 401 unless it carries a valid JWT, and attaches `req.user`.
- `optionalAuth` attaches `req.user` when a valid token is present but never
  blocks the request — used for guest-checkout-capable routes like orders.
- Never inline JWT verification in a controller; add a new middleware
  function if a route needs different auth semantics.

## Response Conventions

- Errors are always `{ error: string }` — never leak a stack trace or raw
  driver error to the client (see the catch-all handler in `app.js`).
- Status codes: `400` bad input, `401` missing/invalid auth, `403` valid
  auth but not permitted (e.g. someone else's order), `404` not found,
  `409` conflict (duplicate email), `422`/`500` for downstream failures —
  match `err.status` from the thrown error when present, default to 500.
- A thrown `Error` can carry a `.status` property that controllers read to
  pick the response code — see `orders.service.js`'s `createOrder` for the
  pattern (`error.status = 400; throw error`).

## Payments (Stripe)

Never trust a client-reported payment status. The flow is: create a
PaymentIntent server-side (`payments.service.js`), let the client confirm it
with Stripe directly, then on `confirm-payment` re-fetch the PaymentIntent
from Stripe (`retrievePaymentIntent`) and check both that its `metadata.orderId`
matches the order and that `status === 'succeeded'` before marking the order
paid or awarding loyalty points. Do not shortcut this by trusting a
`status` field sent in the request body.
