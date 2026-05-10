# 📝 MindScape 写作指南

## 快速上手：3 步创建你的第一篇笔记

### 步骤 1：创建 Markdown 文件

在 `content/posts/` 目录下创建一个新文件，文件名就是笔记的 URL slug。

```bash
# 例如创建一个关于 TypeScript 的笔记
content/posts/typescript-basics.md
```

### 步骤 2：添加 Front Matter（元数据）

在文件**最开头**添加 YAML 格式的元数据，用 `---` 包裹：

```yaml
---
title: "TypeScript 入门指南"
date: "2024-01-25"
tags: ["typescript", "javascript", "tutorial", "frontend"]
personality: "guide"
description: "从零开始学习 TypeScript 的核心概念"
---
```

#### Front Matter 字段说明

| 字段 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `title` | ✅ | 笔记标题 | `"React Hooks 深度探索"` |
| `date` | ✅ | 发布日期 (YYYY-MM-DD) | `"2024-01-25"` |
| `tags` | ✅ | 标签数组（用于智能联想） | `["react", "hooks"]` |
| `personality` | ❌ | 笔记人格（默认 owl） | `owl`, `guide`, `gardener`, `futurist`, `companion` |
| `description` | ❌ | 简短描述（显示在标题下方） | `"深入理解 Hooks 的设计哲学"` |

#### Personality 人格类型

- `owl` 🦉 - 沉思者：深度思考、哲学探索、理论分析
- `guide` 🧭 - 引路人：教程、指南、操作手册
- `gardener` 🌱 - 园丁：成长记录、反思日记、学习笔记
- `futurist` 🤖 - 未来主义者：科技前沿、创新想法、趋势预测
- `companion` 🌙 - 陪伴者：日常感悟、生活随笔、情感记录

### 步骤 3：撰写 Markdown 内容

Front Matter 之后就是你的正文内容，支持完整的 Markdown 语法：

```markdown
# 主标题

这是一段普通文本，支持 **粗体**、*斜体*、~~删除线~~。

## 二级标题

### 三级标题

#### 列表

无序列表：
- 项目一
- 项目二
  - 子项目
  - 子项目

有序列表：
1. 第一步
2. 第二步
3. 第三步

#### 引用

> 这是一段引用文字
> 
> —— 某位名人

#### 代码块

行内代码：使用 `const x = 1` 来定义常量。

代码块（带语法高亮）：

\`\`\`javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
\`\`\`

#### 表格

| 姓名 | 年龄 | 职业 |
|------|------|------|
| Alice | 25 | 工程师 |
| Bob | 30 | 设计师 |
| Carol | 28 | 产品经理 |

#### 链接

[外部链接](https://example.com)

[内部链接](./another-note.md)
```

## 💡 写作技巧

### 1. 善用标签

标签是 AI 智能联想的基础。建议：
- 每篇笔记 3-5 个标签
- 包含通用标签（如 `javascript`）和具体标签（如 `useEffect`）
- 保持标签一致性

### 2. 结构化内容

- 使用清晰的标题层级
- 多用列表和表格整理信息
- 代码示例要完整可运行
- 关键概念加粗强调

### 3. 添加个人色彩

- 在引用块中写下你的感悟
- 记录你遇到的问题和解决方案
- 分享你的思考过程，不只是结论

---

现在，开始你的创意写作之旅吧！🎨✨
