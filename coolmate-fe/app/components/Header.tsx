"use client";

import React, { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartDrawer } from "./CartDrawer";
import { AuthModal, AuthMode } from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  Sparkles,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  ArrowRight,
} from "lucide-react";

export const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, cartCount, isLoading: cartLoading } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authModalKey, setAuthModalKey] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Nam", href: "/products?gender=nam" },
    { label: "Nữ", href: "/products?gender=nu" },
    { label: "Sản phẩm mới", href: "/products?filter=new" },
    { label: "Bộ sưu tập", href: "/products?filter=collection" },
    { label: "Sale", href: "/products?filter=sale", isSale: true },
  ];
  const currentQuery = searchParams.toString();
  const currentHref = `${pathname}${currentQuery ? `?${currentQuery}` : ""}`;

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  const openAuthModal = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setAuthModalKey((current) => current + 1);
    setAuthModalOpen(true);
  }, []);

  useEffect(() => {
    const handleOpenAuth = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: AuthMode }>).detail;
      openAuthModal(detail?.mode ?? "login");
    };

    window.addEventListener("novawear:open-auth", handleOpenAuth);
    return () => window.removeEventListener("novawear:open-auth", handleOpenAuth);
  }, [openAuthModal]);

  return (
    <>
      {/* Announcement Bar */}

      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-outline-variant/20 pt-0 h-16"
            : "bg-white border-b border-outline-variant/10 pt-2 h-18"
        } flex items-center`}
        style={{
          transform: `translateY(${isScrolled ? "0" : "36px"})`,
        }}
      >
        <div className="flex justify-between items-center w-full px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto">
          {/* Mobile Menu & Search Icon (Left) */}
          <div className="flex items-center gap-1 md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-on-surface cursor-pointer"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-white p-6 flex flex-col gap-4"
              >
                <SheetTitle className="font-headline text-lg font-bold text-primary mb-2">
                  NovaWear
                </SheetTitle>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/products"
                    className="font-headline text-sm font-semibold text-on-surface px-3 py-2 rounded-lg hover:bg-surface-container transition-all"
                  >
                    Tất cả sản phẩm
                  </Link>
                  {navLinks.map((link) => {
                    const isSale = "isSale" in link && link.isSale;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`font-sans text-sm font-medium px-3 py-2 rounded-lg hover:bg-surface-container transition-all ${
                          isSale ? "text-tertiary" : "text-on-surface-variant"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
                <DropdownMenuSeparator className="bg-outline-variant/40 my-2" />
                <div className="flex flex-col gap-1">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        href="/login"
                        onClick={(event) => {
                          event.preventDefault();
                          openAuthModal("login");
                        }}
                        className="font-headline text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 px-3 py-2"
                      >
                        <LogIn className="size-4" /> Đăng nhập
                      </Link>
                      <Link
                        href="/register"
                        onClick={(event) => {
                          event.preventDefault();
                          openAuthModal("register");
                        }}
                        className="font-headline text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2 px-3 py-2"
                      >
                        <UserPlus className="size-4" /> Đăng ký
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/orders"
                        className="font-headline text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 px-3 py-2"
                      >
                        <Sparkles className="size-4" /> Đơn hàng của tôi
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin/products"
                          className="font-headline text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 px-3 py-2"
                        >
                          <LayoutDashboard className="size-4" /> Admin Console
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="font-headline text-xs font-semibold uppercase tracking-wider text-destructive flex items-center gap-2 px-3 py-2 text-left"
                      >
                        <LogOut className="size-4" /> Đăng xuất
                      </button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Brand Logo */}
          <Link
            href="/"
            className="font-headline text-lg sm:text-xl md:text-2xl font-black tracking-tight text-on-surface hover:opacity-90 transition-all flex-shrink-0"
          >
            NovaWear
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 h-full">
            <li>
              <Link
                href="/products"
                className={`font-headline text-xs font-bold uppercase tracking-wider transition-colors py-5 block ${
                  pathname === "/products"
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Tất cả
              </Link>
            </li>
            {navLinks.map((link) => {
              const isActive = currentHref === link.href;
              const isSale = "isSale" in link && link.isSale;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-headline text-xs font-bold uppercase tracking-wider transition-colors py-5 block ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : isSale
                          ? "text-tertiary hover:text-tertiary-container font-black"
                          : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Icon Actions */}
          <div className="flex items-center gap-2">
            {/* Search Input (Desktop) */}
            <div className="hidden lg:flex items-center border border-outline-variant/60 rounded-full bg-surface-bright px-3 py-1.5 w-48 focus-within:w-60 transition-all duration-300 focus-within:border-primary">
              <Search className="size-4 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs ml-2 text-on-surface w-full"
              />
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (!isAuthenticated) openAuthModal("login");
                    }}
                    className="text-on-surface-variant hover:text-primary cursor-pointer"
                  />
                }
              >
                <User className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border border-outline-variant shadow-lg rounded-xl"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-headline text-xs uppercase tracking-wider text-on-surface-variant">
                    {isAuthenticated
                      ? user?.name || "Tài khoản của tôi"
                      : "Tài khoản"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-outline-variant/40" />
                  {!isAuthenticated ? (
                    <>
                      <DropdownMenuItem className="hover:bg-surface-container rounded-lg cursor-pointer">
                        <Link
                          href="/login"
                          onClick={(event) => {
                            event.preventDefault();
                            openAuthModal("login");
                          }}
                          className="w-full flex items-center gap-2 font-medium text-xs"
                        >
                          <LogIn className="size-4" /> Đăng nhập
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-surface-container rounded-lg cursor-pointer">
                        <Link
                          href="/register"
                          onClick={(event) => {
                            event.preventDefault();
                            openAuthModal("register");
                          }}
                          className="w-full flex items-center gap-2 font-medium text-xs"
                        >
                          <UserPlus className="size-4" /> Đăng ký
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="hover:bg-surface-container rounded-lg cursor-pointer">
                        <Link
                          href="/orders"
                          className="w-full flex items-center gap-2 font-medium text-xs"
                        >
                          <Sparkles className="size-4" /> Đơn hàng của tôi
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuItem className="hover:bg-surface-container rounded-lg cursor-pointer">
                            <Link
                              href="/admin/products"
                              className="w-full flex items-center gap-2 font-medium text-xs"
                            >
                              <LayoutDashboard className="size-4" /> Quản lý sản
                              phẩm
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-surface-container rounded-lg cursor-pointer">
                            <Link
                              href="/admin/orders"
                              className="w-full flex items-center gap-2 font-medium text-xs"
                            >
                              <LayoutDashboard className="size-4" /> Quản lý đơn
                              hàng
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator className="bg-outline-variant/40" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="hover:bg-surface-container rounded-lg cursor-pointer text-destructive font-medium text-xs"
                      >
                        <span className="flex items-center gap-2 w-full">
                          <LogOut className="size-4" /> Đăng xuất
                        </span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="text-on-surface-variant hover:text-primary relative cursor-pointer"
            >
              <Heart className="size-5" />
            </Button>

            {/* Cart with Badge */}
            <div className="group relative">
              <CartDrawer
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-on-surface-variant hover:text-primary relative cursor-pointer"
                  >
                    <ShoppingBag className="size-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1.5 -right-1.5 bg-primary-container text-white size-5 flex items-center justify-center p-0 text-[10px] font-bold rounded-full border-2 border-white">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                }
              />
              <div className="pointer-events-none absolute right-0 top-full z-[80] hidden pt-3 md:group-hover:block md:group-focus-within:block">
                <div className="pointer-events-auto w-[500px] rounded-xl border border-outline-variant/50 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
                  {cartLoading ? (
                    <div className="flex items-center justify-center py-10 text-sm font-semibold text-on-surface-variant">
                      Đang cập nhật giỏ hàng...
                    </div>
                  ) : cart.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <ShoppingBag className="mb-3 size-8 text-outline" />
                      <p className="font-headline text-sm font-bold text-on-surface">Giỏ hàng đang trống</p>
                      <p className="mt-1 text-xs text-on-surface-variant">Thêm sản phẩm để xem nhanh tại đây.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-on-surface-variant">
                          Tạm tính:{" "}
                          <span className="font-headline text-lg font-black text-black">
                            {cart.total.toLocaleString("vi-VN")}đ
                          </span>{" "}
                          <span className="font-semibold">({cartCount} sản phẩm)</span>
                        </p>
                        <Link href="/cart" className="text-sm font-bold text-primary hover:underline">
                          Xem tất cả
                        </Link>
                      </div>
                      <div className="flex flex-col gap-4">
                        {cart.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 font-headline text-sm font-bold text-black">
                                {item.product.name}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-on-surface-variant">
                                {item.selectedColor} / {item.selectedSize}
                              </p>
                              <p className="mt-3 font-headline text-base font-black text-black">
                                {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
                              </p>
                              <p className="mt-1 text-xs font-semibold text-on-surface-variant">x{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link href="/checkout" className="mt-5 block">
                        <Button className="h-11 w-full rounded-lg bg-black font-headline text-sm font-black uppercase text-white hover:bg-primary">
                          Thanh toán <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="bg-on-surface text-on-tertiary py-2 px-4 text-center font-headline text-[10px] sm:text-xs font-semibold tracking-wide w-full z-[10] relative transition-all duration-300">
        <p className="animate-pulse">
          Đăng ký thành viên mới nhận ngay Voucher giảm 15% | Đổi trả 60 ngày dễ
          dàng
        </p>
      </div>

      {/* Spacer for fixed Header */}
      <div className={`w-full ${isScrolled ? "h-16" : "h-18"}`} />
      <AuthModal
        key={`${authMode}-${authModalKey}`}
        open={authModalOpen}
        mode={authMode}
        onOpenChange={setAuthModalOpen}
      />
    </>
  );
};
