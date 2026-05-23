"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  Trophy, 
  Gift, 
  BadgePercent, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Wallet, 
  Ticket, 
  Award,
  LogOut,
  UserCheck
} from "lucide-react";

export default function NovaClubPage() {
  // Login State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  // Simulated User Info
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOtpMode) {
      if (!identifier) {
        alert("Vui lòng nhập số điện thoại");
        return;
      }
      if (!otpSent) {
        setOtpSent(true);
        alert("Mã OTP đã được gửi đến số điện thoại của bạn (Mã giả lập: 123456)");
        return;
      }
      if (otpCode === "123456" || otpCode === "1234") {
        setIsLoggedIn(true);
        setUserEmail(identifier);
      } else {
        alert("Mã OTP không chính xác. Vui lòng nhập 123456 để thử.");
      }
    } else {
      if (!identifier || !password) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }
      setIsLoggedIn(true);
      setUserEmail(identifier);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIdentifier("");
    setPassword("");
    setOtpCode("");
    setOtpSent(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-16 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Transactional Area (Login or User Dashboard) */}
          <section className="w-full lg:w-5/12 flex flex-col justify-center">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-8 md:p-10">
              
              {!isLoggedIn ? (
                <>
                  <div className="mb-8">
                    <h1 className="font-headline text-2xl font-black text-on-surface uppercase tracking-tight mb-2">
                      Đăng nhập
                    </h1>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Truy cập NovaClub để quản lý hạng thẻ và ưu đãi của bạn.
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    {/* Identifier Input */}
                    <div className="space-y-2">
                      <Label htmlFor="identifier" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        {isOtpMode ? "Số điện thoại nhận mã" : "Email hoặc Số điện thoại"}
                      </Label>
                      <Input
                        id="identifier"
                        type={isOtpMode ? "tel" : "text"}
                        placeholder={isOtpMode ? "Nhập số điện thoại của bạn" : "Nhập email hoặc số điện thoại"}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="h-12 border-outline-variant bg-surface-bright focus-visible:ring-primary rounded-lg text-sm"
                        required
                      />
                    </div>

                    {/* Password Input / OTP code input */}
                    {!isOtpMode ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Mật khẩu
                          </Label>
                          <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-bold text-primary hover:underline">
                            Quên mật khẩu?
                          </a>
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu của bạn"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 pr-10 border-outline-variant bg-surface-bright focus-visible:ring-primary rounded-lg text-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </div>
                    ) : (
                      otpSent && (
                        <div className="space-y-2">
                          <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Mã xác thực OTP
                          </Label>
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Nhập mã OTP 6 số (dùng 123456)"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="h-12 border-outline-variant bg-surface-bright focus-visible:ring-primary rounded-lg text-sm"
                            required
                          />
                        </div>
                      )
                    )}

                    {/* Action buttons */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary-container rounded-lg font-headline text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        {isOtpMode ? (otpSent ? "Xác nhận & Đăng nhập" : "Nhận mã OTP") : "Đăng nhập"}
                      </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-outline-variant/30"></div>
                      <span className="flex-shrink-0 mx-4 text-on-surface-variant font-semibold text-xs">
                        Hoặc
                      </span>
                      <div className="flex-grow border-t border-outline-variant/30"></div>
                    </div>

                    {/* Switch Login Method */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsOtpMode(!isOtpMode);
                        setOtpSent(false);
                      }}
                      className="w-full h-12 border-on-surface hover:bg-surface-container-low text-on-surface rounded-lg font-semibold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      {isOtpMode ? "Đăng nhập bằng Mật khẩu" : "Đăng nhập bằng mã OTP SMS"}
                    </Button>
                  </form>

                  <div className="mt-8 text-center text-xs text-on-surface-variant font-medium">
                    Chưa có tài khoản?{" "}
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-primary font-bold hover:underline">
                      Đăng ký ngay
                    </a>
                  </div>
                </>
              ) : (
                /* Successful simulated login dashboard state */
                <div className="text-center py-6 flex flex-col items-center gap-6">
                  <div className="w-16 h-16 bg-primary-container/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
                    <UserCheck className="size-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-headline text-xl font-black text-on-surface uppercase mb-1">
                      Chào mừng trở lại!
                    </h2>
                    <p className="text-xs font-semibold text-on-surface-variant truncate max-w-xs px-2">
                      {userEmail}
                    </p>
                  </div>

                  <div className="w-full bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 text-left space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-outline-variant/40">
                      <span className="text-xs font-semibold text-on-surface-variant">Hạng thẻ hiện tại:</span>
                      <span className="bg-primary text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
                        Nova Silver
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-on-surface-variant">Tích luỹ chi tiêu:</span>
                      <span className="font-bold text-on-surface">3.200.000đ</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-on-surface-variant">Điểm N-Coin khả dụng:</span>
                      <span className="font-bold text-primary">160 N-Coin (~80.000đ)</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <Link href="/products" className="w-full">
                      <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary-container font-headline text-xs font-bold uppercase tracking-wider rounded-lg">
                        Khám phá cửa hàng
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full h-12 border-destructive/40 text-destructive hover:bg-destructive/5 font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
                    >
                      <LogOut className="size-4" /> Đăng xuất
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Destination Canvas (NovaClub Context) */}
          <section className="w-full lg:w-7/12 flex flex-col pt-8 lg:pt-0">
            {/* Hero Context Card */}
            <div 
              className="relative rounded-2xl overflow-hidden mb-8 h-[240px] md:h-[300px] flex items-center p-8 md:p-12 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80')`,
              }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-on-surface/85 to-on-surface/30"></div>
              <div className="relative z-10 text-white max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/20 backdrop-blur text-primary-fixed-dim text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    NovaClub VIP
                  </span>
                </div>
                <h2 className="font-display-lg text-2xl md:text-3xl text-white mb-3 uppercase leading-tight font-black">
                  Gia nhập NovaClub
                </h2>
                <p className="text-sm text-white/90 leading-relaxed font-medium">
                  Mở khóa các đặc quyền độc quyền, tích điểm mỗi lần mua sắm và thăng hạng để nhận những phần quà giới hạn và dịch vụ chăm sóc VIP.
                </p>
              </div>
            </div>

            {/* Bento Grid: Tiers & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tiers Visualization (Spans full width) */}
              <div className="md:col-span-2 bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/30">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="font-headline text-base font-bold text-on-surface mb-1">
                      Hệ thống Hạng thẻ
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium">
                      Tích luỹ chi tiêu mua sắm để thăng hạng cao hơn
                    </p>
                  </div>
                </div>

                {/* Progress Bar UI */}
                <div className="relative w-full h-2 bg-surface-container-high rounded-full my-8">
                  <div className="absolute top-0 left-0 h-full w-[35%] bg-primary rounded-full"></div>
                  {/* Markers */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center justify-between w-full px-1">
                    {/* New */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-white z-10"></div>
                      <span className="absolute top-5 font-bold text-[10px] text-on-surface">New</span>
                    </div>
                    {/* Silver */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-white z-10"></div>
                      <span className="absolute top-5 font-bold text-[10px] text-on-surface">Silver</span>
                    </div>
                    {/* Gold */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-surface-container-high ring-4 ring-white z-10"></div>
                      <span className="absolute top-5 font-medium text-[10px] text-on-surface-variant">Gold</span>
                    </div>
                    {/* Diamond */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-surface-container-high ring-4 ring-white z-10"></div>
                      <span className="absolute top-5 font-medium text-[10px] text-on-surface-variant">Diamond</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 1: Cashback */}
              <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex flex-col justify-between aspect-square md:aspect-auto">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center mb-6 shadow-sm text-primary">
                  <Wallet className="size-5" />
                </div>
                <div>
                  <h4 className="font-headline text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">
                    Hoàn tiền lên đến 5%
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                    Tích luỹ N-Coin cho mọi đơn hàng. Sử dụng trực tiếp để cấn trừ thanh toán các lần sau.
                  </p>
                </div>
              </div>

              {/* Benefit 2 & 3 Stacked */}
              <div className="flex flex-col gap-4">
                {/* Voucher */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex items-start gap-4 flex-grow">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center text-primary">
                    <Ticket className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="font-headline text-xs font-bold text-on-surface mb-1 uppercase tracking-wide">
                      Voucher độc quyền
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                      Nhận mã giảm giá định kỳ dành riêng cho thành viên mỗi tháng.
                    </p>
                  </div>
                </div>

                {/* Gift */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex items-start gap-4 flex-grow">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center text-primary">
                    <Gift className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="font-headline text-xs font-bold text-on-surface mb-1 uppercase tracking-wide">
                      Quà tặng sinh nhật
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                      Quà tặng bất ngờ và voucher chiết khấu cao từ NovaWear trong tháng sinh nhật của bạn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
