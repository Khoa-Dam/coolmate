"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PriceSummaryProps {
  subtotal: number;
  checkoutAction?: React.ReactNode;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  subtotal,
  checkoutAction,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const shippingFee = subtotal >= 200000 || subtotal === 0 ? 0 : 30000;

  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    if (promoCode.trim().toUpperCase() === "NOVA15") {
      const discount = Math.round(subtotal * 0.15);
      setAppliedDiscount(discount);
      setPromoSuccess("Đã áp dụng voucher giảm 15%!");
    } else if (promoCode.trim()) {
      setPromoError("Mã giảm giá không hợp lệ");
      setAppliedDiscount(0);
    }
  };

  const total = subtotal + shippingFee - appliedDiscount;

  return (
    <Card className="bg-white border border-outline-variant/30 rounded-xxl shadow-sm p-5 sm:p-6">
      <h3 className="font-headline text-base font-bold text-on-surface mb-4">
        Chi tiết đơn hàng
      </h3>

      <CardContent className="p-0 flex flex-col gap-3 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-on-surface-variant">
          <span>Tạm tính</span>
          <span className="font-semibold text-on-surface">
            {subtotal.toLocaleString("vi-VN")}đ
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center text-on-surface-variant">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-on-surface">
            {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}
          </span>
        </div>

        {/* Discount */}
        {appliedDiscount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 font-medium">
            <span>Giảm giá (Voucher)</span>
            <span>-{appliedDiscount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}

        <Separator className="my-2 bg-outline-variant/40" />

        {/* Total */}
        <div className="flex justify-between items-center text-base">
          <span className="font-headline font-bold text-on-surface">Tổng cộng</span>
          <span className="font-headline font-extrabold text-lg text-primary">
            {total.toLocaleString("vi-VN")}đ
          </span>
        </div>

        {/* Free shipping progress */}
        {subtotal > 0 && subtotal < 200000 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 mt-2 font-medium">
            Mua thêm {(200000 - subtotal).toLocaleString("vi-VN")}đ để được Miễn phí vận chuyển!
          </div>
        )}

        <Separator className="my-2 bg-outline-variant/40" />

        {/* Voucher input */}
        {subtotal > 0 && (
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập mã voucher (Thử: NOVA15)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="h-10 text-xs border-outline-variant focus-visible:ring-primary rounded-lg bg-surface-bright"
              />
              <Button
                variant="outline"
                onClick={handleApplyPromo}
                className="h-10 px-4 text-xs font-semibold uppercase tracking-wider rounded-lg text-on-surface border-outline-variant hover:bg-surface-container-low"
              >
                Áp dụng
              </Button>
            </div>
            {promoError && <span className="text-[11px] text-destructive font-medium">{promoError}</span>}
            {promoSuccess && <span className="text-[11px] text-emerald-600 font-medium">{promoSuccess}</span>}
          </div>
        )}

        {/* Checkout CTA */}
        {checkoutAction && <div className="mt-4">{checkoutAction}</div>}
      </CardContent>
    </Card>
  );
};
