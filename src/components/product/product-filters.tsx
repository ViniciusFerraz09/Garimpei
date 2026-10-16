import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import {
  PRICE_RANGES,
  SORT_OPTIONS,
  countActiveFilters,
  type ProductFilters,
  type SortOption,
} from "@/lib/product-filters";
import { STORES } from "@/lib/stores";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = "todas";
const ALL_STORES = "todas";
const ALL_PRICES = "todos";

interface ProductFiltersProps {
  filters: ProductFilters;
  onChange: (next: ProductFilters) => void;
  onClear: () => void;
  resultCount?: number;
  hideCategory?: boolean;
  className?: string;
}

export const ProductFilters = ({
  filters,
  onChange,
  onClear,
  resultCount,
  hideCategory = false,
  className,
}: ProductFiltersProps) => {
  const [term, setTerm] = useState(filters.query);
  const [showFilters, setShowFilters] = useState(false);

  const onChangeRef = useRef(onChange);
  const filtersRef = useRef(filters);

  useEffect(() => {
    onChangeRef.current = onChange;
    filtersRef.current = filters;
  });

  useEffect(() => {
    setTerm(filters.query);
  }, [filters.query]);

  // Busca com pequena espera para não consultar o banco a cada tecla.
  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed === filtersRef.current.query) return;

    const timer = setTimeout(() => {
      onChangeRef.current({ ...filtersRef.current, query: trimmed });
    }, 400);

    return () => clearTimeout(timer);
  }, [term]);

  const activeFilters = countActiveFilters(filters);
  const secondaryFilters =
    (filters.category ? 1 : 0) +
    (filters.store ? 1 : 0) +
    (filters.price ? 1 : 0) +
    (filters.sort !== "destaques" ? 1 : 0);

  const resultLabel =
    typeof resultCount === "number"
      ? `${resultCount} ${resultCount === 1 ? "achadinho encontrado" : "achadinhos encontrados"}`
      : null;

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Buscar por nome ou descrição"
            aria-label="Buscar produtos por nome ou descrição"
            className="rounded-full border-transparent bg-secondary pl-9 pr-10 focus-visible:border-primary"
          />
          {term && (
            <Button
              type="button"
              variant="ghost"
              size="iconSm"
              onClick={() => setTerm("")}
              aria-label="Limpar busca"
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </div>

        <div
          className={cn(
            "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
            !showFilters && "hidden sm:grid",
          )}
        >
          {!hideCategory && (
            <div className="space-y-1.5">
              <label
                htmlFor="filtro-categoria"
                className="text-xs font-semibold text-muted-foreground"
              >
                Categoria
              </label>
              <Select
                value={filters.category || ALL_CATEGORIES}
                onValueChange={(value) =>
                  onChange({
                    ...filters,
                    category: value === ALL_CATEGORIES ? "" : value,
                  })
                }
              >
                <SelectTrigger id="filtro-categoria" aria-label="Filtrar por categoria">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES}>Todas as categorias</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="filtro-loja" className="text-xs font-semibold text-muted-foreground">
              Loja
            </label>
            <Select
              value={filters.store || ALL_STORES}
              onValueChange={(value) =>
                onChange({ ...filters, store: value === ALL_STORES ? "" : value })
              }
            >
              <SelectTrigger id="filtro-loja" aria-label="Filtrar por loja">
                <SelectValue placeholder="Todas as lojas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STORES}>Todas as lojas</SelectItem>
                {STORES.map((store) => (
                  <SelectItem key={store.slug} value={store.slug}>
                    {store.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="filtro-preco" className="text-xs font-semibold text-muted-foreground">
              Faixa de preço
            </label>
            <Select
              value={filters.price || ALL_PRICES}
              onValueChange={(value) =>
                onChange({ ...filters, price: value === ALL_PRICES ? "" : value })
              }
            >
              <SelectTrigger id="filtro-preco" aria-label="Filtrar por faixa de preço">
                <SelectValue placeholder="Qualquer preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_PRICES}>Qualquer preço</SelectItem>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="filtro-ordem" className="text-xs font-semibold text-muted-foreground">
              Ordenar por
            </label>
            <Select
              value={filters.sort}
              onValueChange={(value) =>
                onChange({ ...filters, sort: value as SortOption })
              }
            >
              <SelectTrigger id="filtro-ordem" aria-label="Ordenar resultados">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {resultLabel ?? "Ajuste os filtros para encontrar seu achadinho."}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 sm:hidden"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((current) => !current)}
            >
              <SlidersHorizontal aria-hidden="true" />
              Filtros
              {secondaryFilters > 0 && (
                <Badge variant="default" className="px-1.5 py-0">
                  {secondaryFilters}
                </Badge>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={activeFilters === 0}
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
