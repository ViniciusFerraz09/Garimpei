import { Link } from "react-router-dom";
import { ArrowRight, Compass, ExternalLink, ShieldCheck, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AffiliateDisclosure } from "@/components/product/affiliate-disclosure";
import { CategoryShortcuts } from "@/components/product/category-shortcuts";
import { ProductImage } from "@/components/product/product-image";
import { ProductPrice } from "@/components/product/product-price";
import { StoreBadge } from "@/components/product/store-badge";
import { useDailyPicks, useHomeSection } from "@/hooks/use-products";
import { usePageMeta } from "@/hooks/use-page-meta";
import { siteConfig } from "@/lib/site-config";
import { STORES } from "@/lib/stores";
import { ProductSection } from "./product-section";

const HOW_IT_WORKS = [
  {
    icon: Compass,
    title: "Garimpamos os achadinhos",
    description:
      "Nossa curadoria procura produtos úteis e com bom custo-benefício nas lojas parceiras.",
  },
  {
    icon: Store,
    title: "Você compara na loja",
    description:
      "O botão de oferta leva direto para a página do produto na Shopee, no AliExpress ou em outra loja parceira.",
  },
  {
    icon: ShieldCheck,
    title: "Preço confirmado na loja",
    description:
      "Preços, estoque e disponibilidade são sempre os da loja. Se mudarem, vale o valor mostrado lá.",
  },
];

const HeroShowcase = () => {
  const { data, isLoading } = useHomeSection("hero-showcase", { featured: true, limit: 3 });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-card" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <Card className="p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Compass className="size-4 text-foreground" aria-hidden="true" />
        Em alta na curadoria
      </p>
      <ul className="space-y-2">
        {data.map((product) => (
          <li key={product.id}>
            <Link
              to={`/produto/${product.slug}`}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary"
            >
              <ProductImage
                src={product.image_url}
                alt={product.name}
                category={product.category}
                className="size-14 shrink-0"
                compact
              />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-sm font-semibold text-foreground">
                  {product.name}
                </span>
                <span className="flex items-center gap-2">
                  <ProductPrice price={product.price} className="text-sm" />
                  <StoreBadge store={product.store} storeName={product.store_name} />
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const Home = () => {
  usePageMeta({ title: siteConfig.tagline, description: siteConfig.description });

  const featured = useHomeSection("featured", { featured: true, limit: 8 });
  const daily = useDailyPicks(8);
  const under50 = useHomeSection("under-50", { priceMax: 50, limit: 8 });
  const recent = useHomeSection("recent", { limit: 8 });

  return (
    <>
      <section className="border-b border-border bg-gradient-hero">
        <div className="container grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-16">
          <div className="space-y-6">
            <Badge variant="brand" className="animate-fade-in-up">
              Curadoria de achadinhos — atualizada todos os dias
            </Badge>

            <h1 className="animate-fade-in-up text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Achados incríveis para facilitar seu dia.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Descubra produtos interessantes, encontre seus próximos favoritos e confira ofertas em
              lojas parceiras.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="brand" size="lg">
                <Link to="/produtos">
                  Explorar achadinhos
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/sobre">Como funciona</Link>
              </Button>
            </div>

            <AffiliateDisclosure />
          </div>

          <div className="lg:pl-6">
            <HeroShowcase />
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Escolha por categoria
          </h2>
          <p className="text-sm text-muted-foreground">
            Seis categorias para achar rapidinho o que você procura.
          </p>
        </div>
        <CategoryShortcuts />
      </section>

      <ProductSection
        eyebrow="Curadoria"
        title="Destaques da semana"
        description="Os achadinhos que a nossa curadoria marcou como imperdíveis."
        products={featured.data}
        isLoading={featured.isLoading}
        isError={featured.isError}
        onRetry={() => void featured.refetch()}
        actionTo="/produtos"
        actionLabel="Ver todos"
      />

      <ProductSection
        eyebrow="Do dia"
        title="Achadinhos do dia"
        description={siteConfig.curationNotice}
        products={daily.data}
        isLoading={daily.isLoading}
        isError={daily.isError}
        onRetry={() => void daily.refetch()}
        actionTo="/produtos?ordem=destaques"
        actionLabel="Ver mais"
      />

      <ProductSection
        eyebrow="Até R$ 50"
        title="Bom e barato"
        description="Opções econômicas para testar sem pesar no bolso."
        products={under50.data}
        isLoading={under50.isLoading}
        isError={under50.isError}
        onRetry={() => void under50.refetch()}
        actionTo="/produtos?preco=ate-50"
        actionLabel="Ver todos até R$ 50"
      />

      <ProductSection
        eyebrow="Novidades"
        title="Recém-chegados"
        description="Os últimos produtos cadastrados na nossa vitrine."
        products={recent.data}
        isLoading={recent.isLoading}
        isError={recent.isError}
        onRetry={() => void recent.refetch()}
        actionTo="/produtos?ordem=destaques"
        actionLabel="Ver catálogo"
      />

      <section className="container py-10">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Compre por loja
          </h2>
          <p className="text-sm text-muted-foreground">
            Ofertas organizadas pelas lojas parceiras onde a compra é finalizada.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {STORES.map((store) => (
            <Link
              key={store.slug}
              to={`/produtos?loja=${store.slug}`}
              className="group flex items-center justify-between gap-4 rounded-card border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:garimpei-shadow-card-hover"
            >
              <span className="space-y-1">
                <span className="block text-base font-bold text-foreground">{store.label}</span>
                <span className="block text-xs text-muted-foreground">
                  Ver achadinhos {store.slug === "outra" ? "de outras lojas" : `da ${store.label}`}
                </span>
              </span>
              <Store className="size-6 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="container pb-14">
        <Card className="border-primary/30 bg-accent p-6 sm:p-8">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Como funcionam os links de afiliado
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              O Garimpei! não vende nada diretamente. Indicamos produtos e enviamos você para a loja
              parceira, onde a compra acontece.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-card border border-border bg-card p-5">
                  <span className="mb-3 grid size-10 place-items-center rounded-2xl bg-primary/25 text-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mb-1 text-sm font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <AffiliateDisclosure />
            <Button asChild variant="outline" size="sm">
              <Link to="/sobre">
                Entenda a curadoria
                <ExternalLink aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Home;
