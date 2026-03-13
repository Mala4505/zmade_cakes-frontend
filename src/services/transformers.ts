import type * as B from './api.types';

// Backend → Frontend transformers

export const transformProduct = (p: B.BackendProduct): B.Product => ({
  id: p.id.toString(),
  name: p.name,
  type: p.type,
  basePrice: parseFloat(p.base_price),
  isActive: p.active,
  flavor: p.flavor,
  // Frontend-only fields - use defaults
  description: '',
  image: undefined,
});

export const transformBatch = (b: B.BackendBatchStock): B.Batch => {
  const startDate = b.start_date;
  const now = new Date().toISOString().split('T')[0];

  // Infer status from dates and backend status
  let status: B.Batch['status'];
  if (b.status === 'closed') {
    status = 'closed';
  } else if (startDate > now) {
    status = 'upcoming';
  } else {
    status = 'active';
  }

  // Calculate end date as 3 days after start date (frontend convention)
  const startDateObj = new Date(b.start_date);
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(endDateObj.getDate() + 3);
  const endDate = endDateObj.toISOString().split('T')[0];

  return {
    id: b.id.toString(),
    productName: b.product.name,
    startDate: b.start_date,
    endDate,
    status,
    totalQty: b.total_quantity,
    bookedQty: b.booked_quantity,
    collectedQty: b.collected_quantity,
    availableQty: b.available_quantity,
    pricePerUnit: parseFloat(b.product.base_price),
  };
};

export const transformCustomer = (
  c: B.BackendCustomer,
  bookings: B.BackendBatchBooking[] = []
): B.Customer => {
  const customerBookings = bookings.filter(b => b.customer.id === c.id);
  const collectedCount = customerBookings.filter(b => b.status === 'collected').length;
  const cancelledCount = customerBookings.filter(b => b.status === 'cancelled').length;

  return {
    id: c.id.toString(),
    name: c.name,
    phone: c.phone,
    email: '', // Not in backend
    totalBookings: customerBookings.length,
    collectedCount,
    cancelledCount,
    lastOrderDate: c.created_at,
  };
};

export const transformBooking = (b: B.BackendBatchBooking): B.Booking => {
  const totalAmount = parseFloat(b.total_amount);
  const discount = parseFloat(b.discount);

  return {
    id: b.id.toString(),
    batchId: b.batch_stock.toString(),
    customerName: b.customer.name,
    customerPhone: b.customer.phone,
    qty: b.quantity,
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
});

// Frontend → Backend transformers (for POST/PUT)

export const toBackendCreateBatch = (
  data: Partial<B.Batch>,
  productId: number
): B.CreateBatchPayload => ({
  product: productId,
  start_date: data.startDate || new Date().toISOString().split('T')[0],
  total_quantity: data.totalQty || 0,
  status: data.status === 'active' || data.status === 'upcoming' ? 'open' : 'closed',
});

export const toBackendUpdateBatch = (
  data: Partial<B.Batch>
): Partial<B.CreateBatchPayload> => ({
  ...(data.startDate && { start_date: data.startDate }),
  ...(data.totalQty !== undefined && { total_quantity: data.totalQty }),
  ...(data.status && {
    status: data.status === 'active' || data.status === 'upcoming' ? 'open' : 'closed'
  }),
});

export const toBackendCreateBooking = (
  data: Partial<B.Booking>,
  customerId: number,
  batchStockId: number
): B.CreateBookingPayload => ({
  customer: customerId,
  batch_stock: batchStockId,
  pickup_date: data.pickupDate || '',
  quantity: data.qty || 1,
  payment_method: 'cash', // Default, can be extended
  payment_status: data.paymentStatus === 'paid' ? 'paid' : 'unpaid',
  discount: (data.discount || 0).toFixed(3),
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
  };
};

export const toBackendUpdateProduct = (
  data: Partial<B.Product>
): Partial<B.CreateProductPayload> => {
  const payload: Partial<B.CreateProductPayload> = {};
  if (data.name) payload.name = data.name;
  if (data.type) payload.type = data.type;
  if (data.basePrice !== undefined) payload.base_price = data.basePrice.toFixed(3);
  if (data.flavor !== undefined) payload.flavor = data.flavor;
  if (data.isActive !== undefined) payload.active = data.isActive;
  return payload;
};
