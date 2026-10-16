import { useCallback } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronRight, Loader2, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { useInfiniteProducts } from "@/hooks/use-products";
import { usePageMeta } from "@/hooks/use-page-meta";
import { getCategory } from "@/lib/categories";
import {
  DEFAULT_FILTERS,
  buildFilterParams,
  countActiveFilters,
  parseProductFilters,
  type ProductFilters as ProductFiltersState,
} from "@/lib/product-filters";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = getCategory(slug);

  const parsedFilters = parseProductFilters(searchParams);
  const filters: ProductFiltersState = {
    ...parsedFilters,
    category: category?.slug ?? "",
  };

  const query = useInfiniteProducts(filters);
  const products = query.data?.pages.flatMap((page) => page.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;
  const hasActiveFilters = countActiveFilters(parsedFilters) > 0;

  usePageMeta({
    title: category ? `${category.label} — achadinhos` : "Categoria não encontrada",
    description: category
      ? `${category.description} Veja os achadinhos da categoria ${category.label} no Garimpei!.`
      : "Categoria não encontrada no catálogo do Garimpei!.",
  });

  const updateFilters = useCallback(
    (next: ProductFiltersState) => {
      setSearchParams(buildFilterParams({ ...next, category: "" }));
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(buildFilterParams({ ...DEFAULT_FILTERS, category: "" }));
  }, [setSearchParams]);

  if (!category) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={SearchX}
          title="Categoria não encontrada"
          description="O endereço acessado não corresponde a nenhuma categoria do Garimpei!. Veja o catálogo completo para continuar."
          className="mx-auto max-w-2xl"
        />
        <div className="mt-6 flex justify-center">
          <Button variant="brand" asChild>
            <Link to="/produtos">Ver todos os achadinhos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div className="container py-8">
      <nav aria-label="Você está aqui" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <li>
            <Link to="/" className="transition-colors hover:text-foreground">
              Início
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li>
            <Link to="/produtos" className="transition-colors hover:text-foreground">
              Achadinhos
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li className="font-semibold text-foreground">{category.label}</li>
        </ol>
      </nav>

      <header className="mb-6 flex items-start gap-4">
        <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-primary/25 text-foreground sm:grid">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {category.label}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {category.description}
          </p>
        </div>
      </header>

      <ProductFilters
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        resultCount={query.isSuccess ? total : undefined}
        hideCategory
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
            title={`Nenhum achadinho em ${category.label}`}
            description={
              hasActiveFilters
                ? "Nenhum produto desta categoria bate com os filtros escolhidos. Tente limpar os filtros."
                : "Ainda não publicamos produtos nesta categoria. Volte em breve para conferir as novidades."
            }
            actionLabel={hasActiveFilters ? "Limpar filtros" : "Ver catálogo completo"}
            onAction={hasActiveFilters ? clearFilters : () => navigate("/produtos")}
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
    </div>
  );
};

export default CategoryPage;
