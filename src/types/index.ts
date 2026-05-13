export interface Note {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  mood?: string;
  personality?: string;
  aiSubtitle?: string;
  cover?: string;
}

export interface NoteFrontmatter {
  title: string;
  tags?: string[];
  date?: string;
  mood?: string;
  aiSubtitle?: string;
  personality?: string;
  description?: string;
  cover?: string;
}
