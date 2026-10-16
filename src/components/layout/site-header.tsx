import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, Heart, Menu, Search } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFavorites } from "@/hooks/use-favorites";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Início", end: true },
  { to: "/produtos", label: "Achadinhos", end: false },
  { to: "/favoritos", label: "Favoritos", end: false },
  { to: "/sobre", label: "Sobre", end: false },
];

export const SiteHeader = () => {
  const navigate = useNavigate();
  const { count } = useFavorites();
  const [term, setTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = term.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    navigate(`/produtos${params.size > 0 ? `?${params.toString()}` : ""}`);
    setTerm("");
    setIsMenuOpen(false);
  };

  const searchField = (
    <form onSubmit={goToSearch} role="search" className="relative w-full">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Buscar achadinhos..."
        aria-label="Buscar achadinhos"
        className="h-10 rounded-full border-transparent bg-secondary pl-9 pr-24 focus-visible:border-primary"
      />
      <Button
        type="submit"
        variant="brand"
        size="sm"
        className="absolute right-1 top-1/2 h-8 -translate-y-1/2"
      >
        Buscar
      </Button>
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center gap-3">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Abrir menu de navegação"
            >
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[86%] max-w-sm p-0">
            <SheetHeader className="border-b border-border p-5 text-left">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SheetDescription className="sr-only">
                Navegue pelas páginas e categorias do Garimpei!.
              </SheetDescription>
              <Logo size="md" />
            </SheetHeader>

            <nav className="flex flex-col p-3" aria-label="Navegação principal">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-foreground hover:bg-secondary",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <p className="px-3 pb-1 pt-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Categorias
              </p>
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <NavLink
                    key={category.slug}
                    to={`/categoria/${category.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                    {category.label}
                  </NavLink>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          to="/"
          className="shrink-0 rounded-xl focus-visible:outline-none"
          aria-label="Garimpei! — página inicial"
        >
          <Logo />
        </Link>

        <div className="hidden flex-1 items-center gap-2 lg:flex">
          <nav className="ml-4 flex items-center gap-1" aria-label="Navegação principal">
            {NAV_ITEMS.slice(0, 2).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  Categorias
                  <ChevronDown aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <DropdownMenuItem key={category.slug} asChild>
                      <Link to={`/categoria/${category.slug}`} className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                        {category.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              to="/sobre"
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              Sobre
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="w-72">{searchField}</div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label={`Favoritos: ${count} ${count === 1 ? "item salvo" : "itens salvos"}`}
          >
            <Link to="/favoritos" className="relative">
              <Heart aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>

      <div className="container pb-3 lg:hidden">{searchField}</div>
    </header>
  );
};
