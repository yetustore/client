import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Users, User, LogOut, Menu, X, Home, ShoppingCart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/data/mockData';
import { Input } from '@/components/ui/input';

const navItems = [
  { path: '/', label: 'Produtos', icon: Home },
  { path: '/orders', label: 'Meus Pedidos', icon: ShoppingBag },
  { path: '/affiliates', label: 'Afiliados', icon: Users },
  { path: '/profile', label: 'Perfil', icon: User },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { items, totalItems, totalAmount, updateQuantity, removeItem } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (location.pathname === '/') {
      const params = new URLSearchParams(location.search);
      setSearchTerm(params.get('search') ?? '');
    }
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    const target = query ? '/?search=' + encodeURIComponent(query) : '/';
    navigate(target);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 p-1 shadow-card">
              <img
                src="/logo.png"
                alt="YetuStore"
                className="h-full w-full rounded-md object-cover"
              />
            </div>
            <span className="font-display text-xl font-bold text-foreground">YetuStore</span>
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden flex-1 max-w-xs items-center md:flex"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Buscar produtos..."
              className="pl-10"
            />
          </form>
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary/70"
                aria-label="Abrir carrinho"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link
                to="/auth"
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Entrar
              </Link>
              <Link
                to="/auth?mode=signup"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Registrar
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop nav */}
              <nav className="hidden items-center gap-1 md:flex">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active ? 'bg-secondary/70 text-foreground' : 'text-muted-foreground hover:bg-secondary/40'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary/70"
                  aria-label="Abrir carrinho"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                      {totalItems}
                    </span>
                  )}
                </button>
                <div className="hidden items-center gap-2 md:flex">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-foreground">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive md:block"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="rounded-lg p-2 text-muted-foreground md:hidden"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {isAuthenticated && mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border md:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/40"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Carrinho
                  {totalItems > 0 && (
                    <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                      {totalItems}
                    </span>
                  )}
                </button>
                {navItems.map(item => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active ? 'bg-secondary/70 text-foreground' : 'text-muted-foreground hover:bg-secondary/40'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              key="cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              key="cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full sm:w-[85vw] md:w-[60vw] lg:w-[30vw] min-w-[280px] max-w-[420px] flex-col border-l border-border bg-card shadow-xl rounded-l-[28px] overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Carrinho</p>
                  <p className="text-lg font-semibold text-foreground">{totalItems} itens</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary/40"
                  aria-label="Fechar carrinho"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background/60 p-4 text-center text-sm text-muted-foreground">
                    <ShoppingCart className="h-10 w-10" />
                    <p>Carrinho vazio</p>
                    <p>Adicione produtos para começar</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.productId} className="flex flex-col gap-2 rounded-xl border border-border bg-background/60 p-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                            <button
                              className="text-xs font-semibold text-destructive"
                              type="button"
                              onClick={() => removeItem(item.productId)}
                            >
                              Remover
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="rounded-full border border-border/70 px-2 py-0.5 text-sm font-semibold text-muted-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              -
                            </button>
                            <span className="min-w-[24px] text-center font-semibold text-foreground">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="rounded-full border border-border/70 px-2 py-0.5 text-sm font-semibold text-muted-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                            <span className="text-sm text-muted-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-border px-4 py-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total</span>
                  <span className="font-semibold text-foreground">{formatPrice(totalAmount)}</span>
                </div>
                <Button
                  className="mt-3 w-full"
                  onClick={() => {
                    setCartOpen(false);
                    navigate('/schedule');
                  }}
                  disabled={items.length === 0}
                >
                  Agendar entrega
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
