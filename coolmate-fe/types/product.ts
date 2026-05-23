export type ProductSize = string;
export type ProductColor = string;
export type ProductCategory = string;

export interface ProductOption {
  id: string;
  size: ProductSize;
  color: {
    name: string;
    value: string;
  };
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  images: string[];
  category: ProductCategory;
  sizes: ProductSize[];
  colors: ProductColor[];
  options?: ProductOption[];
  description: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}
