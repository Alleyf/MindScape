# Emoji 替换为图标库 - 项目规划

## 已明确的决策

- **图标库选择**: lucide-react (Tree-Shakable, 轻量, TypeScript 优先, 活跃维护)
- **安装命令**: `npm install lucide-react`
- **样式规范**: 所有图标使用 Tailwind CSS 样式类 (如 `w-5 h-5`, `text-nebula-accent`)

## 整体规划概述

### 项目目标

将 MindScape 项目中所有 UI 相关的 emoji 替换为 lucide-react 图标库中的对应图标，提升视觉一致性和可维护性。

### 技术栈

- 图标库: lucide-react
- 样式: Tailwind CSS (项目已集成)
- 依赖: 无需额外安装 Tailwind 插件

### 主要阶段

1. **阶段 1**: 安装 lucide-react 并创建图标映射配置
2. **阶段 2**: 替换 src/components/ 下的 UI emoji
3. **阶段 3**: 替换 src/utils/ 和数据中的默认 emoji
4. **阶段 4**: 验证与测试

---

## 详细任务分解

### 阶段 1：安装 lucide-react 并创建图标映射配置

#### 任务 1.1：安装 lucide-react

- **目标**: 在项目中安装 lucide-react 图标库
- **输入**: package.json
- **输出**: 已安装 lucide-react
- **涉及文件**:
  - `package.json`
  - `package-lock.json`
- **预估工作量**: 5 分钟

#### 任务 1.2：创建图标映射配置文件

- **目标**: 创建统一的 emoji 到图标映射配置，便于维护和扩展
- **输入**: 无
- **输出**: 创建 `src/config/icons.ts` 配置文件
- **涉及文件**:
  - 新建 `src/config/icons.ts`
- **预估工作量**: 15 分钟

**图标映射表**:

| Emoji | Lucide Icon | 用途说明 |
|-------|-------------|----------|
| ✨ | `Star` | 星光、默认 mood |
| 🌟 | `Star` | 星光、高亮 mood 备选 |
| ✦ | `Star` (或 `Sparkles`) | AI 副标题前缀 |
| 🌱 | `Sprout` | 成长、初生生机 |
| 🌿 | `Leaf` | 自然、生机 |
| 🌙 | `Moon` | 月亮、夜间、沉思 |
| 🔗 | `Link` | 链接、联想 |
| 🎭 | `Mask` | 隐喻、人格面具 |
| 🎪 | `Tent` 或 `Sparkles` | 人格展示 |
| 🔄 | `RefreshCw` | 刷新 |
| 💡 | `Lightbulb` | 建议、灵感 |
| 🎵 | `Music` | 音乐 |
| 🎨 | `Palette` | 艺术、绘画 |
| 🍂 | `Leaf` (或 `Fall`) | 凋零、落叶 |
| 🦉 | `Bird` 或 `Moon` | 沉思者人格 |
| 🧭 | `Compass` | 引路人人格 |
| 🤖 | `Bot` | AI、未来主义者人格 |
| ⚡ | `Zap` | 高能量、闪电 |

---

### 阶段 2：替换 src/components/ 下的 UI emoji

#### 任务 2.1：替换 AIPanel.tsx 中的 emoji

- **目标**: 将 AIPanel.tsx 中的所有 emoji 替换为 lucide-react 图标
- **输入**: `src/components/AIPanel.tsx`
- **输出**: 修改后的 `src/components/AIPanel.tsx`
- **涉及组件**:
  - Tab headers: `🎭 隐喻` → `Mask` 图标 + 文字
  - Tab headers: `🔗 联想` → `Link` 图标 + 文字
  - Tab headers: `🎪 人格` → `Tent` 图标 + 文字
  - mood 显示: `{note.mood || '🌟'} 沉思` → `Star` 图标 + 文字
  - 能量标签: `⚡ 高能量` → `Zap` 图标 + 文字
  - 人格 emoji: `🦉`, `🧭`, `🌱`, `🤖`, `🌙` → 对应图标
- **预估工作量**: 20 分钟

**UI 样式建议** (通过 ui-ux-designer agent 确认):
- 图标尺寸: `w-4 h-4` 或 `w-5 h-5`
- 图标颜色: `text-nebula-accent`
- 与文字间距: `mr-1` 或 `ml-1`

#### 任务 2.2：替换 AISummaryPanel.tsx 中的 emoji

- **目标**: 将 AISummaryPanel.tsx 中的所有 emoji 替换为 lucide-react 图标
- **输入**: `src/components/AISummaryPanel.tsx`
- **输出**: 修改后的 `src/components/AISummaryPanel.tsx`
- **涉及组件**:
  - AI 图标: `🤖` → `Bot` 图标
  - 刷新按钮: `🔄` → `RefreshCw` 图标
  - 建议标签: `💡 建议标题` → `Lightbulb` 图标 + 文字
- **预估工作量**: 15 分钟

#### 任务 2.3：替换 NoteCard.tsx 中的 emoji

- **目标**: 将 NoteCard.tsx 中的 mood emoji 和 AI 副标题前缀替换为图标
- **输入**: `src/components/NoteCard.tsx`
- **输出**: 修改后的 `src/components/NoteCard.tsx`
- **涉及组件**:
  - mood 显示: `{note.mood}` → 使用 mood 图标映射渲染
  - AI 副标题前缀: `✦ {note.aiSubtitle}` → `Sparkles` 图标 + 文字
- **预估工作量**: 15 分钟

**NoteCard mood 图标映射逻辑**:

```typescript
// 建议在 icons.ts 中添加 moodIcons 映射
const moodIcons: Record<string, Icon> = {
  '✨': Star,
  '🌟': Star,
  '🌙': Moon,
  '🌱': Sprout,
  '⚡': Zap,
  '🤖': Bot,
};
```

#### 任务 2.4：替换 RandomWalkButton.tsx 中的 emoji

- **目标**: 将 RandomWalkButton.tsx 中旋转动画的 emoji 替换为图标
- **输入**: `src/components/RandomWalkButton.tsx`
- **输出**: 修改后的 `src/components/RandomWalkButton.tsx`
- **涉及组件**:
  - 旋转动画图标: `✨` 和 `🌟` → `Sparkles` 或 `Star` 图标
- **预估工作量**: 10 分钟

---

### 阶段 3：替换 src/utils/ 和 App.tsx 中的 emoji

#### 任务 3.1：替换 noteLoader.ts 中的默认 mood

- **目标**: 将 noteLoader.ts 中的默认 emoji 替换为图标组件或文字标签
- **输入**: `src/utils/noteLoader.ts`
- **输出**: 修改后的 `src/utils/noteLoader.ts`
- **涉及组件**:
  - 第 100 行: `mood: data.mood || '✨'` → `mood: data.mood || 'Star'` (或保持字符串 'Star')
- **重要说明**:
  - noteLoader 只负责数据加载，不渲染 UI
  - 建议将默认值从 emoji 改为图标名称字符串，便于 UI 层统一映射
  - 或者保持 '✨' 不变，在 NoteCard 等组件中处理映射
- **预估工作量**: 5 分钟

#### 任务 3.2：替换 App.tsx 中的静态 emoji

- **目标**: 将 App.tsx 中 About 页面使用的静态 emoji 替换为图标
- **输入**: `src/App.tsx` (第 1827, 1838 行附近)
- **输出**: 修改后的 `src/App.tsx`
- **涉及组件**:
  - "这里记录什么" 标题旁: `🌱` → `Sprout` 图标
  - "如何浏览" 标题旁: `🧭` → `Compass` 图标
- **预估工作量**: 10 分钟

---

### 阶段 4：验证与测试

#### 任务 4.1：运行开发服务器验证

- **目标**: 确保替换后项目正常运行，无编译错误
- **输入**: 完整的代码修改
- **输出**: 开发服务器正常运行
- **验证命令**:
  ```bash
  npm run dev
  ```
- **预估工作量**: 5 分钟

#### 任务 4.2：检查所有页面确认图标显示

- **目标**: 确认所有页面图标正常显示，布局正确
- **输入**: 浏览器中浏览各页面
- **输出**: 无视觉问题
- **涉及页面**:
  - 首页 (HomePage)
  - 笔记列表页 (NotesPage)
  - 标签页 (TagsPage)
  - 单篇笔记页 (NotePage) - 包含 AIPanel
  - 关于页 (AboutPage)
- **预估工作量**: 15 分钟

---

## 需要进一步明确的问题

### 问题 1：mood 字段的数据类型处理

**背景**: noteLoader.ts 中 mood 字段存储为字符串 (如 '✨', '🌙')。NoteCard 和 AIPanel 组件直接渲染这个字符串。

**推荐方案**:

- **方案 A**: 保持 mood 字段为字符串，将 emoji 值改为图标名称 (如 'Star', 'Moon')
  - 优点: 数据层改动小，只需修改 noteData.ts 中的示例数据
  - 缺点: 与现有 front matter 不兼容 (用户博客数据中仍用 emoji)

- **方案 B**: 在 UI 组件层添加 emoji → Icon 映射转换
  - 优点: 用户 front matter 中的 emoji 不需要改动
  - 缺点: 需要在多个组件中添加映射逻辑

- **方案 C**: 创建统一的 mood 配置 `src/config/moods.ts`，包含 emoji、图标、颜色等元数据
  - 优点: 最灵活，支持丰富的 mood 表达
  - 缺点: 需要重构较多代码

**等待用户选择**:

```
请选择您偏好的方案：
[ ] 方案 A: 将 mood 值改为图标名称 ('Star', 'Moon')
[ ] 方案 B: 在 UI 层添加 emoji → Icon 映射
[ ] 方案 C: 创建统一的 mood 配置文件
[ ] 其他方案：___________
```

### 问题 2：AI 人格 emoji 的替换策略

**背景**: AIPanel.tsx 中 personality 显示使用了 5 种不同的 emoji (🦉, 🧭, 🌱, 🤖, 🌙)。

**推荐方案**:

在 `src/config/icons.ts` 中添加 personalityIcons 映射：

```typescript
export const personalityIcons: Record<string, Icon> = {
  '沉思者': Bird,    // 或 Owl (如果 lucide 有)
  '引路人': Compass,
  '园丁': Sprout,
  '未来主义者': Bot,
  '陪伴者': Moon,
};
```

**等待用户确认**:

```
是否同意上述 personality 图标映射？
[ ] 是，使用推荐的映射
[ ] 否，建议调整为：___________
```

---

## 验收标准

### 功能验收

- [ ] `npm install lucide-react` 成功执行
- [ ] `npm run dev` 无编译错误
- [ ] 首页"这里记录什么"部分显示 Sprout 图标
- [ ] 首页"如何浏览"部分显示 Compass 图标
- [ ] 笔记卡片显示 mood 图标 (替代原来的 emoji)
- [ ] 笔记卡片 AI 副标题前缀显示 Sparkles 图标
- [ ] AIPanel 三个 Tab 分别显示 Mask, Link, Tent 图标
- [ ] AIPanel 中 mood 显示为 Star 图标
- [ ] AIPanel 中高能量标签显示 Zap 图标
- [ ] AIPanel 中人格展示显示对应图标
- [ ] AISummaryPanel 中 AI 图标显示 Bot 图标
- [ ] AISummaryPanel 中刷新按钮显示 RefreshCw 图标
- [ ] AISummaryPanel 中建议标题显示 Lightbulb 图标
- [ ] RandomWalkButton 中显示旋转的 Sparkles/Star 图标

### 视觉验收

- [ ] 所有图标尺寸一致 (建议 `w-5 h-5`)
- [ ] 图标颜色使用 `text-nebula-accent` 或主题色
- [ ] 图标与文字间距适当
- [ ] 暗色/亮色主题下图标均清晰可见
- [ ] 动画效果 (如 RandomWalkButton) 正常工作

### 代码质量验收

- [ ] 所有图标从 lucide-react 导入
- [ ] 无残留的 emoji 字符 (仅保留在 noteData.ts 示例数据中)
- [ ] 图标映射配置集中管理在 `src/config/icons.ts`
- [ ] TypeScript 类型安全 (正确导入 Icon 类型)

---

## 用户反馈区域

请在此区域补充您对整体规划的意见和建议：

```
用户补充内容：

---

---

---
```
