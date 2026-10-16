import { hasOffer, isSafeExternalUrl } from "@/lib/affiliate";
import { getCategoryLabel } from "@/lib/categories";
import { getStoreLabel } from "@/lib/stores";
import type { Product } from "@/types/product";

/**
 * Dados estruturados do produto, apenas com o que é real: sem avaliações, sem
 * estoque inventado e sem oferta para itens de exemplo.
 */
export const buildProductJsonLd = (product: Product): Record<string, unknown> => {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: getCategoryLabel(product.category),
  };

  if (product.description) data.description = product.description;

  if (product.image_url && isSafeExternalUrl(product.image_url)) {
    data.image = [product.image_url];
  }

  if (!product.is_demo && product.price !== null && hasOffer(product.affiliate_url)) {
    data.offers = {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "BRL",
      url: product.affiliate_url,
      seller: {
        "@type": "Organization",
        name: getStoreLabel(product.store, product.store_name),
      },
    };
  }

  return data;
};
