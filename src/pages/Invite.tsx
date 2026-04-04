import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock3, MapPin } from 'lucide-react';

const Invite = () => (
  <Layout>
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">

      <section className="flex flex-col gap-6">

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Convite
        </p>

        <h1 className="text-3xl sm:text-5xl font-black text-foreground leading-tight max-w-3xl">
          Lançamento oficial da YetuStore
        </h1>

        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          Vamos apresentar uma nova forma de fazer comércio digital em Angola.
          Um encontro direto, prático e sem formalidades — para mostrar o produto
          a funcionar e conectar pessoas.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <Button asChild size="lg">
            <Link to="/auth?mode=signup">Confirmar presença</Link>
          </Button>

          <Link
            to="/auth"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      <section className="mt-12 flex flex-col gap-4 border-t pt-8 text-sm text-foreground sm:flex-row sm:items-center sm:gap-10">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          18 de Abril
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-primary" />
          09h00
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Digital.AO – Rangel
        </div>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          O que vai acontecer
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          Vamos apresentar a YetuStore em funcionamento, simular encomendas
          em tempo real e mostrar como a plataforma resolve problemas reais
          do mercado. Depois disso, abriremos espaço para conversa, troca de ideias
          e networking.
        </p>
      </section>

      <section className="mt-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t pt-8">
          <p className="text-muted-foreground max-w-xl">
            Se você trabalha com vendas, tecnologia ou quer entender para onde o mercado está a ir, vale a pena estar presente.
          </p>

          <Button asChild size="lg">
            <Link to="/auth?mode=signup">Garantir vaga</Link>
          </Button>
        </div>
      </section>

    </div>
  </Layout>
);

export default Invite;