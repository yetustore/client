import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockProducts } from '@/data/mockData';
import { formatPrice } from '@/data/mockData';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, ArrowLeft, CalendarDays, Share2, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === id);

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

  const handleGenerateLink = () => {
    const code = `REF-${product.id.toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
    const url = `https://yetustore.com/r/${code}`;
    navigator.clipboard?.writeText(url);
    toast.success('Link de afiliado copiado!', { description: url });
  };

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
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <img src={product.imageUrl} alt={product.name} className="aspect-square w-full object-cover" />
          </div>

          <div className="flex flex-col justify-center">
            <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {product.category}
            </span>
            <h1 className="mb-2 font-display text-3xl font-bold text-foreground">{product.name}</h1>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-accent">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{product.stock} em estoque</span>
            </div>
            <p className="mb-6 leading-relaxed text-muted-foreground">{product.description}</p>
            <p className="mb-6 font-display text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => navigate(`/schedule/${product.id}`)}
                className="flex-1 gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                Agendar Entrega
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateLink}
                className="flex-1 gap-2"
              >
                <Share2 className="h-4 w-4" />
                Gerar Link de Afiliado
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ProductDetail;
