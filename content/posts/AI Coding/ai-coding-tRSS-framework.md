---
id: "AIC-001"
title: "AI Coding 规范之美——TRSS 四位一体"
date: "2026-05-17T10:00:00"
tags: ["AI", "Claude Code", "Trae", "GSD", "开发规范", "效率工具"]
personality: "引路人"
description: "从 CC Switch 模型管理中心到 Claude Code Agent 引擎，从 Andrej Karpathy 四戒律到 GSD Spec 工作流，再到 Trae SOLO 技能市场——深度解析团队 AI Coding 的 TRSS 四位一体协作方案。"
cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
locked: true
---

> 当 AI 开始接管越来越多的编码任务，我们突然面临一个前所未有的挑战：如何让 AI 的输出保持一致、稳定、可维护？答案是——建立规范。
>
> TRSS 四位一体方案，正是为解决这一问题而生的完整协作框架。它涵盖了从模型选择、规则约束、流程标准化到技能扩展的完整链路，让团队 AI Coding 从「能用」升级到「好用」。


![Architecture](/images/illustrations/AIC-001-cover.png)

## 为什么需要 TRSS？

在 AI Coding 实践中，团队常常会遇到这样的困境：

- **模型选择混乱**：Claude Code、GPT、DeepSeek...每个工具都有自己的配置方式，团队成员各用各的，输出风格不统一
- **输出质量不稳定**：同样的需求，AI 这次输出的代码和下次输出的可能截然不同
- **上下文丢失**：长对话后 AI 开始「遗忘」之前的决策，导致代码风格前后不一致
- **知识难以传承**：个人好不容易摸索出的最佳实践，无法快速复制到整个团队

TRSS 的诞生，正是为了解决这些问题。它不是四个独立工具的简单堆砌，而是一个层层递进、相互支撑的有机体系：

| 层级 | 代号 | 核心定位 | 解决的问题 |
|------|------|----------|-----------|
| **工具层** | **T** - Tools | 基础设施底座 | 模型管理、Agent 引擎、人机协作、可视化审查 |
| **规则层** | **R** - Rules | 行为约束与价值观 | AI 编码的"四戒律"，防止过度工程、错误假设 |
| **规格层** | **S** - Spec | 标准化工作流 | 上下文工程、Spec 驱动开发，对抗 context rot |
| **技能层** | **S** - Skill | 可复用能力封装 | 将最佳实践固化为技能包，稳定输出高质量结果 |

这四层的关系可以用一句话概括：**工具提供能力，规则约束行为，规格定义流程，技能封装经验**。缺了任何一层，AI 编程的协作效果都会大打折扣。


## T - Tools：构建统一工具链

![T-Tools 工具层](/images/illustrations/AIC-001-1.png)

AI Coding 的第一步，是建立统一的工具链。TRSS 推荐的工具矩阵如下：

### CC Switch：模型统一管理中心

![CC Switch 界面](/images/illustrations/AIC-001-8.jpg)

[CC Switch](https://www.ccswitch.io/zh/) 是 AI 编程 CLI 工作流的统一管理平台，被称为「模型路由器」。

**核心能力：**

- **多 Provider 统一管理**：一个界面管理 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 和 Hermes Agent 的供应商配置
- **自动故障转移**：本地路由内置熔断器、健康监控和故障转移队列，主 Provider 异常时自动切换到备用 Provider
- **用量与额度可见**：实时追踪请求、Token、缓存命中、成本和订阅额度
- **安全本地存储**：所有配置和 API Key 安全存储在本地 SQLite 数据库
- **MCP / Skills / 会话管理**：统一管理 MCP、Skills、Prompts、跨应用会话恢复

```
核心数据：
58.5k Stars | 3.8M 下载 | 6 大 CLI 支持 | Tauri 2 构建
```

**为什么需要它？**

团队中每个开发者可能使用不同的模型 Provider，有人用 Anthropic，有人用 OpenRouter，还有人用 MiniMax。CC Switch 让你在一个界面里管理所有这些配置，并且支持自动故障转移——当主模型不可用时，自动切换到备用模型，开发者无感知。

### Claude Code：Agent 研发引擎基座

![Claude Code](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80)

[Claude Code](https://github.com/lhfer/claude-howto-zh-cn) 是 Anthropic 官方推出的 CLI 工具，让开发者可以在终端中与 Claude 直接对话并执行代码任务。

**核心架构：**

Claude Code 的设计理念是「让 AI 成为你的编程搭档」，它提供了：

- **Slash Commands**：快速执行特定操作，如 `/grep`、`/edit`、`/search`
- **Memory 系统**：跨会话持久化上下文，包括项目级 `CLAUDE.md` 和全局规则
- **Skills**：可复用的技能包，如代码审查、文档生成等
- **Subagents**：任务委派，让 AI 分工协作
- **MCP (Model Context Protocol)**：接入外部工具和数据源
- **Hooks**：事件驱动的自动化，如 pre-commit 检查

**推荐学习资源：**

[Claude Code 中文上手指南](https://github.com/lhfer/claude-howto-zh-cn) 提供了完整的中文学习路径，从基础到进阶，涵盖：

- 15 分钟快速开始
- 10 大核心模块：Slash Commands、Memory、Skills、Subagents、MCP、Hooks、Plugins、Checkpoints、Advanced Features、CLI
- 常见场景模板：自动化代码审查、团队 onboarding、CI/CD 自动化等

### IDE：人机协作编码与审查中台

#### Trae：前端开发首选

![Trae IDE](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80)

[Trae](https://www.trae.cn/) 是国产 AI 原生 IDE，专为前端开发者打造。它内置了：

- **中文界面**：降低使用门槛
- **深度 Git 集成**：AI 辅助 Git 操作
- **实时预览**：前端开发所见即所得
- **SOLO 技能市场**：即插即用的能力扩展

#### IDEA：后端开发利器

JetBrains 全家桶（IntelliJ IDEA、PyCharm、WebStorm 等）则是后端开发的首选：

- **深度的语言理解**：静态类型语言的完美支持
- **重构能力**：AI 辅助的重构更加安全
- **调试集成**：AI 生成的代码可以直接调试验证
- **企业级特性**：团队协作、代码审查、工作流集成

**工具选择建议：**

| 场景 | 推荐工具 | 理由 |
|------|----------|------|
| 前端开发 | Trae | 中文界面 + SOLO 技能市场 |
| 后端开发 | IDEA + Claude | 深度语言理解 + 重构支持 |
| 全栈开发 | VS Code + Claude Code | 灵活性 + 跨语言支持 |
| 快速脚本 | Claude Code CLI | 轻量 + 高效 |

### Claude Code Viewer：Agent 编码可视化中心

![Claude Code Viewer](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80)

[Claude Code Viewer](https://github.com/d-kimuson/claude-code-viewer) 是一个 Web 界面的 Claude Code 客户端，专注于会话日志分析和可视化。

**核心特性：**

- **会话历史浏览**：查看所有 Claude Code 会话记录
- **实时监控**：实时查看正在运行的 Claude Code 任务
- **全文本搜索**：`⌘K` / `Ctrl+K` 快速搜索对话内容
- **远程访问**：通过 Tailscale 从手机或平板访问
- **PWA 支持**：可添加到主屏幕，获得类 App 体验

**为什么需要可视化？**

当团队成员使用 Claude Code 时，管理者需要了解 AI 做了什么、输出了什么、是否有问题。Claude Code Viewer 提供了透明的可见性，让团队可以：

- 回顾 AI 的决策过程
- 发现潜在的问题模式
- 审计 AI 的操作记录

## R - Rules：全局规则约束


![R-Rules 规则层](/images/illustrations/AIC-001-2.png)

Tools 解决的是「用什么」，Rules 解决的则是「怎么做」。TRSS 采用 Andrej Karpathy 提出的四戒律作为全局编码规范。

### Andrej Karpathy 四戒律

![Rules](https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80)

[Karpathy 四戒律](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/README.zh.md)源自 AI 大师 Andrej Karpathy 对 LLM 编码陷阱的深刻洞察：

**问题诊断：**

> "模型会代你做错误假设，然后不假思索地执行。它们不管理自身的困惑，不寻求澄清，不呈现矛盾，不展示权衡，在应该提出异议时也不反驳。"
>
> "它们真的很喜欢把代码和 API 搞复杂，堆砌抽象概念，不清理死代码……明明 100 行能搞定的事情，非要实现成 1000 行的臃肿架构。"

**四大戒律：**

| 原则 | 解决什么问题 |
|------|-------------|
| **编码前思考** | 错误假设、隐藏困惑、缺少权衡 |
| **简洁优先** | 过度复杂、臃肿抽象 |
| **精准修改** | 无关编辑、触碰不应碰的代码 |
| **目标驱动执行** | 测试优先、可验证的成功标准 |

#### 戒律一：编码前思考

**不要假设。不要隐藏困惑。呈现权衡。**

- **明确说明假设**：如果不确定，询问而不是猜测
- **呈现多种解释**：当存在歧义时，不要默默选择
- **适时提出异议**：如果存在更简单的方法，说出来
- **困惑时停下来**：指出不清楚的地方并要求澄清

#### 戒律二：简洁优先

**用最少的代码解决问题。不要过度推测。**

- 不要添加要求之外的功能
- 不要为一次性代码创建抽象
- 不要添加未要求的「灵活性」或「可配置性」
- 不要为不可能发生的场景做错误处理
- **检验标准**：资深工程师会觉得这过于复杂吗？如果是，简化

#### 戒律三：精准修改

**只碰必须碰的。只清理自己造成的混乱。**

- 不要「改进」相邻的代码、注释或格式
- 不要重构没坏的东西
- 匹配现有风格，即使你更倾向于不同的写法
- **检验标准**：每一行修改都应该能直接追溯到用户的请求

#### 戒律四：目标驱动执行

**定义成功标准。循环验证直到达成。**

| 不要这样做... | 转化为... |
|--------------|----------|
| 「添加验证」 | 「为无效输入编写测试，然后让它们通过」 |
| 「修复 bug」 | 「编写重现 bug 的测试，然后让它通过」 |
| 「重构 X」 | 「确保重构前后测试都能通过」 |

**安装方式：**

```bash
# Claude Code 插件方式（推荐）
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills

# CLAUDE.md 方式（按项目）
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
```

## S - Spec：标准化工作流

![S-Spec 规格层](/images/illustrations/AIC-001-3.png)



Tools 是基础设施，Rules 是约束条件，而 [GSD](https://github.com/gsd-build/get-shit-done/blob/main/README.zh-CN.md) 则是让 AI Coding 可预测、可重复执行的标准化流程。

### GSD：Spec Coding 标准化工作流

![GSD Workflow](https://github.com/gsd-build/get-shit-done/raw/main/assets/terminal.svg)

GSD（Get Shit Done）是一个**元提示、上下文工程与规格驱动开发系统**，适用于 Claude Code、OpenCode、Gemini CLI、Codex、Copilot、Cursor、Windsurf、Trae 等主流 AI 编程工具。

**核心解决的问题：Context Rot**

> 随着 Claude 的上下文窗口被填满，输出质量逐步劣化的问题。

GSD 通过一套完整的工作流，让 AI 始终在「新鲜」的上下文中工作，保证输出质量的稳定性。

### GSD 完整工作流

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GSD 完整工作流                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐        │
│   │  新项目  │ → │  讨论   │ → │  规划   │ → │  执行   │        │
│   │  初始化  │    │  阶段   │    │  阶段   │    │  阶段   │        │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘        │
│       ↓              ↓              ↓              ↓                 │
│   PROJECT.md    CONTEXT.md    PLAN.md      VERIFICATION.md         │
│   ROADMAP.md                     │                                 │
│                                  ↓                                 │
│                           ┌─────────┐                              │
│                           │  验证   │                              │
│                           │  工作   │                              │
│                           └─────────┘                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### 1. 初始化项目

```bash
/gsd-new-project
```

系统会：

- **提问**：一直问到它彻底理解你的想法（目标、约束、技术偏好、边界情况）
- **研究**：并行拉起代理调研领域知识
- **需求梳理**：提取哪些属于 v1、v2，哪些不在范围内
- **路线图**：创建与需求映射的阶段规划

**生成文件：** `PROJECT.md`、`REQUIREMENTS.md`、`ROADMAP.md`、`STATE.md`、`.planning/research/`

#### 2. 讨论阶段

```bash
/gsd-discuss-phase 1
```

**这是你塑造实现方式的地方。** 系统会分析该阶段，并根据要构建的内容识别灰区：

- **视觉功能**：布局、信息密度、交互、空状态
- **API / CLI**：返回格式、flags、错误处理、详细程度
- **内容系统**：结构、语气、深度、流转方式

#### 3. 规划阶段

```bash
/gsd-plan-phase 1
```

系统会：

- **研究**：结合你的 `CONTEXT.md` 决策，调研这一阶段该怎么实现
- **制定计划**：创建 2-3 份原子化任务计划，使用 XML 结构
- **验证**：将计划与需求对照检查，直到通过为止

**XML 计划结构示例：**

```xml
<task type="auto">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    Use jose for JWT (not jsonwebtoken - CommonJS issues).
    Validate credentials against users table.
    Return httpOnly cookie on success.
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
  <done>Valid credentials return cookie, invalid return 401</done>
</task>
```

#### 4. 执行阶段

```bash
/gsd-execute-phase 1
```

系统会：

- **按 wave 执行计划**：能并行的并行，有依赖的顺序执行
- **每个计划使用新上下文**：20 万 token 纯用于实现，零历史垃圾
- **每个任务单独提交**：每项任务都有自己的原子提交
- **对照目标验证**：检查代码库是否真的交付了该阶段承诺的内容

#### 5. 验证工作

```bash
/gsd-verify-work 1
```

**这是你确认它是否真的可用的地方。**

- **提取可测试的交付项**：你现在应该能做到什么
- **逐项带你验证**：自动化验证能检查代码存在、测试通过
- **自动诊断失败**：拉起 debug 代理定位根因
- **创建验证过的修复计划**：可立刻重新执行

### Wave 执行机制

```
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE EXECUTION                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ WAVE 1 (parallel)        WAVE 2 (parallel)        WAVE 3            │
│ ┌─────────┐ ┌─────────┐   ┌─────────┐ ┌─────────┐   ┌─────────┐     │
│ │ Plan 01 │ │ Plan 02 │ → │ Plan 03 │ │ Plan 04 │ → │ Plan 05 │     │
│ │   User  │ │ Product │   │ Orders  │ │  Cart   │   │Checkout │     │
│ │  Model  │ │  Model  │   │   API   │ │   API   │   │   UI    │     │
│ └─────────┘ └─────────┘   └─────────┘ └─────────┘   └─────────┘     │
│      │           │              ↑           ↑            ↑           │
│      └───────────┴──────────────┴───────────┘            │           │
│      Dependencies: Plan 03 needs Plan 01                   │           │
│               Plan 04 needs Plan 02                       │           │
│               Plan 05 needs Plans 03 + 04                 │           │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**为什么 wave 很重要：**

- 独立计划 → 同一 wave → 并行执行
- 依赖计划 → 更晚的 wave → 等依赖完成
- 文件冲突 → 顺序执行，或合并到同一个计划里

### 快速模式

```bash
/gsd-quick
```

**适用于不需要完整规划的临时任务。** 保留 GSD 的核心保障（原子提交、状态跟踪），但路径更短。

```bash
/gsd-quick --discuss --research --full
# --discuss: 规划前先进行轻量讨论
# --research: 规划前拉起研究代理
# --full: 启用计划检查和执行后验证
```

## S - Skill：能力按需扩展


![S-Skill 能力层](/images/illustrations/AIC-001-4.png)

Tools 提供了基础设施，Rules 建立了约束，Spec 定义了流程，而 [Trae SOLO](https://mp.weixin.qq.com/s/BfU_rPP6pNszGACl0TRmqw) Skill 则是按需增强的能力扩展包。

### Trae SOLO 技能市场

![Trae SOLO Skills](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80)

Trae SOLO 的技能市场为不同使用场景提供了多种技能，涵盖开发工具、效率提升、界面设计、数据分析与内容创作领域。

### 核心技能推荐

#### 开发工具类

**git-commit**

基于 Conventional Commits 规范的代码提交辅助工具：

- **生成规范的提交信息**：分析变更类型（feat、fix、docs）并生成结构化提交
- **按逻辑拆分与暂存变更**：支持文件路径、通配符或交互式暂存
- **安全执行 Git 提交流程**：严格遵守安全准则，不提交 `.env` 等机密文件

**react-best-practices**

面向 React 和 Next.js 项目的代码质量审查与性能优化工具：

- **核心性能瓶颈诊断**：Promise.all 并行请求、next/dynamic 动态加载
- **UI 架构审查**：检测传统 CSS-in-JS 并建议迁移
- **组件渲染优化**：规范 React Server Components、useTransition 使用

**webapp-testing**

基于 Playwright 的 Web 应用测试工具集：

- **前端功能验证**：模拟用户操作并返回结果
- **UI 行为调试**：截图、DOM 结构检查
- **多服务应用测试**：统一管理服务器生命周期

**composition-patterns**

面向 React 组件组合模式与架构设计的代码审查与重构工具：

- **重构臃肿组件**：消除 props 膨胀问题
- **设计可复用组件库**：Tabs、Modal、Select 等复合组件
- **适配 React 19 API**：forwardRef 移除、use() hook 使用

#### 效率提升类

**agent-browser**

面向 AI 智能体的浏览器自动化 CLI 工具：

- **测试复杂交互**：snapshot + batch 命令自动化操作
- **抓取网页数据**：提取链接和指定元素内容
- **视觉回归验证**：动态调整视口分辨率、生成截图对比

**brainstorming**

强制性的前置设计与需求分析技能：

- **引入全新功能**：明确新需求、梳理耦合度
- **修改或重构现有逻辑**：探索现有结构和瓶颈
- **拆解大型项目**：确定 MVP、拆分独立任务
- **涉及 UI/UX 的视觉辅助决策**：提供线框图、架构图可视化

#### 界面设计类

**figma**

基于 Figma MCP Server 的设计到代码转换工具：

- **将 Figma 设计稿实现为代码**：高视觉还原度
- **用现有组件实现设计**：优先复用项目已有组件
- **按节点实现或修改**：局部调整或增量迭代

**frontend-design**

生成具备独特风格和高质量的前端界面：

- **避免「AI 风格」同质化**：选择大胆、明确的美学主题
- **注重排版、色彩、动效、空间布局**：打造具有辨识度的界面
- **构建生产级 UI**：简约、独特、深邃、神秘

**frontend-skill**

打造视觉冲击力强的落地页、网站、应用界面：

- **强调克制的构图**：图像主导的层级、统一的内容结构
- **精致动效**：明确的视觉焦点和设计意图
- **现代审美**：类似 Linear 的设计语言

### 技能使用建议

| 场景 | 推荐技能组合 |
|------|-------------|
| 前端新项目 | brainstorming + figma + frontend-design + react-best-practices |
| 代码质量保障 | git-commit + react-best-practices + composition-patterns |
| 自动化测试 | webapp-testing + agent-browser |
| 快速迭代 | gsd-quick + frontend-skill |

## TRSS 集成实践

![TRSS 集成实践](/images/illustrations/AIC-001-5.png)

介绍了 TRSS 的四个维度，接下来让我们看看如何将它们整合成一套完整的工作流。

### 团队 AI Coding 启动清单

```bash
# 1. 工具安装
# 安装 Claude Code
curl -fsSL https://claude.ai/install.sh | sh

# 安装 CC Switch（模型管理）
# 下载地址：https://www.ccswitch.io/zh/

# 安装 Trae IDE
# 下载地址：https://www.trae.cn/

# 2. 规则配置
# 安装 Karpathy 四戒律
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills

# 3. GSD 工作流
# 安装 GSD
npx get-shit-done-cc@latest

# 4. 常用 Skills
# 安装项目特定 Skills 到 ~/.claude/skills/
```

### 日常开发工作流

```
┌─────────────────────────────────────────────────────────────────────┐
│                        日常开发工作流                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📋 需求接收                                                          │
│      │                                                                │
│      ↓                                                                │
│  🎯 GSD Discuss → 明确需求、约束、边界                                │
│      │                                                                │
│      ↓                                                                │
│  📐 GSD Plan → 原子化任务、XML结构、验证标准                          │
│      │                                                                │
│      ↓                                                                │
│  🚀 GSD Execute → Wave执行、原子提交、新鲜上下文                       │
│      │                                                                │
│      ↓                                                                │
│  ✅ GSD Verify → 功能验证、诊断修复                                   │
│      │                                                                │
│      ↓                                                                │
│  🚢 GSD Ship → 创建 PR、代码审查、合并                               │
│                                                                      │
│  全程规则约束：Karpathy 四戒律                                        │
│  模型调度：CC Switch 自动选择最优 Provider                             │
│  技能增强：按需调用 Trae SOLO Skills                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 协作场景示例

**场景：新功能开发**

1. **需求分析**（GSD Discuss）
   - AI 引导团队明确功能范围、边界条件、技术选型
   - 输出：CONTEXT.md

2. **任务规划**（GSD Plan）
   - AI 研究现有代码库模式
   - 生成原子化任务计划，每个任务都有验证标准
   - 输出：PLAN.md

3. **执行开发**（GSD Execute）
   - 按 wave 并行/顺序执行
   - 每个任务在新上下文中执行，保证质量
   - 每个任务原子提交，便于回溯
   - 规则约束：Karpathy 四戒律全程生效

4. **验证交付**（GSD Verify）
   - 功能测试、集成测试
   - 代码审查（AI + 人工）
   - 输出：VERIFICATION.md

5. **版本发布**（GSD Ship）
   - 创建 PR
   - 团队代码审查
   - 合并发布

## TRSS 的价值主张

![TRSS 价值主张](/images/illustrations/AIC-001-6.png)

为什么选择 TRSS？

### 1. 一致性

无论团队有多少人，TRSS 保证了：

- 相同的工具链配置（CC Switch 统一管理）
- 相同的编码规范（四戒律全局约束）
- 相同的开发流程（GSD 标准化工作流）
- 相同的能力扩展（Skills 按需复用）

### 2. 可预测性

GSD 的 Wave 执行机制让开发过程可预测：

- 每个任务都有明确的输入、输出、验证标准
- 依赖关系清晰，避免隐性阻塞
- 原子提交，便于追踪和回滚

### 3. 可扩展性

TRSS 不是封闭系统：

- **Tools 层**可以替换/新增任何 AI 编程工具
- **Rules 层**可以自定义团队的编码规范
- **Spec 层**可以调整工作流步骤或增加新阶段
- **Skill 层**可以开发团队专属的技能包

### 4. 知识传承

TRSS 让知识不再存在于个人头脑中：

- **Rules**（四戒律）：编码规范显式化
- **Spec**（GSD）：决策过程文档化
- **Skills**：最佳实践封装为可复用模块
- **Tools**（CC Switch）：配置集中化管理

新人加入团队，只需学习 TRSS 体系，即可快速融入。

## 总结：TRSS 体系全景图

![TRSS 体系全景图](/images/illustrations/AIC-001-7.png)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRSS 四位一体 AI Coding 体系                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│    ┌──────────────────────────────────────────────────────────┐       │
│    │                      T - Tools                           │       │
│    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │       │
│    │  │CC Switch│ │Claude   │ │  IDEs   │ │ Viewer  │     │       │
│    │  │ 模型管理 │ │  Code   │ │Trae/IDEA│ │ 可视化  │     │       │
│    │  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │       │
│    └──────────────────────────────────────────────────────────┘       │
│                              ↓                                        │
│    ┌──────────────────────────────────────────────────────────┐       │
│    │                      R - Rules                           │       │
│    │  ┌──────────────────────────────────────────────────┐  │       │
│    │  │         Andrej Karpathy 四戒律                    │  │       │
│    │  │  ①编码前思考  ②简洁优先  ③精准修改  ④目标驱动   │  │       │
│    │  └──────────────────────────────────────────────────┘  │       │
│    └──────────────────────────────────────────────────────────┘       │
│                              ↓                                        │
│    ┌──────────────────────────────────────────────────────────┐       │
│    │                      S - Spec                            │       │
│    │  ┌──────────────────────────────────────────────────┐  │       │
│    │  │              GSD 标准化工作流                     │  │       │
│    │  │  Discuss → Plan → Execute → Verify → Ship        │  │       │
│    │  └──────────────────────────────────────────────────┘  │       │
│    └──────────────────────────────────────────────────────────┘       │
│                              ↓                                        │
│    ┌──────────────────────────────────────────────────────────┐       │
│    │                      S - Skills                          │       │
│    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │       │
│    │  │git-commit│ │react   │ │browser  │ │figma   │       │       │
│    │  │ 代码提交 │ │最佳实践 │ │自动化   │ │设计转换 │       │       │
│    │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │       │
│    └──────────────────────────────────────────────────────────┘       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 资源链接

| 分类 | 资源 | 链接 |
|------|------|------|
| **模型管理** | CC Switch | https://www.ccswitch.io/zh/ |
| **Agent 引擎** | Claude Code | https://github.com/lhfer/claude-howto-zh-cn |
| **可视化** | Claude Code Viewer | https://github.com/d-kimuson/claude-code-viewer/ |
| **IDE** | Trae | https://www.trae.cn/ |
| **编码规则** | Karpathy 四戒律 | https://github.com/multica-ai/andrej-karpathy-skills |
| **工作流** | GSD | https://github.com/gsd-build/get-shit-done |
| **技能市场** | Trae SOLO | https://mp.weixin.qq.com/s/BfU_rPP6pNszGACl0TRmqw |

## 写在最后

AI Coding 不是让 AI 替代开发者，而是让 AI 成为开发者的超级助手。TRSS 四位一体方案的核心思想是：

- **Tools**：让 AI 有趁手的「武器」
- **Rules**：让 AI 遵守「章法」
- **Spec**：让 AI 执行有「流程」
- **Skill**：让 AI 能力可「扩展」

四位一体，缺一不可。没有规则的 AI 会输出混乱的代码，没有流程的 AI 会丢失上下文，没有工具的 AI 寸步难行，没有技能的 AI 只能做基础任务。

当你把这四者有机结合，就能构建出一个高效、稳定、可扩展的团队 AI Coding 体系。

> "AI 是放大器，它会放大你的优点，也会放大你的缺点。TRSS 的作用，是让 AI 放大的，是你的优点。"