# External Integrations

**Analysis Date:** 2026/05/11

## APIs & External Services

**Link Preview:**
- **Microlink API** - Fetches metadata (title, description, image, publisher) for external URLs referenced in notes
  - Endpoint: `https://api.microlink.io/?url={encoded_url}`
  - Config var: `VITE_MICROLINK_API_URL`
  - Default: `https://api.microlink.io/?url=`
  - Usage: `src/config/resources.ts` line 156 - `fetchLinkPreviewMetadata()` in `src/App.tsx` fetches `${MICROLINK_API_URL}${encodeURIComponent(url)}`
  - Fallback: SVG-generated cover card if API fails

**Favicon Service:**
- **Yandex Favicon API** - Retrieves favicon images for resource links
  - Endpoint: `https://favicon.yandex.net/favicon/{hostname}`
  - Config var: `VITE_FAVICON_YANDEX_URL`
  - Default: `https://favicon.yandex.net/favicon/`
  - Usage: `src/App.tsx` line 1422 - renders as `<img src={${FAVICON_YANDEX_URL}${getHostname(item.url)}}>` in the Resources page

## Data Storage

**Note Content:**
- **Local filesystem** - Markdown files stored in `content/posts/*.md`
- Parsed at runtime via `gray-matter` (frontmatter) and `remark` (body content)
- No database; notes are file-based and loaded via `src/utils/noteLoader.ts`

**Static Assets:**
- `public/` directory for committed static assets

## Authentication & Identity

**No external auth** - This is a personal knowledge site with no user authentication.

## Monitoring & Observability

**Error Tracking:**
- None configured

**Logs:**
- Browser console logging only (no external log service)

## CI/CD & Deployment

**Hosting:**
- Vercel - See `vercel.json` configuration
- Deployment trigger: push to main branch

**CI Pipeline:**
- None explicitly configured (Vercel handles build/deploy automatically)

## Environment Configuration

**Required env vars (none required):**
- All env vars have defaults in `src/config/resources.ts`
- Override via `.env.local` (git-ignored) or `.env` for local development

**Configurable variables:**
| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_MICROLINK_API_URL` | `https://api.microlink.io/?url=` | Link metadata fetching |
| `VITE_FAVICON_YANDEX_URL` | `https://favicon.yandex.net/favicon/` | Favicon retrieval |
| `VITE_RESOURCE_CATEGORIES` | (embedded JSON) | Resource library data |
| `VITE_LEARNING_ROUTES` | (embedded JSON) | Learning roadmap data |

## Webhooks & Callbacks

**Incoming webhooks:** None

**Outgoing:** None

## MCP & External Tools

**MCP (Model Context Protocol):** Not used

**No external AI integrations** - The app renders notes and provides UI for browsing; no AI generation at runtime.

## GitHub Integration

**Source code link:**
- GitHub repository: `https://github.com/Alleyf/MindScape`
- Linked in navigation footer (`src/App.tsx` line 1747)
