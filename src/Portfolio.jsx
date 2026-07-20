import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
} from "lucide-react";
import { socialIcons } from "./components/socialIcons.js";
import SiteChrome from "./components/SiteChrome.jsx";
import { profile, projects } from "./data/portfolio.js";
import HomePage from "./pages/HomePage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";

/**
 * Edward Wang — robotics & controls portfolio.
 * Single React component, state-based routing between three views:
 *   - home       : hero + selected work index
 *   - project    : per-project detail page
 *   - about      : bio, education, experience, skills, contact
 *
 * Content data lives in `src/data/portfolio.js`.
 */

/* ----------------------------------- About --------------------------------- */

function About() {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-10 pb-24">
      <section className="pt-24 sm:pt-32 pb-12 border-b border-neutral-200">
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">
          About
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
          <div className="sm:col-span-5 flex justify-center sm:justify-start">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-emerald-100/30 rounded-3xl blur-3xl opacity-50 -z-10"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden border border-neutral-200/60 shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-1">
                <img
                  src="/IMG_9036.JPG"
                  alt="Edward Wang"
                  className="w-full aspect-square object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-7">
            <h1
              tabIndex="-1"
              className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight text-neutral-900 max-w-3xl"
            >
              I'm {profile.name}. I work on robots — from perception to control.
            </h1>
            <div className="mt-8 space-y-5 text-base sm:text-lg text-neutral-700 leading-relaxed">
              {profile.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 border-b border-neutral-200">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
          <div className="sm:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Education
            </div>
          </div>
          <ul className="sm:col-span-9 space-y-8">
            {profile.education.map((e) => (
              <li key={e.org + e.year} className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-4 text-sm text-neutral-500 tabular-nums">
                  {e.year}
                </div>
                <div className="col-span-12 sm:col-span-8">
                  <div className="font-serif text-lg text-neutral-900">
                    {e.org}
                  </div>
                  <p className="mt-1 text-neutral-600">{e.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16 border-b border-neutral-200">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
          <div className="sm:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Experience
            </div>
          </div>
          <ul className="sm:col-span-9 space-y-8">
            {profile.experience.map((e) => (
              <li key={e.role + e.org} className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-4 text-sm text-neutral-500 tabular-nums">
                  {e.year}
                </div>
                <div className="col-span-12 sm:col-span-8">
                  <div className="font-serif text-xl text-neutral-900">
                    {e.role}
                    <span className="text-neutral-500"> · {e.org}</span>
                  </div>
                  <p className="mt-1 text-neutral-600">{e.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 border-b border-neutral-200">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
          <div className="sm:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Skills
            </div>
          </div>
          <div className="sm:col-span-9 space-y-6">
            {Object.entries(profile.skills).map(([group, items]) => (
              <div key={group}>
                <div className="text-sm text-neutral-500 mb-2">{group}</div>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <span
                      key={s}
                      className="text-sm text-neutral-700 border border-neutral-200 rounded-full px-3 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coursework */}
      <section className="py-16 border-b border-neutral-200">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
          <div className="sm:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Relevant coursework
            </div>
          </div>
          <div className="sm:col-span-9 space-y-5">
            {Object.entries(profile.coursework).map(([group, list]) => (
              <div key={group}>
                <div className="text-sm text-neutral-500 mb-1">{group}</div>
                <p className="text-neutral-700 leading-relaxed">{list}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-16 border-b border-neutral-200">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
          <div className="sm:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Languages
            </div>
          </div>
          <ul className="sm:col-span-9 space-y-2">
            {profile.languages.map((l) => (
              <li key={l.name} className="flex items-baseline gap-3">
                <span className="font-serif text-lg text-neutral-900">
                  {l.name}
                </span>
                <span className="text-sm text-neutral-500">{l.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
          <div className="sm:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Contact
            </div>
          </div>
          <div className="sm:col-span-9">
            <h3 className="font-serif text-2xl text-neutral-900">
              Easiest by email — happy to chat about robotics, controls, or
              research collaborations.
            </h3>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-neutral-900 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition"
              >
                <Mail className="w-4 h-4" />
                {profile.email}
              </a>
              <span className="inline-flex items-center gap-2 text-neutral-500 text-sm">
                <Phone className="w-4 h-4" />
                {profile.phone}
              </span>
            </div>
            <div className="mt-8 flex gap-4">
              {profile.socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition"
                  >
                    {Icon ? <Icon className="w-4 h-4" /> : null}
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


/* ---------------------------------- Root ---------------------------------- */

export default function Portfolio() {
  const [view, setView] = useState({ page: "home" });
  const selectedProject =
    view.page === "project"
      ? projects.find((project) => project.id === view.id) ?? projects[0]
      : null;
  const navigate = (page) => setView({ page });
  const openProject = (project) =>
    setView({ page: "project", id: project.id });
  const selectedProjectIndex = selectedProject
    ? projects.findIndex((project) => project.id === selectedProject.id)
    : -1;
  const nextProject = selectedProject
    ? projects[(selectedProjectIndex + 1) % projects.length]
    : null;
  const viewKey = selectedProject ? `project:${selectedProject.id}` : view.page;
  const previousViewKeyRef = useRef(viewKey);

  useEffect(() => {
    if (previousViewKeyRef.current === viewKey) return;
    previousViewKeyRef.current = viewKey;

    document.title = selectedProject
      ? `${selectedProject.title} — Edward Wang`
      : view.page === "about"
        ? "About — Edward Wang"
        : "Edward Wang — Robotics, Agentic AI & AI for Science";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const frame = window.requestAnimationFrame(() => {
      document.querySelector("#main-content h1")?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [viewKey, view.page, selectedProject]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
      <SiteChrome view={view.page} onNavigate={navigate}>
        {view.page === "home" && <HomePage onOpenProject={openProject} />}
        {selectedProject && (
          <ProjectPage
            project={selectedProject}
            nextProject={nextProject}
            onBack={() => navigate("home")}
            onOpenProject={openProject}
          />
        )}
        {view.page === "about" && <About />}
      </SiteChrome>
    </div>
  );
}
