// Client-side middleware for server functions: injects the Supabase
// access token as an Authorization header on the outgoing RPC request.
// This pairs with the server-side `requireSupabaseAuth` middleware.
import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let token: string | undefined;
    try {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    } catch {
      // ignore — call will go out unauthenticated and be rejected server-side
    }
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
