# Yash Pawar — Portfolio + AI Chatbot + Admin

A full-stack TanStack Start portfolio for a Data Analyst, with an "Ask Me"
AI chatbot grounded in CV facts and a secure admin dashboard for editing
chatbot answers in real time without redeploying.

**Live URL:** https://my-cv-canvas-86.lovable.app
**Admin:** `/login` → `/admin`

---

## Tech Stack

| Layer        | Choice                                                  |
|--------------|---------------------------------------------------------|
| Framework    | TanStack Start v1 (SSR + server functions)              |
| Build        | Vite 7 + `@lovable.dev/vite-tanstack-config`            |
| Runtime      | Cloudflare Workers (Edge)                               |
| UI           | React 19, Tailwind v4, shadcn/ui                        |
| Backend      | Lovable Cloud (Supabase) — Postgres, Auth, RLS          |
| AI           | Lovable AI Gateway → `google/gemini-3-flash-preview`    |
| Realtime     | Supabase live updates from `faq_overrides` table        |

---

## Features

- **Editorial portfolio** — Hero, About, Skills, Projects, AI section, Contact.
- **Floating "Ask Me" chatbot** — answers questions about skills, projects,
  experience using only on-site facts + admin-curated FAQs.
- **Admin dashboard (`/admin`)** — email/password login, full CRUD on FAQ
  overrides. Edits go live in the chatbot **immediately** (no redeploy).
- **Role-based security** — admin role stored in a separate `user_roles`
  table, checked via a `SECURITY DEFINER` function — no privilege-escalation
  surface.
- **Pinch-zoom disabled** for app-like mobile feel.

---

## Hosting — Important

This project **only deploys cleanly on Lovable Publish** (Cloudflare Workers).
It is **not** a static SPA — server functions power the chatbot, admin APIs,
and auth middleware.

### Why Vercel does not work as-is

| Reason | Detail |
|--------|--------|
| Build target | The Vite plugin builds a Cloudflare Worker bundle, not a Vercel serverless function. |
| Server functions | `/_serverFn/*` routes need the Cloudflare runtime; Vercel's Node runtime can't load them. |
| `vercel.json` rewrite | A `rewrites: [{ source: "(.*)", destination: "/" }]` config breaks every `/api/*` and `/_serverFn/*` call. |
| SSR HTML | The Worker entry (`src/server.ts`) is the SSR handler — Vercel never invokes it. |

**Symptom on Vercel:** site loads a blank page, all API calls 404, chatbot
and admin login silently fail.

### Use a custom domain on Lovable instead

1. Click **Publish** in the Lovable editor.
2. In the Publish dialog → **Add custom domain** → enter your domain.
3. Add the DNS records shown (CNAME / A) at your registrar.
4. SSL is provisioned automatically in 5–30 minutes.

Same domain, same HTTPS, full feature support.

---

## Local Development

```bash
bun install
bun run dev
```

The dev server runs on `http://localhost:8080`.

Environment variables (auto-injected by Lovable Cloud, never edit `.env` manually):

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` — client
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — server
- `LOVABLE_API_KEY` — AI Gateway

---

## Database Schema

Two tables managed via migrations in `supabase/migrations/`:

### `user_roles`
| column   | type      | notes                          |
|----------|-----------|--------------------------------|
| user_id  | uuid      | FK → auth.users                |
| role     | app_role  | enum: 'admin' \| 'user'        |

RLS: users can read their own roles; admins can manage all.
Check via `public.has_role(uid, 'admin')` — `SECURITY DEFINER` to dodge
recursive RLS.

### `faq_overrides`
| column   | type    | notes                         |
|----------|---------|-------------------------------|
| question | text    | trigger phrase                |
| answer   | text    | verbatim chatbot reply        |
| priority | int     | higher = used first           |
| enabled  | bool    | toggle without deletion       |

RLS: anyone can read enabled rows; only admins can write.

---

## Real-Time Behavior

- **Admin edits propagate instantly.** Each chatbot request fetches active
  FAQs from Postgres and injects them into the AI system prompt as
  "Highest Priority" instructions. No caching, no redeploy, no restart.
- **No background polling needed** — the FAQ table is queried on every
  chat turn, so the next message after an admin save uses the new answer.

---

## Bugs Encountered & Fixes Applied

A running log of every issue hit during development and how it was solved.
Keep this updated when you change auth / server fns / hosting.

### 1. `Error: [object Response]` from `/_serverFn/checkIsAdmin`

**Symptom:** Admin page crashed on load with a runtime error pointing at
`checkIsAdmin_createServerFn_handler`. Network tab showed 401 "No
authorization header provided".

**Cause:** The browser's `fetch` for server-function calls did not attach
the Supabase access token, so `requireSupabaseAuth` rejected every call.

**Fix:** Added `src/integrations/supabase/server-fn-fetch.client.ts` — a
client-only `fetch` wrapper that injects `Authorization: Bearer <token>`
into every `/_serverFn/*` request. Imported once from `__root.tsx`.

### 2. Email verification blocked first admin login

**Symptom:** First signup at `/login` couldn't sign in — Supabase required
email confirmation, no inbox link arrived.

**Fix:** Enabled `auto_confirm_email` in Supabase Auth via
`configure_auth`. Signups are now usable immediately.
Manual override: Lovable Cloud → Users → Auth Settings.

### 3. Admin role had to be granted manually

**Symptom:** After signup, `/admin` showed "This account is not an admin".

**Cause:** The `bootstrapAdmin` server fn promotes the first user only if
**zero** admin rows exist. If the row was ever cleared and re-seeded, the
flow can race.

**Fix:** Hand-promoted via SQL migration:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<auth-uid>', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```
Find your UID in **Lovable Cloud → Users**.

### 4. Vercel deploy showed a blank page

**Symptom:** After deploying to Vercel, the site rendered nothing and all
chatbot/admin requests 404'd.

**Cause:** This stack targets Cloudflare Workers (see "Hosting" above).
Vercel can't run the Worker bundle and the `vercel.json` rewrite to `/`
breaks every server-function URL.

**Fix:** Don't host on Vercel. Use Lovable Publish with a custom domain.
Removed `vercel.json` to prevent confusion.

### 5. Hydration mismatch from chatbot widget

**Symptom:** Console warning + flicker on first paint when the floating
chat button rendered server-side but immediately changed on hydration.

**Fix:** Gated `<AskMe />` rendering behind a `useEffect` mount flag so
the widget only appears client-side.

### 6. Pinch-zoom interfering with portfolio scroll on mobile

**Symptom:** Two-finger gestures zoomed the page on iOS Safari.

**Fix:** Set viewport meta to
`maximum-scale=1, user-scalable=no, viewport-fit=cover` in `__root.tsx`.

---

## Project Structure

```
src/
├── routes/
│   ├── __root.tsx            # HTML shell, viewport, fetch wrapper import
│   ├── index.tsx             # Portfolio landing page
│   ├── login.tsx             # Admin sign-in / sign-up
│   └── admin.tsx             # FAQ management dashboard
├── components/
│   └── AskMe.tsx             # Floating chatbot widget
├── lib/
│   ├── chat.functions.ts     # AI Gateway server fn + FAQ injection
│   └── admin.functions.ts    # FAQ CRUD + admin role checks
└── integrations/supabase/
    ├── client.ts             # Browser client (publishable key)
    ├── client.server.ts      # Service-role admin client (server only)
    ├── auth-middleware.ts    # requireSupabaseAuth for server fns
    └── server-fn-fetch.client.ts  # Auth header injector (bug fix #1)
```

---

## Security Notes

- Service-role key is **never** exposed to the client — `client.server.ts`
  is import-protected.
- Admin checks happen server-side via `has_role()` — never trust
  `localStorage` or client-side flags.
- All FAQ writes go through `requireSupabaseAuth` + `assertAdmin()`.
- RLS is enabled on every table.

---

## Credits

Built with [Lovable](https://lovable.dev). Backend by Lovable Cloud
(Supabase). AI by Lovable AI Gateway.
