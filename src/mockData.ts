// import { OrderStatus } from './components/ui/StatusBadge';

// export interface OrderItem {
//   id: string;
//   type: string;
//   size: string;
//   flavor: string;
//   quantity: number;
//   notes: string;
//   price: number;
// }

// export interface Order {
//   id: string;
//   order_number: string;
//   customer_name: string;
//   phone: string;
//   customerAddress: string;
//   customerArea: string;
//   delivery_date: string;
//   delivery_time: string;
//   delivery_date: 'pickup' | 'delivery';
//   status: OrderStatus;
//   items: OrderItem[];
//   notes: string;
//   collateral: number;
//   collateralNotes: string;
//   total: number;
//   isPaid: boolean;
//   createdAt: string;
//   token: string; // For public access
// }

import { OrderStatus } from './components/ui/StatusBadge';

export interface OrderItem {
  id: number;              // backend sends numeric IDs for items
  type: string;
  size: string;
  flavor: string;
  quantity: number;
  notes: string;
  price: number;
}

export interface Order {
  id: string;              // backend sends numeric ID
  order_number: string;    // backend field
  customer_name: string;   // backend field
  phone: string;           // backend field "phone"
  address: string;         // backend field "address"
  area: string;            // backend field "area"
  delivery_date: string;   // backend field
  delivery_time: string;   // backend field
  pickup_or_delivery: 'pickup' | 'delivery'; // backend field
  status: OrderStatus;     // backend field
  items: OrderItem[];      // backend field
  customer_notes: string;  // backend field
  admin_notes: string;     // backend field
  collateral_items: any[]; // backend field (array of collateral items)
  total: number | string;  // backend sends string like "71.0"
  payment_status: string;  // backend field ("paid", etc.)
  is_locked: boolean;      // backend field
  created_at: string;      // backend field
  updated_at: string;      // backend field
  invoice_token: string;   // backend field
  edit_token: string;      // backend field
}
