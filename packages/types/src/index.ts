// Shop types
export type ShopTemplate = 'minimal' | 'boutique' | 'kids' | 'street';
export type ShopHeroStyle = 'big-banner' | 'small-hero' | 'carousel';
export type ShopCardStyle = 'rounded' | 'square' | 'elevated';
export type ShopFont = 'inter' | 'playfair' | 'montserrat' | 'roboto' | 'poppins';
export type ShopPlan = 'free' | 'starter' | 'pro';
export type ShopThemeId = 'soft-pastel' | 'monochrome-editorial' | 'high-contrast-dark' | 'vivid-accent' | 'brutalist' | 'glassmorphic';

export interface Shop {
  id: number;
  name: string;
  slug: string;
  subdomain: string;
  customDomain?: string;
  logo?: Media;
  primaryColor: string;
  secondaryColor: string;
  font: ShopFont;
  template: ShopTemplate;
  themeId?: ShopThemeId; // New: Maps to ThemeProvider theme definitions
  heroStyle: ShopHeroStyle;
  cardStyle: ShopCardStyle;
  isActive: boolean;
  plan: ShopPlan;
  whatsappNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  owner?: User;
  products?: Product[];
  categories?: Category[];
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  oldPrice?: number;
  images: Media[];
  sizes: string[];
  colors: string[];
  isFeatured: boolean;
  isActive: boolean;
  stock?: number;
  shop: Shop | number;
  category?: Category | number;
  createdAt: string;
  updatedAt: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  shop: Shop | number;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'other';

export interface OrderItem {
  id: number;
  product: Product | number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  shop: Shop | number;
  createdAt: string;
  updatedAt: string;
}

// User types
export type UserRole = 'platform_admin' | 'shop_owner' | 'shop_staff';

export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role: {
    id: number;
    name: string;
    description: string;
    type: UserRole;
  };
  createdAt: string;
  updatedAt: string;
}

// Media types
export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

export interface Media {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

// Strapi response wrappers
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiCollectionResponse<T> {
  data: StrapiEntity<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: StrapiEntity<T>;
  meta: Record<string, unknown>;
}

// Auth types
export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

// API Error types
export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: Record<string, unknown>;
}

// WhatsApp types
export interface WhatsAppMessageParams {
  phone: string;
  productName: string;
  price: number;
  shopName: string;
  size?: string;
  color?: string;
}

// Dashboard stats types
export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  whatsappClicks: number;
}

// Form types
export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  images: File[] | Media[];
  sizes: string[];
  colors: string[];
  isFeatured: boolean;
  isActive: boolean;
  stock?: number;
  category?: number;
}

export interface CategoryFormData {
  name: string;
  sortOrder: number;
}

export interface ShopSettingsFormData {
  name: string;
  logo?: File | Media;
  primaryColor: string;
  secondaryColor: string;
  font: ShopFont;
  template: ShopTemplate;
  heroStyle: ShopHeroStyle;
  cardStyle: ShopCardStyle;
  whatsappNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}
