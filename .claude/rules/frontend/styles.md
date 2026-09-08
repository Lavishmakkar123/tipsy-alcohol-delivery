# Visual Design System

Applies to anything under `Frontend/` that renders UI. The goal is a
distinctive, production-ready look — never generic AI slop.

## Avoid AI Slop

- No Inter/Roboto default font stacks.
- No purple-to-blue gradient heroes.
- No endless rounded cards with soft shadows.
- No generic "trusted by" logo strips.
- No left-sidebar + card-grid SaaS default unless the product genuinely needs it.

Commit to a bold, specific aesthetic first (brutalist, editorial, glass +
depth, neo-brutal, high-contrast typography-led, cinematic dark, warm
organic, sharp minimal, etc.) and state that direction before writing code.

## Per-Page-Type Guidance

**Marketing / landing pages** — one strong narrative arc; hero with a clear
value prop and a single primary CTA above the fold; social proof early,
benefit-framed features, testimonials, pricing, final CTA; typography-led
heroes with restrained motion; avoid feature-card grids that all look the same.

**SaaS / product marketing** — product-in-context visuals (real UI mockups
or interactive demos, not abstract illustrations); clear problem → solution
flow; pricing with monthly/annual toggle and an intentional "Most Popular"
treatment; sticky or translucent nav; strong secondary CTAs (docs, demo, login).

**Dashboards / web apps** — balance information density with scannability;
clear primary actions; consistent spacing scale; status colors that carry
meaning; empty states that guide the user; tables/cards that collapse
intelligently on small screens; keyboard and screen-reader friendly.

**Portfolios / personal / agency sites** — personality first; case studies
with process and outcomes; a unique layout per project instead of identical
cards; restrained navigation.

**E-commerce / product sites** (this app's category) — large, high-quality
product imagery; clear pricing and variants; frictionless add-to-cart; trust
signals near purchase points; fast filtering; mobile-optimized checkout.

**Blogs / content / documentation** — line length ~65–75 characters, good
leading; strong typographic hierarchy; fast navigation and search; dark mode
is often preferred for long reading.

## Rules That Apply Everywhere

- One accent color used with intention, plus neutrals — no rainbow gradients.
- A distinctive font pairing (display + body); prefer modern variable fonts
  over Inter/Roboto/Arial defaults.
- Spacing on a 4/8px scale, mentally aligned to a grid.
- Motion only when purposeful (page load, hover states, scroll reveals).
- Real or high-quality generated imagery with a consistent style — no
  generic stock photography.
- WCAG 2.2 AA minimum: focus states, ARIA where needed, ≥4.5:1 contrast,
  semantic HTML.
- Dark mode when it strengthens the brand, with high-contrast text and
  clear CTAs.
