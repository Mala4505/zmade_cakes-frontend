import type * as B from './api.types';

// ============================================
// Backend → Frontend transformers
// ============================================

export const transformVariant = (v: B.BackendProductVariant): B.ProductVariant => ({
  id: v.id.toString(),
  pieces: v.pieces,
  label: v.label,
  price: parseFloat(v.price),
  isActive: v.is_active,
  sortOrder: v.sort_order,
});

export const transformVariantConfig = (
  c: B.BackendBatchVariantConfig
): B.BatchVariantConfig => ({
  id: c.id.toString(),
  variant: transformVariant(c.variant),
  isEnabled: c.is_enabled,
  customPrice: c.custom_price !== null ? parseFloat(c.custom_price) : null,
  effectivePrice: parseFloat(c.effective_price),
});

export const transformProduct = (p: B.BackendProduct): B.Product => ({
  id: p.id.toString(),
  name: p.name,
  type: p.type,
  basePrice: parseFloat(p.base_price),
  isActive: p.active,
  flavor: p.flavor,
  description: p.description || '',
  image: p.image || null,
  imageUrl: p.image_url || null,
  variants: (p.variants || []).map(transformVariant),
});

export const transformBatch = (b: B.BackendBatchStock): B.Batch => {
  const startDate = b.start_date;
  const now = new Date().toISOString().split('T')[0];

  let status: B.Batch['status'];
  if (b.status === 'closed') {
    status = 'closed';
  } else if (startDate > now) {
    status = 'upcoming';
  } else {
    status = 'active';
  }

  // endDate is always computed — never stored in backend
  const startObj = new Date(b.start_date);
  startObj.setDate(startObj.getDate() + 3);
  const endDate = startObj.toISOString().split('T')[0];

  return {
    id: b.id.toString(),
    productId: b.product.id.toString(),
    productName: b.product.name,
    startDate: b.start_date,
    endDate,
    status,
    totalPieces: b.total_pieces,
    bookedPieces: b.booked_pieces,
    collectedPieces: b.collected_pieces,
    availablePieces: b.available_pieces,
    pricePerUnit: parseFloat(b.product.base_price),
    variantConfigs: (b.variant_configs || []).map(transformVariantConfig),
  };
};

export const transformShopVariant = (
  v: B.BackendPublicVariantOption
): B.ShopVariantOption => ({
  variantId: v.variant_id.toString(),
  pieces: v.pieces,
  label: v.label,
  price: parseFloat(v.price),
  isAvailable: v.is_available,
  isEnabled: v.is_enabled,
});

export const transformShopBatch = (b: B.BackendPublicBatch): B.ShopBatch => ({
  id: b.id.toString(),
  productId: b.product_id.toString(),
  productName: b.product_name,
  productFlavor: b.product_flavor,
  productImage: b.product_image,
  productActive: b.product_active ?? true,
  startDate: b.start_date,
  availablePieces: b.available_pieces,
  variants: b.variants.map(transformShopVariant),
});

export const transformCustomer = (
  c: B.BackendCustomer,
  bookings: B.BackendBatchBooking[] = []
): B.Customer => {
  const mine = bookings.filter(b => b.customer.id === c.id);
  return {
    id: c.id.toString(),
    name: c.name,
    phone: c.phone,
    totalBookings: mine.length,
    collectedCount: mine.filter(b => b.status === 'collected').length,
    cancelledCount: mine.filter(b => b.status === 'cancelled').length,
    lastOrderDate: c.created_at,
  };
};

export const transformBooking = (b: B.BackendBatchBooking): B.Booking => {
  const totalAmount = parseFloat(b.total_amount);
  const discount = parseFloat(b.discount);

  return {
    id: b.id.toString(),
    batchId: b.batch_stock.toString(),
    variantId: b.variant?.id.toString() || '',
    variantLabel: b.variant?.label || '',
    customerName: b.customer.name,
    customerPhone: b.customer.phone,
    qty: b.quantity,
    piecesUsed: b.pieces_used,
    pickupDate: b.pickup_date,
    paymentStatus: b.payment_status,
    bookingStatus: b.status,
    discount,
    amountPaid: b.payment_status === 'paid' ? totalAmount - discount : 0,
    totalAmount,
    createdAt: b.created_at,
  };
};

export const transformKPIData = (data: B.BackendDashboardStats): B.KPIData => ({
  openBatches: data.open_batches,
  totalAvailable: data.total_available,
  totalBooked: data.total_booked,
  totalCollected: data.total_collected,
  revenueCollected: data.revenue_collected,
  revenuePending: data.revenue_pending,
  monthlyBookings: data.monthly_bookings || [],
  productBreakdown: data.product_breakdown || [],
});

// ============================================
// Frontend → Backend payload builders
// ============================================

export const toBackendCreateBatch = (
  data: Partial<B.Batch>,
  productId: number
): B.CreateBatchPayload => ({
  product: productId,
  start_date: data.startDate || new Date().toISOString().split('T')[0],
  total_pieces: data.totalPieces || 0,
  status: data.status === 'closed' ? 'closed' : 'open',
});

export const toBackendUpdateBatch = (
  data: Partial<B.Batch>
): Partial<B.CreateBatchPayload> => ({
  ...(data.startDate && { start_date: data.startDate }),
  ...(data.totalPieces !== undefined && { total_pieces: data.totalPieces }),
  ...(data.status && {
    status: data.status === 'closed' ? 'closed' : 'open',
  }),
});

export const toBackendCreateProduct = (
  data: Partial<B.Product>
): B.CreateProductPayload => {
  if (!data.name || !data.type) {
    throw new Error('Product name and type are required');
  }
  return {
    name: data.name,
    type: data.type,
    base_price: (data.basePrice || 0).toFixed(3),
    flavor: data.flavor || '',
    active: data.isActive ?? true,
    description: data.description || '',
  };
};

export const toBackendUpdateProduct = (
  data: Partial<B.Product>
): Partial<B.CreateProductPayload> => {
  const payload: Partial<B.CreateProductPayload> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.type !== undefined) payload.type = data.type;
  if (data.basePrice !== undefined) payload.base_price = data.basePrice.toFixed(3);
  if (data.flavor !== undefined) payload.flavor = data.flavor;
  if (data.isActive !== undefined) payload.active = data.isActive;
  if (data.description !== undefined) payload.description = data.description;
  return payload;
};