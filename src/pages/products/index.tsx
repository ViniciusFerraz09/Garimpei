import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { useInfiniteProducts } from "@/hooks/use-products";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  DEFAULT_FILTERS,
  buildFilterParams,
  countActiveFilters,
  parseProductFilters,
  type ProductFilters as ProductFiltersState,
} from "@/lib/product-filters";
import { siteConfig } from "@/lib/site-config";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = parseProductFilters(searchParams);
  const query = useInfiniteProducts(filters);

  const products = query.data?.pages.flatMap((page) => page.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;
  const hasActiveFilters = countActiveFilters(filters) > 0;

  usePageMeta({
    title: "Todos os achadinhos",
    description:
      "Explore o catálogo completo do Garimpei!: filtros por categoria, loja e faixa de preço para achar o produto certo.",
  });

  const updateFilters = useCallback(
    (next: ProductFiltersState) => {
      setSearchParams(buildFilterParams(next));
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(buildFilterParams(DEFAULT_FILTERS));
  }, [setSearchParams]);

  return (
    <div className="container py-8">
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Todos os achadinhos
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {siteConfig.curationNotice}
        </p>
      </header>

      <ProductFilters
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        resultCount={query.isSuccess ? total : undefined}
        className="mb-6"
      />

      <ProductGrid
        products={products}
        isLoading={query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        emptyState={
          <EmptyState
            icon={SearchX}
            title="Nenhum achadinho encontrado"
            description={
              hasActiveFilters
                ? "Tente outra busca ou remova os filtros para ver o catálogo completo."
                : "Ainda não temos produtos publicados. Volte em breve para conferir as novidades."
            }
            actionLabel={hasActiveFilters ? "Limpar filtros" : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        }
      />

      {query.hasNextPage && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="brand"
            size="lg"
            onClick={() => void query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
          >
            {query.isFetchingNextPage && <Loader2 className="animate-spin" aria-hidden="true" />}
            {query.isFetchingNextPage ? "Carregando..." : "Carregar mais achadinhos"}
          </Button>
        </div>
      )}

      {products.length > 0 && !query.hasNextPage && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Você viu todos os {total} achadinhos desta seleção.
        </p>
      )}
    </div>
  );
};

export default ProductsPage;
