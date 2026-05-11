interface MouseGlowProps {
  position?: { x: number; y: number };
  isVisible?: boolean;
}

export function MouseGlow({ position = { x: 0, y: 0 }, isVisible = false }: MouseGlowProps) {
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
