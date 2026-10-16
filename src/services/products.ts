import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductInsert, ProductUpdate } from "@/types/product";
import {
  PRODUCTS_PAGE_SIZE,
  getPriceRange,
  type ProductFilters,
} from "@/lib/product-filters";

export interface ProductListResult {
  items: Product[];
  total: number;
}

export interface AdminStats {
  total: number;
  published: number;
  drafts: number;
  featured: number;
}

export type AdminStatusFilter = "todos" | "publicados" | "rascunhos" | "destaques";

export interface HomeSectionOptions {
  limit?: number;
  featured?: boolean;
  priceMax?: number;
  store?: string;
}

/** Remove caracteres que teriam significado especial no filtro do backend. */
const sanitizeSearch = (value: string): string =>
  value.replace(/[,()%\\*"']/g, " ").replace(/\s+/g, " ").trim();

const applySearch = <T extends { or: (filter: string) => T }>(
  query: T,
  term: string,
): T => {
  const sanitized = sanitizeSearch(term);
  if (!sanitized) return query;
  return query.or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
};

/** Ordenação pública, sempre com critério secundário estável. */
const applyPublicOrder = (filters: ProductFilters) => {
  let query = supabase.from("products").select("*", { count: "exact" }).eq("published", true);

  if (filters.sort === "menor-preco") {
    query = query
      .order("price", { ascending: true, nullsFirst: false })
      .order("name", { ascending: true });
  } else if (filters.sort === "maior-preco") {
    query = query
      .order("price", { ascending: false, nullsFirst: false })
      .order("name", { ascending: true });
  } else if (filters.sort === "a-z") {
    query = query.order("name", { ascending: true });
  } else {
    query = query
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
  }

  return query;
};

export const listProducts = async (
  filters: ProductFilters,
  page = 1,
  pageSize = PRODUCTS_PAGE_SIZE,
): Promise<ProductListResult> => {
  const safePage = Math.max(1, Math.floor(page));
  const from = (safePage - 1) * pageSize;

  let query = applyPublicOrder(filters);

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.store) query = query.eq("store", filters.store);
  if (filters.price) {
    const range = getPriceRange(filters.price);
    if (range) {
      if (range.min !== null) query = query.gte("price", range.min);
      if (range.max !== null) query = query.lte("price", range.max);
      query = query.not("price", "is", null);
    }
  }
  query = applySearch(query, filters.query);

  const { data, error, count } = await query.range(from, from + pageSize - 1);

  if (error) throw error;

  return { items: data ?? [], total: count ?? 0 };
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
};

export const listRelatedProducts = async (
  product: Pick<Product, "id" | "category">,
  limit = 4,
): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .eq("category", product.category)
    .neq("id", product.id)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
};

export const listProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)
    .eq("published", true);

  if (error) throw error;

  // Preserva a ordem em que os favoritos foram salvos.
  const items = data ?? [];
  return ids
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is Product => Boolean(item));
};

export const listHomeSection = async (
  options: HomeSectionOptions = {},
): Promise<Product[]> => {
  const { limit = 8, featured, priceMax, store } = options;

  let query = supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (featured) query = query.eq("featured", true);
  if (typeof priceMax === "number") {
    query = query.not("price", "is", null).lte("price", priceMax);
  }
  if (store) query = query.eq("store", store);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

/**
 * "Achadinhos do dia": a seleção gira de verdade a cada dia, sem contagem
 * regressiva nem urgência falsa.
 */
export const listDailyPicks = async (limit = 8): Promise<Product[]> => {
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("published", true);

  if (countError) throw countError;

  const total = count ?? 0;
  if (total === 0) return [];

  const take = Math.min(limit, total);
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const offset = (dayIndex * take) % total;

  const fetchRange = async (from: number, to: number): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true })
      .range(from, to);

    if (error) throw error;
    return data ?? [];
  };

  const first = await fetchRange(offset, offset + take - 1);
  if (first.length >= take) return first;

  const remaining = await fetchRange(0, take - first.length - 1);
  return [...first, ...remaining];
};

/* ------------------------------- Painel admin ------------------------------ */

export const listAdminProducts = async (options: {
  status?: AdminStatusFilter;
  query?: string;
} = {}): Promise<Product[]> => {
  const { status = "todos", query: search = "" } = options;

  let query = supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (status === "publicados") query = query.eq("published", true);
  if (status === "rascunhos") query = query.eq("published", false);
  if (status === "destaques") query = query.eq("featured", true);
  query = applySearch(query, search);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

export const getAdminStats = async (): Promise<AdminStats> => {
  const [total, published, featured] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("featured", true),
  ]);

  const failure = total.error ?? published.error ?? featured.error;
  if (failure) throw failure;

  const totalCount = total.count ?? 0;
  const publishedCount = published.count ?? 0;

  return {
    total: totalCount,
    published: publishedCount,
    drafts: Math.max(0, totalCount - publishedCount),
    featured: featured.count ?? 0,
  };
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
};

export const getNextSortOrder = async (): Promise<number> => {
  const { data, error } = await supabase
    .from("products")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data?.sort_order ?? 0) + 1;
};

export const createProduct = async (input: ProductInsert): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (
  id: string,
  input: ProductUpdate,
): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

export const updateProductFlags = async (
  id: string,
  flags: Pick<ProductUpdate, "featured" | "published">,
): Promise<Product> => updateProduct(id, flags);

export const swapSortOrder = async (
  current: Pick<Product, "id" | "sort_order">,
  neighbor: Pick<Product, "id" | "sort_order">,
): Promise<void> => {
  const [first, second] = await Promise.all([
    supabase
      .from("products")
      .update({ sort_order: neighbor.sort_order })
      .eq("id", current.id),
    supabase
      .from("products")
      .update({ sort_order: current.sort_order })
      .eq("id", neighbor.id),
  ]);

  const failure = first.error ?? second.error;
  if (failure) throw failure;
};

export const duplicateProduct = async (product: Product): Promise<Product> => {
  const takenSlugs = await supabase
    .from("products")
    .select("slug")
    .ilike("slug", `${product.slug}%`);

  if (takenSlugs.error) throw takenSlugs.error;

  const existing = new Set((takenSlugs.data ?? []).map((row) => row.slug));
  let candidate = `${product.slug}-copia`;
  let suffix = 2;
  while (existing.has(candidate)) {
    candidate = `${product.slug}-copia-${suffix}`;
    suffix += 1;
  }

  return createProduct({
    slug: candidate,
    name: `${product.name} (cópia)`,
    description: product.description,
    image_url: product.image_url,
    price: product.price,
    original_price: product.original_price,
    category: product.category,
    store: product.store,
    store_name: product.store_name,
    affiliate_url: product.affiliate_url,
    badge_label: product.badge_label,
    featured: false,
    published: false,
    is_demo: false,
    sort_order: await getNextSortOrder(),
  });
};
