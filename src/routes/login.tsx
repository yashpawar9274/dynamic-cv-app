import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Admin · Sign in" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bootstrap = useServerFn(bootstrapAdmin);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      // Try to claim admin if no admin exists yet (first user)
      try { await bootstrap(); } catch {}
      navigate({ to: "/admin" });
    } catch (e: any) {
      setError(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-paper text-ink min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md border hairline p-8">
        <Link to="/" className="label opacity-60 hover:opacity-100">← Back</Link>
        <h1 className="font-serif text-4xl mt-4">Admin{mode === "signup" ? " · Setup" : ""}</h1>
        <p className="label opacity-60 mt-2">
          {mode === "signin" ? "Sign in to manage FAQs and chatbot answers." : "Create the first admin account."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-transparent border border-ink/30 px-3 py-2 text-sm focus:outline-none focus:border-ink"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent border border-ink/30 px-3 py-2 text-sm focus:outline-none focus:border-ink"
          />
          {error && <div className="label text-red-700">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper px-4 py-2 label disabled:opacity-40"
          >
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="label opacity-60 hover:opacity-100 mt-4"
        >
          {mode === "signin" ? "First time? Create admin →" : "← Already have an account"}
        </button>
      </div>
    </main>
  );
}
