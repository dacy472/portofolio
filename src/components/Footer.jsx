import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { usePointerFX } from '../hooks/usePointerFX';

const Footer = () => {
  const footerRef = useRef(null);
  useReveal(footerRef);
  usePointerFX(footerRef);

  return (
    <footer id="contact" style={{ padding: '4rem 0 2rem 0', marginTop: '4rem', borderTop: '1px solid var(--glass-border)' }} ref={footerRef}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div className="reveal-item" data-motion="word">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>
            Let's Work <span className="text-gradient">Together</span>
          </h2>
        </div>
        <div className="reveal-item">
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem', lineHeight: '1.6' }}>
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
        </div>
        <div className="reveal-item">
          <a href="https://wa.me/94768597816?text=Hi%20Chamindu%2C" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginBottom: '4rem' }}>
            Say Hello
          </a>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <a href="https://github.com/dacy472" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>GitHub</a>
          <a href="https://www.linkedin.com/in/chamindu-rathnayake-413742375" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>LinkedIn</a>
          <a href="https://x.com/DACY_472" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>X</a>
          <a href="https://www.instagram.com/dacy472" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>Instagram</a>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Chamindu Rathnayake. Built with React & Vite.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
