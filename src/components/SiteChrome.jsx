import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/portfolio.js";
import { socialIcons } from "./socialIcons.js";

const existingSocialLabels = new Set(["GitHub", "LinkedIn", "Email"]);

export default function SiteChrome({ view, onNavigate, children }) {
  const workIsCurrent = view === "home" || view === "project";
  const existingSocials = profile.socials.filter(({ label }) =>
    existingSocialLabels.has(label)
  );

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-nav">
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
            <a className="contact-control" href={`mailto:${profile.email}`}>
              Get in touch <ArrowUpRight aria-hidden="true" />
            </a>
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
            {existingSocials.map((social) => {
              const Icon = socialIcons[social.icon];
              const external = social.href.startsWith("http");
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                  >
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
