# Frontend Workflow & Component Conventions

## Stack Conventions

- React 19 + TypeScript, built with Vite, styled with Tailwind CSS v4
  (`@tailwindcss/vite`). Path alias `@/` resolves to `Frontend/src/`.
- House code style has **no semicolons** and **double quotes** — this is a
  deliberate existing convention, not an oversight. Don't introduce Prettier
  or ESLint to reformat the frontend; `oxlint` (`.oxlintrc.json`) is the only
  linter here (`npm run lint`).
- Shared UI primitives live in `src/components/ui/`; page sections/blocks
  live in `src/components/blocks/`; cross-cutting state lives in
  `src/context/` as a Provider + `useX()` hook pair (see `cart-context.tsx`,
  `theme-context.tsx`, `wishlist-context.tsx`) — always throw a clear error
  from the hook when used outside its Provider.
- Prefer shadcn/ui-style primitives (Radix + `class-variance-authority` +
  `cn()` from `src/lib/utils.ts`) only when they fit the aesthetic — don't
  reach for a component library default over a bespoke one that matches the
  brand.

## The Design Screenshot Loop (Mandatory for Visual Work)

1. Implement the requested change or new section.
2. Start or use the local dev server (`npm run dev`).
3. Capture screenshots — full page, key sections, and a mobile viewport when
   relevant.
4. Inspect them yourself: is the hierarchy, spacing, and alignment
   intentional? Any AI-slop patterns, uneven gaps, low-contrast text,
   cramped mobile layouts, or weak CTAs? Does it match the committed
   aesthetic (see `.claude/rules/frontend/styles.md`)?
5. Score it honestly out of 10 against a high professional bar and name the
   biggest gaps.
6. Iterate — code, screenshot, critique — until it reaches ≥8.5/10 or the
   user says stop.
7. Only then present the final result with a short summary of what improved.

If screenshot tooling is unavailable, say so explicitly and ask the user for
screenshots rather than guessing at the visual result.

## Workflow Preferences

- State the aesthetic direction and key design decisions before writing
  substantial UI code.
- Prefer small, iterative changes over full rewrites once a direction is set.
- Always run the screenshot loop after a visual change.
- When you need inspiration, describe patterns from real high-quality sites
  of the same type — never copy them directly.
- Explain non-obvious design choices briefly; keep components reusable and
  well-structured rather than one-off.
