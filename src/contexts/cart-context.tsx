'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { Product, RENTAL_CONFIG } from '@/types';
import { formatRentalTimeline } from '@/lib/mock-data/availability';

// Cart Item interface
export interface CartItem {
  id: string; // Unique cart item ID
  product: Product;
  size: string;
  eventDate: string; // ISO string for serialization
  rentalTimeline: {
    shipBy: string;
    eventDate: string;
    returnBy: string;
  };
  addedAt: string;
}

// Cart State
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string; eventDate: Date } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] };

// Cart Context Type
interface CartContextType {
  state: CartState;
  addItem: (product: Product, size: string, eventDate: Date) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: number;
  subtotal: number;
  bondTotal: number;
}

// Initial state
const initialState: CartState = {
  items: [],
  isOpen: false,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, eventDate } = action.payload;
      const timeline = formatRentalTimeline(eventDate);

      const newItem: CartItem = {
        id: `${product.id}-${size}-${eventDate.toISOString()}`,
        product,
        size,
        eventDate: eventDate.toISOString(),
        rentalTimeline: {
          shipBy: timeline.shipBy.toISOString(),
          eventDate: timeline.eventDate.toISOString(),
          returnBy: timeline.returnBy.toISOString(),
        },
        addedAt: new Date().toISOString(),
      };

      // Check if item already exists (same product, size, and date)
      const existingIndex = state.items.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingIndex > -1) {
        // Item already in cart
        return { ...state, isOpen: true };
      }

      return {
        ...state,
        items: [...state.items, newItem],
        isOpen: true,
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      };
    }

    case 'OPEN_CART': {
      return { ...state, isOpen: true };
    }

    case 'CLOSE_CART': {
      return { ...state, isOpen: false };
    }

    case 'TOGGLE_CART': {
      return { ...state, isOpen: !state.isOpen };
    }

    case 'HYDRATE': {
      return { ...state, items: action.payload };
    }

    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Storage key
const CART_STORAGE_KEY = 'ashika_cart';

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        // Filter out expired items (event date passed)
        const validItems = items.filter(
          (item) => new Date(item.eventDate) > new Date()
        );
        dispatch({ type: 'HYDRATE', payload: validItems });
      }
    } catch (error) {
      console.error('Failed to hydrate cart:', error);
    }
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to persist cart:', error);
    }
  }, [state.items]);

  // Actions
  const addItem = (product: Product, size: string, eventDate: Date) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, size, eventDate } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  // Computed values
  const itemCount = state.items.length;
  const subtotal = state.items.reduce(
    (total, item) => total + item.product.rental_price,
    0
  );
  const bondTotal = state.items.length * RENTAL_CONFIG.BOND_AMOUNT_AUD;

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    itemCount,
    subtotal,
    bondTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
