export type Role = 'CUSTOMER' | 'SHOP_OWNER' | 'ADMIN';

export type AvailabilityStatus = 'AVAILABLE' | 'LIMITED' | 'SOLD_OUT';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
}

export interface ShopCategory {
  id: number;
  name: string;
  slug: string;
  iconName?: string;
  displayOrder: number;
  active: boolean;
}

export interface ShopStatusInfo {
  open: boolean;
  statusMessage: string;
  nextOpenTime?: string;
  currentClosingTime?: string;
}

export interface NearbyShop {
  id: number;
  name: string;
  slug: string;
  categoryName: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  profileImageUrl?: string;
  distanceKm: number;
  open: boolean;
  statusMessage: string;
  availableItemCount: number;
}

export interface ShopDetail {
  id: number;
  ownerId: number;
  categoryName: string;
  name: string;
  slug: string;
  description?: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  bannerImageUrl?: string;
  profileImageUrl?: string;
  verificationStatus: VerificationStatus;
  temporarilyClosed: boolean;
  closureReason?: string;
  statusInfo: ShopStatusInfo;
}

export interface FoodItem {
  id: number;
  shopId: number;
  categoryId?: number;
  categoryName?: string;
  name: string;
  regionalName?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  availabilityStatus: AvailabilityStatus;
  quantityTracked: boolean;
  currentQuantity: number;
  enabled: boolean;
  updatedAt: string;
}

export interface AvailabilityEvent {
  foodItemId: number;
  shopId: number;
  foodName: string;
  status: AvailabilityStatus;
  remainingQuantity?: number;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: number;
  title: string;
  planType: 'REGISTRATION_FEE' | 'RECURRING_SUBSCRIPTION';
  billingInterval: 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  durationDays: number;
  price: number;
  description?: string;
  active: boolean;
}

export interface OrderResponse {
  transactionRef: string;
  gatewayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  planTitle: string;
  shopName: string;
}

export interface PlatformStats {
  totalCustomers: number;
  totalShopOwners: number;
  activeShops: number;
  pendingShops: number;
  suspendedShops: number;
  totalRevenue: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
