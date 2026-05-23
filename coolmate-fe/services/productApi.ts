import { apiClient } from "@/services/apiClient";
import { PaginatedResponse } from "@/types/api";
import { Product } from "@/types/product";

export type ProductQuery = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type CreateProductPayload = {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isActive?: boolean;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

const toSearchParams = (params?: ProductQuery) => {
  const search = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

const toProductPayload = (payload: CreateProductPayload | UpdateProductPayload) => {
  const colors = payload.colors ?? [];
  const sizes = payload.sizes ?? [];
  const stock = payload.stock ?? 0;

  return {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    price: payload.price,
    originalPrice: payload.originalPrice ?? undefined,
    imageUrl: payload.imageUrl,
    category: payload.category,
    stock,
    isActive: payload.isActive,
    images: payload.imageUrl ? [{ url: payload.imageUrl, alt: payload.name ?? "Product image" }] : undefined,
    options:
      colors.length && sizes.length
        ? sizes.flatMap((size) =>
            colors.map((color) => ({
              size,
              colorName: color,
              colorValue: color,
              stock,
            })),
          )
        : undefined,
  };
};

export const productApi = {
  getProducts(params?: ProductQuery) {
    return apiClient<PaginatedResponse<Product>>(`/products${toSearchParams(params)}`, { auth: false });
  },

  getProductBySlug(slug: string) {
    return apiClient<Product>(`/products/slug/${encodeURIComponent(slug)}`, { auth: false });
  },

  getProductById(id: string) {
    return apiClient<Product>(`/products/${encodeURIComponent(id)}`, { auth: false });
  },

  createProduct(payload: CreateProductPayload) {
    return apiClient<Product>("/products", {
      method: "POST",
      body: toProductPayload(payload),
    });
  },

  updateProduct(id: string, payload: UpdateProductPayload) {
    return apiClient<Product>(`/products/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: toProductPayload(payload),
    });
  },

  deleteProduct(id: string) {
    return apiClient<Product>(`/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
