import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Note } from '../types';

interface AIPanelProps {
  note: Note;
  isMobile?: boolean;
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

export function AIPanel({ note, isMobile = false, randomNote, relatedNotes = [], onRandomWalk }: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<'metaphor' | 'connections' | 'personality'>('metaphor');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const containerClasses = isMobile
    ? "w-full ai-panel p-5"
    : `fixed right-7 top-28 z-40 ai-panel transition-all duration-300 ${isCollapsed ? 'ai-panel-collapsed w-16 p-2' : 'w-72 p-5'}`;

  return (
    <>
    {isCollapsed && !isMobile ? (
      <motion.button
        type="button"
        onClick={() => setIsCollapsed(false)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="ai-orb"
        aria-label="展开 AI 助手"
        title="展开 AI 助手"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3l1.8 5.6L20 10l-5 3.6L16 20l-4-3.2L8 20l1-6.4L4 10l6.2-1.4L12 3Z" />
        </svg>
      </motion.button>
    ) : (
    <motion.div
      initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className={containerClasses}
    >
      {!isMobile && (
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ai-panel-toggle"
          aria-label={isCollapsed ? '展开 AI 侧栏' : '折叠 AI 侧栏'}
          title={isCollapsed ? '展开 AI 侧栏' : '折叠 AI 侧栏'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={isCollapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'} />
          </svg>
        </button>
      )}

      <>
      {/* Tab headers */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('metaphor')}
          className={`ai-tab ${
            activeTab === 'metaphor' 
              ? 'ai-tab-active' 
              : ''
          }`}
        >
          🎭 隐喻
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`ai-tab ${
            activeTab === 'connections' 
              ? 'ai-tab-active' 
              : ''
          }`}
        >
          🔗 联想
        </button>
        <button
          onClick={() => setActiveTab('personality')}
          className={`ai-tab ${
            activeTab === 'personality' 
              ? 'ai-tab-active' 
              : ''
          }`}
        >
          🎪 人格
        </button>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'metaphor' && (
          <motion.div
            key="metaphor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h4 className="text-nebula-accent font-medium mb-3">AI 共振</h4>
            <p className="theme-muted text-sm leading-relaxed italic">
              {aiMetaphors[Math.floor(Math.random() * aiMetaphors.length)]}
            </p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs theme-subtle mb-2">情绪能量</p>
              <div className="flex gap-2">
                <span className="ai-chip">
                  {note.mood || '🌟'} 沉思
                </span>
                <span className="ai-chip">
                  ⚡ 高能量
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'connections' && (
          <motion.div
            key="connections"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h4 className="text-nebula-accent font-medium mb-3">思维连接</h4>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h4 className="text-nebula-accent font-medium mb-3">笔记人格</h4>
            <div className="text-center py-4">
              <motion.div 
                className="text-5xl mb-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {note.personality === '沉思者' && '🦉'}
                {note.personality === '引路人' && '🧭'}
                {note.personality === '园丁' && '🌱'}
                {note.personality === '未来主义者' && '🤖'}
                {note.personality === '陪伴者' && '🌙'}
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

      {/* Decorative element */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-nebula-accent/20 to-transparent rounded-full blur-xl" />
      </>
    </motion.div>
    )}
    </>
  );
}
