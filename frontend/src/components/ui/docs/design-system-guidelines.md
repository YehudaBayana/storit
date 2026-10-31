# Cloudy Design System - Architecture & Process Guidelines

Welcome to the Cloudy Design System guidelines. This document outlines the core engineering philosophy, styling rules, and architectural standards required when building or contributing components to this project.

## 1. Core Philosophy & Design Language

- **Minimalist & Atomic:** Components must be single-purpose, highly reusable, and consistent across the entire application.
- **Single Source of Truth:** All design tokens (colors, spacing, typography) are centralized in `tailwind.config.js`. Avoid hardcoding arbitrary hex values or Tailwind classes when brand tokens exist (e.g., use `brand-500`, `brand-dark`).
- **Visual Identity:** Inspired by modern dashboards, features include deep dark action containers, crisp emerald (`#10b981`) interactive accents, clean borders, and smooth rounded corners (`rounded-xl`).

## 2. Mandatory Component Structure

Every design system component must follow a strict folder and file structure located inside `/components/ui/[component-name]/`:

1. **Component File (`[Component].tsx`):** The clean, typed React functional component.
2. **Test Driver (`__tests__/[Component].driver.ts`):** Encapsulates all React Testing Library queries (`screen`, `fireEvent`, etc.) so consumers and unit tests never interact with raw DOM selectors.
3. **Unit Test (`__tests__/[Component].test.tsx`):** Verifies component behavior exclusively through its test driver.
4. **Documentation File (`README.md` or `[Component].md`):** Explains usage, props, and examples for consumers.

## 3. Testing Standards (The Test Driver Pattern)

To ensure seamless integration testing across feature pages:

- **No Raw Queries in Tests:** Test files must never call `screen.getByTestId` or `fireEvent` directly. All DOM interaction and inspection logic belongs in the driver class.
- **Resilient Test IDs:** Every component must accept a `testId` prop defaulting to a predictable string (e.g., `testId = 'button'`).
