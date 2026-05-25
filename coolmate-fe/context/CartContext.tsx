"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { cartApi } from "@/services/cart.service";
import { Cart, CartState } from "@/types/cart";
import { Product } from "@/types/product";

const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  shippingFee: 0,
  discount: 0,
  total: 0,
};

const CartContext = createContext<CartState | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(emptyCart);
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      setCart(await cartApi.getCart());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Không thể tải giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshCart();
  }, [authLoading, refreshCart]);

  const requireAuth = useCallback(() => {
    if (isAuthenticated) return true;
    const message = "Vui lòng đăng nhập để sử dụng giỏ hàng";
    setError(message);
    toast.error(message);
    window.dispatchEvent(new CustomEvent("novawear:open-auth", { detail: { mode: "login" } }));
    return false;
  }, [isAuthenticated]);

  const addItem = useCallback(
    async (payload: { productId: string; productOptionId: string; quantity: number }) => {
      if (!requireAuth()) return;
      if (payload.quantity < 1) {
        const message = "Số lượng phải lớn hơn 0";
        setError(message);
        toast.error(message);
        return;
      }

      try {
        setError("");
        setIsLoading(true);
        const request = cartApi.addToCart(payload);
        toast.promise(request, {
          loading: "Đang thêm vào giỏ hàng...",
          success: "Đã thêm vào giỏ hàng",
          error: (error) => (error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng"),
        });
        const nextCart = await request;
        setCart(nextCart);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng");
      } finally {
        setIsLoading(false);
      }
    },
    [requireAuth],
  );

  const addToCart = useCallback(
    async (product: Product, size: string, color: string, quantity = 1) => {
      const option = product.options?.find((item) => item.size === size && (item.color.name === color || item.color.value === color));
      if (!option) {
        const message = "Phiên bản sản phẩm không tồn tại";
        setError(message);
        toast.error(message);
        return;
      }
      if (option.stock <= 0) {
        const message = "Phiên bản sản phẩm đã hết hàng";
        setError(message);
        toast.error(message);
        return;
      }
      await addItem({ productId: product.id, productOptionId: option.id, quantity });
    },
    [addItem],
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      if (!requireAuth()) return;
      try {
        setError("");
        setIsLoading(true);
        if (quantity <= 0) {
          const request = cartApi.removeCartItem(itemId);
          toast.promise(request, {
            loading: "Đang xóa sản phẩm...",
            success: "Đã xóa sản phẩm khỏi giỏ hàng",
            error: (error) => (error instanceof Error ? error.message : "Không thể xóa sản phẩm"),
          });
          const nextCart = await request;
          setCart(nextCart);
          return;
        }
        const request = cartApi.updateCartItem(itemId, { quantity });
        toast.promise(request, {
          loading: "Đang cập nhật giỏ hàng...",
          success: "Đã cập nhật giỏ hàng",
          error: (error) => (error instanceof Error ? error.message : "Không thể cập nhật giỏ hàng"),
        });
        const nextCart = await request;
        setCart(nextCart);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Không thể cập nhật giỏ hàng");
      } finally {
        setIsLoading(false);
      }
    },
    [requireAuth],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!requireAuth()) return;
      try {
        setError("");
        setIsLoading(true);
        const request = cartApi.removeCartItem(itemId);
        toast.promise(request, {
          loading: "Đang xóa sản phẩm...",
          success: "Đã xóa sản phẩm khỏi giỏ hàng",
          error: (error) => (error instanceof Error ? error.message : "Không thể xóa sản phẩm"),
        });
        const nextCart = await request;
        setCart(nextCart);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Không thể xóa sản phẩm");
      } finally {
        setIsLoading(false);
      }
    },
    [requireAuth],
  );

  const clear = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(emptyCart);
      return;
    }
    try {
      setError("");
      setIsLoading(true);
      const request = cartApi.clearCart();
      toast.promise(request, {
        loading: "Đang xóa giỏ hàng...",
        success: "Đã xóa giỏ hàng",
        error: (error) => (error instanceof Error ? error.message : "Không thể xóa giỏ hàng"),
      });
      const nextCart = await request;
      setCart(nextCart);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Không thể xóa giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const value = useMemo<CartState>(
    () => ({
      cart,
      items: cart.items,
      isLoading,
      error,
      refreshCart,
      addItem,
      addToCart,
      updateItem,
      updateQuantity: updateItem,
      removeItem,
      removeFromCart: removeItem,
      clear,
      clearCart: clear,
      cartTotal: cart.total,
      cartCount: cart.items.reduce((count, item) => count + item.quantity, 0),
    }),
    [addItem, addToCart, cart, clear, error, isLoading, refreshCart, removeItem, updateItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartState => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
