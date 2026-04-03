import { Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border bg-card/60">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Ajuda e suporte</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>Central de Ajuda</li>
            <li>Chat ao vivo</li>
            <li>Status do pedido</li>
            <li>Reembolsos</li>
            <li>Denunciar abuso</li>
            <li>
              <a
                href="mailto:suporte@mundodaimportacao.com"
                className="font-medium text-foreground hover:underline"
              >
                suporte@mundodaimportacao.com
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Pagamentos e proteções</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>Pagamentos seguros e fáceis</li>
            <li>Política de reembolso</li>
            <li>Envio dentro do prazo</li>
            <li>Proteções pós-venda</li>
            <li>Monitoramento de produtos</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Compre no YetuStore</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>Solicitação de orçamento</li>
            <li>Programa de membros</li>
            <li>Impostos e IVA</li>
            <li>Conteúdos e dicas</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Saiba mais</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>Sobre a YetuStore</li>
            <li>Responsabilidade corporativa</li>
            <li>Centro de notícias</li>
            <li>Carreiras</li>
          </ul>
          <div className="pt-2">
            <p className="text-xs font-semibold text-foreground">Fique conectado</p>
            <div className="mt-2 flex items-center gap-3 overflow-x-auto">
              <a
                href="https://www.facebook.com/Yetustor"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-[#1877F2]"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/yetu_store_oficial/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-[#E4405F]"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/yetu-store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-[#0A66C2]"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://www.tiktok.com/@yetu_store?_r=1&_t=ZS-94ZwzVl9X68"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-[#000000]"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                  <path d="M16.7 5.3a4.5 4.5 0 0 0-2.6-.8v8.1a2.4 2.4 0 1 1-2.1-2.4V7.6a6 6 0 1 0 4.2 5.7V8.9c1.1.8 2.4 1.3 3.8 1.3V7.6c-1.2 0-2.4-.4-3.3-1.1Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="YetuStore" className="h-6" />
          <span>YetuStore. Todos os direitos reservados.</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

