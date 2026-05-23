"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

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
  const canSlide = products.length > 2;

  const scrollByPage = (direction: "prev" | "next") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const distance = Math.max(280, Math.floor(scroller.clientWidth * 0.85));
    scroller.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  if (products.length === 0) {
    return (
      <section className="py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-headline text-xl font-black uppercase tracking-tight text-on-surface md:text-2xl">
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
    <section className="py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-xl font-black uppercase tracking-tight text-on-surface md:text-2xl">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm font-medium text-on-surface-variant">
              {description}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="hidden text-sm font-bold text-primary hover:underline sm:inline-flex"
          >
            Xem tất cả
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {canSlide && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Xem sản phẩm trước trong ${title}`}
            onClick={() => scrollByPage("prev")}
            className="shrink-0 size-10 rounded-full bg-black text-white hover:bg-gray-800  border-0"
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}

        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-6 flex-1"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[74%] snap-start sm:min-w-[42%] lg:min-w-[29%] xl:min-w-[23%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {canSlide && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Xem sản phẩm tiếp theo trong ${title}`}
            onClick={() => scrollByPage("next")}
            className="shrink-0 size-10 rounded-full bg-black text-white hover:bg-gray-800 shadow-md border-0"
          >
            <ChevronRight className="size-5" />
          </Button>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="mt-5 inline-flex text-sm font-bold text-primary hover:underline sm:hidden"
        >
          Xem tất cả
        </Link>
      )}
    </section>
  );
}
