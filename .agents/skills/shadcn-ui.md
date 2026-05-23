# Skill: shadcn/ui

Use this skill when working with shadcn/ui components, `components.json`, registries, presets, theming, component installation, or UI composition using shadcn patterns.

Source inspiration: `https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md`. This local version is adapted for the Coolmate clone project.

## When to use

- The user asks to add, update, debug, style, or compose shadcn/ui components.
- The project has or will add `components.json`.
- The task mentions shadcn, registry components, presets, blocks, themes, `--preset`, or component docs.
- The UI can be built faster and more consistently from shadcn primitives.

## CLI rules

- Use the project's package manager. This repo currently uses pnpm, so prefer `pnpm dlx shadcn@latest ...`.
- Before adding components, inspect project context with `pnpm dlx shadcn@latest info --json` when shadcn is initialized.
- Use `pnpm dlx shadcn@latest docs <component>` before creating, fixing, or debugging a component.
- Use `pnpm dlx shadcn@latest search` before custom-building a component that likely exists.
- Do not manually fetch upstream component source from GitHub; use the shadcn CLI.
- Do not use `--overwrite` unless the user explicitly approves it.
- If the user asks for a block without naming a registry, ask which registry to use instead of guessing.

## Principles

1. Use existing components first.
2. Compose primitives instead of reinventing UI.
3. Use built-in variants before custom classes.
4. Use semantic theme tokens instead of raw color utilities.
5. Keep accessibility guarantees from the source components intact.
6. Match the current project alias, icon library, Tailwind version, and base primitive.

## Styling rules

- Use `className` primarily for layout, spacing, and composition; avoid overriding component internals unnecessarily.
- Use `gap-*`, not `space-x-*` or `space-y-*`.
- Use `size-*` when width and height are equal.
- Use `truncate` instead of manually combining `overflow-hidden text-ellipsis whitespace-nowrap`.
- Use semantic colors like `bg-background`, `text-muted-foreground`, `bg-primary`, `border-border`.
- Avoid manual `dark:` color overrides; encode theme via tokens.
- Use `cn()` for conditional classes.
- Do not manually set z-index on Dialog, Sheet, Popover, Dropdown, Tooltip, or other overlay primitives unless there is a verified stacking bug.

## Forms and inputs

- Prefer `FieldGroup` + `Field` for form layout when available.
- Use `FieldLabel`, `FieldDescription`, and field-level validation patterns.
- Put `data-invalid` on `Field` and `aria-invalid` on the input control.
- Use `InputGroup` + `InputGroupAddon` for buttons/icons inside inputs.
- Use `ToggleGroup` for 2-7 mutually exclusive or toggle options.
- Use `FieldSet` + `FieldLegend` for grouped checkboxes/radios.

## Composition rules

- Keep items inside their group: `SelectItem` inside `SelectGroup`, `DropdownMenuItem` inside `DropdownMenuGroup`, `CommandItem` inside `CommandGroup`.
- Dialog, Sheet, and Drawer must have a title. Use `sr-only` if visually hidden.
- Use full Card composition: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` as appropriate.
- Buttons do not get custom `isLoading` props unless the local component already supports them; compose `Spinner` and `disabled`.
- `TabsTrigger` belongs inside `TabsList`.
- `Avatar` needs `AvatarFallback`.
- Use `Separator` instead of raw `<hr>` or border-only divs.
- Use `Skeleton` for loading placeholders.
- Use `Badge` for status/labels instead of custom spans.
- Use `Alert` for callouts and `Empty` for empty states when available.

## Icons

- Respect the project's configured icon library from shadcn info.
- Do not assume `lucide-react` unless project context says so.
- Icons inside `Button` should use `data-icon="inline-start"` or `data-icon="inline-end"` when supported by the component style.
- Avoid manual sizing classes on icons inside shadcn components unless the component requires it.

## Component selection guide

- Action: `Button`.
- Inputs: `Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `Slider`.
- Product/card display: `Card`, `Badge`, `Avatar`, `Carousel` when available.
- Navigation: `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination`, `Sidebar`.
- Overlays: `Dialog`, `Sheet`, `Drawer`, `AlertDialog`, `Popover`.
- Feedback: `sonner`, `Alert`, `Progress`, `Skeleton`, `Spinner`.
- Menus: `DropdownMenu`, `ContextMenu`, `Menubar`.
- Layout: `Card`, `Separator`, `ScrollArea`, `Accordion`, `Collapsible`.

## Project component boundaries

- shadcn primitives stay in the configured UI directory, usually `components/ui/`.
- Components composed from shadcn primitives but used by only one route should live with that route. Example: a login form section belongs under the login route area until reused.
- Components composed from shadcn primitives and reused across pages belong in global `components/`.
- Do not promote a page-only component to global just because it uses shadcn/ui.

## Workflow

1. Check whether shadcn is initialized by looking for `components.json`.
2. If not initialized and the user asks to use shadcn, ask before initializing or changing project styling.
3. Run shadcn info when available.
4. Check installed components before importing them.
5. Search or get docs for needed components.
6. Add only required components.
7. Read newly added files and verify imports, alias paths, icon library, and composition rules.
8. Build the requested UI with minimal custom code.
9. Verify lint/type checks and browser behavior for UI work.

## Safe preset handling

- Never decode preset codes manually.
- Use `pnpm dlx shadcn@latest preset decode <code>`, `preset url <code>`, `preset open <code>`, or `preset resolve`.
- Ask before applying a preset because it can overwrite theme, fonts, CSS variables, or components.
- When switching presets, ask whether the user wants overwrite, partial, merge, or skip component updates.

## Updating components

When updating a component while preserving local changes:

1. Run `pnpm dlx shadcn@latest add <component> --dry-run`.
2. Run `pnpm dlx shadcn@latest add <component> --diff <file>` for affected files.
3. Merge upstream changes manually while preserving local modifications.
4. Use `--overwrite` only with explicit user approval.
