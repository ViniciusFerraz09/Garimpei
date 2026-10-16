import { Link } from "react-router-dom";
import { ArrowRight, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/product/section-heading";
import type { Product } from "@/types/product";

interface ProductSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  products?: Product[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  actionTo?: string;
  actionLabel?: string;
  emptyDescription?: string;
}

/** Seção da home: só aparece quando há produtos para mostrar. */
export const ProductSection = ({
  eyebrow,
  title,
  description,
  products,
  isLoading = false,
  isError = false,
  onRetry,
  actionTo,
  actionLabel,
  emptyDescription,
}: ProductSectionProps) => {
  const hasProducts = Boolean(products && products.length > 0);
  if (!isLoading && !isError && !hasProducts) return null;

  return (
    <section className="container py-10">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          actionTo && actionLabel ? (
            <Button asChild variant="outline" size="sm">
              <Link to={actionTo}>
                {actionLabel}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          ) : undefined
        }
      />

      <ProductGrid
        products={products}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        skeletonCount={4}
        emptyState={
          <EmptyState
            icon={SearchX}
            title="Nada por aqui ainda"
            description={
              emptyDescription ??
              "Assim que novos achadinhos forem cadastrados, eles aparecem nesta seção."
            }
          />
        }
      />
    </section>
  );
};
