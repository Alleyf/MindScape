import { useState, useMemo } from 'react';

interface NoteCoverImageProps {
  src?: string;
  slug?: string;
  alt?: string;
  className?: string;
}

/**
 * 生成确定性的 picsum URL，使用 FNV-1a 哈希作为 seed
 */
function generatePicsumUrl(seed: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return `https://picsum.photos/seed/ms-${h.toString(16)}/1200/630`;
}

export function NoteCoverImage({ src, slug, alt = '', className = '' }: NoteCoverImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  
  // 使用 memo 优化性能，如果 slug 改变才重新计算
  const fallbackUrl = useMemo(() => {
    const seed = slug || 'default-cover';
    return generatePicsumUrl(seed);
  }, [slug]);
  
  // 决定使用哪个 URL
  const effectiveSrc = useFallback || !src ? fallbackUrl : src;

  return (
    <div className={`note-cover-frame ${className}`.trim()}>
      <img
        src={effectiveSrc}
        alt={alt}
        width={1200}
        height={630}
        loading="lazy"
        decoding="async"
        className="note-cover-img"
        onError={() => {
          if (!useFallback) {
            setUseFallback(true);
          }
        }}
      />
    </div>
  );
}
