import { Search, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface LogoProps {
  className?: string;
  showMark?: boolean;
  size?: "sm" | "md" | "lg";
}

const markSizes = {
  sm: "size-7 rounded-lg",
  md: "size-9 rounded-xl",
  lg: "size-11 rounded-2xl",
} as const;

const textSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
} as const;

/** Logotipo tipográfico original com símbolo de descoberta. */
export const Logo = ({ className, showMark = true, size = "md" }: LogoProps) => {
  const [word, mark] = siteConfig.name.split(/(?=!)/);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {showMark && (
        <span
          aria-hidden="true"
          className={cn(
            "relative grid shrink-0 place-items-center bg-primary text-primary-foreground",
            markSizes[size],
          )}
        >
          <Search className="size-4" strokeWidth={2.75} />
          <Sparkles
            className="absolute -right-1 -top-1 size-3.5 text-primary-foreground drop-shadow-sm"
            strokeWidth={2.5}
          />
        </span>
      )}
      <span
        className={cn(
          "font-extrabold leading-none tracking-tight text-foreground",
          textSizes[size],
        )}
      >
        {word}
        <span className="text-foreground">{mark}</span>
      </span>
    </span>
  );
};
