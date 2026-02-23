import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockOrders, statusLabels, formatPrice } from '@/data/mockData';
import { StatusBadge } from '@/components/OrderTimeline';
import Layout from '@/components/Layout';
import { OrderStatus } from '@/types';
import { ShoppingBag, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const statusFilters: (OrderStatus | 'todos')[] = ['todos', 'agendado', 'em_progresso', 'comprado', 'cancelado'];

const MyOrders = () => {
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos');

  const filtered = filter === 'todos'
    ? mockOrders
    : mockOrders.filter(o => o.status === filter);

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

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((order, i) => (
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
                    src={order.product.imageUrl}
                    alt={order.product.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-foreground truncate">{order.product.name}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {order.scheduledDate} às {order.scheduledTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.address}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">{formatPrice(order.product.price)}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
            <ShoppingBag className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Nenhum pedido encontrado</p>
            <p className="text-sm text-muted-foreground">Seus pedidos aparecerão aqui</p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default MyOrders;
