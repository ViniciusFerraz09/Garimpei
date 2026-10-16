import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export interface SessionState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

/**
 * Fonte única da sessão. O listener é registrado antes de consultar a sessão
 * existente para não perdermos a restauração inicial.
 */
export const useSession = (): SessionState => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) return;
      setSession(nextSession);
      setIsLoading(false);
    });

    void supabase.auth.getSession().then(({ data: current }) => {
      if (!isActive) return;
      setSession(current.session);
      setIsLoading(false);
    });

    return () => {
      isActive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, isLoading };
};
