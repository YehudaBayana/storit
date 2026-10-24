# Frontend rules for agents

Read this before changing anything under `frontend/`. All UI in Storit is built strictly with the atomic design system under `src/components/ui`.

## Atomic Design System Rules

1. **Never use raw JSX HTML elements in application code**:
   - Do NOT use `<div`, `<span`, `<p`, `<h1-h6`, `<button`, `<a`, `<input`, `<textarea`, `<form`, `<label`, `<ul`, `<li`, `<section`, `<main`, `<aside`, `<nav`, etc. in `app/`, `features/`, or `shared/`.
   - ALWAYS use atomic components from `@/components/ui` (`Box`, `Flex`, `Stack`, `Grid`, `Container`, `Text`, `Heading`, `Button`, `IconButton`, `Input`, `TextArea`, `FormField`, `Form`, `Card`, `Badge`, `Link`, `Image`, `Modal`, `Spinner`, etc.).

2. **No `className` props on atomic components in consumer code**:
   - Consumers must never pass ad-hoc `className` or Tailwind utility strings to atomic components.
   - The default styling defined within the atomic components must suffice.

3. **Use variants and props for adjustments**:
   - If a consumer requires a specific size, color, layout behavior, or tone adjustment (e.g. `size`, `variant`, `color`, `weight`, `direction`, `gap`, `align`), use the component's existing props and variants.
   - If a necessary variant, size, or prop does not exist on the atomic component, add that variant/prop directly to the atomic component instead of passing a `className` in consumer code.

4. **Creating missing UI components**:
   - If a reusable UI pattern is missing, create it in `src/components/ui/<component-name>/`.
   - Follow the existing pattern: component implementation (`[Name].tsx`), driver (`__tests__/[Name].driver.tsx`), test suite (`__tests__/[Name].driver.test.tsx`), and export in `src/components/ui/index.ts`.
   - Use tokens from `tokens.ts` for styling.

5. **Naming conventions**:
   - Descriptive, self-explanatory variable and component names only. No single-letter variable names.

6. **Verification after changes**:
   - After making changes in `frontend/`, run `yarn check-all` (which runs `yarn build`, `yarn lint`, `yarn format:check`, and `yarn test`).
