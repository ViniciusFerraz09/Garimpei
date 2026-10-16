import { Link, useParams } from "react-router-dom";
import { Eye, Pencil, TriangleAlert } from "lucide-react";

import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductDetail } from "@/components/product/product-detail";
import { useAdminProduct } from "@/hooks/use-admin-products";
import { usePageMeta } from "@/hooks/use-page-meta";

const AdminProductPreview = () => {
  const { id } = useParams<{ id: string }>();
  const productQuery = useAdminProduct(id);
  const product = productQuery.data ?? undefined;

  usePageMeta({
    title: "Pré-visualização do produto",
    description: "Confira como o produto aparece na vitrine antes de publicar.",
  });

  if (productQuery.isLoading) {
    return (
      <AdminLayout title="Pré-visualização">
        <Card className="p-5">
          <Skeleton className="aspect-square w-full max-w-md rounded-card" />
        </Card>
      </AdminLayout>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <AdminLayout title="Pré-visualização">
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-foreground">Produto não encontrado</h2>
          <p className="text-sm text-muted-foreground">
            Não conseguimos carregar este produto para pré-visualização.
          </p>
          <Button variant="brand" asChild>
            <Link to="/admin">Voltar ao painel</Link>
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Pré-visualização"
      description={
        product.published
          ? "Este produto está publicado e é exatamente o que os visitantes veem."
          : "Este produto está como rascunho: somente você consegue ver esta página."
      }
      actions={
        <>
          <Button variant="brand" asChild>
            <Link to={`/admin/produtos/${product.id}/editar`}>
              <Pencil aria-hidden="true" />
              Editar
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin">Voltar ao painel</Link>
          </Button>
        </>
      }
    >
      <Card className="space-y-4 p-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Eye className="size-4" aria-hidden="true" />
          Como aparece na vitrine
        </p>
        <ProductDetail product={product} />
      </Card>
    </AdminLayout>
  );
};

export default AdminProductPreview;
