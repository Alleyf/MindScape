import { useState } from 'react';
import { Copy } from 'lucide-react';
import { WeChatCopyModal } from './WeChatCopyModal';

interface WeChatCopyButtonProps {
  markdown: string;
  title: string;
}

export function WeChatCopyButton({ markdown, title }: WeChatCopyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 theme-text transition-colors border border-white/10"
        title="复制为微信公众号格式"
      >
        <Copy className="w-4 h-4" />
        <span className="hidden sm:inline">公众号格式</span>
      </button>

      <WeChatCopyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        markdown={markdown}
        title={title}
      />
    </>
  );
}
