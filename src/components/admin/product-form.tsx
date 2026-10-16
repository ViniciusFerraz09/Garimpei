import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ProductImageField } from "@/components/admin/product-image-field";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import {
  productFormResolver,
  toProductFormValues,
  type ProductFormValues,
} from "@/lib/product-form";
import { STORES, type StoreSlug } from "@/lib/stores";
import { slugify } from "@/lib/slug";
import type { Product } from "@/types/product";

interface ProductFormProps {
  product?: Product;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: ProductFormValues) => void;
}

export const ProductForm = ({
  product,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: productFormResolver,
    defaultValues: toProductFormValues(product),
  });

  const [isSlugLocked, setIsSlugLocked] = useState(Boolean(product));
  const name = watch("name");
  const store = watch("store");
  const imageUrl = watch("imageUrl");
  const category = watch("category");
  const featured = watch("featured");
  const published = watch("published");
  const currentSlug = watch("slug");

  useEffect(() => {
    if (isSlugLocked) return;
    setValue("slug", slugify(name ?? ""));
  }, [name, isSlugLocked, setValue]);

  const fieldError = (message?: string) =>
    message ? (
      <p className="text-xs font-semibold text-destructive" role="alert">
        {message}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Card className="space-y-4 p-5">
        <h2 className="text-base font-bold text-foreground">Informações principais</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="produto-nome">Nome do produto</Label>
            <Input
              id="produto-nome"
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
              placeholder="Ex.: Suporte de celular articulado"
            />
            {fieldError(errors.name?.message)}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="produto-slug">Endereço na URL (slug)</Label>
            <Input
              id="produto-slug"
              {...register("slug", {
                onChange: () => setIsSlugLocked(true),
              })}
              aria-invalid={Boolean(errors.slug)}
              placeholder="suporte-de-celular-articulado"
            />
            <p className="text-xs text-muted-foreground">
              Fica assim: /produto/{currentSlug || "endereco-do-produto"}
            </p>
            {fieldError(errors.slug?.message)}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="produto-descricao">Descrição</Label>
            <Textarea
              id="produto-descricao"
              rows={4}
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
              placeholder="Explique em poucas palavras por que esse achadinho vale a pena."
            />
            {fieldError(errors.description?.message)}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="produto-categoria">Categoria</Label>
            <Select
              value={category}
              onValueChange={(value) => setValue("category", value as CategorySlug)}
            >
              <SelectTrigger id="produto-categoria" aria-label="Categoria do produto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((item) => (
                  <SelectItem key={item.slug} value={item.slug}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="produto-etiqueta">Etiqueta promocional (opcional)</Label>
            <Input
              id="produto-etiqueta"
              {...register("badgeLabel")}
              aria-invalid={Boolean(errors.badgeLabel)}
              placeholder="Ex.: Achadinho"
            />
            {fieldError(errors.badgeLabel?.message)}
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="text-base font-bold text-foreground">Loja e oferta</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="produto-loja">Loja</Label>
            <Select
              value={store}
              onValueChange={(value) => setValue("store", value as StoreSlug)}
            >
              <SelectTrigger id="produto-loja" aria-label="Loja do produto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STORES.map((item) => (
                  <SelectItem key={item.slug} value={item.slug}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {store === "outra" && (
            <div className="space-y-1.5">
              <Label htmlFor="produto-loja-nome">Nome da loja</Label>
              <Input
                id="produto-loja-nome"
                {...register("storeName")}
                aria-invalid={Boolean(errors.storeName)}
                placeholder="Ex.: Loja parceira"
              />
              {fieldError(errors.storeName?.message)}
            </div>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="produto-link">Link de afiliado</Label>
            <Input
              id="produto-link"
              inputMode="url"
              {...register("affiliateUrl")}
              aria-invalid={Boolean(errors.affiliateUrl)}
              placeholder="https://s.shopee.com.br/..."
            />
            <p className="text-xs text-muted-foreground">
              Sem link cadastrado, o botão “Ver oferta” fica desativado no card do produto.
            </p>
            {fieldError(errors.affiliateUrl?.message)}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="produto-preco">Preço atual (opcional)</Label>
            <Input
              id="produto-preco"
              inputMode="decimal"
              {...register("price")}
              aria-invalid={Boolean(errors.price)}
              placeholder="89,90"
            />
            {fieldError(errors.price?.message)}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="produto-preco-original">Preço original (opcional)</Label>
            <Input
              id="produto-preco-original"
              inputMode="decimal"
              {...register("originalPrice")}
              aria-invalid={Boolean(errors.originalPrice)}
              placeholder="129,90"
            />
            <p className="text-xs text-muted-foreground">
              Só preencha quando o valor antigo for verificável — o desconto é calculado a partir
              dele.
            </p>
            {fieldError(errors.originalPrice?.message)}
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <ProductImageField
          value={imageUrl}
          onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })}
          category={category}
          name={name || "Produto"}
          error={errors.imageUrl?.message}
        />
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="text-base font-bold text-foreground">Exibição</h2>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary p-4">
          <div>
            <Label htmlFor="produto-destaque" className="text-sm font-semibold">
              Produto em destaque
            </Label>
            <p className="text-xs text-muted-foreground">
              Aparece nas seções de destaque da vitrine.
            </p>
          </div>
          <Switch
            id="produto-destaque"
            checked={featured}
            onCheckedChange={(checked) => setValue("featured", checked)}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary p-4">
          <div>
            <Label htmlFor="produto-publicado" className="text-sm font-semibold">
              Produto publicado
            </Label>
            <p className="text-xs text-muted-foreground">
              Desligado, o produto fica salvo apenas no painel.
            </p>
          </div>
          <Switch
            id="produto-publicado"
            checked={published}
            onCheckedChange={(checked) => setValue("published", checked)}
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="brand" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Save aria-hidden="true" />
          )}
          {isSubmitting ? "Salvando..." : submitLabel}
        </Button>
        <Button type="button" variant="ghost" size="lg" asChild>
          <Link to="/admin">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
};
