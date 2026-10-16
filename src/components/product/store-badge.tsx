import { Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getStoreLabel } from "@/lib/stores";
import { cn } from "@/lib/utils";

interface StoreBadgeProps {
  store?: string | null;
  storeName?: string | null;
  className?: string;
}

export const StoreBadge = ({ store, storeName, className }: StoreBadgeProps) => (
  <Badge variant="store" className={cn("gap-1", className)}>
    <Store aria-hidden="true" />
    {getStoreLabel(store, storeName)}
  </Badge>
);
