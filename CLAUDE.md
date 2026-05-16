# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Commands

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview build
```

## Architecture

### Single-file SPA structure
All page components live in `src/App.tsx` as functions (`HomePage`, `NotesPage`, `TagsPage`, `NotePage`, `GraphPage`, `RoadmapPage`, `ResourcesPage`, `AboutPage`). Routes are defined at the bottom of the file. No Next.js-style file-based routing.

### Content loading
Blog posts are loaded at runtime via Vite `import.meta.glob`:
```ts
import.meta.glob('../../content/posts/**/*.md', { eager: true, query: '?raw', import: 'default' });
```
This means:
- All `.md` files in `content/posts/` (recursive) are bundled at build time
- No server-side rendering for content — pure client-side
- Slug is derived from filename (subdirectory included in path for uniqueness)

### Blog post front matter
Each post in `content/posts/` requires YAML front matter:
```yaml
---
title: "Post Title"
date: "2026-01-25"
tags: ["react", "hooks"]
personality: "沉思者"   # optional, defaults to "沉思者"
description: "Short desc" # optional
priority: 1              # optional, controls sort order (lower = higher priority)
---
```

**Priority field**: Controls sort order in lists. Lower numbers appear first. Notes without `priority` are sorted by date (Infinity = lowest priority). Notes with `priority < 10` show a "置顶" badge on cards.

### Theme system
Dark mode is default. Light mode toggled via `light-theme` class on `<html>`. All colors are CSS custom properties (`--text-primary`, `--text-muted`, `--surface`, etc.). **Never use hardcoded hex colors in components** — always use `var(--*)` so light/dark themes work.

### Resource configuration
Resource URLs are externalized to `src/config/resources.ts`. Data is loaded via `RESOURCE_CATEGORIES` and `LEARNING_ROUTES`, with optional env var overrides:
- `VITE_RESOURCE_CATEGORIES` — JSON string for resource categories
- `VITE_LEARNING_ROUTES` — JSON string for learning routes
- `VITE_MICROLINK_API_URL` — link preview API
- `VITE_FAVICON_YANDEX_URL` — favicon service

The `.env` file is gitignored; `.env.example` documents overrides.

### Key files
- `src/App.tsx` — all page components and routing
- `src/utils/noteLoader.ts` — blog post loading, front matter parsing, `getNotes()`, `getNoteBySlug()`
- `src/types/index.ts` — `Note` interface
- `src/components/` — UI components (ParticleField, MouseGlow, NoteGraph, etc.)
- `src/index.css` — all styles; CSS variables defined at top, mobile breakpoints at bottom
- `src/config/resources.ts` — resource data (externalized from App.tsx)

### Styles
Global CSS with CSS custom properties. No Tailwind utility classes for custom properties — extend Tailwind config if needed. Component-specific CSS lives in `index.css` at the bottom (not in separate `.css` files).

### Key CSS patterns
```css
/* Theme-aware text */
color: var(--text-muted);      /* readable in both themes */
color: var(--text-primary);    /* primary content */
background: var(--surface);      /* glassmorphic panels */

/* Dark-mode only hardcoded colors that work on dark bg — AVOID */
color: #fff8ee;   /* wrong — won't be readable in light mode */
```
