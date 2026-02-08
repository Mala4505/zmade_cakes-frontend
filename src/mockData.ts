import { OrderStatus } from './components/ui/StatusBadge';

export interface OrderItem {
  id: string;
  type: string;
  size: string;
  flavor: string;
  quantity: number;
  notes: string;
  price: number;
}

export interface Order {
  id: string;
  number: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerArea: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryType: 'pickup' | 'delivery';
  status: OrderStatus;
  items: OrderItem[];
  notes: string;
  collateral: number;
  collateralNotes: string;
  total: number;
  isPaid: boolean;
  createdAt: string;
  token: string; // For public access
}

export const mockOrders: Order[] = [
{
  id: '1',
  number: 'ORD-2023-001',
  customerName: 'Fatima Al-Sabah',
  customerPhone: '99991234',
  customerAddress: 'Block 3, Street 15, House 22',
  customerArea: 'Jabriya',
  deliveryDate: '2023-11-15',
  deliveryTime: '14:00',
  deliveryType: 'delivery',
  status: 'pending',
  items: [
  {
    id: 'i1',
    type: 'Birthday Cake',
    size: '8 inch',
    flavor: 'Vanilla Berry',
    quantity: 1,
    notes: "Write 'Happy Birthday Mama' in gold",
    price: 25.0
  }],

  notes: 'Please deliver to back door',
  collateral: 0,
  collateralNotes: '',
  total: 25.0,
  isPaid: false,
  createdAt: '2023-11-10T10:00:00Z',
  token: 'abc-123'
},
{
  id: '2',
  number: 'ORD-2023-002',
  customerName: 'Mohammed Ali',
  customerPhone: '66667777',
  customerAddress: 'Block 1, Street 4, House 10',
  customerArea: 'Salwa',
  deliveryDate: '2023-11-16',
  deliveryTime: '10:00',
  deliveryType: 'pickup',
  status: 'preparing',
  items: [
  {
    id: 'i2',
    type: 'Cupcakes',
    size: 'Dozen',
    flavor: 'Red Velvet',
    quantity: 2,
    notes: '',
    price: 18.0
  },
  {
    id: 'i3',
    type: 'Custom Cake',
    size: '10 inch',
    flavor: 'Chocolate Fudge',
    quantity: 1,
    notes: 'Blue theme',
    price: 35.0
  }],

  notes: '',
  collateral: 10,
  collateralNotes: 'Glass stand deposit',
  total: 53.0,
  isPaid: true,
  createdAt: '2023-11-11T14:30:00Z',
  token: 'def-456'
},
{
  id: '3',
  number: 'ORD-2023-003',
  customerName: 'Sara Ahmed',
  customerPhone: '55558888',
  customerAddress: 'Avenues Mall, Phase 4',
  customerArea: 'Rai',
  deliveryDate: '2023-11-14',
  deliveryTime: '18:00',
  deliveryType: 'delivery',
  status: 'delivered',
  items: [
  {
    id: 'i4',
    type: 'Wedding Cake',
    size: '3 Tier',
    flavor: 'Vanilla & Lemon',
    quantity: 1,
    notes: 'White roses decoration',
    price: 150.0
  }],

  notes: 'Call upon arrival',
  collateral: 50,
  collateralNotes: 'Tier stand deposit',
  total: 150.0,
  isPaid: true,
  createdAt: '2023-11-05T09:15:00Z',
  token: 'ghi-789'
},
{
  id: '4',
  number: 'ORD-2023-004',
  customerName: 'Noura Al-Khalid',
  customerPhone: '90001111',
  customerAddress: 'Block 5, Street 20',
  customerArea: 'Mishref',
  deliveryDate: '2023-11-20',
  deliveryTime: '16:00',
  deliveryType: 'pickup',
  status: 'draft',
  items: [
  {
    id: 'i5',
    type: 'Bento Cake',
    size: '4 inch',
    flavor: 'Chocolate',
    quantity: 1,
    notes: 'Simple heart design',
    price: 8.0
  }],

  notes: 'Customer checking design options',
  collateral: 0,
  collateralNotes: '',
  total: 8.0,
  isPaid: false,
  createdAt: '2023-11-12T11:20:00Z',
  token: 'jkl-012'
},
{
  id: '5',
  number: 'ORD-2023-005',
  customerName: 'Abdullah Hassan',
  customerPhone: '60002222',
  customerAddress: 'Block 2, Street 1',
  customerArea: 'Kaifan',
  deliveryDate: '2023-11-18',
  deliveryTime: '13:00',
  deliveryType: 'delivery',
  status: 'customer_confirmed',
  items: [
  {
    id: 'i6',
    type: 'Cheesecake',
    size: '9 inch',
    flavor: 'Strawberry',
    quantity: 1,
    notes: '',
    price: 15.0
  }],

  notes: '',
  collateral: 0,
  collateralNotes: '',
  total: 15.0,
  isPaid: false,
  createdAt: '2023-11-12T16:45:00Z',
  token: 'mno-345'
}];