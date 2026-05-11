import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
          pre: ({node, ...props}) => (
            <pre className="my-4" {...props} />
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
