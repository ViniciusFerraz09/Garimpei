import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  FlaskConical,
  Pencil,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/components/product/product-image";
import { getCategoryLabel } from "@/lib/categories";
import { formatDateTime, formatPrice } from "@/lib/format";
import { getStoreLabel } from "@/lib/stores";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AdminProductsTableProps {
  products: Product[];
  isLoading?: boolean;
  isBusy?: boolean;
  onMove: (product: Product, direction: "up" | "down") => void;
  onTogglePublish: (product: Product) => void;
  onToggleFeatured: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const AdminProductsTable = ({
  products,
  isLoading = false,
  isBusy = false,
  onMove,
  onTogglePublish,
  onToggleFeatured,
  onDuplicate,
  onDelete,
}: AdminProductsTableProps) => {
  if (isLoading) {
    return (
      <Card className="space-y-3 p-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product, index) => (
        <Card key={product.id} className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <ProductImage
                src={product.image_url}
                alt={product.name}
                category={product.category}
                className="size-20 shrink-0"
                compact
              />

              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={product.published ? "success" : "muted"}>
                    {product.published ? "Publicado" : "Rascunho"}
                  </Badge>
                  {product.featured && <Badge variant="brand">Destaque</Badge>}
                  {product.is_demo && (
                    <Badge variant="outline">
                      <FlaskConical aria-hidden="true" />
                      Exemplo
                    </Badge>
                  )}
                </div>

                <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {getCategoryLabel(product.category)} · {getStoreLabel(product.store, product.store_name)} ·
                  {" "}/produto/{product.slug}
                </p>
                <p className="text-xs text-muted-foreground">
                  Atualizado em {formatDateTime(product.updated_at) || "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <span
                className={cn(
                  "min-w-[90px] text-sm font-bold text-foreground",
                  product.price === null && "font-medium text-muted-foreground",
                )}
              >
                {product.price === null ? "Sem preço" : formatPrice(product.price)}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="iconSm"
                  disabled={isBusy || index === 0}
                  onClick={() => onMove(product, "up")}
                  aria-label={`Mover ${product.name} para cima`}
                  title="Mover para cima"
                >
                  <ArrowUp aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  disabled={isBusy || index === products.length - 1}
                  onClick={() => onMove(product, "down")}
                  aria-label={`Mover ${product.name} para baixo`}
                  title="Mover para baixo"
                >
                  <ArrowDown aria-hidden="true" />
                </Button>

                <Button
                  variant="ghost"
                  size="iconSm"
                  disabled={isBusy}
                  onClick={() => onToggleFeatured(product)}
                  aria-label={
                    product.featured
                      ? `Remover destaque de ${product.name}`
                      : `Destacar ${product.name}`
                  }
                  title={product.featured ? "Remover destaque" : "Destacar"}
                >
                  {product.featured ? (
                    <Star className="fill-primary" aria-hidden="true" />
                  ) : (
                    <StarOff aria-hidden="true" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="iconSm"
                  disabled={isBusy}
                  onClick={() => onTogglePublish(product)}
                  aria-label={
                    product.published
                      ? `Despublicar ${product.name}`
                      : `Publicar ${product.name}`
                  }
                  title={product.published ? "Despublicar" : "Publicar"}
                >
                  {product.published ? (
                    <Eye aria-hidden="true" />
                  ) : (
                    <EyeOff aria-hidden="true" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="iconSm"
                  disabled={isBusy}
                  onClick={() => onDuplicate(product)}
                  aria-label={`Duplicar ${product.name}`}
                  title="Duplicar"
                >
                  <Copy aria-hidden="true" />
                </Button>

                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/produtos/${product.id}/editar`}>
                    <Pencil aria-hidden="true" />
                    Editar
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      disabled={isBusy}
                      aria-label={`Excluir ${product.name}`}
                      title="Excluir"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
                        Excluir produto?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        O produto “{product.name}” será removido definitivamente do catálogo. Essa
                        ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(product)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir produto
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
