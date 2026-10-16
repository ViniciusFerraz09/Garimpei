import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { CATEGORIES } from "@/lib/categories";

export const CategoryShortcuts = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
    {CATEGORIES.map((category) => {
      const Icon = category.icon;
      return (
        <Link
          key={category.slug}
          to={`/categoria/${category.slug}`}
          className="group flex flex-col items-center gap-2 rounded-card border border-border bg-card p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:garimpei-shadow-card-hover"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-accent text-foreground transition-colors group-hover:bg-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-foreground">{category.label}</span>
          <ArrowRight
            className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      );
    })}
  </div>
);
