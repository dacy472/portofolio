import ProjectTile from './projects/ProjectTile';
import { useProjects } from '../hooks/useProjects';
import './projects/projects.css';

function ProjectsSkeleton() {
  return (
    <div className="projects-skeleton" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="projects-skeleton-tile">
          <div className="projects-skeleton-glass" />
        </div>
      ))}
    </div>
  );
}

const Projects = () => {
  const { projects, loading } = useProjects();

  return (
    <section id="projects" className="projects-showcase" aria-labelledby="projects-heading">
      <header className="projects-heading">
        <div className="projects-heading-inner">
          <p className="projects-kicker">Selected works</p>
          <h2 id="projects-heading">Projects</h2>
        </div>
      </header>
      {loading ? (
        <ProjectsSkeleton />
      ) : (
        projects.map((project, index) => (
          <ProjectTile key={project.id} project={project} index={index} />
        ))
      )}
    </section>
  );
};

export default Projects;
