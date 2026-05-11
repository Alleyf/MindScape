# Phase 1 Plan: AI Service Layer Foundation

## Phase Goal

Create the foundational AI service layer for Claude API integration with caching and error handling.

## Tasks

### Task 1: Project Setup ✓
- [x] Create `src/services/` directory
- [x] Create `src/types/ai.ts` for AI types
- [x] Add `VITE_CLAUDE_API_KEY` to `.env.example`
- [x] Create `.env` with empty API key placeholder

### Task 2: AI Service Core (`src/services/ai.ts`) ✓
- [x] Define `AIClient` class
- [x] Implement `messages` API endpoint call
- [x] Add streaming support (via queue)
- [x] Implement request queue (rate limiting)

### Task 3: Caching Layer ✓
- [x] Create content hash utility (`src/utils/hash.ts`)
- [x] Implement `AICache` class with localStorage
- [x] Add TTL-based cache invalidation
- [x] Cache key format: `mindscape-ai:{operation}:{content-hash}`

### Task 4: React Hook (`src/hooks/useAI.ts`) ✓
- [x] `useGenerateSummary(note)` hook
- [x] `useExtractKeywords(note)` hook
- [x] `useChat()` hook
- [x] Loading/error states
- [x] Auto-cache on success

### Task 5: Error Handling & Fallback ✓
- [x] API key missing detection
- [x] Network error with retry logic
- [x] Rate limit handling
- [x] Graceful degradation to static content

### Task 6: Integration Points ✓
- [x] Export AI service from `src/services/index.ts`
- [ ] Update `src/App.tsx` to pass AI context if needed (optional for now)

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/types/ai.ts` | Create - AI type definitions |
| `src/services/ai.ts` | Create - Claude API client |
| `src/services/cache.ts` | Create - Caching utilities |
| `src/services/index.ts` | Create - Service exports |
| `src/hooks/useAI.ts` | Create - React hooks |
| `src/utils/hash.ts` | Create - Hash utility |
| `.env.example` | Modify - Add API key |
| `.env` | Create - Local env (gitignored) |

## Verification

1. **Build**: `npm run build` passes
2. **Dev**: `npm run dev` starts without errors
3. **API Test**: With valid key, can call Claude API
4. **Cache Test**: Same content doesn't trigger duplicate API calls
5. **Error Test**: Missing key shows setup UI

## Dependencies

None (pure TypeScript implementation)

## Estimated Effort

- Setup: 10 min
- Core service: 30 min
- Caching: 20 min
- Hooks: 30 min
- Testing: 20 min
- **Total**: ~2 hours
