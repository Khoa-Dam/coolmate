import Link from "next/link";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProductCard } from "./components/ProductCard";
import { mockApi } from "./services/mockApi";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Ruler } from "lucide-react";

export default function Home() {
  const bestSellers = mockApi.getProducts().filter((product) => product.isBestSeller).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] md:h-[750px] flex items-center justify-center overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="NovaWear Hero"
              className="w-full h-full object-cover object-center opacity-70"
              src="https://images.unsplash.com/photo-1549064482-6779ba3292fe?w=1600&auto=format&fit=crop&q=80"
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          <div className="relative z-10 text-center px-gutter-mobile md:px-gutter-desktop max-w-4xl mx-auto flex flex-col items-center gap-6 mt-12 md:mt-20">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              Mặc thoải mái.<br />Sống năng động.
            </h1>
            <p className="font-sans text-sm sm:text-base md:text-lg text-zinc-200 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
              Thời trang cơ bản và thể thao cho mỗi ngày. Thiết kế tinh giản, chất liệu cao cấp mang đến trải nghiệm dễ chịu tuyệt đối.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <Button className="bg-primary-container text-white hover:bg-accent font-headline text-xs font-bold uppercase tracking-wider h-14 px-10 rounded-lg shadow-lg w-full flex items-center justify-center gap-2 cursor-pointer">
                  Mua sắm ngay <ArrowRight className="size-4 animate-bounce" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="border-y border-outline-variant/30 bg-white py-10">
          <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y-0 divide-x-0 md:divide-x divide-outline-variant/40">
            <div className="flex flex-col items-center text-center px-4">
              <Truck className="size-8 text-primary mb-3" />
              <h4 className="font-headline text-xs font-bold uppercase tracking-wide text-on-surface">
                Miễn phí vận chuyển
              </h4>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                Cho đơn hàng từ 200.000đ
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <RefreshCw className="size-8 text-primary mb-3" />
              <h4 className="font-headline text-xs font-bold uppercase tracking-wide text-on-surface">
                Đổi trả 60 ngày
              </h4>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                Đổi trả dễ dàng, an tâm mua sắm
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <ShieldCheck className="size-8 text-primary mb-3" />
              <h4 className="font-headline text-xs font-bold uppercase tracking-wide text-on-surface">
                Chất lượng cam kết
              </h4>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                100% tự hào sản xuất tại Việt Nam
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <Ruler className="size-8 text-primary mb-3" />
              <h4 className="font-headline text-xs font-bold uppercase tracking-wide text-on-surface">
                Chọn size chuẩn xác
              </h4>
              <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                Tư vấn size phù hợp hoàn hảo
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-20 px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-8 text-center uppercase tracking-tight">
            Danh mục nổi bật
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Áo thun */}
            <Link
              href="/products?category=ao-thun"
              className="group block relative rounded-xl overflow-hidden aspect-square bg-surface-container-low col-span-2 md:col-span-2 lg:col-span-2 row-span-2 shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Áo thun"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-on-primary">
                <h3 className="font-headline-sm text-headline-sm">Áo thun</h3>
                <p className="font-label-sm text-label-sm mt-1 opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Khám phá <span className="material-symbols-outlined text-xs">arrow_outward</span>
                </p>
              </div>
            </Link>

            {/* Polo */}
            <Link
              href="/products?category=ao-polo"
              className="group block relative rounded-xl overflow-hidden aspect-square bg-surface-container-low col-span-1 md:col-span-1 shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-secondary-container group-hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">apparel</span>
              </div>
              <div className="absolute bottom-4 left-4 text-on-surface">
                <h3 className="font-label-md text-label-md">Polo</h3>
              </div>
            </Link>

            {/* Quần shorts */}
            <Link
              href="/products?category=quan-short"
              className="group block relative rounded-xl overflow-hidden aspect-square bg-surface-container-low col-span-1 md:col-span-1 shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Quần shorts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=60"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 text-on-primary">
                <h3 className="font-label-md text-label-md">Quần shorts</h3>
              </div>
            </Link>

            {/* Đồ chạy bộ */}
            <Link
              href="/products"
              className="group block relative rounded-xl overflow-hidden aspect-[2/1] md:aspect-square bg-surface-container-low col-span-2 md:col-span-2 lg:col-span-2 shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Đồ chạy bộ"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-on-primary">
                <h3 className="font-headline-sm text-headline-sm">Đồ chạy bộ</h3>
                <p className="font-label-sm text-label-sm mt-1">Sẵn sàng bứt tốc</p>
              </div>
            </Link>

            {/* Đồ lót */}
            <Link
              href="/products?category=do-mac-nha"
              className="group block relative rounded-xl overflow-hidden aspect-square bg-surface-container-low col-span-1 md:col-span-1 shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-surface-container-high group-hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">checkroom</span>
              </div>
              <div className="absolute bottom-4 left-4 text-on-surface">
                <h3 className="font-label-md text-label-md">Đồ lót</h3>
              </div>
            </Link>

            {/* Pickleball */}
            <Link
              href="/products"
              className="group block relative rounded-xl overflow-hidden aspect-square bg-surface-container-low col-span-1 md:col-span-1 shadow-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-tertiary-container text-on-tertiary-container group-hover:bg-tertiary transition-colors">
                <span className="material-symbols-outlined text-4xl">sports_tennis</span>
              </div>
              <div className="absolute bottom-4 left-4 text-on-tertiary-container">
                <h3 className="font-label-md text-label-md">Pickleball</h3>
              </div>
            </Link>
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="py-16 md:py-20 px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto bg-zinc-50 border-t border-outline-variant/20">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="font-headline text-xl md:text-2xl font-black text-on-surface uppercase tracking-tight">
                Sản phẩm bán chạy
              </h2>
              <p className="text-sm text-on-surface-variant mt-1 font-medium">
                Những items được yêu thích nhất từ khách hàng của chúng tôi.
              </p>
            </div>
            <Link href="/products" className="hidden sm:block">
              <Button variant="outline" className="border-outline-variant text-on-surface hover:bg-surface-container rounded-lg font-headline text-xs font-bold uppercase tracking-wider h-11 px-6 cursor-pointer">
                Xem tất cả
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="border-outline-variant text-on-surface w-full h-11 rounded-lg font-headline text-xs font-bold uppercase tracking-wider">
                Xem tất cả
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
