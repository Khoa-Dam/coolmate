"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { OptimizedImage } from "@/components/product/optimized-image";
import { useCart } from "@/context/CartContext";
import { orderApi } from "@/services/order.service";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Landmark, Lock, QrCode, Truck, Wallet } from "lucide-react";

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
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Họ tên không được trống";
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "Email không hợp lệ";
    if (!phone.trim() || phone.length < 9)
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!address.trim())
      newErrors.address = "Địa chỉ nhận hàng không được trống";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Vui lòng kiểm tra lại thông tin giao hàng");
      // Scroll to top of forms if error exists
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const cityLabel =
      city === "hcm" ? "TP. Hồ Chí Minh" : city === "hn" ? "Hà Nội" : "Đà Nẵng";

    try {
      setIsSubmitting(true);
      const createdOrder = await orderApi.checkout({
        shippingInfo: {
          fullName: name,
          phone,
          address,
          city: cityLabel,
          district: cityLabel,
          ward: cityLabel,
          note: notes,
        },
        paymentMethod: paymentMethod === "cod" ? "COD" : "VNPAY_MOCK",
      });

      await clearCart();
      toast.success("Đặt hàng thành công");
      router.push(`/checkout/success?orderId=${createdOrder.id}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể tạo đơn hàng",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        <ProtectedRoute>
          {/* Breadcrumb back link */}
          <div className="mb-6 flex items-center">
            <Link
              href="/products"
              className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="size-4" /> Quay lại mua sắm
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Steps */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Step 1: Thông tin nhận hàng */}
              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-lg shadow-sm border border-outline-variant text-left">
                <h2 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-3 text-on-surface">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-label-md text-label-md select-none">
                    1
                  </span>
                  Thông tin nhận hàng
                </h2>

                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <Label
                        htmlFor="name"
                        className="block font-label-sm text-label-sm text-on-surface-variant mb-2"
                      >
                        Họ và tên
                      </Label>
                      <input
                        id="name"
                        placeholder="Nhập họ tên của bạn"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-bright border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors font-body-md text-body-md text-on-surface"
                      />
                      {errors.name && (
                        <span className="text-[11px] text-destructive font-semibold mt-1">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <Label
                        htmlFor="phone"
                        className="block font-label-sm text-label-sm text-on-surface-variant mb-2"
                      >
                        Số điện thoại
                      </Label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface-bright border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors font-body-md text-body-md text-on-surface"
                      />
                      {errors.phone && (
                        <span className="text-[11px] text-destructive font-semibold mt-1">
                          {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Label
                      htmlFor="email"
                      className="block font-label-sm text-label-sm text-on-surface-variant mb-2"
                    >
                      Email
                    </Label>
                    <input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-bright border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors font-body-md text-body-md text-on-surface"
                    />
                    {errors.email && (
                      <span className="text-[11px] text-destructive font-semibold mt-1">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col">
                      <Label
                        htmlFor="address"
                        className="block font-label-sm text-label-sm text-on-surface-variant mb-2"
                      >
                        Địa chỉ chi tiết
                      </Label>
                      <input
                        id="address"
                        placeholder="Số nhà, ngõ/ngách, tên đường..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-surface-bright border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors font-body-md text-body-md text-on-surface"
                      />
                      {errors.address && (
                        <span className="text-[11px] text-destructive font-semibold mt-1">
                          {errors.address}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <Label
                        htmlFor="city"
                        className="block font-label-sm text-label-sm text-on-surface-variant mb-2"
                      >
                        Tỉnh / Thành phố
                      </Label>
                      <Select
                        value={city}
                        onValueChange={(val) => setCity(val ?? "")}
                      >
                        <SelectTrigger
                          id="city"
                          className="w-full bg-surface-bright border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors font-body-md text-body-md appearance-none h-[46px]"
                        >
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

                  <div className="flex flex-col">
                    <Label
                      htmlFor="notes"
                      className="block font-label-sm text-label-sm text-on-surface-variant mb-2"
                    >
                      Ghi chú (Tùy chọn)
                    </Label>
                    <textarea
                      id="notes"
                      placeholder="Ghi chú giao hàng..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-surface-bright border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-colors font-body-md text-body-md text-on-surface"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Phương thức vận chuyển */}
              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-lg shadow-sm border border-outline-variant text-left">
                <h2 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-3 text-on-surface">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-label-md text-label-md select-none">
                    2
                  </span>
                  Phương thức vận chuyển
                </h2>

                <div className="space-y-4">
                  {/* Standard Shipping Card */}
                  <div
                    onClick={() => setShippingMethod("standard")}
                    className={`relative flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                      shippingMethod === "standard"
                        ? "border-on-surface bg-surface-container-low"
                        : "border-outline-variant hover:border-on-surface bg-surface-container-lowest"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="h-5 w-5 border-outline-variant text-primary focus:ring-primary checked:border-primary cursor-pointer"
                      />
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">
                          Giao hàng tiêu chuẩn
                        </p>
                        <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
                          Dự kiến nhận hàng trong 3-5 ngày làm việc
                        </p>
                      </div>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface">
                      Miễn phí
                    </span>
                  </div>

                  {/* Express Shipping Card */}
                  <div
                    onClick={() => setShippingMethod("express")}
                    className={`relative flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                      shippingMethod === "express"
                        ? "border-on-surface bg-surface-container-low"
                        : "border-outline-variant hover:border-on-surface bg-surface-container-lowest"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="h-5 w-5 border-outline-variant text-primary focus:ring-primary checked:border-primary cursor-pointer"
                      />
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">
                          Giao hàng hỏa tốc
                        </p>
                        <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
                          Chỉ áp dụng nội thành, nhận trong 2h
                        </p>
                      </div>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface">
                      45.000đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: Phương thức thanh toán */}
              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-lg shadow-sm border border-outline-variant text-left">
                <h2 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-3 text-on-surface">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-label-md text-label-md select-none">
                    3
                  </span>
                  Phương thức thanh toán
                </h2>

                <div className="space-y-4">
                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`relative flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-on-surface transition-colors ${
                      paymentMethod === "cod"
                        ? "border-on-surface bg-surface-container-low"
                        : "border-outline-variant"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="h-5 w-5 border-outline-variant text-primary focus:ring-primary checked:border-primary cursor-pointer"
                    />
                    <Truck className="size-6 text-on-surface-variant" />
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        Thanh toán khi nhận hàng (COD)
                      </p>
                    </div>
                  </div>

                  {/* Bank Transfer Option */}
                  <div
                    onClick={() => setPaymentMethod("bank")}
                    className={`relative flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-on-surface transition-colors ${
                      paymentMethod === "bank"
                        ? "border-on-surface bg-surface-container-low"
                        : "border-outline-variant"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                      className="h-5 w-5 border-outline-variant text-primary focus:ring-primary checked:border-primary cursor-pointer"
                    />
                    <Landmark className="size-6 text-on-surface-variant" />
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        Chuyển khoản ngân hàng
                      </p>
                    </div>
                  </div>

                  {/* Momo Option */}
                  <div
                    onClick={() => setPaymentMethod("momo")}
                    className={`relative flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-on-surface transition-colors ${
                      paymentMethod === "momo"
                        ? "border-on-surface bg-surface-container-low"
                        : "border-outline-variant"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "momo"}
                      onChange={() => setPaymentMethod("momo")}
                      className="h-5 w-5 border-outline-variant text-primary focus:ring-primary checked:border-primary cursor-pointer"
                    />
                    <Wallet className="size-6 text-on-surface-variant" />
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        Ví điện tử Momo
                      </p>
                    </div>
                  </div>

                  {/* VNPay Option */}
                  <div
                    onClick={() => setPaymentMethod("vnpay")}
                    className={`relative flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-on-surface transition-colors ${
                      paymentMethod === "vnpay"
                        ? "border-on-surface bg-surface-container-low"
                        : "border-outline-variant"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                      className="h-5 w-5 border-outline-variant text-primary focus:ring-primary checked:border-primary cursor-pointer"
                    />
                    <QrCode className="size-6 text-on-surface-variant" />
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">
                        VNPay
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout Action */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-lg shadow-sm border border-outline-variant text-left">
                <h3 className="font-headline-sm text-headline-sm mb-6">
                  Đơn hàng của bạn
                </h3>

                {/* Scrollable list of items */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 hide-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-24 bg-surface-container-high rounded-md overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1 min-w-0 text-left">
                        <div>
                          <p className="font-label-md text-label-md text-on-surface line-clamp-2 leading-tight">
                            {item.product.name}
                          </p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                            Size: {item.selectedSize} | Màu:{" "}
                            {item.selectedColor}
                          </p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <span className="font-body-md text-body-md text-on-surface-variant">
                            SL: {item.quantity}
                          </span>
                          <span className="font-label-md text-label-md text-on-surface">
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString("vi-VN")}
                            đ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo entry box */}
                <div className="border-t border-outline-variant pt-6 mb-6">
                  <div className="flex gap-2">
                    <input
                      placeholder="Mã giảm giá"
                      className="flex-1 bg-surface-bright border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-on-surface font-body-md text-body-md text-on-surface text-sm"
                    />
                    <button
                      type="button"
                      className="bg-surface-container-high text-on-surface font-label-md text-label-md px-6 rounded border border-outline-variant hover:bg-secondary-container transition-colors cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Pricing breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                    <span>Tạm tính</span>
                    <span className="text-on-surface">
                      {cartTotal.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                    <span>Phí vận chuyển</span>
                    <span className="text-on-surface">
                      {shippingFee === 0
                        ? "Miễn phí"
                        : `${shippingFee.toLocaleString("vi-VN")}đ`}
                    </span>
                  </div>
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                    <span>Giảm giá</span>
                    <span className="text-on-surface">- 0đ</span>
                  </div>
                </div>

                {/* Total display */}
                <div className="border-t border-outline-variant pt-4 mb-8 flex justify-between items-center">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    Tổng cộng
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary">
                    {finalTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                {/* Submit CTA */}
                {submitError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                    {submitError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-primary text-on-primary font-headline-sm text-[16px] font-semibold rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] cursor-pointer"
                >
                  {isSubmitting ? "Đang đặt hàng..." : "Đặt hàng"}
                </button>

                {/* Trust signals */}
                <div className="mt-6 flex flex-col items-center gap-3 border-t border-outline-variant pt-6">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Lock className="size-4" />
                    <span className="font-label-sm text-label-sm">
                      Thanh toán bảo mật và an toàn
                    </span>
                  </div>
                  <div className="flex justify-center gap-4 opacity-60">
                    <div className="h-6 w-10 bg-surface-container-high rounded border border-outline-variant flex items-center justify-center text-[10px] font-bold">
                      VISA
                    </div>
                    <div className="h-6 w-10 bg-surface-container-high rounded border border-outline-variant flex items-center justify-center text-[10px] font-bold">
                      MC
                    </div>
                    <div className="h-6 w-10 bg-surface-container-high rounded border border-outline-variant flex items-center justify-center text-[10px] font-bold">
                      JCB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ProtectedRoute>
      </main>

      <Footer />
    </div>
  );
}
