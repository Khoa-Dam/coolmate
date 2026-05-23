"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, Tag, ArrowRight } from "lucide-react";
import { mockProducts } from "../data/products";

interface CartDrawerProps {
  trigger: React.ReactElement;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ trigger }) => {
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount, addToCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    if (promoCode.trim().toUpperCase() === "NOVA15") {
      const disc = Math.round(cartTotal * 0.15);
      setDiscount(disc);
      setPromoSuccess("Đã áp dụng voucher giảm 15%!");
    } else if (promoCode.trim()) {
      setPromoError("Mã giảm giá không hợp lệ");
      setDiscount(0);
    }
  };

  // Upsell items (Boxer brief modal & vớ cổ trung)
  const upsellItems = mockProducts.filter((p) => p.id === "prod-5" || p.id === "prod-6");

  return (
    <Sheet>
      <SheetTrigger render={trigger} />
      <SheetContent className="w-full sm:max-w-md bg-white border-l border-outline-variant/30 flex flex-col h-full p-0 shadow-2xl">
        <SheetHeader className="px-6 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-white flex-row shrink-0">
          <SheetTitle className="font-headline text-headline-sm text-on-surface uppercase tracking-tight">
            Giỏ hàng của bạn ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-grow overflow-y-auto no-scrollbar p-6 flex flex-col gap-6 bg-surface-bright">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-4xl mb-3 text-on-surface-variant/40">shopping_bag</span>
              <p className="text-sm">Giỏ hàng của bạn đang trống.</p>
              <SheetClose
                render={
                  <Button className="mt-4 bg-primary text-white text-xs font-headline font-bold uppercase tracking-wider h-10 px-6 rounded-lg cursor-pointer" />
                }
              >
                Mua sắm ngay
              </SheetClose>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 shrink-0 bg-surface-container-low rounded-md overflow-hidden relative border border-outline-variant/20 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-between py-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-headline text-xs font-bold text-on-surface line-clamp-2">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] font-sans font-medium text-on-surface-variant mt-1">
                            {item.selectedColor} / {item.selectedSize}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-on-surface-variant hover:text-destructive cursor-pointer transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-outline-variant/50 rounded-md bg-white overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-sans font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="text-xs font-sans font-bold text-on-surface">
                          {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Separator */}
              <div className="h-px bg-outline-variant/30 w-full" />

              {/* Suggestions/Upsell section */}
              <div className="flex flex-col gap-4">
                <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-on-surface">Sản phẩm gợi ý</h4>
                <div className="grid grid-cols-2 gap-4">
                  {upsellItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-outline-variant/20 shadow-[0_4px_20px_rgba(0,0,0,0.02)] animate-fade-in"
                    >
                      <div className="w-full aspect-square bg-surface-container-low rounded overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 text-[10px]">
                        <span className="font-bold text-on-surface truncate">{prod.name}</span>
                        <span className="font-medium text-on-surface-variant">{prod.price.toLocaleString("vi-VN")}đ</span>
                      </div>
                      <Button
                        onClick={() => addToCart(prod, prod.sizes[0] || "Free Size", prod.colors[0] || "Đen", 1)}
                        className="w-full py-1 h-7 border border-on-surface text-on-surface hover:bg-on-surface hover:text-white bg-transparent rounded text-[10px] font-headline font-bold uppercase tracking-wide flex justify-center items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="size-2.5" /> Thêm
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-outline-variant/30 flex flex-col gap-5 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] shrink-0">
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-4" />
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Mã giảm giá (Thử: NOVA15)"
                  className="pl-9 h-10 text-xs border-outline-variant rounded-lg bg-surface-bright"
                />
              </div>
              <Button
                onClick={handleApplyPromo}
                className="px-4 h-10 border border-on-surface text-on-surface hover:bg-surface-container bg-transparent rounded-lg text-xs font-headline font-bold uppercase tracking-wider cursor-pointer"
              >
                Áp dụng
              </Button>
            </div>
            {promoError && <span className="text-[10px] -mt-3 text-destructive font-medium">{promoError}</span>}
            {promoSuccess && <span className="text-[10px] -mt-3 text-emerald-600 font-medium">{promoSuccess}</span>}

            {/* Price Calculations */}
            <div className="flex flex-col gap-2.5 text-xs text-on-surface-variant font-medium">
              <div className="flex justify-between items-center">
                <span>Tạm tính</span>
                <span className="font-semibold text-on-surface">{cartTotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Phí vận chuyển</span>
                <span className="text-primary font-semibold">Miễn phí</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-emerald-600">
                  <span>Giảm giá</span>
                  <span>-{discount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              <div className="h-px bg-outline-variant/30 w-full my-0.5" />
              <div className="flex justify-between items-center text-sm font-bold text-on-surface">
                <span className="font-headline uppercase tracking-wider">Tổng cộng</span>
                <span className="text-primary font-headline">{(cartTotal - discount).toLocaleString("vi-VN")}đ</span>
              </div>
            </div>

            {/* Checkout Link */}
            <SheetClose
              render={
                <Link href="/checkout" className="block w-full" />
              }
            >
              <Button className="w-full h-12 bg-primary text-white hover:bg-primary-container rounded-lg font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,85,255,0.2)]">
                Thanh toán
                <ArrowRight className="size-4" />
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
