import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) => (
  <div
    className={cn(
      "mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
      className,
    )}
  >
    <div className="space-y-1.5">
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);
