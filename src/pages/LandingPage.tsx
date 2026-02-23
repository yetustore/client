import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Truck, Users, Star, ArrowRight, CheckCircle2, Calendar, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-illustration.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const features = [
  {
    icon: ShoppingBag,
    title: 'Catálogo Completo',
    description: 'Explore produtos selecionados com detalhes, preços e avaliações.',
  },
  {
    icon: Calendar,
    title: 'Entrega Agendada',
    description: 'Escolha a data, horário e endereço que melhor se adapta à sua rotina.',
  },
  {
    icon: MapPin,
    title: 'Acompanhe Pedidos',
    description: 'Veja o status em tempo real: agendado, em progresso, comprado.',
  },
  {
    icon: Users,
    title: 'Programa de Afiliados',
    description: 'Compartilhe links, indique amigos e ganhe comissões por cada venda.',
  },
];

const steps = [
  { number: '01', title: 'Crie sua conta', description: 'Cadastre-se gratuitamente em segundos.' },
  { number: '02', title: 'Escolha produtos', description: 'Navegue pelo catálogo e selecione o que deseja.' },
  { number: '03', title: 'Agende a entrega', description: 'Informe endereço, data e horário.' },
  { number: '04', title: 'Receba & Ganhe', description: 'Acompanhe o pedido e ganhe como afiliado.' },
];

const stats = [
  { value: '500+', label: 'Produtos' },
  { value: '10k+', label: 'Clientes' },
  { value: '50k+', label: 'Entregas' },
  { value: '98%', label: 'Satisfação' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">YetuStore</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth?mode=login">
              <Button variant="ghost" size="sm" className="font-medium">
                Entrar
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="font-medium">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.04]" />
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <Star className="h-3.5 w-3.5" />
                  A nova forma de comprar em Angola
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mb-6 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-[3.5rem]"
              >
                Compre, agende a entrega e{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ganhe como afiliado
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground"
              >
                Plataforma completa com catálogo de produtos, entrega agendada no seu endereço
                e programa de afiliados para você ganhar comissões indicando amigos.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="w-full gap-2 px-8 sm:w-auto">
                    Criar conta grátis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth?mode=login">
                  <Button variant="outline" size="lg" className="w-full px-8 sm:w-auto">
                    Já tenho conta
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-2xl" />
              <img
                src={heroImage}
                alt="Entrega de produtos YetuStore"
                className="relative rounded-2xl shadow-elevated"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center"
            >
              <p className="font-display text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-foreground">
            Tudo o que você precisa
          </h2>
          <p className="text-muted-foreground">
            Uma plataforma pensada para facilitar suas compras e maximizar seus ganhos.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-elevated"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground">
              Como funciona
            </h2>
            <p className="text-muted-foreground">4 passos simples para começar</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary font-display text-xl font-bold text-primary-foreground">
                  {s.number}
                </div>
                <h3 className="mb-1 font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate highlight */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl gradient-hero p-8 sm:p-12 lg:p-16">
          <div className="mx-auto max-w-2xl text-center">
            <DollarSign className="mx-auto mb-4 h-10 w-10 text-primary-foreground/80" />
            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ganhe dinheiro indicando
            </h2>
            <p className="mb-6 text-primary-foreground/80">
              Gere links únicos para cada produto, compartilhe com amigos e ganhe comissões
              cada vez que alguém comprar através do seu link.
            </p>
            <ul className="mb-8 inline-flex flex-col gap-2 text-left text-sm text-primary-foreground/90">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" /> Link exclusivo por produto
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" /> Acompanhe pedidos e comissões
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" /> Comissão validada na compra
              </li>
            </ul>
            <div>
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="secondary" className="gap-2 px-8 font-semibold">
                  Começar agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-primary">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-bold text-foreground">YetuStore</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} YetuStore. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
