import { Link } from "react-router-dom";
import { FlaskConical, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/product/favorite-button";
import { OfferButton } from "@/components/product/offer-button";
import { ProductImage } from "@/components/product/product-image";
import { ProductPrice } from "@/components/product/product-price";
import { StoreBadge } from "@/components/product/store-badge";
import { getCategoryLabel } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const detailPath = `/produto/${product.slug}`;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:garimpei-shadow-card-hover",
        className,
      )}
    >
      <div className="relative">
        <Link
          to={detailPath}
          aria-label={`Ver detalhes de ${product.name}`}
          className="block focus-visible:outline-none"
        >
          <ProductImage
            src={product.image_url}
            alt={product.name}
            category={product.category}
            className="aspect-[4/3] rounded-none"
            imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badge_label && (
            <Badge variant="default">
              <Sparkles aria-hidden="true" />
              {product.badge_label}
            </Badge>
          )}
          {product.featured && !product.badge_label && (
            <Badge variant="default">
              <Sparkles aria-hidden="true" />
              Destaque
            </Badge>
          )}
          {product.is_demo && (
            <Badge variant="muted" className="bg-background/90 text-foreground">
              <FlaskConical aria-hidden="true" />
              Exemplo
            </Badge>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <FavoriteButton productId={product.id} productName={product.name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {getCategoryLabel(product.category)}
          </span>
          <StoreBadge store={product.store} storeName={product.store_name} />
        </div>

        <Link
          to={detailPath}
          className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors hover:text-foreground/70"
        >
          {product.name}
        </Link>

        <ProductPrice
          price={product.price}
          originalPrice={product.original_price}
          className="mt-auto"
        />

        <OfferButton product={product} className="mt-1" />
      </div>
    </Card>
  );
};
