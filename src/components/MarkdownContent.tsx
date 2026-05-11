import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);

interface MarkdownContentProps {
  content: string;
}

function toText(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(toText).join('');
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return toText(children.props.children);
  }

  return '';
}

function slugifyHeading(children: React.ReactNode): string {
  return toText(children)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

function getCodeChild(children: React.ReactNode): React.ReactElement<{ className?: string; children?: React.ReactNode }> | null {
  if (React.isValidElement<{ className?: string; children?: React.ReactNode }>(children)) {
    return children;
  }

  if (Array.isArray(children)) {
    const child = children.find((item) => React.isValidElement(item));
    return React.isValidElement<{ className?: string; children?: React.ReactNode }>(child) ? child : null;
  }

  return null;
}

function getLanguage(className?: string): string {
  const match = className?.match(/language-([\w-]+)/);
  return match?.[1] || 'text';
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const codeChild = getCodeChild(children);
  const code = toText(codeChild?.props.children ?? children).replace(/\n$/, '');
  const language = getLanguage(codeChild?.props.className);

  const highlightedCode = useMemo(() => {
    if (!code) return '';

    if (language !== 'text' && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }

    return hljs.highlightAuto(code).value;
  }, [code, language]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-block-shell">
      <div className="code-block-toolbar">
        <span>{language}</span>
        <button type="button" onClick={copyCode}>
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="code-block">
        <code
          className={`hljs language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  return (
    <div className="markdown-content max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, children, ...props}) => (
            <h1 id={slugifyHeading(children)} className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent scroll-mt-28" {...props}>{children}</h1>
          ),
          h2: ({node, children, ...props}) => (
            <h2 id={slugifyHeading(children)} className="text-3xl font-semibold mt-8 mb-4 border-l-4 border-purple-500 pl-4 scroll-mt-28" {...props}>{children}</h2>
          ),
          h3: ({node, children, ...props}) => (
            <h3 id={slugifyHeading(children)} className="text-2xl font-medium mt-6 mb-3 scroll-mt-28" {...props}>{children}</h3>
          ),
          p: ({node, ...props}) => (
            <p className="leading-relaxed mb-4" {...props} />
          ),
          ul: ({node, ...props}) => (
            <ul className="list-disc list-outside space-y-2 my-4 pl-6" {...props} />
          ),
          ol: ({node, ...props}) => (
            <ol className="list-decimal list-outside space-y-2 my-4 pl-6" {...props} />
          ),
          li: ({node, ...props}) => (
            <li className="pl-2" {...props} />
          ),
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-pink-500 pl-4 italic my-4 bg-white/5 py-2 pr-4 rounded-r-lg" {...props} />
          ),
          code: ({node, ...props}) => (
            <code className="markdown-code" {...props} />
          ),
          pre: ({node, children}) => (
            <CodeBlock>{children}</CodeBlock>
          ),
          a: ({node, ...props}) => (
            <a target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-all" {...props} />
          ),
          strong: ({node, ...props}) => (
            <strong className="font-bold" {...props} />
          ),
          em: ({node, ...props}) => (
            <em className="italic text-purple-300" {...props} />
          ),
          hr: ({node, ...props}) => (
            <hr className="border-t border-purple-500/30 my-8" {...props} />
          ),
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          th: ({node, ...props}) => (
            <th className="border border-purple-500/30 px-4 py-2 bg-purple-900/30 text-left font-semibold" {...props} />
          ),
          td: ({node, ...props}) => (
            <td className="border border-purple-500/30 px-4 py-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
