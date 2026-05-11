# Codebase Structure

**Analysis Date:** 2026/05/11

## Directory Layout

```
A:/dashboard/GH_Repos/MindScape/
├── src/
│   ├── App.tsx                    # Main SPA with all page components
│   ├── main.tsx                   # React DOM entry point
│   ├── components/               # Shared UI components
│   │   ├── AIPanel.tsx           # AI metaphor/connection/personality panel
│   │   ├── FloatingTools.tsx     # Reading tools overlay
│   │   ├── LearningRoadmapFlow.tsx # React Flow roadmap
│   │   ├── MarkdownContent.tsx   # Markdown renderer
│   │   ├── MouseGlow.tsx         # Mouse tracking glow effect
│   │   ├── NoteCard.tsx          # Note preview card
│   │   ├── NoteGraph.tsx         # D3 knowledge graph
│   │   ├── NoteGraphSidebar.tsx  # Note page sidebar
│   │   ├── ParticleField.tsx     # Animated particle background
│   │   ├── RandomWalkButton.tsx  # Random note navigation
│   │   └── ThemeToggle.tsx       # Dark/light theme switch
│   ├── config/
│   │   └── resources.ts          # Resource categories and learning routes
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── utils/
│       ├── noteData.ts           # Random note selection
│       └── noteLoader.ts         # Vite glob import + frontmatter parsing
├── content/
│   └── posts/                    # Markdown note files (content source)
│       ├── 前端开发/
│       ├── 后端开发/
│       └── *.md                  # Individual notes
├── public/                       # Static assets
├── index.html                    # HTML entry point
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Directory Purposes

**`src/`:**
- All TypeScript/React source code
- Entry point is `src/main.tsx`

**`src/components/`:**
- Shared UI components used across multiple pages
- Each component is a single file with its logic and styles
- Components imported directly by pages in `App.tsx`

**`src/config/`:**
- Static configuration data
- `resources.ts` contains resource categories and learning routes
- Can be overridden via environment variables (`VITE_*`)

**`src/types/`:**
- TypeScript interface definitions
- `Note` interface used throughout the app

**`src/utils/`:**
- Utility functions for content loading
- `noteLoader.ts`: Vite glob import + frontmatter parsing
- `noteData.ts`: Random note helper

**`content/posts/`:**
- Markdown source files with YAML frontmatter
- Organized in subdirectories by topic
- Vite glob imports this directory at build time

**`public/`:**
- Static assets served as-is

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React DOM render, imports `App`
- `index.html`: HTML shell with `<div id="root">`

**Configuration:**
- `src/config/resources.ts`: Resource data, learning routes, API endpoints
- `tailwind.config.js`: Theme colors, custom properties
- `vite.config.ts`: Vite bundler config

**Core Logic:**
- `src/App.tsx`: All page components, routing, state management
- `src/utils/noteLoader.ts`: Note loading and parsing
- `src/components/NoteGraph.tsx`: Knowledge graph with D3

**Testing:**
- No test directory detected; no Jest/Vitest config found

## Naming Conventions

**Files:**
- PascalCase for components: `NoteCard.tsx`, `ThemeToggle.tsx`
- camelCase for utilities: `noteLoader.ts`, `noteData.ts`
- kebab-case for directories: `src/components/`, `src/config/`

**Components:**
- Function components with named exports: `export function NoteCard()`
- Props interfaces co-located: `NoteCardProps` in same file

**Functions:**
- camelCase: `getNotes()`, `getNoteBySlug()`, `formatDateTime()`
- Helper functions in `App.tsx` are also camelCase

## Where to Add New Code

**New Page Component:**
- Primary code: Add to `src/App.tsx` (create new function like `function NewPage() {}`)
- Route registration: Add `<Route path="/new" element={<NewPage />} />` in `App.tsx:1765-1774`
- Tests: Not detected

**New Shared Component:**
- Implementation: `src/components/NewComponent.tsx`
- Export named function: `export function NewComponent()`
- Import in `App.tsx`: `import { NewComponent } from './components/NewComponent'`

**New Note:**
- Add markdown file to `content/posts/`
- Include frontmatter: `title`, `tags`, `date`, `mood`, `personality`, `aiSubtitle`
- Example frontmatter:
  ```yaml
  ---
  title: My Note Title
  tags: ["React", "TypeScript"]
  date: 2026-05-11
  mood: "✨"
  personality: "沉思者"
  aiSubtitle: "A thoughtful exploration"
  ---
  ```

**New Resource Category:**
- Edit `src/config/resources.ts`
- Add to `DEFAULT_RESOURCE_CATEGORIES` array
- Or override via `VITE_RESOURCE_CATEGORIES` env var

**New Learning Route:**
- Edit `src/config/resources.ts`
- Add to `DEFAULT_LEARNING_ROUTES` array
- Or override via `VITE_LEARNING_ROUTES` env var

## Special Directories

**`content/posts/`:**
- Purpose: Markdown note source files
- Generated: No (authored manually)
- Committed: Yes (part of git repo)

**`src/components/`:**
- Purpose: Reusable UI components
- Generated: No
- Committed: Yes

**`public/`:**
- Purpose: Static assets (favicon, etc.)
- Generated: No
- Committed: Yes

## Where Utils Live

**`src/utils/noteLoader.ts`:**
- `parseFrontMatter(content: string)` — Extract YAML frontmatter and body
- `getNotes(): Note[]` — Load all notes via glob, parse, sort by date
- `getNoteBySlug(slug: string): Note | null` — Find single note
- `getRelatedNotes(currentNote: Note, limit?: number): Note[]` — Tag-based similarity

**`src/utils/noteData.ts`:**
- `getRandomNote()` — Select random note from loaded notes
- Exports `Note` type re-export from types

## Component Organization

Components in `src/components/` are organized by feature, not type:

| Component | Purpose |
|-----------|---------|
| `AIPanel.tsx` | AI-related features panel for note reading |
| `FloatingTools.tsx` | Reading tools (print, font size, etc.) |
| `LearningRoadmapFlow.tsx` | React Flow based learning path visualization |
| `MarkdownContent.tsx` | Markdown to HTML rendering |
| `MouseGlow.tsx` | Background mouse glow effect |
| `NoteCard.tsx` | Card preview for note listing |
| `NoteGraph.tsx` | D3 force-directed knowledge graph |
| `NoteGraphSidebar.tsx` | Sidebar showing related notes |
| `ParticleField.tsx` | Animated background particles |
| `RandomWalkButton.tsx` | Random note navigation |
| `ThemeToggle.tsx` | Theme switch button |

## Tailwind CSS Usage

- Utility classes inline in JSX
- Custom color variables: `nebula-accent`, `nebula-purple`, `nebula-glow`, etc.
- Glass morphism: `glass-card` class with `backdrop-blur`
- Gradient text: `gradient-text` class

---

*Structure analysis: 2026/05/11*
