// import { Batch, Booking, Customer, Product, KPIData, Order } from '../types';

// export const mockKPIs: KPIData = {
//   openBatches: 4,
//   totalAvailable: 145,
//   totalBooked: 320,
//   totalCollected: 210,
//   revenueCollected: 45200,
//   revenuePending: 12400
// };

// export const mockBatches: Batch[] = [
// {
//   id: 'b1',
//   productName: 'Sourdough Boule',
//   startDate: '2023-11-01',
//   endDate: '2023-11-05',
//   status: 'active',
//   totalQty: 100,
//   bookedQty: 85,
//   collectedQty: 40,
//   pricePerUnit: 150
// },
// {
//   id: 'b2',
//   productName: 'Cinnamon Babka',
//   startDate: '2023-11-02',
//   endDate: '2023-11-06',
//   status: 'active',
//   totalQty: 50,
//   bookedQty: 50,
//   collectedQty: 10,
//   pricePerUnit: 250
// },
// {
//   id: 'b3',
//   productName: 'Olive Focaccia',
//   startDate: '2023-11-05',
//   endDate: '2023-11-10',
//   status: 'upcoming',
//   totalQty: 80,
//   bookedQty: 20,
//   collectedQty: 0,
//   pricePerUnit: 180
// },
// {
//   id: 'b4',
//   productName: 'Chocolate Croissant',
//   startDate: '2023-10-25',
//   endDate: '2023-10-28',
//   status: 'closed',
//   totalQty: 120,
//   bookedQty: 120,
//   collectedQty: 115,
//   pricePerUnit: 120
// },
// {
//   id: 'b5',
//   productName: 'Rye Loaf',
//   startDate: '2023-11-03',
//   endDate: '2023-11-08',
//   status: 'active',
//   totalQty: 60,
//   bookedQty: 45,
//   collectedQty: 20,
//   pricePerUnit: 160
// },
// {
//   id: 'b6',
//   productName: 'Brioche Buns (6pk)',
//   startDate: '2023-11-06',
//   endDate: '2023-11-12',
//   status: 'upcoming',
//   totalQty: 40,
//   bookedQty: 5,
//   collectedQty: 0,
//   pricePerUnit: 200
// }];


// export const mockBookings: Booking[] = [
// {
//   id: 'bk1',
//   batchId: 'b1',
//   customerName: 'Alice Johnson',
//   customerPhone: '555-0101',
//   qty: 2,
//   pickupDate: '2023-11-04',
//   paymentStatus: 'paid',
//   bookingStatus: 'collected',
//   discount: 0,
//   amountPaid: 300,
//   createdAt: '2023-10-28'
// },
// {
//   id: 'bk2',
//   batchId: 'b1',
//   customerName: 'Bob Smith',
//   customerPhone: '555-0102',
//   qty: 1,
//   pickupDate: '2023-11-05',
//   paymentStatus: 'unpaid',
//   bookingStatus: 'booked',
//   discount: 0,
//   amountPaid: 0,
//   createdAt: '2023-10-29'
// },
// {
//   id: 'bk3',
//   batchId: 'b2',
//   customerName: 'Charlie Davis',
//   customerPhone: '555-0103',
//   qty: 3,
//   pickupDate: '2023-11-06',
//   paymentStatus: 'partial',
//   bookingStatus: 'booked',
//   discount: 50,
//   amountPaid: 350,
//   createdAt: '2023-10-30'
// },
// {
//   id: 'bk4',
//   batchId: 'b2',
//   customerName: 'Diana Prince',
//   customerPhone: '555-0104',
//   qty: 1,
//   pickupDate: '2023-11-05',
//   paymentStatus: 'paid',
//   bookingStatus: 'cancelled',
//   discount: 0,
//   amountPaid: 250,
//   createdAt: '2023-10-31'
// },
// {
//   id: 'bk5',
//   batchId: 'b1',
//   customerName: 'Evan Wright',
//   customerPhone: '555-0105',
//   qty: 4,
//   pickupDate: '2023-11-05',
//   paymentStatus: 'paid',
//   bookingStatus: 'booked',
//   discount: 100,
//   amountPaid: 500,
//   createdAt: '2023-11-01'
// },
// {
//   id: 'bk6',
//   batchId: 'b3',
//   customerName: 'Fiona Gallagher',
//   customerPhone: '555-0106',
//   qty: 2,
//   pickupDate: '2023-11-08',
//   paymentStatus: 'unpaid',
//   bookingStatus: 'booked',
//   discount: 0,
//   amountPaid: 0,
//   createdAt: '2023-11-02'
// },
// {
//   id: 'bk7',
//   batchId: 'b3',
//   customerName: 'George Miller',
//   customerPhone: '555-0107',
//   qty: 1,
//   pickupDate: '2023-11-09',
//   paymentStatus: 'paid',
//   bookingStatus: 'booked',
//   discount: 0,
//   amountPaid: 180,
//   createdAt: '2023-11-03'
// },
// {
//   id: 'bk8',
//   batchId: 'b5',
//   customerName: 'Hannah Abbott',
//   customerPhone: '555-0108',
//   qty: 3,
//   pickupDate: '2023-11-06',
//   paymentStatus: 'partial',
//   bookingStatus: 'booked',
//   discount: 0,
//   amountPaid: 200,
//   createdAt: '2023-11-04'
// }];


// export const mockCustomers: Customer[] = [
// {
//   id: 'c1',
//   name: 'Alice Johnson',
//   phone: '555-0101',
//   email: 'alice@example.com',
//   totalBookings: 12,
//   collectedCount: 11,
//   cancelledCount: 0,
//   lastOrderDate: '2023-10-28'
// },
// {
//   id: 'c2',
//   name: 'Bob Smith',
//   phone: '555-0102',
//   email: 'bob@example.com',
//   totalBookings: 5,
//   collectedCount: 4,
//   cancelledCount: 1,
//   lastOrderDate: '2023-10-29'
// },
// {
//   id: 'c3',
//   name: 'Charlie Davis',
//   phone: '555-0103',
//   email: 'charlie@example.com',
//   totalBookings: 8,
//   collectedCount: 8,
//   cancelledCount: 0,
//   lastOrderDate: '2023-10-30'
// },
// {
//   id: 'c4',
//   name: 'Diana Prince',
//   phone: '555-0104',
//   email: 'diana@example.com',
//   totalBookings: 2,
//   collectedCount: 1,
//   cancelledCount: 1,
//   lastOrderDate: '2023-10-31'
// },
// {
//   id: 'c5',
//   name: 'Evan Wright',
//   phone: '555-0105',
//   email: 'evan@example.com',
//   totalBookings: 15,
//   collectedCount: 15,
//   cancelledCount: 0,
//   lastOrderDate: '2023-11-01'
// },
// {
//   id: 'c6',
//   name: 'Fiona Gallagher',
//   phone: '555-0106',
//   email: 'fiona@example.com',
//   totalBookings: 3,
//   collectedCount: 2,
//   cancelledCount: 0,
//   lastOrderDate: '2023-11-02'
// },
// {
//   id: 'c7',
//   name: 'George Miller',
//   phone: '555-0107',
//   email: 'george@example.com',
//   totalBookings: 1,
//   collectedCount: 0,
//   cancelledCount: 0,
//   lastOrderDate: '2023-11-03'
// },
// {
//   id: 'c8',
//   name: 'Hannah Abbott',
//   phone: '555-0108',
//   email: 'hannah@example.com',
//   totalBookings: 6,
//   collectedCount: 5,
//   cancelledCount: 0,
//   lastOrderDate: '2023-11-04'
// }];


// export const mockProducts: Product[] = [
// {
//   id: 'p1',
//   name: 'Sourdough Boule',
//   type: 'batch',
//   basePrice: 150,
//   isActive: true,
//   description: 'Classic artisan sourdough',
//   flavor: 'Classic',
//   image:
//   'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=800'
// },
// {
//   id: 'p2',
//   name: 'Cinnamon Babka',
//   type: 'batch',
//   basePrice: 250,
//   isActive: true,
//   description: 'Rich, buttery dough twisted with cinnamon',
//   flavor: 'Cinnamon',
//   image:
//   'https://images.unsplash.com/photo-1601314002592-b8734bca6604?auto=format&fit=crop&q=80&w=800'
// },
// {
//   id: 'p3',
//   name: 'Olive Focaccia',
//   type: 'batch',
//   basePrice: 180,
//   isActive: true,
//   description: 'Fluffy Italian bread with kalamata olives',
//   flavor: 'Olive & Rosemary',
//   image:
//   'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&q=80&w=800'
// },
// {
//   id: 'p4',
//   name: 'Custom Wedding Cake',
//   type: 'custom',
//   basePrice: 5000,
//   isActive: true,
//   description: 'Tiered custom cake',
//   flavor: 'Vanilla Bean',
//   image:
//   'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800'
// },
// {
//   id: 'p5',
//   name: 'Chocolate Croissant',
//   type: 'batch',
//   basePrice: 120,
//   isActive: false,
//   description: 'Flaky pastry with dark chocolate',
//   flavor: 'Dark Chocolate',
//   image:
//   'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&q=80&w=800'
// },
// {
//   id: 'p6',
//   name: 'Walnut Raisin Bread',
//   type: 'batch',
//   basePrice: 170,
//   isActive: true,
//   description: 'Hearty loaf packed with walnuts and raisins',
//   flavor: 'Walnut Raisin',
//   image:
//   'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
// },
// {
//   id: 'p7',
//   name: 'Almond Danish',
//   type: 'batch',
//   basePrice: 140,
//   isActive: true,
//   description: 'Flaky pastry filled with almond paste',
//   flavor: 'Almond',
//   image:
//   'https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&q=80&w=800'
// }];


// export const mockOrders: Order[] = [
// {
//   id: 'o1',
//   token: 'trk_abc123',
//   customer: { name: 'Alice Johnson', phone: '555-0101' },
//   items: [
//   {
//     productName: 'Sourdough Boule',
//     quantity: 2,
//     price: 150,
//     pickupDate: '2023-11-04'
//   }],

//   paymentMethod: 'knet',
//   status: 'collected',
//   paymentStatus: 'paid',
//   totalAmount: 300,
//   createdAt: '2023-10-28'
// },
// {
//   id: 'o2',
//   token: 'trk_def456',
//   customer: { name: 'Bob Smith', phone: '555-0102' },
//   items: [
//   {
//     productName: 'Sourdough Boule',
//     quantity: 1,
//     price: 150,
//     pickupDate: '2023-11-05'
//   }],

//   paymentMethod: 'cash',
//   status: 'booked',
//   paymentStatus: 'unpaid',
//   totalAmount: 150,
//   createdAt: '2023-10-29'
// }];