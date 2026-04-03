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

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="YetuStore"
              className="h-7 sm:h-11 w-auto object-contain"
            />
          </Link>

          {/* SEARCH */}
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
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Carrinho */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary/70"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Registrar (principal) */}
              <Link
                to="/auth?mode=signup"
                className="rounded-lg bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground whitespace-nowrap"
              >
                Registrar
              </Link>

              {/* Entrar (só desktop) */}
              <Link
                to="/auth"
                className="hidden sm:block rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Entrar
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
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                        active
                          ? 'bg-secondary/70 text-foreground'
                          : 'text-muted-foreground hover:bg-secondary/40'
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
                  className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary/70"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                      {totalItems}
                    </span>
                  )}
                </button>

                <div className="hidden items-center gap-2 md:flex">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive md:block"
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
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;