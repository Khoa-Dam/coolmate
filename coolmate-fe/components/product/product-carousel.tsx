"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ProductCard } from "./product-card";

type ProductCarouselProps = {
  title: string;
  description?: string;
  products: Product[];
  href?: string;
};

export function ProductCarousel({
  title,
  description,
  products,
  href,
}: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [scrollState, setScrollState] = useState({
    canScrollPrev: false,
    canScrollNext: false,
    progress: 0,
  });

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const progress = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 1;

    setScrollState({
      canScrollPrev: scroller.scrollLeft > 4,
      canScrollNext: scroller.scrollLeft < maxScroll - 4,
      progress: Math.min(1, Math.max(0, progress)),
    });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateScrollState();

    const handleScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateScrollState();
      });
    };

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scroller);
    scroller.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", handleScroll);
    };
  }, [products.length, updateScrollState]);

  const scrollByPage = useCallback((direction: "prev" | "next") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const firstCard = scroller.querySelector<HTMLElement>(
      "[data-carousel-card]",
    );
    const cardStep = firstCard
      ? firstCard.offsetWidth + 24
      : Math.max(280, Math.floor(scroller.clientWidth * 0.85));
    const visibleCards = Math.max(1, Math.floor(scroller.clientWidth / cardStep));
    const distance = cardStep * visibleCards;

    scroller.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  }, []);

  const canSlide = products.length > 1;
  const progressWidth = `${Math.max(scrollState.progress, 0.08) * 100}%`;

  if (products.length === 0) {
    return (
      <section className="py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-headline text-xl font-black uppercase tracking-normal text-on-surface md:text-2xl">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm font-medium text-on-surface-variant">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low px-5 py-8 text-center text-sm font-semibold text-on-surface-variant">
          Chưa có sản phẩm trong mục này.
        </div>
      </section>
    );
  }

  return (
    <section className="py-10" aria-label={title}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline text-xl font-black uppercase tracking-normal text-on-surface md:text-2xl">
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-2xl text-sm font-medium text-on-surface-variant">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {href && (
            <Link
              href={href}
              className="hidden rounded-full border border-outline-variant/50 px-4 py-2 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary sm:inline-flex"
            >
              Xem tất cả
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-background to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-background to-transparent md:block" />
        {canSlide && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Xem sản phẩm trước trong ${title}`}
              disabled={!scrollState.canScrollPrev}
              onClick={() => scrollByPage("prev")}
              className="absolute left-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 rounded-full border-outline-variant/60 bg-white/95 text-on-surface shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-35 hover:bg-black hover:text-white md:inline-flex"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Xem sản phẩm tiếp theo trong ${title}`}
              disabled={!scrollState.canScrollNext}
              onClick={() => scrollByPage("next")}
              className="absolute right-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 rounded-full border-outline-variant/60 bg-white/95 text-on-surface shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-35 hover:bg-black hover:text-white md:inline-flex"
            >
              <ChevronRight className="size-5" />
            </Button>
          </>
        )}
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 md:gap-6"
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-carousel-card
              className="w-[72vw] shrink-0 snap-start sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-72px)/4)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <div
          className="h-1 flex-1 overflow-hidden rounded-full bg-outline-variant/30"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-on-surface transition-[width] duration-200"
            style={{ width: progressWidth }}
          />
        </div>

        {canSlide && (
          <div className="flex items-center gap-2 sm:hidden">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Xem sản phẩm trước trong ${title}`}
              disabled={!scrollState.canScrollPrev}
              onClick={() => scrollByPage("prev")}
              className="size-9 rounded-full border-outline-variant/60 bg-white text-on-surface disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Xem sản phẩm tiếp theo trong ${title}`}
              disabled={!scrollState.canScrollNext}
              onClick={() => scrollByPage("next")}
              className="size-9 rounded-full border-outline-variant/60 bg-white text-on-surface disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        {href && (
          <Link
            href={href}
            className="text-sm font-bold text-primary hover:underline sm:hidden"
          >
            Xem tất cả
          </Link>
        )}
      </div>
    </section>
  );
}
