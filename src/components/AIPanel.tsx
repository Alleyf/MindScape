import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Note } from '../types';

interface AIPanelProps {
  note: Note;
  isMobile?: boolean;
}

const aiMetaphors = [
  "这篇文章像 — 深夜电台里的一把木吉他，温柔地拨动着你内心深处的弦。",
  "读这段文字时，仿佛站在山顶看云海翻腾，思绪随之起伏。",
  "这些想法如同夜空中闪烁的星星，看似分散却构成完整的星座。",
  "文字间流淌的能量，像春日融化的溪水，带着冬日的记忆奔向远方。",
  "这是一次思维的潜水，潜入意识深处打捞被遗忘的珍珠。",
];

const aiConnections = [
  "读到此处，让我想起另一篇关于「心流」的笔记，两者都在探讨专注的力量。",
  "这个观点与「量子思维」中的叠加态概念有奇妙的呼应。",
  "如果结合「数字花园」的理念，这个想法可以如何生长？",
  "此处的情绪基调，与「独处的力量」中描述的宁静感不谋而合。",
];

export function AIPanel({ note, isMobile = false }: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<'metaphor' | 'connections' | 'personality'>('metaphor');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const containerClasses = isMobile
    ? "w-full ai-panel p-5"
    : `fixed right-7 top-28 z-40 ai-panel transition-all duration-300 ${isCollapsed ? 'ai-panel-collapsed w-16 p-2' : 'w-72 p-5'}`;

  return (
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

      {isCollapsed && !isMobile ? (
        <div className="ai-panel-rail">
          <span>AI</span>
        </div>
      ) : (
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
              {aiConnections[Math.floor(Math.random() * aiConnections.length)]}
            </p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs theme-subtle mb-3">可能相关的笔记</p>
              <div className="space-y-2">
                <Link 
                  to="/note/quantum-thinking"
                  className="ai-link-card"
                >
                  → 量子思维：超越二元对立
                </Link>
                <Link 
                  to="/note/creative-flow"
                  className="ai-link-card"
                >
                  → 心流状态的触发密码
                </Link>
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

      {/* Decorative element */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-nebula-accent/20 to-transparent rounded-full blur-xl" />
      </>
      )}
    </motion.div>
  );
}
