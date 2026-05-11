# Technology Stack

**Analysis Date:** 2026/05/11

## Languages

**Primary:**
- TypeScript 6.0.3 - Used throughout `src/` for type-safe React development
- JavaScript (ES2022+) - Compiled via Vite, no separate tsconfig.json needed

**Styling:**
- CSS 3 with Tailwind CSS utility classes

## Runtime

**Environment:**
- Node.js (any modern version compatible with Vite 8)

**Package Manager:**
- npm (lockfile: `package-lock.json` present)

## Frameworks

**Core:**
- React 19.2.6 - UI library, loaded via `react` and `react-dom`
- react-router-dom 7.15.0 - Client-side routing with BrowserRouter, Routes, Route
- TypeScript 6.0.3 - Type checking and compilation

**Build/Dev:**
- Vite 8.0.11 - Build tool and dev server with HMR
- @vitejs/plugin-react 6.0.1 - Vite plugin for React Fast Refresh

**Styling:**
- Tailwind CSS 3.4.19 - Utility-first CSS framework
- autoprefixer 10.5.0 - CSS vendor prefix injection
- postcss 8.5.14 - CSS transformation tool

**Animation:**
- framer-motion 12.38.0 - Declarative animations via `motion` components

**Content Rendering:**
- react-markdown 10.1.0 - Markdown rendering in React components
- remark 15.0.1 - Markdown processor
- remark-gfm 4.0.1 - GitHub Flavored Markdown support
- remark-html 16.0.1 - Remark plugin to output HTML
- gray-matter 4.0.3 - YAML frontmatter parsing for notes
- highlight.js 11.11.1 - Syntax highlighting for code blocks

**Data Visualization:**
- @xyflow/react 12.10.2 - React Flow for learning roadmap diagrams
- d3-force 3.0.0 - Force-directed graph layout for note graph
- d3-selection 3.0.0 - D3 DOM selection utilities
- d3-zoom 3.0.0 - D3 pan/zoom for note graph

## Key Dependencies

**Critical:**
- react 19.2.6 - Core UI framework
- react-dom 19.2.6 - DOM-specific renderer
- react-router-dom 7.15.0 - Routing

**Visualization:**
- @xyflow/react 12.10.2 - Roadmap flow diagrams (`src/components/LearningRoadmapFlow.tsx`)
- d3-force 3.0.0, d3-selection 3.0.0, d3-zoom 3.0.0 - Knowledge graph (`src/components/NoteGraph.tsx`)

**Content Pipeline:**
- gray-matter 4.0.3 - Parses frontmatter in `content/posts/*.md` files
- react-markdown 10.1.0 - Renders note content via `MarkdownContent` component
- remark/remark-gfm/remark-html - Markdown processing chain

## Configuration

**Environment:**
- Vite handles env vars via `import.meta.env.VITE_*`
- Key env vars: `VITE_RESOURCE_CATEGORIES`, `VITE_LEARNING_ROUTES`, `VITE_MICROLINK_API_URL`, `VITE_FAVICON_YANDEX_URL`
- `.env.example` documents available overrides

**Build:**
- `vite.config.ts` - Vite configuration with React plugin and `@` path alias
- `tailwind.config.js` - Tailwind theme customization
- `postcss.config.js` - PostCSS with autoprefixer

**Path Alias:**
- `@` maps to `./src` - used in imports throughout codebase

## Platform Requirements

**Development:**
- Node.js with npm
- Run `npm run dev` for dev server with HMR
- Run `npm run build` for production build

**Production:**
- Vercel deployment (see `vercel.json`)
- Static site generation via Vite build
