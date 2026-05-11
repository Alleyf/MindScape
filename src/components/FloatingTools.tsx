import { useEffect, useState } from 'react';

const fontSizes = ['normal', 'large', 'xlarge'] as const;
type FontSize = (typeof fontSizes)[number];

function applyFontSize(size: FontSize) {
  document.documentElement.dataset.fontSize = size;
  localStorage.setItem('mindscape-font-size', size);
}

export function FloatingTools() {
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mindscape-font-size') as FontSize | null;
    const next = saved && fontSizes.includes(saved) ? saved : 'normal';
    setFontSize(next);
    applyFontSize(next);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 1800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const cycleFontSize = () => {
    const next = fontSizes[(fontSizes.indexOf(fontSize) + 1) % fontSizes.length];
    setFontSize(next);
    applyFontSize(next);
    setNotice(next === 'normal' ? '标准字号' : next === 'large' ? '大字号' : '超大字号');
  };

  const backToTop = () => {
    const scrollTargets = [
      window,
      document.scrollingElement,
      document.documentElement,
      document.body,
      document.getElementById('root'),
      ...Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-container], .app-shell')),
    ].filter(Boolean);

    scrollTargets.forEach((target) => {
      if (target === window) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }

      const element = target as Element;
      element.scrollTo?.({ top: 0, left: 0, behavior: 'smooth' });
      if ('scrollTop' in element) {
        element.scrollTop = 0;
      }
    });

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    setNotice('已回到顶部');
  };

  const scrollToBottom = () => {
    const maxY = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.getElementById('root')?.scrollHeight || 0
    );
    const scrollTargets = [
      window,
      document.scrollingElement,
      document.documentElement,
      document.body,
      document.getElementById('root'),
      ...Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-container], .app-shell')),
    ].filter(Boolean);

    scrollTargets.forEach((target) => {
      if (target === window) {
        window.scrollTo({ top: maxY, left: 0, behavior: 'smooth' });
        return;
      }

      const element = target as Element;
      const elementMaxY = Math.max(0, element.scrollHeight - element.clientHeight);
      element.scrollTo?.({ top: elementMaxY || maxY, left: 0, behavior: 'smooth' });
      if ('scrollTop' in element) {
        element.scrollTop = elementMaxY || maxY;
      }
    });

    document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    requestAnimationFrame(() => {
      window.scrollTo(0, maxY);
      document.documentElement.scrollTop = maxY;
      document.body.scrollTop = maxY;
    });
    setNotice('已到底部');
  };

  const sharePage = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href });
        setNotice('已打开分享');
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setNotice('链接已复制');
    } catch {
      try {
        await navigator.clipboard?.writeText(window.location.href);
        setNotice('链接已复制');
      } catch {
        setNotice('复制失败');
      }
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
      setNotice(document.fullscreenElement ? '已全屏' : '已退出全屏');
    } catch {
      setNotice('浏览器拦截全屏');
    }
  };

  return (
    <div className="floating-tools" aria-label="阅读工具">
      {notice && <div className="floating-tools-notice">{notice}</div>}
      <button type="button" onClick={backToTop} title="回到顶部" aria-label="回到顶部">
        <svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
      </button>
      <button type="button" onClick={scrollToBottom} title="回到底部" aria-label="回到底部">
        <svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
      </button>
      <button type="button" onClick={sharePage} title="分享当前页面" aria-label="分享当前页面">
        <svg viewBox="0 0 24 24"><path d="M18 8a3 3 0 1 0-2.8-4M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-2a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8.7 15.4l6.6-3.8M8.7 18.6l6.6 3.8" /></svg>
      </button>
      <button type="button" onClick={toggleFullscreen} title="全屏" aria-label="全屏">
        <svg viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" /></svg>
      </button>
      <button type="button" onClick={cycleFontSize} title="切换字体大小" aria-label="切换字体大小">
        <span>{fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
      </button>
    </div>
  );
}
