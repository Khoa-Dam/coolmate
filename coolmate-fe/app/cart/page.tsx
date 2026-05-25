"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { CartItem } from "./components/CartItem";
import { PriceSummary } from "./components/PriceSummary";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, cartTotal } = useCart();

  const isEmpty = items.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        <ProtectedRoute>
          <h1 className="font-headline text-xl md:text-2xl font-black text-on-surface mb-8 uppercase tracking-tight">
            Gi? hàng c?a b?n
          </h1>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-outline-variant/30 rounded-xxl p-8 shadow-sm">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="size-8 text-on-surface-variant/70" />
              </div>
              <h2 className="font-headline text-base font-bold text-on-surface">
                Giỏ hàng trống
              </h2>
              <p className="text-on-surface-variant text-sm mt-1 max-w-sm">
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy lượt qua bộ sưu tập
                của chúng tôi để chọn sản phẩm phù hợp.
              </p>
              <Link href="/products" className="mt-6">
                <Button className="bg-primary text-primary-foreground hover:bg-primary-container h-12 px-8 rounded-lg font-headline text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                  Mua sắm ngay <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Items List */}
              <div className="lg:col-span-2 bg-white border border-outline-variant/30 rounded-xxl p-5 sm:p-6 shadow-sm flex flex-col gap-1">
                <h3 className="font-headline text-base font-bold text-on-surface mb-4">
                  Danh sách s?n ph?m (
                  {items.reduce((acc, curr) => acc + curr.quantity, 0)})
                </h3>
                <div className="flex flex-col">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-outline-variant/30 flex justify-between">
                  <Link
                    href="/products"
                    className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
                  >
                    <ArrowLeft className="size-4" /> Ti?p t?c mua s?m
                  </Link>
                </div>
              </div>

              {/* Price Details summary */}
              <div className="lg:col-span-1">
                <PriceSummary
                  subtotal={cartTotal}
                  checkoutAction={
                    <Link href="/checkout" className="block w-full">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-container h-12 rounded-lg font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
                        Ti?n hành d?t hàng <ArrowRight className="size-4" />
                      </Button>
                    </Link>
                  }
                />
              </div>
            </div>
          )}
        </ProtectedRoute>
      </main>

      <Footer />
    </div>
  );
}
