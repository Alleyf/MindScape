import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TableViewerProps {
  tableHtml: string;
  tableCaption?: string;
  onClose: () => void;
}

export const TableViewer: React.FC<TableViewerProps> = ({
  tableHtml,
  tableCaption,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="table-viewer-dialog"
      onClick={handleBackdropClick}
    >
      <div className="table-viewer-header">
        {tableCaption && <span className="table-viewer-caption">{tableCaption}</span>}
        <button
          type="button"
          className="table-viewer-close"
          onClick={onClose}
          aria-label="关闭"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="table-viewer-content"
          dangerouslySetInnerHTML={{ __html: tableHtml }}
        />
      </AnimatePresence>
      <div className="table-viewer-hint">
        按 ESC 关闭 · 点击外部关闭
      </div>
    </dialog>
  );
};