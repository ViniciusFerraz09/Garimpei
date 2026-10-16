import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

export type AdminAccessStatus = "loading" | "anonymous" | "denied" | "granted";

/**
 * A permissão de administrador é confirmada no banco (política de RLS em
 * public.admins) — nunca apenas na interface.
 */
const fetchAdminRow = async (userId: string) => {
  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const useAdminAccess = (): { status: AdminAccessStatus } => {
  const { user, isLoading: isSessionLoading } = useSession();

  const adminQuery = useQuery({
    queryKey: ["admin-access", user?.id ?? "anon"],
    queryFn: () => fetchAdminRow(user?.id as string),
    enabled: Boolean(user?.id),
    retry: false,
    staleTime: 30_000,
  });

  if (isSessionLoading) return { status: "loading" };
  if (!user) return { status: "anonymous" };
  if (adminQuery.isLoading) return { status: "loading" };
  if (adminQuery.isError || !adminQuery.data) return { status: "denied" };
  return { status: "granted" };
};
