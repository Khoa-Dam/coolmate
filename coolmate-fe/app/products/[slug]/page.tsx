"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ColorSelector } from "../../components/ColorSelector";
import { SizeSelector } from "../../components/SizeSelector";
import { QuantitySelector } from "../../components/QuantitySelector";
import { ProductCard } from "../../components/ProductCard";
import { mockApi } from "../../services/mockApi";
import { useCart } from "../../context/CartContext";
import { Product } from "../../types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, ShoppingCart, CreditCard, ShieldCheck, RefreshCw, Truck } from "lucide-react";

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

  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;

  useEffect(() => {
    const prod = mockApi.getProductBySlug(slug);
    if (prod) {
      setProduct(prod);
      setSelectedColor(prod.colors[0] || "");
      setSelectedSize(prod.sizes[0] || "");
      setQuantity(1);
      setActiveImage(prod.imageUrl);

      // Load related products
      const all = mockApi.getProducts();
      const related = all
        .filter((p) => p.category === prod.category && p.id !== prod.id)
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      setProduct(null);
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-20 text-center px-4">
          <h2 className="font-headline text-lg font-bold text-on-surface">
            Sản phẩm không tồn tại
          </h2>
          <p className="text-on-surface-variant text-sm mt-1 max-w-sm">
            Rất tiếc, sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa khỏi hệ thống.
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

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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

    addToCart(product, selectedSize, selectedColor, quantity);
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

    addToCart(product, selectedSize, selectedColor, quantity);
    router.push("/checkout");
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        {/* Breadcrumb / Back link */}
        <div className="mb-6 flex items-center">
          <Link
            href="/products"
            className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="size-4" /> Tất cả sản phẩm
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 mb-16">
          {/* Left: Image Gallery */}
          <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar w-full md:w-24 shrink-0">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-24 md:w-full md:h-32 shrink-0 border-2 rounded-lg overflow-hidden focus:outline-none transition-all ${
                    activeImage === imgUrl ? "border-primary" : "border-outline-variant hover:border-on-surface"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow aspect-[3/4] md:aspect-auto md:h-[600px] lg:h-[800px] bg-surface-container-low rounded-xl overflow-hidden relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button aria-label="Zoom Image" className="absolute bottom-4 right-4 bg-surface-container-lowest p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none hover:scale-105">
                <span className="material-symbols-outlined text-on-surface">zoom_in</span>
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="md:col-span-5 flex flex-col pt-2 md:pt-0 gap-6">
            <div className="flex flex-col gap-2">
              {/* Badges */}
              <div className="flex gap-2">
                {product.isBestSeller && (
                  <Badge className="bg-destructive text-destructive-foreground font-semibold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-DEFAULT">
                    Bán chạy
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="bg-primary text-primary-foreground font-semibold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-DEFAULT">
                    Mới
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="font-headline text-2xl md:text-3xl font-black text-on-surface leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                <div className="flex items-center text-tertiary">
                  <span className="material-symbols-outlined text-base fill-icon">star</span>
                  <span className="text-on-surface font-bold ml-1">{product.rating}</span>
                </div>
                <span>•</span>
                <span>{product.reviewCount} đánh giá khách hàng</span>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-end gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
              <span className="font-headline text-2xl font-black text-primary">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-on-surface-variant/75 line-through pb-1">
                    {product.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                  <Badge className="bg-tertiary text-white font-semibold text-xs px-2 py-0.5 rounded-md mb-0.5">
                    -{discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Selectors */}
            <div className="flex flex-col gap-5">
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
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                max={product.stock}
              />
            </div>

            <Separator className="bg-outline-variant/30 my-2" />

            {/* Feedbacks and errors */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-lg animate-none">
                {errorMsg}
              </div>
            )}
            {feedbackMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold p-3 rounded-lg animate-none">
                {feedbackMsg}
              </div>
            )}

            {/* Purchase CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 border-primary text-primary border hover:bg-primary-container hover:text-white bg-transparent h-14 rounded-lg font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ShoppingCart className="size-4" /> Thêm vào giỏ hàng
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary-container h-14 rounded-lg font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="size-4" /> Mua ngay
              </Button>
            </div>

            {/* Delivery Promises */}
            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                <span className="font-body-md text-xs font-semibold text-on-surface-variant">Giao hàng nhanh 2-4 ngày</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">currency_exchange</span>
                <span className="font-body-md text-xs font-semibold text-on-surface-variant">Đổi trả miễn phí trong 60 ngày</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                <span className="font-body-md text-xs font-semibold text-on-surface-variant">Cam kết chính hãng 100%</span>
              </div>
            </div>

            {/* Accordion Info */}
            <Accordion className="w-full" defaultValue={["material"]}>
              <AccordionItem value="material" className="border-b border-outline-variant/30">
                <AccordionTrigger className="font-headline text-xs font-bold uppercase tracking-wide py-4 hover:no-underline text-left">
                  Mô tả & Đặc điểm nổi bật
                </AccordionTrigger>
                <AccordionContent className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care" className="border-b border-outline-variant/30">
                <AccordionTrigger className="font-headline text-xs font-bold uppercase tracking-wide py-4 hover:no-underline text-left">
                  Hướng dẫn bảo quản
                </AccordionTrigger>
                <AccordionContent className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  - Giặt máy ở chế độ nhẹ dịu với sản phẩm cùng màu.<br />
                  - Không sử dụng chất tẩy mạnh chứa clo.<br />
                  - Phơi trong bóng râm, tránh ánh nắng gắt trực tiếp.<br />
                  - Ủi/Là ở nhiệt độ trung bình dưới 150 độ C.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="return" className="border-b border-outline-variant/30">
                <AccordionTrigger className="font-headline text-xs font-bold uppercase tracking-wide py-4 hover:no-underline text-left">
                  Chính sách đổi trả 60 ngày
                </AccordionTrigger>
                <AccordionContent className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  NovaWear tự hào mang tới chính sách đổi trả trong vòng 60 ngày hoàn toàn miễn phí vì
                  bất kỳ lý do gì (bao gồm cả mặc không vừa hoặc không ưng ý). Sản phẩm đổi trả yêu cầu
                  còn nguyên nhãn mác và chưa qua giặt là.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products list */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-outline-variant/20 pt-16">
            <h2 className="font-headline text-lg md:text-xl font-black text-on-surface mb-8 uppercase tracking-tight text-center sm:text-left">
              Sản phẩm tương tự
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
