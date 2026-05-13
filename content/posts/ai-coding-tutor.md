---
title: "AI 编程导师"
date: "2026-05-11"
tags: ["ai","coding","tutor"]
personality: "未来主义者"
description: "探索你的创意知识库之旅"
cover: "/images/covers/ms-dbb1b231.svg"
---


## 0.1 目录

- [环境配置（工具与插件）](#环境配置工具与插件)
    - [Claude Code CLI / 插件安装与配置](#claude-code-cli--插件安装与配置)
    - [OpenAI Codex CLI / 插件安装与配置](#openai-codex-cli--插件安装与配置)
    - [其他 AI 编程环境配置工具](#其他-ai-编程环境配置工具)
- [编程工具用法（命令行与接口）](#编程工具用法命令行与接口)
    - [Claude Code CLI 使用指南](#claude-code-cli-使用指南)
    - [OpenAI Codex CLI 使用指南](#openai-codex-cli-使用指南)
- [编程模式理解（方法与理念）](#编程模式理解方法与理念)
    - [Vibe Coding（氛围感编程）](#vibe-coding氛围感编程)
    - [Spec-Driven Development（规范驱动开发）](#spec-driven-development规范驱动开发)
    - [Plan-Driven Coding（计划驱动编程）](#plan-driven-coding计划驱动编程)
- [工作流/方法论指南](#工作流方法论指南)
    - [OpenSpec（开源规范驱动开发框架）](#openspec开源规范驱动开发框架)
    - [Spec-Kit（GitHub 官方 SDD 工具）](#spec-kitgithub-官方-sdd-工具)
    - [Superpowers（Claude Code 严格工作流插件）](#superpowersclaude-code-严格工作流插件)
    - [GSD（Get-Shit-Done，简洁高效的 SDD 工具集）](#gsdget-shit-done简洁高效的-sdd-工具集)
    - [BMAD（AI 驱动的企业级敏捷开发框架）](#bmadai-驱动的企业级敏捷开发框架)

---

## 0.2 环境配置（工具与插件）

### 0.2.1 Claude Code CLI / 插件安装与配置

- **Claude Code 官方安装指南** – _Claude 官方文档_，介绍如何在不同平台上安装 Claude Code CLI 及插件（如 VS Code、JetBrains 插件），涵盖环境变量配置、权限设置等。  
  https://code.claude.com/docs/zh-CN/quickstart （Claude Code 快速入门指南）

- **Claude Code VS Code 插件安装** – 提供在 VS Code 中安装 Claude Code 扩展的步骤，包括 Marketplace 安装和手动安装方法，以及插件功能介绍。  
  https://code.claude.com/docs/zh-CN/vs-code （Claude Code VS Code 插件文档）

- **Claude Code JetBrains 插件安装** – 指导如何在 JetBrains 系列 IDE（IntelliJ IDEA、PyCharm 等）中安装和配置 Claude Code 插件，实现 IDE 内集成 AI 编码助手。  
  https://code.claude.com/docs/zh-CN/jetbrains （Claude Code JetBrains 插件文档）

- **CC-Switch 配置工具** – 一款跨平台桌面工具，用于统一管理 Claude Code、Codex、Gemini CLI 等多个 AI 编程助手的 API 配置，实现一键切换不同模型和供应商，简化环境配置。  
  https://github.com/farion1231/cc-switch （CC-Switch 项目主页）

- **Claude Code 最佳实践** – Anthropic 官方提供的 Claude Code 使用技巧和模式，涵盖环境配置、提示设计、上下文管理等，帮助开发者充分利用 Claude Code。  
  https://code.claude.com/docs/zh-CN/best-practices （Claude Code 官方最佳实践）

- **Claude Code 安全实践** – 讨论在使用 Claude Code 时的安全考虑，例如禁用不必要的 hook、仅启用可信的 MCP 服务器等，以保护代码和数据安全。  
  https://www.backslash.security/blog/claude-code-security-best-practices （Claude Code 安全实践博客）

### 0.2.2 OpenAI Codex CLI / 插件安装与配置

- **OpenAI Codex CLI 安装指南** – OpenAI 官方提供的 Codex CLI 安装步骤，包括通过 npm 安装、环境变量配置、认证设置等，帮助用户在终端中使用 Codex 进行 AI 编程。  
  https://advantailabs.com/blog/how-to-install-and-use-openai-codex-cli-a-step-by-step-guide （Codex CLI 安装教程）

- **Codex CLI VS Code 插件安装** – 介绍如何在 VS Code 中安装 OpenAI Codex 扩展，以及插件配置方法，使开发者能够在编辑器内直接调用 Codex 进行代码生成和修改。  
  https://github.com/openai/codex （Codex 项目主页及安装说明）

- **Codex 设置预配置** – 一个开源项目，提供预先配置好的 Codex 设置，简化 Claude Code、Codex 等 AI 编程工具的初始安装和配置流程。  
  https://github.com/feiskyer/codex-settings （Codex 预配置设置）

### 0.2.3 其他 AI 编程环境配置工具

- **Trae IDE（字节跳动）** – 一款集成了 AI 助手的云端 IDE，支持接入 Claude 等模型。提供官方接入指南，演示如何在 Trae 中配置 Claude API 以获得 AI 编码功能。  
  https://claudeapi.com/zh/blog/tools/blogdev-guidestrae-ide-claude-api-setup-tutorial/ （Trae IDE 接入 Claude 教程）

- **Claude Code 中文配置教程** – 一篇中文教程，介绍在 Windows 上配置 Claude Code 的完整过程，包括安装 Node.js、Git、Claude Code CLI，以及使用 CC-Switch 配置国内模型。  
  https://blog.csdn.net/2401_85252837/article/details/150793888 （Claude Code 中文配置教程）

- **Claude Code 中文安装实战** – 另一篇中文实战指南，详细讲解在 Windows/Linux 上安装 Claude Code 的步骤，包括环境准备、命令安装、VS Code 插件配置等，并提供了常见问题解决方案。  
  https://www.it235.com/ai/claudecode/install.html （Claude Code 中文安装实战）

---

## 0.3 编程工具用法（命令行与接口）

### 0.3.1 Claude Code CLI 使用指南

- **Claude Code 官方文档** – Anthropic 提供的 Claude Code 文档门户，涵盖核心概念、用法指南、扩展方法（如使用 MCP 服务器、自定义技能等），是深入了解 Claude Code CLI 功能的权威资料。  
  https://code.claude.com/docs/en （Claude Code 官方文档首页）

- **Claude Code 最佳实践** – _同上_，官方收集的使用技巧和模式，包括如何让 Claude 验证自身工作、如何先探索再编码再验证等，帮助开发者更高效地使用 Claude Code。  
  https://code.claude.com/docs/zh-CN/best-practices （Claude Code 最佳实践）

- **Claude Code 插件使用** – Claude Code 支持通过插件扩展功能，如安装 OpenAI Codex 插件在 Claude Code 中使用 Codex 模型进行代码生成和对抗审查，提升代码质量。  
  https://marketingagent.blog/2026/03/24/tutorial-openai-codex-plugin-in-claude-code/ （Claude Code 中使用 Codex 插件教程）

### 0.3.2 OpenAI Codex CLI 使用指南

- **Codex CLI 使用指南** – OpenAI 提供的 Codex CLI 使用说明，包括基本命令、与终端交互的方式、如何让 Codex 生成代码、运行命令等，帮助用户掌握 Codex 在命令行环境下的用法。  
  https://github.com/openai/codex （Codex CLI 项目及使用说明）

- **Codex 插件与集成** – 介绍如何将 Codex 集成到主流 IDE 和编辑器中（如 VS Code、Cursor 等），包括插件安装步骤、常见工作流，以及 Codex 在 IDE 中的功能演示。  
  https://inventivehq.com/knowledge-base/openai/how-to-integrate-with-ide （Codex IDE 集成指南）

---

## 0.4 编程模式理解（方法与理念）

### 0.4.1 Vibe Coding（氛围感编程）

- **Vibe Coding 概念解析** – 一篇深入解析 Vibe Coding 的文章，阐述其核心理念：通过自然语言描述需求，让 AI 自动生成、测试并部署代码，开发者无需关注底层实现细节。文章讨论了 Vibe Coding 的优势（如快速原型）和局限（如维护性挑战），并提供实际案例说明。  
  https://www.augmentcode.com/guides/vibe-coding-vs-spec-driven-development （Vibe Coding 详解）

- **Vibe Coding vs. Spec-Driven Development** – 一篇对比分析文章，指出 Vibe Coding 侧重于通过对话式提示快速迭代，而规范驱动开发（SDD）则强调在编码前通过结构化规范约束 AI 输出，以确保代码的长期可维护性。文章探讨了两种模式各自适用的场景。  
  https://www.oreilly.com/live-events/vibe-coding-vs-spec-driven-development/0642572353889/ （Vibe Coding vs. SDD）

- **Vibe Coding 资源汇总** – 一个精选资源列表，汇集了与 Vibe Coding 相关的工具、框架、最佳实践和教程，帮助开发者全面了解这一新兴编程范式。  
  https://github.com/taskade/awesome-vibe-coding （Vibe Coding 资源合集）

### 0.4.2 Spec-Driven Development（规范驱动开发）

- **规范驱动开发 (SDD) 深度解析** – 一篇系统阐述 SDD 概念的文章，解释其“规范即代码”的理念：通过定义严谨、结构化、人机无歧义的规范，约束 AI 编码过程，消除需求模糊性，提升代码质量和可维护性。文章还介绍了主流 SDD 框架（如 Spec-Kit、OpenSpec、Superpowers 等）及其特点。  
  https://www.51cto.com/aigc/11464.html （主流 SDD 框架深度解析）

- **Spec-Driven Development 实践指南** – 一篇实战指南，探讨如何在开发流程中引入规范驱动开发，包括制定可执行的规范、在 AI 编码前定义需求和设计、以及如何使用规范引导 AI 生成符合预期的代码。文章强调 SDD 在降低需求歧义、减少返工方面的价值。  
  https://intent-driven.dev/blog/2025/12/15/vibe-coding-vs-spec-driven-development/ （SDD 实践指南）

### 0.4.3 Plan-Driven Coding（计划驱动编程）

- **Claude Code 规划模式** – Claude Code 提供的一种规划模式，使用户能够在让 AI 实际编码之前先制定详细的实现计划。官方文档介绍了如何使用 Plan Mode，以及它如何帮助开发者避免解决错误的问题，提高一次成功的概率。  
  https://code.claude.com/docs/zh-CN/best-practices （Claude Code 规划模式说明）

---

## 0.5 工作流/方法论指南

### 0.5.1 OpenSpec（开源规范驱动开发框架）

- **OpenSpec 框架介绍** – 一个轻量级的 SDD 框架，主张在现有项目中引入 AI 辅助规范。它提供基于 Node.js 的 CLI 工具，可在工程目录中初始化并支持几乎所有主流 AI 编程工具。OpenSpec 强调快速反馈和迭代式设计，非常适合中小型项目或个人开发者使用。  
  https://www.51cto.com/aigc/11464.html （OpenSpec 框架介绍）

### 0.5.2 Spec-Kit（GitHub 官方 SDD 工具）

- **Spec-Kit 工具项目** – GitHub 团队官方出品的 SDD 工具集，提供端到端的规范驱动开发流程。它主张在编码前先明确需求和设计（如 Data Models、API 契约等），然后再交给 AI 实现代码与测试。Spec-Kit 功能完善，文档和示例丰富，适合中大型团队和高合规性项目。  
  https://www.51cto.com/aigc/11464.html （Spec-Kit 深度体验）

### 0.5.3 Superpowers（Claude Code 严格工作流插件）

- **Superpowers 插件介绍** – 一个高度自动化、零配置的 SDD 工作流插件，最初针对 Claude Code 设计，现已扩展支持 Codex、OpenCode、Gemini CLI 等多种 AI 编程工具。Superpowers 会在适当时候自动介入，强制要求开发者与 AI 之间进行结构化对话以明确需求和设计，从而确保交付质量。它内置严格的测试驱动开发（TDD）要求和子 Agent 调度机制，适合对代码质量要求极高的项目。  
  https://www.51cto.com/aigc/11464.html （Superpowers 深度体验）

### 0.5.4 GSD（Get-Shit-Done，简洁高效的 SDD 工具集）

- **GSD 工具集介绍** – 一个新崛起的 SDD 框架，旨在用简洁高效的方式解决 AI 编码中的“上下文腐烂”问题。它提供了一套命令，涵盖从项目启动到多阶段迭代的开发流程，又避免了 BMAD、Spec-Kit 等繁琐细节。GSD 将开发组织为 Project > Milestone > Phase 的清晰层级，每个阶段强制执行一个固定的多步循环（初始化->讨论->计划->执行->验证），以提高代码生成效率和质量。  
  https://www.51cto.com/aigc/11464.html （GSD 深度体验）

### 0.5.5 BMAD（AI 驱动的企业级敏捷开发框架）

- **BMAD 框架介绍** – 一个全生命周期的、多 Agent AI 驱动敏捷开发框架，着重模拟完整的敏捷开发流程。BMAD 内置基于敏捷开发方法论的完整工作流，通过多个核心阶段和相应的技能来逐步细化规范，从灵感捕获、需求规格、架构设计到实现与发布。它非常适合大型企业项目和多角色协作团队，但框架庞大复杂，对流程要求严格。  
  https://www.51cto.com/aigc/11464.html （BMAD 深度体验）
