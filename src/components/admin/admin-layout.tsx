import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAccess } from "@/hooks/use-admin-guard";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { to: "/admin", label: "Painel", icon: LayoutDashboard, end: true },
  { to: "/admin/produtos/novo", label: "Novo produto", icon: PackagePlus, end: false },
];

const AdminLoading = () => (
  <div className="grid min-h-screen place-items-center bg-secondary/40 p-6">
    <div className="w-full max-w-sm space-y-3">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const AdminDenied = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da conta.");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 p-6">
      <Card className="max-w-md space-y-3 p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" aria-hidden="true" />
        </span>
        <h1 className="text-xl font-bold text-foreground">Acesso não autorizado</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Esta conta não tem permissão de administrador. Entre com o e-mail autorizado ou fale com
          o responsável pelo Garimpei!.
        </p>
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
          <Button variant="brand" onClick={() => void handleSignOut()}>
            <LogOut aria-hidden="true" />
            Sair da conta
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Voltar para a vitrine</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface AdminLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const AdminLayout = ({ title, description, actions, children }: AdminLayoutProps) => {
  const { status } = useAdminAccess();
  const { user } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "anonymous") {
      navigate("/admin/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [status, navigate, location.pathname]);

  if (status === "loading") return <AdminLoading />;
  if (status === "anonymous") return <AdminLoading />;
  if (status === "denied") return <AdminDenied />;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da conta.");
    navigate("/admin/login", { replace: true });
  };

  const navLinks = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1" aria-label="Navegação do painel">
      {ADMIN_NAV.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary",
              )
            }
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        );
      })}

      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        Ver a vitrine
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 space-y-6 rounded-card border border-border bg-card p-5 garimpei-shadow-card">
            <Logo size="md" />
            <div className="rounded-xl bg-secondary p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Conta
              </p>
              <p className="truncate text-sm font-semibold text-foreground">{user?.email}</p>
            </div>
            {navLinks()}
            <Button variant="outline" className="w-full" onClick={() => void handleSignOut()}>
              <LogOut aria-hidden="true" />
              Sair da conta
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-3 rounded-card border border-border bg-card p-5 garimpei-shadow-card">
            <div className="flex items-start gap-3">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu do painel">
                    <Menu aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[86%] max-w-sm p-5">
                  <SheetHeader className="text-left">
                    <SheetTitle>Painel Garimpei!</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {navLinks(() => setIsMenuOpen(false))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => void handleSignOut()}
                    >
                      <LogOut aria-hidden="true" />
                      Sair da conta
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>

            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </header>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
