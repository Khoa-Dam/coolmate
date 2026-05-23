"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { orderApi } from "@/services/orderApi";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderApi
      .getOrders()
      .then(setOrders)
      .catch((error) => setError(error instanceof Error ? error.message : "Không thể tải đơn hàng"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        <ProtectedRoute>
          <h1 className="font-headline text-xl md:text-2xl font-black text-on-surface mb-8 uppercase tracking-tight">Đơn hàng của tôi</h1>
          {isLoading && <p className="text-sm text-on-surface-variant">Đang tải...</p>}
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>}
          {!isLoading && orders.length === 0 && <p className="text-sm text-on-surface-variant">Bạn chưa có đơn hàng nào.</p>}
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-bold text-primary">{order.code ?? order.id}</p>
                  <p className="text-xs text-on-surface-variant">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-on-surface">{order.totalAmount.toLocaleString("vi-VN")}đ</p>
                  <p className="text-xs uppercase text-on-surface-variant">{order.orderStatus}</p>
                </div>
                <Link href={`/orders/${order.id}`}>
                  <Button variant="outline" className="h-9 rounded-lg text-xs">Chi tiết</Button>
                </Link>
              </div>
            ))}
          </div>
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  );
}
