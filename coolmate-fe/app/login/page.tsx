"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthModal } from "@/components/layout/auth-modal";

export default function LoginPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) router.push("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none select-none blur-[2px]">
        <Header />
        <main className="min-h-[calc(100vh-120px)]">
          <section className="relative min-h-[620px] overflow-hidden bg-on-surface">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-primary/35" />
            <div className="relative z-10 mx-auto flex min-h-[620px] max-w-container-max items-center px-gutter-mobile md:px-gutter-desktop">
              <div className="max-w-xl text-white">
                <p className="font-headline text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                  NovaWear Member
                </p>
                <h1 className="mt-4 font-headline text-4xl font-black leading-tight md:text-6xl">
                  Mua nhanh hơn, ưu đãi rõ hơn
                </h1>
                <p className="mt-4 max-w-md text-sm font-medium text-white/80 md:text-base">
                  Đăng nhập để đồng bộ giỏ hàng, theo dõi đơn hàng và nhận ưu
                  đãi thành viên.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
      <AuthModal open={open} mode="login" onOpenChange={handleOpenChange} />
    </div>
  );
}
