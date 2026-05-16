---
title: "AI Coding 学习清单"
date: "2026-05-11"
tags: ["ai","coding","agent","workflow","tools","learning"]
personality: "未来主义者"
description: "一份面向 AI Coding 初学者和进阶实践者的工具、概念、工作模式与方法论网址合集"
cover: "/images/covers/ms-4d38319c.svg"
priority: 1
locked: true
---

# AI Coding 学习清单

AI Coding 最容易踩的坑，不是工具不够多，而是一下子看到太多工具。

Claude Code、Codex、OpenClaw、Hermes、Skills、MCP、Spec、GSD、Superpowers、Vibe Coding......每个词都像一个入口。刚开始学的时候，如果没有地图，很容易每天收藏十个网站，真正能稳定交付的工作流却一个都没有。

这篇清单的目标很简单：把主流热门的 AI Coding 入口按学习顺序整理出来。先补齐概念，再认识工具，再理解工作模式，最后进入规范驱动、计划驱动和多 Agent 工作流。

![AI Coding 学习路线图](/images/ai-coding-roadmap.svg)

## 1. 先建立一张心智地图

AI Coding 不是“让 AI 帮我写几行代码”这么窄。更准确地说，它是在把软件开发拆成几类可协作的任务：

- **对话式生成**：让模型解释、改写、补全代码，适合学习和小任务。
- **仓库级代理**：让 Agent 读取代码库、编辑文件、运行命令、修复测试。
- **工具增强**：通过 CLI、IDE 插件、MCP、浏览器、数据库、搜索等工具扩展能力。
- **技能系统**：把可复用经验封装成 `SKILL.md`、插件或工作流，让 Agent 在合适时机调用。
- **规范驱动开发**：先写需求、规格、计划和验收，再让 Agent 实现。
- **多 Agent 协作**：把研究、实现、审查、测试拆给不同 Agent 并行推进。

如果只追工具，会很快迷路。更稳的学习路径是：概念扫盲 -> 单工具熟练 -> 工作模式 -> 方法论 -> 生态与技能市场 -> 安全和评估。

## 2. AI 编程核心概念扫盲

刚开始不必急着装一堆 CLI。先把“模型、上下文、提示词、工具调用、Agent、RAG、MCP、评估”这些词看懂。否则后面遇到上下文丢失、模型乱改、工具误用、Token 爆炸时，很难判断问题出在哪里。

![AI Coding 核心概念关系图](/images/ai-coding-concepts.svg)

### 推荐入口

- [云途 AGI：AI 扫盲系列](https://www.yuntuagi.cn/series/ai-literacy)  
  适合从 AI 基础概念开始补课。把它当作第一层词汇表，先知道常见术语在说什么。

- [JavaGuide：AI 应用开发面试指南](https://javaguide.cn/ai/)  
  更偏工程视角，适合 Java、后端或应用开发者理解大模型应用开发中的常见概念。

### 建议重点

先把这几个概念吃透：

- **上下文窗口**：Agent 能看见什么，决定它能做什么。
- **工具调用**：Agent 为什么能读文件、跑命令、查网页、改代码。
- **系统提示词与项目指令**：决定 Agent 的行为边界和工作习惯。
- **MCP**：让 Agent 接入外部工具和数据源的一种标准化方式。
- **Skills / Plugins**：把经验、脚本、约束和操作流程打包复用。
- **Eval / Verification**：不要只看 Agent 说完成了，要让测试、构建、截图、日志和人工验收一起证明它完成了。

## 3. 主流 AI Coding 工具入口

工具层可以分成三类：日常编码 Agent、配置管理工具、Agent 生态平台。

![AI Coding 工具生态分层图](/images/ai-coding-ecosystem.svg)

### Claude Code

- [Claude Code 官方文档](https://code.claude.com/docs/en/overview)  
  Claude Code 是目前最常被讨论的终端型编码 Agent 之一，适合仓库级理解、文件修改、测试修复和长任务协作。

适合学习的方向：

- 如何写 `CLAUDE.md` 或项目指令。
- 如何让它先读代码再改代码。
- 如何控制权限、命令执行和提交粒度。
- 如何结合 Skills、hooks、MCP 扩展工作流。

### OpenAI Codex

- [OpenAI Codex GitHub 仓库](https://github.com/openai/codex)  
  Codex 是轻量级终端编码 Agent，适合在本地仓库中协作实现、解释和验证代码改动。

适合学习的方向：

- 如何用 Codex 处理明确的仓库任务。
- 如何让 Codex 在改动后运行构建和测试。
- 如何结合插件、Skills 和项目约束形成稳定习惯。

### CC-Switch

- [CC-Switch](https://github.com/farion1231/cc-switch)  
  一个跨平台 All-in-One 管理工具，用来统一管理 Claude Code、Codex、Gemini CLI、OpenCode、OpenClaw 等 AI 编程助手的配置。

它适合解决一个很现实的问题：模型、供应商、API Key、代理和本地工具越来越多，手动切换容易乱。CC-Switch 更像“AI Coding 环境控制台”，适合重度使用多个 CLI 的开发者。

### OpenClaw

- [OpenClaw](https://openclaw.ai/)  
  OpenClaw 是 Agent 与技能生态的重要入口之一，围绕本地任务执行、技能系统和插件生态展开。

学习 OpenClaw 时，不要只看“能装多少技能”。更值得关注的是：

- 技能如何组织成目录和说明文件。
- Agent 如何决定什么时候调用技能。
- 技能是否会执行脚本、访问文件或调用网络。
- 技能市场的便利性和供应链风险如何平衡。

### Hermes Agent

- [Hermes Agent 中文社区](https://hermesagent.org.cn/)  
- [Hermes Agent 官方文档](https://hermes-agent.nousresearch.com/docs/)  
- [Hermes Agent 用户故事](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-stories)  

Hermes Agent 更适合从“自我改进 Agent”的角度学习。它强调工具使用、记忆、技能、任务执行和用户建模。对想理解长期 Agent、个性化工作流和自动化闭环的人来说，它是一个值得观察的方向。

## 4. Skills 与 Agent 生态市场

Skills 是 AI Coding 里非常关键的一层。它不像传统插件那样只提供功能按钮，而是把“何时使用、怎样使用、有哪些约束、可以调用哪些脚本”写成 Agent 能读懂的说明。

这意味着技能市场会越来越像 Agent 时代的 npm、VS Code Marketplace 和工作流模板库的混合体。

![Skills 与 Agent 生态市场图](/images/ai-coding-skills-market.svg)

### 常用入口

- [SkillHub](https://skillhub.cn/)  
  面向中文用户的 Skills 社区入口，适合搜索中文语境下的 Agent 技能资源。

- [SkillsMP：开发分类](https://skillsmp.com/zh/categories/development)  
  Agent Skills 市场，开发分类里可以看到大量与编码、工程实践、框架、工具链相关的技能。

- [水产市场 / OpenClawMP](https://openclawmp.stepfun.com/)  
  阶跃星辰推出的 Agent 进化生态入口，包含经验、技能、插件、触发器、通信器等资产类型。

- [ClawHub](https://clawhub.ai/)  
  OpenClaw 生态中的 Skills 和 Plugins 市场入口，适合发现、搜索和发布社区工具。

- [ClawHub 中国镜像](https://cn.clawhub-mirror.com/)  
  面向国内访问场景的镜像入口。

### 使用技能市场的基本规则

技能市场很好用，但不要盲装。一个技能可能只是说明文档，也可能带脚本、依赖、网络请求和文件系统操作。

![技能安全审查清单图](/images/ai-coding-security-check.svg)

建议采用这套检查清单：

- 先看 `SKILL.md`：确认触发条件、权限边界和实际操作。
- 再看脚本：确认是否有读取密钥、上传文件、执行远程代码等行为。
- 优先选择官方、活跃维护、代码透明、有社区反馈的技能。
- 在临时仓库或沙盒里试用高风险技能。
- 对涉及钱包、密钥、浏览器 Cookie、云账号、生产数据库的技能保持默认不信任。

AI Coding 的技能生态会很强，但供应链安全会成为长期问题。便利性越高，越需要建立自己的审查习惯。

## 5. 三种常见工作模式：Vibe、Plan、Spec

学习 AI Coding 时，很多争论其实是在混用不同工作模式。

![Vibe、Plan、Spec 工作模式对比图](/images/ai-coding-modes.svg)

### Vibe Coding

Vibe Coding 是最轻的模式。你给一个大致方向，和 Agent 边聊边改，快速看到结果。

适合：

- 原型验证。
- 小工具、小页面、小脚本。
- 不确定需求时先探索。
- 创意类、交互类、低风险任务。

不适合：

- 生产系统核心逻辑。
- 多人协作的复杂需求。
- 安全、支付、权限、数据迁移。
- 需要明确验收标准的长期项目。

Vibe 的价值是速度，不是可靠性。它适合点火，不适合托管整座工厂。

### Plan-Driven Coding

Plan 模式会先让 Agent 读代码、拆任务、列步骤，再逐步执行。它比 Vibe 稳，因为每一步都有目标和验证方式。

适合：

- 中等规模功能。
- Bug 修复。
- 重构。
- 测试补齐。
- 多文件但边界清楚的改动。

Plan 模式的关键不是“写一份很长的计划”，而是让计划足够可执行：改哪个文件、为什么改、怎么验证、失败怎么回滚。

### Spec-Driven Development

Spec 模式会把需求、边界、用户故事、数据结构、接口、验收标准先写清楚，再进入实现。

适合：

- 复杂功能。
- 需要多人评审的需求。
- 长周期项目。
- AI Agent 多轮接力。
- 你不希望 Agent 自己脑补产品决策的场景。

Spec 的价值是减少“看起来写完了，其实方向错了”的风险。它让 Agent 从“猜测需求”变成“执行已确认的契约”。

## 6. 编程范式、工作流与方法论

当你开始频繁使用 AI Coding，真正决定效率的不是模型，而是工作流。下面这些方法论入口值得系统学习。

![AI Coding 方法论地图](/images/ai-coding-methods-map.svg)

### Superpowers

- [Superpowers GitHub 仓库](https://github.com/obra/superpowers)  

Superpowers 是一套 Agentic Skills 框架和软件开发方法论。它强调先澄清需求，再写设计，再拆计划，再执行，并且把测试驱动、代码审查、验证、分支收尾这些动作变成可触发的技能。

适合学习：

- 如何用技能约束 Agent 行为。
- 如何让 Agent 在写代码前先做需求澄清。
- 如何用 TDD、review、verification 约束质量。
- 如何把复杂开发拆成可检查的小任务。

### Spec Kit

- [GitHub Spec Kit 文档](https://github.github.com/spec-kit/)  
- [Spec Kit 中文站](https://docs.spec.xin/)  

Spec Kit 更适合学习“规范驱动开发”的工具化落地。它的重点不是让 Agent 更会聊天，而是把需求、规格、任务和实现之间的关系组织起来。

适合学习：

- 如何从模糊想法生成规格。
- 如何把规格拆成可实现任务。
- 如何让实现持续对齐 spec。

### OpenSpec

- [OpenSpec 官方站](https://openspec.dev/)  
- [OpenSpec 中文文档](https://lzw.me/docs/OpenSpec-Docs-zh/)  

OpenSpec 是轻量级 Spec-Driven 框架，适合学习如何用较低成本建立需求、计划、任务和验收之间的链路。

适合学习：

- 规格文档应该包含什么。
- 如何避免需求和实现脱节。
- 如何让 AI Agent 围绕同一个 spec 多轮工作。

### GSD

- [GSD 2](https://github.com/gsd-build/gsd-2)  
- [Get Shit Done 原版](https://github.com/gsd-build/get-shit-done)  
- [GSD Workflow Practice](https://blog.deepai.wiki/posts/gsd-workflow-practice/)  
- [GSD 概念介绍](https://yudesk.dev/docs/notes/gsd/concept)  

GSD 关注的是长任务、上下文工程、阶段推进和自动化执行。它的核心问题意识很实际：Agent 可以连续工作很久，但很容易丢失全局目标、遗忘上下文、跳过验证或陷入循环。

适合学习：

- 如何维护项目级上下文。
- 如何把 milestone、phase、task 分层。
- 如何让 Agent 在长周期中持续知道“现在做到哪一步”。
- 如何把自动执行和人工检查点结合起来。

### 横向对比

- [AI Insight：OpenSpec vs Superpowers vs GSD](https://www.ai-insight.org/reports/openspec-vs-superpowers-vs-gsd)  

这类对比文章适合在你已经试过一两个工具后再看。不要一开始就陷入框架选型。先做一个真实项目，再回来比较它们解决的到底是哪类问题。

## 7. 推荐学习路线

如果你是初学者，可以按这个顺序走。

![AI Coding 四阶段学习路线](/images/ai-coding-learning-stages.svg)

### 第一阶段：能用起来

目标是让 AI 帮你完成小任务，而不是搭建宏大系统。

建议动作：

- 阅读 AI 基础扫盲。
- 安装一个主力工具：Claude Code 或 Codex。
- 在一个玩具项目里让 Agent 新增页面、修复 Bug、补测试。
- 每次都要求它说明改了什么、为什么改、怎么验证。

这一阶段最重要的习惯是：不要只复制代码，要看 diff。

### 第二阶段：能稳定改仓库

目标是让 Agent 成为可靠的本地协作者。

建议动作：

- 给项目写清楚 `README`、开发命令和代码规范。
- 建立项目级 Agent 指令。
- 学会让 Agent 先探索代码，再提出计划。
- 每次改动后跑构建、测试或 lint。
- 用小提交记录每次成功的工作单元。

这一阶段最重要的习惯是：任务越具体，Agent 越稳定。

### 第三阶段：能复用工作流

目标是从“每次重新提示”升级到“可复用方法”。

建议动作：

- 学习 Skills 的结构。
- 把你常用的审查清单、发布步骤、测试步骤写成技能或文档。
- 试用 SkillHub、SkillsMP、ClawHub、水产市场里的开发类技能。
- 对第三方技能做安全检查。

这一阶段最重要的习惯是：把有效经验沉淀为 Agent 可以调用的上下文。

### 第四阶段：能做复杂项目

目标是让 Agent 支持真实项目推进。

建议动作：

- 选择一种 Spec 工作流：Spec Kit、OpenSpec、GSD 或 Superpowers。
- 用 spec 描述需求边界和验收标准。
- 用 plan 拆解任务。
- 用测试、构建、截图、日志验证完成度。
- 对关键改动做代码审查。

这一阶段最重要的习惯是：让 Agent 执行决策，而不是替你偷偷做产品决策。

## 8. 我的个人选择建议

如果只能从少数几个入口开始，我会这样选：

![AI Coding 选型建议图](/images/ai-coding-choice-guide.svg)

- **日常编码**：Claude Code 或 Codex。
- **多工具环境管理**：CC-Switch。
- **概念补课**：云途 AGI + JavaGuide。
- **技能市场探索**：SkillHub、SkillsMP、ClawHub、水产市场。
- **规范驱动入门**：Spec Kit 或 OpenSpec。
- **严格工程习惯**：Superpowers。
- **长任务和阶段管理**：GSD。
- **自我改进 Agent 观察**：Hermes Agent。

不要一次全学。AI Coding 的学习方式更像练手艺：先找到一个真实任务，用一个工具完成它；再把中间反复出现的问题抽象成流程；最后才需要比较框架。

## 9. 最后提醒

AI Coding 的核心不是“谁的模型最强”，而是你能不能把意图、上下文、约束和验证交代清楚。

![AI Coding 验证闭环图](/images/ai-coding-verification-loop.svg)

一个成熟的 AI Coding 工作流，通常长这样：

1. 先明确需求和验收标准。
2. 再让 Agent 读取项目上下文。
3. 接着产出计划。
4. 然后小步实现。
5. 每一步都验证。
6. 最后审查 diff 和风险。

工具会继续变化，网站会继续增加，方法论也会继续迭代。但这条主线大概率不会变：让 AI 少猜一点，让系统多验证一点，让人类把判断力放在真正重要的位置。
