import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { listFaqs, upsertFaq, deleteFaq, checkIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin · FAQs" }] }),
});

type Faq = {
  id: string;
  question: string;
  answer: string;
  priority: number;
  enabled: boolean;
  updated_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const list = useServerFn(listFaqs);
  const upsert = useServerFn(upsertFaq);
  const remove = useServerFn(deleteFaq);
  const check = useServerFn(checkIsAdmin);

  const [ready, setReady] = useState(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [editing, setEditing] = useState<Partial<Faq> | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const refresh = useCallback(async () => {
    try {
      const { faqs } = await list();
      setFaqs(faqs as Faq[]);
    } catch (e: any) {
      setErr(e.message);
    }
  }, [list]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/login" });
        return;
      }
      try {
        const { isAdmin } = await check();
        if (!isAdmin) {
          setErr("This account is not an admin. Sign in with the admin account or have an existing admin grant access.");
          setReady(true);
          return;
        }
        await refresh();
        setReady(true);
      } catch (e: any) {
        setErr(e.message);
        setReady(true);
      }
    })();
  }, [navigate, refresh, check]);

  async function save() {
    if (!editing?.question || !editing?.answer) return;
    setBusy(true);
    setErr("");
    try {
      await upsert({
        data: {
          id: editing.id,
          question: editing.question,
          answer: editing.answer,
          priority: Number(editing.priority ?? 0),
          enabled: editing.enabled ?? true,
        },
      });
      setEditing(null);
      await refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    setBusy(true);
    try {
      await remove({ data: { id } });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  if (!ready) return <main className="min-h-screen bg-paper text-ink p-10 label">Loading…</main>;

  return (
    <main className="bg-paper text-ink min-h-screen px-4 sm:px-6 md:px-10 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Link to="/" className="label opacity-60 hover:opacity-100">← Site</Link>
            <h1 className="font-serif text-4xl sm:text-5xl mt-2">FAQ &amp; Answer Overrides</h1>
            <p className="label opacity-60 mt-2 max-w-xl">
              Add canned Q&amp;A here. The chatbot will use these as authoritative answers — perfect
              for facts you want stated exactly, or to correct anything it gets wrong. No redeploy.
            </p>
          </div>
          <button onClick={signOut} className="label border border-ink/30 px-3 py-2 hover:bg-ink hover:text-paper">
            Sign out
          </button>
        </div>

        {err && <div className="mt-6 border border-red-500/50 text-red-700 p-3 label">{err}</div>}

        <div className="mt-8 flex justify-end">
          <button
            onClick={() =>
              setEditing({ question: "", answer: "", priority: 0, enabled: true })
            }
            className="bg-ink text-paper px-4 py-2 label"
          >
            + New FAQ
          </button>
        </div>

        <ul className="mt-4 divide-y divide-ink/10 border hairline">
          {faqs.length === 0 && (
            <li className="p-6 label opacity-60">No FAQs yet. Add one to override or extend the bot.</li>
          )}
          {faqs.map((f) => (
            <li key={f.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="label opacity-60">priority {f.priority}</span>
                  {!f.enabled && <span className="label text-red-700">disabled</span>}
                </div>
                <div className="font-serif text-lg mt-1 break-words">{f.question}</div>
                <div className="text-sm mt-1 opacity-80 whitespace-pre-wrap break-words">{f.answer}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(f)} className="label border border-ink/30 px-3 py-1.5 hover:bg-ink hover:text-paper">Edit</button>
                <button onClick={() => del(f.id)} className="label border border-ink/30 px-3 py-1.5 hover:bg-red-700 hover:text-paper hover:border-red-700">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[70] bg-ink/60 flex items-center justify-center p-4">
          <div className="bg-paper border hairline w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-2xl">{editing.id ? "Edit FAQ" : "New FAQ"}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <div className="label opacity-60 mb-1">Question / trigger</div>
                <input
                  value={editing.question ?? ""}
                  onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                  className="w-full bg-transparent border border-ink/30 px-3 py-2 text-sm focus:outline-none focus:border-ink"
                />
              </div>
              <div>
                <div className="label opacity-60 mb-1">Answer (used verbatim by the bot)</div>
                <textarea
                  value={editing.answer ?? ""}
                  onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                  rows={6}
                  className="w-full bg-transparent border border-ink/30 px-3 py-2 text-sm focus:outline-none focus:border-ink"
                />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="label flex items-center gap-2">
                  Priority
                  <input
                    type="number"
                    min={0}
                    value={editing.priority ?? 0}
                    onChange={(e) => setEditing({ ...editing, priority: Number(e.target.value) })}
                    className="w-20 bg-transparent border border-ink/30 px-2 py-1 text-sm"
                  />
                </label>
                <label className="label flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.enabled ?? true}
                    onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                  />
                  Enabled
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="label border border-ink/30 px-4 py-2">Cancel</button>
              <button onClick={save} disabled={busy} className="bg-ink text-paper px-4 py-2 label disabled:opacity-40">
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
