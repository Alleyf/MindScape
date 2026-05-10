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

  const containerClasses = isMobile 
    ? "w-full glass-card p-6" 
    : "fixed right-0 top-1/4 w-80 glass-card p-6";

  return (
    <motion.div
      initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className={containerClasses}
    >
      {/* Tab headers */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('metaphor')}
          className={`flex-1 text-sm py-2 rounded-lg transition-colors ${
            activeTab === 'metaphor' 
              ? 'bg-nebula-accent/20 text-nebula-accent' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🎭 隐喻
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`flex-1 text-sm py-2 rounded-lg transition-colors ${
            activeTab === 'connections' 
              ? 'bg-nebula-accent/20 text-nebula-accent' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🔗 联想
        </button>
        <button
          onClick={() => setActiveTab('personality')}
          className={`flex-1 text-sm py-2 rounded-lg transition-colors ${
            activeTab === 'personality' 
              ? 'bg-nebula-accent/20 text-nebula-accent' 
              : 'text-gray-400 hover:text-white'
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
            <p className="text-gray-300 text-sm leading-relaxed italic">
              {aiMetaphors[Math.floor(Math.random() * aiMetaphors.length)]}
            </p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-2">情绪能量</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-nebula-purple to-nebula-blue rounded-full text-xs">
                  {note.mood || '🌟'} 沉思
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-nebula-blue to-nebula-accent rounded-full text-xs">
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
            <p className="text-gray-300 text-sm leading-relaxed">
              {aiConnections[Math.floor(Math.random() * aiConnections.length)]}
            </p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-3">可能相关的笔记</p>
              <div className="space-y-2">
                <Link 
                  to="/note/quantum-thinking"
                  className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-gray-300"
                >
                  → 量子思维：超越二元对立
                </Link>
                <Link 
                  to="/note/creative-flow"
                  className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-gray-300"
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
              <p className="text-xs text-gray-500 mt-2">
                这篇笔记有自己的性格和气质
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-2">人格特质</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">深度</span>
                <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">内省</span>
                <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">启发</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative element */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-nebula-accent/20 to-transparent rounded-full blur-xl" />
    </motion.div>
  );
}
