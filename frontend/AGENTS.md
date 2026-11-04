# Frontend rules for agents

Read this before changing anything under `frontend/`. All UI in Storit is built strictly with the atomic design system under `src/components/ui`.

## Atomic Design System Rules

1. **Never use raw JSX HTML elements in application code**:

- Do NOT use `<div`, `<span`, `<p`, `<h1-h6`, `<button`, `<a`, `<input`, `<textarea`, `<form`, `<label`, `<ul`, `<li`, `<section`, `<main`, `<aside`, `<nav`, etc. in `app/`, `features/`, or `shared/`.
- ALWAYS use components from @mantine library (such as `Box`, `Text`, `Group`, `Stack`, etc.) instead of raw HTML tags.

2. **When styling a component**:

- Use Tailwind utility classes or Mantine style props.
- Though the default styling defined within the @mantine components should suffice.

3. **Naming conventions**:

- Descriptive, self-explanatory variable and component names only. No single-letter variable names.

4. **Verification after changes**:

- After making changes in `frontend/`, run `yarn verify` (which runs `yarn build`, `yarn lint`, `yarn format:check`, and `yarn test`).
