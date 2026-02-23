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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
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
  latitude: number;
  longitude: number;
  affiliateId?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusEntry[];
}

export interface StatusEntry {
  status: OrderStatus;
  timestamp: string;
}

export interface AffiliateLink {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  code: string;
  url: string;
  clicks: number;
  orders: Order[];
  totalCommission: number;
  validatedCommission: number;
}

export interface Commission {
  id: string;
  affiliateLinkId: string;
  orderId: string;
  amount: number;
  validated: boolean;
  createdAt: string;
}
