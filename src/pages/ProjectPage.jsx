import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import ProjectMedia, { MoreEvidence } from "../components/ProjectMedia.jsx";

function Fact({ label, children }) {
  return (
    <div className="project-fact">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function ExternalLinks({ links }) {
  return links.map((link) => (
    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
      {link.label} <ExternalLink aria-hidden="true" />
    </a>
  ));
}

function ProjectStory({ project }) {
  if (project.storySections?.length) {
    return (
      <>
        <div className="project-story">
          {project.storySections.map((section) => (
            <section key={section.label}>
              <h2>{section.label}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
        <section className="project-tools" aria-labelledby="project-stack-title">
          <h2 id="project-stack-title">Stack</h2>
          <p>{project.stack.join(" · ")}</p>
        </section>
        <section className="project-links-section" aria-labelledby="project-links-title">
          <h2 id="project-links-title">Links</h2>
          <div className="project-links">
            <ExternalLinks links={project.links} />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="project-story">
        <section><h2>Context</h2><p>{project.overview}</p></section>
        <section><h2>Challenge</h2><p>{project.challenge}</p></section>
        <section><h2>Contribution</h2><p>{project.approach}</p></section>
        <section><h2>Outcome</h2><p>{project.outcome}</p></section>
      </div>
      <section className="project-tools" aria-labelledby="project-tools-title">
        <h2 id="project-tools-title">Tools and technologies</h2>
        <p>{project.stack.join(" · ")}</p>
      </section>
    </>
  );
}

export default function ProjectPage({
  project,
  nextProject,
  onBack,
  onOpenProject,
}) {
  const primaryStack = project.stack.slice(0, 3).join(", ");
  const remainingStack = Math.max(0, project.stack.length - 3);
  const productStory = Boolean(project.storySections?.length);

  return (
    <main className="page-shell project-page" aria-labelledby="project-title">
      <button
        type="button"
        className="project-back compact-control"
        onClick={onBack}
      >
        <ArrowLeft aria-hidden="true" /> Back to Work
      </button>

      <header className="project-header">
        <p className="project-eyebrow">
          <span>{project.no}</span>
          <span>{project.context}</span>
          <span>{project.year}</span>
          <span>{project.tags.join(" · ")}</span>
        </p>
        <h1 id="project-title" tabIndex="-1" className="font-serif">
          {project.title}
        </h1>
        <p className="project-summary">{project.summary}</p>
        <dl className="project-facts">
          <Fact label="Role">{project.role}</Fact>
          <Fact label="Year">{project.year}</Fact>
          {!productStory ? (
            <>
              <Fact label="Stack">
                {primaryStack}
                {remainingStack ? ` +${remainingStack}` : ""}
              </Fact>
              <Fact label="Links">
                {project.links.length ? (
                  <ExternalLinks links={project.links} />
                ) : (
                  <span>Available on request</span>
                )}
              </Fact>
            </>
          ) : null}
        </dl>
      </header>

      {project.leadEvidence ? (
        <div className="lead-evidence">
          <ProjectMedia
            evidence={project.leadEvidence}
            projectTitle={project.title}
            priority
          />
        </div>
      ) : null}

      <ProjectStory project={project} />

      {project.selectedEvidence.length ? (
        <section className="project-evidence-section" aria-labelledby="selected-evidence-title">
          <h2 id="selected-evidence-title">Selected evidence</h2>
          <div className="selected-evidence">
            {project.selectedEvidence.map((evidence) => (
              <ProjectMedia
                key={`${evidence.kind}:${evidence.src}`}
                evidence={evidence}
                projectTitle={project.title}
              />
            ))}
          </div>
        </section>
      ) : null}

      {project.moreEvidence.length ? (
        <section className="project-more-section" aria-label="More evidence">
          <MoreEvidence
            evidence={project.moreEvidence}
            projectTitle={project.title}
          />
        </section>
      ) : null}

      <a
        className="next-project"
        href={`#project-${nextProject.id}`}
        onClick={(event) => {
          event.preventDefault();
          onOpenProject(nextProject);
        }}
      >
        <span>Next project</span>
        <strong className="font-serif">{nextProject.title}</strong>
        <ArrowRight aria-hidden="true" />
      </a>
    </main>
  );
}
