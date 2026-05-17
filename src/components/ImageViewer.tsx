import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageViewerProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = images[currentIndex];

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
    setLoading(true);
    setError(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="image-viewer-dialog"
      onClick={handleBackdropClick}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="image-viewer-content"
        >
          {loading && !error && (
            <div className="image-viewer-loading">
              <div className="image-viewer-spinner" />
            </div>
          )}
          {error ? (
            <div className="image-viewer-error">
              <span>图片加载失败</span>
              <a href={current.src} target="_blank" rel="noreferrer">打开原图</a>
            </div>
          ) : (
            <img
              src={current.src}
              alt={current.alt}
              className="image-viewer-image"
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        className="image-viewer-close"
        onClick={onClose}
        aria-label="关闭"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="image-viewer-nav image-viewer-prev"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="上一张"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <button
            type="button"
            className="image-viewer-nav image-viewer-next"
            onClick={handleNext}
            disabled={currentIndex === images.length - 1}
            aria-label="下一张"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
          <div className="image-viewer-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </dialog>
  );
};