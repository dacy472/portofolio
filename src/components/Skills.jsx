import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { usePointerFX } from '../hooks/usePointerFX';

const Skills = () => {
  const sectionRef = useRef(null);
  useReveal(sectionRef);
  usePointerFX(sectionRef);

  const skills = [
    { category: 'Frontend', items: ['React', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'Tailwind CSS', 'Vite'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'RESTful APIs', 'SQL / NoSQL'] },
    { category: 'Tools & DevOps', items: ['Git & GitHub', 'Netlify', 'Vercel', 'Docker', 'AWS'] },
    { category: 'Design', items: ['Figma', 'UI/UX Principles', 'Responsive Design', 'Wireframing'] }
  ];

  return (
    <section id="skills" className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }} ref={sectionRef}>
      <div className="reveal-item">
        <h2 style={{ fontSize: '3rem', marginBottom: '3rem', fontWeight: '700' }}>
          My <span className="text-gradient">Skills</span>
        </h2>
      </div>
      
      <div className="card-grid card-grid-skills">
        {skills.map((skillGroup, index) => (
          <div key={index} className="reveal-item" data-motion="card">
            <div className="glass-panel tilt-card" style={{ padding: '2rem', height: '100%' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
              {skillGroup.category}
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {skillGroup.items.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-secondary)' }}>▹</span> {item}
                </li>
              ))}
            </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
