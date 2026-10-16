import { useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { AdminStatCards } from "@/components/admin/admin-stat-cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminProducts,
  useAdminStats,
  useDeleteProduct,
  useDuplicateProduct,
  useReorderProduct,
  useToggleProductFlag,
} from "@/hooks/use-admin-products";
import { usePageMeta } from "@/hooks/use-page-meta";
import { friendlyError } from "@/lib/errors";
import type { AdminStatusFilter } from "@/services/products";
import type { Product } from "@/types/product";

const STATUS_OPTIONS: { value: AdminStatusFilter; label: string }[] = [
  { value: "todos", label: "Todos os produtos" },
  { value: "publicados", label: "Somente publicados" },
  { value: "rascunhos", label: "Somente não publicados" },
  { value: "destaques", label: "Somente em destaque" },
];

const AdminDashboard = () => {
  const [status, setStatus] = useState<AdminStatusFilter>("todos");
  const [search, setSearch] = useState("");

  const stats = useAdminStats();
  const products = useAdminProducts(status, search);

  const toggleFlag = useToggleProductFlag();
  const duplicate = useDuplicateProduct();
  const remove = useDeleteProduct();
  const reorder = useReorderProduct();

  const isBusy =
    toggleFlag.isPending || duplicate.isPending || remove.isPending || reorder.isPending;

  usePageMeta({
    title: "Painel administrativo",
    description: "Gerencie os produtos e links de afiliado do Garimpei!.",
  });

  const items = products.data ?? [];

  const handleMove = (product: Product, direction: "up" | "down") => {
    const index = items.findIndex((item) => item.id === product.id);
    const neighbor = items[direction === "up" ? index - 1 : index + 1];
    if (!neighbor) return;

    reorder.mutate(
      { current: product, neighbor },
      {
        onSuccess: () => toast.success("Ordem atualizada."),
        onError: (error) =>
          toast.error(friendlyError(error, "Não foi possível reordenar os produtos.")),
      },
    );
  };

  const handleTogglePublish = (product: Product) => {
    toggleFlag.mutate(
      { id: product.id, flags: { published: !product.published } },
      {
        onSuccess: () =>
          toast.success(
            product.published
              ? `“${product.name}” saiu da vitrine.`
              : `“${product.name}” está publicado na vitrine.`,
          ),
        onError: (error) =>
          toast.error(friendlyError(error, "Não foi possível alterar a publicação.")),
      },
    );
  };

  const handleToggleFeatured = (product: Product) => {
    toggleFlag.mutate(
      { id: product.id, flags: { featured: !product.featured } },
      {
        onSuccess: () =>
          toast.success(
            product.featured
              ? `Removemos o destaque de “${product.name}”.`
              : `“${product.name}” agora é destaque.`,
          ),
        onError: (error) =>
          toast.error(friendlyError(error, "Não foi possível alterar o destaque.")),
      },
    );
  };

  const handleDuplicate = (product: Product) => {
    duplicate.mutate(product, {
      onSuccess: (copy) =>
        toast.success(`Cópia criada como rascunho: “${copy.name}”.`),
      onError: (error) =>
        toast.error(friendlyError(error, "Não foi possível duplicar o produto.")),
    });
  };

  const handleDelete = (product: Product) => {
    remove.mutate(product.id, {
      onSuccess: () => toast.success(`“${product.name}” foi excluído.`),
      onError: (error) =>
        toast.error(friendlyError(error, "Não foi possível excluir o produto.")),
    });
  };

  return (
    <AdminLayout
      title="Painel administrativo"
      description="Cadastre, publique e destaque os achadinhos da vitrine. As mudanças aparecem no site na hora."
      actions={
        <Button variant="brand" asChild>
          <Link to="/admin/produtos/novo">
            <Plus aria-hidden="true" />
            Novo produto
          </Link>
        </Button>
      }
    >
      <AdminStatCards stats={stats.data} isLoading={stats.isLoading} />

      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome ou descrição"
              aria-label="Buscar produtos no painel"
              className="pl-9"
            />
          </div>

          <div className="sm:w-64">
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as AdminStatusFilter)}
            >
              <SelectTrigger aria-label="Filtrar produtos por situação">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {products.isError ? (
          <Card className="flex flex-col items-center gap-3 border-dashed bg-secondary/40 p-8 text-center">
            <h2 className="text-base font-bold text-foreground">
              Não conseguimos carregar os produtos
            </h2>
            <p className="text-sm text-muted-foreground">
              Verifique sua conexão e tente novamente.
            </p>
            <Button variant="brand" onClick={() => void products.refetch()}>
              Tentar novamente
            </Button>
          </Card>
        ) : items.length === 0 && !products.isLoading ? (
          <EmptyState
            icon={PackageSearch}
            title="Nenhum produto encontrado"
            description={
              search || status !== "todos"
                ? "Nenhum produto corresponde à busca ou ao filtro escolhido."
                : "Cadastre o primeiro achadinho para começar a montar a vitrine."
            }
          />
        ) : (
          <AdminProductsTable
            products={items}
            isLoading={products.isLoading}
            isBusy={isBusy}
            onMove={handleMove}
            onTogglePublish={handleTogglePublish}
            onToggleFeatured={handleToggleFeatured}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        Os produtos de exemplo vieram com o catálogo inicial. Edite-os com os dados reais ou exclua
        quando não precisar mais.
      </p>
    </AdminLayout>
  );
};

export default AdminDashboard;
