import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageMeta } from "@/hooks/use-page-meta";

const NotFound = () => {
  const location = useLocation();

  usePageMeta({
    title: "Página não encontrada",
    description: "O endereço acessado não existe no Garimpei!. Volte para a vitrine de achadinhos.",
  });

  useEffect(() => {
    console.error(`404: rota inexistente acessada em ${location.pathname}`);
  }, [location.pathname]);

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16">
      <Card className="max-w-lg space-y-4 p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/25 text-foreground">
          <Compass className="size-7" aria-hidden="true" />
        </span>
        <p className="text-5xl font-extrabold tracking-tight text-foreground">404</p>
        <h1 className="text-xl font-bold text-foreground">Não encontramos esta página</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          O endereço <span className="font-semibold text-foreground">{location.pathname}</span> não
          existe na nossa vitrine. Vale voltar e continuar garimpando.
        </p>
        <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
          <Button variant="brand" asChild>
            <Link to="/">
              <Home aria-hidden="true" />
              Voltar para a página inicial
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/produtos">Ver todos os achadinhos</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
