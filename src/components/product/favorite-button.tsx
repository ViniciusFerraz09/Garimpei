import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  productName: string;
  variant?: "overlay" | "inline";
  className?: string;
}

/** Favorito salvo apenas no dispositivo do visitante. */
export const FavoriteButton = ({
  productId,
  productName,
  variant = "overlay",
  className,
}: FavoriteButtonProps) => {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(productId);

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const nowFavorite = toggle(productId);
    toast.success(
      nowFavorite
        ? `${productName} foi adicionado aos favoritos.`
        : `${productName} saiu dos favoritos.`,
    );
  };

  return (
    <Button
      type="button"
      variant={variant === "overlay" ? "outline" : "ghost"}
      size={variant === "overlay" ? "iconSm" : "sm"}
      aria-pressed={active}
      aria-label={active ? `Remover ${productName} dos favoritos` : `Adicionar ${productName} aos favoritos`}
      onClick={handleToggle}
      className={cn(
        variant === "overlay" &&
          "border-border/70 bg-background/95 backdrop-blur hover:bg-background",
        className,
      )}
    >
      <Heart
        className={cn("size-4", active && "fill-primary stroke-foreground")}
        aria-hidden="true"
      />
      {variant === "inline" && <span>{active ? "Nos favoritos" : "Favoritar"}</span>}
    </Button>
  );
};
