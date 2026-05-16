import { getTemplateById } from '../config/wechatTemplates';

// Convert markdown to WeChat-compatible HTML with inline styles
export function convertToWeChatHTML(markdown: string, templateId: string): string {
  const template = getTemplateById(templateId);
  const htmlContent = renderMarkdownToHTML(markdown, template);
  return htmlContent;
}

function renderMarkdownToHTML(markdown: string, template: ReturnType<typeof getTemplateById>): string {
  let html = markdown;

  // Normalize line endings
  html = html.replace(/\r\n/g, '\n');

  // Fenced code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre style="background:#f8f8f8;padding:16px;border-radius:8px;margin:16px 0;overflow-x:auto;"><code style="font-family:Consolas,monospace;font-size:14px;line-height:1.5;color:#333;">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:#f1f1f1;padding:2px 6px;border-radius:4px;font-family:Consolas,monospace;font-size:0.9em;color:#e83e8c;">$1</code>');

  // Headers
  html = html.replace(/^#### (.*$)/gm, '<h4 style="font-size:18px;font-weight:bold;margin:16px 0 8px;color:#333;">$1</h4>');
  html = html.replace(/^### (.*$)/gm, '<h3 style="font-size:20px;font-weight:bold;margin:20px 0 10px;color:#333;">$1</h3>');
  html = html.replace(/^## (.*$)/gm, `<h2 style="font-size:22px;font-weight:bold;margin:24px 0 12px;color:${template.accentColor};border-left:4px solid ${template.accentColor};padding-left:12px;">$1</h2>`);
  html = html.replace(/^# (.*$)/gm, '<h1 style="font-size:26px;font-weight:bold;margin:24px 0 16px;color:#1a1a1a;">$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" style="color:${template.accentColor};text-decoration:none;">$1</a>`);

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;height:auto;display:block;margin:16px auto;" />');

  // Blockquotes
  html = html.replace(/^> (.*$)/gm, `<blockquote style="border-left:4px solid ${template.accentColor};padding:8px 16px;margin:16px 0;font-style:italic;color:#666;">$1</blockquote>`);

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />');
  html = html.replace(/^\*\*\*$/gm, '<hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />');

  // Lists
  html = html.replace(/^- (.*$)/gm, '<li style="margin:4px 0;padding-left:8px;">$1</li>');
  html = html.replace(/^\d+\. (.*$)/gm, '<li style="margin:4px 0;padding-left:8px;">$1</li>');

  // Wrap lists
  html = html.replace(/(<li style="[^"]*">.*<\/li>)+/g, (match) => {
    return `<ul style="margin:12px 0;padding-left:24px;">${match}</ul>`;
  });

  // Paragraphs
  const lines = html.split(/\n\n+/);
  html = lines.map(line => {
    line = line.trim();
    if (!line) return '';
    if (line.startsWith('<h') || line.startsWith('<blockquote') || line.startsWith('<pre') || line.startsWith('<ul') || line.startsWith('<ol') || line.startsWith('<li') || line.startsWith('<hr') || line.startsWith('<img')) {
      return line;
    }
    line = line.replace(/\n/g, '<br />');
    return `<p style="margin:12px 0;line-height:1.8;font-size:${template.fontSize};font-family:${template.fontFamily};color:#333;">${line}</p>`;
  }).join('\n');

  // Final wrapper
  const fullHTML = `<div style="font-family:${template.fontFamily};font-size:${template.fontSize};line-height:1.8;color:#333;">
${html}
</div>
<p style="text-align:center;color:#999;font-size:12px;margin-top:32px;">—— 来自 MindScape</p>`;

  return fullHTML;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Copy HTML to clipboard using multiple methods for maximum compatibility
export async function copyToClipboard(html: string, baseUrl?: string): Promise<boolean> {
  try {
    // Convert relative image URLs to absolute
    if (baseUrl) {
      html = html.replace(/src="([^"]+)"/g, (match, src) => {
        if (src.startsWith('http://') || src.startsWith('https://')) {
          return match;
        }
        const absoluteUrl = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
        return `src="${absoluteUrl}"`;
      });
    }

    // Method 1: Use Clipboard API with HTML mime type (modern browsers)
    if (navigator.clipboard && navigator.clipboard.write) {
      try {
        const blob = new Blob([html], { type: 'text/html' });
        const item = new ClipboardItem({ 'text/html': blob });
        await navigator.clipboard.write([item]);
        return true;
      } catch (e) {
        console.log('Clipboard API method failed, trying fallback');
      }
    }

    // Method 2: Use a temporary element with selection API
    const success = await copyUsingSelection(html);
    if (success) return true;

    // Method 3: Fallback to plain text
    await navigator.clipboard.writeText(html);
    return true;

  } catch (error) {
    console.error('All copy methods failed:', error);
    return false;
  }
}

async function copyUsingSelection(html: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Create a temporary container
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:800px;';
      document.body.appendChild(container);

      // Select the content
      const range = document.createRange();
      range.selectNodeContents(container);

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      // Try to copy
      const success = document.execCommand('copy');

      // Cleanup
      selection?.removeAllRanges();
      document.body.removeChild(container);

      resolve(success);
    } catch (e) {
      console.log('Selection copy failed:', e);
      resolve(false);
    }
  });
}
