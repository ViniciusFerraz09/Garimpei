import { useState } from "react";

import { getCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  category?: string | null;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** Esconde o rótulo do marcador em espaços pequenos (listas e miniaturas). */
  compact?: boolean;
}

/**
 * Imagem do produto com proporção fixa (evita layout shift), carregamento
 * preguiçoso e um marcador claro quando não há imagem cadastrada.
 */
export const ProductImage = ({
  src,
  alt,
  category,
  className,
  imageClassName,
  priority = false,
  compact = false,
}: ProductImageProps) => {
  const [hasError, setHasError] = useState(false);
  const categoryDefinition = getCategory(category);
  const Icon = categoryDefinition?.icon;
  const showImage = Boolean(src) && !hasError;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-secondary",
        className,
      )}
    >
      {showImage ? (
        <img
          key={src ?? "image"}
          src={src ?? ""}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setHasError(true)}
          className={cn("size-full object-cover", imageClassName)}
        />
      ) : (
        <div
          role="img"
          aria-label={`${alt} — imagem não cadastrada`}
          className="flex size-full flex-col items-center justify-center gap-2 bg-[linear-gradient(140deg,hsl(var(--accent)),hsl(var(--secondary)))] text-muted-foreground"
        >
          {Icon && (
            <Icon
              className={compact ? "size-5 text-foreground/35" : "size-8 text-foreground/35"}
              aria-hidden="true"
            />
          )}
          {!compact && (
            <span className="px-2 text-center text-[11px] font-semibold uppercase tracking-wide">
              Imagem não cadastrada
            </span>
          )}
        </div>
      )}
    </div>
  );
};
