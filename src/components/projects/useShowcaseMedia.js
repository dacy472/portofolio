import { useSyncExternalStore } from 'react';

function subscribe(query, onStoreChange) {
  const media = window.matchMedia(query);
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

function useMedia(query) {
  return useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function usePrefersReducedMotion() {
  return useMedia('(prefers-reduced-motion: reduce)');
}

export function useCheapScene() {
  return useMedia('(max-width: 860px), (pointer: coarse)');
}
