import { Link } from 'react-router-dom';

const Terms = () => (
  <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-border">
      <h1 className="mb-4 text-3xl font-bold text-foreground">Termos e Condições — Yetu Store</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Ao utilizar os nossos serviços, realizar compras ou participar dos nossos programas, o utilizador concorda com os presentes Termos e Condições.
      </p>
      <div className="space-y-6 text-sm leading-7 text-foreground">
        <section>
          <h2 className="mb-2 text-xl font-semibold">1. Sobre a Yetu Store</h2>
          <p>
            A Yetu Store atua no comércio de produtos importados, disponibilizando aos clientes produtos selecionados com foco em qualidade, inovação e exclusividade.
          </p>
          <p className="mt-3">Os nossos serviços incluem:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Venda de produtos importados;</li>
            <li>Sistema de pagamento na entrega (Cash on Delivery);</li>
            <li>Programa de afiliação para clientes e parceiros;</li>
            <li>Atendimento personalizado;</li>
            <li>Suporte pós-venda.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">2. Elegibilidade</h2>
          <p>Ao utilizar a plataforma da Yetu Store, o utilizador declara que:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Possui capacidade legal para realizar compras;</li>
            <li>Forneceu informações verdadeiras e atualizadas;</li>
            <li>Utilizará os serviços de forma legítima e responsável.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">3. Produtos e Disponibilidade</h2>
          <p>Os produtos apresentados estão sujeitos à disponibilidade de stock.</p>
          <p className="mt-3">A Yetu Store reserva-se o direito de:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Alterar preços sem aviso prévio;</li>
            <li>Atualizar descrições e imagens dos produtos;</li>
            <li>Descontinuar produtos a qualquer momento.</li>
          </ul>
          <p className="mt-3">
            Apesar do nosso compromisso com a precisão das informações, podem ocorrer pequenas variações entre as imagens e o produto final entregue.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">4. Pagamento na Entrega (Cash on Delivery)</h2>
          <p>A Yetu Store é pioneira em Angola na implementação do modelo de pagamento na entrega.</p>
          <p className="mt-3">Condições do serviço:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>O cliente realiza o pedido online e efetua o pagamento apenas no momento da entrega;</li>
            <li>O pagamento deve ser realizado integralmente no ato da receção do produto;</li>
            <li>O cliente deve garantir disponibilidade para receber a encomenda no endereço informado;</li>
            <li>Em caso de recusa injustificada da encomenda, a Yetu Store poderá limitar futuras compras do utilizador.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">5. Entregas</h2>
          <p>As entregas são realizadas de acordo com a localização do cliente e disponibilidade logística.</p>
          <p className="mt-3">O cliente compromete-se a:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Fornecer um endereço correto e acessível;</li>
            <li>Disponibilizar contacto válido;</li>
            <li>Estar disponível para receção da encomenda.</li>
          </ul>
          <p className="mt-3">A Yetu Store não se responsabiliza por atrasos causados por:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Informações incorretas fornecidas pelo cliente;</li>
            <li>Fatores externos ou logísticos;</li>
            <li>Situações de força maior.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">6. Política de Trocas e Reclamações</h2>
          <p>O cliente poderá apresentar reclamações caso:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Receba um produto danificado;</li>
            <li>Receba produto diferente do solicitado;</li>
            <li>O produto apresente defeitos de fabrico.</li>
          </ul>
          <p className="mt-3">
            A reclamação deverá ser comunicada dentro do prazo informado pela Yetu Store após a entrega.
          </p>
          <p className="mt-3">
            A Yetu Store analisará cada situação e poderá proceder com troca do produto, reembolso, crédito em loja ou outra solução adequada.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">7. Programa de Afiliação</h2>
          <p>A Yetu Store disponibiliza um programa de afiliação destinado a clientes e parceiros.</p>
          <p className="mt-3">Regras gerais:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>O afiliado poderá recomendar produtos e receber benefícios conforme as campanhas ativas;</li>
            <li>É proibido utilizar práticas enganosas, fraudulentas ou spam;</li>
            <li>A Yetu Store reserva-se o direito de suspender contas que violem as regras do programa;</li>
            <li>As condições de comissão poderão ser alteradas a qualquer momento.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">8. Atendimento e Suporte</h2>
          <p>A Yetu Store compromete-se em oferecer atendimento personalizado, comunicação transparente e suporte pós-venda eficiente.</p>
          <p className="mt-3">Os canais oficiais de comunicação devem ser utilizados para qualquer suporte, dúvida ou reclamação.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">9. Privacidade e Proteção de Dados</h2>
          <p>As informações fornecidas pelos clientes serão utilizadas exclusivamente para:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Processamento de encomendas;</li>
            <li>Comunicação com o cliente;</li>
            <li>Melhorias na experiência da plataforma;</li>
            <li>Ações relacionadas aos serviços da Yetu Store.</li>
          </ul>
          <p className="mt-3">A Yetu Store compromete-se a proteger os dados dos utilizadores e não comercializar informações pessoais sem autorização.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">10. Limitação de Responsabilidade</h2>
          <p>A Yetu Store não será responsável por uso inadequado dos produtos, danos causados por terceiros, interrupções temporárias da plataforma ou atrasos externos fora do nosso controlo.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">11. Alterações dos Termos</h2>
          <p>A Yetu Store poderá atualizar estes Termos e Condições sempre que necessário.</p>
          <p className="mt-3">As alterações entram em vigor após publicação nos canais oficiais da plataforma.</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">12. Contactos Oficiais</h2>
          <p>Website oficial: <a href="https://www.yetustore.shop/?utm_source=chatgpt.com" className="text-primary hover:underline" target="_blank" rel="noreferrer">Yetu Store</a></p>
          <p className="mt-2">Email de suporte: <a href="mailto:suporte@mundodaimportacao.com" className="text-primary hover:underline">suporte@mundodaimportacao.com</a></p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">13. Aceitação dos Termos</h2>
          <p>Ao utilizar os serviços da Yetu Store, o utilizador confirma que leu, compreendeu e aceitou os presentes Termos e Condições.</p>
        </section>
      </div>

      <div className="mt-8">
        <Link
          to="/auth?mode=signup"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Voltar para criar conta
        </Link>
      </div>
    </div>
  </div>
);

export default Terms;
