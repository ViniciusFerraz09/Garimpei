export type StoreSlug = "shopee" | "aliexpress" | "outra";

export interface StoreDefinition {
  slug: StoreSlug;
  label: string;
}

/** Lojas suportadas. "outra" usa o campo store_name do produto como nome exibido. */
export const STORES: StoreDefinition[] = [
  { slug: "shopee", label: "Shopee" },
  { slug: "aliexpress", label: "AliExpress" },
  { slug: "outra", label: "Outras lojas" },
];

export const STORE_SLUGS = STORES.map((store) => store.slug);

export const getStore = (slug?: string | null): StoreDefinition | null =>
  STORES.find((store) => store.slug === slug) ?? null;

/** Nome da loja já pronto para exibição. */
export const getStoreLabel = (
  store?: string | null,
  storeName?: string | null,
): string => {
  const definition = getStore(store);
  if (!definition) return storeName?.trim() || "Loja parceira";
  if (definition.slug === "outra") return storeName?.trim() || "Outra loja";
  return definition.label;
};
