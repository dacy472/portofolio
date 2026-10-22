import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Lightbox = ({ images, index, title, onClose, onChange }) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const latest = useRef({ index, onChange, onClose });

  useEffect(() => {
    latest.current = { index, onChange, onClose };
  }, [index, onChange, onClose]);

  useEffect(() => {
    const previous = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    closeRef.current?.focus();

    const onKey = (event) => {
      if (!images.length) return;
      const current = latest.current;
      const total = images.length;
      if (event.key === 'Escape') {
        event.preventDefault();
        current.onClose();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        current.onChange((current.index + 1) % total);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        current.onChange((current.index - 1 + total) % total);
      } else if (event.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const items = [...dialog.querySelectorAll('button')];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous.overflow;
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [images.length]);

  const count = images.length;
  const safeIndex = ((index % count) + count) % count;
  const src = images[safeIndex];

  return createPortal(
    <div
      className="showcase-lightbox"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image ${safeIndex + 1} of ${count}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        className="showcase-lightbox-close"
        ref={closeRef}
        aria-label="Close image"
        onClick={onClose}
      >
        <span aria-hidden="true">×</span>
      </button>
      <button
        type="button"
        className="showcase-lightbox-nav showcase-lightbox-prev"
        aria-label="Previous image"
        onClick={() => onChange((safeIndex - 1 + count) % count)}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <figure className="showcase-lightbox-frame">
        <img className="showcase-lightbox-photo" src={src} alt={`${title} preview ${safeIndex + 1}`} />
        <figcaption className="showcase-lightbox-caption">
          {String(safeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </figcaption>
      </figure>
      <button
        type="button"
        className="showcase-lightbox-nav showcase-lightbox-next"
        aria-label="Next image"
        onClick={() => onChange((safeIndex + 1) % count)}
      >
        <span aria-hidden="true">›</span>
      </button>
      <p className="showcase-lightbox-hint">Esc to close</p>
    </div>,
    document.body,
  );
};

export default Lightbox;
