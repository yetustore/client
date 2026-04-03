import { FormEvent, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProductCard from '@/components/ProductCard';
import Layout from '@/components/Layout';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { getCategories, getProducts } from '@/lib/api';
import { Category, Product } from '@/types';
import { onSocket } from '@/lib/socket';
import PaginationControls from '@/components/PaginationControls';
import { useIsMobile } from '@/hooks/use-mobile';

const ProductCardSkeleton = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
    <Skeleton className="h-32 w-full sm:h-36 md:h-40" />
    <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="mt-auto flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

const Index = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [categoryId, setCategoryId] = useState('all');
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = isMobile ? 8 : 15;
  const skeletonCount = pageSize;

  useEffect(() => {
    const query = searchParams.get('search') ?? '';
    setSearch(query);
  }, [searchParams]);
  const load = async () => {
    const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
    setCategories(cats);
    setProducts(prods);
  };


  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }

    setSearchParams(params);
  };

  const updateScrollButtons = useCallback(() => {
    const container = categoriesRef.current;
    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await load();
      } finally {
        setLoading(false);
      }
    };
    init();

    const offCats = onSocket('categories.updated', () => load());
    const offProds = onSocket('products.updated', () => load());

    return () => {
      offCats();
      offProds();
    };
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const container = categoriesRef.current;
    if (!container) {
      return;
    }

    container.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryId, pageSize]);

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = products.filter(p => {
    const matchSearch = !normalizedSearch || p.name.toLowerCase().includes(normalizedSearch) || p.description.toLowerCase().includes(normalizedSearch);
    const matchCategory = categoryId === 'all' || p.categories.includes(categoryId);
    return matchSearch && matchCategory;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    setPage(p => Math.min(p, pageCount));
  }, [pageCount]);

  useEffect(() => {
    updateScrollButtons();
  }, [categories, updateScrollButtons]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const showSkeleton = loading && products.length === 0;

  const categoryName = (ids: string[]) => {
    const names = ids.map(id => categories.find(c => c.id === id)?.name).filter(Boolean);
    return names[0] || '';
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Catálogo</h1>
          <p className="mt-1 text-muted-foreground">Explore nossos produtos e agende sua entrega</p>
        </div>

        {!isAuthenticated && (
          <div className="mb-6 rounded-2xl border border-border bg-card/70 px-4 py-4 shadow-sm sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Comece a buscar seus produtos</p>
                <p className="text-xs text-muted-foreground">
                  Pesquise pelo catálogo antes de entrar na sua conta.
                </p>
              </div>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/auth?mode=login">Entrar</Link>
              </Button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar produtos..."
                  className="pl-10"
                />
                <button type="submit" className="sr-only">
                  Buscar
                </button>
              </div>
            </form>
          </div>
        )}


        <div className="mb-6 relative">
          <div
            ref={categoriesRef}
            className="flex gap-2 overflow-x-auto pb-2 pr-2 pl-2 scroll-smooth scrollbar-hide md:pr-12 md:pl-3"
          >
            <button
              onClick={() => setCategoryId('all')}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                categoryId === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  categoryId === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => {
                const el = categoriesRef.current;
                if (!el) return;
                el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
              }}
              className="hidden absolute -left-2 top-1/2 z-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow transition-colors hover:border-primary hover:text-foreground md:flex"
              aria-label="Navegar categorias para esquerda"
              style={{ height: '48px', width: '48px' }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => {
                const el = categoriesRef.current;
                if (!el) return;
                el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
              }}
              className="hidden absolute -right-2 top-1/2 z-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow transition-colors hover:border-primary hover:text-foreground md:flex"
              aria-label="Navegar categorias para direita"
              style={{ height: '48px', width: '48px' }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {showSkeleton ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <ProductCardSkeleton key={`product-skeleton-${i}`} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {paged.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} categoryLabel={categoryName(product.categories)} />
              ))}
            </div>
            <PaginationControls page={page} pageCount={pageCount} onPageChange={setPage} />

          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
            <Search className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Nenhum produto encontrado</p>
            <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou a busca</p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Index;
