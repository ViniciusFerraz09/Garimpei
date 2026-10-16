import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type AdminInvite = Database["public"]["Tables"]["admin_invites"]["Row"];
export type AdminInviteInsert = Database["public"]["Tables"]["admin_invites"]["Insert"];
