import { Cpu, Home, Package, Shirt, Sparkles, Watch, type LucideIcon } from "lucide-react";

export type CategorySlug =
  | "tecnologia"
  | "casa"
  | "beleza"
  | "moda"
  | "acessorios"
  | "utilidades";

export interface CategoryDefinition {
  slug: CategorySlug;
  label: string;
  description: string;
  icon: LucideIcon;
}

/** Lista fixa de categorias — espelha a restrição da tabela products. */
export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: "tecnologia",
    label: "Tecnologia",
    description: "Fones, suportes, cabos e acessórios para o dia a dia digital.",
    icon: Cpu,
  },
  {
    slug: "casa",
    label: "Casa",
    description: "Itens que organizam, iluminam e deixam a casa mais prática.",
    icon: Home,
  },
  {
    slug: "beleza",
    label: "Beleza",
    description: "Cuidados pessoais, maquiagem e ferramentas de rotina.",
    icon: Sparkles,
  },
  {
    slug: "moda",
    label: "Moda",
    description: "Peças e acessórios versáteis para o cotidiano.",
    icon: Shirt,
  },
  {
    slug: "acessorios",
    label: "Acessórios",
    description: "Complementos úteis que facilitam o dia a dia.",
    icon: Watch,
  },
  {
    slug: "utilidades",
    label: "Utilidades",
    description: "Achadinhos práticos que resolvem pequenas tarefas.",
    icon: Package,
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);

export const getCategory = (slug?: string | null): CategoryDefinition | null =>
  CATEGORIES.find((category) => category.slug === slug) ?? null;

export const getCategoryLabel = (slug?: string | null): string =>
  getCategory(slug)?.label ?? "Outros";
