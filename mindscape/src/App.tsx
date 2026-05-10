import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { ParticleField } from './components/ParticleField';
import { MouseGlow } from './components/MouseGlow';
import { NoteCard } from './components/NoteCard';
import { AIPanel } from './components/AIPanel';
import { RandomWalkButton } from './components/RandomWalkButton';
import { MarkdownContent } from './components/MarkdownContent';
import { getNotes, getNoteBySlug, getRandomNote } from './utils/noteLoader';
import { Note } from './utils/noteLoader';

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
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            一个 AI-Native 的创意知识空间<br/>
            <span className="text-sm text-gray-400">在这里，思想如星云般绽放，知识如有机生命般生长</span>
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
              className="inline-block px-6 py-3 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors"
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
  
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-5xl font-bold mb-4 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          所有笔记
        </motion.h1>
        <p className="text-gray-400 mb-12 text-lg">
          共 {notes.length} 篇思维记录
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
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
      </div>
    </div>
  );
}

function NotePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const note = useMemo(() => (slug ? getNoteBySlug(slug) : null), [slug]);
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
    <div className="min-h-screen pt-24 pb-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/notes"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
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
                className="px-4 py-2 bg-white/5 rounded-full text-sm text-gray-300 border border-white/10"
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
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>📅 {note.createdAt}</span>
            <span className="capitalize">{note.personality}</span>
          </div>
        </motion.header>
        
        {/* Note content with Markdown renderer */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="glass-card p-8 rounded-2xl">
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
      </div>
      
      {/* AI Panel */}
      <AIPanel note={note} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-nebula-dark min-h-screen text-white overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold gradient-text">
              MindScape
            </Link>
            
            <div className="flex items-center gap-6">
              <Link to="/notes" className="text-gray-300 hover:text-white transition-colors">
                笔记
              </Link>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                关于
              </a>
            </div>
          </div>
        </nav>
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/note/:slug" element={<NotePage />} />
        </Routes>
        
        {/* Footer */}
        <footer className="py-8 text-center text-gray-500 text-sm relative z-10">
          <p>MindScape © 2024 — 用 AI 增强人类创造力</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
