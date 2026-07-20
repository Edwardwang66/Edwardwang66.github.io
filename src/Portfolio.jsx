import { useEffect, useRef, useState } from "react";
import SiteChrome from "./components/SiteChrome.jsx";
import { projects } from "./data/portfolio.js";
import AboutPage from "./pages/AboutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";

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
        {view.page === "about" && <AboutPage />}
      </SiteChrome>
    </div>
  );
}
