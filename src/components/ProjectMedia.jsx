import { useState } from "react";
import SafeImage from "./SafeImage.jsx";

function mediaStyle(evidence) {
  return evidence.role === "low-resolution"
    ? {
        "--media-max": `${
          evidence.displayWidth ?? Math.round(evidence.width * 1.25)
        }px`,
      }
    : undefined;
}

function ImageEvidence({ evidence, projectTitle, priority }) {
  return (
    <figure
      className="project-media"
      data-media-kind="image"
      data-media-role={evidence.role}
      style={mediaStyle(evidence)}
    >
      <SafeImage
        src={evidence.src}
        alt={evidence.alt}
        width={evidence.width}
        height={evidence.height}
        loading={priority ? "eager" : "lazy"}
        style={{
          objectFit: evidence.fit ?? "contain",
          objectPosition: evidence.position,
        }}
        fallbackLabel={`${projectTitle} image unavailable`}
      />
      <figcaption>{evidence.caption}</figcaption>
    </figure>
  );
}

function VideoEvidence({ evidence }) {
  return (
    <figure
      className="project-media"
      data-media-kind="video"
      data-media-role={evidence.role}
    >
      <video
        src={evidence.src}
        poster={evidence.poster}
        width={evidence.width}
        height={evidence.height}
        controls
        playsInline
        preload="metadata"
      />
      <figcaption>{evidence.caption}</figcaption>
    </figure>
  );
}

function GifEvidence({ evidence, projectTitle }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure
      className="project-media"
      data-media-kind="gif"
      data-media-role={evidence.role}
      style={mediaStyle(evidence)}
    >
      <SafeImage
        src={playing ? evidence.src : evidence.poster}
        alt={evidence.alt}
        width={evidence.width}
        height={evidence.height}
        loading="lazy"
        style={{ objectFit: "contain" }}
        fallbackLabel={`${projectTitle} animation unavailable`}
      />
      <figcaption>{evidence.caption}</figcaption>
      <button
        type="button"
        className="media-control compact-control"
        onClick={() => setPlaying((current) => !current)}
      >
        {playing ? "Stop animation" : "Play animation"}
      </button>
    </figure>
  );
}

function PdfEvidence({ evidence }) {
  const [previewing, setPreviewing] = useState(false);
  return (
    <section
      className="project-media pdf-evidence"
      data-media-kind="pdf"
      aria-label={evidence.name}
    >
      <div className="pdf-evidence-heading">
        <div>
          <h3>{evidence.name}</h3>
          <p>{evidence.caption}</p>
        </div>
        <div className="pdf-actions">
          <a href={evidence.src} target="_blank" rel="noreferrer">
            {evidence.name}
          </a>
          <button
            type="button"
            className="media-control compact-control"
            onClick={() => setPreviewing((current) => !current)}
          >
            {previewing ? "Hide preview" : "Preview report"}
          </button>
        </div>
      </div>
      {previewing ? (
        <iframe
          src={evidence.src}
          title={`${evidence.name} preview`}
          loading="lazy"
        />
      ) : null}
    </section>
  );
}

export default function ProjectMedia({ evidence, projectTitle, priority }) {
  if (evidence.kind === "image") {
    return (
      <ImageEvidence
        evidence={evidence}
        projectTitle={projectTitle}
        priority={priority}
      />
    );
  }
  if (evidence.kind === "video") {
    return <VideoEvidence evidence={evidence} />;
  }
  if (evidence.kind === "gif") {
    return <GifEvidence evidence={evidence} projectTitle={projectTitle} />;
  }
  if (evidence.kind === "pdf") {
    return <PdfEvidence evidence={evidence} />;
  }
  return null;
}

function groupEvidence(evidence) {
  const groups = new Map();
  for (const item of evidence) {
    const group = item.group ?? "Additional evidence";
    const items = groups.get(group) ?? [];
    items.push(item);
    groups.set(group, items);
  }
  return groups;
}

function EvidenceGroups({ evidence, projectTitle }) {
  return [...groupEvidence(evidence)].map(([group, items]) => (
    <section className="evidence-group" key={group}>
      <h3>{group}</h3>
      <div className="evidence-group-items">
        {items.map((item) => (
          <ProjectMedia
            key={`${item.kind}:${item.src}`}
            evidence={item}
            projectTitle={projectTitle}
          />
        ))}
      </div>
    </section>
  ));
}

export function MoreEvidence({ evidence, projectTitle }) {
  const [open, setOpen] = useState(false);
  if (!evidence.length) return null;

  const allPdf = evidence.every((item) => item.kind === "pdf");
  if (allPdf) {
    return (
      <div className="more-evidence more-evidence-pdfs">
        <EvidenceGroups evidence={evidence} projectTitle={projectTitle} />
      </div>
    );
  }

  return (
    <div className="more-evidence">
      <button
        type="button"
        className="more-evidence-toggle compact-control"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        More evidence ({evidence.length})
      </button>
      {open ? (
        <div className="more-evidence-body">
          <EvidenceGroups evidence={evidence} projectTitle={projectTitle} />
        </div>
      ) : null}
    </div>
  );
}
