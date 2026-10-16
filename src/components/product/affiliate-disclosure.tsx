import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface AffiliateDisclosureProps {
  className?: string;
  variant?: "inline" | "muted";
}

/** Divulgação de afiliado — visível no rodapé e perto das ofertas. */
export const AffiliateDisclosure = ({
  className,
  variant = "inline",
}: AffiliateDisclosureProps) => (
  <p
    className={cn(
      "flex items-start gap-2 text-xs leading-relaxed",
      variant === "inline" ? "text-muted-foreground" : "text-muted-foreground/90",
      className,
    )}
  >
    <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
    <span>{siteConfig.affiliateDisclosure}</span>
  </p>
);
