/**
 * 规范化 content/posts 下 Markdown 的 front matter（与 src/utils/noteLoader.ts 单行解析器兼容），
 * 并为每篇生成 public/images/covers/ms-<fnv-hex>.svg 封面。
 *
 * 运行：node scripts/normalize-posts-and-covers.mjs
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const POSTS = path.join(ROOT, 'content', 'posts');
const COVERS = path.join(ROOT, 'public', 'images', 'covers');

const VALID_PERSONALITY = new Set(['沉思者', '引路人', '园丁', '未来主义者', '陪伴者']);

function fnv1a32(slug) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function coverBasename(slug) {
  return `ms-${fnv1a32(slug).toString(16)}.svg`;
}

function coverUrl(slug) {
  return `/images/covers/${coverBasename(slug)}`;
}

function walkMd(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkMd(p, acc);
    else if (e.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

function slugFromFile(absPath) {
  const rel = path.relative(POSTS, absPath).replace(/\\/g, '/');
  return rel.replace(/\.md$/i, '');
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmLine(s, max = 400) {
  return String(s ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/"/g, "'")
    .trim()
    .slice(0, max);
}

function serializeFrontMatter({ title, date, tags, personality, description, cover }) {
  return [
    '---',
    `title: ${JSON.stringify(fmLine(title, 500))}`,
    `date: ${JSON.stringify(date)}`,
    `tags: ${JSON.stringify(tags)}`,
    `personality: ${JSON.stringify(fmLine(personality, 40))}`,
    `description: ${JSON.stringify(fmLine(description, 240))}`,
    `cover: ${JSON.stringify(cover)}`,
    '---',
  ].join('\n');
}

function normalizeDate(d, statMtime) {
  if (d == null || d === '') {
    return { iso: statMtime.toISOString().slice(0, 10), judgment: 'missing-date-used-mtime' };
  }
  if (d instanceof Date && !Number.isNaN(d.getTime())) {
    return { iso: d.toISOString().slice(0, 10), judgment: null };
  }
  const s = String(d).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return { iso: `${m[1]}-${m[2]}-${m[3]}`, judgment: s.length > 10 ? 'date-truncated-to-day' : null };
  const t = Date.parse(s);
  if (!Number.isNaN(t)) {
    return { iso: new Date(t).toISOString().slice(0, 10), judgment: 'date-normalized-from-timestamp' };
  }
  return { iso: statMtime.toISOString().slice(0, 10), judgment: 'unparseable-date-used-mtime' };
}

function coerceTags(raw, slug) {
  let arr = [];
  if (Array.isArray(raw)) {
    arr = raw.map((x) => String(x).trim()).filter(Boolean);
  } else if (typeof raw === 'string' && raw.trim()) {
    arr = raw.split(/[,，;；|]/).map((x) => x.trim()).filter(Boolean);
  }
  if (arr.length) return { tags: arr, judgment: null };
  const first = slug.split('/')[0];
  const fallback = first && first !== slug ? [first] : ['mindscape'];
  return { tags: fallback, judgment: 'empty-tags-filled-from-folder-or-default' };
}

function normalizePersonality(p) {
  const s = String(p || '').trim();
  if (VALID_PERSONALITY.has(s)) return { personality: s, judgment: null };
  const lower = s.toLowerCase();
  const alias = {
    guide: '引路人',
    owl: '沉思者',
    futurist: '未来主义者',
    gardener: '园丁',
    companion: '陪伴者',
  };
  if (alias[lower]) {
    return { personality: alias[lower], judgment: `personality-${lower}-mapped` };
  }
  return { personality: '沉思者', judgment: s ? `personality-unknown-${s}-defaulted` : null };
}

function pickDescription(data, title, gitExcerpt) {
  const desc = data.description != null ? String(data.description).trim() : '';
  const ex = data.excerpt != null ? String(data.excerpt).trim() : '';
  const descIsMarkup =
    !desc ||
    /^<!--/.test(desc) ||
    /^<\s*table/i.test(desc) ||
    (desc.includes('<') && desc.includes('>') && desc.length > 80);
  const descIsPlaceholder = / — 笔记摘录$/.test(desc) || desc === `${title} — 笔记摘录`;
  let s = '';
  if (!descIsMarkup && !descIsPlaceholder) s = desc;
  else if (ex) s = ex;
  else if (gitExcerpt) s = gitExcerpt;
  else s = `${title} — 笔记摘录`;
  return fmLine(s, 240);
}

/** 从上一提交取 excerpt，用于已去掉元数据字段的 Marp/论文笔记恢复摘要 */
function excerptFromGitHead(relFromRoot) {
  const rel = relFromRoot.replace(/\\/g, '/');
  try {
    const raw = execFileSync('git', ['show', `HEAD:${rel}`], {
      encoding: 'utf8',
      cwd: ROOT,
      stdio: ['pipe', 'pipe', 'ignore'],
      maxBuffer: 10 * 1024 * 1024,
    });
    const ex = matter(raw).data?.excerpt;
    return ex != null ? String(ex).trim() : '';
  } catch {
    return '';
  }
}

function titleFromFilename(slug) {
  const base = slug.split('/').pop() || slug;
  return base.replace(/\.md$/i, '');
}

/** 缩略图友好：800x450，无 emoji，小文件，由 hash 驱动图形变体 */
function buildCoverSvg(slug, title) {
  const h = fnv1a32(slug);
  const variant = h % 6;
  const t = escapeXml(title.length > 40 ? `${title.slice(0, 38)}…` : title);

  const palettes = [
    ['#f1f5f9', '#cbd5e1', '#334155', '#0f172a'],
    ['#fafaf9', '#d6d3d1', '#57534e', '#1c1917'],
    ['#ecfeff', '#a5f3fc', '#0e7490', '#134e4a'],
    ['#eef2ff', '#c7d2fe', '#4338ca', '#1e1b4b'],
    ['#fffbeb', '#fde68a', '#b45309', '#451a03'],
    ['#f0fdf4', '#bbf7d0', '#15803d', '#14532d'],
  ];
  const [bg, mid, stroke, fg] = palettes[h % palettes.length];

  let decor = '';
  const seed = h >>> 8;
  if (variant === 0) {
    for (let i = 0; i < 5; i++) {
      const x = 80 + ((seed >> (i * 3)) & 127) * 5;
      const y = 60 + ((seed >> (i * 5)) & 63) * 4;
      decor += `<circle cx="${x}" cy="${y}" r="${8 + (i % 4) * 3}" fill="none" stroke="${mid}" stroke-width="2" opacity="0.5"/>`;
    }
  } else if (variant === 1) {
    decor = `<path d="M0 380 Q200 300 400 380 T800 360 L800 450 L0 450 Z" fill="${mid}" opacity="0.25"/>`;
  } else if (variant === 2) {
    for (let i = 0; i < 12; i++) {
      const x = (i * 67 + (seed % 40)) % 760 + 20;
      decor += `<rect x="${x}" y="${100 + (i % 3) * 90}" width="4" height="40" rx="2" fill="${stroke}" opacity="0.2"/>`;
    }
  } else if (variant === 3) {
    decor = `<rect x="520" y="40" width="240" height="370" rx="24" fill="${mid}" opacity="0.35"/><rect x="540" y="70" width="200" height="12" rx="4" fill="${stroke}" opacity="0.15"/>`;
  } else if (variant === 4) {
    for (let r = 0; r < 4; r++) {
      decor += `<rect x="${60 + r * 50}" y="${320 - r * 40}" width="160" height="160" rx="20" transform="rotate(${-15 + r * 8} ${140 + r * 50} ${400})" fill="none" stroke="${mid}" stroke-width="3" opacity="0.35"/>`;
    }
  } else {
    decor = `<g stroke="${mid}" stroke-width="2" opacity="0.4">`;
    for (let i = 0; i < 8; i++) {
      const x1 = 40 + i * 100;
      decor += `<line x1="${x1}" y1="80" x2="${x1 + 60}" y2="200"/>`;
    }
    decor += '</g>';
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="${t}">
  <rect width="800" height="450" fill="${bg}"/>
  ${decor}
  <rect x="48" y="48" width="704" height="354" rx="20" fill="none" stroke="${stroke}" stroke-width="2" opacity="0.35"/>
  <text x="72" y="130" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="32" font-weight="700" fill="${fg}">${t}</text>
  <text x="72" y="180" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="15" fill="${stroke}" opacity="0.85">${escapeXml(slug.split('/').slice(-2).join(' / '))}</text>
</svg>`;
}

function main() {
  fs.mkdirSync(COVERS, { recursive: true });
  const files = walkMd(POSTS).sort();
  const judgments = [];
  const modifiedMd = [];
  const newSvgs = new Set();

  for (const abs of files) {
    const slug = slugFromFile(abs);
    const stat = fs.statSync(abs);
    const raw = fs.readFileSync(abs, 'utf8');
    let body;
    let data;
    try {
      const m = matter(raw);
      body = m.content;
      data = m.data || {};
    } catch (e) {
      judgments.push({ slug, error: `gray-matter failed: ${e.message}` });
      continue;
    }

    const title = (data.title != null && String(data.title).trim()) || titleFromFilename(slug);
    const { iso: date, judgment: dj } = normalizeDate(data.date, stat.mtime);
    if (dj) judgments.push({ slug, judgment: dj });

    const { tags, judgment: tj } = coerceTags(data.tags, slug);
    if (tj) judgments.push({ slug, judgment: tj });

    const { personality, judgment: pj } = normalizePersonality(data.personality);
    if (pj) judgments.push({ slug, judgment: pj });

    const relFromRoot = path.relative(ROOT, abs).replace(/\\/g, '/');
    const gitEx = excerptFromGitHead(relFromRoot);
    const description = pickDescription(data, title, gitEx);
    const cov = coverUrl(slug);
    const basename = coverBasename(slug);

    const svg = buildCoverSvg(slug, title);
    const svgPath = path.join(COVERS, basename);
    fs.writeFileSync(svgPath, svg, 'utf8');
    newSvgs.add(`public/images/covers/${basename}`);

    const fm = serializeFrontMatter({
      title,
      date,
      tags,
      personality,
      description,
      cover: cov,
    });
    const next = `${fm}\n${body.replace(/^\uFEFF/, '')}`;
    if (next !== raw) {
      fs.writeFileSync(abs, next, 'utf8');
      modifiedMd.push(path.relative(ROOT, abs).replace(/\\/g, '/'));
    }
  }

  console.log(
    JSON.stringify(
      { markdownCount: files.length, modifiedCount: modifiedMd.length, svgCount: newSvgs.size, judgments },
      null,
      2,
    ),
  );
}

main();
