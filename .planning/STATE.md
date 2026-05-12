# Milestone State

**Current Milestone:** v0.4 — 资源配置 MD 化

## Task

将资源配置从环境变量迁移到 MD 文件：
- 创建 content/config/resources.md
- 创建 content/config/learning-routes.md
- 重构 src/config/resources.ts 从 MD 文件加载
- 移除环境变量依赖

## Status

- [ ] 需求分析完成
- [ ] 制定详细计划
- [ ] Phase 1: 数据迁移设计
- [ ] Phase 2: MD 文件创建
- [ ] Phase 3: 加载逻辑重构
- [ ] Phase 4: 向后兼容验证

## Tech Requirements

- Vite import.meta.glob 或 fetch 加载 MD 文件
- Front matter 解析（gray-matter 或自定义）
- 类型安全保持
- 向后兼容 URL 和格式

## Notes

待定...
