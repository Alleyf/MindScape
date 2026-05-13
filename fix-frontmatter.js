const fs = require('fs');

const files = [
  {fp: 'content/posts/ai-coding-tutor.md', info: {title: 'AI 编程导师', date: '2026-05-11', tags: ['ai', 'coding', 'tutor'], desc: 'AI 编程工具与环境配置指南，涵盖 Claude Code、Codex 等主流 AI 编码助手的安装、配置与使用教程'}},
  {fp: 'content/posts/前端开发/Html5_Css_Js.md', info: {title: 'Html5+Css+Js', date: '2022-09-10', tags: ['HTML', 'CSS', 'JavaScript', '前端'], desc: 'HTML5、CSS、JavaScript 前端三件套学习笔记'}},
  {fp: 'content/posts/前端开发/Vue.md', info: {title: '初识Vue', date: '2023-04-16', tags: ['Vue', '前端', '框架'], desc: 'Vue 框架快速入门教程'}},
  {fp: 'content/posts/前端开发/uni-app.md', info: {title: '初识 uni-app', date: '2023-04-16', tags: ['uni-app', '前端', '跨平台'], desc: 'uni-app 跨平台开发框架入门'}},
  {fp: 'content/posts/中间件和工具/正则表达式-Regex.md', info: {title: '正则表达式-Regex', date: '2023-12-01', tags: ['正则表达式', 'Regex', '工具'], desc: '正则表达式学习指南'}},
  {fp: 'content/posts/中间件和工具/Redis-缓存之美.md', info: {title: 'Redis-缓存之美', date: '2023-11-25', tags: ['Redis', '缓存', 'NoSQL'], desc: 'Redis 缓存数据库学习笔记'}},
  {fp: 'content/posts/中间件和工具/常用软件和环境.md', info: {title: '常用软件和环境', date: '2024-07-05', tags: ['工具', '开发环境'], desc: '程序员必备软件和环境配置'}},
  {fp: 'content/posts/中间件和工具/Captainbed.cn 人工智能教程.md', info: {title: 'Captainbed.cn 人工智能教程', date: '2026-01-07', tags: ['人工智能', '机器学习', '教程网站'], desc: 'Captainbed.cn 人工智能教程网站介绍'}},
  {fp: 'content/posts/中间件和工具/JMeter 压力测试.md', info: {title: 'JMeter 压力测试', date: '2026-03-17', tags: ['JMeter', '性能测试'], desc: 'JMeter 压力测试学习指南'}}
];

files.forEach(({fp, info}) => {
  try {
    let content = fs.readFileSync(fp, 'utf-8');
    let body = content;
    if (content.startsWith('---')) {
      const parts = content.split(/^---$/m, 3);
      if (parts.length >= 3) body = parts[2];
    }
    const slug = fp.replace(/[\/\]/g, '-');
    const newFm = `---
title: "${info.title}"
date: "${info.date}"
tags: ${JSON.stringify(info.tags)}
personality: "沉思者"
description: "${info.desc}"
cover: "https://picsum.photos/seed/${slug}/1200/630"
---`;
    fs.writeFileSync(fp, newFm + '\n' + body.trimStart());
    console.log('Fixed:', fp);
  } catch(e) { console.error('Error:', fp, e.message); }
});
