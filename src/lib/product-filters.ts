import { getCategory } from "@/lib/categories";
import { getStore } from "@/lib/stores";

export type SortOption = "destaques" | "menor-preco" | "maior-preco" | "a-z";

export interface PriceRangeOption {
  value: string;
  label: string;
  min: number | null;
  max: number | null;
}

export interface ProductFilters {
  query: string;
  category: string;
  store: string;
  price: string;
  sort: SortOption;
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "destaques", label: "Destaques primeiro" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "a-z", label: "Ordem alfabética (A-Z)" },
];

export const PRICE_RANGES: PriceRangeOption[] = [
  { value: "ate-50", label: "Até R$ 50", min: null, max: 50 },
  { value: "50-100", label: "R$ 50 a R$ 100", min: 50, max: 100 },
  { value: "100-200", label: "R$ 100 a R$ 200", min: 100, max: 200 },
  { value: "acima-200", label: "Acima de R$ 200", min: 200, max: null },
];

export const DEFAULT_FILTERS: ProductFilters = {
  query: "",
  category: "",
  store: "",
  price: "",
  sort: "destaques",
};

export const PRODUCTS_PAGE_SIZE = 12;

export const getPriceRange = (value: string): PriceRangeOption | null =>
  PRICE_RANGES.find((range) => range.value === value) ?? null;

const isSortOption = (value: string | null): value is SortOption =>
  SORT_OPTIONS.some((option) => option.value === value);

/** Lê os filtros da URL, ignorando valores desconhecidos. */
export const parseProductFilters = (params: URLSearchParams): ProductFilters => {
  const category = params.get("categoria") ?? "";
  const store = params.get("loja") ?? "";
  const price = params.get("preco") ?? "";
  const sort = params.get("ordem");

  return {
    query: (params.get("q") ?? "").slice(0, 80),
    category: getCategory(category) ? category : "",
    store: getStore(store) ? store : "",
    price: getPriceRange(price) ? price : "",
    sort: isSortOption(sort) ? sort : DEFAULT_FILTERS.sort,
  };
};

/** Converte os filtros em parâmetros de URL, deixando a URL limpa. */
export const buildFilterParams = (
  filters: ProductFilters,
  extra?: Record<string, string>,
): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.category && getCategory(filters.category)) {
    params.set("categoria", filters.category);
  }
  if (filters.store && getStore(filters.store)) params.set("loja", filters.store);
  if (filters.price && getPriceRange(filters.price)) params.set("preco", filters.price);
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("ordem", filters.sort);
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => params.set(key, value));
  }
  return params;
};

/** Quantidade de filtros ativos (usada no botão de limpar). */
export const countActiveFilters = (filters: ProductFilters): number =>
  [
    filters.query.trim(),
    filters.category,
    filters.store,
    filters.price,
  ].filter(Boolean).length;
