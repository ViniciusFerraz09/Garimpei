import { ExternalLink, FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AffiliateDisclosure } from "@/components/product/affiliate-disclosure";
import { FavoriteButton } from "@/components/product/favorite-button";
import { OfferButton } from "@/components/product/offer-button";
import { ProductImage } from "@/components/product/product-image";
import { ProductPrice } from "@/components/product/product-price";
import { ShareButton } from "@/components/product/share-button";
import { StoreBadge } from "@/components/product/store-badge";
import { getCategoryLabel } from "@/lib/categories";
import { siteConfig } from "@/lib/site-config";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
}

/** Apresentação do produto, reaproveitada pela vitrine e pela pré-visualização do painel. */
export const ProductDetail = ({ product }: ProductDetailProps) => {
  const shareUrl =
    typeof window === "undefined"
      ? `/produto/${product.slug}`
      : `${window.location.origin}/produto/${product.slug}`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <ProductImage
        src={product.image_url}
        alt={product.name}
        category={product.category}
        priority
        className="aspect-square rounded-card border border-border"
      />

      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{getCategoryLabel(product.category)}</Badge>
          <StoreBadge store={product.store} storeName={product.store_name} />
          {product.badge_label && <Badge variant="brand">{product.badge_label}</Badge>}
          {product.featured && <Badge variant="brand">Destaque</Badge>}
          {product.is_demo && (
            <Badge variant="muted">
              <FlaskConical aria-hidden="true" />
              Exemplo
            </Badge>
          )}
        </div>

        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
          {product.name}
        </h1>

        <ProductPrice
          price={product.price}
          originalPrice={product.original_price}
          size="detail"
        />

        {product.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        )}

        {product.is_demo && (
          <Card className="border-primary/40 bg-accent p-4 text-sm text-foreground">
            <p className="flex items-start gap-2">
              <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{siteConfig.demoNotice}</span>
            </p>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          <OfferButton product={product} size="lg" />
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>{siteConfig.storeNotice}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FavoriteButton
            productId={product.id}
            productName={product.name}
            variant="inline"
            className="rounded-full border border-border"
          />
          <ShareButton title={product.name} url={shareUrl} />
        </div>

        <AffiliateDisclosure className="rounded-xl border border-border bg-secondary/60 p-3" />
      </div>
    </div>
  );
};
