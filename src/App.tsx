import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { ParticleField } from './components/ParticleField';
import { MouseGlow } from './components/MouseGlow';
import { NoteCard } from './components/NoteCard';
import { AIPanel } from './components/AIPanel';
import { MarkdownContent } from './components/MarkdownContent';
import { ThemeToggle } from './components/ThemeToggle';
import { LearningRoadmapFlow, type LearningRoute } from './components/LearningRoadmapFlow';
import { FloatingTools } from './components/FloatingTools';
import { getNotes, getNoteBySlug, getRandomNote } from './utils/noteLoader';
import { Note } from './utils/noteLoader';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ReferenceLink {
  title: string;
  url: string;
  domain: string;
}

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

function extractTableOfContents(content: string): TocItem[] {
  return content
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (!match) return null;

      const text = match[2].replace(/[#*_`[\]()]/g, '').trim();
      return {
        id: slugifyHeading(text),
        text,
        level: match[1].length,
      };
    })
    .filter((item): item is TocItem => Boolean(item));
}

function getAllTags(notes: Note[]): string[] {
  return Array.from(new Set(notes.flatMap((note) => note.tags))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function getRelatedNotes(currentNote: Note, notes: Note[], limit = 3): Note[] {
  return notes
    .filter((note) => note.slug !== currentNote.slug)
    .map((note) => ({
      note,
      score: note.tags.filter((tag) => currentNote.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.note.createdAt).getTime() - new Date(a.note.createdAt).getTime())
    .slice(0, limit)
    .map((item) => item.note);
}

function extractReferenceLinks(content: string): ReferenceLink[] {
  const links = new Map<string, ReferenceLink>();
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(content)) !== null) {
    const [, rawTitle, rawUrl] = match;
    const url = rawUrl.trim();
    if (links.has(url)) continue;

    let domain = url;
    try {
      domain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      domain = url.replace(/^https?:\/\//, '').split('/')[0];
    }

    links.set(url, {
      title: rawTitle.replace(/[`*_]/g, '').trim(),
      url,
      domain,
    });
  }

  return Array.from(links.values());
}

const learningRoutes: LearningRoute[] = [
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

function MindScapeLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup" aria-label="MindScape">
      <svg className="brand-logo" viewBox="0 0 48 48" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="logoGradient" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f46e5" />
            <stop offset="0.48" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <path d="M24 5c9.9 0 18 8.1 18 18 0 6.5-3.4 12.1-8.6 15.3-2.8 1.7-6 2.7-9.4 2.7S17.4 40 14.6 38.3C9.4 35.1 6 29.5 6 23 6 13.1 14.1 5 24 5Z" fill="url(#logoGradient)" opacity="0.96" />
        <path d="M15 29.4c3.6-1 5.5-3.7 5.5-8.1 0-2.4 1.6-4.3 3.8-4.3 2.1 0 3.7 1.8 3.7 4.1 0 4.9 2.1 7.6 5.9 8.3" fill="none" stroke="white" strokeWidth="3.1" strokeLinecap="round" />
        <path d="M15.5 21.5c2.6-6.8 14.9-8.6 19.1-.7" fill="none" stroke="white" strokeOpacity="0.75" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="17" cy="30" r="2.4" fill="white" />
        <circle cx="34" cy="30" r="2.4" fill="white" />
      </svg>
      {!compact && <span className="brand-word">MindScape</span>}
    </span>
  );
}

function NavIcon({ name }: { name: 'notes' | 'tags' | 'roadmap' | 'about' }) {
  const paths = {
    notes: 'M6 4h9a3 3 0 0 1 3 3v13H8a2 2 0 0 1-2-2V4Zm3 4h6M9 12h5',
    tags: 'M4 7V4h3l10.5 10.5a2.1 2.1 0 0 1 0 3l-2 2a2.1 2.1 0 0 1-3 0L4 11V7Zm3 .5h.01',
    roadmap: 'M4 17c3-7 6 2 9-5s5-1 7-6M5 17h.01M13 12h.01M20 6h.01',
    about: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6M12 7h.01',
  };

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function HomePage() {
  const notes = getNotes();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleField />
        </div>
        <MouseGlow />
        
        <motion.div 
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <MindScapeLogo />
          </motion.div>
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          >
            MindScape
          </motion.h1>
          <p className="text-xl md:text-2xl theme-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            一个 AI-Native 的创意知识空间<br/>
            <span className="text-sm theme-subtle">在这里，思想如星云般绽放，知识如有机生命般生长</span>
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/notes" className="primary-button">探索思维宇宙</Link>
              <Link to="/roadmap" className="theme-outline-button">查看学习路线</Link>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Notes Preview */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            最新思维碎片
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.slice(0, 3).map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <NoteCard note={note} index={index} />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/notes"
              className="theme-outline-button"
            >
              查看全部笔记 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotesPage() {
  const notes = getNotes();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag') || 'all';
  const tags = useMemo(() => getAllTags(notes), [notes]);
  const filteredNotes = activeTag === 'all'
    ? notes
    : notes.filter((note) => note.tags.includes(activeTag));

  const selectTag = (tag: string) => {
    if (tag === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ tag });
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-5xl font-bold mb-4 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          所有笔记
        </motion.h1>
        <p className="theme-muted mb-8 text-lg">
          {activeTag === 'all' ? `共 ${notes.length} 篇思维记录` : `#${activeTag} 下有 ${filteredNotes.length} 篇记录`}
        </p>

        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold theme-text">标签导航</h2>
            {activeTag !== 'all' && (
              <button
                type="button"
                onClick={() => selectTag('all')}
                className="text-sm theme-link"
              >
                清除筛选
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => selectTag('all')}
              className={activeTag === 'all' ? 'tag-filter-active' : 'tag-filter'}
            >
              全部
              <span>{notes.length}</span>
            </button>
            {tags.map((tag) => {
              const count = notes.filter((note) => note.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => selectTag(tag)}
                  className={activeTag === tag ? 'tag-filter-active' : 'tag-filter'}
                >
                  #{tag}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NoteCard note={note} index={index} />
            </motion.div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="glass-card p-8 text-center theme-muted">
            这个标签下暂时没有笔记。
          </div>
        )}
      </div>
    </div>
  );
}

function TagsPage() {
  const notes = getNotes();
  const tags = getAllTags(notes);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-5xl font-bold mb-4 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          标签分类
        </motion.h1>
        <p className="theme-muted mb-10 text-lg">
          按主题浏览 {notes.length} 篇笔记中的 {tags.length} 个标签。
        </p>

        <div className="tag-category-grid">
          {tags.map((tag) => {
            const taggedNotes = notes.filter((note) => note.tags.includes(tag));
            return (
              <section key={tag} className="tag-category-card">
                <div className="tag-category-header">
                  <h2>#{tag}</h2>
                  <span>{taggedNotes.length}</span>
                </div>
                <div className="space-y-2">
                  {taggedNotes.map((note) => (
                    <Link key={note.slug} to={`/note/${note.slug}`} className="tag-category-link">
                      {note.title}
                    </Link>
                  ))}
                </div>
                <Link to={`/notes?tag=${encodeURIComponent(tag)}`} className="tag-category-more">
                  查看全部
                </Link>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NotePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const note = useMemo(() => (slug ? getNoteBySlug(slug) : null), [slug]);
  const toc = useMemo(() => (note ? extractTableOfContents(note.content) : []), [note]);
  const references = useMemo(() => (note ? extractReferenceLinks(note.content) : []), [note]);
  const relatedNotes = useMemo(() => (note ? getRelatedNotes(note, getNotes()) : []), [note]);
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  
  useEffect(() => {
    if (slug) {
      const allNotes = getNotes();
      const otherNotes = allNotes.filter(n => n.id !== slug);
      if (otherNotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherNotes.length);
        setRandomNote(otherNotes[randomIndex]);
      }
    }
  }, [slug]);
  
  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">笔记未找到</h1>
          <Link to="/notes" className="text-nebula-accent hover:underline">
            返回笔记列表
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 relative z-10">
      <aside className="reading-toc hidden xl:block">
        <div className="toc-panel">
          <div className="toc-kicker">On this page</div>
          <p className="text-sm font-semibold theme-text mb-4">文章目录</p>
            {toc.length > 0 ? (
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={`${item.id}-${item.text}`}
                    href={`#${item.id}`}
                    className={`toc-link ${item.level === 3 ? 'pl-4' : ''}`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            ) : (
              <p className="text-sm theme-subtle">这篇文章暂无小标题。</p>
            )}
        </div>
      </aside>

      <main className="reading-main max-w-3xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/notes"
            className="inline-flex items-center theme-link transition-colors text-sm"
          >
            ← 返回笔记列表
          </Link>
        </motion.div>

        <div className="xl:hidden mb-8">
          <details className="mobile-toc">
            <summary>文章目录</summary>
            <nav className="mt-4 space-y-2">
              {toc.map((item) => (
                <a
                  key={`${item.id}-${item.text}-mobile`}
                  href={`#${item.id}`}
                  className={`toc-link ${item.level === 3 ? 'pl-4' : ''}`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </details>
        </div>
        
        {/* Note header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 mb-6">
            {note.tags.map(tag => (
              <span 
                key={tag}
                className="tag-pill"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            {note.title}
          </h1>
          
          {note.excerpt && (
            <motion.p 
              className="text-xl text-nebula-accent italic mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {note.excerpt}
            </motion.p>
          )}
          
          <div className="flex items-center gap-6 text-sm theme-muted">
            <span>📅 {note.createdAt}</span>
            <span className="capitalize">{note.personality}</span>
          </div>
        </motion.header>
        
        {/* Note content with Markdown renderer */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-none"
        >
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            <MarkdownContent content={note.content} />
          </div>
        </motion.article>
        
        {references.length > 0 && (
          <section className="reference-section">
            <div className="reference-section-header">
              <p>Reference</p>
              <h2>参考文档</h2>
            </div>
            <div className="reference-grid">
              {references.map((reference) => (
                <a
                  key={reference.url}
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="reference-card"
                >
                  <span>{reference.domain}</span>
                  <strong>{reference.title}</strong>
                  <small>{reference.url}</small>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Mobile AI Panel */}
        <div className="lg:hidden mt-12 mb-8">
          <AIPanel
            note={note}
            isMobile={true}
            randomNote={randomNote}
            relatedNotes={relatedNotes}
            onRandomWalk={() => randomNote && navigate(`/note/${randomNote.slug}`)}
          />
        </div>
      </main>
      
      {/* Desktop AI Panel */}
      <div className="hidden xl:block">
        <AIPanel
          note={note}
          randomNote={randomNote}
          relatedNotes={relatedNotes}
          onRandomWalk={() => randomNote && navigate(`/note/${randomNote.slug}`)}
        />
      </div>
    </div>
  );
}

function RoadmapPage() {
  const [activeRoute, setActiveRoute] = useState(learningRoutes[0].id);
  const currentRoute = learningRoutes.find((route) => route.id === activeRoute) || learningRoutes[0];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold mb-5 gradient-text">学习路线一览</h1>
          <p className="theme-muted max-w-3xl mx-auto leading-relaxed">
            把视频、网址和博文组织成可切换的路线图。路线数据集中配置，后续只要改数组就能扩展新的学习路径。
          </p>
        </motion.div>

        <div className="roadmap-tabs">
          {learningRoutes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => setActiveRoute(route.id)}
              className={route.id === activeRoute ? 'roadmap-tab-active' : 'roadmap-tab'}
            >
              {route.title}
            </button>
          ))}
        </div>

        <section className="roadmap-board">
          <div className="roadmap-header">
            <div>
              <p className="roadmap-label">Learning Roadmap</p>
              <h2>{currentRoute.title}</h2>
              <p>{currentRoute.summary}</p>
            </div>
            <Link to="/notes" className="theme-outline-button">浏览相关笔记</Link>
          </div>

          <LearningRoadmapFlow route={currentRoute} />

          <div className="roadmap-resources">
            {currentRoute.resources.map((resource) => {
              const isInternal = resource.url.startsWith('/');
              const content = (
                <>
                  <span>{resource.type}</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.url}</p>
                </>
              );

              return isInternal ? (
                <Link key={resource.title} to={resource.url} className="resource-card">
                  {content}
                </Link>
              ) : (
                <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer" className="resource-card">
                  {content}
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function AboutPage() {
  const notes = getNotes();
  const tags = getAllTags(notes);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 gradient-text">关于 MindScape</h1>
          <p className="text-xl theme-muted leading-relaxed max-w-3xl">
            MindScape 是一个 AI-Native 的创意知识空间，用来收纳技术学习、思维模型、工作流实践和长期生长的个人笔记。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6">
            <p className="text-3xl font-bold text-nebula-accent mb-2">{notes.length}</p>
            <p className="theme-muted">篇公开笔记</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-3xl font-bold text-nebula-accent mb-2">{tags.length}</p>
            <p className="theme-muted">个知识标签</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-3xl font-bold text-nebula-accent mb-2">AI</p>
            <p className="theme-muted">辅助整理与联想</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="glass-card p-8">
            <h2 className="text-2xl font-semibold theme-text mb-4">这里记录什么</h2>
            <div className="space-y-4 theme-muted leading-relaxed">
              <p>这里更像一座数字花园，而不是一次性写完的文章仓库。笔记会随着学习、实践和复盘持续更新。</p>
              <p>内容会覆盖 AI 编程、前端工程、知识管理、生产力方法、个人成长，以及一些正在形成中的想法。</p>
            </div>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-2xl font-semibold theme-text mb-4">如何浏览</h2>
            <div className="space-y-4 theme-muted leading-relaxed">
              <p>你可以从最新笔记开始，也可以进入笔记页通过标签筛选主题。长文页面左侧会显示目录，方便快速跳转。</p>
              <p>每篇笔记保留标签、日期和人格化气质，让知识不只是被存放，也能被重新发现。</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-shell min-h-screen overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="hover:scale-105 transition-transform">
              <MindScapeLogo />
            </Link>
            
            <div className="flex items-center gap-4 md:gap-8">
              <Link to="/notes" className="nav-link group">
                <NavIcon name="notes" />
                笔记
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <Link to="/tags" className="nav-link group">
                <NavIcon name="tags" />
                标签
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <Link to="/roadmap" className="nav-link group">
                <NavIcon name="roadmap" />
                学习路线
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <Link to="/about" className="nav-link group">
                <NavIcon name="about" />
                关于
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </nav>
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/note/:slug" element={<NotePage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        
        {/* Footer */}
        <footer className="py-8 text-center theme-subtle text-sm relative z-10">
          <p>MindScape © 2026 — 用 AI 增强人类创造力</p>
        </footer>
        <FloatingTools />
      </div>
    </Router>
  );
}

export default App;
