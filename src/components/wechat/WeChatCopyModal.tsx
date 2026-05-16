import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Eye } from 'lucide-react';
import { weChatTemplates, WeChatTemplate } from '../../config/wechatTemplates';
import { convertToWeChatHTML, copyToClipboard } from '../../utils/wechatConverter';

interface WeChatCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  title: string;
}

export function WeChatCopyModal({ isOpen, onClose, markdown, title }: WeChatCopyModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [convertedHTML, setConvertedHTML] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (markdown) {
      const html = convertToWeChatHTML(markdown, selectedTemplate);
      setConvertedHTML(html);
    }
  }, [markdown, selectedTemplate]);

  // Reset copy status when template changes
  useEffect(() => {
    setCopyStatus('idle');
  }, [selectedTemplate]);

  useEffect(() => {
    if (previewRef.current && showPreview) {
      const doc = previewRef.current.contentDocument;
      if (doc) {
        // Add base tag to handle relative URLs
        const baseUrl = window.location.origin;
        const htmlWithBase = convertedHTML.replace('<head>', `<head><base href="${baseUrl}">`);
        doc.open();
        doc.write(htmlWithBase);
        doc.close();
      }
    }
  }, [convertedHTML, showPreview]);

  const handleCopy = async () => {
    setCopyStatus('copying');
    const baseUrl = window.location.origin;
    const success = await copyToClipboard(convertedHTML, baseUrl);
    setCopyStatus(success ? 'success' : 'error');

    if (!success) {
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onKeyDown={handleKeyDown}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-5xl max-h-[95vh] bg-[var(--surface)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold theme-text">复制为公众号格式</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 theme-text" />
            </button>
          </div>

          {/* Template selector */}
          <div className="px-6 py-4 border-b border-white/10">
            <p className="text-sm theme-muted mb-3">选择模板</p>
            <div className="flex flex-wrap gap-2">
              {weChatTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTemplate === template.id
                      ? 'bg-nebula-accent text-white'
                      : 'bg-white/5 theme-text hover:bg-white/10'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Preview toggle */}
          <div className="px-6 py-3 border-b border-white/10 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showPreview ? 'bg-nebula-accent/20 text-nebula-accent' : 'theme-muted hover:bg-white/10'
              }`}
            >
              <Eye className="w-4 h-4" />
              {showPreview ? '隐藏预览' : '显示预览'}
            </button>
            <span className="text-xs theme-subtle">
              {showPreview ? '预览为只读模式' : '点击可在预览和代码间切换'}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {showPreview ? (
              <div className="flex-1 min-h-[400px] overflow-auto">
                <iframe
                  ref={previewRef}
                  className="w-full h-full min-h-[400px] border-0"
                  title="预览"
                  sandbox="allow-same-origin"
                />
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-sm theme-muted whitespace-pre-wrap break-words font-mono">
                  {convertedHTML.slice(0, 3000)}
                  {convertedHTML.length > 3000 && '...'}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium theme-muted hover:bg-white/10 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={copyStatus === 'copying'}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                copyStatus === 'success'
                  ? 'bg-green-500 text-white'
                  : copyStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-nebula-accent text-white hover:bg-nebula-accent/90'
              }`}
            >
              {copyStatus === 'copying' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  复制中...
                </>
              ) : copyStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制
                </>
              ) : copyStatus === 'error' ? (
                <>
                  <X className="w-4 h-4" />
                  复制失败
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制 HTML
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
