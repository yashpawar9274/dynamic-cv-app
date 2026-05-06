import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function useTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () =>
      setT(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date()) + " IST"
      );
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return t;
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-paper/70 border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-14 flex items-center justify-between">
        <a href="#top" className="label">Yash—Pawar©26</a>
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="label hover:opacity-50 transition-opacity">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="label group flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse" />
          Available
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const time = useTime();
  return (
    <section id="top" className="relative pt-28 pb-12 md:pt-40 md:pb-20 grain">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center justify-between label mb-10 md:mb-16 animate-[fade-in_0.6s_ease-out_both]">
          <span>Portfolio / 2026 — Vol. 01</span>
          <span className="hidden md:inline">{time || "—"}</span>
          <span>Boisar, IN · 19.49°N</span>
        </div>

        <h1 className="display-mega animate-[rise_0.9s_cubic-bezier(.2,.7,.2,1)_both]">
          Yash<br />
          <span className="italic">Pawar.</span>
        </h1>

        <div className="mt-10 md:mt-16 grid md:grid-cols-12 gap-8 border-t hairline pt-8">
          <div className="md:col-span-4 label">[ Discipline ]</div>
          <div className="md:col-span-8">
            <p className="text-2xl md:text-4xl font-serif leading-tight">
              Data analyst & full-stack builder shaping raw application logs into
              <em> decisions worth making.</em>
            </p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-8 border-t hairline pt-8">
          <div className="md:col-span-4 label">[ Currently ]</div>
          <div className="md:col-span-8 text-base md:text-lg max-w-2xl text-muted-foreground">
            B.Sc. Computer Science at Mumbai University · Freelance data work since 2022 · Open to
            entry-level Data Analyst roles where instinct meets evidence.
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Pattern recognition", "SQL", "Excel forensics", "Dashboards", "Anomaly hunting", "React", "Supabase", "Storytelling with data"];
  return (
    <div className="border-y hairline overflow-hidden py-6">
      <div className="flex gap-12 whitespace-nowrap animate-[marquee_40s_linear_infinite]">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="font-serif italic text-3xl md:text-5xl opacity-90">
            {it} <span className="not-italic font-sans text-xl mx-6 opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const PROJECTS = [
  {
    n: "01",
    title: "Fraud Guard",
    role: "Detection systems",
    stack: "React · Node · Supabase",
    blurb:
      "A monitoring layer that watches transactional behaviour for the kind of patterns humans miss until it's too late. Built to flag, not to scold.",
  },
  {
    n: "02",
    title: "Fuel Tracker",
    role: "Consumption analytics",
    stack: "HTML · CSS · JavaScript",
    blurb:
      "Distance, mileage, cost — folded into a single readable narrative. A small tool that taught me how much story a single column of numbers can carry.",
  },
  {
    n: "03",
    title: "LifeXS",
    role: "Behavioural data",
    stack: "JavaScript · Supabase",
    blurb:
      "Gamified productivity tracker. The point wasn't tasks — it was the data trail behind them, and what completion patterns reveal about focus.",
  },
];

function Work() {
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-16 border-b hairline pb-6">
          <div>
            <div className="label mb-3">§ 01 — Selected Work</div>
            <h2 className="font-serif text-5xl md:text-7xl">Things I've shipped.</h2>
          </div>
          <span className="label hidden md:block">2022 → 2026</span>
        </div>

        <ul>
          {PROJECTS.map((p) => (
            <li key={p.n} className="group border-b hairline">
              <a href="#contact" className="grid md:grid-cols-12 gap-6 py-10 md:py-14 items-baseline transition-colors hover:bg-ink hover:text-paper px-2 -mx-2">
                <div className="md:col-span-1 label opacity-60">{p.n}</div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-4xl md:text-6xl leading-none">
                    {p.title}
                  </h3>
                </div>
                <div className="md:col-span-2 label opacity-70">{p.role}</div>
                <div className="md:col-span-4 text-sm md:text-base leading-relaxed max-w-md">
                  {p.blurb}
                </div>
                <div className="md:col-span-1 text-right label opacity-60 group-hover:opacity-100">→</div>
              </a>
              <div className="px-2 pb-4 label opacity-50">{p.stack}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="label mb-10 opacity-60">§ 02 — About</div>
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <p className="font-serif text-3xl md:text-5xl leading-tight">
              I read data the way some people read rooms — looking for the
              <em> tell.</em> The outlier, the rhythm, the thing nobody named yet.
            </p>
            <p className="mt-10 text-base md:text-lg max-w-xl opacity-80 leading-relaxed">
              I'm a final-year Computer Science student in Mumbai who's spent the last
              three years quietly freelancing on real product data — user activity,
              transaction-like records, system logs. Less theory, more pattern. I build
              the apps too, which means I understand what the numbers are actually
              describing.
            </p>
          </div>
          <div className="md:col-span-5 md:border-l hairline md:pl-10 space-y-8">
            <Stat k="Years analysing" v="2.5+" />
            <Stat k="Apps shipped" v="3" />
            <Stat k="Certifications" v="04" />
            <Stat k="Coffee : insights" v="≈ 1:1" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between border-b hairline pb-3">
      <span className="label opacity-60">{k}</span>
      <span className="font-serif text-4xl">{v}</span>
    </div>
  );
}

const EXP = [
  { y: "Jun 2022 — Jan 2025", role: "Data Analyst", co: "Freelance", loc: "Remote", note: "Analysed user activity, transaction-like records and system logs across multiple web apps. Surfaced usage patterns and anomalies; built dashboard-style summaries that fed product decisions." },
  { y: "Jan 2022 — Dec 2022", role: "Team Lead", co: "Valmo", loc: "Boisar", note: "Operations leadership — coordination, throughput tracking, daily reporting." },
  { y: "Mar 2021 — Oct 2021", role: "Asst. Team Lead", co: "Ekart", loc: "Boisar", note: "Logistics floor work; first taste of operational metrics that mattered." },
];

const EDU = [
  { y: "2023 — 2026", t: "B.Sc. Computer Science", s: "Mumbai University" },
  { y: "2021 — 2023", t: "HSC", s: "SDSM College, Palghar" },
  { y: "— 2021", t: "SSC", s: "R.H. Save Vidyalaya, Tarapur" },
];

function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="label mb-10">§ 03 — Trajectory</div>
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <h3 className="font-serif text-4xl md:text-5xl mb-10">Experience</h3>
            <ul className="space-y-0">
              {EXP.map((e) => (
                <li key={e.role} className="grid grid-cols-12 gap-4 py-6 border-t hairline">
                  <div className="col-span-12 md:col-span-3 label opacity-60">{e.y}</div>
                  <div className="col-span-12 md:col-span-9">
                    <div className="font-serif text-2xl md:text-3xl">{e.role} <span className="opacity-50">— {e.co}</span></div>
                    <div className="label opacity-60 mt-1">{e.loc}</div>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-lg">{e.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5">
            <h3 className="font-serif text-4xl md:text-5xl mb-10">Education</h3>
            <ul>
              {EDU.map((e) => (
                <li key={e.t} className="py-5 border-t hairline">
                  <div className="label opacity-60">{e.y}</div>
                  <div className="font-serif text-2xl mt-1">{e.t}</div>
                  <div className="text-sm text-muted-foreground">{e.s}</div>
                </li>
              ))}
            </ul>

            <h3 className="font-serif text-4xl md:text-5xl mt-14 mb-6">Certifications</h3>
            <ul className="space-y-3">
              {[
                ["Foundations of Digital Marketing & Web Tech", "Google"],
                ["Azure Basics: Cloud Services & Deployment", "Microsoft Azure"],
                ["Intro to Cloud Computing & Azure Fundamentals", "Microsoft"],
                ["Cloud Computing Fundamentals", "Amazon Web Services"],
              ].map(([t, s]) => (
                <li key={t} className="flex items-baseline justify-between border-t hairline pt-3">
                  <span className="text-sm md:text-base max-w-xs">{t}</span>
                  <span className="label opacity-60 text-right">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const SKILLS = ["HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "Supabase", "Firebase", "Git", "Excel", "SQL (basic)", "Dashboards"];

function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 border-t hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="label mb-10">§ 04 — Toolkit</div>
        <h2 className="font-serif text-5xl md:text-7xl mb-12">The instruments.</h2>
        <ul className="flex flex-wrap gap-x-2 gap-y-4">
          {SKILLS.map((s, i) => (
            <li key={s} className="font-serif text-3xl md:text-5xl">
              {s}
              {i < SKILLS.length - 1 && <span className="mx-3 opacity-30">·</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-ink text-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="label mb-10 opacity-60">§ 05 — Get in touch</div>
        <h2 className="font-serif text-6xl md:text-9xl leading-none">
          Let's build something<br /><em>worth measuring.</em>
        </h2>
        <div className="mt-16 grid md:grid-cols-3 gap-10 border-t border-paper/20 pt-10">
          <a href="mailto:theyashpawar92@gmail.com" className="group">
            <div className="label opacity-60 mb-2">Email</div>
            <div className="font-serif text-2xl md:text-3xl group-hover:italic transition-all">theyashpawar92@gmail.com</div>
          </a>
          <a href="tel:+917385066631" className="group">
            <div className="label opacity-60 mb-2">Phone</div>
            <div className="font-serif text-2xl md:text-3xl group-hover:italic">+91 73850 66631</div>
          </a>
          <div>
            <div className="label opacity-60 mb-2">Based in</div>
            <div className="font-serif text-2xl md:text-3xl">Boisar, India</div>
          </div>
        </div>

        <footer className="mt-24 flex flex-col md:flex-row md:items-end justify-between gap-6 label opacity-60">
          <span>© 2026 Yash Pawar — All rights reserved.</span>
          <span>Set in Instrument Serif & Work Sans.</span>
          <span>v1.0 — handcrafted, not generated.</span>
        </footer>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="bg-paper text-ink">
      <Nav />
      <Hero />
      <Marquee />
      <Work />
      <About />
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
}
