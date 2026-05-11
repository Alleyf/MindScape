# Phase 1 Research: AI Service Layer

## Context

- Project: MindScape (React 19 + TypeScript + Vite)
- Goal: Integrate Claude API for AI features
- Phase: 1 - AI Service Layer Foundation

## Claude API Integration

### API Endpoint
```
POST https://api.anthropic.com/v1/messages
Headers:
  x-api-key: {API_KEY}
  anthropic-version: 2023-06-01
  content-type: application/json
```

### Key Considerations

1. **Streaming**: Use `stream: true` for better UX (real-time token display)
2. **Model**: `claude-sonnet-4-20250514` for balance of speed/cost/quality
3. **Max Tokens**: 1024-2048 for summaries, 4096 for conversational

### Request Shape
```typescript
interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  system?: string; // System prompt for context
  stream?: boolean;
}
```

## Caching Strategy

### Content-based Hash
```typescript
// Hash note content to create cache key
const cacheKey = `ai:${type}:${hashString(note.content)}`;
// Store in localStorage with TTL
```

### Cache Structure
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}
```

## Error Handling

1. **API Key Missing**: Show setup instructions
2. **Network Error**: Retry with exponential backoff (3 attempts)
3. **Rate Limit**: Queue requests, show "AI busy" indicator
4. **Invalid Response**: Fallback to static content

## Project Patterns

### Existing Hooks
- `useEffects.ts` - Custom React hooks

### Existing Types
- `Note` interface in `src/types/index.ts`

### Config Pattern
- Environment variables with `VITE_` prefix
- `.env` file gitignored

## Implementation Approach

### File Structure
```
src/
├── services/
│   └── ai.ts           # Main AI service
├── hooks/
│   └── useAI.ts        # React hook for AI features
└── types/
    └── ai.ts           # AI-related types
```

### Key Functions
1. `generateSummary(note: Note): Promise<string>`
2. `extractKeywords(note: Note): Promise<string[]>`
3. `findConnections(notes: Note[]): Promise<Connection[]>`
4. `chat(message: string, context: Note): Promise<string>`
