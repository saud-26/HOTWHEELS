import type { Timestamp } from 'firebase/firestore';

export const HOT_WHEELS_UPI_ID = 'anwarulhaquekhan619@oksbi';
export const HOT_WHEELS_STORE_NAME = 'Hot Wheels Store';
export const INDIA_CURRENCY = 'INR';

export const FIRESTORE_COLLECTIONS = {
  products: 'products',
  orders: 'orders',
  users: 'users',
  adminUsers: 'adminUsers',
  promoCodes: 'promoCodes',
  promoUsage: 'promoUsage',
  inventoryAlerts: 'inventoryAlerts',
  auditLogs: 'auditLogs',
  reviews: 'reviews',
  stockAlerts: 'stockAlerts',
  newsletter: 'newsletter',
} as const;

export const PRODUCT_SERIES = [
  'Hot Wheels Mainline',
  'Car Culture',
  'RLC',
  'Treasure Hunt',
  'Super Treasure Hunt',
  'Fast & Furious',
  'Mario Kart',
  'Premium',
] as const;

export const PRODUCT_SCALES = ['1:64', '1:43', '1:24', '1:18'] as const;
export const PRODUCT_RARITIES = ['Common', 'Uncommon', 'Rare', 'Super Treasure Hunt'] as const;
export const PAYMENT_METHODS = ['UPI', 'COD'] as const;

export type ProductSeries = (typeof PRODUCT_SERIES)[number];
export type ProductScale = (typeof PRODUCT_SCALES)[number];
export type ProductRarity = (typeof PRODUCT_RARITIES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'refunded';

export type PaymentStatus = 'pending' | 'awaiting_verification' | 'verified' | 'failed';
export type AdminRole = 'superadmin' | 'manager' | 'editor' | 'viewer';
export type TimestampLike = Timestamp | Date | null;

export interface StoreProduct {
  productId: string;
  name: string;
  series: string;
  year: number;
  scale: ProductScale | string;
  color: string;
  price: number;
  stock: number;
  sold: number;
  castNumber: string;
  rarity: ProductRarity | string;
  description: string;
  images: string[];
  imageUrl?: string;
  lowStockThreshold?: number;
  outOfStockAlert?: boolean;
  lowStockAlert?: boolean;
  avgRating?: number;
  reviewCount?: number;
  ratingBreakdown?: Record<'1' | '2' | '3' | '4' | '5', number>;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
  active: boolean;
}

export interface StoreOrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface StoreOrder {
  orderId: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: StoreOrderItem[];
  subtotal: number;
  discount: number;
  codFee?: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  upiTransactionId?: string;
  upiScreenshot?: string;
  upiPaymentLink?: string;
  paidAt?: TimestampLike;
  verifiedBy?: string;
  verifiedAt?: TimestampLike;
  orderStatus: OrderStatus;
  trackingId?: string;
  courier?: string;
  notes?: string;
  createdAt?: TimestampLike;
  updatedAt?: TimestampLike;
}

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  createdBy: string;
  createdAt?: TimestampLike;
  lastLogin?: TimestampLike;
  active: boolean;
  permissions: {
    viewAnalytics: boolean;
    manageOrders: boolean;
    manageProducts: boolean;
    manageUsers: boolean;
    manageAdmins: boolean;
    manageDiscounts: boolean;
    exportData: boolean;
  };
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: INDIA_CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildUpiPaymentLink(total: number, orderId: string) {
  const params = new URLSearchParams({
    pa: HOT_WHEELS_UPI_ID,
    pn: HOT_WHEELS_STORE_NAME,
    am: String(total),
    cu: INDIA_CURRENCY,
    tn: `Order ${orderId}`,
  });

  return `upi://pay?${params.toString()}`;
}
