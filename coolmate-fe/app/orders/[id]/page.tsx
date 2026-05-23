"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { orderApi } from "@/services/orderApi";
import { Order } from "@/types/order";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    orderApi
      .getOrderById(params.id)
      .then(setOrder)
      .catch((error) => setError(error instanceof Error ? error.message : "Không thể tải đơn hàng"));
  }, [params.id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        <ProtectedRoute>
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>}
          {!order ? (
            <p className="text-sm text-on-surface-variant">Đang tải...</p>
          ) : (
            <div className="bg-white border border-outline-variant/30 rounded-xxl p-6 shadow-sm">
              <h1 className="font-headline text-xl font-black uppercase text-on-surface">Đơn hàng {order.code ?? order.id}</h1>
              <p className="mt-2 text-sm text-on-surface-variant">{order.shippingAddress}</p>
              <div className="mt-6 flex flex-col gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between border-b border-outline-variant/20 pb-3 text-sm">
                    <span>{item.product.name} ({item.selectedSize} / {item.selectedColor}) x{item.quantity}</span>
                    <span className="font-bold">{(item.product.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between font-bold">
                <span>Tổng cộng</span>
                <span>{order.totalAmount.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          )}
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  );
}
