import { useState } from 'react';

/** Served from `public/` — neutral fallback when remote/local cover fails to load */
export const NOTE_COVER_PLACEHOLDER_SRC = '/images/cover-placeholder.svg';

interface NoteCoverImageProps {
  src: string;
  alt: string;
  /** Extra class on the fixed-ratio wrapper */
  className?: string;
}

export function NoteCoverImage({ src, alt, className = '' }: NoteCoverImageProps) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const effectiveSrc = usePlaceholder ? NOTE_COVER_PLACEHOLDER_SRC : src;

  return (
    <div className={`note-cover-frame ${className}`.trim()}>
      <img
        src={effectiveSrc}
        alt={alt}
        width={800}
        height={450}
        loading="lazy"
        decoding="async"
        className="note-cover-img"
        onError={() => {
          if (!usePlaceholder) setUsePlaceholder(true);
        }}
      />
    </div>
  );
}
