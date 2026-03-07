import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statusLabels, formatPrice } from '@/data/mockData';
import { StatusBadge } from '@/components/OrderTimeline';
import Layout from '@/components/Layout';
import { Order, OrderStatus } from '@/types';
import { ShoppingBag, ChevronRight, Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMyOrders } from '@/lib/api';
import { onSocket } from '@/lib/socket';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationControls from '@/components/PaginationControls';

const statusFilters: (OrderStatus | 'todos')[] = ['todos', 'agendado', 'em_progresso', 'comprado', 'cancelado'];
const PAGE_SIZE = 6;

const OrderCardSkeleton = () => (
  <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
    <Skeleton className="h-16 w-16 rounded-lg" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

const MyOrders = () => {
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const load = async () => {
    const data = await getMyOrders();
    setOrders(data);
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

    const offOrders = onSocket('orders.updated', () => load());
    return () => offOrders();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const filtered = filter === 'todos'
    ? orders
    : orders.filter(o => o.status === filter);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    setPage(p => Math.min(p, pageCount));
  }, [pageCount]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const showSkeleton = loading && orders.length === 0;

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1 font-display text-3xl font-bold text-foreground">Meus Pedidos</h1>
        <p className="mb-6 text-muted-foreground">Acompanhe o status de todas as suas entregas</p>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {s === 'todos' ? 'Todos' : statusLabels[s]}
            </button>
          ))}
        </div>

        {showSkeleton ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <OrderCardSkeleton key={`order-skeleton-${i}`} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="space-y-3">
              {paged.map((order, i) => {
                const productName = order.product?.name ?? 'Produto';
                const productImage =
                  order.product?.imageUrl ??
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                const productPrice =
                  typeof order.product?.price === 'number'
                    ? formatPrice(order.product.price)
                    : 'Preço indisponível';

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/orders/${order.id}`}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-elevated"
                    >
                      <img
                        src={productImage}
                        alt={productName}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground truncate">{productName}</h3>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {order.scheduledDate} Ã s {order.scheduledTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {order.address}
                          </span>
                          {order.affiliateName && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              Afiliado: {order.affiliateName}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm font-semibold text-foreground">{productPrice}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <PaginationControls page={page} pageCount={pageCount} onPageChange={setPage} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
            <ShoppingBag className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Nenhum pedido encontrado</p>
            <p className="text-sm text-muted-foreground">Seus pedidos aparecerÃ£o aqui</p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default MyOrders;
