import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, KeyRound, Loader2, TriangleAlert } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/use-page-meta";
import { readFunctionErrorMessage } from "@/lib/errors";

interface ProvisionResponse {
  ok?: boolean;
  message?: string;
}

const FirstAccess = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  usePageMeta({
    title: "Primeiro acesso do administrador",
    description: "Ative o acesso administrativo do Garimpei! usando o convite recebido.",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As duas senhas precisam ser iguais.");
      return;
    }

    setIsSubmitting(true);

    const { data, error: invokeError } = await supabase.functions.invoke(
      "admin-provision",
      {
        body: { email: email.trim(), token: token.trim(), password },
        headers: { "Content-Type": "application/json" },
      },
    );

    const payload = (data ?? null) as ProvisionResponse | null;

    if (invokeError || !payload?.ok) {
      const backendMessage = await readFunctionErrorMessage(invokeError);
      setError(
        payload?.message ??
          backendMessage ??
          "Não foi possível liberar o acesso. Confira os dados e tente novamente.",
      );
      setIsSubmitting(false);
      return;
    }

    setSuccess(payload.message ?? "Acesso criado. Agora entre com seu e-mail e senha.");
    setPassword("");
    setConfirmPassword("");
    setToken("");
    setIsSubmitting(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="lg" />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Primeiro acesso
            </h1>
            <p className="text-sm text-muted-foreground">
              Use o e-mail autorizado e o código do convite para criar sua senha.
            </p>
          </div>
        </div>

        <Card className="space-y-5 p-6">
          {success ? (
            <div className="space-y-4 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-success/10 text-success">
                <BadgeCheck className="size-6" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-foreground">{success}</p>
              <Button variant="brand" size="lg" className="w-full" asChild>
                <Link to="/admin/login">Ir para o login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="primeiro-email">E-mail autorizado</Label>
                <Input
                  id="primeiro-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@exemplo.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="primeiro-codigo">Código do convite</Label>
                <Input
                  id="primeiro-codigo"
                  required
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="Código recebido"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="primeiro-senha">Crie uma senha</Label>
                <Input
                  id="primeiro-senha"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="primeiro-senha-2">Repita a senha</Label>
                <Input
                  id="primeiro-senha-2"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repita a senha"
                />
              </div>

              {error && (
                <p
                  className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm font-semibold text-destructive"
                  role="alert"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
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
                  <KeyRound aria-hidden="true" />
                )}
                {isSubmitting ? "Ativando acesso..." : "Ativar meu acesso"}
              </Button>
            </form>
          )}
        </Card>

        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link to="/admin/login">Já tenho senha: entrar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirstAccess;
