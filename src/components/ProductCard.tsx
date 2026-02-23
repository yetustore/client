import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatPrice } from '@/data/mockData';
import { Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, index, categoryLabel }: { product: Product; index: number; categoryLabel?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/products/${product.id}`}
        className="group block overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-elevated"
      >
        <div className="aspect-square overflow-hidden bg-secondary">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          {categoryLabel && (
            <span className="mb-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {categoryLabel}
            </span>
          )}
          <h3 className="mb-1 font-display text-base font-semibold text-foreground line-clamp-1">
            {product.name}
          </h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-1 text-accent">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-medium">{product.rating}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary/5 py-2 text-sm font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ShoppingBag className="h-4 w-4" />
            Ver Produto
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
