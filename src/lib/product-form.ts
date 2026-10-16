import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { isSafeExternalUrl } from "@/lib/affiliate";
import type { CategorySlug } from "@/lib/categories";
import type { StoreSlug } from "@/lib/stores";
import type { Product, ProductUpdate } from "@/types/product";

/** Converte "89,90" para 89.9 e devolve null quando o campo está vazio. */
export const parseDecimal = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : null;
};

const decimal = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{1,7}(?:[.,]\d{1,2})?$/.test(value),
      `${label} deve ser um valor como 89,90.`,
    );

const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe pelo menos 3 caracteres.")
    .max(140, "Use no máximo 140 caracteres."),
  slug: z
    .string()
    .trim()
    .min(3, "Informe o endereço do produto.")
    .max(80, "Use no máximo 80 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífen.",
    ),
  description: z.string().trim().max(600, "Use no máximo 600 caracteres."),
  category: z.enum([
    "tecnologia",
    "casa",
    "beleza",
    "moda",
    "acessorios",
    "utilidades",
  ]),
  store: z.enum(["shopee", "aliexpress", "outra"]),
  storeName: z.string().trim().max(60, "Use no máximo 60 caracteres."),
  affiliateUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isSafeExternalUrl(value),
      "Informe um link válido começando com http:// ou https://",
    ),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isSafeExternalUrl(value),
      "Informe uma URL de imagem válida (http:// ou https://)",
    ),
  price: decimal("O preço"),
  originalPrice: decimal("O preço original"),
  badgeLabel: z.string().trim().max(24, "Use no máximo 24 caracteres."),
  featured: z.boolean(),
  published: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productFormResolver = zodResolver(
  productFormSchema.superRefine((values, ctx) => {
    if (values.store === "outra" && values.storeName.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["storeName"],
        message: "Informe o nome da loja.",
      });
    }

    const price = parseDecimal(values.price);
    const originalPrice = parseDecimal(values.originalPrice);
    if (price !== null && originalPrice !== null && originalPrice < price) {
      ctx.addIssue({
        code: "custom",
        path: ["originalPrice"],
        message: "O preço original deve ser maior ou igual ao preço atual.",
      });
    }
  }),
);

/** Converte os campos do formulário no formato salvo no banco. */
export const toProductPayload = (values: ProductFormValues): ProductUpdate => ({
  name: values.name.trim(),
  slug: values.slug.trim(),
  description: values.description.trim() || null,
  category: values.category,
  store: values.store,
  store_name: values.store === "outra" ? values.storeName.trim() : null,
  affiliate_url: values.affiliateUrl.trim() || null,
  image_url: values.imageUrl.trim() || null,
  price: parseDecimal(values.price),
  original_price: parseDecimal(values.originalPrice),
  badge_label: values.badgeLabel.trim() || null,
  featured: values.featured,
  published: values.published,
});

export const toProductFormValues = (product?: Product): ProductFormValues => ({
  name: product?.name ?? "",
  slug: product?.slug ?? "",
  description: product?.description ?? "",
  category: (product?.category as CategorySlug | undefined) ?? "tecnologia",
  store: (product?.store as StoreSlug | undefined) ?? "shopee",
  storeName: product?.store_name ?? "",
  affiliateUrl: product?.affiliate_url ?? "",
  imageUrl: product?.image_url ?? "",
  price:
    typeof product?.price === "number" ? String(product.price).replace(".", ",") : "",
  originalPrice:
    typeof product?.original_price === "number"
      ? String(product.original_price).replace(".", ",")
      : "",
  badgeLabel: product?.badge_label ?? "",
  featured: product?.featured ?? false,
  published: product?.published ?? true,
});
