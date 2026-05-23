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
    <Card className="group flex flex-col relative bg-white border border-outline-variant/30 rounded-xxl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden pb-4">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isBestSeller && (
          <Badge className="bg-destructive text-destructive-foreground font-semibold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-DEFAULT">
            Bán chạy
          </Badge>
        )}
        {product.isNew && (
          <Badge className="bg-primary text-primary-foreground font-semibold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-DEFAULT">
            Mới
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="bg-tertiary text-on-tertiary font-semibold text-[10px] tracking-wide px-2 py-0.5 rounded-DEFAULT">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={toggleFavorite}
        aria-label={isFavorite ? "Bỏ khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
        aria-pressed={isFavorite}
        className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center text-on-surface-variant hover:text-tertiary bg-white/90 rounded-full backdrop-blur-sm shadow-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
      <Link href={`/products/${product.slug}`} className="block overflow-hidden bg-surface-container-low w-full relative aspect-[4/5]">
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
            className="w-full bg-on-surface text-on-primary hover:bg-on-surface-variant font-headline text-xs font-semibold uppercase tracking-wider h-10 rounded-DEFAULT shadow-md"
          >
            Thêm nhanh
          </Button>
        </div>
      </Link>

      {/* Product Details */}
      <CardContent className="px-4 mt-4 flex flex-col gap-1.5 flex-grow">
        {/* Star Rating */}
        <div className="flex items-center gap-1 text-tertiary text-[11px]">
          <span className="material-symbols-outlined text-[13px] fill-icon">star</span>
          <span className="text-on-surface font-semibold ml-0.5">{product.rating}</span>
          <span className="text-on-surface-variant">({product.reviewCount})</span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
          <h3 className="font-sans text-sm font-semibold text-on-surface line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-bold text-on-surface">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-on-surface-variant/75 line-through">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex gap-1.5 mt-auto pt-2">
            {product.colors.map((color) => {
              const isActive = selectedColor === color;
              // Map name to css color
              let colorBg = "#ccc";
              if (color === "Trắng") colorBg = "#fff";
              if (color === "Đen") colorBg = "#000";
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
                  className={`size-5 rounded-full border cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
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
      </CardContent>
    </Card>
  );
};
