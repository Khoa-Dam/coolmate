"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ProductGrid } from "../components/ProductGrid";
import { mockApi } from "../services/mockApi";
import { Product } from "../types/product";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal } from "lucide-react";

const SIZES = ["S", "M", "L", "XL", "2XL", "Free Size"];
const COLORS = ["Trắng", "Đen", "Xanh Navy", "Xám", "Xanh Rêu"];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [quickFilter, setQuickFilter] = useState<"all" | "best" | "new">("all");
  const [sortBy, setSortBy] = useState("featured");

  const categories = mockApi.getCategories();

  // Load products on mount
  useEffect(() => {
    setAllProducts(mockApi.getProducts());
  }, []);

  // Update filters from search parameters
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...allProducts];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by Size
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((size) => selectedSizes.includes(size))
      );
    }

    // Filter by Color
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((color) => selectedColors.includes(color))
      );
    }

    // Filter by Price
    result = result.filter((p) => p.price <= maxPrice);

    // Filter by Quick Filter
    if (quickFilter === "best") {
      result = result.filter((p) => p.isBestSeller);
    } else if (quickFilter === "new") {
      result = result.filter((p) => p.isNew);
    }

    // Sort products
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [allProducts, selectedCategories, selectedSizes, selectedColors, maxPrice, quickFilter, sortBy]);

  const handleCategoryToggle = (categorySlug: string) => {
    // Clear URL query param if user toggles manually
    if (searchParams.get("category")) {
      router.push("/products", { scroll: false });
    }
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((c) => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(1000000);
    setQuickFilter("all");
    setSortBy("featured");
    router.push("/products", { scroll: false });
  };

  const FiltersSidebar = () => (
    <div className="sticky top-24 space-y-8">
      {/* Category Filter */}
      <div className="border-b border-outline-variant pb-6">
        <h3 className="font-headline-sm text-[18px] font-semibold mb-4">
          Danh mục
        </h3>
        <div className="flex flex-col gap-3 font-body-md text-on-surface-variant">
          {categories.map((cat) => {
            const count = allProducts.filter((p) => p.category === cat.slug).length;
            return (
              <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={selectedCategories.includes(cat.slug)}
                  onCheckedChange={() => handleCategoryToggle(cat.slug)}
                  className="rounded border-outline text-primary focus:ring-primary w-5 h-5 cursor-pointer"
                />
                <span className="group-hover:text-primary transition-colors font-medium">
                  {cat.name} {count > 0 && `(${count})`}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="border-b border-outline-variant pb-6">
        <h3 className="font-headline-sm text-[18px] font-semibold mb-4">
          Kích cỡ
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`h-10 px-4 rounded-full font-label-md text-xs cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-on-surface text-white border-on-surface shadow-md font-bold"
                    : "border-outline-variant/60 bg-surface text-on-surface hover:border-on-surface"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="border-b border-outline-variant pb-6">
        <h3 className="font-headline-sm text-[18px] font-semibold mb-4">
          Màu sắc
        </h3>
        <div className="flex flex-col gap-3 font-body-md text-on-surface-variant">
          {COLORS.map((color) => (
            <label key={color} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedColors.includes(color)}
                onCheckedChange={() => handleColorToggle(color)}
                className="rounded border-outline text-primary focus:ring-primary w-5 h-5 cursor-pointer"
              />
              <span className="group-hover:text-primary transition-colors font-medium">
                {color}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="border-b border-outline-variant pb-6">
        <h3 className="font-headline-sm text-[18px] font-semibold mb-4">
          Giá
        </h3>
        <div className="space-y-4">
          <input
            type="range"
            min={0}
            max={1000000}
            step={50000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg p-2">
              <span className="text-label-sm text-on-surface-variant block mb-1 text-[10px] uppercase font-semibold">Từ</span>
              <span className="font-body-md text-on-surface font-semibold text-sm">0đ</span>
            </div>
            <span className="text-on-surface-variant">-</span>
            <div className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg p-2">
              <span className="text-label-sm text-on-surface-variant block mb-1 text-[10px] uppercase font-semibold">Đến</span>
              <span className="font-body-md text-on-surface font-semibold text-sm">
                {maxPrice === 1000000 ? "1.000.000đ+" : `${maxPrice.toLocaleString("vi-VN")}đ`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Button */}
      {(selectedCategories.length > 0 ||
        selectedSizes.length > 0 ||
        selectedColors.length > 0 ||
        maxPrice < 1000000 ||
        quickFilter !== "all") && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="border-destructive/60 text-destructive hover:bg-destructive/5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider h-10 w-full mt-4 cursor-pointer"
        >
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-on-surface-variant font-label-sm text-label-sm mb-4 gap-2">
        <Link className="hover:text-primary transition-colors animate-none" href="/">Trang chủ</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium">Nam</span>
      </nav>

      {/* Page Title */}
      <div className="mb-8 md:mb-12">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface uppercase tracking-tight">
          Đồ nam
        </h1>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="w-full md:w-64 flex-shrink-0 hidden md:block border-r border-outline-variant/30 pr-6">
          <FiltersSidebar />
        </aside>

        {/* Catalog Content */}
        <div className="flex-grow">
          {/* Top Sorting Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-container-low p-4 rounded-lg mb-6">
            <p className="font-body-md text-on-surface-variant mb-4 sm:mb-0">
              Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {/* Mobile Filter Button */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger
                    render={
                      <Button variant="outline" className="border-outline-variant text-on-surface rounded-full gap-2 cursor-pointer h-9 px-4 text-xs font-semibold" />
                    }
                  >
                    <SlidersHorizontal className="size-3.5" /> Bộ lọc
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-white p-6 overflow-y-auto w-80">
                    <SheetTitle className="font-headline text-base font-bold text-on-surface mb-6 flex items-center gap-2">
                      <Filter className="size-4" /> Bộ lọc sản phẩm
                    </SheetTitle>
                    <FiltersSidebar />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-1.5 mr-2">
                <button
                  onClick={() => setQuickFilter("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                    quickFilter === "all"
                      ? "bg-on-surface text-white border-on-surface"
                      : "bg-white border-outline-variant text-on-surface hover:border-on-surface"
                  }`}
                >
                  Tất cả sản phẩm
                </button>
                <button
                  onClick={() => setQuickFilter("best")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                    quickFilter === "best"
                      ? "bg-on-surface text-white border-on-surface"
                      : "bg-white border-outline-variant text-on-surface hover:border-on-surface"
                  }`}
                >
                  Bán chạy
                </button>
                <button
                  onClick={() => setQuickFilter("new")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                    quickFilter === "new"
                      ? "bg-on-surface text-white border-on-surface"
                      : "bg-white border-outline-variant text-on-surface hover:border-on-surface"
                  }`}
                >
                  Sản phẩm mới
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(val) => setSortBy(val ?? "")}>
                  <SelectTrigger className="w-36 sm:w-40 border-outline-variant rounded-full bg-white text-xs font-semibold h-9">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-outline-variant text-xs">
                    <SelectItem value="featured">Nổi bật</SelectItem>
                    <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                    <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                    <SelectItem value="rating">Đánh giá tốt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <main>
            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

