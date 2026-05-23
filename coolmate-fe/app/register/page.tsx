"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AuthModal } from "../components/AuthModal";

export default function RegisterPage() {
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
          </section>
        </main>
        <Footer />
      </div>
      <AuthModal open={open} mode="register" onOpenChange={handleOpenChange} />
    </div>
  );
}
