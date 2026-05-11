// AI Summary Panel Component

import { motion } from 'framer-motion';
import { Note } from '../types';
import { useGenerateSummary } from '../hooks/useAI';

interface AISummaryPanelProps {
  note: Note;
}

export function AISummaryPanel({ note }: AISummaryPanelProps) {
  const { summary, loading, error, isConfigured, refresh } = useGenerateSummary(note);

  // Not configured state
  if (!isConfigured && !loading) {
    return (
      <div className="ai-summary-panel ai-summary-unconfigured">
        <div className="ai-summary-header">
          <span className="ai-summary-icon">🤖</span>
          <span className="ai-summary-title">AI 摘要</span>
        </div>
        <p className="ai-summary-message">
          配置 AI 功能以解锁智能摘要
        </p>
        <code className="ai-summary-code">
          VITE_CLAUDE_API_KEY=your_key_here
        </code>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="ai-summary-panel ai-summary-loading">
        <div className="ai-summary-header">
          <span className="ai-summary-icon">🤖</span>
          <span className="ai-summary-title">AI 摘要</span>
          <span className="ai-summary-badge">生成中...</span>
        </div>
        <div className="ai-summary-skeleton">
          <div className="skeleton-line skeleton-line-80"></div>
          <div className="skeleton-line skeleton-line-100"></div>
          <div className="skeleton-line skeleton-line-60"></div>
        </div>
        <div className="ai-keywords-skeleton">
          <div className="skeleton-tag"></div>
          <div className="skeleton-tag"></div>
          <div className="skeleton-tag"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="ai-summary-panel ai-summary-error">
        <div className="ai-summary-header">
          <span className="ai-summary-icon">🤖</span>
          <span className="ai-summary-title">AI 摘要</span>
        </div>
        <p className="ai-summary-error-message">{error}</p>
        <button onClick={refresh} className="ai-summary-retry">
          重试
        </button>
      </div>
    );
  }

  // Success state
  if (summary) {
    return (
      <motion.div
        className="ai-summary-panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="ai-summary-header">
          <span className="ai-summary-icon">🤖</span>
          <span className="ai-summary-title">AI 摘要</span>
          <button onClick={refresh} className="ai-summary-refresh" title="刷新摘要">
            🔄
          </button>
        </div>

        {summary.summary && (
          <p className="ai-summary-text">{summary.summary}</p>
        )}

        {summary.keywords.length > 0 && (
          <div className="ai-keywords">
            <span className="ai-keywords-label">关键词</span>
            <div className="ai-keywords-list">
              {summary.keywords.map((keyword, index) => (
                <span key={index} className="ai-keyword-tag">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {summary.improvedTitle && summary.improvedTitle !== note.title && (
          <div className="ai-title-suggestion">
            <span className="ai-title-label">💡 建议标题</span>
            <p className="ai-title-text">{summary.improvedTitle}</p>
          </div>
        )}
      </motion.div>
    );
  }

  return null;
}
