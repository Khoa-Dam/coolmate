"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OptimizedImage } from "@/components/product/optimized-image";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import { ColorSelector } from "./ColorSelector";
import { QuantitySelector } from "./QuantitySelector";
import { SizeSelector } from "./SizeSelector";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  RotateCcw,
  ShoppingCart,
  Star,
  Truck,
  ZoomIn,
} from "lucide-react";

type ProductDetailClientProps = {
  product: Product;
  relatedProducts: Product[];
};

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.imageUrl);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const discount =
    (product.originalPrice ?? product.price) > product.price
      ? Math.round(
          (((product.originalPrice ?? product.price) - product.price) /
            (product.originalPrice ?? product.price)) *
            100,
        )
      : 0;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl];

  const validateSelection = () => {
    setErrorMsg("");
    setFeedbackMsg("");

    if (!selectedSize) {
      setErrorMsg("Vui lòng chọn kích thước");
      return false;
    }

    if (!selectedColor) {
      setErrorMsg("Vui lòng chọn màu sắc");
      return false;
    }

    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;

    void addToCart(product, selectedSize, selectedColor, quantity);
    setFeedbackMsg("Đã thêm sản phẩm vào giỏ hàng.");
    window.setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    void addToCart(product, selectedSize, selectedColor, quantity);
    router.push("/checkout");
  };

  return (
    <main className="mx-auto min-h-[720px] w-full max-w-container-max flex-grow px-gutter-mobile py-8 md:px-gutter-desktop md:py-12">
      <nav className="mb-6 flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
        <Link className="transition-colors hover:text-primary" href="/">
          Trang chủ
        </Link>
        <ChevronRight className="size-4" />
        <Link className="transition-colors hover:text-primary" href="/products">
          Sản phẩm
        </Link>
        <ChevronRight className="size-4" />
        <span className="line-clamp-1 font-medium text-on-surface">
          {product.name}
        </span>
      </nav>

      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
        <section className="flex flex-col-reverse gap-4 md:col-span-7 md:flex-row">
          <div className="hide-scrollbar flex w-full shrink-0 gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-y-auto">
            {images.map((imgUrl, idx) => (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setActiveImage(imgUrl)}
                aria-label={`Xem ảnh sản phẩm ${idx + 1}`}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all focus:outline-none md:h-24 md:w-full ${
                  activeImage === imgUrl
                    ? "border-primary"
                    : "border-outline-variant hover:border-on-surface"
                }`}
              >
                <OptimizedImage
                  src={imgUrl}
                  alt={`${product.name} ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <div className="group relative aspect-[4/5] flex-grow overflow-hidden rounded-xl bg-surface-container-low md:h-[560px] md:aspect-auto lg:h-[660px]">
            <OptimizedImage
              src={activeImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              priority
              className="object-cover"
            />
            <button
              type="button"
              aria-label="Phóng to ảnh"
              className="absolute bottom-4 right-4 rounded-full bg-surface-container-lowest p-3 opacity-0 shadow-lg transition-opacity hover:scale-105 focus:outline-none group-hover:opacity-100"
            >
              <ZoomIn className="size-5 text-on-surface" />
            </button>
          </div>
        </section>

        <section className="flex flex-col pt-2 md:col-span-5 md:pt-0">
          <div className="mb-3 flex gap-2">
            {product.isBestSeller && (
              <span className="rounded bg-surface-container-highest px-2 py-1 text-label-sm font-label-sm text-on-surface">
                Bán chạy
              </span>
            )}
            {product.isNew && (
              <span className="rounded bg-primary px-2 py-1 text-label-sm font-label-sm text-white">
                Mới
              </span>
            )}
          </div>

          <h1 className="mb-3 font-headline text-3xl font-black leading-tight text-on-surface md:text-4xl">
            {product.name}
          </h1>

          <div className="mb-4 flex items-center gap-4">
            <span className="font-headline text-2xl font-black text-on-surface">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
            {(product.originalPrice ?? product.price) > product.price && (
              <>
                <span className="text-sm text-on-surface-variant/75 line-through">
                  {(product.originalPrice ?? product.price).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </span>
                <span className="rounded bg-tertiary px-2 py-0.5 text-[11px] font-semibold text-on-tertiary shadow-sm">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <div className="mb-8 flex items-center gap-2">
            <div className="flex text-on-surface">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`size-[18px] text-yellow-500 ${
                    idx < Math.round(product.rating) ? "fill-yellow-500" : ""
                  }`}
                />
              ))}
            </div>
            <span className="text-label-sm font-label-sm text-on-surface-variant">
              {product.rating} ({product.reviewCount} đánh giá)
            </span>
          </div>

          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onChange={setSelectedColor}
          />
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onChange={setSelectedSize}
          />

          <div className="mb-8">
            <h2 className="mb-3 text-label-md font-label-md text-on-surface">
              Số lượng
            </h2>
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              max={product.stock}
            />
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              {errorMsg}
            </div>
          )}
          {feedbackMsg && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              {feedbackMsg}
            </div>
          )}

          <div className="mb-8 flex flex-col gap-3">
            <Button
              onClick={handleAddToCart}
              className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary font-headline-sm text-label-md text-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-opacity hover:opacity-90 focus:outline-none"
            >
              <ShoppingCart className="size-4" /> Thêm vào giỏ hàng
            </Button>
            <Button
              onClick={handleBuyNow}
              className="h-14 w-full cursor-pointer rounded-lg border border-on-surface bg-surface font-headline-sm text-label-md text-on-surface transition-colors hover:bg-surface-container-low focus:outline-none"
            >
              Mua ngay
            </Button>
          </div>

          <div className="mb-8 flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
            <div className="flex items-center gap-3 text-on-surface">
              <Truck className="size-5 text-primary" />
              <span className="text-body-md font-body-md">
                Giao hàng nhanh 2-4 ngày
              </span>
            </div>
            <div className="flex items-center gap-3 text-on-surface">
              <RotateCcw className="size-5 text-primary" />
              <span className="text-body-md font-body-md">
                Đổi trả miễn phí trong 60 ngày
              </span>
            </div>
            <div className="flex items-center gap-3 text-on-surface">
              <BadgeCheck className="size-5 text-primary" />
              <span className="text-body-md font-body-md">
                Cam kết chính hãng 100%
              </span>
            </div>
          </div>

          <Accordion
            className="w-full border-t border-outline-variant"
            defaultValue={["description"]}
          >
            <AccordionItem
              value="description"
              className="border-b border-outline-variant"
            >
              <AccordionTrigger className="py-4 text-left text-label-md font-label-md text-on-surface hover:no-underline">
                Mô tả sản phẩm
              </AccordionTrigger>
              <AccordionContent className="pb-4 pr-4 text-body-md font-body-md leading-relaxed text-on-surface-variant">
                {product.description ||
                  "Thiết kế tối giản, dễ phối và phù hợp cho sử dụng hằng ngày."}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="material" className="border-b border-outline-variant">
              <AccordionTrigger className="py-4 text-left text-label-md font-label-md text-on-surface hover:no-underline">
                Chất liệu
              </AccordionTrigger>
              <AccordionContent className="pb-4 pr-4 text-body-md font-body-md leading-relaxed text-on-surface-variant">
                Chất liệu mềm, thoáng, co giãn tốt và giữ form qua nhiều lần
                giặt.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care" className="border-b border-outline-variant">
              <AccordionTrigger className="py-4 text-left text-label-md font-label-md text-on-surface hover:no-underline">
                Hướng dẫn bảo quản
              </AccordionTrigger>
              <AccordionContent className="pb-4 pr-4 text-body-md font-body-md leading-relaxed text-on-surface-variant">
                Giặt máy ở chế độ nhẹ. Không sử dụng chất tẩy mạnh. Lộn trái khi
                phơi và ủi ở nhiệt độ thấp.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 md:mt-24">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Có thể bạn sẽ thích
            </h2>
            <Link
              className="flex items-center gap-1 text-label-md font-label-md text-primary hover:underline"
              href="/products"
            >
              Xem thêm <ArrowRight className="size-[18px]" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
