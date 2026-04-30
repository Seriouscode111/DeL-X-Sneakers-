export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  region?: string;
  businessType?: string;
  verificationStatus?: 'idle' | 'pending' | 'verified' | 'rejected';
  idDocument?: string;
  currency?: string;
  createdAt: string;
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
    };
    payment: {
      currency: string;
      defaultMethod: string;
    };
    security: {
      twoFactorEnabled: boolean;
      lastLoginAlert: boolean;
    };
  };
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate relative to USD (base)
  name: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerIds: string[];
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  carrier?: string;
  sellerPhone?: string;
  deliveryContact?: string;
  estimatedDelivery?: string;
  shippingAddress?: {
    street: string;
    city: string;
    zip: string;
    ghanaPostGps?: string;
  };
  tracking?: {
    lat: number;
    lng: number;
    lastUpdated: string;
    path: { lat: number, lng: number }[];
  };
  paymentMethod: 'card' | 'mtn' | 'bitcoin' | 'paypal' | 'cash';
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  participants: string[];
  lastMessage?: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
