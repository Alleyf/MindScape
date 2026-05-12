---
name: MindScape
description: AI-Native 创意知识空间
version: "0.1"
last_updated: "2026-05-12"
---

# MindScape Project

## Overview

AI-Native 创意知识空间，基于 React + Vite + TypeScript 构建。

## Current Milestone: v0.4 资源配置 MD 化

**Goal:** 将 VITE_LEARNING_ROUTES 和 VITE_RESOURCE_CATEGORIES 从环境变量迁移到 MD 文件存储，提升可读性和动态更新体验。

**Target features:**
- 创建 content/config/resources.md — 存储资源分类数据
- 创建 content/config/learning-routes.md — 存储学习路线数据
- 重构 src/config/resources.ts — 从 MD 文件加载数据，移除 env var 依赖
- 更新 .env.example — 移除已迁移的 env var 注释
- 确保向后兼容 — 现有 URL 链接、icon、格式全部保留

## Milestones

### v0.1 — Initial Release (2026-05-11)
- 首页、学习路线、资源库、笔记阅读、图谱、标签页
- 粒子背景、鼠标光晕、玻璃拟态
- AI 隐喻面板
- 笔记 TOC 滚动跟随
- 沉浸式阅读模式
- Markdown/PDF 导出

### v0.4 — 资源配置 MD 化 (current)
- 将 VITE_LEARNING_ROUTES 和 VITE_RESOURCE_CATEGORIES 迁移到 MD 文件
- 提升可读性和动态更新体验
- 保持数据格式等价，确保向后兼容

### v0.3 — AI 功能接入 ✓ (2026-05-12)
- 接入 Claude API，完善 AI 功能
- 智能笔记摘要（自动生成摘要、关键词）
- 笔记间关联发现（语义分析）
- AI 写作助手（阅读时解释、答疑）

### v0.2 — Demo GIF ✓ (2026-05-12)
- 为 README 添加演示 GIF，展示系统各项功能

## Tech Stack

React 19 + TypeScript, Vite 8 (Rolldown), react-router-dom v7, Framer Motion, d3-force, @xyflow/react
