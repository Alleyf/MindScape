# Testing Patterns

**Analysis Date:** 2026-05-11

## Test Framework

**Status:** No test framework configured

This project does not have a test framework installed or configured. The `package.json` contains no test scripts and there are no test files in the project source.

**Package.json scripts:**
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

No `test`, `vitest`, `jest`, or similar scripts defined.

## Test File Locations

**Project source:** No test files exist in `src/` or project root

**Third-party tests:** Test files exist only in `node_modules/` for dependencies:
- `node_modules/style-to-js/src/index.test.ts`
- `node_modules/style-to-js/src/utilities.test.ts`

These are tests for vendored dependencies, not project code.

## What Is Tested

**Nothing.** The project has no unit, integration, or E2E tests.

## What Is Untested

The following areas have no test coverage:

**Core Utilities:**
- `src/utils/noteLoader.ts` - Front matter parsing, note loading, slug resolution
- `src/App.tsx` - Route handlers, page components, state management
- All page components: `HomePage`, `NotesPage`, `TagsPage`, `NotePage`, `RoadmapPage`, `GraphPage`, `ResourcesPage`, `AboutPage`

**Components:**
- `src/components/NoteCard.tsx`
- `src/components/MarkdownContent.tsx`
- `src/components/AIPanel.tsx`
- `src/components/NoteGraph.tsx`
- `src/components/LearningRoadmapFlow.tsx`
- `src/components/ThemeToggle.tsx`
- All other components in `src/components/`

**Business Logic:**
- Markdown parsing and rendering
- Search and filtering logic
- Tag extraction and grouping
- Reference link extraction
- Table of contents generation
- Date/time formatting

## Key Risks

- Front matter parsing edge cases (malformed YAML)
- Note loading/sorting behavior
- Search scoring algorithm
- Component rendering with empty or missing data
- Theme toggle persistence
- URL state management with search params

## Recommendations

1. Add Vitest (aligns with existing Vite setup)
2. Write unit tests for `noteLoader.ts` parsing functions
3. Write unit tests for utility functions (`formatDateTime`, `relativeTime`, `slugifyHeading`, etc.)
4. Add component tests for complex components (`NoteCard`, `ThemeToggle`)
5. Consider adding Playwright for E2E testing of page navigation
