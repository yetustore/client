import { useEffect, useState } from 'react';
import { formatPrice } from '@/data/mockData';
import Layout from '@/components/Layout';
import { Copy, Link2, MousePointerClick, ShoppingBag, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AffiliateLink } from '@/types';
import { getMyAffiliateLinks, getAffiliateSummary, requestAffiliateWithdraw } from '@/lib/api';
import { onSocket } from '@/lib/socket';
import { StatusBadge } from '@/components/OrderTimeline';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationControls from '@/components/PaginationControls';

const PAGE_SIZE = 4;

const StatSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-card">
    <Skeleton className="mb-2 h-5 w-5" />
    <Skeleton className="h-3 w-24" />
    <Skeleton className="mt-2 h-5 w-16" />
  </div>
);

const LinkSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-card">
    <div className="mb-3 flex items-start gap-4">
      <Skeleton className="h-14 w-14 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="text-right">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="mt-2 h-4 w-8" />
      </div>
    </div>
    <Skeleton className="h-3 w-40" />
  </div>
);

const Affiliates = () => {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [summary, setSummary] = useState({ totalEarned: 0, totalWithdrawn: 0, available: 0, minWithdraw: 0, maxWithdraw: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const load = async () => {
    const [linksData, summaryData] = await Promise.all([
      getMyAffiliateLinks(),
      getAffiliateSummary(),
    ]);
    setLinks(linksData);
    setSummary(summaryData);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await load();
      } finally {
        setLoading(false);
      }
    };
    init();

    const off = onSocket('affiliates.updated', () => load());
    return () => off();
  }, []);

  const pageCount = Math.max(1, Math.ceil(links.length / PAGE_SIZE));
  useEffect(() => {
    setPage(p => Math.min(p, pageCount));
  }, [pageCount]);

  const pagedLinks = links.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showSkeleton = loading && links.length === 0;

  const totalClicks = links.reduce((a, l) => a + (l.clicks || 0), 0);
  const totalOrders = links.reduce((a, l) => a + (l.ordersCount || 0), 0);
  const totalLinks = links.length;

  const copyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    toast.success('Link copiado!');
  };

  const handleWithdraw = async () => {
    if (summary.available <= 0) return;
    try {
      await requestAffiliateWithdraw(summary.available);
      toast.success('Saque solicitado');
      load();
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao solicitar saque');
    }
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Programa de Afiliados</h1>
            <p className="text-muted-foreground">Compartilhe links e acompanhe seus resultados</p>
          </div>
          <Link
            to="/affiliates/payouts"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold"
          >
            Histórico
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {showSkeleton ? (
            Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={`stat-skeleton-${i}`} />)
          ) : (
            [
              { label: 'Links Gerados', value: totalLinks.toString(), icon: Link2, color: 'text-primary' },
              { label: 'Cliques Totais', value: totalClicks.toString(), icon: MousePointerClick, color: 'text-info' },
              { label: 'Pedidos Gerados', value: totalOrders.toString(), icon: ShoppingBag, color: 'text-warning' },
              { label: 'Ganhos', value: formatPrice(summary.totalEarned), icon: Wallet, color: 'text-success' },
              { label: 'Sacado', value: formatPrice(summary.totalWithdrawn), icon: Wallet, color: 'text-muted-foreground' },
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
            })
          )}
        </div>

        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Meus Links</h2>
        <div className="space-y-4">
          {showSkeleton ? (
            Array.from({ length: 3 }).map((_, i) => <LinkSkeleton key={`link-skeleton-${i}`} />)
          ) : pagedLinks.length > 0 ? (
            <>
              {pagedLinks.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-4 shadow-card"
                >
                  <div className="mb-3 flex items-start gap-4">
                    <img src={link.product?.imageUrl} alt={link.product?.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{link.product?.name}</h3>
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
                      <p className="text-xs text-muted-foreground">Cliques</p>
                      <p className="font-display font-bold text-foreground">{link.clicks}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>{link.ordersCount} pedidos</span>
                    <span>Produto: {formatPrice(link.product?.price || 0)}</span>
                  </div>

                  {link.orders && link.orders.length > 0 && (
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
              <PaginationControls page={page} pageCount={pageCount} onPageChange={setPage} />
            </>
          ) : (
            <div className="rounded-xl border border-border bg-card py-16 text-center text-muted-foreground">
              Nenhum link gerado ainda
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Affiliates;
