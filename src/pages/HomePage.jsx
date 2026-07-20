import { ArrowDownRight } from "lucide-react";
import Portrait from "../components/Portrait.jsx";
import ProjectArchive from "../components/ProjectArchive.jsx";
import { profile, projects } from "../data/portfolio.js";

export default function HomePage({ onOpenProject }) {
  const practice = profile.currentPractice;

  return (
    <main className="page-shell home-page" aria-labelledby="home-title">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-status">
            <span className="status-dot" aria-hidden="true" />
            {profile.location}
          </p>
          <p className="hero-positioning">{profile.positioning}</p>
          <h1 id="home-title" tabIndex="-1" className="font-serif">
            {profile.tagline}
          </h1>
          <p className="hero-supporting">{profile.heroCopy}</p>
          <div className="hero-actions">
            <a href="#selected-work">
              Selected work <ArrowDownRight aria-hidden="true" />
            </a>
            <a href="#current-practice">Current practice</a>
          </div>
        </div>
        <Portrait size="hero" />
      </section>

      <section
        id="current-practice"
        className="current-practice"
        aria-labelledby="current-practice-title"
      >
        <div className="section-heading-row">
          <p>Current practice</p>
          <p>{practice.year}</p>
        </div>
        <div className="practice-record">
          <div>
            <h2 id="current-practice-title" className="font-serif">
              {practice.org}
            </h2>
            <p className="practice-role">{practice.role}</p>
            <p className="practice-location">{practice.location}</p>
          </div>
          <p className="practice-note">{practice.note}</p>
        </div>
      </section>

      <section
        id="selected-work"
        className="selected-work"
        aria-labelledby="selected-work-title"
      >
        <div className="section-heading-row">
          <h2 id="selected-work-title">Selected work</h2>
          <p>{projects.length} projects</p>
        </div>
        <ProjectArchive projects={projects} onOpenProject={onOpenProject} />
      </section>
    </main>
  );
}
