import { mockAffiliateLinks, formatPrice, statusLabels } from '@/data/mockData';
import { StatusBadge } from '@/components/OrderTimeline';
import Layout from '@/components/Layout';
import { Copy, Link2, MousePointerClick, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Affiliates = () => {
  const totalCommission = mockAffiliateLinks.reduce((a, l) => a + l.totalCommission, 0);
  const validatedCommission = mockAffiliateLinks.reduce((a, l) => a + l.validatedCommission, 0);
  const totalClicks = mockAffiliateLinks.reduce((a, l) => a + l.clicks, 0);
  const totalOrders = mockAffiliateLinks.reduce((a, l) => a + l.orders.length, 0);

  const copyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    toast.success('Link copiado!');
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1 font-display text-3xl font-bold text-foreground">Programa de Afiliados</h1>
        <p className="mb-6 text-muted-foreground">Compartilhe links e ganhe comissões por vendas</p>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Cliques Totais', value: totalClicks.toString(), icon: MousePointerClick, color: 'text-info' },
            { label: 'Pedidos Gerados', value: totalOrders.toString(), icon: ShoppingBag, color: 'text-primary' },
            { label: 'Comissão Total', value: formatPrice(totalCommission), icon: TrendingUp, color: 'text-warning' },
            { label: 'Comissão Validada', value: formatPrice(validatedCommission), icon: DollarSign, color: 'text-success' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <Icon className={`mb-2 h-5 w-5 ${stat.color}`} />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Links */}
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Meus Links</h2>
        <div className="space-y-4">
          {mockAffiliateLinks.map((link, i) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className="mb-3 flex items-start gap-4">
                <img src={link.product.imageUrl} alt={link.product.name} className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{link.product.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5">
                      <Link2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{link.code}</span>
                    </div>
                    <button
                      onClick={() => copyLink(link.url)}
                      className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
                    >
                      <Copy className="h-3 w-3" />
                      Copiar
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Comissão</p>
                  <p className="font-display font-bold text-foreground">{formatPrice(link.validatedCommission)}</p>
                </div>
              </div>

              <div className="flex gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{link.clicks} cliques</span>
                <span>{link.orders.length} pedidos</span>
                <span>Pendente: {formatPrice(link.totalCommission - link.validatedCommission)}</span>
              </div>

              {link.orders.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Pedidos via este link:</p>
                  {link.orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                      <span className="text-foreground">#{order.id.slice(-4)}</span>
                      <StatusBadge status={order.status} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-border bg-primary/5 p-4">
          <p className="text-sm text-foreground">
            <strong>💡 Como funciona:</strong> Comissões são validadas automaticamente quando o status do pedido muda para "Comprado" (5% do valor do produto).
          </p>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Affiliates;
