import { Link } from "react-router-dom";
import { Compass, ExternalLink, Heart, Info, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AffiliateDisclosure } from "@/components/product/affiliate-disclosure";
import { usePageMeta } from "@/hooks/use-page-meta";
import { CATEGORIES } from "@/lib/categories";
import { siteConfig } from "@/lib/site-config";

const About = () => {
  usePageMeta({
    title: "Sobre o Garimpei!",
    description:
      "Entenda como o Garimpei! seleciona achadinhos, como funcionam os links de afiliado e o que depende das lojas parceiras.",
  });

  return (
    <div className="container max-w-3xl py-10">
      <header className="mb-8 space-y-3">
        <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-foreground">
          Sobre
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Achados inteligentes, sem enrolação
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">{siteConfig.tagline}</p>
      </header>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Compass className="size-5" aria-hidden="true" />
            Como escolhemos os produtos
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            O Garimpei! é uma vitrine de curadoria. Navegamos pelas lojas parceiras procurando
            produtos úteis, bem avaliados pelas próprias lojas e com bom custo-benefício nas
            categorias que acompanhamos: {CATEGORIES.map((category) => category.label).join(", ")}.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Não vendemos nada diretamente, não temos estoque e não processamos pagamentos. Nosso
            papel é organizar a descoberta: você encontra o achadinho aqui e finaliza a compra na
            loja de origem.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Store className="size-5" aria-hidden="true" />
            Links de afiliado
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Alguns links desta vitrine são links de afiliado. Se você comprar depois de clicar em um
            deles, podemos receber uma comissão paga pela loja — e essa comissão não altera o valor
            que você paga.
          </p>
          <Card className="border-primary/30 bg-accent p-4">
            <AffiliateDisclosure className="text-foreground" />
          </Card>
          <p className="text-sm leading-relaxed text-muted-foreground">
            O Garimpei! não é a loja oficial da Shopee, do AliExpress ou de qualquer outro parceiro.
            Somos um site independente de divulgação e usamos cada programa de afiliados conforme as
            regras de publicidade e uso de marcas de cada um.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Info className="size-5" aria-hidden="true" />
            Preços, estoque e disponibilidade
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Preços, estoque, prazos de entrega e disponibilidade são definidos e atualizados pela
            loja, não por nós. Um valor exibido aqui pode mudar a qualquer momento na loja de
            origem, e é sempre o valor da loja que vale no momento da compra.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Por isso mostramos o preço apenas quando temos o valor cadastrado, e exibimos o preço
            antigo somente quando existe um valor anterior confiável. Você nunca vai encontrar
            contagem regressiva, estoque falso ou avaliações inventadas aqui.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Heart className="size-5" aria-hidden="true" />
            Favoritos e privacidade
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Você não precisa criar conta para usar o Garimpei!. Os favoritos ficam salvos apenas no
            seu navegador, sem login e sem sincronização entre aparelhos.
          </p>
          <Link
            to="/politica-de-privacidade"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
          >
            Ler a política de privacidade
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Fale com a curadoria</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Encontrou um erro, quer sugerir um produto ou avisar sobre um link fora do ar? Escreva
            para {siteConfig.contactEmail}.
          </p>
          <Button variant="brand" asChild>
            <Link to="/produtos">Explorar achadinhos</Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default About;
