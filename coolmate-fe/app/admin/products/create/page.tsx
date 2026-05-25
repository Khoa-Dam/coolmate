"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdminRoute } from "@/components/layout/admin-route";
import { AdminProductForm } from "../components/AdminProductForm";
import { productApi } from "@/services/product.service";
import { Product } from "@/types/product";

export default function AdminProductCreatePage() {
  const router = useRouter();

  const handleSubmit = async (data: Omit<Product, "id">) => {
    await productApi.createProduct(data);
    router.push("/admin/products");
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        <AdminRoute>
          <AdminProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </AdminRoute>
      </main>

      <Footer />
    </div>
  );
}
