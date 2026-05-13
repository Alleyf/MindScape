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

// 检测博文内容主题并生成对应的SVG元素
function generateContentBasedSVG(title, tags, content, slug) {
  const contentLower = `${title} ${tags?.join(' ') || ''} ${content || ''}`.toLowerCase();
  
  // 基础样式
  const style = {
    bg: '#1f1e1b',
    accent: '#d97757',
    cardBg: '#2a2723',
    cardBorder: '#5a5047',
    text: '#f4efe7',
    subtext: '#d8cfc2'
  };
  
  // 根据内容生成不同的视觉元素
  let visualElements = '';
  let subtitle = '';
  
  // 算法类
  if (contentLower.includes('算法') || contentLower.includes('algorithm')) {
    if (contentLower.includes('排序')) {
      visualElements = generateSortVisual();
      subtitle = '排序算法是计算机科学的基础';
    } else if (contentLower.includes('动态规划') || contentLower.includes('dp')) {
      visualElements = generateDPVisual();
      subtitle = '动态规划：解决重叠子问题';
    } else if (contentLower.includes('二叉树') || contentLower.includes('tree')) {
      visualElements = generateTreeVisual();
      subtitle = '树结构：层次数据的组织方式';
    } else if (contentLower.includes('图') || contentLower.includes('graph')) {
      visualElements = generateGraphVisual();
      subtitle = '图结构：复杂关系的表示';
    } else {
      visualElements = generateAlgorithmVisual();
      subtitle = '算法是解决问题的精确步骤';
    }
  }
  // 前端类
  else if (contentLower.includes('前端') || contentLower.includes('react') || 
           contentLower.includes('vue') || contentLower.includes('javascript')) {
    if (contentLower.includes('react')) {
      visualElements = generateReactVisual();
      subtitle = 'React：组件化 UI 开发';
    } else if (contentLower.includes('vue')) {
      visualElements = generateVueVisual();
      subtitle = 'Vue：渐进式 JavaScript 框架';
    } else {
      visualElements = generateFrontendVisual();
      subtitle = '前端：用户界面的构建';
    }
  }
  // 后端类
  else if (contentLower.includes('后端') || contentLower.includes('java') || 
           contentLower.includes('spring') || contentLower.includes('微服务')) {
    if (contentLower.includes('spring')) {
      visualElements = generateSpringVisual();
      subtitle = 'Spring：企业级 Java 开发框架';
    } else {
      visualElements = generateBackendVisual();
      subtitle = '后端：业务逻辑与服务端开发';
    }
  }
  // AI/ML类
  else if (contentLower.includes('ai') || contentLower.includes('llm') || 
           contentLower.includes('大模型') || contentLower.includes('机器学习') ||
           contentLower.includes('深度学习') || contentLower.includes('transformer')) {
    if (contentLower.includes('transformer') || contentLower.includes('bert')) {
      visualElements = generateTransformerVisual();
      subtitle = 'Transformer：注意力机制的革命';
    } else if (contentLower.includes('知识图谱') || contentLower.includes('knowledge graph')) {
      visualElements = generateKGVisual();
      subtitle = '知识图谱：结构化知识的表示';
    } else {
      visualElements = generateAIVisual();
      subtitle = '人工智能：让机器具有人类智能';
    }
  }
  // 云计算/DevOps类
  else if (contentLower.includes('云计算') || contentLower.includes('linux') || 
           contentLower.includes('docker') || contentLower.includes('kubernetes')) {
    if (contentLower.includes('docker') || contentLower.includes('容器')) {
      visualElements = generateDockerVisual();
      subtitle = 'Docker：容器化技术的先驱';
    } else if (contentLower.includes('kubernetes') || contentLower.includes('k8s')) {
      visualElements = generateK8SVisual();
      subtitle = 'Kubernetes：容器编排的平台';
    } else {
      visualElements = generateCloudVisual();
      subtitle = '云计算：弹性可扩展的计算资源';
    }
  }
  // 数据库类
  else if (contentLower.includes('数据库') || contentLower.includes('mysql') || 
           contentLower.includes('redis') || contentLower.includes('mongodb')) {
    visualElements = generateDatabaseVisual();
    subtitle = '数据库：数据的持久化存储';
  }
  // 摄影类
  else if (contentLower.includes('摄影') || contentLower.includes('相机')) {
    visualElements = generatePhotographyVisual();
    subtitle = '摄影：光影的艺术捕捉';
  }
  // 面试类
  else if (contentLower.includes('面试')) {
    visualElements = generateInterviewVisual();
    subtitle = '面试准备：技术能力的检验';
  }
  // 论文类
  else if (contentLower.includes('论文') || contentLower.includes('survey') || 
           contentLower.includes('paper')) {
    visualElements = generatePaperVisual();
    subtitle = '学术论文：前沿研究的记录';
  }
  // 学习清单类
  else if (contentLower.includes('清单') || contentLower.includes('checklist') ||
           contentLower.includes('学习')) {
    visualElements = generateChecklistVisual();
    subtitle = '系统化学习：从入门到精通';
  }
  // 默认
  else {
    visualElements = generateDefaultVisual();
    subtitle = '知识沉淀：持续学习与成长';
  }
  
  // 处理标题过长
  const displayTitle = title.length > 18 ? title.slice(0, 16) + '...' : title;
  const displayTags = (tags || []).slice(0, 3).join(' / ');
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="${title}">
  <rect width="800" height="450" rx="32" fill="${style.bg}"/>
  
  <!-- 装饰性圆形 -->
  <circle cx="680" cy="90" r="140" fill="${style.accent}" opacity="0.08"/>
  <circle cx="120" cy="380" r="180" fill="${style.accent}" opacity="0.06"/>
  
  <!-- 顶部装饰线 -->
  <rect x="48" y="48" width="100" height="4" rx="2" fill="${style.accent}"/>
  
  <!-- 标题 -->
  <text x="48" y="130" font-family="Georgia, 'Noto Serif SC', serif" font-size="42" font-weight="800" fill="${style.text}">${displayTitle}</text>
  
  <!-- 副标题 -->
  <text x="48" y="175" font-family="'Microsoft YaHei UI', sans-serif" font-size="15" fill="${style.subtext}" opacity="0.8">${subtitle}</text>
  
  <!-- 标签 -->
  <text x="48" y="200" font-family="'Microsoft YaHei UI', sans-serif" font-size="13" fill="${style.subtext}" opacity="0.6">${displayTags}</text>
  
  <!-- 内容视觉元素 -->
  ${visualElements}
  
  <!-- 底部装饰 -->
  <rect x="48" y="410" width="704" height="2" rx="1" fill="${style.cardBorder}" opacity="0.3"/>
</svg>`;
}

// 生成各类视觉元素的函数
function generateSortVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">排序算法</text>
    <g transform="translate(20, 55)">
      <rect width="36" height="60" rx="4" fill="#d97757" opacity="0.3"/>
      <text x="10" y="38" font-size="16" font-weight="700" fill="#f4efe7">5</text>
    </g>
    <g transform="translate(66, 55)">
      <rect width="36" height="45" rx="4" fill="#d97757" opacity="0.5"/>
      <text x="10" y="28" font-size="16" font-weight="700" fill="#f4efe7">3</text>
    </g>
    <g transform="translate(112, 55)">
      <rect width="36" height="70" rx="4" fill="#d97757" opacity="0.7"/>
      <text x="10" y="45" font-size="16" font-weight="700" fill="#f4efe7">8</text>
    </g>
    <g transform="translate(158, 55)">
      <rect width="36" height="50" rx="4" fill="#d97757" opacity="0.4"/>
      <text x="10" y="32" font-size="16" font-weight="700" fill="#f4efe7">1</text>
    </g>
    <g transform="translate(204, 55)">
      <rect width="36" height="55" rx="4" fill="#d97757" opacity="0.6"/>
      <text x="10" y="35" font-size="16" font-weight="700" fill="#f4efe7">4</text>
    </g>
    <text x="20" y="135" font-size="12" fill="#d8cfc2">时间复杂度 / 空间复杂度</text>
  </g>`;
}

function generateDPVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">动态规划</text>
    <g transform="translate(20, 50)">
      <circle cx="20" cy="20" r="20" fill="#d97757" opacity="0.3"/>
      <text x="12" y="26" font-size="14" font-weight="700" fill="#f4efe7">1</text>
      <line x1="40" y1="20" x2="80" y2="20" stroke="#5a5047" stroke-width="2"/>
      <circle cx="100" cy="20" r="20" fill="#d97757" opacity="0.5"/>
      <text x="92" y="26" font-size="14" font-weight="700" fill="#f4efe7">2</text>
      <line x1="120" y1="20" x2="160" y2="20" stroke="#5a5047" stroke-width="2"/>
      <circle cx="180" cy="20" r="20" fill="#d97757" opacity="0.7"/>
      <text x="172" y="26" font-size="14" font-weight="700" fill="#f4efe7">3</text>
      <line x1="200" y1="20" x2="240" y2="20" stroke="#5a5047" stroke-width="2"/>
      <circle cx="260" cy="20" r="20" fill="#d97757"/>
      <text x="252" y="26" font-size="14" font-weight="700" fill="#f4efe7">n</text>
    </g>
    <text x="20" y="115" font-size="12" fill="#d8cfc2">最优子结构 + 重叠子问题</text>
    <text x="20" y="135" font-size="12" fill="#d8cfc2">状态转移方程是关键</text>
  </g>`;
}

function generateTreeVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">二叉树结构</text>
    <circle cx="150" cy="80" r="16" fill="#d97757"/>
    <text x="144" y="86" font-size="14" font-weight="700" fill="#f4efe7">1</text>
    <line x1="140" y1="96" x2="100" y2="120" stroke="#5a5047" stroke-width="2"/>
    <line x1="160" y1="96" x2="200" y2="120" stroke="#5a5047" stroke-width="2"/>
    <circle cx="90" cy="125" r="14" fill="#d97757" opacity="0.7"/>
    <text x="85" y="130" font-size="12" font-weight="700" fill="#f4efe7">2</text>
    <circle cx="210" cy="125" r="14" fill="#d97757" opacity="0.7"/>
    <text x="205" y="130" font-size="12" font-weight="700" fill="#f4efe7">3</text>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">前序 / 中序 / 后序遍历</text>
  </g>`;
}

function generateGraphVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">图结构</text>
    <line x1="80" y1="80" x2="150" y2="60" stroke="#d97757" stroke-width="2"/>
    <line x1="150" y1="60" x2="220" y2="90" stroke="#d97757" stroke-width="2"/>
    <line x1="150" y1="60" x2="150" y2="130" stroke="#d97757" stroke-width="2"/>
    <line x1="220" y1="90" x2="150" y2="130" stroke="#d97757" stroke-width="2"/>
    <circle cx="80" cy="80" r="18" fill="#d97757"/>
    <text x="74" y="86" font-size="14" font-weight="700" fill="#f4efe7">A</text>
    <circle cx="150" cy="60" r="18" fill="#d97757"/>
    <text x="144" y="66" font-size="14" font-weight="700" fill="#f4efe7">B</text>
    <circle cx="220" cy="90" r="18" fill="#d97757"/>
    <text x="214" y="96" font-size="14" font-weight="700" fill="#f4efe7">C</text>
    <circle cx="150" cy="130" r="18" fill="#d97757"/>
    <text x="144" y="136" font-size="14" font-weight="700" fill="#f4efe7">D</text>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">BFS / DFS / 最短路径</text>
  </g>`;
}

function generateAlgorithmVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">算法思维</text>
    <rect x="20" y="55" width="260" height="40" rx="8" fill="#d97757" opacity="0.2"/>
    <text x="35" y="80" font-size="14" fill="#f4efe7">输入 → 处理 → 输出</text>
    <g transform="translate(20, 105)">
      <rect width="70" height="30" rx="6" fill="#d97757" opacity="0.3"/>
      <text x="15" y="20" font-size="12" fill="#f4efe7">时间</text>
      <rect x="80" width="70" height="30" rx="6" fill="#d97757" opacity="0.5"/>
      <text x="95" y="20" font-size="12" fill="#f4efe7">空间</text>
      <rect x="160" width="80" height="30" rx="6" fill="#d97757" opacity="0.7"/>
      <text x="175" y="20" font-size="12" fill="#f4efe7">复杂度</text>
    </g>
  </g>`;
}

function generateReactVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#61dafb">React</text>
    <circle cx="150" cy="95" r="40" fill="none" stroke="#61dafb" stroke-width="3"/>
    <text x="135" y="102" font-size="32" font-weight="700" fill="#61dafb">⚛</text>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">组件 / Hooks / 状态管理</text>
  </g>`;
}

function generateVueVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#42b883">Vue.js</text>
    <polygon points="150,50 180,120 120,120" fill="none" stroke="#42b883" stroke-width="3"/>
    <circle cx="150" cy="95" r="15" fill="#42b883"/>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">响应式 / 组件化 / 指令系统</text>
  </g>`;
}

function generateFrontendVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">前端开发</text>
    <g transform="translate(20, 55)">
      <rect width="80" height="35" rx="6" fill="#e34f26"/>
      <text x="15" y="23" font-size="14" font-weight="700" fill="#fff">HTML</text>
    </g>
    <g transform="translate(110, 55)">
      <rect width="80" height="35" rx="6" fill="#264de4"/>
      <text x="15" y="23" font-size="14" font-weight="700" fill="#fff">CSS</text>
    </g>
    <g transform="translate(200, 55)">
      <rect width="80" height="35" rx="6" fill="#f7df1e"/>
      <text x="8" y="23" font-size="14" font-weight="700" fill="#000">JS</text>
    </g>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">结构 / 样式 / 交互</text>
  </g>`;
}

function generateSpringVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#6db33f">Spring</text>
    <circle cx="150" cy="95" r="40" fill="none" stroke="#6db33f" stroke-width="3"/>
    <text x="130" y="102" font-size="28" font-weight="700" fill="#6db33f">S</text>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">IoC / AOP / 企业级应用</text>
  </g>`;
}

function generateBackendVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">后端开发</text>
    <g transform="translate(50, 60)">
      <rect width="200" height="70" rx="8" fill="#d97757" opacity="0.2"/>
      <text x="20" y="30" font-size="14" fill="#f4efe7">API 接口设计</text>
      <text x="20" y="50" font-size="12" fill="#d8cfc2">REST / GraphQL / gRPC</text>
    </g>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">业务逻辑 / 数据处理 / 服务</text>
  </g>`;
}

function generateAIVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">人工智能</text>
    <circle cx="150" cy="95" r="35" fill="none" stroke="#d97757" stroke-width="3"/>
    <circle cx="150" cy="95" r="25" fill="none" stroke="#d97757" stroke-width="2" opacity="0.7"/>
    <circle cx="150" cy="95" r="15" fill="none" stroke="#d97757" stroke-width="2" opacity="0.5"/>
    <circle cx="150" cy="95" r="5" fill="#d97757"/>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">机器学习 / 深度学习 / LLM</text>
  </g>`;
}

function generateTransformerVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">Transformer</text>
    <g transform="translate(20, 55)">
      <rect width="260" height="70" rx="8" fill="#d97757" opacity="0.2"/>
      <text x="80" y="25" font-size="12" fill="#f4efe7">Self-Attention</text>
      <text x="60" y="45" font-size="12" fill="#d8cfc2">Query / Key / Value</text>
      <text x="70" y="60" font-size="12" fill="#d8cfc2">多头注意力机制</text>
    </g>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">Attention Is All You Need</text>
  </g>`;
}

function generateKGVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">知识图谱</text>
    <circle cx="100" cy="90" r="20" fill="#d97757" opacity="0.7"/>
    <text x="94" y="96" font-size="12" font-weight="700" fill="#f4efe7">实体</text>
    <circle cx="200" cy="90" r="20" fill="#d97757" opacity="0.5"/>
    <text x="192" y="96" font-size="12" font-weight="700" fill="#f4efe7">关系</text>
    <line x1="120" y1="90" x2="180" y2="90" stroke="#d97757" stroke-width="3"/>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">实体 / 关系 / 属性</text>
  </g>`;
}

function generateCloudVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">云计算</text>
    <ellipse cx="150" cy="100" rx="100" ry="40" fill="#d97757" opacity="0.15"/>
    <ellipse cx="150" cy="95" rx="80" ry="30" fill="#d97757" opacity="0.2"/>
    <ellipse cx="150" cy="90" rx="60" ry="20" fill="#d97757" opacity="0.3"/>
    <text x="100" y="105" font-size="16" font-weight="700" fill="#d97757">☁️</text>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">IaaS / PaaS / SaaS</text>
  </g>`;
}

function generateDockerVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#2496ed">Docker</text>
    <rect x="80" y="60" width="140" height="80" rx="8" fill="#2496ed" opacity="0.2"/>
    <rect x="95" y="75" width="110" height="50" rx="6" fill="#2496ed" opacity="0.3"/>
    <text x="115" y="105" font-size="14" font-weight="700" fill="#2496ed">Container</text>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">容器化 / 镜像 / 编排</text>
  </g>`;
}

function generateK8SVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#326ce5">Kubernetes</text>
    <circle cx="150" cy="95" r="40" fill="none" stroke="#326ce5" stroke-width="3"/>
    <text x="125" y="102" font-size="24" font-weight="700" fill="#326ce5">K8S</text>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">容器编排 / 自动扩缩容 / 服务发现</text>
  </g>`;
}

function generateDatabaseVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">数据库</text>
    <ellipse cx="150" cy="95" rx="80" ry="40" fill="none" stroke="#d97757" stroke-width="3"/>
    <text x="115" y="102" font-size="16" font-weight="700" fill="#d97757">DB</text>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">关系型 / NoSQL / 索引优化</text>
  </g>`;
}

function generatePhotographyVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#ed8936">摄影艺术</text>
    <circle cx="150" cy="95" r="40" fill="none" stroke="#ed8936" stroke-width="3"/>
    <circle cx="150" cy="95" r="25" fill="none" stroke="#ed8936" stroke-width="2"/>
    <circle cx="150" cy="95" r="10" fill="#ed8936"/>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">光圈 / 快门 / ISO / 构图</text>
  </g>`;
}

function generateInterviewVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">技术面试</text>
    <g transform="translate(50, 55)">
      <rect width="200" height="60" rx="8" fill="#d97757" opacity="0.2"/>
      <text x="40" y="25" font-size="14" font-weight="700" fill="#f4efe7">❓ 问题</text>
      <text x="40" y="45" font-size="12" fill="#d8cfc2">算法 / 系统设计 / 项目</text>
    </g>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">准备 / 练习 / 表达</text>
  </g>`;
}

function generatePaperVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">学术论文</text>
    <rect x="80" y="55" width="140" height="70" rx="6" fill="#d97757" opacity="0.2"/>
    <line x1="95" y1="75" x2="205" y2="75" stroke="#d97757" stroke-width="2"/>
    <line x1="95" y1="90" x2="175" y2="90" stroke="#d97757" stroke-width="2" opacity="0.6"/>
    <line x1="95" y1="105" x2="155" y2="105" stroke="#d97757" stroke-width="2" opacity="0.4"/>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">Abstract / Method / Experiment</text>
  </g>`;
}

function generateChecklistVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">学习清单</text>
    <g transform="translate(30, 55)">
      <rect x="0" y="0" width="20" height="20" rx="4" fill="#d97757"/>
      <text x="4" y="15" font-size="14" fill="#f4efe7">✓</text>
      <text x="30" y="15" font-size="13" fill="#f4efe7">基础知识</text>
    </g>
    <g transform="translate(30, 85)">
      <rect x="0" y="0" width="20" height="20" rx="4" fill="#d97757"/>
      <text x="4" y="15" font-size="14" fill="#f4efe7">✓</text>
      <text x="30" y="15" font-size="13" fill="#f4efe7">核心概念</text>
    </g>
    <g transform="translate(30, 115)">
      <rect x="0" y="0" width="20" height="20" rx="4" fill="none" stroke="#5a5047"/>
      <text x="30" y="15" font-size="13" fill="#d8cfc2">实战项目</text>
    </g>
  </g>`;
}

function generateDefaultVisual() {
  return `<g transform="translate(450, 220)">
    <rect width="300" height="150" rx="16" fill="#2a2723" stroke="#5a5047"/>
    <text x="20" y="35" font-size="20" font-weight="700" fill="#d97757">知识积累</text>
    <g transform="translate(50, 55)">
      <rect width="200" height="70" rx="8" fill="#d97757" opacity="0.2"/>
      <text x="60" y="30" font-size="14" font-weight="700" fill="#f4efe7">📚</text>
      <text x="40" y="55" font-size="12" fill="#d8cfc2">持续学习与成长</text>
    </g>
    <text x="20" y="145" font-size="12" fill="#d8cfc2">探索 / 实践 / 总结</text>
  </g>`;
}

// 处理所有博文
function processAllPosts() {
  const postsDir = path.join(__dirname, '..', 'content', 'posts');
  const coversDir = path.join(__dirname, '..', 'public', 'images', 'covers');
  
  // 确保 covers 目录存在
  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
  }
  
  let count = 0;
  
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
        const tags = fm.tags ? JSON.parse(fm.tags) : [];
        const slug = baseSlug ? `${baseSlug}-${entry.name.replace('.md', '')}` : entry.name.replace('.md', '');
        
        // 读取正文内容用于生成更智能的封面
        let content = '';
        try {
          const fullContent = fs.readFileSync(fullPath, 'utf-8');
          const bodyMatch = fullContent.match(/^---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)$/);
          if (bodyMatch) {
            content = bodyMatch[1].slice(0, 2000); // 只读取前2000字符用于判断
          }
        } catch (e) {
          // 忽略错误
        }
        
        // 生成 FNV-1a hash
        const hash = fnv1a32SlugHash(slug).toString(16);
        
        // 生成 SVG
        const svg = generateContentBasedSVG(title, tags, content, slug);
        const outputPath = path.join(coversDir, `ms-${hash}.svg`);
        
        fs.writeFileSync(outputPath, svg);
        count++;
        
        if (count % 10 === 0) {
          console.log(`Generated ${count} covers...`);
        }
      }
    }
  }
  
  processDirectory(postsDir);
  console.log(`\n✅ 共生成 ${count} 个专属封面图！`);
  console.log(`所有封面已保存到: ${coversDir}`);
}

processAllPosts();
