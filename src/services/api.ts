import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from '../config/env';
import type * as B from './api.types';
import * as T from './transformers';

// ============================================
// AXIOS INSTANCE — authenticated (admin)
// ============================================

const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(env.TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (env.ENABLE_DEBUG_LOGS) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (env.ENABLE_DEBUG_LOGS) console.log(`[API] Response:`, response.data);
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem(env.REFRESH_KEY);
      if (refreshToken) {
        try {
          const response = await axios.post(`${env.API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem(env.TOKEN_KEY, access);
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${access}`;
            return apiClient(error.config);
          }
        } catch {
          localStorage.removeItem(env.TOKEN_KEY);
          localStorage.removeItem(env.REFRESH_KEY);
          localStorage.removeItem(`${env.TOKEN_KEY}_user`);
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AXIOS INSTANCE — public (shop, no auth)
// ============================================

const shopClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// ============================================
// ERROR HANDLER
// ============================================

class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const handleError = (error: AxiosError): never => {
  if (error.response?.data) {
    const data = error.response.data as any;
    const message = data.detail || data.message || 'An error occurred';
    throw new APIError(message, error.response.status, data);
  }
  throw new APIError(error.message || 'Network error');
};

// ============================================
// HELPERS
// ============================================

/**
 * Builds either a FormData (when imageFile provided) or plain object payload
 * for product create/update. When sending FormData, do NOT set Content-Type
 * manually — axios sets it with the correct multipart boundary automatically.
 */
function buildProductPayload(
  data: Partial<B.Product>,
  imageFile?: File
): FormData | Record<string, unknown> {
  if (imageFile) {
    const fd = new FormData();
    if (data.name !== undefined) fd.append('name', data.name);
    if (data.type !== undefined) fd.append('type', data.type);
    if (data.basePrice !== undefined) fd.append('base_price', data.basePrice.toFixed(3));
    if (data.flavor !== undefined) fd.append('flavor', data.flavor ?? '');
    if (data.isActive !== undefined) fd.append('active', String(data.isActive));
    if (data.description !== undefined) fd.append('description', data.description ?? '');
    fd.append('image', imageFile);
    return fd;
  }

  const obj: Record<string, unknown> = {};
  if (data.name !== undefined) obj.name = data.name;
  if (data.type !== undefined) obj.type = data.type;
  if (data.basePrice !== undefined) obj.base_price = data.basePrice.toFixed(3);
  if (data.flavor !== undefined) obj.flavor = data.flavor;
  if (data.isActive !== undefined) obj.active = data.isActive;
  if (data.description !== undefined) obj.description = data.description;
  return obj;
}

// ============================================
// AUTH API
// ============================================

export const authApi = {
  login: async (username: string, password: string): Promise<B.BackendLoginResponse> => {
    try {
      const response = await apiClient.post('/auth/login/', { username, password });
      const data: B.BackendLoginResponse = response.data;
      localStorage.setItem(env.TOKEN_KEY, data.access);
      localStorage.setItem(env.REFRESH_KEY, data.refresh);
      localStorage.setItem(`${env.TOKEN_KEY}_user`, JSON.stringify({ username: data.username }));
      return data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem(env.TOKEN_KEY);
    localStorage.removeItem(env.REFRESH_KEY);
    localStorage.removeItem(`${env.TOKEN_KEY}_user`);
  },

  refreshToken: async (): Promise<string> => {
    const refresh = localStorage.getItem(env.REFRESH_KEY);
    if (!refresh) throw new APIError('No refresh token');
    const response = await apiClient.post('/auth/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem(env.TOKEN_KEY, access);
    return access;
  },

  isAuthenticated: (): boolean => !!localStorage.getItem(env.TOKEN_KEY),
};

// ============================================
// PRODUCTS API
// ============================================

export const productsApi = {
  getAll: async (): Promise<B.Product[]> => {
    try {
      const response = await apiClient.get<B.BackendProduct[]>('/products/');
      return response.data.map(T.transformProduct);
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  getById: async (id: string): Promise<B.Product> => {
    const response = await apiClient.get<B.BackendProduct>(`/products/${id}/`);
    return T.transformProduct(response.data);
  },

  /**
   * Pass imageFile when the user selected a new image from the gallery.
   * Omit it (or pass undefined) to send a plain JSON request.
   */
  create: async (data: Partial<B.Product>, imageFile?: File): Promise<B.Product> => {
    const payload = buildProductPayload(data, imageFile);
    const response = await apiClient.post<B.BackendProduct>(
      '/products/',
      payload,
      // Let axios set Content-Type automatically for FormData
      imageFile ? { headers: { 'Content-Type': undefined } } : {}
    );
    return T.transformProduct(response.data);
  },

  update: async (id: string, data: Partial<B.Product>, imageFile?: File): Promise<B.Product> => {
    const payload = buildProductPayload(data, imageFile);
    const response = await apiClient.patch<B.BackendProduct>(
      `/products/${id}/`,
      payload,
      imageFile ? { headers: { 'Content-Type': undefined } } : {}
    );
    return T.transformProduct(response.data);
  },

  toggleActive: async (id: string): Promise<B.Product> => {
    const product = await productsApi.getById(id);
    return productsApi.update(id, { isActive: !product.isActive });
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}/`);
  },

  // ── Variant management ──────────────────────────────

  getVariants: async (productId: string): Promise<B.ProductVariant[]> => {
    const response = await apiClient.get<B.BackendProductVariant[]>(
      `/products/${productId}/variants/`
    );
    return response.data.map(T.transformVariant);
  },

  createVariant: async (
    productId: string,
    data: B.CreateVariantPayload
  ): Promise<B.ProductVariant> => {
    const response = await apiClient.post<B.BackendProductVariant>(
      `/products/${productId}/variants/`,
      data
    );
    return T.transformVariant(response.data);
  },

  updateVariant: async (
    productId: string,
    variantId: string,
    data: Partial<B.CreateVariantPayload>
  ): Promise<B.ProductVariant> => {
    const response = await apiClient.patch<B.BackendProductVariant>(
      `/products/${productId}/variants/${variantId}/`,
      data
    );
    return T.transformVariant(response.data);
  },

  deleteVariant: async (productId: string, variantId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}/variants/${variantId}/`);
  },
};

// ============================================
// BATCHES API
// ============================================

export const batchesApi = {
  getAll: async (): Promise<B.Batch[]> => {
    const response = await apiClient.get<B.BackendBatchStock[]>('/batch/stocks/');
    return response.data.map(T.transformBatch);
  },

  getById: async (id: string): Promise<B.Batch> => {
    const response = await apiClient.get<B.BackendBatchStock>(`/batch/stocks/${id}/`);
    return T.transformBatch(response.data);
  },

  create: async (data: Partial<B.Batch>, productId: number): Promise<B.Batch> => {
    const payload = T.toBackendCreateBatch(data, productId);
    const response = await apiClient.post<B.BackendBatchStock>('/batch/stocks/', payload);
    return T.transformBatch(response.data);
  },

  update: async (id: string, data: Partial<B.Batch>): Promise<B.Batch> => {
    const payload = T.toBackendUpdateBatch(data);
    const response = await apiClient.patch<B.BackendBatchStock>(`/batch/stocks/${id}/`, payload);
    return T.transformBatch(response.data);
  },

  close: async (id: string): Promise<B.Batch> =>
    batchesApi.update(id, { status: 'closed' }),

  reopen: async (id: string): Promise<B.Batch> =>
    batchesApi.update(id, { status: 'active' }),

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/batch/stocks/${id}/`);
  },

  // ── Variant config management ────────────────────────

  getVariantConfigs: async (batchId: string): Promise<B.BatchVariantConfig[]> => {
    const response = await apiClient.get<B.BackendBatchVariantConfig[]>(
      `/batch/stocks/${batchId}/variant-configs/`
    );
    return response.data.map(T.transformVariantConfig);
  },

  updateVariantConfig: async (
    batchId: string,
    configId: string,
    data: B.UpdateVariantConfigPayload
  ): Promise<B.BatchVariantConfig> => {
    const response = await apiClient.patch<B.BackendBatchVariantConfig>(
      `/batch/stocks/${batchId}/variant-configs/${configId}/`,
      data
    );
    return T.transformVariantConfig(response.data);
  },
};

// ============================================
// BOOKINGS API
// ============================================

export const bookingsApi = {
  getAll: async (batchId?: string): Promise<B.Booking[]> => {
    const params = batchId ? { batch_stock: batchId } : {};
    const response = await apiClient.get<B.BackendBatchBooking[]>('/batch/bookings/', { params });
    return response.data.map(T.transformBooking);
  },

  getById: async (id: string): Promise<B.Booking> => {
    const response = await apiClient.get<B.BackendBatchBooking>(`/batch/bookings/${id}/`);
    return T.transformBooking(response.data);
  },

  create: async (
    data: Partial<B.Booking>,
    customerId: number,
    batchStockId: number,
    variantId?: number
  ): Promise<B.Booking> => {
    const payload: B.CreateBookingPayload = {
      customer: customerId,
      batch_stock: batchStockId,
      ...(variantId ? { variant: variantId } : {}),
      pickup_date: data.pickupDate || '',
      quantity: data.qty || 1,
      payment_method: 'cash',
      payment_status: data.paymentStatus === 'paid' ? 'paid' : 'unpaid',
      discount: (data.discount || 0).toFixed(3),
    };
    const response = await apiClient.post<B.BackendBatchBooking>('/batch/bookings/', payload);
    return T.transformBooking(response.data);
  },

  updateStatus: async (
    id: string,
    status: B.Booking['bookingStatus']
  ): Promise<B.Booking> => {
    const response = await apiClient.patch<B.BackendBatchBooking>(
      `/batch/bookings/${id}/`,
      { status }
    );
    return T.transformBooking(response.data);
  },

  markCollected: (id: string) => bookingsApi.updateStatus(id, 'collected'),

  markPaid: async (id: string): Promise<B.Booking> => {
    const response = await apiClient.patch<B.BackendBatchBooking>(
      `/batch/bookings/${id}/`,
      { payment_status: 'paid' }
    );
    return T.transformBooking(response.data);
  },

  cancel: (id: string) => bookingsApi.updateStatus(id, 'cancelled'),
};

// ============================================
// CUSTOMERS API
// ============================================

export const customersApi = {
  getAll: async (): Promise<B.Customer[]> => {
    const [customersRes, bookingsRes] = await Promise.all([
      apiClient.get<B.BackendCustomer[]>('/customers/'),
      apiClient.get<B.BackendBatchBooking[]>('/batch/bookings/'),
    ]);
    return customersRes.data.map(c => T.transformCustomer(c, bookingsRes.data));
  },

  getById: async (id: string): Promise<B.Customer> => {
    const [customerRes, bookingsRes] = await Promise.all([
      apiClient.get<B.BackendCustomer>(`/customers/${id}/`),
      apiClient.get<B.BackendBatchBooking[]>('/batch/bookings/'),
    ]);
    return T.transformCustomer(customerRes.data, bookingsRes.data);
  },

  findOrCreateByPhone: async (
    name: string,
    phone: string
  ): Promise<B.BackendCustomer> => {
    const response = await apiClient.get<B.BackendCustomer[]>('/customers/', {
      params: { phone },
    });
    if (response.data.length > 0) return response.data[0];
    const createRes = await apiClient.post<B.BackendCustomer>('/customers/', { name, phone });
    return createRes.data;
  },

  create: async (data: B.CreateCustomerPayload): Promise<B.Customer> => {
    const response = await apiClient.post<B.BackendCustomer>('/customers/', data);
    return T.transformCustomer(response.data);
  },

  update: async (id: string, data: Partial<B.Customer>): Promise<B.Customer> => {
    const payload: Partial<B.BackendCustomer> = {};
    if (data.name) payload.name = data.name;
    if (data.phone) payload.phone = data.phone;
    const response = await apiClient.patch<B.BackendCustomer>(`/customers/${id}/`, payload);
    return T.transformCustomer(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}/`);
  },
};

// ============================================
// DASHBOARD API
// ============================================

export const dashboardApi = {
  getStats: async (): Promise<B.KPIData> => {
    const response = await apiClient.get<B.BackendDashboardStats>(
      '/batch/stocks/dashboard-stats/'
    );
    return T.transformKPIData(response.data);
  },
};

// ============================================
// SHOP API — public, no auth required
// ============================================

export const shopApi = {
  /**
   * Fetches all open batches for the shop.
   * Returns ALL batches regardless of product.active —
   * the frontend visually disables inactive products.
   */
  getOpenBatches: async (): Promise<B.ShopBatch[]> => {
    const response = await shopClient.get<B.BackendPublicBatch[]>('/batch/public/');
    return response.data.map(T.transformShopBatch);
  },

  getShopBatchById: async (id: string): Promise<B.ShopBatch> => {
    const response = await shopClient.get<B.BackendPublicBatch>(`/batch/public/${id}/`);
    return T.transformShopBatch(response.data);
  },

  // Legacy method kept so old shop code doesn't break
  getActiveProducts: async (): Promise<B.Product[]> => {
    const response = await apiClient.get<B.BackendProduct[]>('/products/', {
      params: { active: true, type: 'batch' },
    });
    return response.data.map(T.transformProduct);
  },

  getProductDetail: async (id: string): Promise<B.Product> => {
    return productsApi.getById(id);
  },

  getProductBatchStocks: async (productId: string): Promise<B.Batch[]> => {
    const response = await apiClient.get<B.BackendBatchStock[]>('/batch/stocks/', {
      params: { product: productId, status: 'open' },
    });
    return response.data.map(T.transformBatch);
  },
};

// ============================================
// EXPORT ALL APIS
// ============================================

export const api = {
  auth: authApi,
  products: productsApi,
  batches: batchesApi,
  bookings: bookingsApi,
  customers: customersApi,
  dashboard: dashboardApi,
  shop: shopApi,
};

export default api;