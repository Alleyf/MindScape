// Resource data — loaded from MD files at /content/config/
//
// MD files are loaded via import.meta.glob at build time.
// Front matter is parsed with gray-matter (already a dependency).
//
// Default fallback data is embedded for resilience.

import matter from 'gray-matter';

// Load MD files at build time
const mdModules = import.meta.glob('/content/config/*.md', { query: '?raw', import: 'default' });

// Default fallback data (same as in MD files, for resilience)
const DEFAULT_RESOURCE_CATEGORIES = [
  {
    title: 'AI 编程',
    icon: 'M12 3c-1.5 2-5 4-8 4 0 5 2 11 8 14 6-3 8-9 8-14-3 0-6.5-2-8-4Z',
    items: [
      { name: 'Claude Code', desc: 'Anthropic 官方 CLI 编程助手，支持 Plan/Act 模式', url: 'https://code.claude.com/docs/en/overview' },
      { name: 'Cursor', desc: 'AI-First 代码编辑器，深度集成多模型对话', url: 'https://cursor.sh/' },
      { name: 'GitHub Copilot', desc: 'GitHub 推出的 AI 编程助手，支持多种 IDE', url: 'https://github.com/features/copilot' },
      { name: 'OpenAI Codex', desc: 'OpenAI 代码生成模型，ChatGPT 插件生态', url: 'https://github.com/openai/codex' },
      { name: 'CC-Switch', desc: 'Claude Code 多模型切换工具', url: 'https://github.com/farion1231/cc-switch' },
      { name: 'OpenClaw', desc: 'AI 编程生态聚合平台', url: 'https://openclaw.ai/' },
    ],
  },
  {
    title: '前端开发',
    icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    items: [
      { name: 'React', desc: '用于构建用户界面的 JavaScript 库', url: 'https://react.dev/' },
      { name: 'Vite', desc: '下一代前端构建工具，极速 HMR', url: 'https://vitejs.dev/' },
      { name: 'Tailwind CSS', desc: 'Utility-First CSS 框架', url: 'https://tailwindcss.com/' },
      { name: 'TypeScript', desc: '带有类型系统的 JavaScript 超集', url: 'https://www.typescriptlang.org/' },
      { name: 'Next.js', desc: 'React 全栈框架，支持 SSR/SSG', url: 'https://nextjs.org/' },
      { name: 'Framer Motion', desc: 'React 动画库，声明式交互动画', url: 'https://www.framer.com/motion/' },
    ],
  },
  {
    title: '开发工具',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    items: [
      { name: 'VS Code', desc: '轻量级代码编辑器，海量扩展生态', url: 'https://code.visualstudio.com/' },
      { name: 'WebStorm', desc: 'JetBrains 前端 IDE，智能代码分析', url: 'https://www.jetbrains.com/webstorm/' },
      { name: 'Arc Browser', desc: '现代化浏览器，垂直标签和空间管理', url: 'https://arc.net/' },
      { name: 'iTerm2', desc: 'macOS 终端替代品，分屏和配置丰富', url: 'https://iterm2.com/' },
      { name: 'Warp', desc: 'Rust 编写的现代化终端，AI 辅助', url: 'https://www.warp.dev/' },
      { name: 'Raycast', desc: 'macOS 效率启动器，开发者友好', url: 'https://www.raycast.com/' },
    ],
  },
  {
    title: '知识管理',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    items: [
      { name: 'Obsidian', desc: '本地优先的知识库，双向链接和图谱', url: 'https://obsidian.md/' },
      { name: 'Notion', desc: 'All-in-One 工作空间，文档和数据库', url: 'https://www.notion.so/' },
      { name: 'Logseq', desc: '开源知识管理，大纲和双向链接', url: 'https://logseq.com/' },
      { name: 'Heptabase', desc: '可视化白板笔记，思维导图式管理', url: 'https://heptabase.com/' },
      { name: 'Readwise', desc: '阅读高亮和笔记聚合工具', url: 'https://readwise.io/' },
      { name: 'Memos', desc: '开源轻量笔记，类 Twitter 风格', url: 'https://usememos.com/' },
    ],
  },
  {
    title: '学习资源',
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14zm0 0l-6.16-3.422a12.083 12.083 0 0 0-.665 6.479A11.952 11.952 0 0 0 12 20.055',
    items: [
      { name: 'MDN Web Docs', desc: 'Web 标准权威文档，HTML/CSS/JS 参考', url: 'https://developer.mozilla.org/zh-CN/' },
      { name: 'Roadmap.sh', desc: '开发者学习路线图，覆盖全技术栈', url: 'https://roadmap.sh/' },
      { name: 'Learn Git Branching', desc: '交互式 Git 学习，可视化分支练习', url: 'https://learngitbranching.js.org/' },
      { name: 'JavaScript.info', desc: '现代 JavaScript 教程，从入门到深入', url: 'https://javascript.info/' },
      { name: 'Patterns.dev', desc: '现代 Web 应用设计模式与最佳实践', url: 'https://www.patterns.dev/' },
      { name: 'Developer Roadmaps', desc: 'JavaGuide 编程学习路线', url: 'https://javaguide.cn/' },
    ],
  },
  {
    title: '部署与运维',
    icon: 'M5 12h14M12 5l7 7-7 7',
    items: [
      { name: 'Vercel', desc: '前端部署平台，原生支持 React/Next.js', url: 'https://vercel.com/' },
      { name: 'Netlify', desc: '静态网站托管，支持 Serverless 函数', url: 'https://www.netlify.com/' },
      { name: 'Cloudflare Pages', desc: '边缘计算部署，全球 CDN 加速', url: 'https://pages.cloudflare.com/' },
      { name: 'Railway', desc: '全栈部署平台，数据库和容器托管', url: 'https://railway.app/' },
      { name: 'Docker', desc: '应用容器化，环境一致性和快速部署', url: 'https://www.docker.com/' },
      { name: 'Supabase', desc: '开源 Firebase 替代，BaaS 后端服务', url: 'https://supabase.com/' },
    ],
  },
];

const DEFAULT_LEARNING_ROUTES = [
  {
    id: 'ai-coding',
    title: 'AI Coding 入门到实战',
    summary: '从基础扫盲、工具安装到 Spec / GSD 工作流，适合想系统建立 AI 编程习惯的开发者。',
    accent: '#d97757',
    resources: [
      { type: '扫盲', title: '云途 AGI', url: 'https://www.yuntuagi.cn/series/ai-literacy' },
      { type: '扫盲', title: 'JavaGuide AI', url: 'https://javaguide.cn/ai/' },
      { type: '工具', title: 'Claude Code', url: 'https://code.claude.com/docs/en/overview' },
      { type: '工具', title: 'OpenAI Codex', url: 'https://github.com/openai/codex' },
      { type: '工具', title: 'CC-Switch', url: 'https://github.com/farion1231/cc-switch' },
      { type: '生态', title: 'OpenClaw', url: 'https://openclaw.ai/' },
      { type: '生态', title: 'Hermes Agent', url: 'https://hermesagent.org.cn/' },
      { type: '技能', title: 'SkillHub', url: 'https://skillhub.cn/' },
      { type: '方法论', title: 'Superpowers', url: 'https://github.com/obra/superpowers' },
      { type: '方法论', title: 'Spec Kit', url: 'https://github.github.com/spec-kit/' },
      { type: '方法论', title: 'OpenSpec', url: 'https://openspec.dev/' },
      { type: '方法论', title: 'GSD 2', url: 'https://github.com/gsd-build/gsd-2' },
    ],
    steps: ['概念扫盲', '安装主力工具', '小任务练习', 'Plan 模式', 'Spec 工作流', '项目验证'],
  },
  {
    id: 'frontend',
    title: '前端工程成长路线',
    summary: '围绕 React、工程化、设计系统和 AI 辅助开发，建立可交付的前端能力。',
    accent: '#6f7669',
    resources: [
      { type: '博文', title: 'React Hooks 深度探索', url: '/note/react-hooks' },
      { type: '视频', title: '组件设计与状态管理', url: 'https://www.bilibili.com/' },
      { type: '网址', title: 'JavaScript 学习路径', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript' },
    ],
    steps: ['HTML/CSS 基础', 'JavaScript', 'React', '状态管理', '工程化', '设计系统'],
  },
  {
    id: 'knowledge',
    title: '个人知识管理路线',
    summary: '从数字花园、标签组织到长期复盘，让知识在写作和项目中持续生长。',
    accent: '#8f4f32',
    resources: [
      { type: '博文', title: '欢迎来到 MindScape', url: '/note/welcome' },
      { type: '博文', title: 'AI Coding 学习清单', url: '/note/ai-coding-learning-checklist' },
      { type: '网址', title: 'OpenSpec', url: 'https://openspec.dev/' },
    ],
    steps: ['捕捉灵感', '标签归档', '主题串联', '定期修剪', '输出文章', '形成系统'],
  },
];
// Load and parse MD files at build time
const parsedModules = Object.values(mdModules);

function parseMdFiles() {
  let resourceCategories = DEFAULT_RESOURCE_CATEGORIES;
  let learningRoutes = DEFAULT_LEARNING_ROUTES;

  for (const raw of parsedModules) {
    if (typeof raw !== 'string') continue;
    const { data } = matter(raw);
    if (data.categories && Array.isArray(data.categories)) {
      resourceCategories = data.categories;
    }
    if (data.routes && Array.isArray(data.routes)) {
      learningRoutes = data.routes;
    }
  }

  return { resourceCategories, learningRoutes };
}

const { resourceCategories, learningRoutes } = parseMdFiles();

// Synchronous exports — data loaded at build time via import.meta.glob
export const RESOURCE_CATEGORIES = resourceCategories;
export const LEARNING_ROUTES = learningRoutes;

export const MICROLINK_API_URL = import.meta.env.VITE_MICROLINK_API_URL || 'https://api.microlink.io/?url=';
export const FAVICON_YANDEX_URL = import.meta.env.VITE_FAVICON_YANDEX_URL || 'https://favicon.yandex.net/favicon/';
