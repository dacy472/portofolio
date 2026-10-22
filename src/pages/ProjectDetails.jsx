import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';

const ProjectDetails = () => {
  const { id } = useParams();
  const { projects, loading } = useProjects();
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container projects-skeleton-detail" style={{ paddingTop: '10rem', minHeight: '80vh' }}>
        <div className="projects-skeleton-glass" style={{ height: '12rem', marginBottom: '2rem' }} />
        <div className="projects-skeleton-glass" style={{ height: '24rem' }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ paddingTop: '10rem', textAlign: 'center', minHeight: '80vh' }}>
        <h2>Project not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <main className="container animate-fade-in" style={{ paddingTop: '8rem', paddingBottom: '6rem', minHeight: '80vh' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        <span style={{ marginRight: '0.5rem' }}>←</span> Back to Portfolio
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.1' }}>
            <span className="text-gradient">{project.title}</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: '1.6' }}>
            {project.longDescription}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {project.liveLabel || 'View Live'}
            </a>
          )}
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={project.liveUrl ? 'btn btn-secondary' : 'btn btn-primary'}>
            View on GitHub
          </a>
        </div>
      </div>

      <div style={{ marginBottom: '4rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '600' }}>Technologies Used</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {project.techStack.map((tech) => (
            <span key={tech} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {project.images.length > 0 && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {project.images.map((imgSrc, idx) => (
            <div key={imgSrc + idx} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={imgSrc} alt={`${project.title} screenshot ${idx + 1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default ProjectDetails;
