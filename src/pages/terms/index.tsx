import { Link } from "react-router-dom";

import { usePageMeta } from "@/hooks/use-page-meta";
import { siteConfig } from "@/lib/site-config";

const Terms = () => {
  usePageMeta({
    title: "Termos de uso",
    description:
      "Regras de uso do Garimpei!: site informativo de curadoria, sem venda direta, com compras realizadas nas lojas parceiras.",
  });

  return (
    <div className="container max-w-3xl py-10">
      <header className="mb-8 space-y-3">
        <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-foreground">
          Institucional
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Termos de uso
        </h1>
        <p className="text-sm text-muted-foreground">
          Ao navegar pelo Garimpei!, você concorda com as condições abaixo.
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Natureza do site</h2>
          <p>
            O Garimpei! é um site informativo de curadoria de produtos. O catálogo apresenta
            sugestões de itens encontrados em lojas parceiras e direciona o visitante para a loja de
            origem, onde a compra é realizada.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Sem venda direta</h2>
          <p>
            Não vendemos produtos, não temos checkout, não processamos pagamentos e não emitimos
            notas fiscais. Não somos parte da relação de compra e venda, que acontece integralmente
            entre você e a loja parceira.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Informações de preço</h2>
          <p>
            Preços, promoções, estoque, prazos e fretes são definidos exclusivamente pelas lojas e
            podem mudar sem aviso. As informações exibidas aqui são uma referência no momento do
            cadastro e devem ser sempre confirmadas na página da loja antes da compra.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Links de afiliado</h2>
          <p>
            Alguns links são links de afiliado. Isso significa que podemos receber uma comissão por
            compras feitas após o clique, sem custo adicional para você e sem influenciar o preço
            final na loja.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Marcas de terceiros</h2>
          <p>
            Nomes e marcas de lojas citados pertencem aos seus respectivos donos. O Garimpei! é um
            site independente e não é a loja oficial, não representa e não é representado pelas
            marcas mencionadas além da relação de afiliação.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">6. Uso adequado</h2>
          <p>
            Você concorda em usar o site apenas para fins pessoais e legítimos, sem tentar
            comprometer o funcionamento, copiar o catálogo em massa ou usar as informações para fins
            ilícitos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">7. Responsabilidade</h2>
          <p>
            Fazemos o possível para manter o catálogo atualizado, mas não garantimos que todas as
            ofertas estejam disponíveis ou com o mesmo preço. Não nos responsabilizamos por
            problemas de entrega, produto ou atendimento das lojas parceiras.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">8. Alterações</h2>
          <p>
            Estes termos podem ser atualizados a qualquer momento para refletir mudanças nas
            funcionalidades do site. A versão vigente é sempre a publicada nesta página.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">9. Contato</h2>
          <p>
            Dúvidas sobre estes termos: {siteConfig.contactEmail}. Veja também a{" "}
            <Link
              to="/politica-de-privacidade"
              className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
            >
              política de privacidade
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
