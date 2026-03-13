// ============================================
// BACKEND API RESPONSE TYPES (snake_case)
// ============================================

/** Django Product model response */
export interface BackendProduct {
  id: number;
  name: string;
  type: 'batch' | 'custom';
  base_price: string; // Decimal as string
  flavor: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Django BatchStock model response */
export interface BackendBatchStock {
  id: number;
  product: BackendProduct;
  start_date: string;
  total_quantity: number;
  booked_quantity: number;
  collected_quantity: number;
  available_quantity: number; // Computed
  status: 'open' | 'closed';
  created_at: string;
}

/** Django Customer model response */
export interface BackendCustomer {
  id: number;
  name: string;
  phone: string;
  created_at: string;
}

/** Django BatchBooking model response */
export interface BackendBatchBooking {
  id: number;
  customer: BackendCustomer;
  batch_stock: number; // FK ID
  pickup_date: string;
  quantity: number;
  payment_method: 'cash' | 'wamd';
  payment_status: 'paid' | 'unpaid';
  discount: string; // Decimal as string
  total_amount: string; // Decimal as string
  status: 'booked' | 'collected' | 'cancelled';
  created_at: string;
}

/** JWT Login response */
export interface BackendLoginResponse {
  access: string;
  refresh: string;
  username: string;
}

/** Dashboard stats response */
export interface BackendDashboardStats {
  open_batches: number;
  total_available: number;
  total_booked: number;
  total_collected: number;
  revenue_collected: number;
  revenue_pending: number;
}

// ============================================
// FRONTEND TYPES (camelCase) - Use these in UI
// ============================================

export interface Product {
  id: string;
  name: string;
  type: 'batch' | 'custom';
  basePrice: number;
  isActive: boolean;
  flavor: string;
  description?: string; // Frontend-only, not in backend
  image?: string; // Frontend-only, not in backend
}

export interface Batch {
  id: string;
  productName: string;
  startDate: string;
  endDate: string; // Frontend-only (calculated as start_date + 3 days)
  status: 'active' | 'closed' | 'upcoming';
  totalQty: number;
  bookedQty: number;
  collectedQty: number;
  availableQty: number;
  pricePerUnit: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string; // Frontend-only
  totalBookings: number; // Computed
  collectedCount: number; // Computed
  cancelledCount: number; // Computed
  lastOrderDate: string;
}

export interface Booking {
  id: string;
  batchId: string;
  customerName: string;
  customerPhone: string;
  qty: number;
  pickupDate: string;
  paymentStatus: 'paid' | 'unpaid'; // Note: removed 'partial' as backend doesn't support it
  bookingStatus: 'booked' | 'collected' | 'cancelled';
  discount: number;
  amountPaid: number; // Computed from payment_status
  totalAmount: number; // From backend
  createdAt: string;
}

export interface KPIData {
  openBatches: number;
  totalAvailable: number;
  totalBooked: number;
  totalCollected: number;
  revenueCollected: number;
  revenuePending: number;
}

// Request payload types
export interface CreateBatchPayload {
  product: number; // Product ID
  start_date: string;
  total_quantity: number;
  status: 'open' | 'closed';
}

export interface CreateBookingPayload {
  customer: number; // Customer ID
  batch_stock: number; // BatchStock ID
  pickup_date: string;
  quantity: number;
  payment_method: 'cash' | 'wamd';
  payment_status: 'paid' | 'unpaid';
  discount: string; // As string for Decimal
}

export interface CreateProductPayload {
  name: string;
  type: 'batch' | 'custom';
  base_price: string;
  flavor: string;
  active: boolean;
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
}

// Shop types
export interface CartItem {
  productId: string;
  batchId: string;
  productName: string;
  price: number;
  quantity: number;
  pickupDate: string;
}

export interface Order {
  id: string;
  token: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  items: CartItem[];
  paymentMethod: 'cash' | 'wamd';
  status: 'booked' | 'collected' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid';
  totalAmount: number;
  createdAt: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  availableBatches: Batch[];
}
