"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/product/optimized-image";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");

  // Calculate discount percentage if exists
  const discount =
    (product.originalPrice ?? product.price) > product.price
      ? Math.round(
          (((product.originalPrice ?? product.price) - product.price) /
            (product.originalPrice ?? product.price)) *
            100,
        )
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop routing
    const defaultSize = product.sizes[0] || "M";
    void addToCart(product, defaultSize, selectedColor, 1);
    // Alert or feedback can be added later
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="group relative bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full border border-outline-variant/10">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isBestSeller && (
          <span className="bg-error text-on-error font-label-sm text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm select-none">
            Bán chạy
          </span>
        )}
        {product.isNew && (
          <span className="bg-surface text-on-surface font-label-sm text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm border border-outline-variant/30 select-none">
            Mới
          </span>
        )}
        {discount > 0 && (
          <span className="bg-tertiary text-on-tertiary font-label-sm text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm select-none">
            -{discount}%
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={toggleFavorite}
        aria-label={
          isFavorite
            ? "Bỏ khỏi danh sách yêu thích"
            : "Thêm vào danh sách yêu thích"
        }
        aria-pressed={isFavorite}
        className="absolute top-2 right-2 z-10 flex p-1.5 bg-surface/80 backdrop-blur rounded-full text-on-surface opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:text-primary cursor-pointer shadow-sm"
      >
        <Heart className={`size-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* Product Image Link */}
      <Link
        href={`/products/${product.slug}`}
        className="block overflow-hidden bg-surface-container-high w-full relative aspect-[3/4]"
      >
        <OptimizedImage
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Quick Add button on hover */}
        <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 flex gap-2 z-10">
          <Button
            disabled={isLoading}
            onClick={handleQuickAdd}
            className="w-full bg-primary text-primary-foreground hover:bg-primary-container font-label-md text-xs font-semibold h-9 rounded-lg shadow-md cursor-pointer transition-colors disabled:pointer-events-none disabled:opacity-70"
          >
            Thêm nhanh
          </Button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-2.5 flex flex-col flex-grow bg-white">
        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="flex gap-1 mb-2">
            {product.colors.map((color) => {
              const isActive = selectedColor === color;
              let colorBg = "#ccc";
              if (color === "Trắng") colorBg = "#ffffff";
              if (color === "Đen") colorBg = "#000000";
              if (color === "Xanh Navy") colorBg = "#1e3a8a";
              if (color === "Xám") colorBg = "#808080";
              if (color === "Xanh Rêu") colorBg = "#4b5320";

              return (
                <button
                  key={color}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(color);
                  }}
                  type="button"
                  aria-label={`Chọn màu ${color}`}
                  aria-pressed={isActive}
                  className={`w-4 h-4 rounded-full border cursor-pointer transition-all ${
                    isActive
                      ? "border-primary ring-1 ring-offset-1 ring-primary"
                      : "border-outline-variant hover:scale-110"
                  }`}
                  style={{ backgroundColor: colorBg }}
                  title={color}
                />
              );
            })}
          </div>
        )}

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="hover:text-primary transition-colors block mb-1"
        >
          <h3 className="font-body-md text-on-surface font-medium truncate text-xs">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-1.5 mt-auto">
          <span className="font-label-md text-on-surface font-semibold text-xs">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
          {(product.originalPrice ?? product.price) > product.price && (
            <span className="text-[10px] text-on-surface-variant/70 line-through">
              {(product.originalPrice ?? product.price).toLocaleString("vi-VN")}
              đ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
