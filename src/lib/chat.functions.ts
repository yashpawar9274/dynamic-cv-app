import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PORTFOLIO_CONTEXT = `
You are "Ask-Me", a concise, friendly assistant embedded on Yash Pawar's portfolio site.
Answer ONLY using the facts below. If asked something not covered, say so honestly and
suggest contacting Yash. Keep answers short (1–4 sentences unless asked for detail).
Speak in first-person about Yash only when quoting; otherwise refer to him as "Yash".

# About Yash Pawar
- Role: Data Analyst (primary). Also builds web apps and uses AI tooling as supporting trades.
- Location: Boisar, India.
- Education: B.Sc. Computer Science, Mumbai University (2023–2026). HSC at SDSM College, Palghar. SSC at R.H. Save Vidyalaya, Tarapur.
- Experience: 2.5+ years freelancing on real product data. Open to entry-level Data Analyst roles.
- Contact: theyashpawar92@gmail.com · +91 73850 66631.

# Experience
- Data Analyst — Freelance (Jun 2022 – Jan 2025, Remote): Cleaned and interrogated user activity, transaction-like records, and system logs across multiple web apps. Surfaced patterns and anomalies and turned them into dashboard-style summaries that fed product decisions.
- Team Lead — Valmo, Boisar (Jan 2022 – Dec 2022): Owned daily throughput tracking and reporting.
- Asst. Team Lead — Ekart, Boisar (Mar 2021 – Oct 2021): Tracked SLA breaches, sortation accuracy, and load timing.

# Projects
1. Fraud Guard (React, Node, Supabase) — Behavioural analytics. Profiled normal user rhythms then flagged outliers (velocity spikes, off-hours bursts, mismatched geos). Lightweight monitoring layer that surfaces suspicious sessions for review.
2. Fuel Tracker (HTML, CSS, JS) — Consumption analytics. Computed rolling mileage, cost-per-km trends, and seasonal efficiency drift from user-logged refuels.
3. LifeXS (JS, Supabase) — Behavioural data. Studied task completion patterns by hour and category to surface real focus windows. Gamified tracker where the data trail is the product.

# Skills
- Data Analysis (Primary): Excel (pivot, lookup, modelling), SQL (queries, joins, aggregations), dashboarding, pattern & anomaly recognition, data cleaning.
- Web Development (Builder): JavaScript, React, Next.js, Node.js, Express, MongoDB, Supabase, Firebase, HTML/CSS, Git.
- AI & Tooling (Leverage): AI-assisted analysis & coding, prompt design for data tasks, learning ML fundamentals.

# Certifications
- Foundations of Digital Marketing & Web Tech — Google
- Azure Basics: Cloud Services & Deployment — Microsoft Azure
- Intro to Cloud Computing & Azure Fundamentals — Microsoft
- Cloud Computing Fundamentals — Amazon Web Services

# How Yash uses AI
- Drafts SQL, regex, and pivot logic on messy datasets, then verifies by hand.
- Uses models as a second-opinion when stress-testing anomaly interpretations.
- Ships small dashboards/scrapers/admin tools quickly so analysis reaches a screen.

Style: plain prose, no emojis, no markdown headings. Short paragraphs.
`.trim();

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
});

export const askMe = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { reply: "", error: "AI is not configured on the server." };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: PORTFOLIO_CONTEXT },
            ...data.messages,
          ],
        }),
      });

      if (res.status === 429) {
        return { reply: "", error: "Too many requests right now — please try again in a minute." };
      }
      if (res.status === 402) {
        return { reply: "", error: "AI credits exhausted. Please reach out to Yash directly." };
      }
      if (!res.ok) {
        const t = await res.text();
        console.error("AI gateway error:", res.status, t);
        return { reply: "", error: "Something went wrong contacting the AI." };
      }

      const json = await res.json();
      const reply: string = json?.choices?.[0]?.message?.content ?? "";
      return { reply, error: null as string | null };
    } catch (e) {
      console.error("askMe error:", e);
      return { reply: "", error: "Network error. Please try again." };
    }
  });
