"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { AdminRoute } from "../../../components/AdminRoute";
import { AdminProductForm } from "../components/AdminProductForm";
import { productApi } from "@/services/productApi";
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
