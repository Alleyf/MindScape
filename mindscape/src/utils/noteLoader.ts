// src/utils/noteLoader.ts

// 使用 Vite 的 import.meta.glob 动态导入 content/posts 下的所有 .md 文件
// as: 'raw' 表示以原始文本形式加载
const markdownModules = import.meta.glob('../../content/posts/*.md', { eager: true, as: 'raw' });

export interface Note {
  id: string;
  title: string;
  date: string;
  tags: string[];
  personality: string;
  description: string;
  content: string;
  slug: string;
}

/**
 * 解析 Front Matter 和正文
 * 简单的 YAML 解析逻辑，避免引入重型库
 */
function parseFrontMatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content };
  }

  const frontMatterStr = match[1];
  const body = match[2];
  
  const data: any = {};
  frontMatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim();
      // 处理数组格式 ["tag1", "tag2"]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((s: string) => s.trim().replace(/["']/g, ''));
      } else {
        // 去除引号
        value = value.replace(/^["']|["']$/g, '');
      }
      data[key.trim()] = value;
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
    const fileName = path.split('/').pop() || '';
    if (!fileName.endsWith('.md')) return;

    const { data, content: body } = parseFrontMatter(content as string);
    const slug = fileName.replace(/\.md$/, '');

    notes.push({
      id: slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString().split('T')[0],
      tags: Array.isArray(data.tags) ? data.tags : [],
      personality: data.personality || 'owl',
      description: data.description || '',
      content: body.trim(),
      slug: slug,
    });
  });

  // 按日期倒序排列
  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
