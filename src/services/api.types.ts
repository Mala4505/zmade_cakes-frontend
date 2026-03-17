// ============================================
// BACKEND API RESPONSE TYPES (snake_case)
// ============================================

export interface BackendProductVariant {
  id: number;
  pieces: number;
  label: string;
  price: string;        // Decimal as string
  is_active: boolean;
  sort_order: number;
}

export interface BackendProduct {
  id: number;
  name: string;
  type: 'batch' | 'custom';
  base_price: string;   // Decimal as string
  flavor: string;
  active: boolean;
  description: string;
  image: string | null;
  image_url: string;
  variants: BackendProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface BackendBatchVariantConfig {
  id: number;
  variant: BackendProductVariant;
  is_enabled: boolean;
  custom_price: string | null;
  effective_price: string;
}

export interface BackendBatchStock {
  id: number;
  product: BackendProduct;
  start_date: string;
  total_pieces: number;
  booked_pieces: number;
  collected_pieces: number;
  available_pieces: number;
  status: 'open' | 'closed';
  variant_configs: BackendBatchVariantConfig[];
  created_at: string;
}

export interface BackendCustomer {
  id: number;
  name: string;
  phone: string;
  created_at: string;
}

export interface BackendBatchBooking {
  id: number;
  customer: BackendCustomer;
  batch_stock: number;  // FK ID
  variant: BackendProductVariant | null;
  quantity: number;
  pieces_used: number;
  pickup_date: string;
  payment_method: 'cash' | 'wamd';
  payment_status: 'paid' | 'unpaid';
  discount: string;     // Decimal as string
  total_amount: string; // Decimal as string
  status: 'booked' | 'collected' | 'cancelled';
  created_at: string;
}

export interface BackendLoginResponse {
  access: string;
  refresh: string;
  username: string;
}

export interface BackendDashboardStats {
  open_batches: number;
  total_available: number;
  total_booked: number;
  total_collected: number;
  revenue_collected: number;
  revenue_pending: number;
  monthly_bookings: Array<{ month: string; bookings: number; revenue: number }>;
  product_breakdown: Array<{ product: string; count: number }>;
}

// Public shop backend types
export interface BackendPublicVariantOption {
  variant_id: number;
  pieces: number;
  label: string;
  price: string;
  is_available: boolean;
  is_enabled: boolean;
}

export interface BackendPublicBatch {
  id: number;
  product_id: number;
  product_name: string;
  product_flavor: string;
  product_image: string | null;
  product_active: boolean;
  start_date: string;
  available_pieces: number;
  variants: BackendPublicVariantOption[];
}

// ============================================
// FRONTEND TYPES (camelCase) — use these in UI
// ============================================

export interface ProductVariant {
  id: string;
  pieces: number;
  label: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  type: 'batch' | 'custom';
  basePrice: number;
  isActive: boolean;
  flavor: string;
  description: string;
  image: string | null;
  imageUrl: string | null;
  variants: ProductVariant[];
}

export interface BatchVariantConfig {
  id: string;
  variant: ProductVariant;
  isEnabled: boolean;
  customPrice: number | null;
  effectivePrice: number;
}

export interface Batch {
  id: string;
  productId: string;
  productName: string;
  startDate: string;
  endDate: string;        // Always computed: startDate + 3 days. Never sent to backend.
  status: 'active' | 'closed' | 'upcoming';
  totalPieces: number;
  bookedPieces: number;
  collectedPieces: number;
  availablePieces: number;
  pricePerUnit: number;   // product base_price — kept for display
  variantConfigs: BatchVariantConfig[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;         // not in backend
  totalBookings: number;
  collectedCount: number;
  cancelledCount: number;
  lastOrderDate: string;
}

export interface Booking {
  id: string;
  batchId: string;
  variantId: string;
  variantLabel: string;
  customerName: string;
  customerPhone: string;
  qty: number;
  piecesUsed: number;
  pickupDate: string;
  paymentStatus: 'paid' | 'unpaid';
  bookingStatus: 'booked' | 'collected' | 'cancelled';
  discount: number;
  amountPaid: number;
  totalAmount: number;
  createdAt: string;
}

export interface KPIData {
  openBatches: number;
  totalAvailable: number;
  totalBooked: number;
  totalCollected: number;
  revenueCollected: number;
  revenuePending: number;
  monthlyBookings: Array<{ month: string; bookings: number; revenue: number }>;
  productBreakdown: Array<{ product: string; count: number }>;
}

export interface ShopVariantOption {
  variantId: string;
  pieces: number;
  label: string;
  price: number;
  isAvailable: boolean;
  isEnabled: boolean;
}

export interface ShopBatch {
  id: string;
  productId: string;
  productName: string;
  productFlavor: string;
  productImage: string | null;
  productActive: boolean;
  startDate: string;
  availablePieces: number;
  variants: ShopVariantOption[];
}

// ============================================
// REQUEST PAYLOAD TYPES
// ============================================

export interface CreateVariantPayload {
  pieces: number;
  label: string;
  price: string;
  is_active: boolean;
  sort_order: number;
}

export interface CreateBatchPayload {
  product: number;
  start_date: string;
  total_pieces: number;
  status: 'open' | 'closed';
}

export interface CreateBookingPayload {
  customer: number;
  batch_stock: number;
  variant?: number;       // variant_id — optional for legacy bookings
  pickup_date: string;
  quantity: number;
  payment_method: 'cash' | 'wamd';
  payment_status: 'paid' | 'unpaid';
  discount: string;
}

export interface UpdateVariantConfigPayload {
  is_enabled?: boolean;
  custom_price?: string | null;
}

export interface CreateProductPayload {
  name: string;
  type: 'batch' | 'custom';
  base_price: string;
  flavor: string;
  active: boolean;
  description?: string;
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
}

// ============================================
// CART / ORDER TYPES (shop)
// ============================================

export interface CartItem {
  productId: string;
  batchId: string;
  variantId: string;
  variantLabel: string;
  productName: string;
  price: number;
  quantity: number;
  pieces: number;
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