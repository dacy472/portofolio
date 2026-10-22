import { useEffect, useRef, useState } from 'react';
import Lightbox from './Lightbox';
import { usePrefersReducedMotion } from './useShowcaseMedia';

function wrap(value, half) {
  if (!(half > 1)) return 0;
  let next = value % half;
  if (next > 0) next -= half;
  if (next <= -half) next += half;
  return next;
}

function inkFallback(label, accent) {
  const safe = String(label || 'Project').replace(/[<>&'"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><rect width="960" height="600" fill="#0E1420"/><circle cx="480" cy="260" r="120" fill="${accent || '#5FE3F0'}" fill-opacity="0.25"/><text x="48" y="540" fill="#EEF3F8" font-family="sans-serif" font-size="28">${safe}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function SliderCard({ src, alt, accent, reduced, hidden, onOpen }) {
  const [loaded, setLoaded] = useState(false);

  const onMove = (event) => {
    if (reduced || event.currentTarget.closest('[data-dragging="true"]')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.transform = `rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) scale(1.045)`;
  };

  return (
    <button
      type="button"
      className="slider-card"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : 0}
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={(event) => {
        event.currentTarget.style.transform = '';
      }}
    >
      <img
        src={src}
        alt={hidden ? '' : alt}
        loading="lazy"
        decoding="async"
        draggable="false"
        width="960"
        height="600"
        className={loaded ? 'is-loaded' : ''}
        onLoad={() => setLoaded(true)}
        onError={(event) => {
          const img = event.currentTarget;
          img.onerror = null;
          img.src = inkFallback(alt, accent);
          setLoaded(true);
        }}
      />
    </button>
  );
}

const ImageSlider = ({ images = [], title, accent }) => {
  const reduced = usePrefersReducedMotion();
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const offset = useRef(0);
  const hoverRef = useRef(false);
  const dragRef = useRef(null);
  const suppressClick = useRef(false);
  const openerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !inView || images.length < 1) return undefined;
    let frame = 0;
    let last = performance.now();

    const apply = () => {
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offset.current.toFixed(2)}px, 0, 0)`;
      }
    };

    const tick = (now) => {
      const dt = Math.min(32, now - last);
      last = now;
      const half = (trackRef.current?.scrollWidth || 0) / 2;
      const paused = document.hidden || hoverRef.current || viewportRef.current?.dataset.dragging === 'true';
      if (!paused && half > 1) {
        const speed = Math.max(28, half / 22);
        offset.current = wrap(offset.current - (dt / 1000) * speed, half);
        apply();
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, inView, images.length]);

  const applyDrag = (value) => {
    const half = (trackRef.current?.scrollWidth || 0) / 2;
    offset.current = wrap(value, half);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offset.current.toFixed(2)}px, 0, 0)`;
    }
  };

  const onPointerDown = (event) => {
    if (reduced || event.button > 0) return;
    suppressClick.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      origin: offset.current,
      moved: 0,
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    const viewport = viewportRef.current;
    if (!drag || !viewport || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > 6 && viewport.dataset.dragging !== 'true') {
      viewport.dataset.dragging = 'true';
      setDragging(true);
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch {
        /* pointer already released */
      }
    }
    if (viewport.dataset.dragging !== 'true') return;
    drag.moved = Math.abs(dx);
    applyDrag(drag.origin + dx);
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressClick.current = drag.moved > 8;
    dragRef.current = null;
    const viewport = viewportRef.current;
    if (viewport) delete viewport.dataset.dragging;
    setDragging(false);
  };

  const openFromCard = (imageIndex, event) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    openerRef.current = event.currentTarget;
    setOpenIndex(imageIndex);
  };

  const closeLightbox = () => {
    setOpenIndex(null);
    const opener = openerRef.current;
    requestAnimationFrame(() => opener?.focus?.());
  };

  if (!images.length) return null;

  const sequence = reduced ? images : [...images, ...images];

  return (
    <>
      <div
        className={`slider-viewport${reduced ? ' is-static' : ''}${dragging ? ' is-dragging' : ''}`}
        ref={viewportRef}
        aria-label={`${title} gallery`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => {
          hoverRef.current = true;
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
        }}
      >
        <div className="slider-track" ref={trackRef}>
          {sequence.map((src, index) => {
            const imageIndex = index % images.length;
            const hidden = index >= images.length;
            return (
              <SliderCard
                key={`${hidden ? 'loop' : 'base'}-${imageIndex}`}
                src={src}
                alt={`${title} preview ${imageIndex + 1}`}
                accent={accent}
                reduced={reduced}
                hidden={hidden}
                onOpen={(event) => openFromCard(imageIndex, event)}
              />
            );
          })}
        </div>
      </div>
      {openIndex !== null && (
        <Lightbox
          images={images}
          index={openIndex}
          title={title}
          onClose={closeLightbox}
          onChange={setOpenIndex}
        />
      )}
    </>
  );
};

export default ImageSlider;
