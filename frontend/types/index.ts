export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export type UserRole =
  | "ROLE_USER"
  | "ROLE_SELLER"
  | "ROLE_STAFF"
  | "ROLE_MANAGER"
  | "ROLE_ADMIN";

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  profileImageUrl?: string;
  isActive: boolean;
  mileage?: number;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  children?: Category[];
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountRate: number;
  discountedPrice: number;
  stock: number;
  category: Category;
  thumbnailUrl: string;
  imageUrls: string[];
  sellerId: number;
  sellerName: string;
  rating: number;
  reviewCount: number;
  likeCount: number;
  isLiked: boolean;
  status: "ACTIVE" | "SOLDOUT" | "HIDDEN";
  createdAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  thumbnailUrl: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  stock: number;
  sellerName: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: "PENDING" | "PAID" | "SHIPPING" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  thumbnailUrl: string;
  price: number;
  quantity: number;
}

export interface Review {
  id: number;
  productId: number;
  authorName: string;
  rating: number;
  content: string;
  imageUrls: string[];
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorProfileImageUrl?: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  discountType: "FIXED" | "PERCENT";
  discountValue: number;
  minOrderAmount: number;
  expiresAt: string;
  isUsed: boolean;
}
