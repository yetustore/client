import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatPrice } from '@/data/mockData';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const getPrimaryImage = (product: Product) => {
  const media = (product.media && product.media.length > 0)
    ? product.media
    : (product.imageUrl ? [{ type: 'image' as const, url: product.imageUrl }] : []);
  const first = media.find(m => m.type === 'image' && m.url);
  return first?.url || product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
};

const ProductCard = ({ product, index, categoryLabel }: { product: Product; index: number; categoryLabel?: string }) => {
  const primaryImage = getPrimaryImage(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="h-full"
    >
      <Link
        to={`/products/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
      >
        <div className="relative h-32 overflow-hidden bg-secondary sm:h-36 md:h-40">
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
          {categoryLabel && (
            <span className="inline-block w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {categoryLabel}
            </span>
          )}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-base font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-1 text-accent">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-[11px] font-medium">{product.rating}</span>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Estoque: {product.stock}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
