import type { MouseEvent } from "react";
import { CircleSlash, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EXTERNAL_LINK_REL, EXTERNAL_LINK_TARGET, hasOffer } from "@/lib/affiliate";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface OfferButtonProps {
  product: Pick<Product, "affiliate_url" | "is_demo" | "name">;
  size?: "default" | "lg";
  fullWidth?: boolean;
  className?: string;
}

/**
 * Botão de oferta. Sem link válido a ação fica desativada com explicação —
 * nunca substituímos por uma página inicial de loja.
 */
export const OfferButton = ({
  product,
  size = "default",
  fullWidth = true,
  className,
}: OfferButtonProps) => {
  const canOpenOffer = hasOffer(product.affiliate_url);
  const stopCardNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  if (!canOpenOffer) {
    return (
      <Button
        type="button"
        variant="brandSoft"
        size={size}
        disabled
        aria-disabled="true"
        title={
          product.is_demo
            ? "Produto de exemplo: cadastre o link de afiliado no painel para ativar a oferta."
            : "Sem link de afiliado cadastrado para este produto."
        }
        className={cn(fullWidth && "w-full", className)}
      >
        <CircleSlash aria-hidden="true" />
        Oferta indisponível
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant="brand"
      size={size}
      className={cn(fullWidth && "w-full", className)}
    >
      <a
        href={(product.affiliate_url as string).trim()}
        target={EXTERNAL_LINK_TARGET}
        rel={EXTERNAL_LINK_REL}
        onClick={stopCardNavigation}
        aria-label={`Ver oferta de ${product.name} na loja parceira (abre em nova aba)`}
      >
        Ver oferta na loja
        <ExternalLink aria-hidden="true" />
      </a>
    </Button>
  );
};
