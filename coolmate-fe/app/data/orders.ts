import { Order } from "../types/order";
import { mockProducts } from "./products";

export const mockOrders: Order[] = [
  {
    id: "ord-8291",
    customerName: "Nguyễn Văn A",
    customerEmail: "anguyen@gmail.com",
    customerPhone: "0901234567",
    shippingAddress: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    notes: "Giao giờ hành chính giúp em",
    items: [
      {
        id: "prod-1-M-Trắng",
        product: mockProducts[0],
        selectedSize: "M",
        selectedColor: "Trắng",
        quantity: 2,
      },
      {
        id: "prod-3-L-Đen",
        product: mockProducts[2],
        selectedSize: "L",
        selectedColor: "Đen",
        quantity: 1,
      },
    ],
    totalAmount: 637000,
    paymentMethod: "vnpay",
    paymentStatus: "paid",
    orderStatus: "processing",
    createdAt: "2026-05-22T10:14:00Z",
  },
  {
    id: "ord-4921",
    customerName: "Trần Thị B",
    customerEmail: "btran@yahoo.com",
    customerPhone: "0987654321",
    shippingAddress: "456 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
    notes: "",
    items: [
      {
        id: "prod-2-L-Xanh Navy",
        product: mockProducts[1],
        selectedSize: "L",
        selectedColor: "Xanh Navy",
        quantity: 1,
      },
    ],
    totalAmount: 329000,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "pending",
    createdAt: "2026-05-23T08:30:00Z",
  },
];
