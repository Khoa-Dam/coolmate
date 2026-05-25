"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Gift, Percent, QrCode, Ticket, Wallet, X } from "lucide-react";
import { toast } from "sonner";

export type AuthMode = "login" | "register";

type AuthModalProps = {
  open: boolean;
  mode?: AuthMode;
  onOpenChange: (open: boolean) => void;
};

export function AuthModal({ open, mode = "login", onOpenChange }: AuthModalProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [activeMode, setActiveMode] = useState<AuthMode>(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const isRegister = activeMode === "register";

  const validateForm = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isRegister && trimmedName.length < 2) return "Vui lòng nhập họ tên tối thiểu 2 ký tự";
    if (!trimmedEmail) return "Vui lòng nhập email";
    if (!emailPattern.test(trimmedEmail)) return "Email không đúng định dạng";
    if (password.length < 6) return "Mật khẩu phải có tối thiểu 6 ký tự";
    return "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register({ name: name.trim(), email: email.trim(), password });
        toast.success("Đăng ký thành công");
      } else {
        await login({ email: email.trim(), password });
        toast.success("Đăng nhập thành công");
      }
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : isRegister ? "Đăng ký thất bại" : "Đăng nhập thất bại";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setActiveMode(nextMode);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/65 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-xl rounded-2xl bg-white px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-7 sm:py-5"
      >
        <button
          type="button"
          aria-label="Đóng"
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border-2 border-white bg-black text-white shadow-lg transition hover:bg-on-surface-variant sm:-right-3 sm:-top-3 sm:size-10"
        >
          <X className="size-5" />
        </button>

        <div className="mb-2 pr-10 sm:mb-4 sm:pr-0">
          <div className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 font-headline text-base font-black uppercase leading-none text-white sm:text-lg">
            Nova<span className="rounded bg-white px-1 text-primary">Club</span>
          </div>
          <h2 id="auth-modal-title" className="mt-2 font-headline text-lg font-black leading-tight text-black sm:mt-4 sm:text-[28px]">
            Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn
          </h2>
          <p className="mt-1 text-xs font-semibold text-on-surface sm:mt-3 sm:text-sm">
            Quyền lợi dành riêng cho bạn khi tham gia NovaClub
          </p>
        </div>

        <div className="mb-3 grid grid-cols-3 gap-2 sm:mb-4">
          {[
            { icon: Percent, label: "Voucher ưu đãi" },
            { icon: Gift, label: "Quà tặng độc quyền" },
            { icon: Wallet, label: "Hoàn tiền CoolCash" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg border border-outline-variant bg-white px-2 py-2 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] sm:flex-row sm:justify-start sm:gap-2 sm:px-3 sm:text-left"
            >
              <Icon className="size-4 shrink-0 text-black" />
              <span className="font-headline text-[10px] font-black leading-tight text-black sm:text-xs sm:leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-xs font-black text-black sm:text-sm">
            {isRegister ? "Đăng ký tài khoản miễn phí" : "Đăng nhập hoặc đăng ký miễn phí"}
          </p>

          <div className="flex items-center gap-3">
            <button type="button" aria-label="Google" className="flex size-9 items-center justify-center rounded-lg border border-primary bg-white font-headline text-lg font-black text-primary transition hover:bg-surface-container-low sm:size-10 sm:text-xl">
              G
            </button>
            <button type="button" aria-label="Facebook" className="flex size-9 items-center justify-center rounded-lg border border-primary bg-white font-headline text-lg font-black text-primary transition hover:bg-surface-container-low sm:size-10 sm:text-xl">
              f
            </button>
            <button type="button" aria-label="QR" className="flex size-9 items-center justify-center rounded-lg border border-primary bg-white text-primary transition hover:bg-surface-container-low sm:size-10">
              <QrCode className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-outline-variant" />
            <span className="text-xs font-semibold text-black">Hoặc</span>
            <span className="h-px flex-1 bg-outline-variant" />
          </div>

          {error && (
            <div className="rounded-lg border border-error-container bg-error-container px-4 py-3 text-sm font-semibold text-on-error-container">
              {error}
            </div>
          )}

          {isRegister && (
            <Input
              type="text"
              autoComplete="name"
              placeholder="Họ tên"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="h-12 rounded-full border-outline-variant bg-white px-6 text-sm font-semibold text-black placeholder:text-outline focus:border-black"
            />
          )}

          <Input
            type="email"
            autoComplete="email"
            placeholder="Email của bạn"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-12 rounded-full border-outline-variant bg-white px-6 text-sm font-semibold text-black placeholder:text-outline focus:border-black"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="Mật khẩu"
              minLength={isRegister ? 6 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-12 rounded-full border-outline-variant bg-white px-6 pr-12 text-sm font-semibold text-black placeholder:text-outline focus:border-black"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-full bg-black font-headline text-sm font-black uppercase text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Đang xử lý..." : isRegister ? "Đăng ký" : "Đăng nhập"}
          </Button>

          <div className="flex flex-col gap-2 pt-1 text-sm font-black sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {isRegister ? (
              <button type="button" onClick={() => switchMode("login")} className="text-left text-primary hover:underline">
                Đã có tài khoản? Đăng nhập
              </button>
            ) : (
              <button type="button" onClick={() => switchMode("register")} className="text-left text-primary hover:underline">
                Đăng ký tài khoản mới
              </button>
            )}
            <Link href="/login" className="text-primary hover:underline">
              Quên mật khẩu
            </Link>
          </div>
        </form>

        <div className="mt-4 hidden items-center gap-2 text-xs font-semibold text-on-surface-variant sm:flex">
          <Ticket className="size-4" />
          <span>Giỏ hàng và đơn hàng của bạn sẽ được đồng bộ sau khi đăng nhập.</span>
        </div>
      </section>
    </div>
  );
}
