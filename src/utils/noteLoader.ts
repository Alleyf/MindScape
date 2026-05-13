import { Note } from '../types';
export { getRandomNote } from './noteData';

/** FNV-1a 32-bit，与 `scripts/normalize-posts-and-covers.mjs` 中封面文件名算法一致。 */
function fnv1a32SlugHash(slug: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** `public/images/covers/` 下的 ASCII 文件名（避免 Windows 非法路径字符）。 */
export function coverBasenameFromSlug(slug: string): string {
  return `ms-${fnv1a32SlugHash(slug).toString(16)}.svg`;
}

export function coverUrlFromSlug(slug: string): string {
  return `/images/covers/${coverBasenameFromSlug(slug)}`;
}

// 使用 Vite 的 import.meta.glob 动态导入 content/posts 下的所有 .md 文件
// query: '?raw', import: 'default' 表示以原始文本形式加载（替代已弃用的 as: 'raw'）
const markdownModules = import.meta.glob('../../content/posts/**/*.md', { eager: true, query: '?raw', import: 'default' });

/**
 * 解析 Front Matter 和正文
 * 简单的 YAML 解析逻辑，避免引入重型库
 */
function parseFrontMatter(content: string) {
  // 处理可能存在的 BOM 或开头空白
  const trimmedContent = content.trimStart();
  
  // 更加鲁棒的正则，支持 Windows/Unix 换行符，并忽略 --- 后的空格
  const match = trimmedContent.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: trimmedContent };
  }

  const frontMatterStr = match[1];
  const body = match[2];
  
  const data: any = {};
  frontMatterStr.split(/\r?\n/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // 处理数组格式 ["tag1", "tag2"]
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          // 尝试用 JSON.parse 解析数组，更安全
          // 注意：YAML 数组格式与 JSON 相似但又不完全相同，这里做简单处理
          const arrayStr = value.replace(/'/g, '"');
          data[key] = JSON.parse(arrayStr);
        } catch (e) {
          // 降级处理
          data[key] = value.slice(1, -1).split(',').map((s: string) => s.trim().replace(/["']/g, ''));
        }
      } else {
        // 去除引号
        value = value.replace(/^["']|["']$/g, '');
        data[key] = value;
      }
    }
  });

  return { data, content: body };
}

/**
 * 加载所有笔记
 */
export function getNotes(): Note[] {
  const notes: Note[] = [];

  Object.entries(markdownModules).forEach(([path, content]) => {
    // path like: ../../content/posts/后端开发/Java常用新特性.md or ../../content/posts/Vue.md
    // normalize backslashes (Windows) to forward slashes for consistent matching
    const normalizedPath = path.replace(/\\/g, '/');
    const match = normalizedPath.match(/content\/posts\/(.+)\.md$/);
    if (!match) return;
    const rawSlug = match[1]; // e.g. "后端开发/Java常用新特性" or "Vue"

    // use full slug (with subdir path) for both id and slug — required for
    // NoteGraph/d3 id matching and FloatingTools slug extraction to stay in sync
    const { data, content: body } = parseFrontMatter(content as string);
    const date = data.date || new Date().toISOString().split('T')[0];
    const excerpt = body.trim().slice(0, 150) + (body.length > 150 ? '...' : '');

    const coverRaw = typeof data.cover === 'string' ? data.cover.trim() : '';
    const cover = coverRaw || coverUrlFromSlug(rawSlug);

    notes.push({
      id: rawSlug,
      slug: rawSlug,
      title: data.title || rawSlug.split('/').pop() || rawSlug,
      content: body.trim(),
      excerpt: data.description || excerpt,
      tags: Array.isArray(data.tags) ? data.tags : [],
      createdAt: date,
      updatedAt: date,
      mood: data.mood || '✨',
      personality: data.personality || '沉思者',
      aiSubtitle: data.aiSubtitle || '',
      cover,
    });
  });

  // 按日期倒序排列
  return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getNoteBySlug(slug: string): Note | null {
  const notes = getNotes();
  return notes.find((note) => note.slug === slug) || null;
}

export function getRelatedNotes(currentNote: Note, limit: number = 3): Note[] {
  const allNotes = getNotes();

  // 排除当前笔记
  const otherNotes = allNotes.filter((note) => note.id !== currentNote.id);

  // 基于标签相似度排序
  const scoredNotes = otherNotes.map((note) => {
    const commonTags = note.tags.filter((tag) =>
      currentNote.tags.includes(tag)
    );
    return {
      note,
      score: commonTags.length,
    };
  });

  // 按分数排序并返回前 N 个
  return scoredNotes
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.note);
}
