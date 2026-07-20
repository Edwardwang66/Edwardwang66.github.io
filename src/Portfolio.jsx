import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Mail,
  ExternalLink,
  Phone,
} from "lucide-react";
import { socialIcons } from "./components/socialIcons.js";
import SiteChrome from "./components/SiteChrome.jsx";
import { profile, projects } from "./data/portfolio.js";

/**
 * Edward Wang — robotics & controls portfolio.
 * Single React component, state-based routing between three views:
 *   - home       : hero + selected work index
 *   - project    : per-project detail page
 *   - about      : bio, education, experience, skills, contact
 *
 * Content data lives in `src/data/portfolio.js`.
 */

/* --------------------------------- helpers -------------------------------- */

function classNames(...c) {
  return c.filter(Boolean).join(" ");
}


/* ----------------------------------- Home ---------------------------------- */

function Home({ go }) {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-10">
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 min-[520px]:grid-cols-[minmax(0,1fr)_10rem] sm:grid-cols-3 gap-8 sm:gap-12 items-start">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {profile.location}
            </div>
            <h1
              tabIndex="-1"
              className="font-serif text-4xl sm:text-6xl leading-[1.05] tracking-tight text-neutral-900 max-w-3xl"
            >
              {profile.tagline}
            </h1>
            <p className="mt-8 text-neutral-500 max-w-xl text-base sm:text-lg leading-relaxed">
              {profile.role}. Hands-on with ROS/ROS2, perception-to-motion
              integration, sensor fusion, and the messy parts of moving from
              simulation to hardware.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById("work");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm hover:bg-neutral-700 transition"
              >
                Selected work
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => go({ page: "about" })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 text-neutral-900 text-sm hover:border-neutral-900 transition"
              >
                About me
              </button>
            </div>
            <div className="mt-8 flex gap-4">
              {profile.socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition"
                  >
                    {Icon ? <Icon className="w-5 h-5" /> : null}
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="sm:col-span-1 flex items-start justify-center min-[520px]:justify-end pt-2 sm:pt-8">
            <img
              src="/IMG_9036.JPG"
              alt="Edward Wang"
              className="w-40 h-40 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Work index */}
      <section id="work" className="border-t border-neutral-200 pt-12 pb-24">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Selected work
          </h2>
          <span className="text-xs text-neutral-400">
            {projects.length} projects · Robotics, controls, perception
          </span>
        </div>
        <ul className="divide-y divide-neutral-200">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => go({ page: "project", id: p.id })}
                className="group w-full text-left py-6 grid grid-cols-12 gap-4 items-center hover:bg-neutral-50/60 transition rounded-md px-2 -mx-2"
              >
                <span className="col-span-1 text-xs text-neutral-400 tabular-nums">
                  {p.no}
                </span>
                <div className="col-span-7 sm:col-span-6">
                  <div className="font-serif text-lg sm:text-xl text-neutral-900 leading-snug">
                    {p.title}
                  </div>
                  <div className="mt-1 text-sm text-neutral-500">{p.role}</div>
                </div>
                <div className="col-span-3 hidden sm:flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-xs text-neutral-500 border border-neutral-200 rounded-full px-2 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="col-span-3 sm:col-span-1 text-right text-xs text-neutral-400 tabular-nums">
                  {p.year}
                </span>
                <span className="col-span-1 flex justify-end">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-neutral-200 py-20">
        <div className="max-w-2xl">
          <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 leading-tight">
            Looking for a robotics or controls intern who can take a system from
            simulation to hardware? Let's talk.
          </h3>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-flex items-center gap-2 text-sm text-neutral-900 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition"
          >
            {profile.email}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </main>
  );
}

/* --------------------------------- Project --------------------------------- */

function ProjectDetail({ id, go }) {
  const project = projects.find((p) => p.id === id) ?? projects[0];
  const idx = projects.findIndex((p) => p.id === project.id);
  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-10 pb-24">
      <button
        onClick={() => go({ page: "home" })}
        className="mt-10 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> All work
      </button>

      {/* Header */}
      <header className="pt-12 pb-10 border-b border-neutral-200">
        <div className="flex items-center gap-3 text-xs text-neutral-500 uppercase tracking-[0.2em]">
          <span>{project.no}</span>
          <span>·</span>
          <span>{project.year}</span>
          <span>·</span>
          <span>{project.context}</span>
        </div>
        <h1
          tabIndex="-1"
          className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight text-neutral-900 max-w-3xl"
        >
          {project.title}
        </h1>
        <p className="mt-5 text-neutral-500 max-w-2xl text-base sm:text-lg">
          {project.summary}
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <Meta label="Role" value={project.role} />
          <Meta label="Year" value={project.year} />
          <Meta label="Stack" value={project.stack.slice(0, 3).join(", ")} />
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
              Links
            </div>
            <div className="flex flex-col gap-1">
              {project.links.length === 0 && (
                <span className="text-neutral-400 text-xs">
                  Available on request
                </span>
              )}
              {project.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="inline-flex items-center gap-1 text-neutral-900 hover:underline"
                >
                  {l.label} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Cover */}
      {project.media?.coverImage ? (
        <img
          src={project.media.coverImage}
          alt="Project cover"
          className={project.media.type === "pr-reports" ? "mt-12 w-64 h-64 rounded-lg object-contain mx-auto" : "mt-12 aspect-[16/9] w-full rounded-lg object-contain"}
        />
      ) : project.media && project.media.type === "images" && project.media.files[0] ? (
        <img
          src={project.media.files[0]}
          alt="Project cover"
          className="mt-12 aspect-[16/9] w-full rounded-lg object-contain"
        />
      ) : project.media && project.media.type === "mixed" ? (
        (() => {
          const firstImage = project.media.items?.find(item => item.type === "image");
          return firstImage ? (
            <img
              src={firstImage.src}
              alt="Project cover"
              className="mt-12 aspect-[16/9] w-full rounded-lg object-contain"
            />
          ) : (
            <div
              className={classNames(
                "mt-12 aspect-[16/9] w-full rounded-lg bg-gradient-to-br",
                project.cover
              )}
            />
          );
        })()
      ) : (
        <div
          className={classNames(
            "mt-12 aspect-[16/9] w-full rounded-lg bg-gradient-to-br",
            project.cover
          )}
        />
      )}

      {/* Body */}
      <article className="mt-16 grid grid-cols-1 sm:grid-cols-12 gap-8">
        <div className="sm:col-span-3">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Overview
          </div>
        </div>
        <p className="sm:col-span-9 text-neutral-700 leading-relaxed text-base sm:text-lg">
          {project.overview}
        </p>
      </article>

      <article className="mt-16 grid grid-cols-1 sm:grid-cols-12 gap-8">
        <div className="sm:col-span-3">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Challenge
          </div>
        </div>
        <p className="sm:col-span-9 text-neutral-700 leading-relaxed">
          {project.challenge}
        </p>
      </article>

      <article className="mt-16 grid grid-cols-1 sm:grid-cols-12 gap-8">
        <div className="sm:col-span-3">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Approach
          </div>
        </div>
        <p className="sm:col-span-9 text-neutral-700 leading-relaxed">
          {project.approach}
        </p>
      </article>

      {/* Gallery */}
      {!project.media && (
        <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {project.gallery?.map((g, i) => (
            <div
              key={i}
              className={classNames(
                "aspect-[4/5] rounded-md bg-gradient-to-br",
                g
              )}
            />
          ))}
        </section>
      )}

      {/* Media Section */}
      {project.media && (
        <section className="mt-16">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-8">
            {project.media.type === "pdfs" ? "Research Reports" : "Project Documentation"}
          </div>

          {project.media.type === "images" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.media.files.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Project visual ${i + 1}`}
                  className="w-full rounded-md object-cover aspect-[4/5]"
                />
              ))}
            </div>
          )}

          {project.media.type === "mixed" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.media.items.map((item, i) => (
                  <div key={i} className="rounded-md overflow-hidden bg-neutral-100">
                    {item.type === "video" && (
                      <video
                        controls
                        muted
                        autoPlay
                        className="w-full h-full object-cover aspect-video"
                      >
                        <source src={item.src} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {item.type === "image" && (
                      <img
                        src={item.src}
                        alt={item.label}
                        className="w-full h-full object-cover aspect-video"
                      />
                    )}
                    {item.label && (
                      <div className="p-3 text-xs text-neutral-600 bg-neutral-50">
                        {item.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {project.media.pdfs && (
                <div className="mt-8 space-y-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Research Reports</div>
                  {project.media.pdfs.map((file, i) => (
                    <div key={i} className="border border-neutral-200 rounded-md overflow-hidden bg-neutral-50">
                      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-100">
                        <div className="text-sm font-medium text-neutral-900">{file.name}</div>
                      </div>
                      <embed
                        src={file.src + "#toolbar=1&navpanes=0"}
                        type="application/pdf"
                        width="100%"
                        height="600px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {project.media.type === "pdfs" && (
            <div className="space-y-6">
              {project.media.files.map((file, i) => (
                <div key={i} className="border border-neutral-200 rounded-md overflow-hidden bg-neutral-50">
                  <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-100">
                    <div className="text-sm font-medium text-neutral-900">{file.name}</div>
                  </div>
                  <embed
                    src={file.src + "#toolbar=1&navpanes=0"}
                    type="application/pdf"
                    width="100%"
                    height="600px"
                  />
                </div>
              ))}
            </div>
          )}

          {project.media.type === "pr-reports" && (
            <div className="space-y-16">
              {project.media.reports.map((report, ri) => (
                <div key={ri}>
                  <h3 className="font-serif text-xl text-neutral-900 mb-8">{report.name}</h3>

                  {/* GIF sections */}
                  {report.sections.map((section, si) => (
                    <div key={si} className="mb-10">
                      <div className="text-xs uppercase tracking-[0.15em] text-neutral-400 mb-4">
                        {section.label}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {section.gifs.map((gif, gi) => (
                          <div key={gi} className="rounded-md overflow-hidden bg-neutral-100 border border-neutral-200">
                            <img
                              src={gif.src}
                              alt={gif.label}
                              className="w-full object-contain"
                            />
                            <div className="px-3 py-2 text-xs text-neutral-500 bg-neutral-50">
                              {gif.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Embedded PDF */}
                  <div className="border border-neutral-200 rounded-md overflow-hidden bg-neutral-50">
                    <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-100">
                      <div className="text-sm font-medium text-neutral-900">{report.pdf.name}</div>
                    </div>
                    <embed
                      src={report.pdf.src + "#toolbar=1&navpanes=0&scrollbar=1"}
                      type="application/pdf"
                      width="100%"
                      height="700px"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <article className="mt-16 grid grid-cols-1 sm:grid-cols-12 gap-8">
        <div className="sm:col-span-3">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Outcome
          </div>
        </div>
        <p className="sm:col-span-9 text-neutral-700 leading-relaxed">
          {project.outcome}
        </p>
      </article>

      {/* Stack */}
      <section className="mt-16 border-t border-neutral-200 pt-10">
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
          Stack
        </div>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="text-sm text-neutral-700 border border-neutral-200 rounded-full px-3 py-1"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Next */}
      <section className="mt-20 border-t border-neutral-200 pt-10">
        <button
          onClick={() => go({ page: "project", id: next.id })}
          className="group w-full flex items-center justify-between text-left"
        >
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Next project
            </div>
            <div className="mt-2 font-serif text-2xl sm:text-3xl text-neutral-900 group-hover:text-neutral-600 transition">
              {next.title}
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition" />
        </button>
      </section>
    </main>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-neutral-900">{value}</div>
    </div>
  );
}

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
        {view.page === "home" && <Home go={setView} />}
        {view.page === "project" && (
          <ProjectDetail id={view.id} go={setView} />
        )}
        {view.page === "about" && <About />}
      </SiteChrome>
    </div>
  );
}
