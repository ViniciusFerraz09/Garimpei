import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2, LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAccess } from "@/hooks/use-admin-guard";
import { usePageMeta } from "@/hooks/use-page-meta";

const translateSignInError = (message: string): string => {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (normalized.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (normalized.includes("too many requests")) return "Muitas tentativas. Aguarde um instante.";
  return "Não foi possível entrar agora. Tente novamente.";
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAdminAccess();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  usePageMeta({
    title: "Acesso administrativo",
    description: "Área restrita da curadoria do Garimpei!.",
  });

  useEffect(() => {
    if (status === "granted") {
      const redirectTo =
        (location.state as { from?: string } | null)?.from ?? "/admin";
      navigate(redirectTo, { replace: true });
    }
  }, [status, navigate, location.state]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(translateSignInError(signInError.message));
      setIsSubmitting(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      setError("Não foi possível confirmar sua sessão. Tente novamente.");
      setIsSubmitting(false);
      return;
    }

    const { data: adminRow } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!adminRow) {
      await supabase.auth.signOut();
      setError("Esta conta não tem permissão de administrador.");
      setIsSubmitting(false);
      return;
    }

    toast.success("Bem-vindo ao painel do Garimpei!.");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="lg" />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Painel administrativo
            </h1>
            <p className="text-sm text-muted-foreground">
              Área restrita à curadoria. Entre com o e-mail autorizado.
            </p>
          </div>
        </div>

        <Card className="space-y-5 p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">E-mail</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@exemplo.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-senha">Senha</Label>
              <Input
                id="admin-senha"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
              />
            </div>

            {error && (
              <p
                className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm font-semibold text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <LogIn aria-hidden="true" />
              )}
              {isSubmitting ? "Entrando..." : "Entrar no painel"}
            </Button>
          </form>

          <div className="space-y-3 border-t border-border pt-4 text-sm">
            <p className="flex items-start gap-2 text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
              <span>
                Não existe cadastro público de administradores. O primeiro acesso é liberado por
                convite.
              </span>
            </p>
            <Link
              to="/admin/primeiro-acesso"
              className="inline-flex items-center gap-1.5 font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
            >
              <LockKeyhole className="size-3.5" aria-hidden="true" />
              Tenho um convite de primeiro acesso
            </Link>
          </div>
        </Card>

        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link to="/">Voltar para a vitrine</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
