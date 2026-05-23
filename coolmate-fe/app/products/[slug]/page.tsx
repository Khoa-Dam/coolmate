"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ColorSelector } from "./components/ColorSelector";
import { SizeSelector } from "./components/SizeSelector";
import { QuantitySelector } from "./components/QuantitySelector";
import { ProductCard } from "../../components/ProductCard";
import { productApi } from "@/services/productApi";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        setIsLoading(true);
        const prod = await productApi.getProductBySlug(slug);
        if (cancelled) return;
        setProduct(prod);
        setSelectedColor(prod.colors[0] || "");
        setSelectedSize(prod.sizes[0] || "");
        setQuantity(1);
        setActiveImage(prod.imageUrl);

        const related = await productApi.getProducts({ category: prod.category, limit: 4 });
        if (!cancelled) setRelatedProducts(related.items.filter((p) => p.id !== prod.id));
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadProduct();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-12 text-sm text-on-surface-variant">
          Đang tải sản phẩm...
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-20 text-center px-4">
          <h2 className="font-headline text-lg font-bold text-on-surface">
            Sản phẩm không tồn tại
          </h2>
          <p className="text-on-surface-variant text-sm mt-1 max-w-sm">
            Rất tiếc, sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
            khỏi hệ thống.
          </p>
          <Link href="/products" className="mt-6">
            <Button className="bg-primary text-white rounded-lg flex items-center gap-2">
              <ArrowLeft className="size-4" /> Quay lại cửa hàng
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const discount =
    (product.originalPrice ?? product.price) > product.price
      ? Math.round(
          (((product.originalPrice ?? product.price) - product.price) / (product.originalPrice ?? product.price)) *
            100,
        )
      : 0;

  const handleAddToCart = () => {
    setErrorMsg("");
    setFeedbackMsg("");
    if (!selectedSize) {
      setErrorMsg("Vui lòng chọn kích thước");
      return;
    }
    if (!selectedColor) {
      setErrorMsg("Vui lòng chọn màu sắc");
      return;
    }

    void addToCart(product, selectedSize, selectedColor, quantity);
    setFeedbackMsg("Đã thêm sản phẩm vào giỏ hàng thành công!");

    // Auto-clear message after 3 seconds
    setTimeout(() => {
      setFeedbackMsg("");
    }, 3000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setErrorMsg("Vui lòng chọn kích thước");
      return;
    }
    if (!selectedColor) {
      setErrorMsg("Vui lòng chọn màu sắc");
      return;
    }

    void addToCart(product, selectedSize, selectedColor, quantity);
    router.push("/checkout");
  };

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-on-surface-variant font-label-sm text-label-sm mb-6 gap-2">
          <Link className="hover:text-primary transition-colors" href="/">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <Link
            className="hover:text-primary transition-colors"
            href="/products"
          >
            Nam
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="text-on-surface font-medium">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto hide-scrollbar w-full md:w-20 shrink-0">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-16 h-20 md:w-full md:h-24 shrink-0 border-2 rounded-lg overflow-hidden focus:outline-none transition-all ${
                    activeImage === imgUrl
                      ? "border-primary"
                      : "border-outline-variant hover:border-on-surface"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow aspect-[4/5] md:aspect-auto md:h-[480px] lg:h-[620px] bg-surface-container-low rounded-xl overflow-hidden relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                aria-label="Zoom Image"
                className="absolute bottom-4 right-4 bg-surface-container-lowest p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none hover:scale-105"
              >
                <span className="material-symbols-outlined text-on-surface">
                  zoom_in
                </span>
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="md:col-span-5 flex flex-col pt-2 md:pt-0">
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {product.isBestSeller && (
                <span className="bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-2 py-1 rounded">
                  Bán chạy
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2 leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-center gap-4 mb-4">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {(product.originalPrice ?? product.price) > product.price && (
                <>
                  <span className="text-sm text-on-surface-variant/75 line-through">
                    {(product.originalPrice ?? product.price).toLocaleString("vi-VN")}đ
                  </span>
                  <span className="bg-tertiary text-on-tertiary font-label-sm text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex text-on-surface">
                <span className="material-symbols-outlined text-yellow-500 fill-icon text-[18px]">
                  star
                </span>
                <span className="material-symbols-outlined text-yellow-500 fill-icon text-[18px]">
                  star
                </span>
                <span className="material-symbols-outlined text-yellow-500 fill-icon text-[18px]">
                  star
                </span>
                <span className="material-symbols-outlined text-yellow-500 fill-icon text-[18px]">
                  star
                </span>
                <span className="material-symbols-outlined text-yellow-500 text-[18px]">
                  star_half
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {product.rating} ({product.reviewCount} Đánh giá)
              </span>
            </div>

            {/* Selectors */}
            <div className="flex flex-col">
              {/* Colors */}
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onChange={setSelectedColor}
              />

              {/* Sizes */}
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onChange={setSelectedSize}
              />

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="font-label-md text-label-md text-on-surface mb-3">
                  Số lượng
                </h3>
                <QuantitySelector
                  quantity={quantity}
                  onChange={setQuantity}
                  max={product.stock}
                />
              </div>
            </div>

            {/* Feedbacks and errors */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-lg mb-4 animate-none">
                {errorMsg}
              </div>
            )}
            {feedbackMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold p-3 rounded-lg mb-4 animate-none">
                {feedbackMsg}
              </div>
            )}

            {/* Purchase CTA buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                className="w-full h-14 bg-primary text-white font-headline-sm text-label-md rounded-lg hover:opacity-90 transition-opacity focus:outline-none flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] cursor-pointer"
              >
                <ShoppingCart className="size-4" /> Thêm vào giỏ hàng
              </Button>
              <Button
                onClick={handleBuyNow}
                className="w-full h-14 bg-surface border border-on-surface text-on-surface font-headline-sm text-label-md rounded-lg hover:bg-surface-container-low transition-colors focus:outline-none cursor-pointer"
              >
                Mua ngay
              </Button>
            </div>

            {/* Delivery Promises */}
            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  local_shipping
                </span>
                <span className="font-body-md text-body-md">
                  Giao hàng nhanh 2-4 ngày
                </span>
              </div>
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  currency_exchange
                </span>
                <span className="font-body-md text-body-md">
                  Đổi trả miễn phí trong 60 ngày
                </span>
              </div>
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  verified
                </span>
                <span className="font-body-md text-body-md">
                  Cam kết chính hãng 100%
                </span>
              </div>
            </div>

            {/* Accordion Info */}
            <Accordion
              className="w-full border-t border-outline-variant"
              defaultValue={["description"]}
            >
              <AccordionItem
                value="description"
                className="border-b border-outline-variant"
              >
                <AccordionTrigger className="font-label-md text-label-md text-on-surface py-4 hover:no-underline text-left">
                  Mô tả sản phẩm
                </AccordionTrigger>
                <AccordionContent className="pb-4 font-body-md text-body-md text-on-surface-variant pr-4 leading-relaxed">
                  {product.description ||
                    "Áo thun nam Cotton Compact mang đến sự thoải mái tuyệt đối với chất liệu cotton pha cao cấp, giữ form dáng tốt và ít nhăn sau nhiều lần giặt. Thiết kế tối giản, dễ dàng phối hợp với nhiều trang phục khác nhau, từ đi chơi đến đi làm."}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="material"
                className="border-b border-outline-variant"
              >
                <AccordionTrigger className="font-label-md text-label-md text-on-surface py-4 hover:no-underline text-left">
                  Chất liệu
                </AccordionTrigger>
                <AccordionContent className="pb-4 font-body-md text-body-md text-on-surface-variant pr-4 leading-relaxed">
                  95% Cotton Compact, 5% Spandex. Cấu trúc sợi vải đặc biệt giúp
                  bề mặt mịn màng, chống xù lông và thấm hút mồ hôi cực tốt.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="care"
                className="border-b border-outline-variant"
              >
                <AccordionTrigger className="font-label-md text-label-md text-on-surface py-4 hover:no-underline text-left">
                  Hướng dẫn bảo quản
                </AccordionTrigger>
                <AccordionContent className="pb-4 font-body-md text-body-md text-on-surface-variant pr-4 leading-relaxed">
                  Giặt máy ở chế độ nhẹ nhàng. Không sử dụng chất tẩy mạnh. Lộn
                  trái khi phơi và ủi ở nhiệt độ thấp.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products list */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24">
            <div className="flex justify-between items-end mb-8">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Có thể bạn sẽ thích
              </h2>
              <Link
                className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1"
                href="/products"
              >
                Xem thêm{" "}
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
