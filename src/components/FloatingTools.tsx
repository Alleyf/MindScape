import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getNoteBySlug } from '../utils/noteLoader';

const fontSizes = ['normal', 'large', 'xlarge'] as const;
type FontSize = (typeof fontSizes)[number];

function applyFontSize(size: FontSize) {
  document.documentElement.dataset.fontSize = size;
  localStorage.setItem('mindscape-font-size', size);
}

export function FloatingTools() {
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [notice, setNotice] = useState('');
  const [immersive, setImmersive] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const currentNote = useMemo(() => {
    const match = pathname.match(/^\/note\/([^/]+)/);
    const slug = match?.[1] ?? null;
    return slug ? getNoteBySlug(slug) : null;
  }, [pathname]);

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

  useEffect(() => {
    if (immersive) {
      document.documentElement.dataset.immersive = 'true';
    } else {
      delete document.documentElement.dataset.immersive;
    }
  }, [immersive]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && immersive) setImmersive(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [immersive]);

  useEffect(() => {
    if (!moreOpen) return;
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [moreOpen]);

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

  const downloadMarkdown = () => {
    if (!currentNote) return;
    const blob = new Blob([currentNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNote.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice('Markdown 已下载');
  };

  const exportPdf = () => {
    if (!currentNote) return;
    setNotice('正在打开打印版...');

    const contentEl = document.querySelector('.markdown-content') as HTMLElement | null;
    if (!contentEl) {
      setNotice('未找到内容区域');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setNotice('浏览器拦截了打印窗口');
      return;
    }

    const clonedContent = contentEl.cloneNode(true) as HTMLElement;
    clonedContent.querySelectorAll('button, .code-block-toolbar button').forEach((node) => node.remove());

    printWindow.document.open();
    printWindow.document.write(`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>${currentNote.title}</title>
    <style>
      @page { size: A4; margin: 18mm 17mm 20mm; }
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        background: #fffaf2;
        color: #141413;
        font-family: "Source Han Sans SC", "Microsoft YaHei UI", "PingFang SC", sans-serif;
        font-size: 11.5pt;
        line-height: 1.75;
      }
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .pdf-page { width: 100%; max-width: 176mm; margin: 0 auto; }
      .pdf-kicker {
        color: #8f4f32;
        font-size: 9pt;
        font-weight: 800;
        letter-spacing: .12em;
        margin-bottom: 7mm;
        text-transform: uppercase;
      }
      .pdf-title {
        margin: 0 0 4mm;
        color: #141413;
        font-family: Georgia, "Noto Serif SC", "Songti SC", serif;
        font-size: 28pt;
        line-height: 1.18;
        font-weight: 800;
      }
      .pdf-description {
        margin: 0 0 5mm;
        color: #6d6257;
        font-size: 12pt;
        font-style: italic;
        line-height: 1.65;
      }
      .pdf-meta { margin-bottom: 10mm; color: #7d7468; font-size: 9.5pt; }
      h1, h2, h3, h4 {
        break-after: avoid;
        page-break-after: avoid;
        color: #141413;
        font-family: Georgia, "Noto Serif SC", "Songti SC", serif;
        line-height: 1.25;
      }
      h1 { font-size: 23pt; margin: 12mm 0 5mm; }
      h2 {
        border-left: 3pt solid #d97757;
        font-size: 18pt;
        margin: 10mm 0 4mm;
        padding-left: 4mm;
      }
      h3 { font-size: 14.5pt; margin: 7mm 0 3mm; }
      p { margin: 0 0 4mm; color: #332f2a; orphans: 3; widows: 3; }
      ul, ol { margin: 0 0 4mm 6mm; padding-left: 4mm; }
      li { margin: 0 0 2mm; color: #332f2a; }
      a { color: #8f4f32; text-decoration: none; }
      img {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 7mm 0;
        border: .6pt solid #e5d7c8;
        border-radius: 7mm;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      code {
        border-radius: 3pt;
        background: #f0e5d8;
        color: #8f4f32;
        font-family: Consolas, "SFMono-Regular", monospace;
        font-size: .9em;
        padding: .4mm 1.2mm;
        white-space: nowrap;
      }
      pre, .code-block {
        margin: 5mm 0;
        padding: 4mm;
        overflow: visible;
        border-radius: 4mm;
        background: #27231f;
        color: #f4efe7;
        white-space: pre-wrap;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      pre code, .code-block code {
        display: block;
        background: transparent;
        color: inherit;
        padding: 0;
        white-space: pre-wrap;
      }
      blockquote {
        margin: 5mm 0;
        border-left: 3pt solid #d97757;
        padding-left: 4mm;
        color: #6d6257;
        font-style: italic;
      }
      table { width: 100%; border-collapse: collapse; margin: 5mm 0; break-inside: avoid; }
      th, td { border: .6pt solid #e5d7c8; padding: 2mm; text-align: left; }
      .reference-section { display: none; }
    </style>
  </head>
  <body>
    <main class="pdf-page">
      <div class="pdf-kicker">MindScape Note</div>
      <h1 class="pdf-title">${currentNote.title}</h1>
      ${currentNote.excerpt ? `<p class="pdf-description">${currentNote.excerpt}</p>` : ''}
      <div class="pdf-meta">${currentNote.createdAt}${currentNote.personality ? ` · ${currentNote.personality}` : ''}</div>
      ${clonedContent.innerHTML}
    </main>
    <script>
      window.addEventListener('load', () => setTimeout(() => window.print(), 250));
    </script>
  </body>
</html>`);
    printWindow.document.close();
    setNotice('请在打印窗口选择保存为 PDF');
  };

  return (
    <>
      <div className="floating-tools" aria-label="阅读工具">
        {notice && <div className="floating-tools-notice">{notice}</div>}
        <button type="button" onClick={backToTop} title="回到顶部" aria-label="回到顶部">
          <svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </button>
        <button type="button" onClick={scrollToBottom} title="回到底部" aria-label="回到底部">
          <svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </button>
        <button type="button" onClick={cycleFontSize} title="切换字体大小" aria-label="切换字体大小">
          <span>{fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
        </button>

        <div className="floating-tools-sep" />

        <div className="floating-more-wrap" ref={moreRef}>
          <button type="button" onClick={() => setMoreOpen(v => !v)} title="更多工具" aria-label="更多工具" className={moreOpen ? 'active' : ''}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>
          </button>

          {moreOpen && (
            <div className="floating-popover">
              <button type="button" onClick={() => { sharePage(); setMoreOpen(false); }} title="分享">
                <svg viewBox="0 0 24 24"><path d="M18 8a3 3 0 1 0-2.8-4M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-2a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8.7 15.4l6.6-3.8M8.7 18.6l6.6 3.8" /></svg>
                <span>分享</span>
              </button>
              <button type="button" onClick={() => { toggleFullscreen(); setMoreOpen(false); }} title="全屏">
                <svg viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" /></svg>
                <span>全屏</span>
              </button>
              {currentNote && (
                <>
                  <button type="button" onClick={() => { downloadMarkdown(); setMoreOpen(false); }} title="导出 Markdown">
                    <svg viewBox="0 0 24 24"><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 15V3" /></svg>
                    <span>Markdown</span>
                  </button>
                  <button type="button" onClick={() => { exportPdf(); setMoreOpen(false); }} title="导出 PDF">
                    <svg viewBox="0 0 24 24"><path d="M6 9V4h12v5M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v6H6v-6Z" /></svg>
                    <span>PDF</span>
                  </button>
                  <button type="button" onClick={() => { setImmersive(true); setMoreOpen(false); }} title="沉浸模式">
                    <svg viewBox="0 0 24 24"><path d="M21 16v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2M3 21h18M12 9V3m-3 3 3-3 3 3"/></svg>
                    <span>沉浸</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {immersive && (
        <button type="button" className="immersive-exit-btn" onClick={() => setImmersive(false)} title="退出沉浸模式 (Esc)" aria-label="退出沉浸模式">
          <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </>
  );
}
