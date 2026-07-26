import { useCallback, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SafeImage from "./SafeImage.jsx";

export default function ProjectArchive({ projects, onOpenProject }) {
  const [activeId, setActiveId] = useState(projects[0].id);
  const activate = useCallback((id) => {
    setActiveId((current) => (current === id ? current : id));
  }, []);

  return (
    <div className="project-archive">
      {projects.map((project) => {
        const expanded = activeId === project.id;
        const lowResolution = project.homeEvidence?.role === "low-resolution";
        return (
          <article
            className="project-archive-item"
            data-project-id={project.id}
            key={project.id}
          >
            <button
              id={`project-trigger-${project.id}`}
              type="button"
              className="project-archive-trigger"
              data-project-trigger
              data-project-id={project.id}
              aria-expanded={expanded}
              aria-controls={`project-panel-${project.id}`}
              onClick={() => activate(project.id)}
            >
              <span className="project-index">{project.no}</span>
              <span className="project-trigger-copy">
                <span className="project-title font-serif">{project.title}</span>
                <span className="project-role">{project.role}</span>
              </span>
              <span className="project-meta">
                {project.status ? (
                  <span className="project-live-status">
                    <span aria-hidden="true" />
                    {project.status}
                  </span>
                ) : null}
                <span className="project-year">{project.year}</span>
              </span>
              <ArrowRight className="project-state-arrow" aria-hidden="true" />
            </button>
            <div
              id={`project-panel-${project.id}`}
              className="project-archive-panel"
              role="region"
              aria-labelledby={`project-trigger-${project.id}`}
              aria-hidden={expanded ? undefined : "true"}
              hidden={!expanded}
            >
              <div className="project-panel-content">
                {project.homeEvidence ? (
                  <figure
                    className="archive-evidence"
                    data-media-role={project.homeEvidence.role}
                    style={
                      lowResolution
                        ? {
                            "--media-max": `${Math.round(
                              project.homeEvidence.width * 1.25
                            )}px`,
                          }
                        : undefined
                    }
                  >
                    <SafeImage
                      src={project.homeEvidence.src}
                      alt={project.homeEvidence.alt}
                      width={project.homeEvidence.width}
                      height={project.homeEvidence.height}
                      loading={project.no === "01" ? "eager" : "lazy"}
                      style={{
                        objectFit: project.homeEvidence.fit,
                        objectPosition: project.homeEvidence.position,
                      }}
                      fallbackLabel={`${project.title} image unavailable`}
                    />
                    <figcaption>{project.homeEvidence.caption}</figcaption>
                  </figure>
                ) : null}
                <div className="project-panel-copy">
                  <p className="evidence-label">
                    {project.homeEvidence ? "Selected evidence" : "Project note"}
                  </p>
                  <h3 className="font-serif">
                    {project.homeEvidence?.heading ?? project.outcome}
                  </h3>
                  <p>{project.summary}</p>
                  {project.links.length ? (
                    <div
                      className="project-panel-actions"
                      aria-label={`${project.title} links`}
                    >
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label} <ArrowUpRight aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  ) : null}
                  <a
                    href={`#project-${project.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onOpenProject(project);
                    }}
                  >
                    Open project <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
