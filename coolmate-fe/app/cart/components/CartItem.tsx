"use client";

import React from "react";
import Link from "next/link";
import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { OptimizedImage } from "@/components/product/optimized-image";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQtyChange = (newQty: number) => {
    updateQuantity(item.id, newQty);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-outline-variant/40 last:border-b-0">
      {/* Product Image */}
      <Link
        href={`/products/${item.product.slug}`}
        className="w-20 h-25 sm:w-24 sm:h-30 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 relative block"
      >
        <OptimizedImage
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          sizes="(max-width: 640px) 80px, 96px"
          className="object-cover"
        />
      </Link>

      {/* Item Details */}
      <div className="flex flex-col flex-grow justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/products/${item.product.slug}`}
              className="font-semibold text-sm hover:text-primary transition-colors text-on-surface line-clamp-1 min-w-0"
            >
              {item.product.name}
            </Link>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-on-surface-variant hover:text-destructive p-1 transition-colors cursor-pointer"
              title="Xóa s?n ph?m"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-on-surface-variant mt-1.5 font-medium">
            <span>Size: {item.selectedSize}</span>
            <span className="text-outline-variant">|</span>
            <span>Màu: {item.selectedColor}</span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          {/* Quantity Actions */}
          <div className="flex items-center border border-outline-variant/60 rounded-md bg-white overflow-hidden h-8">
            <button
              type="button"
              className="h-full px-2 hover:bg-surface-container-low text-on-surface disabled:opacity-40"
              onClick={() => handleQtyChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-semibold text-on-surface">
              {item.quantity}
            </span>
            <button
              type="button"
              className="h-full px-2 hover:bg-surface-container-low text-on-surface"
              onClick={() => handleQtyChange(item.quantity + 1)}
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {/* Pricing */}
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-on-surface">
              {(item.product.price * item.quantity).toLocaleString("vi-VN")}d
            </span>
            {(item.product.originalPrice ?? item.product.price) > item.product.price && (
              <span className="text-[11px] text-on-surface-variant/75 line-through">
                {((item.product.originalPrice ?? item.product.price) * item.quantity).toLocaleString(
                  "vi-VN",
                )}
                d
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
