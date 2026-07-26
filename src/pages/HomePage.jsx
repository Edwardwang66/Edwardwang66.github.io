import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import CurryCompanion from "../components/CurryCompanion.jsx";
import Portrait from "../components/Portrait.jsx";
import ProjectArchive from "../components/ProjectArchive.jsx";
import SocialLinks from "../components/SocialLinks.jsx";
import { profile, projects } from "../data/portfolio.js";

export default function HomePage({ onOpenProject }) {
  const featuredExperience = profile.experience.filter(
    (record) => record.featured
  );

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
            <a href="#selected-experience">Experience</a>
          </div>
          <SocialLinks socials={profile.socials} />
        </div>
        <Portrait size="hero" />
      </section>

      <section
        id="selected-experience"
        className="selected-experience"
        aria-labelledby="selected-experience-title"
      >
        <div className="section-heading-row">
          <h2 id="selected-experience-title">Selected experience</h2>
          <p>{featuredExperience.length} internships</p>
        </div>
        <div className="featured-experience-list">
          {featuredExperience.map((record) => (
            <article
              className="featured-experience-record"
              key={`${record.org}:${record.year}`}
            >
              <p className="featured-experience-date">{record.year}</p>
              <div className="featured-experience-identity">
                <h3 className="font-serif">
                  <a
                    href={record.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {record.org} <ArrowUpRight aria-hidden="true" />
                  </a>
                </h3>
                <p className="featured-experience-role">{record.role}</p>
                <p className="featured-experience-location">{record.location}</p>
              </div>
              <p className="featured-experience-note">{record.note}</p>
            </article>
          ))}
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
      <CurryCompanion />
    </main>
  );
}
