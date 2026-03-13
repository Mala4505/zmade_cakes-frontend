import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from '../config/env';
import type * as B from './api.types';
import * as T from './transformers';

// ============================================
// AXIOS INSTANCE CONFIGURATION
// ============================================

const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(env.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (env.ENABLE_DEBUG_LOGS) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    if (env.ENABLE_DEBUG_LOGS) {
      console.log(`[API] Response:`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired - try to refresh
      const refreshToken = localStorage.getItem(env.REFRESH_KEY);
      if (refreshToken) {
        try {
          const response = await axios.post(`${env.API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem(env.TOKEN_KEY, access);

          // Retry original request
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${access}`;
            return apiClient(error.config);
          }
        } catch (refreshError) {
          // Refresh failed - logout
          localStorage.removeItem(env.TOKEN_KEY);
          localStorage.removeItem(env.REFRESH_KEY);
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// API ERROR HANDLER
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
// AUTH API
// ============================================

export const authApi = {
  login: async (username: string, password: string): Promise<B.BackendLoginResponse> => {
    try {
      const response = await apiClient.post('/auth/login/', { username, password });
      const data: B.BackendLoginResponse = response.data;

      // Store tokens
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

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(env.TOKEN_KEY);
  },
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

  create: async (data: Partial<B.Product>): Promise<B.Product> => {
    const payload = T.toBackendCreateProduct(data);
    const response = await apiClient.post<B.BackendProduct>('/products/', payload);
    return T.transformProduct(response.data);
  },

  update: async (id: string, data: Partial<B.Product>): Promise<B.Product> => {
    const payload = T.toBackendUpdateProduct(data);
    const response = await apiClient.patch<B.BackendProduct>(`/products/${id}/`, payload);
    return T.transformProduct(response.data);
  },

  toggleActive: async (id: string): Promise<B.Product> => {
    const product = await productsApi.getById(id);
    return productsApi.update(id, { isActive: !product.isActive });
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}/`);
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

  close: async (id: string): Promise<B.Batch> => {
    return batchesApi.update(id, { status: 'closed' });
  },

  reopen: async (id: string): Promise<B.Batch> => {
    return batchesApi.update(id, { status: 'active' });
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/batch/stocks/${id}/`);
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

  create: async (data: Partial<B.Booking>, customerId: number, batchStockId: number): Promise<B.Booking> => {
    const payload: B.CreateBookingPayload = {
      customer: customerId,
      batch_stock: batchStockId,
      pickup_date: data.pickupDate || '',
      quantity: data.qty || 1,
      payment_method: 'cash',
      payment_status: data.paymentStatus === 'paid' ? 'paid' : 'unpaid',
      discount: (data.discount || 0).toFixed(3),
    };
    const response = await apiClient.post<B.BackendBatchBooking>('/batch/bookings/', payload);
    return T.transformBooking(response.data);
  },

  updateStatus: async (id: string, status: B.Booking['bookingStatus']): Promise<B.Booking> => {
    const response = await apiClient.patch<B.BackendBatchBooking>(`/batch/bookings/${id}/`, { status });
    return T.transformBooking(response.data);
  },

  markCollected: async (id: string): Promise<B.Booking> => {
    return bookingsApi.updateStatus(id, 'collected');
  },

  markPaid: async (id: string): Promise<B.Booking> => {
    const response = await apiClient.patch<B.BackendBatchBooking>(`/batch/bookings/${id}/`, {
      payment_status: 'paid',
    });
    return T.transformBooking(response.data);
  },

  cancel: async (id: string): Promise<B.Booking> => {
    return bookingsApi.updateStatus(id, 'cancelled');
  },
};

// ============================================
// CUSTOMERS API
// ============================================

export const customersApi = {
  getAll: async (): Promise<B.Customer[]> => {
    // Fetch customers and bookings in parallel for stats
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

  findOrCreateByPhone: async (name: string, phone: string): Promise<B.BackendCustomer> => {
    // First search for existing customer
    const response = await apiClient.get<B.BackendCustomer[]>('/customers/', {
      params: { phone },
    });

    if (response.data.length > 0) {
      return response.data[0];
    }

    // Create new customer
    const createRes = await apiClient.post<B.BackendCustomer>('/customers/', {
      name,
      phone,
    });
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
    const response = await apiClient.get<B.BackendDashboardStats>('/batch/stocks/dashboard-stats/');
    return T.transformKPIData(response.data);
  },
};

// ============================================
// SHOP API (Public endpoints)
// ============================================

export const shopApi = {
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
