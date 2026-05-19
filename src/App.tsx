import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Sprout, Compass, Sparkles, BookOpen, FileText, Tag, Clock, Star, ArrowRight, Zap, Shield, Layers } from 'lucide-react';

const GraphSidebarContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });
import { MouseGlow } from './components/MouseGlow';
import { ParticleField } from './components/ParticleField';
import { NoteCard } from './components/NoteCard';
import { NoteCoverImage } from './components/NoteCoverImage';
import { AIPanel } from './components/AIPanel';
import { AISummaryPanel } from './components/AISummaryPanel';
import { MarkdownContent } from './components/MarkdownContent';
import { ThemeToggle } from './components/ThemeToggle';
import { LearningRoadmapFlow, type LearningRoute } from './components/LearningRoadmapFlow';
import { NoteGraph } from './components/NoteGraph';
import { NoteGraphSidebar } from './components/NoteGraphSidebar';
import { FloatingTools } from './components/FloatingTools';
import { ThemeDrawer } from './components/ThemeDrawer';
import { ContentUnlockOverlay } from './components/ContentUnlockOverlay';
import { NavDropdown, NavDropdownItem } from './components/NavDropdown';
import { useUnlock } from './hooks/useUnlock';
import { getNotes, getNoteBySlug, getRandomNote, defaultCoverUrlFromSlug } from './utils/noteLoader';
import type { Note } from './types';
import { RESOURCE_CATEGORIES, LEARNING_ROUTES, MICROLINK_API_URL, FAVICON_YANDEX_URL } from './config/resources';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocNode {
  item: TocItem;
  children: TocNode[];
}

interface ReferenceLink {
  title: string;
  url: string;
  domain: string;
}

interface ReferencePreviewData {
  title: string;
  description: string;
  image: string;
  siteName: string;
  hostname: string;
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const past = new Date(dateStr).getTime();
  const diffMs = now - past;
  if (diffMs < 0) return '刚刚';
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} 天`);
  if (hours > 0) parts.push(`${hours} 小时`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} 分钟`);
  return `${parts.join(' ')}前`;
}

function isImageUrl(url: string): boolean {
  const cleanUrl = url.split('#')[0].split('?')[0].toLowerCase();
  return /\.(avif|gif|jpe?g|png|svg|webp)$/.test(cleanUrl);
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
}

function createReferenceCover(domain: string): string {
  const safeDomain = domain.slice(0, 38).replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#241f1a"/>
        <stop offset="0.52" stop-color="#4f3528"/>
        <stop offset="1" stop-color="#d97757"/>
      </linearGradient>
      <radialGradient id="glow" cx="24%" cy="18%" r="70%">
        <stop offset="0" stop-color="#fffaf2" stop-opacity="0.35"/>
        <stop offset="1" stop-color="#fffaf2" stop-opacity="0"/>
      </radialGradient>
      <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="2" fill="#fffaf2" opacity="0.14"/>
      </pattern>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#141413" flood-opacity="0.28"/>
      </filter>
      <clipPath id="card">
        <rect x="72" y="118" width="520" height="252" rx="34"/>
      </clipPath>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fffaf2"/>
        <stop offset="1" stop-color="#e7d6c4"/>
      </radialGradient>
    </defs>
    <rect width="960" height="540" rx="42" fill="url(#bg)"/>
    <rect width="960" height="540" fill="url(#dots)"/>
    <circle cx="210" cy="95" r="260" fill="url(#glow)"/>
    <path d="M650 90 C820 116 902 242 860 390 C742 340 646 436 540 356 C646 278 568 172 650 90Z" fill="#fffaf2" opacity="0.18"/>
    <g filter="url(#shadow)">
      <rect x="72" y="118" width="520" height="252" rx="34" fill="#fffaf2" opacity="0.96"/>
      <g clip-path="url(#card)">
        <path d="M78 326 C168 196 310 374 418 238 S548 204 596 156" fill="none" stroke="#d97757" stroke-width="22" stroke-linecap="round" opacity="0.62"/>
        <circle cx="504" cy="156" r="76" fill="#d97757" opacity="0.16"/>
      </g>
    </g>
    <text x="112" y="178" font-family="Arial, sans-serif" font-size="26" font-weight="800" fill="#d97757" letter-spacing="5">REFERENCE</text>
    <text x="112" y="254" font-family="Georgia, serif" font-size="52" font-weight="800" fill="#241f1a">Link Preview</text>
    <text x="112" y="318" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="#8f4f32">${safeDomain}</text>
    <text x="72" y="458" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#fffaf2" opacity="0.88">MindScape curated reference</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function fetchLinkPreviewMetadata(url: string): Promise<ReferencePreviewData> {
  const hostname = getHostname(url);
  const fallback = {
    title: hostname,
    description: '点击打开外部参考文档。',
    image: createReferenceCover(hostname),
    siteName: hostname,
    hostname,
  };

  try {
    const response = await fetch(`${MICROLINK_API_URL}${encodeURIComponent(url)}`);
    if (!response.ok) return fallback;

    const payload = await response.json();
    const data = payload?.data || {};
    const title = data.title || data.publisher || hostname;
    const description = data.description || data.lang || fallback.description;
    const rawImage = data.image?.url || data.logo?.url || '';
    const image = rawImage && !rawImage.startsWith('/') ? rawImage : fallback.image;

    return {
      title,
      description,
      image,
      siteName: data.publisher || data.author || hostname,
      hostname,
    };
  } catch {
    return fallback;
  }
}

function ReferencePreviewCard({ reference }: { reference: ReferenceLink }) {
  const fallback = useMemo(() => ({
    title: reference.title || reference.domain,
    description: '点击打开外部参考文档。',
    image: createReferenceCover(reference.domain),
    siteName: reference.domain,
    hostname: reference.domain,
  }), [reference.domain, reference.title]);
  const [preview, setPreview] = useState<ReferencePreviewData>(fallback);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(fallback.image);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPreview(fallback);
    setImageSrc(fallback.image);

    fetchLinkPreviewMetadata(reference.url)
      .then((metadata) => {
        if (cancelled) return;
        const next = {
          ...metadata,
          title: metadata.title || fallback.title,
          description: metadata.description || fallback.description,
          image: metadata.image || fallback.image,
          siteName: metadata.siteName || fallback.siteName,
          hostname: metadata.hostname || fallback.hostname,
        };
        setPreview(next);
        setImageSrc(next.image);
      })
      .catch(() => {
        if (cancelled) return;
        setPreview(fallback);
        setImageSrc(fallback.image);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reference.url, fallback]);

  return (
    <a href={reference.url} target="_blank" rel="noreferrer" className="reference-preview-card" aria-busy={loading}>
      <span className="reference-preview-cover">
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageSrc(fallback.image)}
        />
        {loading && <span className="reference-preview-shimmer" />}
      </span>
      <span className="reference-preview-body">
        <strong>{preview.title}</strong>
        <span className="reference-preview-desc">{preview.description}</span>
        <span className="reference-preview-site">{preview.siteName} · {preview.hostname}</span>
      </span>
    </a>
  );
}

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

function extractTableOfContents(content: string): TocItem[] {
  const lines = content.split(/\r?\n/);
  const items: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // Track fenced code block boundaries
    const fenceMatch = line.match(/^(`{3,}|~{3,})/);
    if (fenceMatch) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (!match) continue;

    const text = match[2].trim();
    items.push({
      id: slugifyHeading(text),
      text,
      level: match[1].length,
    });
  }

  return items;
}

function buildTocTree(items: TocItem[]): TocNode[] {
  const tree: TocNode[] = [];
  // h1/h2/h3 all can be TOC entries
  const ancestors: { item: TocItem; children: TocNode[] }[] = [];

  for (const item of items) {
    // Pop ancestors that are same level or higher
    while (ancestors.length > 0 && ancestors[ancestors.length - 1].item.level >= item.level) {
      ancestors.pop();
    }

    const node: TocNode = { item, children: [] };

    if (ancestors.length === 0) {
      tree.push(node);
    } else {
      ancestors[ancestors.length - 1].children.push(node);
    }

    ancestors.push(node);
  }

  return tree;
}

function TocTree({ nodes, depth = 0, activeId }: { nodes: TocNode[]; depth?: number; activeId?: string }) {
  if (nodes.length === 0) return null;

  return (
    <ul className={`toc-tree${depth === 0 ? ' toc-root' : ''}`}>
      {nodes.map((node) => {
        const isActive = activeId === node.item.id;

        return (
          <li key={node.item.id + node.item.text} className={`toc-tree-item${isActive ? ' toc-tree-item-active' : ''}`}>
            <a
              href={`#${node.item.id}`}
              className={`toc-link${node.item.level === 3 ? ' toc-link-h3' : ''}${isActive ? ' toc-link-active' : ''}`}
            >
              <span className="toc-text">{node.item.text}</span>
            </a>
            {node.children.length > 0 && (
              <TocTree nodes={node.children} depth={depth + 1} activeId={activeId} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function getAllTags(notes: Note[]): string[] {
  return Array.from(new Set(notes.flatMap((note) => note.tags))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function getRelatedNotes(currentNote: Note, notes: Note[], limit = 3): Note[] {
  return notes
    .filter((note) => note.slug !== currentNote.slug)
    .map((note) => ({
      note,
      score: note.tags.filter((tag) => currentNote.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.note.createdAt).getTime() - new Date(a.note.createdAt).getTime())
    .slice(0, limit)
    .map((item) => item.note);
}

function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function scoreNote(note: Note, query: string): number {
  const q = normalizeSearchText(query);
  if (!q) return 0;

  const title = normalizeSearchText(note.title);
  const tags = normalizeSearchText(note.tags.join(' '));
  const excerpt = normalizeSearchText(note.excerpt || '');
  const content = normalizeSearchText(note.content);

  let score = 0;
  if (title.includes(q)) score += 8;
  if (tags.includes(q)) score += 5;
  if (excerpt.includes(q)) score += 3;
  if (content.includes(q)) score += 1;
  return score;
}

function getSearchSnippet(note: Note, query: string): string {
  const source = note.content.replace(/[#>*_`\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim();
  const normalizedSource = normalizeSearchText(source);
  const normalizedQuery = normalizeSearchText(query);
  const index = normalizedQuery ? normalizedSource.indexOf(normalizedQuery) : -1;

  if (index === -1) {
    return note.excerpt || source.slice(0, 150);
  }

  const start = Math.max(0, index - 55);
  const end = Math.min(source.length, index + normalizedQuery.length + 95);
  return `${start > 0 ? '...' : ''}${source.slice(start, end)}${end < source.length ? '...' : ''}`;
}

function extractReferenceLinks(content: string): ReferenceLink[] {
  const links = new Map<string, ReferenceLink>();
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(content)) !== null) {
    const [, rawTitle, rawUrl] = match;
    const url = rawUrl.trim();
    const previousChar = content[match.index - 1];
    if (previousChar === '!' || isImageUrl(url) || links.has(url)) continue;

    let domain = url;
    try {
      domain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      domain = url.replace(/^https?:\/\//, '').split('/')[0];
    }

    links.set(url, {
      title: rawTitle.replace(/[`*_]/g, '').trim(),
      url,
      domain,
    });
  }

  return Array.from(links.values());
}

const learningRoutes: LearningRoute[] = LEARNING_ROUTES;

function MindScapeLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup" aria-label="MindScape">
      <svg className="brand-logo" viewBox="0 0 48 48" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="logoGradient" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f46e5" />
            <stop offset="0.48" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <path d="M24 5c9.9 0 18 8.1 18 18 0 6.5-3.4 12.1-8.6 15.3-2.8 1.7-6 2.7-9.4 2.7S17.4 40 14.6 38.3C9.4 35.1 6 29.5 6 23 6 13.1 14.1 5 24 5Z" fill="url(#logoGradient)" opacity="0.96" />
        <path d="M15 29.4c3.6-1 5.5-3.7 5.5-8.1 0-2.4 1.6-4.3 3.8-4.3 2.1 0 3.7 1.8 3.7 4.1 0 4.9 2.1 7.6 5.9 8.3" fill="none" stroke="white" strokeWidth="3.1" strokeLinecap="round" />
        <path d="M15.5 21.5c2.6-6.8 14.9-8.6 19.1-.7" fill="none" stroke="white" strokeOpacity="0.75" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="17" cy="30" r="2.4" fill="white" />
        <circle cx="34" cy="30" r="2.4" fill="white" />
      </svg>
      {!compact && <span className="brand-word">MindScape</span>}
    </span>
  );
}

function NavIcon({ name }: { name: 'notes' | 'tags' | 'search' | 'roadmap' | 'graph' | 'resources' | 'about' }) {
  const paths = {
    notes: 'M6 4h9a3 3 0 0 1 3 3v13H8a2 2 0 0 1-2-2V4Zm3 4h6M9 12h5',
    tags: 'M4 7V4h3l10.5 10.5a2.1 2.1 0 0 1 0 3l-2 2a2.1 2.1 0 0 1-3 0L4 11V7Zm3 .5h.01',
    search: 'm21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z',
    roadmap: 'M4 17c3-7 6 2 9-5s5-1 7-6M5 17h.01M13 12h.01M20 6h.01',
    graph: 'M12 3c-1.5 2-5 4-8 4 0 5 2 11 8 14 6-3 8-9 8-14-3 0-6.5-2-8-4ZM8 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    resources: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5ZM14 7l-2 3 2 3M10 7l2 3-2 3',
    about: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6M12 7h.01',
  };

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function HomePage() {
  const notes = getNotes();
  const featuredNote = notes[0];
  const secondaryNotes = notes.slice(1, 4);
  const tags = useMemo(() => getAllTags(notes), [notes]);
  const totalWords = useMemo(
    () => notes.reduce((sum, note) => sum + note.content.replace(/[#>*_`\[\]()\-]/g, '').replace(/\s+/g, '').length, 0),
    [notes],
  );
  const heroTags = tags.slice(0, 8);
  
  return (
    <div className="min-h-screen home-lab">
      <section className="home-hero">
        <div className="absolute inset-0 z-0">
          <ParticleField />
        </div>
        <MouseGlow />
        
        <div className="home-hero-grid">
          <motion.div
            className="home-hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="home-kicker">
              <MindScapeLogo compact />
              <span>AI-Native Knowledge Studio</span>
            </div>
            <h1>
              让笔记像一座会发光的<span>思维星图</span>
            </h1>
            <p>
              MindScape 把 Markdown、AI 联想、标签图谱、学习路线和参考文档预览组织成一个可探索的知识界面。
              不是归档文章，而是在每次阅读时重新生成线索。
            </p>

            <div className="home-actions">
              <Link to="/notes" className="primary-button">进入笔记宇宙</Link>
              <Link to="/graph" className="theme-outline-button">查看知识图谱</Link>
            </div>

            <div className="home-stats-strip" aria-label="站点统计">
              <span><strong>{notes.length}</strong> 篇笔记</span>
              <span><strong>{tags.length}</strong> 个标签</span>
              <span><strong>{totalWords}</strong> 字沉淀</span>
            </div>
          </motion.div>

          <motion.div
            className="home-orbit"
            initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="home-orbit-rings" />
            <div className="home-orbit-core">
              <span>MindScape</span>
              <strong>{featuredNote?.title || 'Creative Notes'}</strong>
              {featuredNote && <Link to={`/note/${featuredNote.slug}`}>阅读最新笔记</Link>}
            </div>

            {heroTags.map((tag, index) => (
              <Link
                key={tag}
                to={`/notes?tags=${encodeURIComponent(tag)}`}
                className={`home-orbit-node node-${index + 1}`}
              >
                #{tag}
              </Link>
            ))}

            <div className="home-floating-card card-a">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span>Search</span>
              <strong>全文搜索</strong>
              <small>标题、正文、摘要、标签</small>
            </div>
            <div className="home-floating-card card-b">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17c3-7 6 2 9-5s5-1 7-6"/><circle cx="5" cy="17" r="1"/><circle cx="13" cy="12" r="1"/><circle cx="20" cy="6" r="1"/></svg>
              <span>Roadmap</span>
              <strong>学习路线</strong>
              <small>卡片式流程导航</small>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="home-scroll-hint"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span />
        </motion.div>
      </section>

      <section className="home-section px-4">
        <div className="max-w-7xl mx-auto">
          <div className="home-section-heading">
            <p>Latest Dispatch</p>
            <h2>最新入口不是列表，是一张可继续走下去的地图</h2>
          </div>

          <div className="home-feature-grid">
            {featuredNote && (
              <Link to={`/note/${featuredNote.slug}`} className="block">
                <motion.article
                  className="home-feature-note"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="home-feature-top">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    <span>{formatDateTime(featuredNote.createdAt)}</span>
                    <span>{featuredNote.personality}</span>
                  </div>
                  <h3>{featuredNote.title}</h3>
                  <p>{featuredNote.excerpt}</p>
                  <div className="home-feature-tags">
                    {featuredNote.tags.slice(0, 6).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </motion.article>
              </Link>
            )}

            <div className="home-note-stack">
              {secondaryNotes.map((note, index) => (
                <motion.div
                  key={note.slug}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link to={`/note/${note.slug}`} className="home-stack-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="home-stack-icon"><path d="M9 5l7 7-7 7"/></svg>
                    <div>
                      <strong>{note.title}</strong>
                      <small>{note.tags.slice(0, 3).map((tag) => `#${tag}`).join('  ')}</small>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-capabilities px-4">
        <div className="max-w-7xl mx-auto">
          <div className="home-section-heading">
            <p>Navigation Systems</p>
            <h2>为长文、路线、图谱和参考资料设计的阅读仪表盘</h2>
          </div>

          <div className="home-capability-grid">
            {[
              { title: '沉浸式长文阅读', text: '固定目录、阅读进度、字体控制、PDF 打印版和代码高亮复制。', to: '/notes', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { title: '标签与全文搜索', text: '顶部搜索弹窗即时检索标题、摘要、标签和正文，标签页支持主题分组。', to: '/tags', icon: 'm21 21-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z' },
              { title: '学习路线流图', text: '用 React Flow 把网址、视频和博文组织成并行阶段路线图。', to: '/roadmap', icon: 'M4 17c3-7 6 2 9-5s5-1 7-6M5 17h.01M13 12h.01M20 6h.01' },
              { title: '知识图谱探索', text: '基于标签生成笔记网络，发现不同主题之间的隐藏连接。', to: '/graph', icon: 'M12 3c-1.5 2-5 4-8 4 0 5 2 11 8 14 6-3 8-9 8-14-3 0-6.5-2-8-4ZM8 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z' },
            ].map((item) => (
              <Link key={item.title} to={item.to} className="home-capability-card">
                <div className="home-capability-icon">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            最新思维碎片
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.slice(0, 3).map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <NoteCard note={note} index={index} />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/notes"
              className="theme-outline-button"
            >
              查看全部笔记 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotesPage() {
  const notes = getNotes();
  const [searchParams, setSearchParams] = useSearchParams();
  const tags = useMemo(() => getAllTags(notes), [notes]);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  const selectedTags = useMemo(() => {
    const raw = searchParams.get('tags');
    return raw ? raw.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const hasFilter = selectedTags.length > 0;

  // 按目录分组标签
  const tagGroups = useMemo(() => {
    const dirMap = new Map<string, string[]>();
    notes.forEach(note => {
      const dir = note.directory;
      note.tags.forEach(tag => {
        if (!dirMap.has(dir)) dirMap.set(dir, []);
        if (!dirMap.get(dir)!.includes(tag)) {
          dirMap.get(dir)!.push(tag);
        }
      });
    });
    return Array.from(dirMap.entries())
      .map(([dir, dirTags]) => ({
        id: dir,
        label: dir,
        tags: dirTags.sort((a, b) => a.localeCompare(b, 'zh-CN')),
      }))
      .sort((a, b) => a.id.localeCompare(b.id, 'zh-CN'));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!hasFilter) return notes;
    return notes.filter((note) => selectedTags.some((t) => note.tags.includes(t)));
  }, [notes, selectedTags, hasFilter]);

  const toggleTag = (tag: string) => {
    const current = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    if (current.length === 0) {
      setSearchParams({});
    } else {
      setSearchParams({ tags: current.join(',') });
    }
  };

  const clearFilter = () => setSearchParams({});

  const toggleDir = (dir: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(dir)) next.delete(dir);
      else next.add(dir);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-5xl font-bold mb-4 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          所有笔记
        </motion.h1>
        <p className="theme-muted mb-8 text-lg">
          {hasFilter
            ? `筛选 ${selectedTags.map(t => `#${t}`).join('、')} — 共 ${filteredNotes.length} 篇`
            : `共 ${notes.length} 篇思维记录`}
        </p>

        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-base font-semibold theme-text whitespace-nowrap">标签筛选</h2>
            <div className="flex items-center gap-2 shrink-0">
              {hasFilter && (
                <button
                  type="button"
                  onClick={clearFilter}
                  className="text-sm theme-link whitespace-nowrap"
                >
                  清除筛选
                </button>
              )}
              <div className="notes-view-toggle" role="radiogroup" aria-label="显示模式">
                <button
                  type="button"
                  role="radio"
                  aria-checked={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'notes-view-btn notes-view-active' : 'notes-view-btn'}
                  title="卡片视图"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={viewMode === 'timeline'}
                  onClick={() => setViewMode('timeline')}
                  className={viewMode === 'timeline' ? 'notes-view-btn notes-view-active' : 'notes-view-btn'}
                  title="时间线视图"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="6" cy="6" r="1.5" fill="currentColor"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="6" cy="18" r="1.5" fill="currentColor"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Grouped tags by directory */}
          <div className="space-y-3">
            {tagGroups.map((group) => {
              const isExpanded = expandedDirs.has(group.id);
              const count = (tag: string) => notes.filter(n => n.tags.includes(tag)).length;
              const active = group.tags.filter(t => selectedTags.includes(t)).length;

              return (
                <div key={group.id} className="glass-card p-3">
                  <button
                    type="button"
                    onClick={() => toggleDir(group.id)}
                    className="flex items-center justify-between w-full mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium theme-text">{group.label}</span>
                      {active > 0 && (
                        <span className="px-1.5 py-0.5 text-xs rounded bg-nebula-accent/20 text-nebula-accent">
                          {active}
                        </span>
                      )}
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      className={`theme-subtle transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </button>
                  <div className="flex flex-wrap gap-1.5">
                    {(isExpanded ? group.tags : group.tags.slice(0, 6)).map((tag) => {
                      const isActive = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={isActive ? 'notes-filter-tag notes-filter-tag-active' : 'notes-filter-tag'}
                        >
                          #{tag}
                          <span>{count(tag)}</span>
                        </button>
                      );
                    })}
                    {!isExpanded && group.tags.length > 6 && (
                      <span className="text-xs theme-subtle self-center">
                        +{group.tags.length - 6} 更多
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {viewMode === 'timeline' ? (
          <div className="notes-timeline">
            <div className="notes-timeline-line" />
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                className="notes-timeline-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <div className="notes-timeline-dot" />
                <Link to={`/note/${note.slug}`} className="notes-timeline-card">
                  <NoteCoverImage
                    src={note.cover?.trim() || defaultCoverUrlFromSlug(note.slug)}
                    slug={note.slug}
                    alt=""
                    className="notes-timeline-cover"
                  />
                  <div className="notes-timeline-card-main">
                    <div className="notes-timeline-meta">
                      <svg viewBox="0 0 24 24" width="13" height="13"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span>{formatDateTime(note.createdAt)}</span>
                      {note.personality && (
                        <>
                          <span className="opacity-30 mx-1">·</span>
                          <span>{note.personality}</span>
                        </>
                      )}
                    </div>
                    <h3 className="notes-timeline-title">{note.title}</h3>
                    {note.excerpt && (
                      <p className="notes-timeline-excerpt">{note.excerpt}</p>
                    )}
                    <div className="notes-timeline-tags">
                      {note.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NoteCard note={note} index={index} />
              </motion.div>
            ))}
          </div>
        )}

        {filteredNotes.length === 0 && (
          <div className="glass-card p-8 text-center theme-muted">
            这个标签下暂时没有笔记。
          </div>
        )}
      </div>
    </div>
  );
}

function TagsPage() {
  const notes = getNotes();
  const tags = useMemo(() => getAllTags(notes), [notes]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // 按目录分组标签
  const tagGroups = useMemo(() => {
    const dirMap = new Map<string, string[]>();
    notes.forEach(note => {
      const dir = note.directory;
      note.tags.forEach(tag => {
        if (!dirMap.has(dir)) dirMap.set(dir, []);
        if (!dirMap.get(dir)!.includes(tag)) {
          dirMap.get(dir)!.push(tag);
        }
      });
    });
    return Array.from(dirMap.entries())
      .map(([dir, dirTags]) => ({
        id: dir,
        label: dir,
        tags: dirTags.sort((a, b) => a.localeCompare(b, 'zh-CN')),
      }))
      .sort((a, b) => a.id.localeCompare(b.id, 'zh-CN'));
  }, [notes]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tags.forEach(t => { counts[t] = notes.filter(n => n.tags.includes(t)).length; });
    return counts;
  }, [tags, notes]);

  const maxCount = useMemo(() => Math.max(...Object.values(tagCounts), 1), [tagCounts]);

  const selectedTagNotes = useMemo(() => {
    if (!selectedTag) return [];
    return notes.filter(n => n.tags.includes(selectedTag));
  }, [selectedTag, notes]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(prev => prev === tag ? null : tag);
  };

  const toggleDir = (dir: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(dir)) next.delete(dir);
      else next.add(dir);
      return next;
    });
  };

  // 默认展开第一个目录
  useEffect(() => {
    if (tagGroups.length > 0 && expandedDirs.size === 0) {
      setExpandedDirs(new Set([tagGroups[0].id]));
    }
  }, [tagGroups, expandedDirs.size]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-5xl font-bold mb-4 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          标签分类
        </motion.h1>
        <p className="theme-muted mb-8 text-lg">
          按目录浏览 {notes.length} 篇笔记中的 {tags.length} 个标签。
        </p>

        {/* Selected tag result */}
        {selectedTag ? (
          <motion.div
            key={selectedTag}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="tag-result-panel"
          >
            <div className="tag-result-header">
              <button type="button" onClick={() => setSelectedTag(null)} className="tag-result-back">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 12H5m7-7-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                返回标签
              </button>
              <span className="tag-result-label">
                <span className="tag-chip-active">#{selectedTag}</span>
                <span className="tag-result-count">{selectedTagNotes.length} 篇</span>
              </span>
            </div>
            <div className="tag-result-list">
              {selectedTagNotes.map((note) => (
                <Link key={note.slug} to={`/note/${note.slug}`} className="tag-result-item">
                  <svg viewBox="0 0 24 24" width="15" height="15" className="tag-result-arrow"><path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                  <span className="tag-result-title">{note.title}</span>
                  <span className="tag-result-excerpt">{note.excerpt}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Grouped tags by directory */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {tagGroups.map((group) => {
              const isExpanded = expandedDirs.has(group.id);
              const visibleTags = isExpanded ? group.tags : group.tags.slice(0, 5);
              const hasMore = group.tags.length > 5;

              return (
                <div key={group.id} className="glass-card p-5">
                  <button
                    type="button"
                    onClick={() => toggleDir(group.id)}
                    className="flex items-center justify-between w-full mb-3 group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold theme-text">{group.label}</span>
                      <span className="text-xs theme-subtle">({group.tags.length})</span>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      className={`theme-subtle transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {visibleTags.map((tag) => {
                      const freq = tagCounts[tag] / maxCount;
                      const size = 0.85 + freq * 0.35;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagClick(tag)}
                          className="tag-cloud-chip"
                          style={{ fontSize: `${size}rem` }}
                        >
                          #{tag}
                          <span className="tag-cloud-count">{tagCounts[tag]}</span>
                        </button>
                      );
                    })}
                  </div>
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => toggleDir(group.id)}
                      className="mt-3 text-sm text-nebula-accent hover:underline"
                    >
                      {isExpanded ? '收起' : `展开更多 (${group.tags.length - 5})`}
                    </button>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const notes = getNotes();
  const [query, setQuery] = useState('');
  const normalizedQuery = normalizeSearchText(query);
  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return notes
      .map((note) => ({
        note,
        score: scoreNote(note, normalizedQuery),
        snippet: getSearchSnippet(note, normalizedQuery),
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || new Date(b.note.createdAt).getTime() - new Date(a.note.createdAt).getTime());
  }, [notes, normalizedQuery]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const closeAndReset = () => {
    onClose();
    setQuery('');
  };

  return (
    <div className="search-modal-layer" role="dialog" aria-modal="true" aria-label="全文搜索">
      <button type="button" className="search-modal-backdrop" aria-label="关闭搜索" onClick={onClose} />
      <motion.div
        className="search-modal"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.18 }}
      >
        <div className="search-modal-header">
          <div>
            <p>Search</p>
            <h2>全文搜索</h2>
          </div>
          <button type="button" className="search-close-btn" onClick={onClose} aria-label="关闭搜索">
            <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="search-box search-box-modal">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索 AI Coding、React、workflow..."
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => setQuery('')}>
              清除
            </button>
          )}
        </div>

        <div className="search-meta">
          {query ? `找到 ${results.length} 条结果` : `当前可搜索 ${notes.length} 篇笔记`}
        </div>

        <div className="search-results search-results-modal">
          {results.map(({ note, snippet }) => (
            <Link key={note.slug} to={`/note/${note.slug}`} className="search-result-card" onClick={closeAndReset}>
              <div className="flex flex-wrap gap-2 mb-3">
                {note.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="tag-pill">#{tag}</span>
                ))}
              </div>
              <h2>{note.title}</h2>
              <p>{snippet}</p>
              <small>{formatDateTime(note.createdAt)} · {note.personality}</small>
            </Link>
          ))}
        </div>

        {query && results.length === 0 && (
          <div className="empty-search">
            没找到匹配内容。换个关键词试试。
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SearchPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
}

function NotePage() {
  const { '*': slugParam } = useParams<{ '*'?: string }>();
  const slug = slugParam ?? undefined;
  const navigate = useNavigate();
  const note = useMemo(() => (slug ? getNoteBySlug(slug) : null), [slug]);
  const allNotes = useMemo(() => getNotes(), []);
  const toc = useMemo(() => (note ? extractTableOfContents(note.content) : []), [note]);
  const references = useMemo(() => (note ? extractReferenceLinks(note.content) : []), [note]);
  const relatedNotes = useMemo(() => (note ? getRelatedNotes(note, allNotes, 4) : []), [note, allNotes]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const { open: graphCollapsed, setOpen: setGraphCollapsed } = useContext(GraphSidebarContext);

  // Unlock state management - global unlock
  // 默认都需要解锁，只有 locked: false 才不需要
  const { isUnlocked, unlock } = useUnlock();
  const noteIsUnlocked = isUnlocked();
  const noteNeedsUnlock = note?.locked !== false;

  // Progressive lock: show overlay when user tries to access locked content
  const [showUnlockOverlay, setShowUnlockOverlay] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Calculate 5% preview content for locked notes
  const { previewContent, lockedContentStart } = useMemo(() => {
    if (!note || !noteNeedsUnlock) return { previewContent: '', lockedContentStart: 0 };
    const totalLength = note.content.length;
    const previewLength = Math.floor(totalLength * 0.05);
    // Find a good break point (paragraph or heading)
    const preview = note.content.slice(0, previewLength);
    const lastNewline = preview.lastIndexOf('\n');
    const lastHeading = preview.lastIndexOf('\n\n');
    const breakPoint = Math.max(lastNewline, lastHeading, previewLength - 200);
    return {
      previewContent: note.content.slice(0, breakPoint),
      lockedContentStart: breakPoint
    };
  }, [note, noteNeedsUnlock]);

  // Check if TOC heading is in locked content
  const isHeadingInLockedContent = useCallback((headingText: string): boolean => {
    if (!noteNeedsUnlock) return false;
    const headingIndex = note.content.indexOf(headingText);
    return headingIndex >= lockedContentStart;
  }, [note, noteNeedsUnlock, lockedContentStart]);

  // Monitor sentinel element to trigger unlock overlay
  useEffect(() => {
    if (!noteNeedsUnlock || noteIsUnlocked || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // User scrolled to or past the sentinel - show unlock overlay
            setShowUnlockOverlay(true);
          }
        });
      },
      { threshold: 0, rootMargin: '0px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [noteNeedsUnlock, noteIsUnlocked]);

  // Handle TOC click - check if heading is in locked content
  useEffect(() => {
    if (!noteNeedsUnlock || noteIsUnlocked) return;

    const handleTOCClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tocLink = target.closest('a');
      if (!tocLink) return;

      const href = tocLink.getAttribute('href');
      if (!href) return;

      const headingId = href.replace('#', '');
      const headingEl = document.getElementById(headingId);
      if (!headingEl) return;

      const headingText = headingEl.textContent || '';
      if (isHeadingInLockedContent(headingText)) {
        e.preventDefault();
        e.stopPropagation();
        setShowUnlockOverlay(true);
      }
    };

    document.addEventListener('click', handleTOCClick, true);
    return () => document.removeEventListener('click', handleTOCClick, true);
  }, [noteNeedsUnlock, noteIsUnlocked, isHeadingInLockedContent]);

  // Unlock handler
  const handleUnlock = useCallback((key: string): boolean => {
    if (!note) return false;
    const success = unlock(key, note.unlockKey || 'Cephalosporan');
    if (success) {
      setShowUnlockOverlay(false);
    }
    return success;
  }, [note, unlock]);

  // Scroll-spy: track which heading is visible via IntersectionObserver
  useEffect(() => {
    if (toc.length === 0) return;

    const callback: IntersectionObserverCallback = (entries) => {
      const intersecting = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (intersecting.length > 0) {
        setActiveHeadingId(intersecting[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-80px 0px -70% 0px',
      threshold: [0, 0.25, 0.5, 1],
    });

    // Small delay to ensure headings are in DOM after render
    const timer = setTimeout(() => {
      toc.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [toc]);

  const adjacentNotes = useMemo(() => {
    if (!note) return { previous: null as Note | null, next: null as Note | null };
    const index = allNotes.findIndex((item) => item.slug === note.slug);
    return {
      previous: index >= 0 ? allNotes[index + 1] ?? null : null,
      next: index > 0 ? allNotes[index - 1] ?? null : null,
    };
  }, [note, allNotes]);
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  const noteMeta = useMemo(() => {
    if (!note) return null;
    const stripped = note.content.replace(/[#>*_`\[\]()\-]/g, ' ').replace(/\s+/g, '');
    const charCount = stripped.length;
    const readingTime = Math.max(1, Math.round(charCount / 400));
    return { wordCount: charCount, readingTime };
  }, [note]);
  
  useEffect(() => {
    if (slug) {
      const allNotes = getNotes();
      const otherNotes = allNotes.filter(n => n.id !== slug);
      if (otherNotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherNotes.length);
        setRandomNote(otherNotes[randomIndex]);
      }
    }
  }, [slug]);
  
  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">笔记未找到</h1>
          <Link to="/notes" className="text-nebula-accent hover:underline">
            返回笔记列表
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 relative z-10">
      <aside className="reading-toc hidden xl:block">
        <div className="toc-panel">
          <div className="toc-kicker">On this page</div>
          <p className="text-sm font-semibold theme-text mb-4">文章目录</p>
            {toc.length > 0 ? (
              <nav>
                <TocTree nodes={buildTocTree(toc)} activeId={activeHeadingId} />
              </nav>
            ) : (
              <p className="text-sm theme-subtle">这篇文章暂无小标题。</p>
            )}
        </div>
      </aside>

      <NoteGraphSidebar
        currentNote={note}
        allNotes={allNotes}
        relatedNotes={relatedNotes}
        collapsed={graphCollapsed}
        onToggle={() => setGraphCollapsed(!graphCollapsed)}
        className="hidden lg:block"
      />

      <main className="reading-main max-w-3xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="note-back-btn mb-8"
        >
          <Link
            to="/notes"
            className="inline-flex items-center theme-link transition-colors text-sm"
          >
            ← 返回笔记列表
          </Link>
        </motion.div>

        <div className="xl:hidden mb-8">
          <details className="mobile-toc">
            <summary>文章目录</summary>
            <nav className="mt-4">
              <TocTree nodes={buildTocTree(toc)} activeId={activeHeadingId} />
            </nav>
          </details>
        </div>
        
        {/* Note header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 mb-6">
            {note.tags.map(tag => (
              <span
                key={tag}
                className="tag-pill"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            {note.title}
          </h1>
          
          {note.excerpt && (
            <motion.p 
              className="text-xl text-nebula-accent italic mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {note.excerpt}
            </motion.p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 text-xs theme-muted mt-8 pt-5 border-t border-white/10">
            <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>{formatDateTime(note.createdAt)}</span>

            <span className="opacity-30">·</span>

            <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{noteMeta ? `${noteMeta.readingTime} 分钟阅读` : ''}</span>

            <span className="opacity-30">·</span>

            <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="capitalize">{note.personality}</span>

            {note.mood && (
              <>
                <span className="opacity-30">·</span>
                <span>{note.mood}</span>
              </>
            )}

            {noteMeta && (
              <>
                <span className="opacity-30">·</span>
                <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>{noteMeta.wordCount} 字</span>
              </>
            )}
          </div>
        </motion.header>

        {/* AI Summary Panel - TODO: re-enable when AI API is working */}
        {/* <AISummaryPanel note={note} /> */}

        <div className="mb-6">
          <AIPanel
            note={note}
            randomNote={randomNote}
            relatedNotes={relatedNotes}
            onRandomWalk={() => randomNote && navigate(`/note/${randomNote.slug}`)}
          />
        </div>

        {/* Note content with Markdown renderer */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-none"
        >
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            {noteNeedsUnlock && !noteIsUnlocked ? (
              <>
                {/* Show only preview for locked notes */}
                <MarkdownContent content={previewContent} />
                {/* Sentinel element to detect scroll past 5% */}
                <div ref={sentinelRef} className="unlock-sentinel" />
                {/* Fade overlay for locked content */}
                <div className="unlock-content-fade" />
              </>
            ) : (
              /* Full content for unlocked or non-locked notes */
              <MarkdownContent content={note.content} />
            )}
            <div className="note-content-footer">
              <div className="note-content-meta">
                {note.updatedAt && (
                  <span>更新于 {formatDateTime(note.updatedAt)}（{relativeTime(note.updatedAt)}）</span>
                )}
                {noteMeta && (
                  <>
                    <span>约 {noteMeta.wordCount} 字</span>
                    <span>预计阅读 {noteMeta.readingTime} 分钟</span>
                  </>
                )}
              </div>
              <div className="note-content-tags">
                {note.tags.map(tag => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Unlock overlay for locked notes */}
        <ContentUnlockOverlay
          isVisible={showUnlockOverlay}
          isUnlocked={noteIsUnlocked}
          onUnlock={handleUnlock}
          onClose={() => setShowUnlockOverlay(false)}
          articleTitle={note.title}
          wechatQrCode="/images/wechat-qr.png"
        />

        {references.length > 0 && (
          <section className="reference-section">
            <div className="reference-section-header">
              <p>Reference</p>
              <h2>参考文档</h2>
            </div>
            <div className="reference-grid">
              {references.map((reference) => (
                <ReferencePreviewCard key={reference.url} reference={reference} />
              ))}
            </div>
          </section>
        )}

        <section className="note-navigation-section">
          <div className="note-adjacent-row">
            {adjacentNotes.previous ? (
              <Link to={`/note/${adjacentNotes.previous.slug}`} className="note-adjacent-link note-adjacent-prev">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
                <span>{adjacentNotes.previous.title}</span>
              </Link>
            ) : (
              <span className="note-adjacent-link note-adjacent-disabled">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
                <span>已经是第一篇</span>
              </span>
            )}

            {adjacentNotes.next ? (
              <Link to={`/note/${adjacentNotes.next.slug}`} className="note-adjacent-link note-adjacent-next">
                <span>{adjacentNotes.next.title}</span>
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </Link>
            ) : (
              <span className="note-adjacent-link note-adjacent-disabled">
                <span>已经是最后一篇</span>
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function RoadmapPage() {
  const [activeRoute, setActiveRoute] = useState(learningRoutes[0].id);
  const currentRoute = learningRoutes.find((route) => route.id === activeRoute) || learningRoutes[0];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold mb-5 gradient-text">学习路线一览</h1>
          <p className="theme-muted max-w-3xl mx-auto leading-relaxed">
            把视频、网址和博文组织成可切换的路线图。路线数据集中配置，后续只要改数组就能扩展新的学习路径。
          </p>
        </motion.div>

        <div className="roadmap-tabs">
          {learningRoutes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => setActiveRoute(route.id)}
              className={route.id === activeRoute ? 'roadmap-tab-active' : 'roadmap-tab'}
            >
              {route.title}
            </button>
          ))}
        </div>

        <section className="roadmap-board">
          <div className="roadmap-header">
            <div>
              <p className="roadmap-label">Learning Roadmap</p>
              <h2>{currentRoute.title}</h2>
              <p>{currentRoute.summary}</p>
            </div>
            <Link to="/notes" className="theme-outline-button">浏览相关笔记</Link>
          </div>

          <LearningRoadmapFlow route={currentRoute} />

          <div className="roadmap-resources">
            {currentRoute.resources.map((resource) => {
              const isInternal = resource.url.startsWith('/');
              const content = (
                <>
                  <span>{resource.type}</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.url}</p>
                </>
              );

              return isInternal ? (
                <Link key={resource.title} to={resource.url} className="resource-card">
                  {content}
                </Link>
              ) : (
                <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer" className="resource-card">
                  {content}
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function GraphPage() {
  const notes = getNotes();

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-5xl font-bold mb-4 gradient-text">笔记图谱</h1>
          <p className="theme-muted text-lg">
            基于标签关联的 {notes.length} 篇笔记知识网络，节点代表笔记，连线代表共享标签。
          </p>
        </motion.div>

        <div className="glass-card p-4 rounded-2xl">
          <NoteGraph notes={notes} />
        </div>
      </div>
    </div>
  );
}

function AIEngineeringPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [embedSize, setEmbedSize] = useState({ width: 90, height: 75 });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / window.innerWidth) * 100;
      const newHeight = ((e.clientY - rect.top) / window.innerHeight) * 100;
      const clampedWidth = Math.max(50, Math.min(100, newWidth));
      const clampedHeight = Math.max(30, Math.min(90, newHeight));
      setEmbedSize({ width: clampedWidth, height: clampedHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nebula-accent/10 border border-nebula-accent/20 text-nebula-accent text-sm font-semibold mb-6">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            外部资源 · AI Native Engineering
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">AI-Native Engineering</h1>
          <p className="text-lg theme-muted max-w-2xl mx-auto leading-relaxed">
            涵盖 AI 辅助编程、工具链、工作流和工程实践的深度思考与实操指南。
          </p>
          {/* <div className="flex items-center justify-center gap-4 mt-6">
            <a
              href="https://tatsukimeng.github.io/ai-native-engineering/"
              target="_blank"
              rel="noreferrer"
              className="primary-button"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              在新窗口打开
            </a>
            <a
              href="https://github.com/tatsukimeng/ai-native-engineering"
              target="_blank"
              rel="noreferrer"
              className="theme-outline-button"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.8c.85.004 1.7.115 2.5.34 1.9-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.75c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
              </svg>
              源码仓库
            </a>
          </div> */}
        </motion.div>

        {/* Embedded iframe */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="engineer-embed-wrapper"
          style={{ width: `${embedSize.width}%`, height: `${embedSize.height}vh` }}
        >
          <div className="engineer-embed-header">
            <div className="engineer-embed-dots">
              <span />
              <span />
              <span />
            </div>
            <span className="engineer-embed-url">tatsukimeng.github.io/ai-native-engineering</span>
            <a
              href="https://tatsukimeng.github.io/ai-native-engineering/"
              target="_blank"
              rel="noreferrer"
              className="engineer-embed-open"
              title="在新窗口打开"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>

          {!iframeLoaded && !iframeError && (
            <div className="engineer-embed-loading">
              <div className="engineer-embed-spinner" />
              <p>正在加载 AI-Native Engineering...</p>
            </div>
          )}

          {iframeError ? (
            <div className="engineer-embed-fallback">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-nebula-accent mb-4">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4m0 4h.01"/>
              </svg>
              <p className="text-lg font-semibold mb-2">无法嵌入外部页面</p>
              <p className="text-sm theme-muted mb-4">这可能是因为目标站点限制了嵌入。</p>
              <a
                href="https://tatsukimeng.github.io/ai-native-engineering/"
                target="_blank"
                rel="noreferrer"
                className="primary-button"
              >
                直接访问 →
              </a>
            </div>
          ) : (
            <iframe
              src="https://tatsukimeng.github.io/ai-native-engineering/"
              title="AI-Native Engineering"
              className={`engineer-iframe ${iframeLoaded ? 'engineer-iframe-loaded' : ''}`}
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeError(true)}
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}

          {/* Resize handle */}
          <div
            className={`engineer-resize-handle ${isResizing ? 'engineer-resize-handle-active' : ''}`}
            onMouseDown={handleMouseDown}
            title="拖动调整大小"
          >
            <div className="engineer-resize-indicator">
              <span>{Math.round(embedSize.width)}% × {Math.round(embedSize.height)}%</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          {/* <p className="text-xs theme-subtle">
            嵌入来自{' '}
            <a
              href="https://github.com/tatsukimeng"
              target="_blank"
              rel="noreferrer"
              className="text-nebula-accent hover:underline"
            >
              @tatsukimeng
            </a>{' '}
            的 AI Native Engineering ·{' '}
            <a
              href="https://tatsukimeng.github.io/ai-native-engineering/"
              target="_blank"
              rel="noreferrer"
              className="text-nebula-accent hover:underline"
            >
              访问原站
            </a>
          </p> */}
        </motion.div>
      </div>
    </div>
  );
}

function ModelSelectionPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="min-h-screen pt-24 relative z-10">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-nebula-accent border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <p className="theme-muted text-sm">加载中...</p>
          </div>
        </div>
      )}
      {error ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
          <p className="text-lg mb-4">页面加载失败</p>
          <a
            href="https://www.codingplan.fyi/"
            target="_blank"
            rel="noreferrer"
            className="text-nebula-accent hover:underline"
          >
            在新标签页打开
          </a>
        </div>
      ) : (
        <iframe
          src="https://www.codingplan.fyi/"
          className="w-full h-[calc(100vh-6rem)] border-0"
          title="模型选型"
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )}
    </div>
  );
}

function ToolsPage() {
  const categories = RESOURCE_CATEGORIES;
  const totalResources = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 gradient-text">工具推荐</h1>
          <p className="text-lg theme-muted max-w-2xl mx-auto">
            精选 {totalResources} 个开发工具和学习资源，分类整理方便快速定位。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * ci }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-lg bg-nebula-accent/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-nebula-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={cat.icon} />
                  </svg>
                </div>
                <h2 className="text-base font-bold theme-text">{cat.title}</h2>
              </div>
              <ul className="space-y-0.5">
                {cat.items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="resource-item-link"
                    >
                      <img
                        className="resource-item-icon"
                        src={`${FAVICON_YANDEX_URL}${getHostname(item.url)}`}
                        alt=""
                        width="16"
                        height="16"
                        loading="lazy"
                      />
                      <span className="resource-item-name">{item.name}</span>
                      <span className="resource-item-desc">{item.desc}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AICodingGuidePage() {
  const allNotes = getNotes();
  const aiCodingNotes = useMemo(() => {
    const targetSlugs = [
      'ai-coding-learning-checklist',
      'AI Coding/AI Coding 规范之美——TRSS 四位一体',
    ];
    return allNotes.filter(n => targetSlugs.includes(n.slug));
  }, [allNotes]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 gradient-text">AI Coding 实战指南</h1>
          <p className="text-lg theme-muted max-w-2xl mx-auto">
            视频教程与实战文章，助你掌握 AI 辅助编程的精髓。
          </p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 theme-text flex items-center gap-3">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nebula-accent">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            视频教程
          </h2>
          <div className="aspect-video bg-nebula-purple/30 rounded-2xl border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-50">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="7" x2="22" y2="7" />
                <line x1="2" y1="17" x2="22" y2="17" />
              </svg>
              <p className="theme-muted text-sm mb-2">视频占位区域</p>
              <p className="theme-subtle text-xs">视频链接待补充...</p>
            </div>
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 theme-text flex items-center gap-3">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nebula-accent">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            相关博文
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiCodingNotes.map((note, index) => (
              <Link key={note.slug} to={`/note/${note.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-card p-6 hover:border-nebula-accent/50 transition-colors cursor-pointer"
                >
                  <h3 className="text-lg font-bold mb-2 gradient-text line-clamp-2">{note.title}</h3>
                  {note.excerpt && (
                    <p className="text-sm theme-muted line-clamp-2 mb-3">{note.excerpt}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {note.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag-pill text-xs">#{tag}</span>
                    ))}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AboutPage() {
  const notes = getNotes();
  const tags = getAllTags(notes);
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    notes.forEach(n => n.tags.forEach(t => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [notes]);
  const monthlyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(n => {
      const d = n.createdAt?.match(/(\d{4})[年-](\d{1,2})/);
      if (d) {
        const key = `${d[1]}.${d[2].padStart(2, '0')}`;
        counts[key] = (counts[key] ?? 0) + 1;
      }
    });
    return counts;
  }, [notes]);

  const timelineYears = useMemo(() => {
    const years: Record<string, { month: string; count: number }[]> = {};
    Object.entries(monthlyCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, count]) => {
        const [year, month] = key.split('.');
        if (!years[year]) years[year] = [];
        years[year].push({ month, count });
      });
    return years;
  }, [monthlyCounts]);

  const features = [
    { icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', title: '数字花园', desc: '笔记像植物一样生长，随学习持续修订，不追求一次性完成。' },
    { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21h14', title: '知识关联', desc: '通过标签和图谱发现笔记间的隐藏连接，让知识网络自然浮现。' },
    { icon: 'M12 3c-1.5 2-5 4-8 4 0 5 2 11 8 14 6-3 8-9 8-14-3 0-6.5-2-8-4z', title: 'AI 共振', desc: 'AI 为每篇笔记生成隐喻、联想和人格，带来意料之外的阅读体验。' },
    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', title: '沉浸阅读', desc: '无干扰的沉浸模式、可调字号、PDF 导出，让深度阅读随时开始。' },
  ];

  const maxCount = useMemo(() => Math.max(...Object.values(monthlyCounts), 1), [monthlyCounts]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 relative z-10 overflow-hidden">
      {/* Decorative background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-500/8 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-gradient-to-tl from-pink-500/8 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Hero with asymmetric layout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-baseline justify-center gap-3 mb-6">
            <span className="text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Mind</span>
            <span className="text-6xl md:text-7xl font-black tracking-tight text-white/90">Scape</span>
          </div>
          <p className="text-xl theme-muted leading-relaxed max-w-2xl mx-auto">
            AI-Native 的创意知识空间，收纳技术学习、思维模型、工作流实践和长期生长的个人笔记。
          </p>
        </motion.div>

        {/* Stats cluster - 2x2 grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {[
            { value: notes.length, label: '篇笔记', icon: '✦' },
            { value: tags.length, label: '个标签', icon: '✦' },
            { value: Object.keys(monthlyCounts).length, label: '覆盖月份', icon: '✦' },
            { value: notes.reduce((sum, n) => sum + n.content.replace(/[#>*_`\[\]()\-]/g, '').replace(/\s+/g, '').length, 0), label: '总字数', icon: '✦' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card p-6 text-center relative overflow-hidden"
            >
              <span className="absolute top-3 right-3 text-xs text-purple-400/40">{stat.icon}</span>
              <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-1">{stat.value}</p>
              <p className="text-sm theme-subtle">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features - magazine style with large index numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase">Design Philosophy</span>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
          </div>
          <h2 className="text-4xl font-black mb-8 theme-text">设计理念</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors"
              >
                {/* Decorative index */}
                <span className="absolute -top-4 -right-4 text-[120px] font-black text-purple-500/5 select-none leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative flex gap-5 items-start">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/10 border border-purple-500/20 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={f.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg theme-text mb-2">{f.title}</h3>
                    <p className="text-sm theme-muted leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Tags with opacity gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Hot Tags</span>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
          </div>
          <h2 className="text-4xl font-black mb-8 theme-text">热门标签</h2>
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-bl-full" />
            <div className="relative flex flex-wrap gap-3">
              {tagCounts.slice(0, 15).map(([tag, count], index) => {
                const opacity = 0.4 + (count / Math.max(...tagCounts.slice(0, 15).map(([, c]) => c), 1)) * 0.6;
                const size = count >= 4 ? 'text-lg' : count >= 2 ? 'text-base' : 'text-sm';
                const weight = count >= 4 ? 'font-bold' : count >= 2 ? 'font-semibold' : 'font-medium';
                return (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      to={`/notes?tags=${encodeURIComponent(tag)}`}
                      className={`${size} ${weight} px-4 py-2 rounded-full border border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all theme-muted inline-block`}
                      style={{ opacity }}
                    >
                      #{tag}
                      <span className="ml-2 text-xs opacity-60">({count})</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Content Areas with gradient borders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-transparent rounded-l" />
            <div className="absolute -top-8 -right-8 text-[100px] font-black text-purple-500/5 select-none leading-none">01</div>
            <div className="relative flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/20 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold theme-text">这里记录什么</h2>
            </div>
            <div className="space-y-4 theme-muted leading-relaxed">
              <p>这里更像一座数字花园，而不是一次性写完的文章仓库。笔记会随着学习、实践和复盘持续更新。</p>
              <p>内容覆盖 AI 编程、前端工程、知识管理、生产力方法、个人成长，以及一些正在形成中的想法。</p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent rounded-l" />
            <div className="absolute -top-8 -right-8 text-[100px] font-black text-cyan-500/5 select-none leading-none">02</div>
            <div className="relative flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-transparent border border-cyan-500/20 flex items-center justify-center">
                <Compass className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold theme-text">如何浏览</h2>
            </div>
            <ul className="space-y-3 theme-muted leading-relaxed">
              <li className="flex gap-3 items-start">
                <span className="text-cyan-400 shrink-0 mt-0.5">→</span>
                <span>从<a href="/notes" className="text-cyan-400 hover:underline">最新笔记</a>开始，或按标签筛选主题。</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-cyan-400 shrink-0 mt-0.5">→</span>
                <span>长文页面左侧目录支持快速跳转，右侧图谱展示知识关联。</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-cyan-400 shrink-0 mt-0.5">→</span>
                <span>使用<a href="/graph" className="text-cyan-400 hover:underline">笔记图谱</a>可视化探索笔记网络。</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-cyan-400 shrink-0 mt-0.5">→</span>
                <span>开启沉浸模式或调整字号，获得更舒适的阅读体验。</span>
              </li>
            </ul>
          </motion.section>
        </div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-semibold tracking-widest text-pink-400 uppercase">Tech Stack</span>
            <div className="flex-1 h-px bg-gradient-to-r from-pink-500/30 to-transparent" />
          </div>
          <h2 className="text-4xl font-black mb-8 theme-text">技术栈</h2>
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/5 to-transparent rounded-tl-full" />
            <div className="relative flex flex-wrap gap-3">
              {[
                'React 19', 'TypeScript', 'Vite 8', 'Tailwind CSS', 'Framer Motion',
                'React Router', 'react-markdown', 'D3.js', 'highlight.js', 'Vercel',
              ].map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="px-4 py-2 rounded-full border border-white/10 text-sm theme-subtle hover:border-pink-500/30 hover:text-pink-400 transition-colors"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline with year badges */}
        {Object.keys(timelineYears).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase">Timeline</span>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
            </div>
            <h2 className="text-4xl font-black mb-8 theme-text">写作时间线</h2>
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-8 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
              <div className="relative">
                {Object.entries(timelineYears)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([year, yearData], yearIdx) => {
                    const yearTotal = yearData.reduce((s, m) => s + m.count, 0);
                    return (
                      <motion.div
                        key={year}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: yearIdx * 0.08 }}
                        className="relative pl-16 mb-10 last:mb-0"
                      >
                        {/* Year badge */}
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/10 border border-purple-500/30 flex flex-col items-center justify-center shadow-lg shadow-purple-500/10">
                          <span className="text-xs font-black text-purple-400 leading-none">{year.slice(2)}</span>
                          <span className="text-[10px] font-semibold text-cyan-400/60 mt-0.5">年</span>
                        </div>
                        <div className="flex items-baseline gap-3 mb-4">
                          <span className="text-2xl font-black theme-text">{year}</span>
                          <span className="text-xs font-semibold tracking-widest text-purple-400/60 uppercase">Year</span>
                          <span className="ml-auto text-sm font-bold text-purple-400">{yearTotal} 篇</span>
                        </div>
                        {/* Month bars with hover effect */}
                        <div className="flex flex-wrap gap-3">
                          {yearData.map(({ month, count }) => {
                            const barWidth = Math.round(40 + (count / maxCount * 60));
                            return (
                              <motion.div
                                key={month}
                                className="flex items-center gap-2 group cursor-default"
                                whileHover={{ scale: 1.05 }}
                              >
                                <div className="relative h-7 rounded-md overflow-hidden bg-white/5 border border-white/10 shadow-sm">
                                  <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/80 to-cyan-500/60 rounded-md transition-all duration-300 group-hover:brightness-125"
                                    style={{ width: `${barWidth}%` }}
                                  />
                                  <span className="absolute inset-0 flex items-center justify-center px-3 text-xs font-bold theme-text group-hover:text-white transition-colors">
                                    {count}
                                  </span>
                                </div>
                                <span className="text-xs theme-subtle w-8">{month}月</span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false);
  const [graphSidebarOpen, setGraphSidebarOpen] = useState(false);

  return (
    <GraphSidebarContext.Provider value={{ open: graphSidebarOpen, setOpen: setGraphSidebarOpen }}>
      <Router>
        <div className="app-shell min-h-screen overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="hover:scale-105 transition-transform">
              <MindScapeLogo />
            </Link>
            
            <div className="flex items-center gap-4 md:gap-8">
              <Link to="/notes" className="nav-link group">
                <NavIcon name="notes" />
                笔记
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <Link to="/tags" className="nav-link group">
                <NavIcon name="tags" />
                标签
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <button type="button" onClick={() => setSearchOpen(true)} className="nav-link group">
                <NavIcon name="search" />
                搜索
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </button>
              <Link to="/roadmap" className="nav-link group">
                <NavIcon name="roadmap" />
                学习路线
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <Link to="/graph" className="nav-link group">
                <NavIcon name="graph" />
                图谱
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <NavDropdown label="AI Coding" icon={<Sparkles size={16} />}>
                <NavDropdownItem to="/model-selection">
                  模型选型
                </NavDropdownItem>
                <NavDropdownItem to="/tools">
                  工具推荐
                </NavDropdownItem>
                <NavDropdownItem to="/ai-coding-guide">
                  实战指南
                </NavDropdownItem>
                <NavDropdownItem to="/ai-native-engineering">
                  AI 工程
                </NavDropdownItem>
              </NavDropdown>
              <Link to="/about" className="nav-link group">
                <NavIcon name="about" />
                关于
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </Link>
              <a
                href="https://github.com/Alleyf/MindScape"
                target="_blank"
                rel="noreferrer"
                className="nav-link group"
                title="GitHub 源码"
              >
                <svg viewBox="0 0 24 24" className="nav-icon" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.8c.85.004 1.7.115 2.5.34 1.9-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.75c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                </svg>
                <span className="hidden md:inline">GitHub</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nebula-accent transition-all group-hover:w-full" />
              </a>
              <ThemeToggle />
            </div>
          </div>
        </nav>
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/note/*" element={<NotePage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/ai-native-engineering" element={<AIEngineeringPage />} />
          <Route path="/model-selection" element={<ModelSelectionPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/ai-coding-guide" element={<AICodingGuidePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        
        {/* Footer */}
        <footer className="relative z-10 mt-20">
          {/* Decorative top border */}
          <div className="relative h-px mb-12 mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-nebula-accent/30 to-transparent" />
            <div className="absolute left-1/2 -translate-x-1/2 -top-[3px] w-2 h-2 rotate-45 border border-nebula-accent/40" />
          </div>

          <div className="max-w-5xl mx-auto px-4 pb-10">
            <div className="flex flex-col items-center text-center mb-8">
              <MindScapeLogo />
              <p className="mt-3 text-sm theme-muted leading-relaxed max-w-xs">
                一个 AI-Native 的创意知识空间，思想如星云般绽放，知识如有机生命般生长。
              </p>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs theme-subtle">
              <p>MindScape © 2026</p>
              <p className="flex items-center gap-2">
                <span>用</span>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-nebula-accent" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                <span>与 AI 增强人类创造力</span>
              </p>
              <p>由 <a href="https://github.com/Alleyf" target="_blank" rel="noopener noreferrer" className="hover:text-nebula-accent transition-colors">墨·夕</a> 构建</p>
            </div>

            {/* Visitor stats */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs theme-subtle">
              <span id="busuanzi_container_site_pv" className="transition-opacity duration-500">
                总访问 <span id="busuanzi_value_site_pv" className="text-nebula-accent font-medium"></span> 次
              </span>
              <span className="text-white/20">|</span>
              <span id="busuanzi_container_site_uv" className="transition-opacity duration-500">
                访客 <span id="busuanzi_value_site_uv" className="text-nebula-accent font-medium"></span> 人
              </span>
            </div>
          </div>
        </footer>
        <FloatingTools
          onOpenThemeDrawer={() => setThemeDrawerOpen(true)}
          onToggleGraph={() => setGraphSidebarOpen(v => !v)}
          graphOpen={graphSidebarOpen}
        />
        <ThemeDrawer
          isOpen={themeDrawerOpen}
          onClose={() => setThemeDrawerOpen(false)}
        />
        <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </Router>
    </GraphSidebarContext.Provider>
  );
}

export default App;
