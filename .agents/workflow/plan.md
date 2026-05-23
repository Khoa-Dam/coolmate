# Planning Workflow

Use this workflow before non-trivial coding.

## 1. Understand the task

- Identify the user-visible outcome.
- Identify the affected route, component, data model, and state behavior.
- Check whether the task changes architecture or only a local UI section.

## 2. Read current code and docs

- Inspect existing files before editing.
- For Next.js APIs, read relevant docs in `node_modules/next/dist/docs/` first.
- Check package scripts before running commands.

## 3. Propose approach when needed

For multi-file work, new flows, or design decisions, present a short plan before implementation:

- Files or areas to change.
- UI/data behavior to implement.
- Verification steps.
- Any assumptions or open decisions.

## 4. Implement surgically

- Edit the minimum necessary files.
- Keep work reversible.
- Do not add libraries without asking first.
- Do not create documentation files unless the user asks.

## 5. Verify

Follow `.agents/workflow/verification.md` before saying the work is complete.
