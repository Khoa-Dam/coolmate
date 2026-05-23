# Frontend Engineering Rules

## Framework and docs

- This repository uses a newer Next.js version. Read the relevant files under `node_modules/next/dist/docs/` before using or changing framework-specific APIs.
- Do not rely on memory for App Router, metadata, caching, image optimization, fonts, forms, server actions, middleware, or config behavior.
- Prefer the simplest supported Next.js pattern for the current version.

## Code style

- Use TypeScript for all application code.
- Prefer server components by default; use client components only when state, browser APIs, event handlers, or effects are required.
- Keep components small and focused, but do not over-abstract early.
- Avoid broad utility layers until at least three concrete call sites prove the need.
- Do not add comments unless the reason is non-obvious.

## UI quality

- Build responsive layouts for mobile, tablet, and desktop.
- Use semantic HTML first: `header`, `nav`, `main`, `section`, `article`, `footer`, `button`, `a`, `form`.
- Maintain keyboard access, focus states, labels, alt text, and sufficient contrast.
- Use realistic ecommerce states: loading, empty, error, sale price, out of stock, selected size/color, cart quantity.
- Avoid layout shift for images/cards; define stable aspect ratios.

## Styling

- Follow the styling system already present in the repo.
- Keep spacing, typography, color, border radius, shadows, and interaction states consistent.
- Prefer reusable design tokens/classes over one-off values once patterns repeat.

## Data and assets

- Use local mock data until a real API is introduced.
- Keep mock product data realistic but not proprietary.
- Do not hotlink assets from Coolmate or other sites unless the user explicitly authorizes it.
- Prefer local placeholder assets in `public/` or generated neutral placeholders.
