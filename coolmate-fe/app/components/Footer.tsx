"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-zinc-950 text-white w-full py-16">
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <span className="font-headline text-lg sm:text-xl font-black text-white tracking-tight">
            NovaWear
          </span>
          <p className="text-sm text-white/70 max-w-xs leading-relaxed">
            Thương hiệu thời trang mang đến giải pháp mặc đẹp, thoải mái và tiện
            dụng cho cuộc sống năng động mỗi ngày.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <img
                src="https://cdn.simpleicons.org/facebook/0866FF"
                alt="Facebook"
                width="20"
                height="20"
                className="size-5"
              />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <img
                src="https://cdn.simpleicons.org/instagram/FF0069"
                alt="Instagram"
                width="20"
                height="20"
                className="size-5"
              />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Youtube"
            >
              <img
                src="https://cdn.simpleicons.org/youtube/FF0000"
                alt="YouTube"
                width="20"
                height="20"
                className="size-5"
              />
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-white">
            Về NovaWear
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/70">
            <Link href="#" className="hover:text-white transition-colors">
              Về chúng tôi
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Hệ thống cửa hàng
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Tuyển dụng
            </Link>
          </div>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-white">
            Hỗ trợ khách hàng
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/70">
            <Link href="#" className="hover:text-white transition-colors">
              Chính sách đổi trả 60 ngày
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-white">
            Đăng ký nhận tin
          </h4>
          <p className="text-sm text-white/70 leading-relaxed">
            Nhận thông tin sản phẩm mới và khuyến mãi đặc quyền sớm nhất.
          </p>

          {subscribed ? (
            <div className="bg-emerald-50 text-emerald-800 text-xs font-medium p-3 rounded-lg border border-emerald-200">
              Đăng ký thành công! Cảm ơn bạn đã tham gia.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                placeholder="Email của bạn..."
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-xs bg-white border-2 border-outline rounded-lg focus:border-primary focus:ring-0"
                required
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-container text-primary-foreground rounded-lg h-10 px-4 font-semibold cursor-pointer transition-colors"
              >
                <Mail className="size-4" />
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10 max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60 font-medium">
        <p>© 2026 NovaWear. All rights reserved. Designed in Vietnam.</p>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-3xl">payments</span>
          <span className="material-symbols-outlined text-3xl">
            credit_card
          </span>
        </div>
      </div>
    </footer>
  );
};
