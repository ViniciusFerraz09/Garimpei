import { Link } from "react-router-dom";
import { HeartOff, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { useFavorites } from "@/hooks/use-favorites";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useFavoriteProducts } from "@/hooks/use-products";

const FavoritesPage = () => {
  const { ids, count } = useFavorites();
  const query = useFavoriteProducts(ids);

  usePageMeta({
    title: "Meus favoritos",
    description:
      "Os achadinhos que você salvou para ver depois. Os favoritos ficam guardados apenas neste dispositivo.",
  });

  return (
    <div className="container py-8">
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Meus favoritos
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {count === 0
            ? "Você ainda não salvou nenhum achadinho."
            : `${count} ${count === 1 ? "achadinho salvo" : "achadinhos salvos"} neste dispositivo.`}
        </p>
      </header>

      <Card className="mb-6 flex items-start gap-3 border-primary/30 bg-accent p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-foreground sm:text-sm">
          Seus favoritos ficam salvos apenas neste navegador. Eles não são enviados para uma conta e
          não aparecem em outros aparelhos.
        </p>
      </Card>

      <ProductGrid
        products={query.data}
        isLoading={ids.length > 0 && query.isLoading}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        emptyState={
          <EmptyState
            icon={HeartOff}
            title="Nenhum favorito por aqui"
            description="Toque no coração dos produtos que você quer rever depois e eles aparecem nesta lista."
          />
        }
      />

      {ids.length === 0 && (
        <div className="mt-6 flex justify-center">
          <Button variant="brand" asChild>
            <Link to="/produtos">Explorar achadinhos</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
