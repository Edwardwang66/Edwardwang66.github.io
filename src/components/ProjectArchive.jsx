import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useDisclosureSpring } from "../hooks/useDisclosureSpring.js";
import { useMediaPreference } from "../hooks/useMediaPreference.js";
import { useMobileProjectActivation } from "../hooks/useMobileProjectActivation.js";
import SafeImage from "./SafeImage.jsx";

export default function ProjectArchive({ projects, onOpenProject }) {
  const ids = useMemo(() => projects.map((project) => project.id), [projects]);
  const [activeId, setActiveId] = useState(projects[0].id);
  const reducedMotion = useMediaPreference("(prefers-reduced-motion: reduce)");
  const triggerNodes = useRef(new Map());
  const panelNodes = useRef(new Map());
  const { registerPanel, registerPanelContent } = useDisclosureSpring({
    ids,
    activeId,
    reducedMotion,
  });

  const activateFromObserver = useCallback((id) => {
    setActiveId((current) => (current === id ? current : id));
  }, []);
  const { noteManualActivation } = useMobileProjectActivation({
    ids,
    activeId,
    onActivate: activateFromObserver,
    triggerNodes,
    panelNodes,
  });
  const activateFromTrigger = useCallback(
    (id) => {
      noteManualActivation();
      setActiveId((current) => (current === id ? current : id));
    },
    [noteManualActivation]
  );

  return (
    <div className="project-archive" data-reduced-motion={reducedMotion}>
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
              ref={(node) => {
                if (node) triggerNodes.current.set(project.id, node);
                else triggerNodes.current.delete(project.id);
              }}
              onClick={() => activateFromTrigger(project.id)}
            >
              <span className="project-index">{project.no}</span>
              <span className="project-trigger-copy">
                <span className="project-title font-serif">{project.title}</span>
                <span className="project-role">{project.role}</span>
              </span>
              <span className="project-year">{project.year}</span>
              <ArrowRight className="project-state-arrow" aria-hidden="true" />
            </button>
            <div
              id={`project-panel-${project.id}`}
              className="project-archive-panel"
              role="region"
              aria-labelledby={`project-trigger-${project.id}`}
              ref={(node) => {
                if (node) panelNodes.current.set(project.id, node);
                else panelNodes.current.delete(project.id);
                registerPanel(project.id)(node);
              }}
            >
              <div
                className="project-panel-content"
                ref={registerPanelContent(project.id)}
              >
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
