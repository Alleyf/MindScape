# 项目任务分解规划：文章优先级排序功能

## 已明确的决策

- **排序核心逻辑**：当前仅按 `createdAt` 日期倒序排列（`noteLoader.ts:108`）
- **Frontmatter 解析**：使用自定义 YAML 解析逻辑，不依赖重型库
- **前端框架**：React + TypeScript + Vite
- **内容加载**：通过 Vite `import.meta.glob` 静态导入

---

## 整体规划概述

### 项目目标

为 MindScape 博客添加 `priority`（优先级）字段支持，允许编辑者在 frontmatter 中为文章指定优先级，实现以下排序逻辑：

1. **优先级数值越小，排序越靠前**（如 `priority: 1` 比 `priority: 5` 排名更前）
2. **同优先级下，按日期倒序排列**（保持当前行为）
3. **未指定优先级的文章默认值为 `Infinity`**，排在有优先级值的文章之后

### 技术栈

- **语言**：TypeScript
- **内容格式**：Markdown + YAML Frontmatter
- **解析**：自定义 `parseFrontMatter` 函数（`noteLoader.ts`）
- **前端**：React + React Router

### 主要阶段

1. **类型定义阶段** - 扩展 `Note` 和 `NoteFrontmatter` 接口
2. **解析与排序阶段** - 修改 frontmatter 解析和排序逻辑
3. **展示优化阶段** - 可选：UI 上突出显示高优先级文章

---

## 详细任务分解

### 阶段 1：类型定义扩展

#### 任务 1.1：扩展 `Note` 接口

- **目标**：在 `Note` 接口中添加 `priority` 字段
- **输入**：当前 `src/types/index.ts`
- **输出**：添加 `priority?: number` 字段
- **涉及文件**：
  - `src/types/index.ts`（第 1-14 行）
- **预估工作量**：5 分钟

```typescript
// src/types/index.ts
export interface Note {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  mood?: string;
  personality?: string;
  aiSubtitle?: string;
  cover?: string;
  priority?: number;  // 新增字段
}
```

#### 任务 1.2：扩展 `NoteFrontmatter` 接口

- **目标**：在 `NoteFrontmatter` 接口中添加 `priority` 字段
- **输入**：当前 `src/utils/noteLoader.ts`（第 16-25 行）
- **输出**：添加 `priority?: number` 字段
- **涉及文件**：
  - `src/utils/noteLoader.ts`
- **预估工作量**：5 分钟

```typescript
// src/utils/noteLoader.ts
export interface NoteFrontmatter {
  title: string;
  tags?: string[];
  date?: string;
  mood?: string;
  aiSubtitle?: string;
  personality?: string;
  description?: string;
  cover?: string;
  priority?: number;  // 新增字段
}
```

---

### 阶段 2：解析与排序逻辑修改

#### 任务 2.1：修改 frontmatter 解析逻辑

- **目标**：确保 `parseFrontMatter` 函数能正确解析 `priority` 数值
- **输入**：当前 `parseFrontMatter` 函数（`noteLoader.ts` 第 25-64 行）
- **输出**：数值类型的 `priority` 字段
- **涉及文件**：
  - `src/utils/noteLoader.ts`
- **预估工作量**：10 分钟

**当前解析逻辑分析**：
- 当前解析器对数值的处理是去除引号后直接赋值
- 对于 `priority: 1` 这样的数值，会被正确解析为数字
- 需要验证边界情况：`priority: false` 或空值

**实现要点**：
- 如果 `data.priority` 存在且为有效数值，保留为数类型
- 如果 `data.priority` 为空、无效或未定义，则不设置

#### 任务 2.2：修改排序逻辑

- **目标**：更新 `getNotes()` 函数中的排序规则
- **输入**：当前排序逻辑（`noteLoader.ts` 第 107-108 行）
- **输出**：按 priority 升序、然后按 createdAt 降序排列
- **涉及文件**：
  - `src/utils/noteLoader.ts`
- **预估工作量**：10 分钟

**当前代码**：
```typescript
// 按日期倒序排列
return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
```

**修改为**：
```typescript
// 按优先级升序（小值在前），同优先级按日期倒序
return notes.sort((a, b) => {
  const priorityA = a.priority ?? Infinity;
  const priorityB = b.priority ?? Infinity;
  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
});
```

---

### 阶段 3：数据模型一致性

#### 任务 3.1：更新 noteData.ts（如需要）

- **目标**：确保 `noteData.ts` 中的 `getAllNotes` 函数使用相同的排序逻辑
- **输入**：当前 `src/utils/noteData.ts`（第 331-335 行）
- **输出**：统一排序逻辑
- **涉及文件**：
  - `src/utils/noteData.ts`
- **预估工作量**：10 分钟

**注意**：`noteData.ts` 似乎是示例数据文件，实际生产使用 `noteLoader.ts`。如果示例数据也需要优先级支持，则需要修改。

---

### 阶段 4：前端展示优化（可选）

#### 任务 4.1：UI 展示优先级标识

- **目标**：在高优先级文章的卡片上显示视觉标识
- **输入**：`NoteCard` 组件（`src/components/NoteCard.tsx`）
- **输出**：可选的优先级徽章或高亮效果
- **涉及文件**：
  - `src/components/NoteCard.tsx`
- **预估工作量**：30 分钟（UI 设计 + 实现）
- **优先级**：可选，建议在核心功能稳定后再实现

**设计建议**（由 UI/UX Agent 提供）：
- 高优先级文章（priority <= 3）显示"置顶"或"推荐"徽章
- 卡片边框添加特殊光晕效果
- 列表视图中显示优先级序号

---

## 需要进一步明确的问题

### 问题 1：优先级数值语义定义

**推荐方案**：

- **方案 A**：数值越小优先级越高（`priority: 1` 为最高优先级）
  - 优点：直觉性强，符合常见排序习惯
  - 缺点：无

- **方案 B**：数值越大优先级越高（`priority: 100` 为最高优先级）
  - 优点：可以方便地用 0-100 百分比概念
  - 缺点：与大多数 CMS 的习惯相反

**等待用户选择**：

```
请选择您偏好的优先级语义：
[ ] 方案 A：数值越小优先级越高（1 > 2 > 3 > ...）
[ ] 方案 B：数值越大优先级越高（100 > 50 > 10 > ...）
[ ] 其他方案：___________
```

### 问题 2：UI 展示策略

**推荐方案**：

- **方案 A**：静默展示（仅改变排序，不添加视觉标识）
  - 优点：实现简单，用户无额外认知负担
  - 缺点：用户无法直观看出哪些文章有优先级设置

- **方案 B**：添加视觉标识（徽章/边框高亮）
  - 优点：突出重要文章，增强可读性
  - 缺点：需要额外的 UI 工作，可能影响现有设计

**等待用户选择**：

```
请选择 UI 展示策略：
[ ] 方案 A：静默展示（仅改变排序）
[ ] 方案 B：添加视觉标识（徽章/边框高亮）
[ ] 方案 C：两者都要（可配置开关）
```

### 问题 3：关于 noteData.ts 的处理

**问题**：项目中存在 `src/utils/noteData.ts` 文件，包含示例数据。是否需要同步更新该文件的排序逻辑？

**等待用户选择**：

```
请确认是否需要同步更新 noteData.ts：
[ ] 需要更新（保持示例数据一致性）
[ ] 不需要（noteData.ts 是废弃/备用文件）
```

---

## 验收标准

### 功能验收

1. **类型检查通过**：修改后的 TypeScript 编译无错误
2. **Frontmatter 解析正确**：
   - `priority: 1` 被正确解析为数字 `1`
   - 未指定 `priority` 的文章 `priority` 字段为 `undefined`
3. **排序逻辑正确**：
   - 指定 `priority` 的文章排在未指定 priority 的文章之前
   - 同 priority 值时，按日期倒序排列
4. **向后兼容**：不指定 priority 的现有文章不受影响

### 测试场景

1. 新增一篇指定 `priority: 1` 的文章，验证它排在列表首位
2. 多篇文章设置相同 priority，验证它们之间按日期倒序
3. 混合场景：部分文章有 priority，部分没有，验证正确的排序
4. 指定高 priority 值（如 100），验证其排在低 priority 值（如 1）之后

### 示例 Frontmatter

```yaml
---
title: "Spring"
date: "2026-03-08"
tags: ["Spring"]
personality: "引路人"
description: "Spring 框架学习笔记"
cover: "/images/covers/ms-d2fd2873.svg"
priority: 1  # 最高优先级
---
```

---

## 用户反馈区域

请在此区域补充您对整体规划的意见和建议：

```
用户补充内容：

---

---

---

```
