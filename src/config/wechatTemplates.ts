export interface WeChatTemplate {
  id: string;
  name: string;
  description: string;
  // 只保留微信公众号支持的基础样式配置
  accentColor?: string;
  fontSize?: string;
  fontFamily?: string;
  backgroundColor?: string;
}

export const weChatTemplates: WeChatTemplate[] = [
  {
    id: 'default',
    name: '默认',
    description: '博客默认样式',
    accentColor: '#6366f1',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  {
    id: 'zhihu',
    name: '知乎',
    description: '知乎风格',
    accentColor: '#1777f2',
    fontSize: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub 风格',
    accentColor: '#24292e',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  {
    id: 'wechat',
    name: '微信',
    description: '微信公众号纯色',
    accentColor: '#07c160',
    fontSize: '15px',
    fontFamily: 'sans-serif',
  },
  {
    id: 'minimal',
    name: '极简',
    description: '极简风格',
    accentColor: '#333333',
    fontSize: '14px',
    fontFamily: 'sans-serif',
  },
];

export function getTemplateById(id: string): WeChatTemplate {
  return weChatTemplates.find(t => t.id === id) || weChatTemplates[0];
}
