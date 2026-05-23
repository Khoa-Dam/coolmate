"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Gift,
  Eye,
  EyeOff,
  Wallet,
  Ticket,
  LogOut,
  UserCheck,
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
        alert(
          "Mã OTP đã được gửi đến số điện thoại của bạn (Mã giả lập: 123456)",
        );
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
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-8 md:p-10">
              {!isLoggedIn ? (
                <>
                  <div className="mb-8">
                    <h1 className="font-headline-md text-headline-md text-on-tertiary mb-2">
                      Đăng nhập
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Truy cập NovaClub để quản lý hạng thẻ và ưu đãi của bạn.
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    {/* Identifier Input */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="identifier"
                        className="block font-label-sm text-label-sm text-on-surface"
                      >
                        {isOtpMode
                          ? "Số điện thoại nhận mã"
                          : "Email hoặc Số điện thoại"}
                      </Label>
                      <Input
                        id="identifier"
                        type={isOtpMode ? "tel" : "text"}
                        placeholder={
                          isOtpMode
                            ? "Nhập số điện thoại của bạn"
                            : "Nhập email hoặc số điện thoại"
                        }
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full h-12 px-4 bg-surface-bright border border-outline-variant rounded focus:border-on-surface focus:ring-0 font-body-md text-body-md text-on-surface transition-colors placeholder:text-outline"
                        required
                      />
                    </div>

                    {/* Password Input / OTP code input */}
                    {!isOtpMode ? (
                      <div className="space-y-2 relative">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="password"
                            className="block font-label-sm text-label-sm text-on-surface"
                          >
                            Mật khẩu
                          </Label>
                          <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="font-label-sm text-label-sm text-primary hover:underline"
                          >
                            Quên mật khẩu?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-12 px-4 bg-surface-bright border border-outline-variant rounded focus:border-on-surface focus:ring-0 font-body-md text-body-md text-on-surface transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-[34px] text-outline hover:text-on-surface cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    ) : (
                      otpSent && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="otp"
                            className="block font-label-sm text-label-sm text-on-surface"
                          >
                            Mã xác thực OTP
                          </Label>
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Nhập mã OTP 6 số (dùng 123456)"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full h-12 px-4 bg-surface-bright border border-outline-variant rounded focus:border-on-surface focus:ring-0 font-body-md text-body-md text-on-surface transition-colors"
                            required
                          />
                        </div>
                      )
                    )}

                    {/* Action buttons */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-14 bg-primary text-white hover:opacity-90 rounded font-headline-sm text-headline-sm transition-opacity shadow-[0_4px_20px_rgba(0,0,0,0.04)] cursor-pointer"
                      >
                        {isOtpMode
                          ? otpSent
                            ? "Xác nhận & Đăng nhập"
                            : "Nhận mã OTP"
                          : "Đăng nhập"}
                      </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center py-4">
                      <div className="flex-grow border-t border-outline-variant/30"></div>
                      <span className="flex-shrink-0 mx-4 text-on-surface-variant font-label-sm text-label-sm">
                        Hoặc đăng nhập với OTP
                      </span>
                      <div className="flex-grow border-t border-outline-variant/30"></div>
                    </div>

                    {/* Switch Login Method */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpMode(!isOtpMode);
                        setOtpSent(false);
                      }}
                      className="w-full h-14 bg-surface-container-lowest text-on-surface border border-on-surface rounded font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      {isOtpMode
                        ? "Đăng nhập bằng Mật khẩu"
                        : "Gửi mã OTP qua SMS"}
                    </button>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Chưa có tài khoản?{" "}
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="text-primary font-label-md text-label-md hover:underline"
                      >
                        Đăng ký ngay
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                /* Successful simulated login dashboard state */
                <div className="text-center py-6 flex flex-col items-center gap-6">
                  <div className="w-16 h-16 bg-primary-container/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
                    <UserCheck className="size-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface uppercase mb-1">
                      Chào mừng trở lại!
                    </h2>
                    <p className="text-xs font-semibold text-on-surface-variant truncate max-w-xs px-2">
                      {userEmail}
                    </p>
                  </div>

                  <div className="w-full bg-surface-container-low p-5 rounded-xl border border-outline-variant/20 text-left space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-outline-variant/40">
                      <span className="text-xs font-semibold text-on-surface-variant">
                        Hạng thẻ hiện tại:
                      </span>
                      <span className="bg-primary text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
                        Nova Silver
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-on-surface-variant">
                        Tích luỹ chi tiêu:
                      </span>
                      <span className="font-bold text-on-surface">
                        3.200.000đ
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-on-surface-variant">
                        Điểm N-Coin khả dụng:
                      </span>
                      <span className="font-bold text-primary">
                        160 N-Coin (~80.000đ)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <Link href="/products" className="w-full">
                      <Button className="w-full h-12 bg-primary text-white hover:bg-primary-container font-headline-sm text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer">
                        Khám phá cửa hàng
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full h-12 border-destructive/40 text-destructive hover:bg-destructive/5 font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer"
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
              className="relative rounded-xl overflow-hidden mb-12 h-[240px] md:h-[320px] flex items-center p-8 md:p-12 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKHmgZREfkWXO9Z4pDJGne922Nt43fpxQHEvx8GGoFLeG95cE-_h5AD2-n7YJPc2-7XrF5x8zRyEAmwi24UntYCAm7vhS-XzDR9KY_811br9PqL-xOUdf-rp94OcMgoLF78thhC84wCoV3L-EKoVqlfQfpFaA3yNU-BgDFoOi_As4jFsq62YkHowwlbymPEWB677J0iUwddOLAG-YKPnv3_9x0EXQsor06xQa4ST8WBfjId77OxY-KgSMWRgIVa_JrDCEnna9UkkA')`,
              }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-on-surface/80 to-transparent"></div>
              <div className="relative z-10 text-on-primary">
                <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4">
                  Gia nhập
                  <br />
                  NovaClub
                </h2>
                <p className="font-body-lg text-body-lg text-white/90 max-w-md">
                  Mở khóa các đặc quyền độc quyền, tích điểm mỗi lần mua sắm và
                  thăng hạng để nhận những phần quà giới hạn.
                </p>
              </div>
            </div>

            {/* Bento Grid: Tiers & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Tiers Visualization (Spans full width) */}
              <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm border border-outline-variant/10">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                      Hệ thống Hạng thẻ
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Tích luỹ chi tiêu để thăng hạng
                    </p>
                  </div>
                </div>

                {/* Progress Bar UI */}
                <div className="relative w-full h-2 bg-surface-container-high rounded-full mb-8">
                  <div className="absolute top-0 left-0 h-full w-[25%] bg-primary rounded-full"></div>
                  {/* Markers */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center justify-between w-full px-1">
                    {/* New */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-surface-container-lowest z-10"></div>
                      <span className="absolute top-6 font-label-sm text-label-sm text-on-surface">
                        New
                      </span>
                    </div>
                    {/* Silver */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-surface-container-high ring-4 ring-surface-container-lowest z-10"></div>
                      <span className="absolute top-6 font-label-sm text-label-sm text-on-surface-variant">
                        Silver
                      </span>
                    </div>
                    {/* Gold */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-surface-container-high ring-4 ring-surface-container-lowest z-10"></div>
                      <span className="absolute top-6 font-label-sm text-label-sm text-on-surface-variant">
                        Gold
                      </span>
                    </div>
                    {/* Diamond */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-surface-container-high ring-4 ring-surface-container-lowest z-10"></div>
                      <span className="absolute top-6 font-label-sm text-label-sm text-on-surface-variant">
                        Diamond
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 1: Cashback */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 flex flex-col justify-between aspect-square md:aspect-auto">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center mb-6 shadow-sm text-primary">
                  <Wallet className="size-5" />
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                    Hoàn tiền lên đến 5%
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Tích luỹ N-Coin cho mọi đơn hàng. Sử dụng trực tiếp để thanh
                    toán lần sau.
                  </p>
                </div>
              </div>

              {/* Benefit 2 & 3 Stacked */}
              <div className="flex flex-col gap-4 md:gap-6">
                {/* Voucher */}
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center text-on-surface">
                    <Ticket className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface mb-1">
                      Voucher độc quyền
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                      Nhận mã giảm giá dành riêng cho thành viên mỗi tháng.
                    </p>
                  </div>
                </div>

                {/* Gift */}
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex-shrink-0 flex items-center justify-center text-on-surface">
                    <Gift className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface mb-1">
                      Quà tặng sinh nhật
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                      Phần quà đặc biệt từ NovaWear trong tháng sinh nhật của
                      bạn.
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
