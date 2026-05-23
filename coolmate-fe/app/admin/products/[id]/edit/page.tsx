"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../../../components/Header";
import { Footer } from "../../../../components/Footer";
import { AdminRoute } from "../../../../components/AdminRoute";
import { AdminProductForm } from "../../components/AdminProductForm";
import { productApi } from "@/services/productApi";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  useEffect(() => {
    productApi
      .getProductById(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: Omit<Product, "id"> & { id?: string }) => {
    await productApi.updateProduct(id, data);
    router.push("/admin/products");
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20 text-center">
          <p className="text-sm text-on-surface-variant font-medium">Đang tải thông tin sản phẩm...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-20 text-center px-4">
          <h2 className="font-headline text-lg font-bold text-on-surface">Sản phẩm không tìm thấy</h2>
          <p className="text-on-surface-variant text-sm mt-1 max-w-sm">
            Rất tiếc, sản phẩm bạn cần chỉnh sửa không tồn tại hoặc đã bị xóa khỏi hệ thống.
          </p>
          <Link href="/admin/products" className="mt-6">
            <Button className="bg-primary text-white rounded-lg flex items-center gap-2">
              <ArrowLeft className="size-4" /> Quay lại danh sách
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        <AdminRoute>
        <AdminProductForm
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
        </AdminRoute>
      </main>

      <Footer />
    </div>
  );
}
