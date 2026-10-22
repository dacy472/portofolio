import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (!glow || reduced || coarse) return undefined;

    const point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: point.x, y: point.y };
    let frame = 0;

    const onMove = (event) => {
      point.x = event.clientX;
      point.y = event.clientY;
    };

    const tick = () => {
      current.x += (point.x - current.x) * 0.14;
      current.y += (point.y - current.y) * 0.14;
      glow.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
