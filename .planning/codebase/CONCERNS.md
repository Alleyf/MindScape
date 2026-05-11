# Codebase Concerns

**Analysis Date:** 2026/05/11

## Subdirectory Post Loading / Slug Handling

**Issue:** Slugs are derived from filename only, losing subdirectory context.

- **File:** `src/utils/noteLoader.ts:69`
- **Code:** `const fileName = rawSlug.split('/').pop() || rawSlug;`
- A post at `content/posts/后端开发/Java常用新特性.md` gets slug `Java常用新特性`
- A post at `content/posts/Java常用新特性.md` also gets slug `Java常用新特性`
- **Impact:** Slug collision if two posts in different subdirectories share the same filename
- **Fix approach:** Use the full relative path (e.g., `后端开发/Java常用新特性`) or implement a unique ID generation strategy

**Note:** The glob pattern `import.meta.glob('../../content/posts/**/*.md')` correctly picks up subdirectory posts, but the slug extraction drops the directory structure.

---

## Theme System Completeness

**Hardcoded colors that bypass CSS variables:**

- `src/index.css:119` - Primary button gradient: `#d97757` to `#8f4f32` (hardcoded in `.primary-button`)
- `src/index.css:2600` - Gradient text: `#f4efe7`, `#d97757`, `#b45f42` (`.gradient-text`)
- `src/index.css:296` - Orbit rings animation: `color-mix(in srgb, var(--nebula-accent) 48%, transparent)`
- `src/index.css:1132` - Roadmap tab active: `linear-gradient(135deg, #4f46e5, #0f766e)`
- `src/index.css:2619-2625` - Markdown h1: `linear-gradient(135deg, #667eea, #f093fb)` hardcoded in `.markdown-content h1`
- `src/index.css:2655-2659` - Markdown links: `#667eea` and `#f093fb` hardcoded
- `src/index.css:2815-2830` - Code highlighting colors (light theme variants)

**Light theme gaps:**

- `src/index.css:281` - `.home-orbit-core strong` uses hardcoded `#fff8ee` instead of CSS variable
- `src/index.css:408-414` - `.home-floating-card strong` uses hardcoded `#fff8ee`
- `src/index.css:370-375` - `.home-orbit-node` uses hardcoded `#efe3d3`
- `src/index.css:1182` - `.roadmap-flow-canvas` hardcoded `#1f1e1b` (has light override at line 1187)
- `src/index.css:2742` - `.code-block-shell` hardcoded `#1f1e1b` (has light override at line 2843)
- `src/index.css:706` - Glass card hover shadow uses `rgba(99, 102, 241, 0.15)` directly

**Impact:** Theme toggle (light/dark) does not fully apply to all components. Manual color overrides needed for each hardcoded value.

---

## Content Loading (Glob Approach Limitations)

**Build-time eager loading:**

- **File:** `src/utils/noteLoader.ts:6`
- **Code:** `import.meta.glob('../../content/posts/**/*.md', { eager: true, query: '?raw', import: 'default' })`
- All markdown files bundled at build time - no runtime file system access
- Adding new posts requires full rebuild
- Memory footprint grows with post count
- No lazy loading or pagination of note list

**Repeated parsing:**

- `src/App.tsx:414` (`HomePage`), `src/App.tsx:630` (`NotesPage`), `src/App.tsx:1039` (`NotePage`) all call `getNotes()` or `getNoteBySlug()`
- Each call re-parses ALL markdown files and re-sorts the array
- No memoization or caching at module level
- Performance degrades linearly with post count

**Fix approach:** Implement a note caching layer in `noteLoader.ts` that stores parsed results, or switch to a server-side data fetching pattern with pre-built index.

---

## Resource Configuration Approach

**Documented but unimplemented override pattern:**

- **File:** `src/config/resources.ts:10-12` comments describe `VITE_RESOURCE_<INDEX>_<NAME>_URL=https://new-url.com`
- **Reality:** Only `VITE_RESOURCE_CATEGORIES` and `VITE_LEARNING_ROUTES` full JSON overrides are implemented (lines 146-154)
- Per-item URL override documented but not coded

**Embedded defaults as code:**

- Default resource categories and learning routes are 130+ lines of JSON embedded directly in source
- Changing a single URL requires editing source or providing full JSON override
- No external data file or CMS integration

**Duplicate data source risk:**

- `src/utils/noteData.ts` exports `sampleNotes`, `getNoteBySlug`, `getAllNotes`, `getRandomNote`
- `src/utils/noteLoader.ts` exports `getNotes`, `getNoteBySlug`, `getRelatedNotes`
- `src/App.tsx:14` imports `getNotes, getNoteBySlug, getRandomNote` from `noteLoader.ts`
- `src/App.tsx:2` imports `getRandomNote` from `noteData.ts`
- **Confusion:** Which functions are used where? `noteData.ts` appears to be legacy/sample code
- **Fix approach:** Remove `noteData.ts` if unused, or clearly document its purpose

---

## Type/Interface Gaps

**Unused interfaces:**

- `src/types/index.ts:15-22` defines `NoteFrontmatter` interface
- `src/utils/noteLoader.ts` does NOT use `NoteFrontmatter` - it parses frontmatter into a raw `data: any` object
- No TypeScript enforcement on frontmatter structure

**Note interface usage:**

- `src/types/index.ts:1-13` defines `Note` interface
- `noteLoader.ts` creates Note objects without using this type explicitly (infers from object shape)
- Type consistency relies on convention, not enforcement

---

## Performance Concerns

**Repeated useMemo dependencies on getNotes():**

- `src/App.tsx:1042-1046` - `NotePage` has multiple `useMemo` calls depending on `getNotes()`
- `src/App.tsx:295-305` - `getRelatedNotes` implementation differs from `noteLoader.ts:getRelatedNotes` (different scoring logic)
- Both versions exist and may produce different results

**CSS gradient animations:**

- `src/index.css:2604` - `.gradient-text` has `background-size: 200% 200%` with 8s infinite animation
- Applied to many headings - each instance is a separate animation
- May cause repaint overhead on scroll

---

## Fragile Areas

**React Router slug matching:**

- `src/App.tsx:1770` - Route is `/note/:slug`
- `src/App.tsx:1040` - `useParams<{ slug: string }>()` retrieves slug
- No validation that slug exists before rendering - renders "笔记未找到" UI (line 1075-1085)
- The 404 case works, but no loading state between navigation and resolution

**Regex frontmatter parsing:**

- `src/utils/noteLoader.ts:17` - Frontmatter regex: `/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/`
- Does not handle empty frontmatter (no `---` at all - returns entire content as body)
- Does not handle frontmatter with trailing whitespace after closing `---`
- Malformed frontmatter silently produces wrong output

**Date parsing with fallback:**

- `src/utils/noteLoader.ts:72` - `const date = data.date || new Date().toISOString().split('T')[0];`
- Uses current date for posts without frontmatter date
- Breaks chronological sorting if many posts lack dates

---

## Missing for Production

**No error boundaries** - React errors in any component crash the entire app

**No loading skeletons** - Note list renders empty before `getNotes()` completes (though glob is eager, React render may lag)

**No SEO metadata** - No `<meta>` tag generation per note page (social sharing will show generic data)

**No sitemap** - Static site generation would benefit from `/sitemap.xml`

**No search indexing** - Full-text search is client-side only; search content not available to crawlers

**Favicon/site manifest** - No explicit favicon or manifest found (may exist in `public/`)

---

## What Works Well

- CSS variable-based theming for most core colors - expanding this system is straightforward
- `import.meta.glob` with `?raw` is a clean approach for Vite-based markdown sites
- Separation of `noteLoader.ts` (data) from `App.tsx` (presentation)
- React Router v6 with hooks pattern is idiomatic
- Framer Motion animations are well-integrated with good performance patterns
- Remark plugins (GFM) properly configured for GitHub-flavored markdown

---

*Concerns audit: 2026/05/11*
