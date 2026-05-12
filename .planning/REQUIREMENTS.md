# Requirements: MindScape v0.4

**Defined:** 2026-05-12
**Core Value:** AI-Native 创意知识空间

## v1 Requirements

### Data Migration

- [ ] **DATA-01**: 创建 content/config/resources.md，存储 7 个资源分类（AI 编程、前端开发、开发工具、知识管理、学习资源、部署与运维、Agent 工具），格式为 YAML front matter + YAML list
- [ ] **DATA-02**: 创建 content/config/learning-routes.md，存储 3 个学习路线（ai-coding、frontend、knowledge），格式为 YAML front matter + YAML list

### Code Refactor

- [ ] **CODE-01**: 重构 src/config/resources.ts，使用 Vite import.meta.glob 加载 MD 文件，解析 front matter，移除 env var 依赖
- [ ] **CODE-02**: 保持 TypeScript 类型定义不变（ResourceCategory、LearningRoute 接口）

### Configuration

- [ ] **CONFIG-01**: 更新 .env.example，移除 VITE_RESOURCE_CATEGORIES 和 VITE_LEARNING_ROUTES 的注释，添加 MD 文件迁移说明

### Compatibility

- [ ] **COMPAT-01**: 验证所有 URL 链接保持不变、图标 SVG path 一致、数据数量和顺序一致

## Out of Scope

| Feature | Reason |
|---------|--------|
| 前端展示逻辑修改 | 页面组件不需要改动 |
| 新增依赖 | 仅使用已有 gray-matter 或实现简单 parser |
| 笔记加载逻辑修改 | 仅修改资源配置部分 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| CODE-01 | Phase 2 | Pending |
| CODE-02 | Phase 2 | Pending |
| CONFIG-01 | Phase 3 | Pending |
| COMPAT-01 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-12*
*Last updated: 2026-05-12 after initial definition*
