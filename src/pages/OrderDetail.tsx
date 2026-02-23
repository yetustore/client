import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMyOrders } from '@/lib/api';
import { formatPrice, statusLabels } from '@/data/mockData';
import OrderTimeline, { StatusBadge } from '@/components/OrderTimeline';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Clock, Package, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Order } from '@/types';
import { onSocket } from '@/lib/socket';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const orders = await getMyOrders();
    const found = orders.find(o => o.id === id) || null;
    setOrder(found);
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
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center text-muted-foreground">Carregando...</div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">Pedido não encontrado</p>
        </div>
      </Layout>
    );
  }

  const canCancel = order.status === 'agendado';

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Pedido #{order.id.slice(-4)}</h1>
              <p className="text-sm text-muted-foreground">Criado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <img src={order.product.imageUrl} alt={order.product.name} className="h-20 w-20 rounded-lg object-cover" />
            <div>
              <h3 className="font-semibold text-foreground">{order.product.name}</h3>
              <p className="text-sm text-muted-foreground">{statusLabels[order.status]}</p>
              <p className="mt-1 font-display text-lg font-bold text-foreground">{formatPrice(order.product.price)}</p>
            </div>
          </div>

          <div className="mb-6 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Endereço</p>
                <p className="text-sm text-foreground">{order.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Data</p>
                <p className="text-sm text-foreground">{order.scheduledDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Horário</p>
                <p className="text-sm text-foreground">{order.scheduledTime}</p>
              </div>
            </div>
          </div>

          {order.affiliateName && (
            <div className="mb-6 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Afiliado: <span className="text-foreground font-medium">{order.affiliateName}</span>
              </div>
            </div>
          )}

          <div className="mb-6 rounded-xl border border-border bg-card p-4">
            <h3 className="mb-4 font-display text-base font-semibold text-foreground">Linha do Tempo</h3>
            <OrderTimeline history={order.statusHistory} />
          </div>

          {canCancel && (
            <Button variant="destructive" className="w-full" disabled>
              Cancelar Pedido (indisponível)
            </Button>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default OrderDetail;
