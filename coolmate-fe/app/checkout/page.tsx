"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext";
import { mockApi } from "../services/mockApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Landmark, 
  Truck, 
  Wallet, 
  QrCode, 
  Lock,
  ArrowRight
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("hcm");
  const [notes, setNotes] = useState("");
  
  // Steps selections
  const [shippingMethod, setShippingMethod] = useState("standard"); // standard or express
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod, bank, momo, vnpay

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // If cart is empty, redirect back to products list
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items, router]);

  if (items.length === 0) return null;

  const shippingFee = shippingMethod === "express" ? 45000 : 0;
  const discount = 0; // Simple coupon placeholder
  const finalTotal = cartTotal + shippingFee - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Họ tên không được trống";
    if (!email.trim() || !email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (!phone.trim() || phone.length < 9) newErrors.phone = "Số điện thoại không hợp lệ";
    if (!address.trim()) newErrors.address = "Địa chỉ nhận hàng không được trống";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of forms if error exists
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const cityLabel = city === "hcm" ? "TP. Hồ Chí Minh" : city === "hn" ? "Hà Nội" : "Đà Nẵng";

    // Create simulated order
    const createdOrder = mockApi.createOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: `${address}, ${cityLabel}`,
      notes,
      items,
      totalAmount: finalTotal,
      paymentMethod,
    });

    clearCart();
    router.push(`/checkout/success?orderId=${createdOrder.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        {/* Breadcrumb back link */}
        <div className="mb-6 flex items-center">
          <Link
            href="/products"
            className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="size-4" /> Quay lại mua sắm
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Steps */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Step 1: Thông tin nhận hàng */}
            <Card className="bg-white border border-outline-variant/30 rounded-xxl p-6 md:p-8 shadow-sm">
              <h2 className="font-headline text-base font-black text-on-surface mb-6 flex items-center gap-3 uppercase tracking-wide">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-headline text-xs font-bold">
                  1
                </span>
                Thông tin nhận hàng
              </h2>

              <CardContent className="p-0 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Họ và tên</Label>
                    <Input
                      id="name"
                      placeholder="Nhập họ tên của bạn"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-outline-variant bg-surface-bright focus-visible:ring-primary rounded-lg text-sm h-12"
                    />
                    {errors.name && <span className="text-[11px] text-destructive font-semibold">{errors.name}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Số điện thoại</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-outline-variant bg-surface-bright focus-visible:ring-primary rounded-lg text-sm h-12"
                    />
                    {errors.phone && <span className="text-[11px] text-destructive font-semibold">{errors.phone}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-outline-variant bg-surface-bright focus-visible:ring-primary rounded-lg text-sm h-12"
                  />
                  {errors.email && <span className="text-[11px] text-destructive font-semibold">{errors.email}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Địa chỉ chi tiết</Label>
                    <Input
                      id="address"
                      placeholder="Số nhà, ngõ/ngách, tên đường..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="border-outline-variant bg-surface-bright focus-visible:ring-primary rounded-lg text-sm h-12"
                    />
                    {errors.address && <span className="text-[11px] text-destructive font-semibold">{errors.address}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tỉnh / Thành phố</Label>
                    <Select value={city} onValueChange={(val) => setCity(val ?? "")}>
                      <SelectTrigger id="city" className="border-outline-variant rounded-lg bg-surface-bright h-12 text-sm">
                        <SelectValue placeholder="Chọn tỉnh thành" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-outline-variant text-sm">
                        <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                        <SelectItem value="hn">Hà Nội</SelectItem>
                        <SelectItem value="dn">Đà Nẵng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Ghi chú (Tùy chọn)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Ghi chú giao hàng (ví dụ: giao giờ hành chính, gọi trước khi đến...)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border-outline-variant bg-surface-bright focus-visible:ring-primary rounded-lg text-sm"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Phương thức vận chuyển */}
            <Card className="bg-white border border-outline-variant/30 rounded-xxl p-6 md:p-8 shadow-sm">
              <h2 className="font-headline text-base font-black text-on-surface mb-6 flex items-center gap-3 uppercase tracking-wide">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-headline text-xs font-bold">
                  2
                </span>
                Phương thức vận chuyển
              </h2>

              <CardContent className="p-0 flex flex-col gap-4">
                {/* Standard Shipping Card */}
                <div
                  onClick={() => setShippingMethod("standard")}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingMethod === "standard"
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      shippingMethod === "standard" ? "border-primary" : "border-outline-variant"
                    }`}>
                      {shippingMethod === "standard" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">Giao hàng tiêu chuẩn</p>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">Dự kiến nhận hàng trong 3-5 ngày làm việc</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-on-surface uppercase">Miễn phí</span>
                </div>

                {/* Express Shipping Card */}
                <div
                  onClick={() => setShippingMethod("express")}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingMethod === "express"
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      shippingMethod === "express" ? "border-primary" : "border-outline-variant"
                    }`}>
                      {shippingMethod === "express" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">Giao hàng hỏa tốc</p>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">Giao nhanh qua Grab/Ahamove trong 2 giờ</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-on-surface">45.000đ</span>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Phương thức thanh toán */}
            <Card className="bg-white border border-outline-variant/30 rounded-xxl p-6 md:p-8 shadow-sm">
              <h2 className="font-headline text-base font-black text-on-surface mb-6 flex items-center gap-3 uppercase tracking-wide">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-headline text-xs font-bold">
                  3
                </span>
                Phương thức thanh toán
              </h2>

              <CardContent className="p-0 flex flex-col gap-3">
                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "cod" ? "border-primary" : "border-outline-variant"
                  }`}>
                    {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <Truck className="size-5 text-on-surface-variant" />
                  <div className="text-left">
                    <p className="font-bold text-sm text-on-surface">Thanh toán khi nhận hàng (COD)</p>
                  </div>
                </div>

                {/* Bank Transfer Option */}
                <div
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "bank"
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "bank" ? "border-primary" : "border-outline-variant"
                  }`}>
                    {paymentMethod === "bank" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <Landmark className="size-5 text-on-surface-variant" />
                  <div className="text-left">
                    <p className="font-bold text-sm text-on-surface">Chuyển khoản ngân hàng</p>
                  </div>
                </div>

                {/* Momo Option */}
                <div
                  onClick={() => setPaymentMethod("momo")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "momo"
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "momo" ? "border-primary" : "border-outline-variant"
                  }`}>
                    {paymentMethod === "momo" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <Wallet className="size-5 text-on-surface-variant" />
                  <div className="text-left">
                    <p className="font-bold text-sm text-on-surface">Ví điện tử Momo</p>
                  </div>
                </div>

                {/* VNPay Option */}
                <div
                  onClick={() => setPaymentMethod("vnpay")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "vnpay"
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "vnpay" ? "border-primary" : "border-outline-variant"
                  }`}>
                    {paymentMethod === "vnpay" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <QrCode className="size-5 text-on-surface-variant" />
                  <div className="text-left">
                    <p className="font-bold text-sm text-on-surface">Cổng thanh toán VNPay</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary & Checkout Action */}
          <div className="lg:col-span-5 sticky top-24 flex flex-col gap-6">
            <Card className="bg-white border border-outline-variant/30 rounded-xxl p-6 shadow-sm">
              <h3 className="font-headline text-base font-black text-on-surface mb-6 uppercase tracking-wide">
                Đơn hàng của bạn
              </h3>
              
              {/* Scrollable list of items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 hide-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-outline-variant/20 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-20 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div className="text-left">
                        <p className="font-bold text-xs text-on-surface truncate leading-tight">{item.product.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-semibold mt-1">Size: {item.selectedSize} | Màu: {item.selectedColor}</p>
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <span className="text-[11px] text-on-surface-variant font-medium">SL: {item.quantity}</span>
                        <span className="font-bold text-xs text-on-surface">{(item.product.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo entry box */}
              <div className="border-t border-outline-variant/30 pt-6 mb-6">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nhập mã giảm giá..." 
                    className="flex-1 h-11 border-outline-variant bg-surface-bright focus-visible:ring-primary rounded-lg text-xs" 
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    className="h-11 border border-outline-variant px-5 font-semibold text-xs rounded-lg cursor-pointer hover:bg-surface-container-high"
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                  <span>Tạm tính</span>
                  <span className="text-on-surface">{cartTotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                  <span>Phí vận chuyển</span>
                  <span className="text-on-surface">
                    {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                  <span>Giảm giá</span>
                  <span className="text-on-surface">- 0đ</span>
                </div>
              </div>

              {/* Total display */}
              <div className="border-t border-outline-variant/30 pt-4 mb-8 flex justify-between items-center">
                <span className="font-headline text-sm font-black text-on-surface uppercase tracking-wide">Tổng cộng</span>
                <span className="font-headline text-lg font-black text-primary">{finalTotal.toLocaleString("vi-VN")}đ</span>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary-container rounded-lg font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                Đặt hàng <ArrowRight className="size-4" />
              </Button>

              {/* Trust signals */}
              <div className="mt-6 flex flex-col items-center gap-3 border-t border-outline-variant/20 pt-6">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Lock className="size-3.5 text-on-surface-variant" />
                  <span className="font-semibold text-[10px] uppercase tracking-wider">Thanh toán bảo mật và an toàn</span>
                </div>
                <div className="flex justify-center gap-3 opacity-60">
                  <div className="h-6 w-10 bg-surface-container-high rounded border border-outline-variant flex items-center justify-center text-[8px] font-black">VISA</div>
                  <div className="h-6 w-10 bg-surface-container-high rounded border border-outline-variant flex items-center justify-center text-[8px] font-black">MASTER</div>
                  <div className="h-6 w-10 bg-surface-container-high rounded border border-outline-variant flex items-center justify-center text-[8px] font-black">JCB</div>
                </div>
              </div>
            </Card>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}
