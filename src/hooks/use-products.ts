import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getProductBySlug,
  listDailyPicks,
  listHomeSection,
  listProducts,
  listProductsByIds,
  listRelatedProducts,
  type HomeSectionOptions,
} from "@/services/products";
import type { Product } from "@/types/product";
import type { ProductFilters } from "@/lib/product-filters";

export const productKeys = {
  all: ["products"] as const,
  list: (filters: ProductFilters) => ["products", "list", filters] as const,
  detail: (slug: string) => ["products", "detail", slug] as const,
  related: (id: string) => ["products", "related", id] as const,
  section: (key: string, options: HomeSectionOptions) =>
    ["products", "section", key, options] as const,
  daily: (limit: number) => ["products", "daily", limit] as const,
  favorites: (ids: string[]) => ["products", "favorites", ids] as const,
};

/** Listagem do catálogo com "Carregar mais" acumulando páginas. */
export const useInfiniteProducts = (filters: ProductFilters) =>
  useInfiniteQuery({
    queryKey: productKeys.list(filters),
    queryFn: ({ pageParam }) => listProducts(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((total, page) => total + page.items.length, 0);
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    placeholderData: keepPreviousData,
  });

export const useProduct = (slug?: string) =>
  useQuery({
    queryKey: productKeys.detail(slug ?? ""),
    queryFn: () => getProductBySlug(slug as string),
    enabled: Boolean(slug),
  });

export const useRelatedProducts = (product?: Pick<Product, "id" | "category">) =>
  useQuery({
    queryKey: productKeys.related(product?.id ?? ""),
    queryFn: () => listRelatedProducts(product as Pick<Product, "id" | "category">),
    enabled: Boolean(product?.id),
  });

export const useHomeSection = (key: string, options: HomeSectionOptions = {}) =>
  useQuery({
    queryKey: productKeys.section(key, options),
    queryFn: () => listHomeSection(options),
  });

export const useDailyPicks = (limit = 8) =>
  useQuery({
    queryKey: productKeys.daily(limit),
    queryFn: () => listDailyPicks(limit),
  });

export const useFavoriteProducts = (ids: string[]) =>
  useQuery({
    queryKey: productKeys.favorites(ids),
    queryFn: () => listProductsByIds(ids),
    enabled: ids.length > 0,
  });
