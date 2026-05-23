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
    <footer className="bg-surface-container-low dark:bg-zinc-950 text-on-surface border-t border-outline-variant/40 w-full py-16 transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <span className="font-headline text-lg sm:text-xl font-black text-on-surface tracking-tight">
            NovaWear
          </span>
          <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
            Thương hiệu thời trang mang đến giải pháp mặc đẹp, thoải mái và tiện dụng cho cuộc sống năng động mỗi ngày.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
              aria-label="Facebook"
            >
              <svg className="size-5 fill-current text-on-surface-variant" viewBox="0 0 24 24" width="24" height="24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
              aria-label="Instagram"
            >
              <svg className="size-5 fill-none stroke-current text-on-surface-variant" viewBox="0 0 24 24" width="24" height="24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
              aria-label="Youtube"
            >
              <svg className="size-5 fill-none stroke-current text-on-surface-variant" viewBox="0 0 24 24" width="24" height="24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.54a29 29 0 0 0 .46 5.12 2.78 2.78 0 0 0 1.95 1.96C5.12 19.08 12 19.08 12 19.08s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.12 29 29 0 0 0-.46-5.12z" />
                <polygon points="9.75 15.02 15.5 11.54 9.75 8.06 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-on-surface">
            Về NovaWear
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
            <Link href="#" className="hover:text-primary transition-colors">
              Về chúng tôi
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Hệ thống cửa hàng
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Tuyển dụng
            </Link>
          </div>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-on-surface">
            Hỗ trợ khách hàng
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
            <Link href="#" className="hover:text-primary transition-colors">
              Chính sách đổi trả 60 ngày
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-on-surface">
            Đăng ký nhận tin
          </h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
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
                className="h-10 text-xs bg-white border-outline-variant rounded-lg"
                required
              />
              <Button
                type="submit"
                className="bg-on-surface text-on-primary hover:bg-on-surface-variant rounded-lg h-10 px-4 cursor-pointer"
              >
                <Mail className="size-4" />
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-outline-variant/30 max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant font-medium">
        <p>© 2026 NovaWear. All rights reserved. Designed in Vietnam.</p>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-3xl">payments</span>
          <span className="material-symbols-outlined text-3xl">credit_card</span>
        </div>
      </div>
    </footer>
  );
};
