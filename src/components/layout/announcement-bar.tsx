import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/** Aviso de curadoria — sem contagem regressiva nem urgência artificial. */
export const AnnouncementBar = () => (
  <div className="border-b border-primary/30 bg-accent">
    <div className="container flex flex-col items-center gap-1 py-2 text-center text-xs sm:flex-row sm:justify-center sm:gap-2 sm:text-sm">
      <Sparkles className="hidden size-3.5 text-foreground sm:block" aria-hidden="true" />
      <span className="font-medium text-foreground">
        Curadoria própria: cada achadinho é conferido antes de virar oferta.
      </span>
      <Link
        to="/produtos"
        className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-2 transition-colors hover:decoration-foreground"
      >
        Ver achadinhos
      </Link>
    </div>
  </div>
);
