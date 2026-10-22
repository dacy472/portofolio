import { useEffect } from 'react';

export function usePointerFX(ref) {
  useEffect(() => {
    const root = ref.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!root || reduced) return undefined;

    const onMove = (event) => {
      const tilt = event.target.closest?.('.tilt-card');
      if (tilt && root.contains(tilt)) {
        const rect = tilt.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        tilt.style.transform = `rotateX(${(-py * 14).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg) translateY(-10px)`;
      }

      const button = event.target.closest?.('.btn');
      if (button && root.contains(button)) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        button.style.transform = `translate(${(x * 0.3).toFixed(1)}px, ${(y * 0.45).toFixed(1)}px) scale(1.06)`;
      }
    };

    const onOut = (event) => {
      const tilt = event.target.closest?.('.tilt-card');
      if (tilt && !tilt.contains(event.relatedTarget)) tilt.style.transform = '';

      const button = event.target.closest?.('.btn');
      if (button && !button.contains(event.relatedTarget)) button.style.transform = '';
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerout', onOut);
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerout', onOut);
    };
  }, [ref]);
}
