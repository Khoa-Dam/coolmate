"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { AdminProductForm } from "../../../components/AdminProductForm";
import { mockApi } from "../../../services/mockApi";
import { Product } from "../../../types/product";

export default function AdminProductCreatePage() {
  const router = useRouter();

  const handleSubmit = (data: Omit<Product, "id">) => {
    mockApi.saveProduct(data);
    router.push("/admin/products");
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        <AdminProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </main>

      <Footer />
    </div>
  );
}
