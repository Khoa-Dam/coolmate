"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "../types/product";
import { useCart } from "../context/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");

  // Calculate discount percentage if exists
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop routing
    const defaultSize = product.sizes[0] || "M";
    addToCart(product, defaultSize, selectedColor, 1);
    // Alert or feedback can be added later
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="group relative bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full border border-outline-variant/10">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isBestSeller && (
          <span className="bg-error text-on-error font-label-sm text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm select-none">
            Bán chạy
          </span>
        )}
        {product.isNew && (
          <span className="bg-surface text-on-surface font-label-sm text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm border border-outline-variant/30 select-none">
            Mới
          </span>
        )}
        {discount > 0 && (
          <span className="bg-tertiary text-on-tertiary font-label-sm text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm select-none">
            -{discount}%
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={toggleFavorite}
        aria-label={isFavorite ? "Bỏ khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
        aria-pressed={isFavorite}
        className="absolute top-3 right-3 z-10 flex p-2 bg-surface/80 backdrop-blur rounded-full text-on-surface opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:text-primary cursor-pointer shadow-sm"
      >
        <span
          className={`material-symbols-outlined text-[18px] ${
            isFavorite ? "fill-icon text-red-500" : ""
          }`}
        >
          favorite
        </span>
      </button>

      {/* Product Image Link */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden bg-surface-container-high w-full relative aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Quick Add button on hover */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 flex gap-2 z-10">
          <Button
            onClick={handleQuickAdd}
            className="w-full bg-on-surface text-surface hover:bg-on-surface/90 font-label-md text-xs font-semibold h-10 rounded-lg shadow-md cursor-pointer transition-colors"
          >
            Thêm nhanh
          </Button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="flex gap-1.5 mb-2.5">
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
        <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors block mb-2">
          <h3 className="font-body-md text-on-surface font-medium truncate text-sm">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-label-md text-on-surface font-semibold text-sm">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-on-surface-variant/70 line-through">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
