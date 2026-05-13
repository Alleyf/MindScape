import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 统一配色方案 - 参考 ai-coding-modes.svg 风格
const colorScheme = {
  bg: '#1f1e1b',
  accent: '#d97757',
  text: '#f4efe7',
  subtext: '#d8cfc2',
  border: '#5a5047'
};

// 生成SVG封面 - 统一风格
function generateCoverSVG(title, tags, slug) {
  const scheme = colorScheme;
  
  // 处理标题过长
  const displayTitle = title.length > 20 ? title.slice(0, 18) + '...' : title;
  const displayTags = (tags || []).slice(0, 3).join(' / ');
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="${title}">
  <rect width="800" height="450" rx="32" fill="${scheme.bg}"/>
  
  <!-- 装饰性圆形 -->
  <circle cx="680" cy="90" r="140" fill="${scheme.accent}" opacity="0.08"/>
  <circle cx="120" cy="380" r="180" fill="${scheme.accent}" opacity="0.06"/>
  
  <!-- 顶部装饰线 -->
  <rect x="48" y="48" width="100" height="4" rx="2" fill="${scheme.accent}"/>
  
  <!-- 标题 -->
  <text x="48" y="130" font-family="Georgia, 'Noto Serif SC', serif" font-size="42" font-weight="800" fill="${scheme.text}">${displayTitle}</text>
  
  <!-- 标签 -->
  <text x="48" y="180" font-family="'Microsoft YaHei UI', sans-serif" font-size="16" fill="${scheme.subtext}" opacity="0.8">${displayTags}</text>
  
  <!-- 底部装饰 -->
  <rect x="48" y="400" width="704" height="2" rx="1" fill="${scheme.border}" opacity="0.3"/>
  
  <!-- 右下角图标 -->
  <g transform="translate(700 380)">
    <rect width="52" height="52" rx="12" fill="${scheme.accent}" opacity="0.2"/>
    <path d="M16 20 L36 26 L16 32 Z" fill="${scheme.accent}" opacity="0.8"/>
    <rect x="12" y="32" width="28" height="4" rx="2" fill="${scheme.accent}" opacity="0.6"/>
    <rect x="12" y="40" width="20" height="4" rx="2" fill="${scheme.accent}" opacity="0.4"/>
  </g>
</svg>`;
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
function processAllPosts() {
  const postsDir = path.join(__dirname, '..', 'content', 'posts');
  const coversDir = path.join(__dirname, '..', 'public', 'images', 'covers');
  
  // 确保 covers 目录存在
  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
  }
  
  function processDirectory(dir, baseSlug = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const newBaseSlug = baseSlug ? `${baseSlug}-${entry.name}` : entry.name;
        processDirectory(fullPath, newBaseSlug);
      } else if (entry.name.endsWith('.md')) {
        const fm = extractFrontMatter(fullPath);
        if (!fm) continue;
        
        const title = fm.title || entry.name.replace('.md', '');
        const tags = fm.tags ? JSON.parse(fm.tags) : [];
        const slug = baseSlug ? `${baseSlug}-${entry.name.replace('.md', '')}` : entry.name.replace('.md', '');
        
        // 生成 FNV-1a hash
        let h = 2166136261 >>> 0;
        for (let i = 0; i < slug.length; i++) {
          h ^= slug.charCodeAt(i);
          h = Math.imul(h, 16777619) >>> 0;
        }
        const hash = h.toString(16);
        
        // 生成 SVG
        const svg = generateCoverSVG(title, tags, slug);
        const outputPath = path.join(coversDir, `ms-${hash}.svg`);
        
        fs.writeFileSync(outputPath, svg);
        console.log(`Generated: ms-${hash}.svg for "${title}"`);
      }
    }
  }
  
  processDirectory(postsDir);
  console.log('\nAll covers generated successfully!');
}

processAllPosts();
