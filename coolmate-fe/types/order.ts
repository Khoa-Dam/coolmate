import { CartItem } from "./cart";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  code?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: OrderStatus;
  createdAt: string;
}
