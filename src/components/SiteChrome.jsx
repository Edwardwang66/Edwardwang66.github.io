import { useEffect, useState } from "react";
import { profile } from "../data/portfolio.js";
import { useMediaPreference } from "../hooks/useMediaPreference.js";
import { socialIcons } from "./socialIcons.js";

export default function SiteChrome({ view, onNavigate, children }) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 4);
  const reducedTransparency = useMediaPreference(
    "(prefers-reduced-transparency: reduce)"
  );
  const increasedContrast = useMediaPreference("(prefers-contrast: more)");
  const workIsCurrent = view === "home" || view === "project";

  useEffect(() => {
    const update = () => {
      const next = window.scrollY > 4;
      setScrolled((current) => (current === next ? current : next));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header
        className="site-nav"
        data-scrolled={scrolled}
        data-reduced-transparency={reducedTransparency}
        data-increased-contrast={increasedContrast}
      >
        <div className="site-nav-inner">
          <button
            type="button"
            className="brand-control compact-control"
            aria-label="Edward Wang — Work"
            onClick={() => onNavigate("home")}
          >
            <span className="brand-mark" aria-hidden="true">
              {profile.initials}
            </span>
            <span className="brand-name">{profile.name}</span>
          </button>
          <nav aria-label="Primary" className="primary-nav">
            <button
              type="button"
              className="nav-control compact-control"
              aria-current={workIsCurrent ? "page" : undefined}
              onClick={() => onNavigate("home")}
            >
              Work
            </button>
            <button
              type="button"
              className="nav-control compact-control"
              aria-current={view === "about" ? "page" : undefined}
              onClick={() => onNavigate("about")}
            >
              About
            </button>
          </nav>
        </div>
      </header>
      <div id="main-content" tabIndex="-1">
        {children}
      </div>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with care.
          </p>
          <ul aria-label="Social links">
            {profile.socials.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <li key={social.label}>
                  <a href={social.href} aria-label={social.label}>
                    {Icon ? <Icon aria-hidden="true" /> : null}
                    <span>{social.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </footer>
    </>
  );
}
