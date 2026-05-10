import { motion } from 'framer-motion';

interface MouseGlowProps {
  position: { x: number; y: number };
  isVisible: boolean;
}

export function MouseGlow({ position, isVisible }: MouseGlowProps) {
  if (!isVisible) return null;

  return (
    <div
      className="mouse-glow"
      style={{
        left: position.x,
        top: position.y,
      }}
    />
  );
}
