import { apiClient } from "@/services/api-client.service";
import { Cart, CartItem } from "@/types/cart";

type BackendCartItem = {
  id: string;
  productId: string;
  productOptionId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number | null;
  size: string;
  color: { name: string; value: string };
  quantity: number;
  stock: number;
};

type BackendCart = {
  items: BackendCartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
};

export type AddToCartPayload = {
  productId: string;
  productOptionId: string;
  quantity: number;
};

const mapCartItem = (item: BackendCartItem): CartItem => ({
  id: item.id,
  productId: item.productId,
  productOptionId: item.productOptionId,
  product: {
    id: item.productId,
    name: item.name,
    slug: item.slug,
    price: item.price,
    originalPrice: item.originalPrice ?? item.price,
    imageUrl: item.imageUrl,
    images: [item.imageUrl],
    category: "",
    sizes: [item.size],
    colors: [item.color.name],
    options: [],
    description: "",
    rating: 5,
    reviewCount: 0,
    stock: item.stock,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  selectedSize: item.size,
  selectedColor: item.color.name,
  quantity: item.quantity,
});

const mapCart = (cart: BackendCart): Cart => ({
  items: cart.items.map(mapCartItem),
  subtotal: cart.subtotal,
  shippingFee: cart.shippingFee,
  discount: cart.discount,
  total: cart.total,
});

export const cartApi = {
  async getCart() {
    return mapCart(await apiClient<BackendCart>("/cart"));
  },

  async addToCart(payload: AddToCartPayload) {
    return mapCart(
      await apiClient<BackendCart>("/cart/items", {
        method: "POST",
        body: payload,
      }),
    );
  },

  async updateCartItem(itemId: string, payload: { quantity: number }) {
    return mapCart(
      await apiClient<BackendCart>(`/cart/items/${encodeURIComponent(itemId)}`, {
        method: "PATCH",
        body: payload,
      }),
    );
  },

  async removeCartItem(itemId: string) {
    return mapCart(
      await apiClient<BackendCart>(`/cart/items/${encodeURIComponent(itemId)}`, {
        method: "DELETE",
      }),
    );
  },

  async clearCart() {
    return mapCart(await apiClient<BackendCart>("/cart", { method: "DELETE" }));
  },
};
