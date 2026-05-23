export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  images?: string[];
  category: string; // e.g. "ao-thun", "ao-polo"
  sizes: string[];  // e.g. ["S", "M", "L", "XL", "2XL"]
  colors: string[]; // e.g. ["Trắng", "Đen", "Xanh Navy"]
  description: string;
  rating: number;
  reviewCount: number;
  stock: number;
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
