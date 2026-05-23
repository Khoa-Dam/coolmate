# Verification Workflow

## Required checks

Before reporting a coding task as complete:

1. Run the relevant lint/type/test command available in `package.json`.
2. For UI changes, start the dev server and inspect the page in a browser when possible.
3. Check responsive behavior for mobile and desktop widths.
4. Check keyboard/focus behavior for interactive controls.
5. Mention any verification that could not be performed.

## What to look for in UI work

- No runtime console errors.
- No hydration mismatch.
- Images have stable layout and useful alt text.
- Buttons and links have clear hover/focus states.
- Empty/loading/error states do not break layout.
- Mobile navigation and horizontal overflow are checked.

## Completion report

Keep the final response short:

- What changed.
- What was verified.
- Any remaining limitation or next step.
