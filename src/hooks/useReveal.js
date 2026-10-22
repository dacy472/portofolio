import { useEffect } from 'react';
import { animate, onScroll } from 'animejs';

const presets = {
  rise: { y: [88, 0], scale: [0.88, 1], rotateX: [16, 0], duration: 1050 },
  word: { y: [56, 0], scale: [0.72, 1], rotateX: [48, 0], duration: 900 },
  card: { y: [140, 0], scale: [0.8, 1], rotateX: [24, 0], duration: 1200 },
  drop: { y: [-48, 0], scale: [0.9, 1], rotateX: [-12, 0], duration: 900 },
};

export function useReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const targets = [...root.querySelectorAll('.reveal-item')];
    if (!targets.length) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      targets.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return undefined;
    }

    const animations = targets.map((el, index) => {
      const motion = presets[el.dataset.motion] || presets.rise;
      const delay = el.dataset.delay ? Number(el.dataset.delay) : (index % 3) * 120;

      return animate(el, {
        opacity: [0, 1],
        ease: 'outExpo',
        delay,
        ...motion,
        autoplay: onScroll({
          target: el,
          sync: 'play',
          repeat: false,
        }),
      });
    });

    return () => {
      animations.forEach((animation) => animation.revert());
    };
  }, [ref]);
}
