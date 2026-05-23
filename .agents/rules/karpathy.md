# Karpathy-Style Coding Rules

These rules are adapted for this project from Karpathy-style LLM coding discipline: think first, keep changes simple, edit surgically, and verify the goal.

## 1. Think before coding

- Do not assume unclear requirements.
- Surface ambiguity instead of silently choosing an interpretation.
- State assumptions before implementation when the task has multiple valid meanings.
- If a simpler approach exists, recommend it.
- If something is confusing or underspecified, ask before changing code.

## 2. Simplicity first

- Write the minimum code that solves the requested problem.
- Do not add features the user did not ask for.
- Do not create abstractions for single-use code.
- Do not add configurability, fallback systems, or extensibility without a current need.
- Do not add error handling for impossible internal states.
- If a solution grows large, pause and look for a smaller design.

## 3. Surgical changes

- Touch only files and lines required by the task.
- Do not refactor adjacent code unless the user asked or the task cannot be completed otherwise.
- Match the existing code style, naming, and folder patterns.
- Remove only imports, variables, functions, or files made unused by your own changes.
- If unrelated dead code is found, mention it instead of deleting it.
- Every changed line should connect directly to the user's request.

## 4. Goal-driven execution

Before multi-step work, define a short success target:

- What user-visible behavior should change?
- What code area will be touched?
- What command or browser check proves success?

For bug fixes:

1. Reproduce or identify the failing behavior.
2. Make the smallest fix.
3. Verify the specific behavior now works.

For UI work:

1. Build the requested screen or component.
2. Verify desktop and mobile layout.
3. Verify interactive and empty/loading/error states that apply.

## 5. Completion standard

A task is not complete because code was edited. It is complete only when the requested outcome has been verified, or when you clearly state what could not be verified and why.
