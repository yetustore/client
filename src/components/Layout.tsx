import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import {
  ShoppingBag,
  Users,
  User,
  LogOut,
  Menu,
  X,
  Home,
  ShoppingCart,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/mockData";
import { Input } from "@/components/ui/input";

const navItems = [
  { path: "/", label: "Produtos", icon: Home },
  { path: "/orders", label: "Meus Pedidos", icon: ShoppingBag },
  { path: "/affiliates", label: "Afiliados", icon: Users },
  { path: "/profile", label: "Perfil", icon: User },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { items, totalItems, totalAmount, updateQuantity, removeItem } =
    useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const showProductSearch = location.pathname === "/";
  const showMobileSearch = isAuthenticated && showProductSearch;

  React.useEffect(() => {
    if (location.pathname === "/") {
      const params = new URLSearchParams(location.search);
      setSearchTerm(params.get("search") ?? "");
    }
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    const target = query ? "/?search=" + encodeURIComponent(query) : "/";
    navigate(target);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const closeCart = () => setCartOpen(false);
  const closeMobileMenu = () => setMobileOpen(false);

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

          {showProductSearch && (
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden flex-1 max-w-xs items-center md:flex"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar produtos..."
                className="pl-10"
              />
            </form>
          )}

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
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                        active
                          ? "bg-secondary/70 text-foreground"
                          : "text-muted-foreground hover:bg-secondary/40"
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
                    {user?.name?.charAt(0) || "U"}
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
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {showMobileSearch && (
        <section className="border-b border-border bg-muted/40 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex w-full md:hidden"
            >
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar produtos..."
                className="
            w-full
            h-11
            rounded-xl
            border border-border
            bg-background
            pl-11 pr-4
            text-sm
            shadow-sm
            transition-all
            duration-200
            placeholder:text-muted-foreground/70
            focus:border-primary
            focus:ring-2
            focus:ring-primary/20
            focus:outline-none
          "
              />
            </form>
          </div>
        </section>
      )}

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-menu"
            className="fixed inset-x-0 top-16 z-40 border-t border-border bg-card/95 px-4 py-6 shadow-lg md:hidden"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => closeMobileMenu()}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? "bg-secondary/70 text-foreground"
                      : "text-muted-foreground hover:bg-secondary/40"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  closeCart();
                  setCartOpen(true);
                }}
                className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary/40"
              >
                Ver Carrinho <ShoppingCart className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
              >
                Sair
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              key="cart-backdrop"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />
            <motion.aside
              key="cart-panel"
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-card shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Carrinho
                </h2>
                <button
                  onClick={closeCart}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-4 p-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 p-6 text-center">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Seu carrinho está vazio
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        closeCart();
                        navigate("/");
                      }}
                    >
                      Ver catálogo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(item.product.price)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => removeItem(item.productId)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 border-t border-border bg-card/90 px-4 py-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total ({totalItems} itens)</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={() => {
                    closeCart();
                    navigate("/cart");
                  }}
                >
                  Finalizar compra
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
