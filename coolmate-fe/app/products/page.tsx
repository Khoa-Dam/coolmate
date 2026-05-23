import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ProductCarousel } from "../components/ProductCarousel";
import { ProductGrid } from "./components/ProductGrid";
import { productApi } from "@/services/productApi";

type ProductsPageProps = {
  searchParams: Promise<{
    gender?: string;
    category?: string;
    search?: string;
    filter?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
};

const categoryFilters = [
  { label: "Áo thun", slug: "ao-thun", count: 120 },
  { label: "Áo Polo", slug: "ao-polo", count: 85 },
  { label: "Quần Short", slug: "quan-short", count: 92 },
  { label: "Đồ mặc nhà", slug: "do-mac-nha", count: 64 },
  { label: "Phụ kiện", slug: "phu-kien", count: 45 },
];

const sizeFilters = ["S", "M", "L", "XL", "XXL"];

const priceFilters = [
  { label: "Dưới 200.000đ", minPrice: undefined, maxPrice: 200000 },
  { label: "200.000đ - 300.000đ", minPrice: 200000, maxPrice: 300000 },
  { label: "300.000đ - 500.000đ", minPrice: 300000, maxPrice: 500000 },
  { label: "Trên 500.000đ", minPrice: 500000, maxPrice: undefined },
];

const getPageTitle = (gender?: string, category?: string, filter?: string) => {
  if (category) {
    return categoryFilters.find((item) => item.slug === category)?.label ?? "Sản phẩm";
  }
  if (gender === "nam") return "Đồ nam";
  if (gender === "nu") return "Đồ nữ";
  if (filter === "new") return "Sản phẩm mới";
  if (filter === "sale") return "Sale";
  if (filter === "collection") return "Bộ sưu tập";
  return "Tất cả sản phẩm";
};

const buildCategoryHref = (slug: string, gender?: string) => {
  const params = new URLSearchParams();
  if (gender) params.set("gender", gender);
  params.set("category", slug);
  return `/products?${params.toString()}`;
};

const buildPriceHref = (
  current: { gender?: string; category?: string; search?: string; filter?: string },
  price: { minPrice?: number; maxPrice?: number },
) => {
  const params = new URLSearchParams();
  if (current.gender) params.set("gender", current.gender);
  if (current.category) params.set("category", current.category);
  if (current.search) params.set("search", current.search);
  if (current.filter) params.set("filter", current.filter);
  if (price.minPrice !== undefined) params.set("minPrice", String(price.minPrice));
  if (price.maxPrice !== undefined) params.set("maxPrice", String(price.maxPrice));
  return `/products?${params.toString()}`;
};

const formatPriceRange = (minPrice?: number, maxPrice?: number) => {
  if (minPrice !== undefined && maxPrice !== undefined) {
    return `${minPrice.toLocaleString("vi-VN")}đ - ${maxPrice.toLocaleString("vi-VN")}đ`;
  }
  if (minPrice !== undefined) return `${minPrice.toLocaleString("vi-VN")}đ+`;
  if (maxPrice !== undefined) return `0đ - ${maxPrice.toLocaleString("vi-VN")}đ`;
  return "0đ - 1.000.000đ+";
};

const getRailProducts = (category: string) =>
  productApi
    .getProducts({ category, limit: 12 })
    .then((response) => response.items)
    .catch(() => []);

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const pageTitle = getPageTitle(params.gender, params.category, params.filter);
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const apiSearch = params.search ?? (params.gender === "nam" ? "nam" : params.gender === "nu" ? "nữ" : undefined);
  const [result, activeCategoryRail, tshirts, polos, shorts] = await Promise.all([
    productApi
      .getProducts({
        category: params.category,
        search: params.category ? params.search : apiSearch,
        minPrice,
        maxPrice,
        page: params.page ? Number(params.page) : 1,
        limit: 24,
      })
      .catch(() => ({ items: [], meta: { total: 0, page: 1, limit: 24, totalPages: 0 } })),
    params.category ? getRailProducts(params.category) : Promise.resolve([]),
    params.category ? Promise.resolve([]) : getRailProducts("ao-thun"),
    params.category ? Promise.resolve([]) : getRailProducts("ao-polo"),
    params.category ? Promise.resolve([]) : getRailProducts("quan-short"),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />
      <main className="mx-auto w-full max-w-container-max flex-grow px-gutter-mobile pb-margin-mobile pt-8 md:px-gutter-desktop md:pb-margin-desktop">
        <div className="mb-8 md:mb-12">
          <nav className="mb-4 flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
            <Link className="hover:text-primary" href="/">
              Trang chủ
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-on-surface">{pageTitle}</span>
          </nav>
          <h1 className="font-display-lg text-display-lg-mobile text-on-surface md:text-display-lg">
            {pageTitle}
          </h1>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="sticky top-24 space-y-8">
              <div className="border-b border-outline-variant pb-6">
                <h2 className="mb-4 font-headline text-[18px] font-semibold text-on-surface">Danh mục</h2>
                <ul className="space-y-3 font-body-md text-on-surface-variant">
                  {categoryFilters.map((category) => {
                    const isActive = params.category === category.slug;
                    return (
                      <li key={category.slug}>
                        <Link
                          href={buildCategoryHref(category.slug, params.gender)}
                          className={`flex items-center gap-3 transition-colors hover:text-primary ${
                            isActive ? "font-semibold text-primary" : ""
                          }`}
                        >
                          <span
                            className={`size-5 rounded border ${
                              isActive ? "border-primary bg-primary" : "border-outline"
                            }`}
                          />
                          <span>
                            {category.label} ({category.count})
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-b border-outline-variant pb-6">
                <h2 className="mb-4 font-headline text-[18px] font-semibold text-on-surface">Kích cỡ</h2>
                <div className="flex flex-wrap gap-2">
                  {sizeFilters.map((size, index) => (
                    <button
                      key={size}
                      type="button"
                      className={`h-10 rounded-full px-4 font-label-md transition-colors ${
                        index === 1
                          ? "bg-on-surface text-surface shadow-md"
                          : "border border-outline-variant bg-surface text-on-surface hover:border-on-surface"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-b border-outline-variant pb-6">
                <h2 className="mb-4 font-headline text-[18px] font-semibold text-on-surface">Giá</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {priceFilters.map((price) => {
                      const isActive = minPrice === price.minPrice && maxPrice === price.maxPrice;
                      return (
                        <Link
                          key={price.label}
                          href={buildPriceHref(params, price)}
                          className={`block rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                            isActive
                              ? "border-on-surface bg-on-surface text-surface"
                              : "border-outline-variant bg-surface text-on-surface hover:border-on-surface"
                          }`}
                        >
                          {price.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low p-2">
                      <span className="mb-1 block text-label-sm text-on-surface-variant">Từ</span>
                      <span className="font-body-md text-on-surface">
                        {minPrice !== undefined ? `${minPrice.toLocaleString("vi-VN")}đ` : "0đ"}
                      </span>
                    </div>
                    <span className="text-on-surface-variant">-</span>
                    <div className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low p-2">
                      <span className="mb-1 block text-label-sm text-on-surface-variant">Đến</span>
                      <span className="font-body-md text-on-surface">
                        {maxPrice !== undefined ? `${maxPrice.toLocaleString("vi-VN")}đ` : "1.000.000đ+"}
                      </span>
                    </div>
                  </div>
                  {(minPrice !== undefined || maxPrice !== undefined) && (
                    <Link
                      href={buildPriceHref(params, {})}
                      className="inline-flex text-sm font-bold text-primary hover:underline"
                    >
                      Xóa lọc giá
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-8">
              {params.category ? (
                <ProductCarousel
                  title={`${pageTitle} nổi bật`}
                  description="Các sản phẩm nổi bật trong danh mục bạn đang xem."
                  products={activeCategoryRail}
                  href={buildCategoryHref(params.category, params.gender)}
                />
              ) : (
                <>
                  <ProductCarousel
                    title="Áo thun nổi bật"
                    description="Form dễ mặc, chất liệu thoáng cho mỗi ngày."
                    products={tshirts}
                    href={buildCategoryHref("ao-thun", params.gender)}
                  />
                  <ProductCarousel
                    title="Áo Polo nổi bật"
                    description="Gọn gàng cho đi làm, đi chơi và vận động nhẹ."
                    products={polos}
                    href={buildCategoryHref("ao-polo", params.gender)}
                  />
                  <ProductCarousel
                    title="Quần Short nổi bật"
                    description="Linh hoạt cho tập luyện và sinh hoạt hằng ngày."
                    products={shorts}
                    href={buildCategoryHref("quan-short", params.gender)}
                  />
                </>
              )}
            </div>
            <div className="mb-6 flex flex-col items-start justify-between rounded-lg bg-surface-container-low p-4 sm:flex-row sm:items-center">
              <p className="mb-4 font-body-md text-on-surface-variant sm:mb-0">
                Hiển thị <strong>{result.meta.total}</strong> sản phẩm
                {(minPrice !== undefined || maxPrice !== undefined) && (
                  <span className="ml-2 text-xs font-semibold text-primary">
                    {formatPriceRange(minPrice, maxPrice)}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/products" className="rounded-full bg-on-surface px-4 py-2 font-label-sm text-surface">
                  Tất cả sản phẩm
                </Link>
                <Link href="/products?filter=best-seller" className="rounded-full border border-outline-variant bg-surface px-4 py-2 font-label-sm text-on-surface transition-colors hover:border-on-surface">
                  Bán chạy
                </Link>
                <Link href="/products?filter=new" className="rounded-full border border-outline-variant bg-surface px-4 py-2 font-label-sm text-on-surface transition-colors hover:border-on-surface">
                  Sản phẩm mới
                </Link>
                <button className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface px-4 py-2 font-label-sm text-on-surface transition-colors hover:border-on-surface" type="button">
                  Sắp xếp <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
              </div>
            </div>
            <ProductGrid products={result.items} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
