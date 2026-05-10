import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  return (
    <div className="markdown-content prose prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => (
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent" {...props} />
          ),
          h2: ({node, ...props}) => (
            <h2 className="text-3xl font-semibold mt-8 mb-4 text-purple-300 border-l-4 border-purple-500 pl-4" {...props} />
          ),
          h3: ({node, ...props}) => (
            <h3 className="text-2xl font-medium mt-6 mb-3 text-blue-300" {...props} />
          ),
          p: ({node, ...props}) => (
            <p className="text-gray-200 leading-relaxed mb-4" {...props} />
          ),
          ul: ({node, ...props}) => (
            <ul className="list-disc list-inside space-y-2 my-4 text-gray-200" {...props} />
          ),
          ol: ({node, ...props}) => (
            <ol className="list-decimal list-inside space-y-2 my-4 text-gray-200" {...props} />
          ),
          li: ({node, ...props}) => (
            <li className="pl-2" {...props} />
          ),
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-300 my-4 bg-white/5 py-2 pr-4 rounded-r-lg" {...props} />
          ),
          code: ({node, inline, ...props}: any) => (
            inline ? (
              <code className="bg-purple-900/50 px-2 py-1 rounded text-pink-300 text-sm" {...props} />
            ) : (
              <code className="block bg-gray-900/80 p-4 rounded-lg overflow-x-auto text-sm text-green-300 font-mono" {...props} />
            )
          ),
          pre: ({node, ...props}) => (
            <pre className="my-4" {...props} />
          ),
          a: ({node, ...props}) => (
            <a className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-all" {...props} />
          ),
          strong: ({node, ...props}) => (
            <strong className="font-bold text-white" {...props} />
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
      
      <style jsx>{`
        .markdown-content {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
