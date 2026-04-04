import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getProductById, getCategories, createAffiliateLink, getProductShareUrl, resolveAffiliateCode, trackAffiliateClick } from '@/lib/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ArrowLeft, Package, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Category, Product } from '@/types';
import { formatPrice } from '@/data/mockData';
import { onSocket } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { saveAffiliateRef, clearAffiliateRef } from '@/lib/affiliate';

const ProductDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [ignoreAffiliateCode, setIgnoreAffiliateCode] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const { addItem } = useCart();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const affiliateCode = searchParams.get('ref');
  const isAffiliateView = Boolean(affiliateCode) && !ignoreAffiliateCode;

  const load = async () => {
    const [prod, cats] = await Promise.all([
      id ? getProductById(id) : Promise.resolve(null),
      getCategories(),
    ]);
    setProduct(prod);
    setCategories(cats);
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

    const offProds = onSocket('products.updated', () => load());
    const offCats = onSocket('categories.updated', () => load());
    return () => {
      offProds();
      offCats();
    };
  }, [id]);

  useEffect(() => {
    setMediaIndex(0);
  }, [product?.id]);

  useEffect(() => {
    setIgnoreAffiliateCode(false);
    if (!affiliateCode || !id) return;

    let cancelled = false;
    const handleAffiliateCode = async () => {
      if (user?.id) {
        try {
          const link = await resolveAffiliateCode(affiliateCode);
          if (cancelled) return;
          if (link.userId === user.id) {
            clearAffiliateRef();
            setIgnoreAffiliateCode(true);
            navigate(`/products/${id}`, { replace: true });
            return;
          }
        } catch {
          clearAffiliateRef();
          return;
        }
      }

      if (!cancelled) {
        trackAffiliateClick(affiliateCode);
        saveAffiliateRef(affiliateCode);
      }
    };

    handleAffiliateCode();
    return () => {
      cancelled = true;
    };
  }, [affiliateCode, id, navigate, user?.id]);

  const categoryLabel = useMemo(() => {
    if (!product) return '';
    const names = product.categories
      .map(cid => categories.find(c => c.id === cid)?.name)
      .filter(Boolean);
    return names[0] || '';
  }, [product, categories]);

  const media = useMemo(() => {
    if (!product) return [];
    const list = product.media && product.media.length > 0
      ? product.media
      : product.imageUrl
        ? [{ type: 'image' as const, url: product.imageUrl }]
        : [];
    return list.filter(m => m.url);
  }, [product]);

  const currentMedia = media[mediaIndex];
  const showNav = media.length > 1;

  const handleAddToCart = () => {
    // if (!product) return;
    // addItem(product, 1);
    // toast.success('Produto adicionado ao carrinho');

    toast.success("Essa função estará disponivel no dia 18 de abril de 2026")
  };

  const handleSchedulePurchase = () => {
    // if (!product) return;
    // navigate('/schedule', {
    //   state: {
    //     directItems: [{ productId: product.id, product, quantity: 1 }],
    //   },
    // });

      toast.success("Essa função estará disponivel no dia 18 de abril de 2026")
  };

  const handleCopyProductLink = async () => {
    if (!product) return;
    try {
      const shareUrl = getProductShareUrl(product.id);
      await navigator.clipboard?.writeText(shareUrl);
      toast.success('Link do produto copiado!');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao copiar link do produto');
    }
  };

  const handleGenerateLink = async () => {
    // if (!product) return;
    // try {
    //   setCreatingLink(true);
    //   const link = await createAffiliateLink(product.id);
    //   await navigator.clipboard?.writeText(link.url);
    //   toast.success('Link de afiliado criado e copiado!');
    // } catch (err: any) {
    //   toast.error(err?.message || 'Erro ao gerar link');
    // } finally {
    //   setCreatingLink(false);
    // }
      toast.success("Essa função estará disponivel no dia 18 de abril de 2026")
  };

  const goPrev = () => setMediaIndex(i => (i - 1 + media.length) % media.length);
  const goNext = () => setMediaIndex(i => (i + 1) % media.length);

  if (loading) {
    return (
      <Layout>
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex flex-col justify-center gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-40" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">Produto não encontrado</p>
          <Link to="/" className="mt-4 text-sm text-primary hover:underline">Voltar ao catálogo</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl border border-border bg-card">
            {currentMedia?.type === 'video' ? (
              <video
                ref={videoRef}
                key={currentMedia.url}
                src={currentMedia.url}
                className="aspect-square w-full object-cover"
                autoPlay
                muted
                playsInline
                loop
              />
            ) : (
              <img
                src={currentMedia?.url || product.imageUrl}
                alt={product.name}
                className="aspect-square w-full object-contain bg-secondary"
              />
            )}

            {showNav && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow hover:bg-background"
                  aria-label="Mídia anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow hover:bg-background"
                  aria-label="Próxima mídia"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {categoryLabel && (
              <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {categoryLabel}
              </span>
            )}
            <h1 className="mb-2 font-display text-2xl font-bold text-foreground">{product.name}</h1>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-accent">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">.</span>
              <span className="text-sm text-muted-foreground">{product.stock} em estoque</span>
            </div>
            <p className="mb-6 leading-relaxed text-muted-foreground">{product.description}</p>
            <p className="mb-6 font-display text-2xl font-bold text-foreground">{formatPrice(product.price)}</p>

            <div className="mb-4 flex flex-col gap-3">
              <Button variant="outline" className="w-full" onClick={handleAddToCart}>
                Adicionar ao carrinho
              </Button>
              <Button className="w-full" onClick={handleSchedulePurchase}>
                Agendar compra
              </Button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={handleCopyProductLink}
                  className="flex-1 gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Partilhar Produto
                </Button>
                {isAuthenticated && !isAffiliateView && (
                  <Button
                    variant="outline"
                    onClick={handleGenerateLink}
                    className="flex-1 gap-2"
                    disabled={creatingLink}
                  >
                    <Share2 className="h-4 w-4" />
                    {creatingLink ? 'Gerando...' : 'Gerar Link de Afiliado'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ProductDetail;

