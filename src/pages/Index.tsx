import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import Layout from '@/components/Layout';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [categoryId, setCategoryId] = useState('all');
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

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
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
