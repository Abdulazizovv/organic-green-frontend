import { adminClient } from '@/api/adminClient';

// Generic pagination response
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// User types
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_verified?: boolean; // qo'shildi
  date_joined: string;
  last_login: string | null;
  orders_count?: number;
  total_spent?: number;
}

export interface RecentUserOrder { id: string; order_number: string; total_price: number; status: string; created_at: string; }
export interface RecentFavorite { product_id: string; product_name: string; created_at: string; }

export interface AdminUserDetail extends AdminUser {
  recent_orders?: RecentUserOrder[];
  recent_favorites?: RecentFavorite[];
  course_applications?: number;
  franchise_applications?: number;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

// Product types
export interface AdminProduct {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  slug: string;
  price: string;
  sale_price?: string;
  stock: number;
  category: number;
  category_name?: string;
  is_active: boolean;
  is_featured: boolean;
  orders_count?: number;
  favorites_count?: number;
  created_at: string;
  updated_at?: string;
  // yangi maydonlar (ro'yxat endpointida ham chiqishi mumkin)
  primary_image_url?: string;
  image_count?: number;
}

export interface ProductCategory { id: number; name_uz: string; name_ru: string; name_en: string; }

export interface CreateProductPayload {
  name_uz: string; name_ru: string; name_en: string; slug?: string; price: string; sale_price?: string; stock: number; category: number; is_active: boolean; is_featured: boolean;
}
export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text_uz?: string;
  alt_text_ru?: string;
  alt_text_en?: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface ProductRecentOrder { order_id: string; order_number: string; quantity: number; price: number; created_at: string; }

export interface AdminProductDetail extends AdminProduct {
  total_sold?: number;
  revenue_generated?: number;
  stock_status?: string;
  images_list?: ProductImage[];
  recent_orders?: ProductRecentOrder[];
}

// Orders
export interface AdminOrderListItem {
  id: string;
  order_number: string;
  user: number;
  user_email: string;
  full_name: string;
  contact_phone: string;
  delivery_address: string;
  status: string;
  payment_method: string;
  total_price: string;
  items_count: number;
  created_at: string;
  updated_at: string;
  notes?: string | string[]; // qo'shimcha ma'lumot / eslatmalar
}

export interface AdminOrderDetail extends AdminOrderListItem {
  items: {
    id: number;
    product: string;
    product_name: string;
    quantity: number;
    total_price: string;
    unit_price: string;
  }[];
  notes?: string | string[]; // batafsil eslatmalar
}

// Dashboard stats (yangi strukturasi)
export interface DashboardUserStats { total_users: number; active_users: number; new_users_today: number; new_users_week: number; }
export interface DashboardProductStats { total_products: number; active_products: number; featured_products: number; out_of_stock: number; }
export interface DashboardOrderStats { total_orders: number; pending_orders: number; completed_orders: number; today_orders: number; week_orders: number; }
export interface DashboardRevenueStats { today_revenue: number; week_revenue: number; month_revenue: number; }
export interface DashboardApplicationStats { course_applications: number; pending_course_applications: number; franchise_applications: number; pending_franchise_applications: number; }
export interface DashboardResponse {
  user_stats: DashboardUserStats;
  product_stats: DashboardProductStats;
  order_stats: DashboardOrderStats;
  revenue_stats: DashboardRevenueStats;
  application_stats: DashboardApplicationStats;
  generated_at: string;
}

// Course Applications
export interface CourseApplication {
  id: string;
  course: string; // slug or id
  full_name: string;
  phone: string; // raw phone
  email?: string;
  city?: string;
  investment_amount?: number;
  referral_source?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  processed?: boolean;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
  // Extra fields used by admin UI
  application_number?: string;
  phone_number?: string; // formatted variant
  course_name?: string; // localized course title
  status_display?: string;
}

// Franchise Applications (minimal fields based on API docs assumptions)
export interface FranchiseApplication {
  id: number | string;
  full_name: string;
  phone: string;
  email?: string;
  city?: string;
  investment_amount?: number | string; // API might return number or formatted string
  referral_source?: string;
  message?: string;
  experience?: string; // added for admin UI detail modal
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'; // include 'reviewed'
  status_display?: string; // human readable label
  is_pending?: boolean;
  is_approved?: boolean;
  created_at: string;
  created_at_formatted?: string; // optional pre-formatted timestamp
  updated_at: string; // required for detail view
  admin_notes?: string; // future-proofing similar to course applications
}

// Query parameter helpers
export interface ListQuery {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: unknown;
}

function buildQuery(params?: ListQuery) {
  if (!params) return '';
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    qs.append(k, String(v));
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const adminAPI = {
  // Users
  getUsers: (params?: ListQuery) => adminClient.get<Paginated<AdminUser>>(`users/${buildQuery(params)}`),
  getUser: (id: number) => adminClient.get<AdminUserDetail>(`users/${id}/`),
  updateUser: (id: number, data: UpdateUserPayload) => adminClient.patch<AdminUser>(`users/${id}/`, data),
  deleteUser: (id: number) => adminClient.delete<void>(`users/${id}/`),
  getUserActivity: () => adminClient.get('users/activity/'),

  // Products
  getProductCategories: () => adminClient.get<ProductCategory[]>(`categories/`),
  getProducts: (params?: ListQuery) => adminClient.get<Paginated<AdminProduct>>(`products/${buildQuery(params)}`),
  getProduct: (id: string) => adminClient.get<AdminProductDetail>(`products/${id}/`),
  createProduct: (data: CreateProductPayload | FormData) => {
    if (typeof FormData !== 'undefined' && data instanceof FormData) return adminClient.post<AdminProductDetail>('products/', data);
    return adminClient.post<AdminProduct>('products/', data as CreateProductPayload);
  },
  updateProduct: (id: string, data: UpdateProductPayload) => adminClient.patch<AdminProduct>(`products/${id}/`, data),
  deleteProduct: (id: string) => adminClient.delete<void>(`products/${id}/`),
  getProductStats: () => adminClient.get('products/stats/'),
  uploadProductImages: (id: string, form: FormData) => adminClient.post(`products/${id}/upload-image/`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  setPrimaryProductImage: (id: string, image_id: string) => adminClient.patch(`products/${id}/set-primary-image/`, { image_id }),
  deleteProductImage: (id: string, image_id: string) => adminClient.delete(`products/${id}/delete-image/?image_id=${image_id}`),

  // Orders
  getOrders: (params?: ListQuery) => adminClient.get<Paginated<AdminOrderListItem>>(`orders/${buildQuery(params)}`),
  getOrder: (id: string) => adminClient.get<AdminOrderDetail>(`orders/${id}/`),
  updateOrderStatus: (id: string, status: string) => adminClient.patch<AdminOrderDetail>(`orders/${id}/`, { status }),
  getRevenueStats: () => adminClient.get('orders/revenue/'),

  // Dashboard
  getDashboardStats: () => adminClient.get<DashboardResponse>('dashboard/'),

  // Course Applications
  getCourseApplications: (params?: ListQuery) => adminClient.get<Paginated<CourseApplication>>(`course-applications/${buildQuery(params)}`),
  getCourseApplication: (id: string) => adminClient.get<CourseApplication>(`course-applications/${id}/`),
  updateCourseApplication: (id: string, data: Partial<Pick<CourseApplication, 'processed'>>) => adminClient.patch<CourseApplication>(`course-applications/${id}/`, data),
  // Franchise Applications
  getFranchiseApplications: (params?: ListQuery) => adminClient.get<Paginated<FranchiseApplication>>(`franchise-applications/${buildQuery(params)}`),
  getFranchiseApplication: (id: number) => adminClient.get<FranchiseApplication>(`franchise-applications/${id}/`),
  updateFranchiseApplication: (id: number, data: Partial<Pick<FranchiseApplication, 'status'>>) => adminClient.patch<FranchiseApplication>(`franchise-applications/${id}/`, data),
};
