import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyState?: ReactNode;
  skeletonCount?: number;
  className?: string;
}

export const ProductGrid = ({
  products = [],
  isLoading = false,
  isError = false,
  onRetry,
  emptyState,
  skeletonCount = 8,
  className,
}: ProductGridProps) => {
  if (isLoading) {
    return <ProductGridSkeleton count={skeletonCount} />;
  }

  if (isError) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed bg-secondary/40 px-6 py-12 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-semibold text-foreground">
          Não conseguimos carregar os achadinhos
        </h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Verifique sua conexão e tente novamente. Se o problema continuar, volte mais tarde.
        </p>
        {onRetry && (
          <Button variant="brand" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
      </Card>
    );
  }

  if (products.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
