<!-- BEGIN:nextjs-agent-rules -->
# Coolmate Clone Agent Rules

This project is a fresh Next.js implementation intended to clone the current Coolmate shopping experience. Treat this file as the source of truth for how agents should plan, design, build, and verify work in this repository.

## Critical Next.js rule

This is NOT the Next.js you know.

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Before writing code that uses routing, server/client components, metadata, caching, images, fonts, forms, actions, middleware, or config, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Project goal

Build a high-quality Coolmate-style ecommerce frontend with clean UX, responsive layouts, realistic product browsing flows, and maintainable components. Do not scrape private data, bypass protections, or copy proprietary assets unless the user provides authorized assets. Recreate behavior and layout patterns with original implementation and placeholder/public assets when needed.

## Required agent workflow

Load and follow the files in `.agents/` before meaningful work:

1. `.agents/rules/karpathy.md` — simplicity, surgical-change, and verification discipline.
2. `.agents/rules/frontend.md` — frontend engineering and implementation rules.
3. `.agents/rules/coolmate-clone.md` — ecommerce clone scope and quality bar.
4. `.agents/workflow/plan.md` — planning workflow before coding.
5. `.agents/workflow/verification.md` — required checks before reporting done.
6. `.agents/skills/frontend-ui.md` — reusable frontend UI skill.
7. `.agents/skills/brainstorming.md` — brainstorming and product/design ideation skill.
8. `.agents/learning/research.md` — how to research docs and reference sites safely.

## Default behavior

- Plan before non-trivial implementation, especially multi-file UI, routing, data modeling, cart/checkout, or design-system work.
- Make small, reversible changes and avoid premature abstractions.
- Prefer existing project conventions over generic framework knowledge.
- Use TypeScript strictly; avoid `any` unless there is no better boundary type.
- Keep components accessible, responsive, and close to real ecommerce behavior.
- Verify with lint/type checks and, for UI changes, run the app and inspect the result in browser when possible.
<!-- END:nextjs-agent-rules -->
