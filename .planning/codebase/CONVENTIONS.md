# Coding Conventions

**Analysis Date:** 2026-05-11

## CSS Variables

CSS variables are defined in `src/index.css` under the `:root` selector. All variables follow a consistent naming scheme:

**Color Palette:**
- `--nebula-dark` - Dark background base
- `--nebula-purple` - Purple accent color
- `--nebula-blue` - Blue accent color
- `--nebula-accent` - Primary accent (coral/orange)
- `--nebula-glow` - Glow variant of accent

**Text Colors:**
- `--text-primary` - Main text color
- `--text-muted` - Secondary/muted text
- `--text-subtle` - Tertiary/subtle text

**Surface Colors:**
- `--surface` - Semi-transparent surface overlay
- `--surface-strong` - Stronger surface opacity
- `--surface-hover` - Hover state surface

**Utility Variables:**
- `--page-bg` - Page background color
- `--nav-bg` - Navigation background
- `--border-soft` - Soft border color
- `--shadow-soft` - Soft shadow value
- `--flow-dot` - Flow diagram dot color
- `--display-font` - Serif font for headings
- `--ui-font` - Sans-serif font for UI

**Theme Variants:**
Light theme overrides use the `.light-theme` class selector.

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `NoteCard.tsx`, `ThemeToggle.tsx`)
- Utilities: camelCase (e.g., `noteLoader.ts`)
- Config: camelCase (e.g., `resources.ts`)
- CSS: Single file `index.css` with all global styles

**Functions:**
- camelCase for function names (e.g., `getNotes()`, `formatDateTime()`)
- PascalCase for React component functions (e.g., `HomePage()`, `NoteCard()`)

**Variables:**
- camelCase for local variables and function parameters
- PascalCase for interface/type names
- Uppercase for environment-like constants (e.g., `MICROLINK_API_URL`)

**Types/Interfaces:**
- PascalCase interface names (e.g., `interface TocItem`, `interface ReferenceLink`)
- Descriptive names: `TocItem`, `TocNode`, `ReferencePreviewData`

## Component Patterns

**Styling Approach:**
- Tailwind CSS for utility classes (e.g., `className="flex items-center gap-4"`)
- CSS custom properties for theme colors (e.g., `var(--nebula-accent)`)
- Global CSS classes defined in `src/index.css` for complex selectors
- Framer Motion for animations via `motion` component

**No CSS-in-JS or component-level CSS files:**
- All styles live in `src/index.css` or via Tailwind utilities
- No styled-components, CSS modules, or inline `<style>` tags
- Component files contain only TypeScript/JSX logic

**State Management:**
- React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
- No external state library
- `useSearchParams` from react-router-dom for URL state

**Component Structure:**
- Functional components only (no class components)
- Props typed with TypeScript interfaces
- Destructured props in function signature

## Blog Post Front Matter

Front matter is parsed in `src/utils/noteLoader.ts` via a custom YAML-like parser. Example from `content/posts/welcome.md`:

```yaml
---
title: "欢迎来到 MindScape"
date: "2026-01-15"
tags: ["intro", "welcome", "getting-started"]
personality: "引路人"
description: "探索你的创意知识库之旅"
---
```

**Required Fields:**
- `title` - Post title (string)
- `date` - ISO date string (YYYY-MM-DD)
- `tags` - Array of tag strings
- `personality` - Author personality (string)
- `description` - Short excerpt/description

**Optional Fields:**
- `mood` - Emoji mood indicator (defaults to "✨")
- `aiSubtitle` - AI-generated subtitle

## Import Organization

Standard import order in components:
1. Framework imports (react, react-router-dom)
2. Third-party libraries (framer-motion)
3. Internal components (`./components/*`)
4. Internal utilities (`./utils/*`)
5. Internal config (`./config/*`)

## File Organization

**Global styles:** `src/index.css`
**Components:** `src/components/*.tsx`
**Utilities:** `src/utils/*.ts`
**Config:** `src/config/*.ts`
**Blog content:** `content/posts/**/*.md`
