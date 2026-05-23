"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { CartDrawer } from "./CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
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
} from "lucide-react";

export const Header = () => {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Nam", href: "/products?category=ao-thun" },
    { label: "Nữ", href: "/products?category=ao-polo" },
    { label: "Sản phẩm mới", href: "/products?filter=new" },
    { label: "Bộ sưu tập", href: "/products?filter=collection" },
    { label: "Sale", href: "/products?filter=sale", isSale: true },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-on-surface text-on-primary py-2 px-4 text-center font-headline text-[10px] sm:text-xs font-semibold tracking-wide w-full z-[60] relative transition-all duration-300">
        <p className="animate-pulse">
          Đăng ký thành viên mới nhận ngay Voucher giảm 15% | Đổi trả 60 ngày dễ dàng
        </p>
      </div>

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
                  <Button variant="ghost" size="icon" className="text-on-surface cursor-pointer" />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="bg-white p-6 flex flex-col gap-4">
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
                  <Link
                    href="/novaclub"
                    className="font-headline text-xs font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-2 px-3 py-2"
                  >
                    <Sparkles className="size-4" /> NovaClub
                  </Link>
                  <Link
                    href="/admin/products"
                    className="font-headline text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 px-3 py-2"
                  >
                    <LayoutDashboard className="size-4" /> Admin Console
                  </Link>
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
                  pathname === "/products" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Tất cả
              </Link>
            </li>
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
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
                  <Button variant="ghost" size="icon" className="text-on-surface-variant hover:text-primary cursor-pointer" />
                }
              >
                <User className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-outline-variant shadow-lg rounded-xl">
                <DropdownMenuLabel className="font-headline text-xs uppercase tracking-wider text-on-surface-variant">
                  Tài khoản của tôi
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-outline-variant/40" />
                <DropdownMenuItem className="hover:bg-surface-container rounded-lg cursor-pointer">
                  <Link href="/novaclub" className="w-full flex items-center gap-2 font-headline text-xs font-bold uppercase text-amber-600">
                    <Sparkles className="size-4" /> NovaClub Member
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-surface-container rounded-lg cursor-pointer">
                  <Link href="/admin/products" className="w-full flex items-center gap-2 font-medium text-xs">
                    <LayoutDashboard className="size-4" /> Quản lý sản phẩm
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-surface-container rounded-lg cursor-pointer">
                  <Link href="/admin/orders" className="w-full flex items-center gap-2 font-medium text-xs">
                    <LayoutDashboard className="size-4" /> Quản lý đơn hàng
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-outline-variant/40" />
                <DropdownMenuItem className="hover:bg-surface-container rounded-lg cursor-pointer text-destructive font-medium text-xs">
                  <span className="flex items-center gap-2 w-full">
                    <LogOut className="size-4" /> Đăng xuất
                  </span>
                </DropdownMenuItem>
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
          </div>
        </div>
      </nav>

      {/* Spacer for fixed Header */}
      <div className={`w-full ${isScrolled ? "h-16" : "h-18"}`} />
    </>
  );
};
