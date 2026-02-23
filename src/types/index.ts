export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  categories: string[];
  categoryNames?: string[];
  imageUrl: string;
  rating: number;
  stock: number;
}

export type OrderStatus = 'agendado' | 'cancelado' | 'em_progresso' | 'comprado';

export interface Order {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  status: OrderStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  latitude?: number;
  longitude?: number;
  affiliateId?: string;
  affiliateCode?: string;
  affiliateName?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusEntry[];
}

export interface StatusEntry {
  status: OrderStatus;
  timestamp: string;
}

export interface AffiliateOrderSummary {
  id: string;
  status: OrderStatus;
  scheduledDate: string;
  scheduledTime: string;
  createdAt: string;
}

export interface AffiliateLink {
  id: string;
  userId: string;
  productId: string;
  code: string;
  url: string;
  clicks: number;
  ordersCount: number;
  createdAt: string;
  product?: Product;
  affiliateName?: string;
  orders?: AffiliateOrderSummary[];
}

export interface AffiliateSummary {
  totalEarned: number;
  totalWithdrawn: number;
  available: number;
  minWithdraw: number;
  maxWithdraw: number;
  hasBankDetails: boolean;
  bank?: { accountName: string; bankName: string; iban: string } | null;
}

export interface AffiliatePayout {
  id: string;
  userId: string;
  amount: number;
  status: 'requested' | 'paid' | 'denied';
  createdAt: string;
}

export interface AffiliateLinkSummary {
  id: string;
  userId: string;
  productId: string;
  code: string;
  url: string;
  clicks: number;
  ordersCount: number;
  createdAt: string;
  product?: Product;
  affiliateName?: string;
}

export interface Commission {
  id: string;
  affiliateLinkId: string;
  orderId: string;
  amount: number;
  validated: boolean;
  createdAt: string;
}
