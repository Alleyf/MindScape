import { useState, useEffect } from 'react';

export function useMouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { position, isVisible };
}

export function useRandomWalk(notes: any[], currentSlug?: string) {
  const [randomNote, setRandomNote] = useState<any | null>(null);

  const walk = () => {
    const availableNotes = currentSlug
      ? notes.filter(n => n.slug !== currentSlug)
      : notes;
    const randomIndex = Math.floor(Math.random() * availableNotes.length);
    setRandomNote(availableNotes[randomIndex]);
  };

  useEffect(() => {
    walk();
  }, []);

  return { randomNote, walk };
}

export function useParallaxScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
}
