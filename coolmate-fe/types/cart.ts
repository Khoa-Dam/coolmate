import { Product } from "./product";

export interface CartItem {
  id: string;
  productId?: string;
  productOptionId?: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

export interface CartState {
  items: CartItem[];
  cart: Cart;
  isLoading: boolean;
  error: string;
  refreshCart: () => Promise<void>;
  addItem: (payload: { productId: string; productOptionId: string; quantity: number }) => Promise<void>;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
}
