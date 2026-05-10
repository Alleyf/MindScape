# 🚀 MindScape - AI-Native 创意 WikiBlog

一个令人惊艳的 AI-Native 个人知识库系统，将 Markdown 笔记转化为充满创意和美学体验的思维宇宙。

## ✨ 核心特性

### 🎨 视觉奇观
- **粒子场背景**：动态星云粒子效果，营造沉浸式思维空间
- **鼠标光晕追踪**：跟随鼠标移动的柔和光晕，增强交互感
- **玻璃拟态设计**：半透明磨砂玻璃效果，现代感十足
- **渐变色彩系统**：紫色→蓝色→青色的梦幻渐变

### 🤖 AI 增强功能
- **AI 隐喻面板**：为每篇笔记生成诗意的隐喻描述
- **智能联想**：自动发现笔记间的隐藏连接
- **笔记人格化**：赋予每篇笔记独特的性格标签（沉思者🦉、引路人🧭、园丁🌱等）
- **情绪能量分析**：可视化展示笔记的情感基调

### 🎪 创意交互
- **随机漫步按钮**：像探索宇宙一样随机跳转到另一篇笔记
- **动态动画**：使用 Framer Motion 实现流畅的页面过渡
- **响应式布局**：完美适配桌面和移动设备

## 📦 快速启动

### 方式一：直接启动（推荐）

```bash
cd /workspace/mindscape
npm run dev
```

服务器将在 http://localhost:3000 启动

### 方式二：指定端口

```bash
cd /workspace/mindscape
npm run dev -- --port 5173
```

## 🎯 使用演示

### 1. 首页浏览
- 访问 http://localhost:3000
- 欣赏动态粒子背景和渐变标题动画
- 点击"探索思维宇宙"进入笔记列表

### 2. 阅读笔记
- 在笔记列表页浏览所有文章卡片
- 点击任意卡片进入详情
- 观察右侧的 **AI 面板**（仅桌面端显示）：
  - 🎭 **隐喻**：查看 AI 生成的诗意描述
  - 🔗 **联想**：发现与其他笔记的连接
  - 🎪 **人格**：了解这篇笔记的性格特质

### 3. 创意导航
- 在笔记底部点击 **"随机漫步"** 按钮
- 体验像宇宙漫游一样的知识探索
- 每次点击都会跳转到一篇随机笔记

### 4. 添加新笔记

编辑 `src/utils/noteData.ts`，添加新的 Note 对象：

```typescript
{
  id: '6',
  slug: 'your-note-slug',
  title: '你的笔记标题',
  content: `# 你的内容\n\n正文...`,
  excerpt: '简短摘要...',
  tags: ['标签 1', '标签 2'],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  mood: '🌟',
  personality: '沉思者', // 可选：沉思者/引路人/园丁/未来主义者/陪伴者
  aiSubtitle: 'AI 生成的副标题'
}
```

## 🛠️ 技术栈

- **React 19** - 最新 React 版本
- **Vite 8** - 极速开发构建工具
- **Framer Motion** - 流畅的动画库
- **React Router** - 页面路由
- **Tailwind CSS** - 原子化 CSS 框架
- **TypeScript** - 类型安全

## 📁 项目结构

```
mindscape/
├── src/
│   ├── components/
│   │   ├── AIPanel.tsx       # AI 增强面板（核心创意组件）
│   │   ├── MouseGlow.tsx     # 鼠标光晕效果
│   │   ├── NoteCard.tsx      # 笔记卡片组件
│   │   ├── ParticleField.tsx # 粒子场背景
│   │   └── RandomWalkButton.tsx # 随机漫步按钮
│   ├── hooks/
│   │   └── useEffects.ts     # 自定义 Hooks
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   ├── utils/
│   │   └── noteData.ts       # 笔记数据（在此添加新笔记）
│   ├── App.tsx               # 主应用组件
│   ├── main.tsx              # 入口文件
│   └── index.css             # 全局样式
├── index.html
├── package.json
├── tailwind.config.js        # Tailwind 配置
└── vite.config.ts            # Vite 配置
```

## 🎨 自定义主题

编辑 `tailwind.config.js` 修改颜色主题：

```javascript
theme: {
  extend: {
    colors: {
      nebula: {
        dark: '#0a0a0f',
        purple: '#7c3aed',
        blue: '#3b82f6',
        accent: '#06b6d4'
      }
    }
  }
}
```

## 🌟 下一步计划

- [x] 集成真实 Markdown 解析（当前为模拟数据）
- [ ] 接入 AI API 实时生成内容分析
- [ ] 添加双向链接图谱可视化
- [ ] 支持用户自定义主题
- [x] 移动端优化
- [ ] 暗黑/明亮模式切换

## 📄 License

MIT © 2026 MindScape

---

**让知识如有机生命般生长，让思想如星云般绽放** 🌌
