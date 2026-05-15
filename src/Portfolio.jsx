import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Github,
  Mail,
  Linkedin,
  ExternalLink,
  Phone,
} from "lucide-react";

/**
 * Edward Wang — robotics & controls portfolio.
 * Single React component, state-based routing between three views:
 *   - home       : hero + selected work index
 *   - project    : per-project detail page
 *   - about      : bio, education, experience, skills, contact
 *
 * Data lives in `profile` and `projects` at the top of this file.
 */

const profile = {
  name: "Edward Wang",
  initials: "EW",
  role: "Robotics & controls engineer",
  location: "La Jolla, CA · Open to robotics internships & research collabs",
  tagline:
    "ECE student building responsive, expressive robots — from perception and state estimation to control tuning and real-world hardware debugging.",
  bio: [
    "I'm an Electrical and Computer Engineering student at UC San Diego focused on robotics, control systems, and intelligent physical systems. I'm continuing into the M.S. program in Intelligent Systems, Robotics & Control in Fall 2026.",
    "My work sits at the seam between perception and motion: ROS/ROS2, robotic arm operation, sensor fusion, state estimation, and the long tail of bring-up problems that happen when simulation meets hardware — calibration, latency, drift, execution mismatch.",
    "I like robots that feel considered. Outside of coursework I work in the Liangfang Zhang Lab on machine-learning support for drug-delivery research, and I previously interned at c12.ai building computer-vision-driven robotic-arm workflows for automated laboratory operations.",
  ],
  email: "wanghanqing66@gmail.com",
  phone: "+1 (650) 537-7182",
  socials: [
    { label: "GitHub", href: "https://github.com/Edwardwang66", icon: Github },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/edward-wang/", icon: Linkedin },
    { label: "Email", href: "mailto:wanghanqing66@gmail.com", icon: Mail },
  ],
  education: [
    {
      year: "Sep 2026 — Jun 2027 (Expected)",
      org: "University of California, San Diego",
      note: "M.S. Electrical and Computer Engineering — Intelligent Systems, Robotics & Control",
    },
    {
      year: "Sep 2024 — Jun 2026",
      org: "University of California, San Diego",
      note: "B.S. Electrical and Computer Engineering",
    },
    {
      year: "Sep 2022 — May 2024",
      org: "Diablo Valley College",
      note: "A.S. Computer Science",
    },
  ],
  experience: [
    {
      year: "Oct 2024 — Present",
      role: "Undergraduate Researcher",
      org: "Liangfang Zhang's Lab, UC San Diego",
      note: "Applying machine-learning methods to support nanoparticle and cell-membrane selection for drug-delivery research, working alongside PhD researchers to reproduce and modify experimental workflows.",
    },
    {
      year: "Jun 2024 — Aug 2024",
      role: "Engineering Intern",
      org: "c12.ai · Pudong, Shanghai",
      note: "Computer-vision-driven liquid measurement, ROS-based robotic-arm motion planning, dual-camera localization, and simulation-to-hardware iteration for automated lab operations.",
    },
  ],
  skills: {
    "Robotics & Controls": [
      "ROS / ROS2",
      "Motion control",
      "Path planning",
      "Robotic arm control",
      "Sensor fusion",
      "State estimation",
      "Autonomous systems",
    ],
    Programming: ["Python", "C / C++", "MATLAB", "Java", "JavaScript", "Shell", "LaTeX"],
    "Simulation & Modeling": ["Gazebo", "URDF", "Robotics simulation", "Virtual env. setup"],
    "Hardware & Embedded": [
      "Embedded systems",
      "Digital logic design",
      "Computer architecture",
      "FPGA / SystemVerilog",
      "Sensor integration",
    ],
    "AI & Perception": [
      "Computer vision",
      "OpenCV",
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "NumPy",
      "Pandas",
    ],
    Tools: ["Git", "Docker", "Linux / Ubuntu", "REST APIs", "Vim"],
  },
  coursework: {
    "Robotics & AI":
      "ECE 276A Sensing and Estimation in Robotics · ECE 148 Introduction to Autonomous Vehicles · ECE 176 Deep Learning and Applications",
    "Computer Vision": "CSE 152A/B Introduction to Computer Vision",
    "Systems & Hardware":
      "ECE 111 Advanced Digital Design · CSE 141 Computer Architecture · CSE 141L Computer Architecture Project · CSE 140 Digital Systems Design",
    "Software Engineering": "CSE 110 Software Engineering · CSE 100 Advanced Data Structures",
  },
  languages: [
    { name: "Chinese", level: "Native / bilingual" },
    { name: "English", level: "Native / bilingual" },
  ],
};

const projects = [
  {
    id: "off-road-vehicle",
    no: "01",
    year: "2025",
    title: "1/5 Scale Autonomous Off-Road Vehicle",
    role: "Autonomy stack · Sensing, planning & control",
    tags: ["Autonomous vehicles", "ROS", "Perception"],
    summary:
      "Full autonomy stack for a 1/5 scale off-road vehicle — onboard compute, camera perception, GNSS, and actuation — built and tested end-to-end at UCSD.",
    cover: "from-neutral-900 via-neutral-700 to-neutral-400",
    context: "UC San Diego · ECE 191 Capstone",
    overview:
      "A team build of a 1/5 scale autonomous off-road vehicle. I worked across sensing, planning, and control to bring up the autonomy stack on real hardware and test it on outdoor courses.",
    challenge:
      "Stitch camera perception, GNSS, and vehicle actuation into a reliable real-time loop on an off-road platform where surfaces, lighting, and connectivity all vary. Many of the failure modes only appear once the vehicle is moving.",
    approach:
      "Built on DonkeyCar and ROS-based workflows for path recording, path following, and live actuation. Isolated integration problems by separating sensing, planning, and control rigs, then re-integrating with consistent message contracts. Iterated quickly between bench tests and field runs to harden the system.",
    outcome:
      "Reliable path-following behavior on recorded routes. Documented bring-up procedure and debugging playbook now used by the next team rotation.",
    stack: ["ROS", "DonkeyCar", "Python", "OpenCV", "GNSS", "Linux"],
    links: [],
    gallery: [
      "from-stone-200 to-stone-50",
      "from-neutral-300 to-neutral-100",
      "from-zinc-200 to-zinc-50",
    ],
    media: {
      type: "images",
      coverImage: "/ece191/1.png",
      files: [
        "/ece191/2.png",
        "/ece191/3.png",
        "/ece191/4.png",
      ],
    },
  },
  {
    id: "lab-robotic-arm",
    no: "02",
    year: "2024",
    title: "Vision-Guided Robotic Arm for Automated Lab Operations",
    role: "Engineering Intern · Perception + motion integration",
    tags: ["Robotic arm", "Computer vision", "ROS"],
    summary:
      "Computer-vision-based liquid measurement and dual-camera localization, integrated into ROS-based robotic-arm workflows at c12.ai.",
    cover: "from-stone-700 via-stone-500 to-stone-300",
    context: "c12.ai · Pudong, Shanghai · Summer 2024",
    overview:
      "Three-month internship building the perception-to-motion glue for a lab-automation robotic arm. The goal was to make routine wet-lab operations — liquid handling, plate placement — repeatable without an operator in the loop.",
    challenge:
      "Tie noisy real-world perception to precise robotic-arm motion under tight tolerances. Latency between perception and execution, fixed-vs-arm-mounted camera disagreement, and calibration drift all surfaced during hardware testing.",
    approach:
      "Built a dual-camera localization pipeline combining a fixed overhead view with an arm-mounted camera for close-range pose refinement. Operated and tested the arm via ROS, debugging perception, planning, and execution stages together rather than in isolation. Recreated the cell in a virtual simulation environment so iteration didn't depend on hardware availability.",
    outcome:
      "Improved positioning accuracy on automated lab tasks and a documented sim-to-hardware workflow for new operators. Wrote up failure modes (calibration, localization error, execution mismatch, perception-motion latency) as an internal debugging guide.",
    stack: ["ROS", "Python", "OpenCV", "URDF", "Gazebo-style sim", "Robotic arm"],
    links: [],
    gallery: [
      "from-amber-100 to-stone-100",
      "from-neutral-400 to-neutral-200",
      "from-stone-300 to-stone-100",
    ],
    media: {
      type: "mixed",
      coverImage: "/c12.ai/1.JPG",
      items: [
        { type: "video", src: "/c12.ai/IMG_1671.mov", label: "Lab operations demo" },
        { type: "video", src: "/c12.ai/IMG_1672.mov", label: "Robotic arm in action" },
      ],
    },
  },
  {
    id: "state-estimation",
    no: "03",
    year: "2025",
    title: "Sensing and State Estimation in Robotics",
    role: "Course project · Estimation algorithms",
    tags: ["State estimation", "Sensor fusion", "Kalman filtering"],
    summary:
      "Implementations of pose estimation, sensor fusion, and Kalman-style filters on noisy IMU and observation data — the math behind robots that know where they are.",
    cover: "from-zinc-800 via-zinc-600 to-zinc-400",
    context: "UC San Diego · ECE 276A",
    overview:
      "Coursework that pushed me into the probabilistic core of robotics: how a system maintains a belief about its own state when every sensor lies a little.",
    challenge:
      "Estimate the pose of a moving system from noisy IMU and observation data, accounting for drift, bias, and uncertainty over long runs.",
    approach:
      "Worked with robot motion and observation models to implement filtering pipelines — prediction from motion model, correction from observations — and tuned for stability under realistic noise profiles. Compared filter behavior across synthetic and recorded data.",
    outcome:
      "Working implementations of the core estimation routines plus an intuition for when a filter is failing because of modeling, tuning, or data — useful in every hardware project I've touched since.",
    stack: ["Python", "NumPy", "Probabilistic modeling", "IMU data", "MATLAB"],
    links: [],
    gallery: [
      "from-slate-300 to-slate-100",
      "from-neutral-300 to-neutral-100",
      "from-zinc-300 to-zinc-100",
    ],
    media: {
      type: "pdfs",
      coverImage: "/ece276a/1.png",
      files: [
        { name: "PR1 - Pose Estimation", src: "/ece276a/ece276_pr1.pdf" },
        { name: "PR2 - Sensor Fusion", src: "/ece276a/pr2.pdf" },
        { name: "PR3 - State Estimation Report", src: "/ece276a/pr3_report.pdf" },
      ],
    },
  },
  {
    id: "drug-delivery-ml",
    no: "04",
    year: "2024 — Now",
    title: "ML-Supported Nanoparticle & Cell-Membrane Selection",
    role: "Undergraduate Researcher",
    tags: ["Applied ML", "Research", "Drug delivery"],
    summary:
      "Machine-learning methods supporting nanoparticle and cell-membrane selection for drug-delivery research in the Liangfang Zhang Lab.",
    cover: "from-stone-800 via-stone-600 to-stone-400",
    context: "Liangfang Zhang's Lab · UC San Diego",
    overview:
      "Ongoing undergraduate research at the intersection of nanomedicine and applied ML. The lab develops biomimetic nanoparticles; I work on the data-driven side of choosing membrane–particle combinations.",
    challenge:
      "Make data-driven recommendations in a domain where datasets are small, experiments are slow, and validation has to round-trip through real lab work.",
    approach:
      "Collaborate with PhD researchers to reproduce and adapt experimental workflows so the ML side stays grounded in what the wet-lab can actually validate. Iterate on candidate selection with experimental constraints in the loop rather than as an afterthought.",
    outcome:
      "Ongoing project; contributing to a multidisciplinary team across engineering, biology, and data-driven optimization.",
    stack: ["Python", "Scikit-learn", "PyTorch", "Pandas", "Jupyter"],
    links: [],
    gallery: [
      "from-rose-100 to-stone-50",
      "from-stone-200 to-stone-50",
      "from-orange-100 to-amber-50",
    ],
  },
  {
    id: "embedded-digital",
    no: "05",
    year: "2024 — 2025",
    title: "Embedded & Digital Control Systems",
    role: "Course projects · Hardware design",
    tags: ["SystemVerilog", "FPGA", "Embedded"],
    summary:
      "Hardware-oriented systems in SystemVerilog — FSMs, datapaths, memory modules, and verification — the low-level layer underneath every robot I work on.",
    cover: "from-neutral-700 via-neutral-500 to-neutral-300",
    context: "UC San Diego · ECE / CSE Coursework",
    overview:
      "A series of projects across ECE 111, CSE 140, and CSE 141L covering digital design, computer architecture, and verification — building the low-level intuition I lean on when robotics work touches actuator control logic or real-time behavior.",
    challenge:
      "Move from clean spec to working hardware: handle timing, state, and edge cases in a way that survives waveform-level inspection.",
    approach:
      "Designed and tested systems with finite state machines, datapaths, and memory modules in SystemVerilog. Built debugging workflows around waveform inspection, timing analysis, and iterative verification using simulation testbenches.",
    outcome:
      "Low-level systems experience that transfers directly to embedded robotics work — knowing where a bug is most likely to live when the simulation says one thing and the board says another.",
    stack: ["SystemVerilog", "FPGA", "Testbenches", "Waveform analysis"],
    links: [],
    gallery: [
      "from-slate-300 to-slate-100",
      "from-stone-300 to-stone-100",
      "from-neutral-300 to-neutral-100",
    ],
  },
];

/* --------------------------------- helpers -------------------------------- */

function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

/* ----------------------------------- UI ----------------------------------- */

function Nav({ view, go }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <button
          onClick={() => go({ page: "home" })}
          className="flex items-center gap-3 text-sm tracking-tight"
        >
          <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-medium">
            {profile.initials}
          </span>
          <span className="font-medium">{profile.name}</span>
        </button>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink
            label="Work"
            active={view.page === "home" || view.page === "project"}
            onClick={() => go({ page: "home" })}
          />
          <NavLink
            label="About"
            active={view.page === "about"}
            onClick={() => go({ page: "about" })}
          />
          <a
            href={`mailto:${profile.email}`}
            className="ml-2 hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs hover:bg-neutral-700 transition"
          >
            Get in touch <ArrowUpRight className="w-3 h-3" />
          </a>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "px-3 py-1.5 rounded-full transition",
        active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
      )}
    >
      {label}
    </button>
  );
}

/* ----------------------------------- Home ---------------------------------- */

function Home({ go }) {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-10">
      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-20 sm:pb-28">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {profile.location}
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] tracking-tight text-neutral-900 max-w-3xl">
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

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
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight text-neutral-900 max-w-3xl">
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
          className="mt-12 aspect-[16/9] w-full rounded-lg object-contain"
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
          {project.gallery.map((g, i) => (
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
        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight text-neutral-900 max-w-3xl">
          I'm {profile.name}. I work on robots — from perception to control.
        </h1>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-12 gap-8 text-neutral-700 leading-relaxed">
          <div className="sm:col-span-3" />
          <div className="sm:col-span-9 space-y-5 text-base sm:text-lg">
            {profile.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
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
              {profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition"
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* --------------------------------- Footer --------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          © {new Date().getFullYear()} {profile.name}. Built with care.
        </div>
        <div className="flex items-center gap-4">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="hover:text-neutral-900 transition"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------- Root ---------------------------------- */

export default function Portfolio() {
  const [view, setView] = useState({ page: "home" });

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
      <Nav view={view} go={setView} />
      {view.page === "home" && <Home go={setView} />}
      {view.page === "project" && (
        <ProjectDetail id={view.id} go={setView} />
      )}
      {view.page === "about" && <About />}
      <Footer />
    </div>
  );
}
