import { Link } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { AffiliateDisclosure } from "@/components/product/affiliate-disclosure";
import { CATEGORIES } from "@/lib/categories";
import { siteConfig } from "@/lib/site-config";

export const SiteFooter = () => (
  <footer className="mt-16 border-t border-border bg-secondary/50">
    <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-4">
        <Logo />
        <p className="text-sm leading-relaxed text-muted-foreground">{siteConfig.tagline}</p>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            {siteConfig.contactEmail}
            <span className="block text-xs">{siteConfig.contactNote}</span>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Navegação</h2>
        <ul className="space-y-2 text-sm">
          {[
            { to: "/", label: "Início" },
            { to: "/produtos", label: "Todos os achadinhos" },
            { to: "/favoritos", label: "Meus favoritos" },
            { to: "/sobre", label: "Sobre o Garimpei!" },
          ].map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Categorias</h2>
        <ul className="space-y-2 text-sm">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                to={`/categoria/${category.slug}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Institucional</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              to="/politica-de-privacidade"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Política de privacidade
            </Link>
          </li>
          <li>
            <Link
              to="/termos-de-uso"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Termos de uso
            </Link>
          </li>
          <li>
            <Link
              to="/sobre"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Divulgação de afiliado
            </Link>
          </li>
        </ul>

        <div className="rounded-xl border border-border bg-background p-3">
          <AffiliateDisclosure />
        </div>
      </div>
    </div>

    <div className="border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} Garimpei!. Conteúdo informativo sobre produtos de lojas
          parceiras.
        </p>
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:text-foreground"
        >
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          Acesso administrativo
        </Link>
      </div>
    </div>
  </footer>
);
