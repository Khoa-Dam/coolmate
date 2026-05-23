import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "../../components/ProductCard";

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3">
          sentiment_dissatisfied
        </span>
        <h3 className="font-headline text-lg font-bold text-on-surface">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-on-surface-variant text-sm mt-1 max-w-sm">
          Vui lòng thử chọn bộ lọc khác hoặc tìm kiếm từ khóa khác.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
