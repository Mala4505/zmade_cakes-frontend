// Re-export all types from api.types.ts for convenience
export * from '../services/api.types';

// Legacy type exports for backward compatibility
export interface CartItem {
  productId: string;
  productName: string;
  batchStockId: string;
  pickupDate: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  pickupDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { username: string } | null;
}
