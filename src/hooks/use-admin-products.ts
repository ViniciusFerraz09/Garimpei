import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProduct,
  deleteProduct,
  duplicateProduct,
  getAdminStats,
  getProductById,
  listAdminProducts,
  swapSortOrder,
  updateProduct,
  updateProductFlags,
  type AdminStatusFilter,
} from "@/services/products";
import type { Product, ProductInsert, ProductUpdate } from "@/types/product";

export const adminKeys = {
  list: (status: AdminStatusFilter, query: string) =>
    ["products", "admin", "list", status, query] as const,
  stats: ["products", "admin", "stats"] as const,
  detail: (id: string) => ["products", "admin", "detail", id] as const,
};

const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: ["products"] });
};

export const useAdminProducts = (status: AdminStatusFilter = "todos", query = "") =>
  useQuery({
    queryKey: adminKeys.list(status, query),
    queryFn: () => listAdminProducts({ status, query }),
  });

export const useAdminStats = () =>
  useQuery({
    queryKey: adminKeys.stats,
    queryFn: getAdminStats,
  });

export const useAdminProduct = (id?: string) =>
  useQuery({
    queryKey: adminKeys.detail(id ?? ""),
    queryFn: () => getProductById(id as string),
    enabled: Boolean(id),
  });

export const useCreateProduct = () => {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (input: ProductInsert) => createProduct(input),
    onSuccess: invalidate,
  });
};

export const useUpdateProduct = () => {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductUpdate }) =>
      updateProduct(id, input),
    onSuccess: invalidate,
  });
};

export const useDeleteProduct = () => {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: invalidate,
  });
};

export const useDuplicateProduct = () => {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (product: Product) => duplicateProduct(product),
    onSuccess: invalidate,
  });
};

export const useToggleProductFlag = () => {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({
      id,
      flags,
    }: {
      id: string;
      flags: Pick<ProductUpdate, "featured" | "published">;
    }) => updateProductFlags(id, flags),
    onSuccess: invalidate,
  });
};

export const useReorderProduct = () => {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({
      current,
      neighbor,
    }: {
      current: Pick<Product, "id" | "sort_order">;
      neighbor: Pick<Product, "id" | "sort_order">;
    }) => swapSortOrder(current, neighbor),
    onSuccess: invalidate,
  });
};
