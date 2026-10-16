import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { AdminLayout } from "@/components/admin/admin-layout";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { useCreateProduct } from "@/hooks/use-admin-products";
import { usePageMeta } from "@/hooks/use-page-meta";
import { friendlyError } from "@/lib/errors";
import { toProductPayload, type ProductFormValues } from "@/lib/product-form";
import { getNextSortOrder } from "@/services/products";

const AdminProductNew = () => {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  usePageMeta({
    title: "Novo produto",
    description: "Cadastre um novo achadinho no catálogo do Garimpei!.",
  });

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const sortOrder = await getNextSortOrder();

      await createProduct.mutateAsync({
        ...toProductPayload(values),
        slug: values.slug.trim(),
        name: values.name.trim(),
        is_demo: false,
        sort_order: sortOrder,
      });

      toast.success("Produto cadastrado com sucesso.");
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(friendlyError(error, "Não foi possível cadastrar o produto."));
    }
  };

  return (
    <AdminLayout
      title="Novo produto"
      description="Preencha os dados do achadinho. Depois de salvar, ele aparece na vitrine conforme o status de publicação."
      actions={
        <Button variant="outline" asChild>
          <Link to="/admin">
            <Plus aria-hidden="true" />
            Ver todos
          </Link>
        </Button>
      }
    >
      <ProductForm
        submitLabel="Cadastrar produto"
        isSubmitting={createProduct.isPending}
        onSubmit={(values) => void handleSubmit(values)}
      />
    </AdminLayout>
  );
};

export default AdminProductNew;
