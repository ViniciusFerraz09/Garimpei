import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) => (
  <Card
    className={cn(
      "flex flex-col items-center gap-3 border-dashed bg-secondary/40 px-6 py-12 text-center",
      className,
    )}
  >
    <span className="grid size-12 place-items-center rounded-2xl bg-primary/25 text-foreground">
      <Icon className="size-6" aria-hidden="true" />
    </span>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
    {actionLabel && onAction && (
      <Button variant="brand" className="mt-2" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Card>
);
