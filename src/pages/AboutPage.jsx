import Portrait from "../components/Portrait.jsx";
import { socialIcons } from "../components/socialIcons.js";
import { profile } from "../data/portfolio.js";

function SectionHeading({ id, children }) {
  return (
    <h2 id={id} className="about-section-title">
      {children}
    </h2>
  );
}

export default function AboutPage() {
  const telephoneHref = `tel:${profile.phone.replace(/[^\d+]/g, "")}`;

  return (
    <main className="page-shell about-page" aria-labelledby="about-title">
      <section className="about-opening">
        <div className="about-opening-copy">
          <p className="about-kicker">About</p>
          <h1 id="about-title" tabIndex="-1" className="font-serif">
            {profile.aboutHeading}
          </h1>
          <div className="about-bio">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <Portrait size="about" />
      </section>

      <section className="about-section" aria-labelledby="about-education-title">
        <SectionHeading id="about-education-title">Education</SectionHeading>
        <div className="about-records">
          {profile.education.map((record) => (
            <article className="about-record" key={`${record.org}:${record.year}`}>
              <p className="about-record-date">{record.year}</p>
              <div>
                <h3 className="font-serif">{record.org}</h3>
                <p>{record.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="about-experience"
        className="about-section"
        aria-labelledby="about-experience-title"
      >
        <SectionHeading id="about-experience-title">Experience</SectionHeading>
        <div className="about-records">
          {profile.experience.map((record) => (
            <article className="about-record experience-record" key={`${record.org}:${record.year}`}>
              <p className="about-record-date">{record.year}</p>
              <div>
                <h3 className="font-serif">{record.org}</h3>
                <p className="about-record-role">{record.role}</p>
                {record.location ? (
                  <p className="about-record-location">{record.location}</p>
                ) : null}
                <p className="about-record-note">{record.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="about-capabilities"
        className="about-section"
        aria-labelledby="about-capabilities-title"
      >
        <SectionHeading id="about-capabilities-title">Capabilities</SectionHeading>
        <div className="capability-groups">
          {Object.entries(profile.skills).map(([group, items]) => (
            <section className="capability-group" key={group}>
              <h3>{group}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-coursework-title">
        <SectionHeading id="about-coursework-title">Selected coursework</SectionHeading>
        <div className="coursework-groups">
          {Object.entries(profile.coursework).map(([group, courses]) => (
            <section key={group}>
              <h3>{group}</h3>
              <p>{courses}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-languages-title">
        <SectionHeading id="about-languages-title">Languages</SectionHeading>
        <ul className="language-list">
          {profile.languages.map((language) => (
            <li key={language.name}>
              <strong className="font-serif">{language.name}</strong>
              <span>{language.level}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section about-contact" aria-labelledby="about-contact-title">
        <SectionHeading id="about-contact-title">Contact</SectionHeading>
        <div className="contact-details">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={telephoneHref}>{profile.phone}</a>
          <ul aria-label="Profile links">
            {profile.socials.map((social) => {
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
      </section>
    </main>
  );
}
