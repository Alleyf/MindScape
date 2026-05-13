import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 生成 FNV-1a hash
function fnv1a32SlugHash(slug) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// 从 markdown 文件读取信息
function extractFrontMatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  
  if (!match) return null;
  
  const fm = {};
  match[1].split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      fm[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });
  
  return fm;
}

// 处理所有博文
function checkCovers() {
  const postsDir = path.join(__dirname, '..', 'content', 'posts');
  const coversDir = path.join(__dirname, '..', 'public', 'images', 'covers');
  
  const existingCovers = new Set(
    fs.readdirSync(coversDir)
      .filter(f => f.endsWith('.svg'))
      .map(f => f.replace('.svg', ''))
  );
  
  const missingCovers = [];
  const allPosts = [];
  
  function processDirectory(dir, baseSlug = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const newBaseSlug = baseSlug ? `${baseSlug}-${entry.name}` : entry.name;
        processDirectory(fullPath, newBaseSlug);
      } else if (entry.name.endsWith('.md')) {
        const fm = extractFrontMatter(fullPath);
        if (!fm) {
          console.warn(`⚠️  无法解析front matter: ${fullPath}`);
          return;
        }
        
        const title = fm.title || entry.name.replace('.md', '');
        const slug = baseSlug ? `${baseSlug}-${entry.name.replace('.md', '')}` : entry.name.replace('.md', '');
        const hash = fnv1a32SlugHash(slug).toString(16);
        const coverName = `ms-${hash}`;
        
        allPosts.push({ title, slug, coverName, hasCover: existingCovers.has(coverName) });
        
        if (!existingCovers.has(coverName)) {
          missingCovers.push({ title, slug, coverName });
        }
      }
    }
  }
  
  processDirectory(postsDir);
  
  console.log(`\n📊 统计信息:`);
  console.log(`- 总博文数: ${allPosts.length}`);
  console.log(`- 有封面: ${allPosts.filter(p => p.hasCover).length}`);
  console.log(`- 缺封面: ${missingCovers.length}`);
  
  if (missingCovers.length > 0) {
    console.log(`\n❌ 缺少封面的博文:`);
    missingCovers.forEach(post => {
      console.log(`  - ${post.title}`);
      console.log(`    slug: ${post.slug}`);
      console.log(`    cover: ${post.coverName}`);
    });
  } else {
    console.log(`\n✅ 所有博文都有封面!`);
  }
  
  // 列出一些样例
  console.log(`\n📝 样例博文 (前10个):`);
  allPosts.slice(0, 10).forEach(post => {
    const status = post.hasCover ? '✅' : '❌';
    console.log(`  ${status} ${post.title} -> ${post.coverName}`);
  });
}

checkCovers();
