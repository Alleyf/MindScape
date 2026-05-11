import { useEffect, useState } from 'react';

const fontSizes = ['normal', 'large', 'xlarge'] as const;
type FontSize = (typeof fontSizes)[number];

function applyFontSize(size: FontSize) {
  document.documentElement.dataset.fontSize = size;
  localStorage.setItem('mindscape-font-size', size);
}

export function FloatingTools() {
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  useEffect(() => {
    const saved = localStorage.getItem('mindscape-font-size') as FontSize | null;
    const next = saved && fontSizes.includes(saved) ? saved : 'normal';
    setFontSize(next);
    applyFontSize(next);
  }, []);

  const cycleFontSize = () => {
    const next = fontSizes[(fontSizes.indexOf(fontSize) + 1) % fontSizes.length];
    setFontSize(next);
    applyFontSize(next);
  };

  const sharePage = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href });
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
    } catch {
      await navigator.clipboard?.writeText(window.location.href);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen can be blocked by browser permissions; keep the control no-op in that case.
    }
  };

  return (
    <div className="floating-tools" aria-label="阅读工具">
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="回到顶部" aria-label="回到顶部">
        <svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
      </button>
      <button type="button" onClick={sharePage} title="分享当前页面" aria-label="分享当前页面">
        <svg viewBox="0 0 24 24"><path d="M18 8a3 3 0 1 0-2.8-4M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-2a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8.7 15.4l6.6-3.8M8.7 18.6l6.6 3.8" /></svg>
      </button>
      <button type="button" onClick={toggleFullscreen} title="全屏" aria-label="全屏">
        <svg viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" /></svg>
      </button>
      <button type="button" onClick={cycleFontSize} title="切换字体大小" aria-label="切换字体大小">
        <span>A</span>
      </button>
    </div>
  );
}
