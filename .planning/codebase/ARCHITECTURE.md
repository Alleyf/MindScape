# Architecture

**Analysis Date:** 2026/05/11

## System Overview

MindScape is a single-page application (SPA) that serves as an AI-Native knowledge studio for personal notes. All pages are implemented as React function components within a single `App.tsx` file, with content loaded from markdown files via Vite's glob import mechanism.

```text
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │HomePage│ │NotesPage│ │TagsPage │ │NotePage │ ...       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│       │           │           │           │                 │
│       └───────────┴───────────┴───────────┘                 │
│                         │                                     │
│                         ▼                                     │
│              React Router (client-side routing)               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    noteLoader.ts                             │
│         (Vite glob import + frontmatter parse)                │
│                   content/posts/*.md                         │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App | Root shell, routing, nav, search dialog state | `src/App.tsx` |
| HomePage | Hero section, featured notes, capabilities grid | `src/App.tsx` |
| NotesPage | Grid/timeline note list with tag filtering | `src/App.tsx` |
| TagsPage | Tag cloud with category grouping | `src/App.tsx` |
| NotePage | Reading view with TOC, sidebar, references | `src/App.tsx` |
| RoadmapPage | Learning route visualization | `src/App.tsx` |
| GraphPage | Knowledge graph visualization | `src/App.tsx` |
| ResourcesPage | Resource library grid | `src/App.tsx` |
| AboutPage | Stats, timeline, feature explanations | `src/App.tsx` |
| AIPanel | AI metaphors, related notes, personality | `src/components/AIPanel.tsx` |
| NoteCard | Animated card for note preview | `src/components/NoteCard.tsx` |
| NoteGraph | D3-based tag network visualization | `src/components/NoteGraph.tsx` |
| NoteGraphSidebar | Related notes panel on note page | `src/components/NoteGraphSidebar.tsx` |
| LearningRoadmapFlow | React Flow-based roadmap diagram | `src/components/LearningRoadmapFlow.tsx` |
| MarkdownContent | Markdown rendering | `src/components/MarkdownContent.tsx` |
| ThemeToggle | Dark/light theme switch | `src/components/ThemeToggle.tsx` |
| ParticleField | Animated background particles | `src/components/ParticleField.tsx` |
| MouseGlow | Mouse tracking glow effect | `src/components/MouseGlow.tsx` |
| FloatingTools | Reading tools (print, etc.) | `src/components/FloatingTools.tsx` |

## Pattern Overview

**Overall:** Component-based SPA with client-side routing and static content loading

**Key Characteristics:**
- Single `App.tsx` file contains all page components (no code splitting)
- Client-side routing via React Router v6
- Content loaded at build time via Vite `import.meta.glob` (eager, raw)
- Theme system via Tailwind CSS custom properties + `light-theme` class on `<html>`
- Framer Motion for page transitions and micro-animations
- D3.js for knowledge graph visualization
- React Flow for learning roadmap diagrams

## Layers

**UI Components:**
- Purpose: Render pages and visual elements
- Location: `src/App.tsx` (page components) and `src/components/` (shared components)
- Contains: React components with Tailwind CSS styling
- Depends on: React, Framer Motion, React Router

**Content Layer:**
- Purpose: Load and parse markdown notes with frontmatter
- Location: `src/utils/noteLoader.ts`
- Contains: `getNotes()`, `getNoteBySlug()`, `getRelatedNotes()`, frontmatter parser
- Depends on: Vite glob imports

**Configuration Layer:**
- Purpose: Application constants and environment-driven config
- Location: `src/config/resources.ts`
- Contains: `RESOURCE_CATEGORIES`, `LEARNING_ROUTES`, API URLs
- Depends on: `import.meta.env` for env var overrides

**Type Layer:**
- Purpose: TypeScript interfaces
- Location: `src/types/index.ts`
- Contains: `Note`, `NoteFrontmatter` interfaces

## Data Flow

### Primary Request Path

1. **App mounts** — `src/App.tsx:1697` renders `<Router>` with `<nav>` and `<Routes>`
2. **Route matches** — React Router selects page component (e.g., `NotesPage`)
3. **Notes load** — Page calls `getNotes()` which calls `import.meta.glob` to load all markdown
4. **Frontmatter parsed** — `parseFrontMatter()` in `noteLoader.ts:12` extracts YAML frontmatter
5. **Rendering** — Page renders with `useMemo` for derived data (filtered notes, tags, TOC)

### Note Reading Flow

1. User navigates to `/note/:slug`
2. `NotePage` receives `slug` via `useParams()`
3. `getNoteBySlug(slug)` looks up note from cached glob-loaded data
4. `extractTableOfContents()` builds TOC from markdown headings
5. `extractReferenceLinks()` extracts `[title](url)` links for reference preview cards
6. `getRelatedNotes()` scores notes by tag overlap

### Search Flow

1. User opens search dialog (state in `App.tsx`)
2. `SearchDialog` calls `getNotes()` to get all notes
3. `scoreNote()` ranks notes by title(8) > tags(5) > excerpt(3) > content(1)
4. `getSearchSnippet()` extracts contextual snippet around match

## Key Abstractions

**Note Interface:**
- Represents a single markdown note with parsed frontmatter
- Defined in `src/types/index.ts`
- Examples: `src/utils/noteLoader.ts:57-92`

**LearningRoute Interface:**
- Represents a learning path with steps and resources
- Used by `LearningRoadmapFlow` component
- Configured in `src/config/resources.ts`

**Theme System:**
- CSS custom properties for colors (Tailwind CSS integration)
- `light-theme` class on `<html>` element toggles light mode
- Stored in `localStorage` and respects `prefers-color-scheme`

## Entry Points

**Web Entry:**
- Location: `src/App.tsx` (default export)
- Triggers: Browser loads index.html which mounts React app
- Responsibilities: Router setup, global nav, route rendering, search dialog state

**Content Import:**
- Location: `src/utils/noteLoader.ts:6`
- Triggers: Build time via Vite glob
- Responsibilities: Load all `.md` files from `content/posts/**/*.md` as raw strings

## Routing Structure

All routes defined in `src/App.tsx:1765-1774`:

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `HomePage` | Landing page with hero, stats, features |
| `/notes` | `NotesPage` | Note listing with grid/timeline toggle |
| `/tags` | `TagsPage` | Tag cloud with category tabs |
| `/search` | `SearchPage` | Redirects to home |
| `/note/:slug` | `NotePage` | Individual note reading view |
| `/roadmap` | `RoadmapPage` | Learning paths visualization |
| `/graph` | `GraphPage` | Knowledge graph |
| `/resources` | `ResourcesPage` | Resource library |
| `/about` | `AboutPage` | About/stats page |

## Theme System

**Implementation:**
- Tailwind CSS with custom color variables defined in CSS
- `light-theme` class on `<html>` toggles between dark/light
- `ThemeToggle` component in `src/components/ThemeToggle.tsx` manages state
- Preference stored in `localStorage` key `theme`

**CSS Variables (from Tailwind config):**
- `--tw-colors-nebula-accent`, `--tw-colors-nebula-purple`, etc.
- Glass morphism via `backdrop-blur` and semi-transparent backgrounds

## Component Communication

**Parent to Child:**
- Props passed directly (e.g., `<NoteCard note={note} index={index} />`)
- `NoteGraphSidebar` receives `currentNote`, `allNotes`, `relatedNotes` as props

**Child to Parent:**
- Callback functions (e.g., `onClose` for dialogs)
- `SearchDialog` calls `onClose()` when user closes

**Sibling Communication:**
- Via parent state (e.g., `searchOpen` state lifted to `App.tsx`)
- `FloatingTools` reads note state via URL or context

**Global State:**
- Theme state managed via `ThemeToggle` + `localStorage`
- No external state management library (Zustand, Redux, etc.)

## Anti-Patterns

### All Pages in Single File

**What happens:** 1800+ line `App.tsx` with 10+ page components
**Why it's wrong:** Difficult to navigate, no code splitting, longer initial load
**Do this instead:** Split into `src/pages/` directory with one file per page

### Inline Helper Functions

**What happens:** Utility functions defined in `App.tsx` (e.g., `formatDateTime`, `extractTableOfContents`, `getAllTags`)
**Why it's wrong:** These are reusable utilities but live in a component file
**Do this instead:** Move to `src/utils/` or `src/hooks/` directories

### Reference Preview Fetching on Every Render

**What happens:** `ReferencePreviewCard` calls `fetchLinkPreviewMetadata` in `useEffect`
**Why it's wrong:** No deduplication; multiple reference cards can trigger simultaneous fetches for same URL
**Do this instead:** Implement request deduplication or cache at the data layer

## Error Handling

**404 Handling:**
- `NotePage` checks `if (!note)` and renders "笔记未找到" message
- No global error boundary

**Empty States:**
- Notes page: "这个标签下暂时没有笔记。" when filtered list is empty
- Search: "没找到匹配内容。换个关键词试试。" when no results

**Async Errors:**
- Link preview fetches catch errors and fall back to generated SVG cover

---

*Architecture analysis: 2026/05/11*
