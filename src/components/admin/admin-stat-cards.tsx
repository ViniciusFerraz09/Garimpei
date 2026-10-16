import { Eye, EyeOff, Package, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminStats } from "@/services/products";

interface AdminStatCardsProps {
  stats?: AdminStats;
  isLoading?: boolean;
}

export const AdminStatCards = ({ stats, isLoading = false }: AdminStatCardsProps) => {
  const cards = [
    {
      key: "total",
      label: "Produtos cadastrados",
      value: stats?.total ?? 0,
      icon: Package,
      tone: "bg-primary/25 text-foreground",
    },
    {
      key: "published",
      label: "Publicados",
      value: stats?.published ?? 0,
      icon: Eye,
      tone: "bg-success/10 text-success",
    },
    {
      key: "drafts",
      label: "Não publicados",
      value: stats?.drafts ?? 0,
      icon: EyeOff,
      tone: "bg-secondary text-muted-foreground",
    },
    {
      key: "featured",
      label: "Em destaque",
      value: stats?.featured ?? 0,
      icon: Star,
      tone: "bg-accent text-foreground",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.key} className="flex items-center gap-4 p-5">
            <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${card.tone}`}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {card.label}
              </p>
              {isLoading ? (
                <Skeleton className="mt-1 h-7 w-12" />
              ) : (
                <p className="text-2xl font-extrabold tracking-tight text-foreground">
                  {card.value}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
