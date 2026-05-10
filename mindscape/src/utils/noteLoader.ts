import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getNotes(): Note[] {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Posts directory does not exist, creating it...');
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const notes: Note[] = [];

  fileNames.forEach((fileName) => {
    if (!fileName.endsWith('.md')) return;

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // 解析 Front Matter
    const { data, content } = matter(fileContents);
    
    const slug = fileName.replace(/\.md$/, '');
    
    notes.push({
      id: slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      personality: data.personality || 'owl',
      description: data.description || '',
      content: content.trim(),
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
