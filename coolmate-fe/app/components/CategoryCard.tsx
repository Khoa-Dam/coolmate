import React from "react";
import Link from "next/link";
import { Category } from "../../types/product";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card className="group relative overflow-hidden aspect-square cursor-pointer border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-xxl bg-surface-container-low">
        <div className="absolute inset-0 z-0">
          {category.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <CardContent className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white flex flex-col justify-end h-full">
          <h3 className="font-headline text-lg md:text-xl font-bold tracking-tight">
            {category.name}
          </h3>
          <p className="font-label-sm text-xs mt-1 opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Khám phá <span className="material-symbols-outlined text-xs">arrow_outward</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
