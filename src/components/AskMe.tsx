import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askMe } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What does Yash do?",
  "Walk me through Fraud Guard",
  "What are his strongest data skills?",
  "Is he open to roles?",
];

export function AskMe() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm Ask-Me. I can answer questions about Yash's skills, projects, and experience. What would you like to know?",
    },
  ]);
  const ask = useServerFn(askMe);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (!mounted) return null;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({
        data: { messages: next.filter((m) => m.role === "user" || m.role === "assistant") },
      });
      if (res.error) {
        setMessages((p) => [...p, { role: "assistant", content: res.error! }]);
      } else {
        setMessages((p) => [...p, { role: "assistant", content: res.reply || "…" }]);
      }
    } catch {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] bg-ink text-paper px-5 py-3 label shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        aria-label="Open Ask-Me chatbot"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-paper animate-pulse" />
        {open ? "Close" : "Ask Me"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Ask-Me chatbot"
          className="fixed bottom-20 right-5 z-[60] w-[min(92vw,380px)] h-[min(70vh,560px)] bg-paper text-ink border border-ink/80 shadow-2xl flex flex-col animate-[fade-in_0.25s_ease-out_both]"
        >
          <div className="px-4 py-3 border-b hairline flex items-center justify-between">
            <div>
              <div className="font-serif text-xl leading-none">Ask Me<span className="italic">.</span></div>
              <div className="label opacity-60 mt-1">About Yash · powered by AI</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="label opacity-60 hover:opacity-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] bg-ink text-paper px-3 py-2 text-sm leading-relaxed"
                    : "mr-auto max-w-[90%] border border-ink/15 px-3 py-2 text-sm leading-relaxed font-serif"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto label opacity-60">thinking…</div>
            )}

            {messages.length <= 1 && !loading && (
              <div className="pt-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="label border border-ink/30 px-2.5 py-1.5 hover:bg-ink hover:text-paper transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t hairline p-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills, experience…"
              className="flex-1 bg-transparent border border-ink/30 px-3 py-2 text-sm focus:outline-none focus:border-ink"
              maxLength={500}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-ink text-paper px-4 label disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
