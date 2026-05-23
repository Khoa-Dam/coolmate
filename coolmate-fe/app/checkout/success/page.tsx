"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ord-unknown";

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto px-4">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
        <CheckCircle2 className="size-12 text-emerald-600" />
      </div>

      <h1 className="font-headline text-2xl md:text-3xl font-black text-on-surface uppercase tracking-tight">
        Đặt hàng thành công!
      </h1>
      <p className="text-sm text-on-surface-variant font-medium mt-3">
        Cảm ơn bạn đã lựa chọn mua sắm tại NovaWear. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
      </p>

      {/* Order Info */}
      <div className="bg-white border border-outline-variant/30 rounded-xl p-4 sm:p-5 w-full my-8 text-left shadow-sm">
        <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant border-b border-outline-variant/30 pb-3 mb-3">
          <span>Mã đơn hàng:</span>
          <span className="font-mono text-primary font-bold text-sm">{orderId}</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Chúng tôi đã gửi thông tin xác nhận chi tiết đơn hàng đến email của bạn.
          Thông tin giao hàng sẽ được cập nhật liên tục qua tin nhắn số điện thoại.
        </p>
      </div>

      {/* Buttons Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link href="/products" className="flex-grow">
          <Button variant="outline" className="w-full border-outline-variant text-on-surface hover:bg-surface-container h-12 rounded-lg font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
            <ShoppingBag className="size-4" /> Tiếp tục mua sắm
          </Button>
        </Link>
        <Link href="/" className="flex-grow">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-container h-12 rounded-lg font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
            Quay lại trang chủ <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full flex items-center justify-center">
        <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
