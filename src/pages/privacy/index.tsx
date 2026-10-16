import { Link } from "react-router-dom";

import { usePageMeta } from "@/hooks/use-page-meta";
import { siteConfig } from "@/lib/site-config";

const Privacy = () => {
  usePageMeta({
    title: "Política de privacidade",
    description:
      "Saiba quais dados o Garimpei! usa: favoritos salvos no seu navegador, estatísticas agregadas de navegação e nenhum cadastro para visitantes.",
  });

  return (
    <div className="container max-w-3xl py-10">
      <header className="mb-8 space-y-3">
        <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-foreground">
          Institucional
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Política de privacidade
        </h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: documento inicial do site, revisado sempre que novas funcionalidades
          forem adicionadas.
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Quem somos</h2>
          <p>
            O Garimpei! é um site de curadoria e divulgação de produtos de lojas parceiras. Não
            vendemos produtos, não processamos pagamentos e não mantemos estoque.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Navegação sem cadastro</h2>
          <p>
            Visitantes não precisam criar conta para navegar, pesquisar, filtrar ou favoritar
            produtos. Não coletamos nome, telefone, endereço ou dados de pagamento de visitantes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Favoritos salvos no dispositivo</h2>
          <p>
            Quando você marca um produto como favorito, guardamos apenas o identificador desse
            produto no armazenamento local (localStorage) do seu navegador. Esses dados ficam no seu
            dispositivo, não são enviados para servidores e podem ser apagados a qualquer momento
            limpando os dados do site no navegador.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Estatísticas de uso</h2>
          <p>
            Usamos estatísticas agregadas para entender quais páginas e ofertas são mais úteis.
            Registramos visualizações de página e cliques em botões e links, sem identificar você
            pessoalmente. Não coletamos o conteúdo digitado em campos de busca, senhas, tokens nem
            dados de pagamento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">5. Área administrativa</h2>
          <p>
            A área administrativa é restrita à pessoa responsável pelo Garimpei! e usa autenticação
            com e-mail e senha. Os dados de acesso do administrador ficam armazenados no nosso
            provedor de banco de dados e não são exibidos ao público. Não há cadastro público de
            administradores.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">6. Links para lojas parceiras</h2>
          <p>
            Ao clicar em um botão de oferta, você é levado para o site da loja parceira. A partir
            desse momento, aplicam-se a política de privacidade e os termos daquela loja. Não temos
            controle sobre os dados coletados por elas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">7. Serviços utilizados</h2>
          <p>
            O site usa um provedor de banco de dados e hospedagem para armazenar o catálogo de
            produtos e as imagens, e um serviço de fontes web para exibir a tipografia. Esses
            serviços podem registrar dados técnicos de requisição, como endereço IP e horário de
            acesso, conforme suas próprias políticas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">8. Seus direitos</h2>
          <p>
            Como não mantemos cadastro de visitantes, não há dados pessoais de visitantes para
            exclusão. Se você acredita que algum conteúdo nosso viola seus direitos, escreva para{" "}
            {siteConfig.contactEmail}.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">9. Alterações nesta política</h2>
          <p>
            Podemos atualizar este documento quando novas funcionalidades forem implementadas, por
            exemplo um formulário de contato ou newsletter. Sempre que isso acontecer, o texto será
            revisado para refletir o que o site realmente faz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">10. Contato</h2>
          <p>
            Dúvidas sobre privacidade: {siteConfig.contactEmail}. Consulte também os{" "}
            <Link
              to="/termos-de-uso"
              className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
            >
              termos de uso
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
