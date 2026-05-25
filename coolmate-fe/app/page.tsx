import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCarousel } from "@/components/product/product-carousel";
import { productApi } from "@/services/product.service";
import {
  ArrowRight,
  ArrowUpRight,
  PackageCheck,
  RefreshCw,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&auto=format&fit=crop&q=82";

const campaignCards = [
  {
    title: "Đồ nam",
    subtitle: "Tối giản, dễ mặc, sẵn sàng cho mọi lịch trình.",
    href: "/products?gender=nam",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=900&auto=format&fit=crop&q=72",
  },
  {
    title: "Đồ nữ",
    subtitle: "Activewear gọn nhẹ cho tập luyện và di chuyển.",
    href: "/products?gender=nu",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=72",
  },
  {
    title: "Pickleball",
    subtitle: "Set đồ thoáng khí, linh hoạt trên sân.",
    href: "/products?filter=pickleball",
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=900&auto=format&fit=crop&q=72",
  },
  {
    title: "Đồ chạy bộ",
    subtitle: "Nhẹ, khô nhanh và bền bỉ cho từng pace.",
    href: "/products?category=do-chay-bo",
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&auto=format&fit=crop&q=72",
  },
];

const quickCategories = [
  { label: "Áo polo", href: "/products?category=ao-polo" },
  { label: "Áo thun", href: "/products?category=ao-thun" },
  { label: "Quần shorts", href: "/products?category=quan-short" },
  { label: "Đồ mặc nhà", href: "/products?category=do-mac-nha" },
  { label: "Phụ kiện", href: "/products?category=phu-kien" },
  { label: "Sale", href: "/products?filter=sale" },
];

const serviceItems = [
  {
    icon: Truck,
    title: "Miễn phí vận chuyển",
    text: "Cho đơn hàng từ 200.000đ",
  },
  {
    icon: RefreshCw,
    title: "Đổi trả 60 ngày",
    text: "Đổi trả dễ dàng, an tâm mua sắm",
  },
  {
    icon: ShieldCheck,
    title: "Chất lượng cam kết",
    text: "Chọn chất liệu bền, thoáng, dễ chăm sóc",
  },
  {
    icon: Ruler,
    title: "Chọn size chuẩn",
    text: "Tư vấn size theo dáng người Việt",
  },
];

export default async function Home() {
  const fetchProducts = (
    params: Parameters<typeof productApi.getProducts>[0],
  ) =>
    productApi
      .getProducts(params)
      .then((response) => response.items)
      .catch(() => []);

  const [bestSellers, tshirts, polos, shorts, homewear, accessories] =
    await Promise.all([
      fetchProducts({ limit: 12, view: "card" }),
      fetchProducts({ category: "ao-thun", limit: 12, view: "card" }),
      fetchProducts({ category: "ao-polo", limit: 12, view: "card" }),
      fetchProducts({ category: "quan-short", limit: 12, view: "card" }),
      fetchProducts({ category: "do-mac-nha", limit: 12, view: "card" }),
      fetchProducts({ category: "phu-kien", limit: 12, view: "card" }),
    ]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-grow">
        <section className="relative min-h-[620px] overflow-hidden bg-black md:min-h-[720px]">
          <Image
            alt="NovaWear collection campaign"
            src={HERO_IMAGE}
            fill
            preload
            sizes="100vw"
            className="object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/38 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[620px] max-w-container-max flex-col justify-end px-gutter-mobile pb-12 pt-24 md:min-h-[720px] md:px-gutter-desktop md:pb-16">
            <div className="max-w-2xl text-white">
              <p className="mb-4 inline-flex rounded-full bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-wide backdrop-blur">
                NovaWear Summer Drop
              </p>
              <h1 className="font-headline text-4xl font-black leading-tight tracking-normal sm:text-5xl md:text-7xl">
                Mặc mát.
                <br />
                Chuyển động cả ngày.
              </h1>
              <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-white/82 sm:text-base">
                Những set đồ cơ bản, thể thao và mặc nhà được tinh chỉnh cho
                khí hậu Việt Nam: nhẹ, thoáng, dễ phối và bền qua nhiều lần mặc.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 font-headline text-xs font-black uppercase tracking-wide text-white transition hover:bg-primary-container"
                >
                  Mua ngay <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/products?filter=new"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-white/60 px-7 font-headline text-xs font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
                >
                  Xem hàng mới
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ServiceStrip />

        <section className="mx-auto max-w-container-max px-gutter-mobile py-12 md:px-gutter-desktop md:py-16">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                Featured promotions
              </p>
              <h2 className="mt-1 font-headline text-2xl font-black uppercase tracking-normal text-on-surface md:text-3xl">
                Bộ sưu tập nổi bật
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-bold text-on-surface transition hover:text-primary"
            >
              Xem tất cả <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-4 md:auto-rows-[260px]">
            <CampaignCard
              {...campaignCards[0]}
              className="md:col-span-2 md:row-span-2"
              priority
            />
            {campaignCards.slice(1).map((card) => (
              <CampaignCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="border-y border-outline-variant/25 bg-white py-8">
          <div className="mx-auto flex max-w-container-max flex-col gap-5 px-gutter-mobile md:px-gutter-desktop">
            <div className="flex items-center gap-3">
              <PackageCheck className="size-5 text-primary" />
              <h2 className="font-headline text-base font-black uppercase tracking-normal text-on-surface">
                Mua nhanh theo nhu cầu
              </h2>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {quickCategories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="shrink-0 rounded-full border border-outline-variant/60 bg-surface px-5 py-3 text-sm font-bold text-on-surface transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 px-gutter-mobile py-8 md:px-gutter-desktop md:py-12">
          <div className="mx-auto max-w-container-max">
            <ProductCarousel
              title="Sản phẩm bán chạy"
              description="Các item được chọn nhiều nhất trong tuần."
              products={bestSellers}
              href="/products?filter=best-seller"
            />
            <ProductCarousel
              title="Áo thun"
              description="Form dễ mặc, chất liệu thoáng cho mỗi ngày."
              products={tshirts}
              href="/products?category=ao-thun"
            />
            <ProductCarousel
              title="Áo Polo"
              description="Gọn gàng cho đi làm, đi chơi và vận động nhẹ."
              products={polos}
              href="/products?category=ao-polo"
            />
            <ProductCarousel
              title="Quần Short"
              description="Linh hoạt cho tập luyện và sinh hoạt hằng ngày."
              products={shorts}
              href="/products?category=quan-short"
            />
            <ProductCarousel
              title="Đồ mặc nhà"
              description="Êm, nhẹ và thoải mái trong mọi chuyển động."
              products={homewear}
              href="/products?category=do-mac-nha"
            />
            <ProductCarousel
              title="Phụ kiện"
              description="Những món nhỏ hoàn thiện set đồ NovaWear."
              products={accessories}
              href="/products?category=phu-kien"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ServiceStrip() {
  return (
    <section className="border-y border-outline-variant/30 bg-white">
      <div className="mx-auto grid max-w-container-max grid-cols-2 gap-y-7 px-gutter-mobile py-9 md:grid-cols-4 md:divide-x md:divide-outline-variant/35 md:px-gutter-desktop">
        {serviceItems.map((item) => (
          <div key={item.title} className="flex flex-col items-center px-4 text-center">
            <item.icon className="mb-3 size-7 text-primary" />
            <h3 className="font-headline text-xs font-black uppercase tracking-normal text-on-surface">
              {item.title}
            </h3>
            <p className="mt-1 max-w-44 text-[11px] font-medium leading-5 text-on-surface-variant">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CampaignCard({
  title,
  subtitle,
  href,
  image,
  className = "",
  priority = false,
}: {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative block min-h-[260px] overflow-hidden rounded-lg bg-surface-container-low ${className}`}
    >
      <Image
        alt={title}
        src={image}
        fill
        sizes={
          priority
            ? "(max-width: 768px) 100vw, 50vw"
            : "(max-width: 768px) 100vw, 25vw"
        }
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
        <h3 className="font-headline text-2xl font-black uppercase tracking-normal md:text-3xl">
          {title}
        </h3>
        <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-white/82">
          {subtitle}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-black transition group-hover:bg-primary group-hover:text-white">
          Mua ngay <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
