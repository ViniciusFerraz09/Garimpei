import { computeSavings, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ProductPriceProps {
  price?: number | null;
  originalPrice?: number | null;
  size?: "card" | "detail";
  className?: string;
}

/**
 * Preço atual e, apenas quando existe fonte confiável (preço original maior),
 * o preço antigo e a economia calculada.
 */
export const ProductPrice = ({
  price,
  originalPrice,
  size = "card",
  className,
}: ProductPriceProps) => {
  const savings = computeSavings(price, originalPrice);
  const hasPrice = typeof price === "number" && Number.isFinite(price);

  if (!hasPrice) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Preço disponível na loja parceira
      </p>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "font-extrabold tracking-tight text-foreground",
          size === "detail" ? "text-3xl" : "text-lg",
        )}
      >
        {formatPrice(price)}
      </span>
      {savings !== null && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(originalPrice)}
          </span>
          <span className="text-xs font-semibold text-success">
            Economia de {formatPrice(savings)}
          </span>
        </>
      )}
    </div>
  );
};
