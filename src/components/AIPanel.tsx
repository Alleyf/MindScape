import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Link2, Tent, Bird, Compass, Sprout, Bot, Moon, Zap } from 'lucide-react';
import { Note } from '../types';

interface AIPanelProps {
  note: Note;
  randomNote?: Note | null;
  relatedNotes?: Note[];
  onRandomWalk?: () => void;
}

const aiMetaphors = [
  "这篇文章像 — 深夜电台里的一把木吉他，温柔地拨动着你内心深处的弦。",
  "读这段文字时，仿佛站在山顶看云海翻腾，思绪随之起伏。",
  "这些想法如同夜空中闪烁的星星，看似分散却构成完整的星座。",
  "文字间流淌的能量，像春日融化的溪水，带着冬日的记忆奔向远方。",
  "这是一次思维的潜水，潜入意识深处打捞被遗忘的珍珠。",
];

export function AIPanel({ note, randomNote, relatedNotes = [], onRandomWalk }: AIPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'metaphor' | 'connections' | 'personality'>('metaphor');

  return (
    <div className="ai-aura">
      <button type="button" className="ai-aura-trigger" onClick={() => setExpanded(v => !v)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3l1.8 5.6L20 10l-5 3.6L16 20l-4-3.2L8 20l1-6.4L4 10l6.2-1.4L12 3Z" />
        </svg>
        <span>AI 共振</span>
        <span className="ai-aura-dot" />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="ai-aura-body"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Tab headers */}
            <div className="ai-aura-tabs">
              <button
                type="button"
                onClick={() => setActiveTab('metaphor')}
                className={`ai-tab ${activeTab === 'metaphor' ? 'ai-tab-active' : ''}`}
              >
                <Sparkles className="w-3.5 h-3.5" /> 隐喻
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('connections')}
                className={`ai-tab ${activeTab === 'connections' ? 'ai-tab-active' : ''}`}
              >
                <Link2 className="w-3.5 h-3.5" /> 联想
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('personality')}
                className={`ai-tab ${activeTab === 'personality' ? 'ai-tab-active' : ''}`}
              >
                <Tent className="w-3.5 h-3.5" /> 人格
              </button>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === 'metaphor' && (
                <motion.div
                  key="metaphor"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h4 className="text-nebula-accent font-medium mb-3 text-sm">AI 共振</h4>
                  <p className="theme-muted text-sm leading-relaxed italic">
                    {aiMetaphors[Math.floor(Math.random() * aiMetaphors.length)]}
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs theme-subtle mb-2">情绪能量</p>
                    <div className="flex gap-2">
                      <span className="ai-chip flex items-center gap-1">
                        {note.mood ? (
                          <>
                            {note.mood === '✨' && <Sparkles className="w-3 h-3" />}
                            {note.mood === '🌟' && <Sparkles className="w-3 h-3" />}
                            {note.mood === '✦' && <Sparkles className="w-3 h-3" />}
                            {note.mood === '🌙' && <Moon className="w-3 h-3" />}
                            {note.mood === '🌱' && <Sprout className="w-3 h-3" />}
                            {note.mood === '🌿' && <Sprout className="w-3 h-3" />}
                            {note.mood === '🍂' && <Sprout className="w-3 h-3" />}
                            {!['✨', '🌟', '✦', '🌙', '🌱', '🌿', '🍂'].includes(note.mood) && note.mood}
                          </>
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        沉思
                      </span>
                      <span className="ai-chip flex items-center gap-1">
                        <Zap className="w-3 h-3" /> 高能量
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'connections' && (
                <motion.div
                  key="connections"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h4 className="text-nebula-accent font-medium mb-3 text-sm">思维连接</h4>
                  <p className="theme-muted text-sm leading-relaxed">
                    {relatedNotes.length > 0
                      ? `这篇笔记和 ${relatedNotes[0].title} 共享了相近的标签或主题，可以顺着这条线继续阅读。`
                      : '暂时没有找到强相关笔记，可以使用随机漫步探索下一篇。'}
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs theme-subtle mb-3">可能相关的笔记</p>
                    <div className="space-y-2">
                      {relatedNotes.length > 0 ? relatedNotes.map((relatedNote) => (
                        <Link
                          key={relatedNote.slug}
                          to={`/note/${relatedNote.slug}`}
                          className="ai-link-card"
                        >
                          → {relatedNote.title}
                        </Link>
                      )) : (
                        <span className="ai-link-card">暂无相关笔记</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'personality' && (
                <motion.div
                  key="personality"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h4 className="text-nebula-accent font-medium mb-3 text-sm">笔记人格</h4>
                  <div className="text-center py-4">
                    <motion.div
                      className="mb-3 flex justify-center"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {note.personality === '沉思者' && <Bird className="w-12 h-12 text-nebula-accent" />}
                      {note.personality === '引路人' && <Compass className="w-12 h-12 text-nebula-accent" />}
                      {note.personality === '园丁' && <Sprout className="w-12 h-12 text-nebula-accent" />}
                      {note.personality === '未来主义者' && <Bot className="w-12 h-12 text-nebula-accent" />}
                      {note.personality === '陪伴者' && <Moon className="w-12 h-12 text-nebula-accent" />}
                    </motion.div>
                    <p className="text-lg font-bold gradient-text">{note.personality}</p>
                    <p className="text-xs theme-subtle mt-2">
                      这篇笔记有自己的性格和气质
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs theme-subtle mb-2">人格特质</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="ai-chip">深度</span>
                      <span className="ai-chip">内省</span>
                      <span className="ai-chip">启发</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="ai-actions">
              <button
                type="button"
                onClick={onRandomWalk}
                disabled={!randomNote || !onRandomWalk}
                className="ai-random-button"
              >
                <span>随机漫步</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7h6a4 4 0 0 1 0 8H6m0 0 3-3m-3 3 3 3M17 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
