# v0.3 — AI 功能接入 Requirements

## Overview

使用 Claude API 为 MindScape 注入真正的 AI 能力，将现有的静态数据替换为智能生成内容。

## AI Provider

- **Provider**: Claude API (Anthropic)
- **Model**: claude-sonnet-4-20250514 (性价比平衡)
- **Config**: 环境变量 `VITE_CLAUDE_API_KEY`

---

## Req-1: AI 服务层

### Description

创建统一的 AI 服务层，封装 Claude API 调用。

### Details

- `src/services/ai.ts` — AI 服务核心模块
- API key 从环境变量读取 (`VITE_CLAUDE_API_KEY`)
- 实现请求缓存（基于内容 hash）
- 错误处理和降级策略
- 加载状态管理

### Acceptance Criteria

- [ ] Claude API 正确调用
- [ ] 相同内容不会重复请求
- [ ] API key 未配置时有友好提示
- [ ] 网络错误时优雅降级

---

## Req-2: 智能笔记摘要

### Description

阅读笔记时，AI 自动生成摘要、关键词、改进标题。

### Details

- **自动摘要**: 读取笔记时调用 AI 生成 2-3 句话摘要
- **关键词提取**: 自动提取 3-5 个标签关键词
- **标题优化**: 建议更吸引人的标题（可选采纳）
- **存储策略**: 摘要存储到 localStorage，避免重复生成

### UI Changes

- 笔记顶部显示 AI 生成的摘要
- 标签区显示 AI 推荐的关键词（高亮提示）

### Acceptance Criteria

- [ ] 笔记阅读时自动显示 AI 摘要
- [ ] 摘要加载中有 skeleton 占位
- [ ] 同一笔记不重复调用 API
- [ ] 摘要可手动刷新

---

## Req-3: 笔记间关联发现

### Description

AI 分析笔记内容，发现语义上的隐藏关联，而非仅依赖标签匹配。

### Details

- **语义分析**: 分析笔记核心内容，识别主题相似性
- **关联评分**: 计算笔记间关联强度（0-100%）
- **智能推荐**: 基于语义而非标签推荐相关笔记
- **图谱增强**: 在知识图谱中显示 AI 发现的额外连接

### UI Changes

- 相关笔记区域显示 "AI 发现" 标签
- 图谱中虚线表示 AI 发现的关联

### Acceptance Criteria

- [ ] 相关笔记推荐更智能（不仅是标签匹配）
- [ ] 显示关联原因（"两篇笔记都讨论了分布式系统"）
- [ ] 可配置关联发现深度

---

## Req-4: AI 写作助手

### Description

阅读笔记时可随时呼出 AI 助手，提供解释、答疑、翻译。

### Details

- **浮动按钮**: 笔记阅读页面右下角 AI 助手入口
- **对话界面**: 侧边抽屉式对话窗口
- **上下文感知**: AI 能理解当前笔记内容
- **快捷指令**: 一键解释代码、翻译段落、总结要点

### UI Changes

- 新增 "AI 助手" 浮动按钮
- 侧边抽屉对话界面
- 选中文字后显示 "让 AI 解释" 气泡

### Acceptance Criteria

- [ ] 可呼出 AI 对话界面
- [ ] AI 理解当前笔记上下文
- [ ] 支持代码解释、翻译、答疑
- [ ] 对话历史保存（session 内）

---

## Req-5: 性能与缓存

### Description

确保 AI 功能不影响页面性能。

### Details

- **请求缓存**: 相同内容 hash 缓存结果
- **预加载**: 首页预加载高频访问笔记的摘要
- **流式输出**: 使用 Claude streaming 提升体验
- **降级策略**: API 不可用时回退到静态数据

### Acceptance Criteria

- [ ] AI 响应时间 < 5s（95 分位）
- [ ] 缓存命中时不调用 API
- [ ] API 错误不影响页面加载

---

## Non-Functional Requirements

### Security
- API key 仅用于前端调用，不暴露敏感操作
- 不在后端存储用户数据

### Privacy
- 笔记内容发送到 Claude API（需用户知情）
- 考虑添加 "仅本地模式" 选项

### UX
- 所有 AI 功能需要明显的加载状态
- AI 生成内容用不同样式区分（如斜体 + 边框）
- 提供关闭 AI 功能的选项

---

## Out of Scope (v0.3)

- 后端代理（API key 直接暴露给前端）
- 多用户支持
- AI 生成笔记
- 实时协作
