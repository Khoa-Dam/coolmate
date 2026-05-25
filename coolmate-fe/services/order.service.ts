import { apiClient } from "@/services/api-client.service";
import { Order, OrderStatus } from "@/types/order";

export type CheckoutPayload = {
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    note?: string;
  };
  paymentMethod: "COD" | "VNPAY_MOCK";
};

type BackendOrderItem = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  size: string;
  color: { name: string; value: string };
  quantity: number;
};

type BackendOrder = {
  id: string;
  code: string;
  userId: string;
  items: BackendOrderItem[];
  shippingInfo: CheckoutPayload["shippingInfo"];
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

const normalizeStatus = (status: string) => status.toLowerCase();

const mapOrder = (order: BackendOrder): Order => ({
  id: order.id,
  code: order.code,
  customerName: order.shippingInfo.fullName,
  customerEmail: "",
  customerPhone: order.shippingInfo.phone,
  shippingAddress: `${order.shippingInfo.address}, ${order.shippingInfo.ward}, ${order.shippingInfo.district}, ${order.shippingInfo.city}`,
  notes: order.shippingInfo.note,
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    product: {
      id: item.productId,
      name: item.productName,
      slug: "",
      price: item.price,
      originalPrice: item.price,
      imageUrl: item.productImage,
      images: [item.productImage],
      category: "",
      sizes: [item.size],
      colors: [item.color.name],
      options: [],
      description: "",
      rating: 5,
      reviewCount: 0,
      stock: item.quantity,
      isActive: true,
      createdAt: "",
      updatedAt: "",
    },
    selectedSize: item.size,
    selectedColor: item.color.name,
    quantity: item.quantity,
  })),
  totalAmount: order.totalAmount,
  paymentMethod: order.paymentMethod,
  paymentStatus: normalizeStatus(order.paymentStatus) as Order["paymentStatus"],
  orderStatus: normalizeStatus(order.orderStatus) as OrderStatus,
  createdAt: order.createdAt,
});

export const orderApi = {
  async checkout(payload: CheckoutPayload) {
    return mapOrder(await apiClient<BackendOrder>("/orders/checkout", { method: "POST", body: payload }));
  },

  async getOrders() {
    return (await apiClient<BackendOrder[]>("/orders")).map(mapOrder);
  },

  async getOrderById(id: string) {
    return mapOrder(await apiClient<BackendOrder>(`/orders/${encodeURIComponent(id)}`));
  },

  async getAdminOrders() {
    return (await apiClient<BackendOrder[]>("/admin/orders")).map(mapOrder);
  },

  async getAdminOrderById(id: string) {
    return mapOrder(await apiClient<BackendOrder>(`/admin/orders/${encodeURIComponent(id)}`));
  },

  async updateOrderStatus(id: string, payload: { orderStatus: OrderStatus }) {
    return mapOrder(
      await apiClient<BackendOrder>(`/admin/orders/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        body: { orderStatus: payload.orderStatus.toUpperCase() },
      }),
    );
  },
};
