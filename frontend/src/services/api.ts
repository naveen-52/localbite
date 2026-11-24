import axios from 'axios';
import type { ApiResponse, AuthResponse, FoodItem, NearbyShop, OrderResponse, PlatformStats, ShopCategory, ShopDetail, SubscriptionPlan } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Bearer Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('localbite_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle global 401 unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('localbite_token');
      localStorage.removeItem('localbite_user');
      if (window.location.pathname.startsWith('/owner') || window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data;
  },
  register: async (data: { fullName: string; email: string; phoneNumber: string; password: string; role: string }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.get<ApiResponse<any>>('/auth/me');
    return res.data;
  },

  // Discovery & Shops
  getCategories: async () => {
    const res = await apiClient.get<ApiResponse<ShopCategory[]>>('/categories');
    return res.data;
  },
  getNearbyShops: async (lat: number, lng: number, radius = 5.0) => {
    const res = await apiClient.get<ApiResponse<NearbyShop[]>>(`/shops/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return res.data;
  },
  getShopBySlug: async (slug: string) => {
    const res = await apiClient.get<ApiResponse<ShopDetail>>(`/shops/${slug}`);
    return res.data;
  },

  // Owner Operations
  getMyShop: async () => {
    const res = await apiClient.get<ApiResponse<ShopDetail>>('/owner/my-shop');
    return res.data;
  },
  createShop: async (shopData: any) => {
    const res = await apiClient.post<ApiResponse<ShopDetail>>('/shops', shopData);
    return res.data;
  },
  updateShop: async (shopData: any) => {
    const res = await apiClient.put<ApiResponse<ShopDetail>>('/owner/my-shop', shopData);
    return res.data;
  },
  toggleShopClosure: async (closed: boolean, reason?: string) => {
    const res = await apiClient.patch<ApiResponse<ShopDetail>>('/owner/my-shop/closure', { closed, reason });
    return res.data;
  },

  // Menu & Food Management
  getShopMenu: async (shopId: number) => {
    const res = await apiClient.get<ApiResponse<FoodItem[]>>(`/shops/${shopId}/menu`);
    return res.data;
  },
  addFoodItem: async (shopId: number, data: any) => {
    const res = await apiClient.post<ApiResponse<FoodItem>>(`/shops/${shopId}/foods`, data);
    return res.data;
  },
  updateAvailability: async (foodItemId: number, status: string, quantity?: number) => {
    const res = await apiClient.patch<ApiResponse<FoodItem>>(`/foods/${foodItemId}/availability`, { status, quantity });
    return res.data;
  },

  // Plans & Payments
  getPlans: async () => {
    const res = await apiClient.get<ApiResponse<SubscriptionPlan[]>>('/plans');
    return res.data;
  },
  createPaymentOrder: async (shopId: number, planId: number) => {
    const res = await apiClient.post<ApiResponse<OrderResponse>>('/payments/create-order', { shopId, planId });
    return res.data;
  },
  verifyPayment: async (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) => {
    const res = await apiClient.post<ApiResponse<boolean>>('/payments/verify', data);
    return res.data;
  },
  getPaymentHistory: async () => {
    const res = await apiClient.get<ApiResponse<any[]>>('/payments/history');
    return res.data;
  },

  // Admin Controls
  getPlatformStats: async () => {
    const res = await apiClient.get<ApiResponse<PlatformStats>>('/admin/stats');
    return res.data;
  },
  getPendingShops: async (page = 0, size = 10) => {
    const res = await apiClient.get<ApiResponse<any>>(`/admin/shops/pending?page=${page}&size=${size}`);
    return res.data;
  },
  verifyShop: async (shopId: number, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
    const res = await apiClient.patch<ApiResponse<any>>(`/admin/shops/${shopId}/verify`, { status });
    return res.data;
  },
  updatePlanPrice: async (planId: number, price: number) => {
    const res = await apiClient.put<ApiResponse<any>>(`/admin/plans/${planId}/price`, { price });
    return res.data;
  },
  getAuditLogs: async (page = 0, size = 20) => {
    const res = await apiClient.get<ApiResponse<any>>(`/admin/audit-logs?page=${page}&size=${size}`);
    return res.data;
  },
};
