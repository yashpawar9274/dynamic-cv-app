// Attach the Supabase access token to all server-function requests.
// Server functions use the global fetch on the client; this wrapper injects
// `Authorization: Bearer <token>` for /_serverFn/* calls so middleware-protected
// handlers (requireSupabaseAuth) can validate the user.
import { supabase } from "./client";

if (typeof window !== "undefined" && !(window as any).__serverFnFetchPatched) {
  (window as any).__serverFnFetchPatched = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.toString()
        : input.url;
    if (url.includes("/_serverFn/")) {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
          if (!headers.has("authorization")) headers.set("authorization", `Bearer ${token}`);
          init = { ...(init ?? {}), headers };
        }
      } catch {
        // ignore — request will proceed unauthenticated
      }
    }
    return originalFetch(input as any, init);
  }) as typeof window.fetch;
}

export {};
