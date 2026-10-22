import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animate, stagger } from 'animejs';
import ImageSlider from './ImageSlider';
import ProjectScene from './ProjectScene';
import { usePrefersReducedMotion } from './useShowcaseMedia';

function nameScale(title) {
  if (title.length > 18) return 'long';
  if (title.length > 11) return 'mid';
  return 'short';
}

const ProjectTile = ({ project, index }) => {
  const tileRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();
  const numeral = String(index + 1).padStart(2, '0');
  const theme = project.theme;

  useEffect(() => {
    const root = tileRef.current;
    if (!root) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('is-static');
      return undefined;
    }

    const animations = [];
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const letters = root.querySelectorAll('.project-letter');
      const lines = root.querySelectorAll('.project-intro-line');
      const slider = root.querySelector('.project-slider');

      if (letters.length) {
        animations.push(animate(letters, {
          opacity: [0, 1],
          y: [18, 0],
          delay: stagger(34),
          duration: 880,
          ease: 'outExpo',
        }));
      }
      if (lines.length) {
        animations.push(animate(lines, {
          opacity: [0, 1],
          y: [30, 0],
          delay: stagger(95, { start: 120 }),
          duration: 980,
          ease: 'outExpo',
        }));
      }
      if (slider) {
        animations.push(animate(slider, {
          opacity: [0, 1],
          y: [22, 0],
          delay: 220,
          duration: 1100,
          ease: 'inOutSine',
        }));
      }
    };

    const inView = () => {
      const rect = root.getBoundingClientRect();
      if (!rect.height) return false;
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return visible / rect.height >= 0.2;
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      try {
        play();
      } catch {
        root.classList.add('is-static');
      }
      observer.disconnect();
    }, { threshold: 0.2 });

    observer.observe(root);
    if (inView()) {
      try {
        play();
      } catch {
        root.classList.add('is-static');
      }
    }

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.revert());
    };
  }, [project.id]);

  const onPointerMove = (event) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointer.current.x = x;
    pointer.current.y = y;
    event.currentTarget.style.setProperty('--px', x.toFixed(3));
    event.currentTarget.style.setProperty('--py', y.toFixed(3));
  };

  const onPointerLeave = (event) => {
    pointer.current.x = 0;
    pointer.current.y = 0;
    event.currentTarget.style.setProperty('--px', '0');
    event.currentTarget.style.setProperty('--py', '0');
  };

  return (
    <article
      className="project-tile"
      ref={tileRef}
      data-scene={theme.sceneType}
      aria-labelledby={`project-title-${project.id}`}
      style={{
        '--theme-primary': theme.primary,
        '--theme-secondary': theme.secondary,
        '--theme-fog': theme.fog,
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <ProjectScene theme={theme} pointer={pointer} />
      <div className="project-wash" aria-hidden="true" />
      <div className="project-ridges" aria-hidden="true">
        <svg className="ridge ridge-far" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path d="M0 210 L120 170 L220 196 L340 112 L470 168 L610 86 L760 150 L900 78 L1040 146 L1200 96 L1440 150 L1440 320 L0 320 Z" />
        </svg>
        <svg className="ridge ridge-mid" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path d="M0 236 L150 188 L280 220 L430 150 L590 208 L760 142 L930 198 L1100 156 L1260 204 L1440 170 L1440 320 L0 320 Z" />
        </svg>
        <svg className="ridge ridge-near" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path d="M0 262 L180 228 L320 252 L490 206 L680 246 L860 198 L1060 236 L1240 210 L1440 230 L1440 320 L0 320 Z" />
        </svg>
      </div>
      <div className="project-vignette" aria-hidden="true" />
      <div className="project-nameplate-shift" aria-hidden="true">
        <p className="project-nameplate" data-scale={nameScale(project.title)}>
          {project.title.split(' ').map((word, wordIndex, words) => (
            <span className="project-word" key={`${word}-${wordIndex}`}>
              {Array.from(word).map((char, charIndex) => (
                <span className="project-letter" key={`${char}-${charIndex}`}>{char}</span>
              ))}
              {wordIndex < words.length - 1 ? <span className="project-gap">{'\u00A0'}</span> : null}
            </span>
          ))}
        </p>
      </div>
      <div className="project-seal" aria-hidden="true"><span /></div>
      <span className="project-bracket tl" aria-hidden="true" />
      <span className="project-bracket tr" aria-hidden="true" />
      <span className="project-bracket bl" aria-hidden="true" />
      <span className="project-bracket br" aria-hidden="true" />
      <div className="project-intro">
        <p className="project-index project-intro-line">No. {numeral}</p>
        <h3 id={`project-title-${project.id}`} className="project-title project-intro-line">{project.title}</h3>
        <p className="project-tagline project-intro-line">{project.shortDescription}</p>
        <p className="project-copy project-intro-line">{project.longDescription}</p>
        <ul className="project-tags project-intro-line">
          {project.techStack.map((tech) => (
            <li key={tech} className="project-tag">{tech}</li>
          ))}
        </ul>
        <div className="project-actions project-intro-line">
          {project.liveUrl ? (
            <a className="btn btn-primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              {project.liveLabel || 'View Live'}
            </a>
          ) : null}
          {project.githubUrl ? (
            <a className="btn btn-secondary" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          ) : null}
          <Link className="btn btn-secondary" to={`/project/${project.id}`}>
            View Details
          </Link>
        </div>
      </div>
      <div className="project-slider">
        <div className="project-slider-float">
          <ImageSlider images={project.images} title={project.title} accent={theme.primary} />
        </div>
      </div>
      <div className="project-grain" aria-hidden="true" />
    </article>
  );
};

export default ProjectTile;
