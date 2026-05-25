---
id: "AIC-MODEL-2026"
title: "2026 AI Coding 模型选型指南：小型团队的最佳方案"
date: "2026-05-25"
tags: ["AI", "模型选型", "DeepSeek", "GLM-5.1", "MiniMax-M2.7", "Claude", "Coding Plan", "成本优化"]
personality: "精算师"
description: "基于日均1000-2000次调用、2000万Token的实际需求，深度对比国内25个平台AI编程助手的Coding Plan，给出性价比最优解。"
cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
priority: 8
---

> 当 AI Coding 从尝鲜变成日常，模型成本悄然成为仅次于人力的大头支出。如何在日均 2000 万 Token 的高频调用下，既保证编码能力不掉档，又把月度账单控制在合理范围？本文基于 codingplan 项目数据和官方定价，帮你算清楚这笔账。

## 需求背景

在正式对比之前，先明确我们的选型约束：

| 维度 | 约束 |
|------|------|
| **日均调用** | 1000~2000 次 |
| **日均 Token** | 约 2000万（输入+输出混合） |
| **日常模型偏好** | DeepSeek V4 Flash/Pro、GLM-5.1、MiniMax-M2.7 |
| **架构设计需求** | 需要一款高质量模型（GPT/Claude 级别） |
| **计费方式** | 偏好 Coding Plan 订阅制，避免按量计费的成本波动 |
| **预算目标** | 日常模型 ≤ ¥200/月，架构模型单独核算 |

---

## 一、平台套餐全览

> 数据来源：[codingplan 项目](https://github.com/wmpeng/codingplan)，涵盖 25+ 平台订阅套餐实时数据。
> 更新时间：2026.5.15

### 1.1 国内平台套餐对比

| 平台 | 套餐 | 类型 | 链接 | 评分 | 标签 | 首月价 | 连续包月 | 连续包季 | 连续包年 | 5小时请求 | 每周请求 | 每月请求 | Token上限 | 支持模型 | 其他权益 | 状态 | 备注 |
|------|------|------|------|------|------|--------|----------|----------|----------|-----------|----------|----------|----------|----------|----------|------|------|
| 智谱AI | Lite | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqzhipu) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | ¥46.55 | ¥49 | ¥132 ~~147~~/季 | ¥470 ~~588~~/年 | 1,200 | 6,000 | 24,000 | 无限制 | GLM-5.1, GLM-5-Turbo | 免费MCP次数 | 在售 | 3倍Claude Pro用量；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| 智谱AI | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqzhipu) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | ¥141.55 | ¥149 | ¥402 ~~447~~/季 | ¥1430 ~~1788~~/年 | 6,000 | 30,000 | 120,000 | 无限制 | GLM-5.1, GLM-5-Turbo, GLM-5 | 免费MCP次数 | 在售 | 5倍Lite用量；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| 智谱AI | Max | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqzhipu) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | ¥445.55 | ¥469 | ¥1266 ~~1407~~/季 | ¥4502 ~~5628~~/年 | 24,000 | 120,000 | 480,000 | 无限制 | GLM-5.1, GLM-5-Turbo, GLM-5 | 免费MCP次数 | 在售 | 20倍Lite用量；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| 智谱国际版 | Lite | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqzai) | ⭐️⭐️⭐️⭐️ | 模型强 | $16.2 | $18 | $49 ~~54~~/季 | $173 ~~216~~/年 | 1,200 | 6,000 | 24,000 | 无限制 | GLM-5.1, GLM-5-Turbo | 免费MCP次数 | 在售 | 3倍Claude Pro用量；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| 智谱国际版 | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqzai) | ⭐️⭐️⭐️⭐️ | 模型强 | $64.8 | $72 | $194 ~~216~~/季 | $691 ~~864~~/年 | 6,000 | 30,000 | 120,000 | 无限制 | GLM-5.1, GLM-5-Turbo, GLM-5 | 免费MCP次数 | 在售 | 5倍Lite用量；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| 智谱国际版 | Max | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqzai) | ⭐️⭐️⭐️⭐️ | 模型强 | $144 | $160 | $432 ~~480~~/季 | $1536 ~~1920~~/年 | 24,000 | 120,000 | 480,000 | 无限制 | GLM-5.1, GLM-5-Turbo, GLM-5 | 免费MCP次数 | 在售 | 4倍Pro用量；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| MiniMax | Starter | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqminimax) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | ¥26.1 | ¥29 | -/季 | ¥290 ~~348~~/年 | 600 | 6,000 | 24,000 | 无限制 | MiniMax-M2.7, MiniMax-M2.5 | - | 在售 | 约50TPS；官方只有周限量无月限量，按1月=4周计算 |
| MiniMax | Plus | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqminimax) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | ¥44.1 | ¥49 | -/季 | ¥490 ~~588~~/年 | 1,500 | 15,000 | 60,000 | 无限制 | MiniMax-M2.7, MiniMax-M2.5 | - | 在售 | 约50TPS；官方只有周限量无月限量，按1月=4周计算 |
| MiniMax | Max | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqminimax) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | ¥107.1 | ¥119 | -/季 | ¥1190 ~~1428~~/年 | 4,500 | 45,000 | 180,000 | 无限制 | MiniMax-M2.7, MiniMax-M2.5 | - | 在售 | 约50TPS；官方只有周限量无月限量，按1月=4周计算 |
| MiniMax | Plus-极速 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqminimax) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | ¥88.2 | ¥98 | -/季 | ¥980 ~~1176~~/年 | 1,500 | 15,000 | 60,000 | 无限制 | MiniMax-M2.7-highspeed, MiniMax-M2.5-highspeed | - | 在售 | 约100TPS；官方只有周限量无月限量，按1月=4周计算 |
| MiniMax | Max-极速 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqminimax) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | ¥179.1 | ¥199 | -/季 | ¥1990 ~~2388~~/年 | 4,500 | 45,000 | 180,000 | 无限制 | MiniMax-M2.7-highspeed, MiniMax-M2.5-highspeed | - | 在售 | 约100TPS；官方只有周限量无月限量，按1月=4周计算 |
| 讯飞·星火 | 专业版 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqxunfei) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | - | ¥39 | -/季 | -/年 | 1,200 | 9,000 | 18,000 | 无限制 | GLM-5.1, Qwen-3.5-Plus, MiniMax-M2.5, Kimi-K2.5, DeepSeek-V3.2 | - | 在售 | GLM-5.1已恢复200K上下文；讯飞实际用量比较高 |
| 讯飞·星火 | 高效版 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqxunfei) | ⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | - | ¥199 | -/季 | -/年 | 6,000 | 45,000 | 90,000 | 无限制 | GLM-5.1, Qwen-3.5-Plus, GLM-5, MiniMax-M2.5, Kimi-K2.5, DeepSeek-V3.2 | - | 在售 | GLM-5.1已恢复200K上下文；讯飞实际用量比较高 |
| Kimi | Andante | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqkimi) | ⭐️⭐️⭐️⭐️ | 模型强 | - | ¥49 | -/季 | ¥468 ~~588~~/年 | 未公开 | 未公开 | 未公开 | 无限制 | Kimi-K2.6, Kimi-K2.5, Kimi-K2 | - | 在售 | Agent 4倍速 |
| Kimi | Moderato | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqkimi) | ⭐️⭐️⭐️⭐️ | 模型强 | - | ¥99 | -/季 | ¥948 ~~1188~~/年 | 未公开 | 未公开 | 未公开 | 无限制 | Kimi-K2.6, Kimi-K2.5, Kimi-K2 | - | 在售 | 4倍额度, Agent多任务并行 |
| Kimi | Allegretto | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqkimi) | ⭐️⭐️⭐️⭐️ | 模型强 | - | ¥199 | -/季 | ¥1908 ~~2388~~/年 | 未公开 | 未公开 | 未公开 | 无限制 | Kimi-K2.6, Kimi-K2.5, Kimi-K2 | 免费Kimi-Claw | 在售 | 20倍额度 |
| Kimi | Allegro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqkimi) | ⭐️⭐️⭐️⭐️ | 模型强 | - | ¥699 | -/季 | ¥6708 ~~8388~~/年 | 未公开 | 未公开 | 未公开 | 无限制 | Kimi-K2.6, Kimi-K2.5, Kimi-K2 | 免费Kimi-Claw | 在售 | 60倍额度 |
| 字节·方舟 | Lite | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqfangzhou) | ⭐️⭐️⭐️⭐️ | 模型强 | ¥36 | ¥40 | -/季 | -/年 | 1,200 | 9,000 | 18,000 | 无限制 | Doubao-Seed-2.0, MiniMax-M2.7, Kimi-K2.6, GLM-5.1, DeepSeek-V3.2 | ArkClaw 7天体验 | 在售 | 5.8开始限购；模型倍率非常高，用量较低 |
| 字节·方舟 | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqfangzhou) | ⭐️⭐️⭐️⭐️ | 模型强 | ¥160 | ¥200 | -/季 | -/年 | 6,000 | 45,000 | 90,000 | 无限制 | Doubao-Seed-2.0, MiniMax-M2.7, Kimi-K2.6, GLM-5.1, DeepSeek-V3.2 | 免费ArkClaw | 在售 | 5.8开始限购；模型倍率非常高，用量较低 |
| 字节·方舟 | Small | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqfangzhout) | ⭐️⭐️⭐️ | 模型强 | - | ¥40 | -/季 | -/年 | 200 | 700 | 2,000 | 22M Tokens | Doubao-Seed-2.0, DeepSeek-V4-Pro, DeepSeek-V4-Flash, DeepSeek-V3.2, MiniMax-M2.7, GLM-5.1, Kimi-K2.6, Doubao-Seedream-5.0-lite | 联网搜索50次/月 | 在售 | 积分制AFP计费；按最优模型9倍系数计算，1AFP=1111Token |
| 字节·方舟 | Medium | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqfangzhout) | ⭐️⭐️⭐️ | 模型强 | - | ¥200 | -/季 | -/年 | 1,000 | 3,500 | 10,000 | 111M Tokens | Doubao-Seed-2.0, DeepSeek-V4-Pro, DeepSeek-V4-Flash, DeepSeek-V3.2, MiniMax-M2.7, GLM-5.1, Kimi-K2.6, Doubao-Seedream-5.0-lite, Doubao-Seedance-2.0 | 联网搜索150次/月 | 在售 | 积分制AFP计费；按最优模型9倍系数计算，1AFP=1111Token |
| 字节·方舟 | Large | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqfangzhout) | ⭐️⭐️⭐️ | 模型强 | - | ¥500 | -/季 | -/年 | 2,500 | 8,750 | 25,000 | 278M Tokens | Doubao-Seed-2.0, DeepSeek-V4-Pro, DeepSeek-V4-Flash, DeepSeek-V3.2, MiniMax-M2.7, GLM-5.1, Kimi-K2.6, Doubao-Seedream-5.0-lite, Doubao-Seedance-2.0 | 联网搜索400次/月 | 在售 | 积分制AFP计费；按最优模型9倍系数计算，1AFP=1111Token |
| 字节·方舟 | Max | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqfangzhout) | ⭐️⭐️⭐️ | 模型强 | - | ¥1000 | -/季 | -/年 | 5,000 | 17,500 | 50,000 | 556M Tokens | Doubao-Seed-2.0, DeepSeek-V4-Pro, DeepSeek-V4-Flash, DeepSeek-V3.2, MiniMax-M2.7, GLM-5.1, Kimi-K2.6, Doubao-Seedream-5.0-lite, Doubao-Seedance-2.0 | 联网搜索800次/月 | 在售 | 积分制AFP计费；按最优模型9倍系数计算，1AFP=1111Token |
| 阿里·百炼 | 标准 | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqbailiant) | ⭐️⭐️⭐️ | - | - | ¥198 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 150M Tokens | Qwen-3.6-Plus, Qwen-3.5-Plus, MiniMax-M2.5, DeepSeek-V3.2 | - | 在售 | Qwen-3.6-Plus，输入5K Token/Credit，输入命中25K Token/Credit，输出0.83K Token/Credit；按缓存命中率90%，输入输出9:1算，约5.85K Token/Credit |
| 阿里·百炼 | 高级 | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqbailiant) | ⭐️⭐️⭐️ | - | - | ¥698 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 600M Tokens | Qwen-3.6-Plus, Qwen-3.5-Plus, MiniMax-M2.5, DeepSeek-V3.2 | - | 在售 | Qwen-3.6-Plus，输入5K Token/Credit，输入命中25K Token/Credit，输出0.83K Token/Credit；按缓存命中率90%，输入输出9:1算，约5.85K Token/Credit |
| 阿里·百炼 | 尊享 | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqbailiant) | ⭐️⭐️⭐️ | - | - | ¥1398 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 1,500M Tokens | Qwen-3.6-Plus, Qwen-3.5-Plus, MiniMax-M2.5, DeepSeek-V3.2 | - | 在售 | Qwen-3.6-Plus，输入5K Token/Credit，输入命中25K Token/Credit，输出0.83K Token/Credit；按缓存命中率90%，输入输出9:1算，约5.85K Token/Credit |
| 阿里·百炼 | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqbailianc) | ⭐️⭐️⭐️⭐️ | 性价比高用量足 | - | ¥200 | -/季 | -/年 | 6,000 | 45,000 | 90,000 | 无限制 | Qwen-3.6-Plus, Qwen-3.5-Plus, MiniMax-M2.5, GLM-5, Kimi-K2.5 | - | 在售 | 开始限量购买了，不确定每天放不放，放多少 |
| 小米·MiMo | Lite | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqmimo) | ⭐️⭐️⭐️ | - | ¥34.32 | ¥39 | -/季 | ¥412 ~~468~~/年 | 无限制 | 无限制 | 无限制 | 30M Tokens | MiMo-V2.5-Pro, MiMo-V2.5, MiMo-V2.5-TTS, MiMo-V2-Pro, MiMo-V2-Omni | TTS限时免费 | 在售 | 60M Credits，无5小时限额，支持集中消耗；实际倍率：MiMo-V2.5:1x, Pro:2x |
| 小米·MiMo | Standard | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqmimo) | ⭐️⭐️⭐️ | - | ¥87.12 | ¥99 | -/季 | ¥1045 ~~1188~~/年 | 无限制 | 无限制 | 无限制 | 100M Tokens | MiMo-V2.5-Pro, MiMo-V2.5, MiMo-V2.5-TTS, MiMo-V2-Pro, MiMo-V2-Omni | TTS限时免费 | 在售 | 200M Credits，无5小时限额，支持集中消耗；实际倍率：MiMo-V2.5:1x, Pro:2x |
| 小米·MiMo | Pro | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqmimo) | ⭐️⭐️⭐️ | - | ¥289.52 | ¥329 | -/季 | ¥3474 ~~3948~~/年 | 无限制 | 无限制 | 无限制 | 350M Tokens | MiMo-V2.5-Pro, MiMo-V2.5, MiMo-V2.5-TTS, MiMo-V2-Pro, MiMo-V2-Omni | TTS限时免费 | 在售 | 700M Credits，无5小时限额，支持集中消耗；实际倍率：MiMo-V2.5:1x, Pro:2x |
| 小米·MiMo | Max | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqmimo) | ⭐️⭐️⭐️ | - | ¥579.92 | ¥659 | -/季 | ¥6959 ~~7908~~/年 | 无限制 | 无限制 | 无限制 | 800M Tokens | MiMo-V2.5-Pro, MiMo-V2.5, MiMo-V2.5-TTS, MiMo-V2-Pro, MiMo-V2-Omni | TTS限时免费 | 在售 | 1600M Credits，无5小时限额，支持集中消耗；实际倍率：MiMo-V2.5:1x, Pro:2x |
| 联通云 | Lite | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqunicomcp) | ⭐️⭐️⭐️⭐️ | 模型强 | - | ¥40 | -/季 | -/年 | 1,200 | 9,000 | 18,000 | 无限制 | DeepSeek-V4-Flash, GLM-5.1, GLM-5, MiniMax-M2.5, Qwen-3.5-Plus, Kimi-K2.5 | - | 在售 | 不同云区域可用模型不同 |
| 联通云 | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqunicomcp) | ⭐️⭐️⭐️⭐️ | 模型强 | - | ¥200 | -/季 | -/年 | 6,000 | 45,000 | 90,000 | 无限制 | DeepSeek-V4-Flash, GLM-5.1, GLM-5, MiniMax-M2.5, Qwen-3.5-Plus, Kimi-K2.5 | - | 在售 | 不同云区域可用模型不同 |
| 联通云 | 个人 Lite | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqunicomtp) | ⭐️ | - | - | ¥15 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 6M Tokens | DeepSeek-V4-Flash, MiniMax-M2.5 | - | 在售 | 上下文窗口目前仅支持200K |
| 联通云 | 个人 Pro | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqunicomtp) | ⭐️ | - | - | ¥30 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 12M Tokens | DeepSeek-V4-Flash, MiniMax-M2.5 | - | 在售 | 上下文窗口目前仅支持200K |
| 联通云 | 个人 Max | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqunicomtp) | ⭐️ | - | - | ¥45 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 18M Tokens | DeepSeek-V4-Flash, MiniMax-M2.5 | - | 在售 | 上下文窗口目前仅支持200K |
| 联通云 | 团队 Lite | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqunicomtp) | ⭐️⭐⭐ | 模型强 | - | ¥198 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 200M Tokens | DeepSeek-V4-Pro, DeepSeek-V4-Flash, MiniMax-M2.5 | - | 在售 | 以DeepSeek-V4-Pro为例25,000 credits约为2亿tokens |
| 联通云 | 团队 Pro | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqunicomtp) | ⭐️⭐⭐ | 模型强 | - | ¥698 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 800M Tokens | DeepSeek-V4-Pro, DeepSeek-V4-Flash, MiniMax-M2.5 | - | 在售 | 以DeepSeek-V4-Pro为例25,000 credits约为2亿tokens |
| 联通云 | 团队 Max | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqunicomtp) | ⭐️⭐⭐ | 模型强 | - | ¥1398 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 2,000M Tokens | DeepSeek-V4-Pro, DeepSeek-V4-Flash, MiniMax-M2.5 | - | 在售 | 以DeepSeek-V4-Pro为例25,000 credits约为2亿tokens |
| 百度·千帆 | Lite | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqqianfan) | ⭐️⭐⭐ | - | - | ¥40 | -/季 | -/年 | 1,200 | 9,000 | 18,000 | 无限制 | GLM-5, Kimi-K2.5, MiniMax-M2.5, DeepSeek-V3.2 | - | 在售 | 使用订阅链接可以获得百度搜索额度，支持Baidu Search Skill |
| 百度·千帆 | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqqianfan) | ⭐️⭐⭐ | - | - | ¥200 | -/季 | -/年 | 6,000 | 45,000 | 90,000 | 无限制 | GLM-5, Kimi-K2.5, MiniMax-M2.5, DeepSeek-V3.2 | - | 在售 | 使用订阅链接可以获得百度搜索额度，支持Baidu Search Skill |
| 京东云 | Lite | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqjingdong) | ⭐️⭐⭐ | - | ¥19.9 | ¥40 | -/季 | -/年 | 1,200 | 9,000 | 18,000 | 无限制 | Kimi-K2.5, GLM-5, MiniMax-M2.5, DeepSeek-V3.2, Qwen-3-Coder | - | 在售 | - |
| 京东云 | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqjingdong) | ⭐️⭐⭐ | - | ¥99.9 | ¥200 | -/季 | -/年 | 6,000 | 45,000 | 90,000 | 无限制 | Kimi-K2.5, GLM-5, MiniMax-M2.5, DeepSeek-V3.2, Qwen-3-Coder | - | 在售 | - |
| 腾讯云 | Lite | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqtengxunt) | ⭐️⭐ | 模型强 | - | ¥39 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 35M Tokens | HY-2.0, GLM-5.1, MiniMax-M2.7, Kimi-K2.5 | - | 在售 | 注意此为TokenPlan，而非CodingPlan。35M Tokens额度，约70轮问答 |
| 腾讯云 | Standard | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqtengxunt) | ⭐️⭐ | 模型强 | - | ¥99 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 100M Tokens | HY-2.0, GLM-5.1, MiniMax-M2.7, Kimi-K2.5 | - | 在售 | 注意此为TokenPlan，而非CodingPlan。100M Tokens额度，可执行约200轮问答 |
| 腾讯云 | Pro | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqtengxunt) | ⭐️⭐ | 模型强 | - | ¥299 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 320M Tokens | HY-2.0, GLM-5.1, MiniMax-M2.7, Kimi-K2.5 | - | 在售 | 注意此为TokenPlan，而非CodingPlan。320M Tokens额度 |
| 腾讯云 | Max | Token Plan | [跳转](https://api.dreamfree.space/c/s/cpyqtengxunt) | ⭐️⭐ | 模型强 | - | ¥599 | -/季 | -/年 | 无限制 | 无限制 | 无限制 | 650M Tokens | HY-2.0, GLM-5.1, MiniMax-M2.7, Kimi-K2.5 | - | 在售 | 注意此为TokenPlan，而非CodingPlan。650M Tokens额度 |
| 优云智算 | Mini 迷你版 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqyyzs) | ⭐️⭐⭐ | 模型强 | - | ¥49 | -/季 | -/年 | 300 | 750 | 1,900 | 无限制 | GLM-5.1, Kimi-K2.6, MiniMax-M2.7, DeepSeek-V4-Flash, DeepSeek-V3.2 | - | 在售 | 倍率：DS-V3.2 x1，DS-V4-Flash x1，M2.7 x2，K2.6 x5，GLM-5.1 x6；限流：3并发 |
| 优云智算 | Lite 入门版 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqyyzs) | ⭐️⭐⭐ | 模型强 | - | ¥99 | -/季 | -/年 | 600 | 1,500 | 3,800 | 无限制 | GLM-5.1, Kimi-K2.6, MiniMax-M2.7, DeepSeek-V4-Flash, DeepSeek-V3.2 | - | 在售 | 倍率：DS-V3.2 x1，DS-V4-Flash x1，M2.7 x2，K2.6 x5，GLM-5.1 x6；限流：5并发 |
| 优云智算 | Basic 基础版 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqyyzs) | ⭐️⭐⭐ | 模型强 | - | ¥199 | -/季 | -/年 | 1,200 | 3,000 | 7,600 | 无限制 | GLM-5.1, Kimi-K2.6, MiniMax-M2.7, DeepSeek-V4-Flash, DeepSeek-V3.2 | - | 在售 | 倍率：DS-V3.2 x1，DS-V4-Flash x1，M2.7 x2，K2.6 x5，GLM-5.1 x6；限流：10并发 |
| 优云智算 | Pro 增强版 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqyyzs) | ⭐️⭐⭐ | 模型强 | - | ¥499 | -/季 | -/年 | 3,000 | 7,500 | 19,000 | 无限制 | GLM-5.1, Kimi-K2.6, MiniMax-M2.7, DeepSeek-V4-Flash, DeepSeek-V3.2 | - | 在售 | 倍率：DS-V3.2 x1，DS-V4-Flash x1，M2.7 x2，K2.6 x5，GLM-5.1 x6；限流：10并发 |
| 优云智算 | Max 高级版 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqyyzs) | ⭐️⭐⭐ | 模型强 | - | ¥799 | -/季 | -/年 | 4,800 | 12,000 | 31,000 | 无限制 | GLM-5.1, Kimi-K2.6, MiniMax-M2.7, DeepSeek-V4-Flash, DeepSeek-V3.2 | - | 在售 | 倍率：DS-V3.2 x1，DS-V4-Flash x1，M2.7 x2，K2.6 x5，GLM-5.1 x6；限流：10并发 |
| 优云智算 | Ultra 畅享版 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqyyzs) | ⭐️⭐⭐ | 模型强 | - | ¥999 | -/季 | -/年 | 6,000 | 15,000 | 39,000 | 无限制 | GLM-5.1, Kimi-K2.6, MiniMax-M2.7, DeepSeek-V4-Flash, DeepSeek-V3.2 | - | 在售 | 倍率：DS-V3.2 x1，DS-V4-Flash x1，M2.7 x2，K2.6 x5，GLM-5.1 x6；限流：10并发 |
| 阶跃星辰 | Flash Mini | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqstepfun) | ⭐️⭐ | - | - | ¥49 | -/季 | -/年 | 1,500 | 6,000 | 24,000 | 无限制 | step-3.5-flash-2603, step-3.5-flash, step-router-v1 | - | 在售 | 当前主打Step自有模型，模型较弱；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| 阶跃星辰 | Flash Plus | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqstepfun) | ⭐️⭐ | - | - | ¥99 | -/季 | -/年 | 6,000 | 24,000 | 96,000 | 无限制 | step-3.5-flash-2603, step-3.5-flash, step-router-v1 | - | 在售 | 当前主打Step自有模型，模型较弱；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| 阶跃星辰 | Flash Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqstepfun) | ⭐️⭐ | - | - | ¥199 | -/季 | -/年 | 22,500 | 90,000 | 360,000 | 无限制 | step-3.5-flash-2603, step-3.5-flash, step-router-v1 | - | 在售 | 当前主打Step自有模型，模型较弱；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| 阶跃星辰 | Flash Max | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqstepfun) | ⭐️⭐ | - | - | ¥699 | -/季 | -/年 | 75,000 | 300,000 | 1,200,000 | 无限制 | step-3.5-flash-2603, step-3.5-flash, step-router-v1 | - | 在售 | 当前主打Step自有模型，模型较弱；官方以prompt计数，按1prompt≈15次请求换算；官方只有周限量无月限量，按1月=4周计算 |
| 移动云 | Lite | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqmobilecp) | ⭐️⭐⭐ | - | ¥7.9 | ¥40 | -/季 | -/年 | 1,200 | 9,000 | 18,000 | 无限制 | MiniMax-M2.5 | - | 在售 | 模型较弱；活动价首月7.9元，标准价40元/月 |
| 移动云 | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqmobilecp) | ⭐️⭐⭐ | - | ¥39.9 | ¥200 | -/季 | -/年 | 6,000 | 45,000 | 90,000 | 无限制 | MiniMax-M2.5 | - | 在售 | 模型较弱；活动价首月7.9元，标准价40元/月 |
| 超算互联网 | Lite | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqscnetcp) | ⭐️⭐ | 性价比高用量足 | - | ¥20 | -/季 | -/年 | 1,200 | 9,000 | 18,000 | 无限制 | MiniMax-M2.5, Qwen-3-235B-A22B | - | 在售 | 模型较弱 |
| 超算互联网 | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqscnetcp) | ⭐️⭐ | 性价比高用量足 | - | ¥100 | -/季 | -/年 | 6,000 | 45,000 | 90,000 | 无限制 | MiniMax-M2.5, Qwen-3-235B-A22B | - | 在售 | 模型较弱 |
| 摩尔线程 | Free Trial | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqmoorefree) | ⭐️⭐⭐ | 性价比高用量足 | ¥0 | ¥0 | -/季 | -/年 | 未公开 | 未公开 | 未公开 | 无限制 | GLM-4.7 | - | 在售 | 模型较弱；Free Trial每天上午10:00发放，限量100名，30天有效 |
| 商汤·日日新 | Free（公测） | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqsensenova) | ⭐️⭐⭐ | 性价比高用量足 | ¥0 | ¥0 | -/季 | -/年 | 1,500 | 未公开 | 未公开 | 未公开 | SenseNova 6.7 Flash-Lite, SenseNova U1 Fast, DeepSeek-V4-Flash | 256K上下文 | 在售 | 模型较弱；免费公测，Lite/Pro未上线；日额度：SenseNova 6.7 Flash-Lite 1500次、SenseNova U1 Fast 1500次、DeepSeek-V4-Flash 150次 |
| OpenCode Go | Go | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqopencode) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | $5 | $10 | -/季 | -/年 | 未公开 | 未公开 | 未公开 | 未公开 | GLM-5.1, GLM-5, Kimi-K2.6, MiMo-V2.5-Pro, MiMo-V2.5, Qwen-3.5-Plus, Qwen-3.6-Plus, MiniMax-M2.7, MiniMax-M2.5, DeepSeek-V4-Pro, DeepSeek-V4-Flash | 首月半价 | 在售 | 套餐额度按美元Credits计：基础12美元、周额度30美元、月额度60美元；实际计费按token消耗 |
| Ollama | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqollama) | ⭐️⭐⭐ | 模型强 | - | $20 | -/季 | $200 ~~240~~/年 | 未公开 | 未公开 | 未公开 | 未公开 | Kimi-K2.6, GLM-5.1, DeepSeek-V4-Pro, DeepSeek-V4-Flash, MiniMax-M2.7, Qwen-3-Coder, Qwen-3-Coder-next, Gemini-3-Flash-Preview, Mistral-Large-3 | 3个并发任务 | 在售 | 支持GLM-5.1、Kimi-K2.6、MiniMax-M2.7、DeepSeek-V4-Pro，模型池很大；Pro为Free的50倍额度；可选年付200美元 |
| Ollama | Max | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqollama) | ⭐️⭐⭐ | 模型强 | - | $100 | -/季 | -/年 | 未公开 | 未公开 | 未公开 | 未公开 | Kimi-K2.6, GLM-5.1, DeepSeek-V4-Pro, DeepSeek-V4-Flash, MiniMax-M2.7, Qwen-3-Coder, Qwen-3-Coder-next, Gemini-3-Flash-Preview, Mistral-Large-3 | 10个并发任务 | 在售 | 支持GLM-5.1、Kimi-K2.6、MiniMax-M2.7、DeepSeek-V4-Pro，模型池很大；Max为Pro的5倍额度 |
| OpenAI Codex | Plus | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqchatgpt) | ⭐️⭐⭐⭐️ | 模型强 | - | $20 | -/季 | -/年 | Plus基准 | Plus基准 | 未公开 | 未公开 | GPT-5.5, GPT-5.4, GPT-5.3-Codex, GPT-5.2, GPT-5.4-mini, GPT-Image-2.0 | 可购买额外积分 | 在售 | 原生Codex套餐；官方按5小时与每周额度管理 |
| OpenAI Codex | Pro *5 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqchatgpt) | ⭐️⭐⭐⭐️ | 模型强 | - | $100 | -/季 | -/年 | Plus的5倍 | Plus的5倍 | 未公开 | 未公开 | GPT-5.5, GPT-5.4, GPT-5.3-Codex, GPT-5.2, GPT-5.4-mini, GPT-Image-2.0 | 可购买额外积分 | 在售 | 原生Codex套餐；截至5月31日前可限时享Plus的10倍额度；6月1日起改按Token计费 |
| OpenAI Codex | Pro *20 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqchatgpt) | ⭐️⭐⭐⭐️ | 模型强 | - | $200 | -/季 | -/年 | Plus的20倍 | Plus的20倍 | 未公开 | 未公开 | GPT-5.5, GPT-5.4, GPT-5.3-Codex, GPT-5.2, GPT-5.4-mini, GPT-Image-2.0 | 可购买额外积分 | 在售 | 原生Codex套餐；官方按5小时与每周额度管理 |
| Claude Code | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqclaudeup) | ⭐️⭐⭐⭐️ | 模型强 | - | $20 | -/季 | -/年 | Pro基准 | Pro基准 | 未公开 | 未公开 | Claude Sonnet 4.6, Claude Sonnet 4.5, Claude Opus 4.7, Claude Opus 4.6, Claude Opus 4.5, Claude Haiku 4.5 | 原生Claude Code体验 | 在售 | 原生Claude Code体验；部分用户订阅时可能被要求实名认证；套餐额度不可用于OpenClaw、Hermes等第三方编程Agent |
| Claude Code | Max *5 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqclaudeup) | ⭐️⭐⭐⭐️ | 模型强 | - | $100 | -/季 | -/年 | Pro的5倍 | Pro的5倍 | 未公开 | 未公开 | Claude Sonnet 4.6, Claude Sonnet 4.5, Claude Opus 4.7, Claude Opus 4.6, Claude Opus 4.5, Claude Haiku 4.5 | 原生Claude Code体验 | 在售 | 原生Claude Code体验；部分用户订阅时可能被要求实名认证；套餐额度不可用于OpenClaw、Hermes等第三方编程Agent |
| Claude Code | Max *20 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqclaudeup) | ⭐️⭐⭐⭐️ | 模型强 | - | $200 | -/季 | -/年 | Pro的20倍 | Pro的20倍 | 未公开 | 未公开 | Claude Sonnet 4.6, Claude Sonnet 4.5, Claude Opus 4.7, Claude Opus 4.6, Claude Opus 4.5, Claude Haiku 4.5 | 原生Claude Code体验 | 在售 | 原生Claude Code体验；部分用户订阅时可能被要求实名认证；套餐额度不可用于OpenClaw、Hermes等第三方编程Agent |
| GitHub Copilot | 学生 | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqghstudent) | ⭐️⭐️⭐️⭐️⭐️ | 模型强/性价比高用量足 | $0 | $0 | -/季 | -/年 | 未公开 | 未公开 | 300 | 未公开 | GPT-4o, GPT-4.1, GPT-5-mini, GPT-5.2-Codex, Gemini 3.1 Pro, Claude Haiku 4.5, Grok Code Fast 1 | 学生认证免费 | 在售 | 学生认证免费，高级模型可对话300次；存在周限额和session限额，不同模型有不同扣减倍率；学生版可通过Auto模式路由至GPT-5.3-Codex |
| GitHub Copilot | Pro | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqghcopilot) | ⭐️⭐⭐⭐️ | 模型强 | - | $10 | -/季 | -/年 | 未公开 | 未公开 | 300 | 未公开 | GPT-5.3-Codex, GPT-5.4, Claude Sonnet 4.6, Gemini 3.1 Pro, Grok Code Fast 1 | 1000积分 | 在售 | 次数为对话次数，而非接口请求次数；存在周限额和session限额；不同模型有不同高级模型扣减倍率；目前暂时关闭新用户订阅权益激活 |
| GitHub Copilot | Pro+ | Coding Plan | [跳转](https://api.dreamfree.space/c/s/cpyqghcopilotp) | ⭐️⭐⭐⭐️ | 模型强 | - | $39 | -/季 | -/年 | 未公开 | 未公开 | 1,500 | 未公开 | GPT-5.5, GPT-5.4, GPT-5.3-Codex, Claude Opus 4.7, Claude Sonnet 4.6, Gemini 3.1 Pro | 3900积分 | 在售 | 次数为对话次数，而非接口请求次数；存在周限额和session限额；不同模型有不同高级模型扣减倍率；官方说明自6月1日起统一改用token计费模式 |

> **说明**：包季/包年价格中划线数字为原始价格（包月×3或包月×12），未划线为实际优惠价格。使用邀请链接部分平台可享优惠。

---

## 二、日常主力模型：智谱 GLM Pro

### 2.1 为什么选 GLM Pro 作为日常主力？

| 维度 | GLM-5.1 Pro | 备注 |
|------|-------------|------|
| **月度成本** | ¥149/月 | 不限量请求 |
| **编码能力** | SWE-Bench Pro 58.4% | 全球SOTA，超越GPT-5.4/Claude Opus 4.6 |
| **上下文** | 200K tokens | 够用 |
| **特色功能** | 8小时自主执行、Thinking模式、MCP集成、JSON输出 | - |
| **生态** | 免费MCP次数、兼容Claude Code/OpenClaw工作流 | - |
| **请求配额** | 120,000次/月 | 日均4000次，满足高频需求 |

### 2.2 GLM Pro vs 其他国内方案

| 方案 | 月费 | 编码能力 | 请求配额 | 上下文 | 适合场景 |
|------|------|----------|----------|--------|----------|
| **GLM Pro** | ¥149 | SWE-Bench 58.4% | 120K/月 | 200K | **日常主力首选** |
| MiniMax Max | ¥119 | SWE-Pro 56.22% | 180K/月 | 205K | 中度使用 |
| Kimi Allegretto | ¥199 | K2.6编码 | 无限制 | 256K | 多模态需求 |
| V4-Flash（按量） | ¥380(估) | ~50% | 不限量 | 1M | 超长上下文 |

**结论**：综合价格、能力、请求配额，GLM Pro 是日均2000万Token场景下性价比最高的选择。

---

## 三、架构设计模型：OpenAI Codex vs Claude Code

### 3.1 海外平台架构模型对比

| 模型 | 月费 | 编码能力 | 上下文 | 适用场景 |
|------|------|----------|--------|----------|
| **OpenAI Codex Plus** | $20/月 | GPT-5.5/5.4/5.3-Codex | 128K | 常规架构设计 |
| **OpenAI Codex Pro *5** | $100/月 | GPT-5.5/5.4/5.3-Codex（5倍额度） | 128K | 高频架构设计 |
| **OpenAI Codex Pro *20** | $200/月 | GPT-5.5/5.4/5.3-Codex（20倍额度） | 128K | 超大型系统架构 |
| **Claude Code Pro** | $20/月 | Claude Opus/Sonnet 4.6 | 200K | 常规架构设计 |
| **Claude Code Max *5** | $100/月 | Claude Opus/Sonnet 4.6（5倍额度） | 1M | 复杂系统架构 |
| **Claude Code Max *20** | $200/月 | Claude Opus/Sonnet 4.6（20倍额度） | 1M | 超大型系统架构 |

### 3.2 推荐方案

**主推：Claude Code Pro（$20/月，约 ¥136/月）**
- 价格亲民，Claude Opus/Sonnet 4.6 系列能力强，200K 上下文
- 适合常规架构设计和技术评审

**备选：OpenAI Codex Plus（$20/月，约 ¥136/月）**
- GPT-5 系列能力强，生态成熟
- 适合需要 GPT 模型特色的场景

**高端：Claude Code Max *5（$100/月，约 ¥678/月）**
- Pro 的 5 倍额度，1M 上下文
- 适合复杂系统架构、技术战略决策

**顶配：Claude Code Max *20（$200/月，约 ¥1,356/月）**
- Pro 的 20 倍额度，1M 上下文
- 适合超大型系统架构

---

## 四、综合选型方案

### 方案A（推荐：日常 GLM Pro + 架构 Claude Code Pro）¥285/月

| 用途 | 模型 | 方案 | 月度成本 | 每月请求 |
|------|------|------|----------|----------|
| 日常编码 | **智谱 GLM Pro** | Coding Plan | ¥149/月 | 120,000 |
| 架构设计 | **Claude Code Pro** | Coding Plan | ~¥136/月 | 未公开 |
| **合计** | | | **¥285/月** | - |

### 方案B（高端：日常 GLM Pro + 架构 Claude Code Max *5）¥827/月

| 用途 | 模型 | 方案 | 月度成本 | 每月请求 |
|------|------|------|----------|----------|
| 日常编码 | **智谱 GLM Pro** | Coding Plan | ¥149/月 | 120,000 |
| 架构设计 | **Claude Code Max *5** | Coding Plan | ~¥678/月 | 5倍Pro额度 |
| **合计** | | | **¥827/月** | - |

### 方案C（纯国内：日常 MiniMax Max + 架构 GLM Pro）¥268/月

| 用途 | 模型 | 方案 | 月度成本 | 每月请求 |
|------|------|------|----------|----------|
| 日常编码 | **MiniMax Max** | Coding Plan | ¥119/月 | 180,000 |
| 架构设计 | **智谱 GLM Pro** | Coding Plan | ¥149/月 | 120,000 |
| **合计** | | | **¥268/月** | -

---

## 五、能力维度对比

| 能力维度 | GLM-5.1 Pro | MiniMax Max | DeepSeek-V4-Flash | OpenAI Codex Plus | Claude Code Pro |
|----------|-------------|-------------|-------------------|-------------------|-----------------|
| **上下文** | 200K | 205K | 1M | 128K | 200K |
| **月度成本** | ¥149 | ¥119 | 按量 | ¥136 | ¥136 |
| **每月请求** | 120,000 | 180,000 | 未公开 | 未公开 | 未公开 |
| **编码特长** | SWE-Bench 58.4% | SWE-Pro 56.22% | 高并发2500 | GPT-5系列 | Claude Opus/Sonnet 4.6 |
| **自主执行** | ✅ 8小时 | ❌ | ❌ | ❌ | ❌ |
| **MCP支持** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 六、最终结论

### 主推方案：日常智谱 GLM Pro + 架构 Claude Code Pro

```
日常编码：智谱 GLM Pro（Coding Plan Pro，¥149/月，120K请求）
架构设计：Claude Code Pro（Coding Plan，¥136/月，未公开）
月度总成本：¥285/月
```

### 决策逻辑图

```
日均调用 < 500次?
  ├── 是 → MiniMax Plus（¥49/月）足够
  └── 否 → 日均 1000-2000次 → GLM Pro（¥149/月）

架构设计?
  ├── 常规架构 → Claude Code Pro（¥136/月）
  └── 复杂系统/技术战略 → Claude Code Max *5（¥678/月）或 Max *20（¥1,356/月）
```



### 为什么不是按量计费的 DeepSeek V4 系列？

1. **成本不可预测**：按量计费意味着成本随业务波动，高峰期账单可能失控
2. **无订阅保障**：突发大项目时没有价格保护机制
3. **国内平台订阅优势**：GLM Pro ¥149/月 不限量，性价比远超按量模式

---

## 附录一：平台推荐 Top 5

| 排名 | 平台 | 推荐理由 | 价格范围 |
|------|------|----------|----------|
| 🥇 | **智谱AI** | GLM-5.1模型强，免费MCP次数，Coding Plan完善 | ¥46-469/月 |
| 🥈 | **MiniMax** | 价格最低，独占M2.7模型 | ¥26-179/月 |
| 🥉 | **讯飞·星火** | GLM-5.1支持，¥39即享 | ¥39-199/月 |
| 4 | **Kimi** | 支持K2.6，多模态支持 | ¥49-699/月 |
| 5 | **字节·方舟** | 多模型支持，Doubao-Seed-2.0 | ¥40-200/月 |

## 附录二：参考来源

| 来源 | 链接 |
|------|------|
| CodingPlan 项目（25平台AI编程助手对比） | https://github.com/wmpeng/codingplan |
| DeepSeek 官方定价 | https://api-docs.deepseek.com/zh-cn/quick_start/pricing |
| GLM-5.1 智谱AI | https://www.zhipuai.cn/ |
| MiniMax 官网 | https://www.minimax.io/ |

