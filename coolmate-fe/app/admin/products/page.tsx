"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { AdminRoute } from "../../components/AdminRoute";
import { productApi } from "@/services/productApi";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash, ExternalLink } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      const response = await productApi.getProducts({ limit: 100 });
      setProducts(response.items);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Không thể tải sản phẩm");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    await productApi.deleteProduct(id);
    await loadProducts();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
        <AdminRoute>
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant/30 pb-5">
            <div>
              <h1 className="font-headline text-xl md:text-2xl font-black text-on-surface uppercase tracking-tight">Quản lý sản phẩm</h1>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Admin console / Dữ liệu từ NovaWear API</p>
            </div>
            <Link href="/admin/products/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary-container h-10 px-4 rounded-lg font-headline text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                <Plus className="size-4" /> Thêm sản phẩm
              </Button>
            </Link>
          </div>
          {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>}
          <div className="bg-white border border-outline-variant/30 rounded-xxl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-surface-container-low">
                <TableRow className="border-b border-outline-variant/40 hover:bg-transparent">
                  <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant w-16">Ảnh</TableHead>
                  <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant">Tên sản phẩm</TableHead>
                  <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant">Danh mục</TableHead>
                  <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant text-right">Giá bán</TableHead>
                  <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant text-right">Tồn kho</TableHead>
                  <TableHead className="font-headline text-xs font-bold uppercase text-on-surface-variant text-center w-32">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-medium text-xs text-on-surface-variant divide-y divide-outline-variant/40">
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-on-surface-variant">Chưa có sản phẩm nào.</TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50">
                      <TableCell className="py-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-12 object-cover rounded bg-surface-container-low" />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-on-surface text-sm">{product.name}</span>
                          <span className="text-[10px] text-outline font-mono mt-0.5">{product.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 capitalize">{product.category.replace("-", " ")}</TableCell>
                      <TableCell className="py-3 text-right font-bold text-on-surface">{product.price.toLocaleString("vi-VN")}đ</TableCell>
                      <TableCell className="py-3 text-right">
                        {product.stock <= 10 ? <Badge variant="destructive" className="font-semibold text-[10px] py-0 px-1.5">{product.stock} (Sắp hết)</Badge> : <span>{product.stock}</span>}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/products/${product.slug}`} target="_blank" title="Xem trên web">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-surface-container text-on-surface-variant cursor-pointer"><ExternalLink className="size-4" /></Button>
                          </Link>
                          <Link href={`/admin/products/${product.id}/edit`} title="Chỉnh sửa">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-surface-container text-primary cursor-pointer"><Edit className="size-4" /></Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => void handleDelete(product.id)} className="h-8 w-8 hover:bg-red-50 text-destructive cursor-pointer" title="Xóa">
                            <Trash className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </AdminRoute>
      </main>
      <Footer />
    </div>
  );
}
