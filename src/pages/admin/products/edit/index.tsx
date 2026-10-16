import { Link, useNavigate, useParams } from "react-router-dom";
import { ExternalLink, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProduct, useUpdateProduct } from "@/hooks/use-admin-products";
import { usePageMeta } from "@/hooks/use-page-meta";
import { friendlyError } from "@/lib/errors";
import { toProductPayload, type ProductFormValues } from "@/lib/product-form";

const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productQuery = useAdminProduct(id);
  const updateProduct = useUpdateProduct();
  const product = productQuery.data ?? undefined;

  usePageMeta({
    title: "Editar produto",
    description: "Atualize os dados do produto no catálogo do Garimpei!.",
  });

  const handleSubmit = async (values: ProductFormValues) => {
    if (!id) return;

    try {
      await updateProduct.mutateAsync({ id, input: toProductPayload(values) });
      toast.success("Alterações salvas e vitrine atualizada.");
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(friendlyError(error, "Não foi possível salvar as alterações."));
    }
  };

  if (productQuery.isLoading) {
    return (
      <AdminLayout title="Editar produto">
        <Card className="space-y-4 p-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-10 w-40" />
        </Card>
      </AdminLayout>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <AdminLayout title="Editar produto">
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold text-foreground">Produto não encontrado</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            O produto pode ter sido excluído ou o endereço está incorreto.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="brand" asChild>
              <Link to="/admin">Voltar ao painel</Link>
            </Button>
            {productQuery.isError && (
              <Button variant="outline" onClick={() => void productQuery.refetch()}>
                Tentar novamente
              </Button>
            )}
          </div>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Editar produto"
      description={`Editando “${product.name}”.`}
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to={`/admin/produtos/${product.id}/preview`}>
              <ExternalLink aria-hidden="true" />
              Pré-visualizar
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/admin">Voltar</Link>
          </Button>
        </>
      }
    >
      <ProductForm
        product={product}
        submitLabel="Salvar alterações"
        isSubmitting={updateProduct.isPending}
        onSubmit={(values) => void handleSubmit(values)}
      />
    </AdminLayout>
  );
};

export default AdminProductEdit;
