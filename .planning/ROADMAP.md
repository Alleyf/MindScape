# Roadmap: MindScape v0.4

**Milestone:** v0.4 资源配置 MD 化
**Created:** 2026-05-13

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | 数据迁移设计 | 设计 MD 文件格式，验证加载方案 | DATA-01, DATA-02 | 1. MD 文件格式确定 2. 加载方式确定 |
| 2 | MD 文件创建 | 创建 content/config/resources.md 和 learning-routes.md | DATA-01, DATA-02 | 1. resources.md 包含全部 7 个分类 2. learning-routes.md 包含全部 3 个路线 |
| 3 | 加载逻辑重构 | 重构 resources.ts，从 MD 文件加载数据 | CODE-01, CODE-02 | 1. 编译通过 2. 页面正常显示资源配置 |
| 4 | 配置与验证 | 更新 .env.example，验证向后兼容 | CONFIG-01, COMPAT-01 | 1. .env.example 已更新 2. URL 和数据一致 |

---

## Phase 1: 数据迁移设计

**Goal:** 设计 MD 文件格式，确定加载方案

**Requirements:** DATA-01, DATA-02

**Success Criteria:**
1. MD 文件格式确定（YAML front matter + YAML list）
2. 加载方式确定（import.meta.glob + 解析方案）
3. 类型定义保持不变

**Tasks:**
- [ ] 分析现有 JSON 数据结构，设计等价 YAML 格式
- [ ] 确定 front matter parser（gray-matter 或自定义）
- [ ] 确定 Vite 加载方案（import.meta.glob ?raw）
- [ ] 更新类型定义（如需要）

---

## Phase 2: MD 文件创建

**Goal:** 创建 content/config/resources.md 和 learning-routes.md

**Requirements:** DATA-01, DATA-02

**Success Criteria:**
1. resources.md 包含全部 7 个资源分类
2. learning-routes.md 包含全部 3 个学习路线
3. 数据内容与现有 .env.example 完全一致

**Tasks:**
- [ ] 创建 content/config/ 目录
- [ ] 创建 resources.md（7 个分类）
- [ ] 创建 learning-routes.md（3 个路线）
- [ ] 验证 YAML 格式正确

---

## Phase 3: 加载逻辑重构

**Goal:** 重构 resources.ts，从 MD 文件加载数据

**Requirements:** CODE-01, CODE-02

**Success Criteria:**
1. resources.ts 编译通过
2. 页面正常显示资源配置
3. 错误处理和 fallback 逻辑正常

**Tasks:**
- [ ] 修改 resources.ts 使用 import.meta.glob
- [ ] 实现 front matter 解析
- [ ] 添加 fallback 到默认数据
- [ ] 运行 npm run dev 验证

---

## Phase 4: 配置与验证

**Goal:** 更新 .env.example，验证向后兼容

**Requirements:** CONFIG-01, COMPAT-01

**Success Criteria:**
1. .env.example 已移除过时配置
2. 所有 URL 链接保持不变
3. 图标 SVG path 一致
4. 数据数量和顺序一致

**Tasks:**
- [ ] 更新 .env.example
- [ ] 手动验证资源配置页面
- [ ] 检查所有 URL 可访问性

---

## Verification

| Requirement | Phase | Verified |
|-------------|-------|----------|
| DATA-01 | 1, 2 | - |
| DATA-02 | 1, 2 | - |
| CODE-01 | 3 | - |
| CODE-02 | 3 | - |
| CONFIG-01 | 4 | - |
| COMPAT-01 | 4 | - |

**Total:** 6 requirements across 4 phases
