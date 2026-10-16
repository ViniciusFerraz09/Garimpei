import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, PackageSearch, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/product/section-heading";
import { useProduct, useRelatedProducts } from "@/hooks/use-products";
import { usePageMeta } from "@/hooks/use-page-meta";
import { getCategory } from "@/lib/categories";
import { buildProductJsonLd } from "@/lib/seo";

const ProductPageSkeleton = () => (
  <div className="grid gap-8 lg:grid-cols-2">
    <Skeleton className="aspect-square w-full rounded-card" />
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-12 w-full rounded-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const productQuery = useProduct(slug);
  const product = productQuery.data ?? undefined;
  const relatedQuery = useRelatedProducts(product);

  const jsonLd = useMemo(
    () => (product ? buildProductJsonLd(product) : null),
    [product],
  );

  usePageMeta({
    title: product ? product.name : "Produto não encontrado",
    description: product?.description ?? undefined,
    image: product?.image_url ?? undefined,
    jsonLd,
  });

  const category = product ? getCategory(product.category) : null;

  return (
    <div className="container py-8">
      <nav aria-label="Você está aqui" className="mb-6">
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
          {category && (
            <>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <li>
                <Link
                  to={`/categoria/${category.slug}`}
                  className="transition-colors hover:text-foreground"
                >
                  {category.label}
                </Link>
              </li>
            </>
          )}
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li className="max-w-[240px] truncate font-semibold text-foreground">
            {product?.name ?? "Produto"}
          </li>
        </ol>
      </nav>

      {productQuery.isLoading && <ProductPageSkeleton />}

      {productQuery.isError && (
        <Card className="mx-auto flex max-w-2xl flex-col items-center gap-3 border-dashed bg-secondary/40 px-6 py-12 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <h1 className="text-lg font-bold text-foreground">
            Não conseguimos carregar este produto
          </h1>
          <p className="text-sm text-muted-foreground">
            Pode ter sido uma falha momentânea de conexão. Tente novamente.
          </p>
          <Button variant="brand" onClick={() => void productQuery.refetch()}>
            Tentar novamente
          </Button>
        </Card>
      )}

      {!productQuery.isLoading && !productQuery.isError && !product && (
        <div className="space-y-6">
          <EmptyState
            icon={PackageSearch}
            title="Produto não encontrado"
            description="Esse achadinho pode ter sido removido do catálogo ou o endereço está incorreto."
            className="mx-auto max-w-2xl"
          />
          <div className="flex justify-center">
            <Button variant="brand" asChild>
              <Link to="/produtos">Ver todos os achadinhos</Link>
            </Button>
          </div>
        </div>
      )}

      {product && (
        <>
          <ProductDetail product={product} />

          <section className="mt-14">
            <SectionHeading
              eyebrow="Você também pode gostar"
              title="Achadinhos parecidos"
              description={
                category
                  ? `Outros produtos da categoria ${category.label}.`
                  : "Outros produtos selecionados pela nossa curadoria."
              }
              action={
                category ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/categoria/${category.slug}`}>Ver categoria</Link>
                  </Button>
                ) : undefined
              }
            />
            <ProductGrid
              products={relatedQuery.data}
              isLoading={relatedQuery.isLoading}
              isError={relatedQuery.isError}
              onRetry={() => void relatedQuery.refetch()}
              skeletonCount={4}
              emptyState={
                <EmptyState
                  icon={PackageSearch}
                  title="Sem produtos relacionados"
                  description="Ainda não há outros achadinhos nesta categoria. Explore o catálogo completo."
                  actionLabel="Ver catálogo"
                  onAction={() => navigate("/produtos")}
                />
              }
            />
          </section>
        </>
      )}
    </div>
  );
};

export default ProductPage;
