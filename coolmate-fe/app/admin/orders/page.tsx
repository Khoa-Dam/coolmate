"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { mockApi } from "../../services/mockApi";
import { Order } from "../../types/order";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrders(mockApi.getOrders());
  }, []);

  const handleStatusChange = (orderId: string, status: Order["orderStatus"]) => {
    mockApi.updateOrderStatus(orderId, status);
    setOrders(mockApi.getOrders());
  };

  const handlePaymentChange = (orderId: string, status: Order["paymentStatus"]) => {
    mockApi.updateOrderPaymentStatus(orderId, status);
    setOrders(mockApi.getOrders());
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        <div className="mb-8 border-b border-outline-variant/30 pb-5">
          <h1 className="font-headline text-xl md:text-2xl font-black text-on-surface uppercase tracking-tight">
            Quản lý đơn hàng (Mock API)
          </h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Admin console / Danh sách đơn hàng từ checkout hoặc seed data
          </p>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-outline-variant/30 rounded-xxl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-surface-container-low">
              <TableRow className="border-b border-outline-variant/40 hover:bg-transparent">
                <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant w-28">Mã đơn</TableHead>
                <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant">Khách hàng</TableHead>
                <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant">Thanh toán</TableHead>
                <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant">Vận chuyển</TableHead>
                <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant text-right">Tổng cộng</TableHead>
                <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant text-center w-28">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="font-medium text-xs text-on-surface-variant divide-y divide-outline-variant/40">
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-on-surface-variant">
                    Chưa có đơn hàng nào được tạo.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50">
                    <TableCell className="py-4 font-mono text-primary font-bold text-xs">{order.id}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-on-surface text-sm">{order.customerName}</span>
                        <span className="text-[10px] mt-0.5 text-on-surface-variant">{order.customerPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <OrderStatusBadge type="payment" status={order.paymentStatus} />
                        <div className="w-32">
                          <Select
                            value={order.paymentStatus}
                            onValueChange={(val) => {
                              if (val) handlePaymentChange(order.id, val as Order["paymentStatus"]);
                            }}
                          >
                            <SelectTrigger className="h-8 text-[10px] bg-white border-outline-variant rounded-md">
                              <SelectValue placeholder="Đổi trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-outline-variant text-[10px]">
                              <SelectItem value="pending" className="text-[10px]">Chưa thanh toán</SelectItem>
                              <SelectItem value="paid" className="text-[10px]">Đã thanh toán</SelectItem>
                              <SelectItem value="failed" className="text-[10px]">Thanh toán lỗi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <OrderStatusBadge type="order" status={order.orderStatus} />
                        <div className="w-32">
                          <Select
                            value={order.orderStatus}
                            onValueChange={(val) => {
                              if (val) handleStatusChange(order.id, val as Order["orderStatus"]);
                            }}
                          >
                            <SelectTrigger className="h-8 text-[10px] bg-white border-outline-variant rounded-md">
                              <SelectValue placeholder="Đổi trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-outline-variant text-[10px]">
                              <SelectItem value="pending" className="text-[10px]">Chờ xử lý</SelectItem>
                              <SelectItem value="processing" className="text-[10px]">Đang xử lý</SelectItem>
                              <SelectItem value="shipped" className="text-[10px]">Đang giao</SelectItem>
                              <SelectItem value="delivered" className="text-[10px]">Đã giao</SelectItem>
                              <SelectItem value="cancelled" className="text-[10px]">Đã hủy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right font-bold text-on-surface">
                      {order.totalAmount.toLocaleString("vi-VN")}đ
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-surface-container text-on-surface-variant cursor-pointer"
                              onClick={() => setSelectedOrder(order)}
                            />
                          }
                        >
                          <Eye className="size-4" />
                        </DialogTrigger>
                        {selectedOrder && (
                          <DialogContent className="bg-white border border-outline-variant/60 rounded-xxl p-6 max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="font-headline text-base font-bold text-on-surface uppercase tracking-tight flex items-center gap-2">
                                Chi tiết đơn hàng <span className="font-mono text-primary font-bold">{selectedOrder.id}</span>
                              </DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-col gap-4 text-xs font-medium text-on-surface-variant mt-4">
                              <div>
                                <h4 className="font-bold text-on-surface mb-1">Khách hàng:</h4>
                                <p>{selectedOrder.customerName} - {selectedOrder.customerPhone}</p>
                                <p>{selectedOrder.customerEmail}</p>
                              </div>
                              <div>
                                <h4 className="font-bold text-on-surface mb-1">Địa chỉ giao hàng:</h4>
                                <p>{selectedOrder.shippingAddress}</p>
                              </div>
                              {selectedOrder.notes && (
                                <div>
                                  <h4 className="font-bold text-on-surface mb-1">Ghi chú giao hàng:</h4>
                                  <p className="bg-yellow-50/50 p-2 border border-yellow-100 rounded text-yellow-800 font-medium">
                                    {selectedOrder.notes}
                                  </p>
                                </div>
                              )}

                              <Separator className="bg-outline-variant/40" />

                              <div>
                                <h4 className="font-bold text-on-surface mb-2">Sản phẩm đã mua:</h4>
                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                                  {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-xs">
                                      <span className="truncate max-w-[240px]">
                                        {item.product.name} ({item.selectedSize} / {item.selectedColor}) x{item.quantity}
                                      </span>
                                      <span className="font-bold text-on-surface">
                                        {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Separator className="bg-outline-variant/40" />

                              <div className="flex justify-between items-center text-sm font-bold text-on-surface">
                                <span>Tổng cộng thanh toán:</span>
                                <span className="text-primary font-headline text-base">{selectedOrder.totalAmount.toLocaleString("vi-VN")}đ</span>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
