import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { ParticleField } from './components/ParticleField';
import { MouseGlow } from './components/MouseGlow';
import { NoteCard } from './components/NoteCard';
import { AIPanel } from './components/AIPanel';
import { RandomWalkButton } from './components/RandomWalkButton';
import { MarkdownContent } from './components/MarkdownContent';
import { ThemeToggle } from './components/ThemeToggle';
import { getNotes, getNoteBySlug, getRandomNote } from './utils/noteLoader';
import { Note } from './utils/noteLoader';

interface TocItem {
  id: string;
  text: string;
  level: number;
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
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-nebula-purple via-nebula-blue to-nebula-accent bg-clip-text text-transparent"
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
            <Link 
              to="/notes"
              className="inline-block px-8 py-4 bg-gradient-to-r from-nebula-purple to-nebula-accent rounded-full text-white font-medium hover:shadow-lg hover:shadow-nebula-accent/30 transition-all duration-300 transform hover:scale-105"
            >
              探索思维宇宙 →
            </Link>
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

function NotePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const note = useMemo(() => (slug ? getNoteBySlug(slug) : null), [slug]);
  const toc = useMemo(() => (note ? extractTableOfContents(note.content) : []), [note]);
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
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto xl:grid xl:grid-cols-[220px_minmax(0,56rem)_220px] xl:gap-8">
        <aside className="hidden xl:block">
          <div className="toc-panel sticky top-28">
            <p className="text-sm font-semibold theme-text mb-4">目录</p>
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

        <main className="min-w-0">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/notes"
            className="inline-flex items-center theme-link transition-colors"
          >
            ← 返回笔记列表
          </Link>
        </motion.div>
        
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
        
        {/* Random walk button */}
        {randomNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <RandomWalkButton onClick={() => navigate(`/note/${randomNote.slug}`)} />
          </motion.div>
        )}

        {/* Mobile AI Panel */}
        <div className="lg:hidden mt-12 mb-8">
          <AIPanel note={note} isMobile={true} />
        </div>
        </main>

        <div className="hidden xl:block" aria-hidden="true" />
      </div>
      
      {/* Desktop AI Panel */}
      <div className="hidden lg:block">
        <AIPanel note={note} />
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
            <Link to="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform">
              MindScape
            </Link>
            
            <div className="flex items-center gap-6 md:gap-10">
              <Link to="/notes" className="nav-link group">
                笔记
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <Link to="/about" className="nav-link group">
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
          <Route path="/note/:slug" element={<NotePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        
        {/* Footer */}
        <footer className="py-8 text-center theme-subtle text-sm relative z-10">
          <p>MindScape © 2026 — 用 AI 增强人类创造力</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
