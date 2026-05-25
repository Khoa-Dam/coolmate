import { Product, Category } from "../types/product";
import { Order } from "../types/order";
import { mockProducts } from "../data/products";
import { mockCategories } from "../data/categories";
import { mockOrders } from "../data/orders";

const PRODUCTS_KEY = "novawear_products";
const ORDERS_KEY = "novawear_orders";

// Helper to check if window/localStorage is available (client-side)
const isClient = typeof window !== "undefined";

export const mockApi = {
  // --- PRODUCTS ---
  getProducts: (): Product[] => {
    if (!isClient) return mockProducts;
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mockProducts));
      return mockProducts;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return mockProducts;
    }
  },

  getProductBySlug: (slug: string): Product | undefined => {
    const products = mockApi.getProducts();
    return products.find((p) => p.slug === slug);
  },

  saveProduct: (productData: Omit<Product, "id"> & { id?: string }): Product => {
    const products = mockApi.getProducts();
    let savedProduct: Product;

    if (productData.id) {
      // Edit
      const index = products.findIndex((p) => p.id === productData.id);
      if (index !== -1) {
        savedProduct = { ...products[index], ...productData } as Product;
        products[index] = savedProduct;
      } else {
        throw new Error("Không tìm thấy sản phẩm");
      }
    } else {
      // Create
      const newId = `prod-${Date.now()}`;
      savedProduct = {
        ...productData,
        id: newId,
        rating: 5.0,
        reviewCount: 0,
      } as Product;
      products.push(savedProduct);
    }

    if (isClient) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
    return savedProduct;
  },

  deleteProduct: (id: string): void => {
    const products = mockApi.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (isClient) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
    }
  },

  // --- CATEGORIES ---
  getCategories: (): Category[] => {
    return mockCategories;
  },

  // --- ORDERS ---
  getOrders: (): Order[] => {
    if (!isClient) return mockOrders;
    const stored = localStorage.getItem(ORDERS_KEY);
    if (!stored) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(mockOrders));
      return mockOrders;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return mockOrders;
    }
  },

  createOrder: (orderInput: Omit<Order, "id" | "createdAt" | "orderStatus" | "paymentStatus"> & { paymentMethod: string }): Order => {
    const orders = mockApi.getOrders();
    const newId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderInput,
      id: newId,
      orderStatus: "pending",
      paymentStatus: orderInput.paymentMethod === "vnpay" ? "paid" : "pending",
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    if (isClient) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
    return newOrder;
  },

  updateOrderStatus: (orderId: string, status: Order["orderStatus"]): Order => {
    const orders = mockApi.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      orders[index].orderStatus = status;
      if (isClient) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      }
      return orders[index];
    }
    throw new Error("Không tìm thấy đơn hàng");
  },

  updateOrderPaymentStatus: (orderId: string, status: Order["paymentStatus"]): Order => {
    const orders = mockApi.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      orders[index].paymentStatus = status;
      if (isClient) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      }
      return orders[index];
    }
    throw new Error("Không tìm thấy đơn hàng");
  },
};
