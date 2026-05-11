# Phase 2 Plan: Smart Note Summarization UI

## Phase Goal

Integrate AI summary generation into the note reading experience. Display AI-generated summaries, keywords, and suggested title improvements.

## Tasks

### Task 1: Create AISummaryPanel Component
- [ ] Create `src/components/AISummaryPanel.tsx`
- [ ] Display AI summary with styled container
- [ ] Show AI-recommended keywords with highlight
- [ ] Show improved title suggestion (if available)
- [ ] Loading skeleton state
- [ ] Error state with retry button

### Task 2: Integrate into NotePage
- [ ] Import and use `useGenerateSummary` hook in NotePage
- [ ] Add AISummaryPanel below note header
- [ ] Show loading state while generating

### Task 3: Update AIPanel Tabs
- [ ] Rename existing "隐喻" tab to "摘要"
- [ ] Integrate AI summary into the tab
- [ ] Keep fallback static content for unconfigured API

### Task 4: Add CSS Styles
- [ ] Add `.ai-summary-panel` styles
- [ ] Add `.ai-keyword-tag` highlight styles
- [ ] Add loading skeleton animation

### Task 5: Handle Edge Cases
- [ ] Long summaries (truncate with "read more")
- [ ] API not configured message
- [ ] Network error recovery

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/AISummaryPanel.tsx` | Create - Summary display component |
| `src/components/AIPanel.tsx` | Modify - Update tabs with AI summary |
| `src/App.tsx` | Modify - Integrate hook in NotePage |
| `src/index.css` | Modify - Add AI summary styles |

## UI Design

```
┌─────────────────────────────────────────────┐
│ 🤖 AI 摘要                                 │
├─────────────────────────────────────────────┤
│ 这篇文章讨论了分布式系统的核心概念，包括...   │
│                                             │
│ 关键词: [分布式系统] [一致性] [CAP理论]     │
│                                             │
│ 💡 建议标题: 深入理解分布式系统一致性       │
│                              [刷新 🔄]      │
└─────────────────────────────────────────────┘
```

## Verification

1. **Build**: `npm run build` passes
2. **UI Test**: Summary appears on note page
3. **Loading**: Skeleton shows while generating
4. **Cache**: Same note doesn't regenerate
5. **Error**: Shows error state if API fails

## Dependencies

- Phase 1 completed (AI service layer)
- `useGenerateSummary` hook available
