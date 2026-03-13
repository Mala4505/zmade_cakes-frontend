import React, { useEffect, createContext, useContext, useReducer } from 'react';
import { CartItem } from '../types';
interface CartState {
  items: CartItem[];
}
type CartAction =
{
  type: 'ADD_ITEM';
  payload: CartItem;
} |
{
  type: 'REMOVE_ITEM';
  payload: {
    productId: string;
    batchStockId: string;
  };
} |
{
  type: 'UPDATE_QUANTITY';
  payload: {
    productId: string;
    batchStockId: string;
    quantity: number;
  };
} |
{
  type: 'CLEAR_CART';
} |
{
  type: 'LOAD_CART';
  payload: CartItem[];
};
const initialState: CartState = {
  items: []
};
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':{
        const existingItemIndex = state.items.findIndex(
          (item) =>
          item.productId === action.payload.productId &&
          item.batchStockId === action.payload.batchStockId
        );
        if (existingItemIndex >= 0) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += action.payload.quantity;
          return {
            ...state,
            items: newItems
          };
        }
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) =>
          !(
          item.productId === action.payload.productId &&
          item.batchStockId === action.payload.batchStockId)

        )
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
        item.productId === action.payload.productId &&
        item.batchStockId === action.payload.batchStockId ?
        {
          ...item,
          quantity: action.payload.quantity
        } :
        item
        )
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };
    default:
      return state;
  }
}
interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, batchStockId: string) => void;
  updateQuantity: (
  productId: string,
  batchStockId: string,
  quantity: number)
  => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export function CartProvider({ children }: {children: React.ReactNode;}) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  useEffect(() => {
    const savedCart = localStorage.getItem('zmade_cart');
    if (savedCart) {
      try {
        dispatch({
          type: 'LOAD_CART',
          payload: JSON.parse(savedCart)
        });
      } catch (e) {
        console.error('Failed to parse cart from local storage', e);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('zmade_cart', JSON.stringify(state.items));
  }, [state.items]);
  const addItem = (item: CartItem) =>
  dispatch({
    type: 'ADD_ITEM',
    payload: item
  });
  const removeItem = (productId: string, batchStockId: string) =>
  dispatch({
    type: 'REMOVE_ITEM',
    payload: {
      productId,
      batchStockId
    }
  });
  const updateQuantity = (
  productId: string,
  batchStockId: string,
  quantity: number) =>

  dispatch({
    type: 'UPDATE_QUANTITY',
    payload: {
      productId,
      batchStockId,
      quantity
    }
  });
  const clearCart = () =>
  dispatch({
    type: 'CLEAR_CART'
  });
  const getTotal = () =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const getItemCount = () =>
  state.items.reduce((count, item) => count + item.quantity, 0);
  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount
      }}>

      {children}
    </CartContext.Provider>);

}
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}