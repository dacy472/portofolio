import { useEffect, useRef } from 'react';
import HeroScene from './HeroScene';
import { useReveal } from '../hooks/useReveal';
import { usePointerFX } from '../hooks/usePointerFX';

const title = [
  { text: 'I', gradient: false },
  { text: 'build', gradient: false },
  { text: 'digital', gradient: true },
  { text: 'experiences', gradient: true },
  { text: 'that', gradient: false },
  { text: 'matter.', gradient: false },
];

const Hero = () => {
  const sectionRef = useRef(null);
  useReveal(sectionRef);
  usePointerFX(sectionRef);

  useEffect(() => {
    const section = sectionRef.current;
    const content = section?.querySelector('.hero-content');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!content || reduced) return undefined;

    const onScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.45), 1);
      content.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      content.style.opacity = String(1 - progress);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      content.style.transform = '';
      content.style.opacity = '';
    };
  }, []);

  return (
    <section id="home" className="hero-section" ref={sectionRef}>
      <HeroScene />
      <div className="container hero-content">
        <div className="reveal-item" data-motion="rise" data-delay="0">
          <h2 className="hero-kicker">Hello, I'm Chamindu Rathnayake</h2>
        </div>
        <h1 className="hero-title">
          {title.map((word, index) => (
            <span
              key={word.text}
              className={`reveal-item hero-word${word.gradient ? ' text-gradient' : ''}`}
              data-motion="word"
              data-delay={180 + index * 90}
            >
              {word.text}
            </span>
          ))}
        </h1>
        <div className="reveal-item" data-motion="rise" data-delay="760">
          <p className="hero-copy">
            A passionate software engineer specializing in building exceptional websites, applications, and everything in between.
          </p>
        </div>
        <div className="reveal-item" data-motion="rise" data-delay="900">
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">View My Work</a>
            <a href="#contact" className="btn btn-secondary">Contact Me</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
