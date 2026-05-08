import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AskMe } from "@/components/AskMe";

export const Route = createFileRoute("/")({
  component: Index,
});

const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "ai", label: "AI" },
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
              Data Analyst extracting insight from real-world data — with the
              <em> engineering instinct</em> to build the web tools and
              <em> AI workflows</em> that put those insights to work.
            </p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-8 border-t hairline pt-8">
          <div className="md:col-span-4 label">[ Currently ]</div>
          <div className="md:col-span-8 text-base md:text-lg max-w-2xl text-muted-foreground">
            B.Sc. Computer Science, Mumbai University · 2.5+ years freelancing on
            real product data · Open to entry-level Data Analyst roles.
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#work"
            className="group inline-flex items-center gap-3 bg-ink text-paper px-6 py-3 label hover:bg-ink/85 transition-colors"
          >
            View Projects
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="/resume.pdf"
            download
            className="group inline-flex items-center gap-3 border border-ink px-6 py-3 label hover:bg-ink hover:text-paper transition-colors"
          >
            Download Résumé
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Data analysis", "Pattern recognition", "Excel forensics", "SQL", "Dashboards", "Anomaly hunting", "React", "Node", "AI-assisted workflows"];
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
    role: "Behavioural analytics",
    stack: "React · Node · Supabase",
    problem: "Small platforms can't afford enterprise fraud tools, but still bleed from the same patterns.",
    data: "Synthetic + sampled transaction logs: amount, frequency, device fingerprint, session timing.",
    analysis: "Profiled normal user rhythms, then flagged statistical outliers — velocity spikes, off-hours bursts, mismatched geos.",
    outcome: "A lightweight monitoring layer that surfaces suspicious sessions for review instead of blocking blindly.",
  },
  {
    n: "02",
    title: "Fuel Tracker",
    role: "Consumption analytics",
    stack: "HTML · CSS · JavaScript",
    problem: "People underestimate vehicle running cost because no one ties distance, mileage and price together.",
    data: "User-logged refuels: odometer, litres, price-per-litre, date.",
    analysis: "Computed rolling mileage, cost-per-km trends, and seasonal drift in efficiency.",
    outcome: "A single readable narrative from a column of numbers — taught me how much story one dataset can carry.",
  },
  {
    n: "03",
    title: "LifeXS",
    role: "Behavioural data",
    stack: "JavaScript · Supabase",
    problem: "Productivity apps measure tasks; they don't measure the person.",
    data: "Task completion events: timestamp, category, duration, streak state.",
    analysis: "Studied completion patterns by hour and category to surface real focus windows vs. wishful scheduling.",
    outcome: "Gamified tracker where the data trail — not the to-do list — is the actual product.",
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

        <ul className="space-y-0">
          {PROJECTS.map((p) => (
            <li key={p.n} className="group border-b hairline transition-colors hover:bg-ink hover:text-paper">
              <div className="grid md:grid-cols-12 gap-6 py-10 md:py-14 px-2 -mx-2">
                <div className="md:col-span-1 label opacity-60">{p.n}</div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-4xl md:text-6xl leading-none">{p.title}</h3>
                  <div className="label mt-3 opacity-70">{p.role}</div>
                  <div className="label mt-1 opacity-50">{p.stack}</div>
                </div>
                <div className="md:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-5 text-sm md:text-[15px] leading-relaxed">
                  <Field k="Problem" v={p.problem} />
                  <Field k="Data" v={p.data} />
                  <Field k="Analysis" v={p.analysis} />
                  <Field k="Outcome" v={p.outcome} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="label opacity-60 mb-1">{k}</div>
      <div>{v}</div>
    </div>
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
              I work as a data analyst first — the rest of my stack exists so the
              <em> insight actually reaches someone.</em>
            </p>
            <p className="mt-10 text-base md:text-lg max-w-xl opacity-80 leading-relaxed">
              For two and a half years I've been quietly digging through real product
              data — user activity, transaction-like records, system logs — looking for
              the pattern, the outlier, the thing nobody named yet. Because I also
              build the apps these numbers come from, I understand what each column
              is actually describing, not just what its header says.
            </p>
            <p className="mt-6 text-base md:text-lg max-w-xl opacity-80 leading-relaxed">
              Web development and AI tooling are my supporting trades — they let me
              go from observation to a working dashboard, prototype, or automation in
              the same week. Confident with what I've shipped. Honest about what
              I'm still learning.
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
  {
    y: "Jun 2022 — Jan 2025",
    role: "Data Analyst",
    co: "Freelance",
    loc: "Remote",
    note: "Worked across multiple web apps cleaning and interrogating user activity, transaction-like records and system logs. Surfaced usage patterns and anomalies; turned them into dashboard-style summaries that fed product decisions and roadmap calls.",
  },
  {
    y: "Jan 2022 — Dec 2022",
    role: "Team Lead",
    co: "Valmo",
    loc: "Boisar",
    note: "Owned daily throughput tracking and reporting. First place I learned that operational data is only useful when it's read the same way by everyone in the room.",
  },
  {
    y: "Mar 2021 — Oct 2021",
    role: "Asst. Team Lead",
    co: "Ekart",
    loc: "Boisar",
    note: "Logistics floor. Tracked SLA breaches, sortation accuracy and load timing — first taste of metrics that change behaviour the moment you publish them.",
  },
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

const SKILL_GROUPS: { title: string; tag: string; items: string[] }[] = [
  {
    title: "Data Analysis",
    tag: "Primary",
    items: ["Excel (pivot, lookup, modelling)", "SQL (queries, joins, aggregations)", "Dashboarding", "Pattern & anomaly recognition", "Data cleaning"],
  },
  {
    title: "Web Development",
    tag: "Builder",
    items: ["JavaScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "Supabase", "Firebase", "HTML / CSS", "Git"],
  },
  {
    title: "AI & Tooling",
    tag: "Leverage",
    items: ["AI-assisted analysis & coding", "Prompt design for data tasks", "Learning ML fundamentals"],
  },
];

function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 border-t hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="label mb-10">§ 04 — Toolkit</div>
        <h2 className="font-serif text-5xl md:text-7xl mb-16">The instruments.</h2>
        <div className="grid md:grid-cols-3 gap-10 md:gap-14">
          {SKILL_GROUPS.map((g) => (
            <div key={g.title} className="border-t hairline pt-6">
              <div className="flex items-baseline justify-between mb-6">
                <h3 className="font-serif text-3xl md:text-4xl">{g.title}</h3>
                <span className="label opacity-50">{g.tag}</span>
              </div>
              <ul className="space-y-2">
                {g.items.map((s) => (
                  <li key={s} className="text-base md:text-lg leading-snug">— {s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const AI_USES = [
  {
    n: "01",
    t: "Faster exploration",
    d: "I use AI to draft SQL, regex and pivot logic on messy datasets, then verify by hand. Cuts the boring middle of any analysis in half.",
  },
  {
    n: "02",
    t: "Pattern second-opinion",
    d: "When an anomaly looks suspicious, I describe the shape of the data to a model and stress-test my interpretation against alternative explanations.",
  },
  {
    n: "03",
    t: "Build leverage",
    d: "AI-assisted coding lets me ship a small dashboard, scraper or admin tool in hours — so the analysis actually reaches a screen, not just a notebook.",
  },
];

function AISection() {
  return (
    <section id="ai" className="py-24 md:py-32 bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="label mb-10 opacity-60">§ 05 — How I Use AI</div>
        <h2 className="font-serif text-5xl md:text-7xl mb-12 max-w-4xl leading-[0.95]">
          A multiplier on the analyst,<br />
          <em>not a replacement for one.</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {AI_USES.map((u) => (
            <div key={u.n} className="border-t border-paper/20 pt-6">
              <div className="label opacity-60 mb-4">{u.n}</div>
              <h3 className="font-serif text-3xl mb-3">{u.t}</h3>
              <p className="text-sm md:text-base opacity-80 leading-relaxed">{u.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-paper text-ink py-24 md:py-32 border-t hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="label mb-10 opacity-60">§ 06 — Get in touch</div>
        <h2 className="font-serif text-6xl md:text-9xl leading-none">
          Let's build something<br /><em>worth measuring.</em>
        </h2>
        <div className="mt-16 grid md:grid-cols-3 gap-10 border-t hairline pt-10">
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
          <span>v1.1 — handcrafted, not generated.</span>
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
      <AISection />
      <Contact />
      <AskMe />
    </main>
  );
}
