import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

const STORAGE_KEY = 'yetu_cart';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const readStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => item && typeof item.productId === 'string' && typeof item.quantity === 'number');
  } catch {
    return [];
  }
};

const clampQuantity = (value: number, max?: number) => {
  const next = Math.max(0, Math.floor(value));
  if (typeof max === 'number') {
    return Math.min(next, max);
  }
  return next;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      const stockLimit = product.stock || Infinity;
      const nextQuantity = clampQuantity((existing?.quantity || 0) + quantity, stockLimit);
      if (existing) {
        if (nextQuantity <= 0) {
          return prev.filter(item => item.productId !== product.id);
        }
        return prev.map(item => item.productId === product.id ? { ...item, quantity: nextQuantity } : item);
      }
      if (nextQuantity <= 0) return prev;
      return [...prev, { productId: product.id, product, quantity: nextQuantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev => prev.reduce<CartItem[]>((acc, item) => {
      if (item.productId !== productId) {
        acc.push(item);
        return acc;
      }
      const limit = item.product.stock || Infinity;
      const next = clampQuantity(quantity, limit);
      if (next <= 0) return acc;
      acc.push({ ...item, quantity: next });
      return acc;
    }, []));
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, totalItems, totalAmount, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

