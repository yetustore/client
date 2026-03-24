import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/mockData';
import { ShoppingCart } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, totalAmount, totalItems, updateQuantity, removeItem, clearCart } = useCart();
  const ref = searchParams.get('ref');
  const scheduleUrl = ref ? `/schedule?ref=${encodeURIComponent(ref)}` : '/schedule';

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Carrinho</h1>
            <p className="text-sm text-muted-foreground">Revise seus itens antes de agendar</p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
            >
              Limpar carrinho
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
            <ShoppingCart className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground">Adicione produtos e volte aqui para agendar</p>
            <Link to="/" className="mt-4 text-sm font-semibold text-primary hover:underline">Ver catálogo</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.productId} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="text-sm font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </Button>
                    <span className="text-sm text-muted-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.productId)}>
                  Remover
                </Button>
              </div>
            ))}

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total ({totalItems} itens)</span>
                <span className="font-semibold text-foreground">{formatPrice(totalAmount)}</span>
              </div>
              <Button className="mt-4 w-full" size="lg" onClick={() => navigate(scheduleUrl)}>
                Agendar Entrega
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Cart;

