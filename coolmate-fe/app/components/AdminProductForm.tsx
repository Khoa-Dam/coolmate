"use client";

import React, { useState } from "react";
import { Product } from "../types/product";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, "id"> & { id?: string }) => void;
  onCancel: () => void;
}

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "2XL", "Free Size"];
const AVAILABLE_COLORS = ["Trắng", "Đen", "Xanh Navy", "Xám", "Xanh Rêu"];
const CATEGORIES = [
  { label: "Áo thun", value: "ao-thun" },
  { label: "Áo Polo", value: "ao-polo" },
  { label: "Quần Shorts", value: "quan-short" },
  { label: "Đồ mặc nhà", value: "do-mac-nha" },
  { label: "Phụ kiện", value: "phu-kien" },
];

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [price, setPrice] = useState(initialData?.price.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice.toString() || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [category, setCategory] = useState(initialData?.category || "ao-thun");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || ["M"]);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialData?.colors || ["Đen"]);
  const [description, setDescription] = useState(initialData?.description || "");
  const [stock, setStock] = useState(initialData?.stock.toString() || "100");

  const [nameError, setNameError] = useState("");
  const [slugError, setSlugError] = useState("");
  const [priceError, setPriceError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate slug
    const generated = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setSlug(generated);
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    setSlugError("");
    setPriceError("");

    let isValid = true;
    if (!name.trim()) {
      setNameError("Tên sản phẩm không được trống");
      isValid = false;
    }
    if (!slug.trim()) {
      setSlugError("Slug không được trống");
      isValid = false;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setPriceError("Giá bán phải lớn hơn 0");
      isValid = false;
    }

    if (!isValid) return;

    onSubmit({
      id: initialData?.id,
      name,
      slug,
      price: numPrice,
      originalPrice: Number(originalPrice) || numPrice,
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      category,
      sizes: selectedSizes,
      colors: selectedColors,
      description,
      stock: Number(stock) || 0,
      rating: initialData?.rating || 5.0,
      reviewCount: initialData?.reviewCount || 0,
    });
  };

  return (
    <Card className="bg-white border border-outline-variant/30 rounded-xxl shadow-sm max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="font-headline text-lg font-bold text-on-surface">
            {initialData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-on-surface-variant">Tên sản phẩm</Label>
            <Input
              id="name"
              placeholder="Nhập tên sản phẩm..."
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="border-outline-variant rounded-lg"
            />
            {nameError && <span className="text-[11px] text-destructive">{nameError}</span>}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug" className="text-xs font-semibold text-on-surface-variant">Slug sản phẩm (URL)</Label>
            <Input
              id="slug"
              placeholder="nhap-ten-san-pham..."
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border-outline-variant rounded-lg font-mono text-xs"
            />
            {slugError && <span className="text-[11px] text-destructive">{slugError}</span>}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category" className="text-xs font-semibold text-on-surface-variant">Danh mục</Label>
            <Select value={category} onValueChange={(val) => setCategory(val ?? "")}>
              <SelectTrigger id="category" className="border-outline-variant rounded-lg">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-outline-variant">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prices & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price" className="text-xs font-semibold text-on-surface-variant">Giá bán (đ)</Label>
              <Input
                id="price"
                type="number"
                placeholder="199000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-outline-variant rounded-lg"
              />
              {priceError && <span className="text-[11px] text-destructive">{priceError}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="originalPrice" className="text-xs font-semibold text-on-surface-variant">Giá gốc (đ)</Label>
              <Input
                id="originalPrice"
                type="number"
                placeholder="249000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="border-outline-variant rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stock" className="text-xs font-semibold text-on-surface-variant">Tồn kho</Label>
              <Input
                id="stock"
                type="number"
                placeholder="100"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="border-outline-variant rounded-lg"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imageUrl" className="text-xs font-semibold text-on-surface-variant">Đường dẫn ảnh (URL)</Label>
            <Input
              id="imageUrl"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border-outline-variant rounded-lg"
            />
          </div>

          {/* Sizes checkboxes */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-on-surface-variant">Kích thước hỗ trợ</Label>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {AVAILABLE_SIZES.map((size) => (
                <div key={size} className="flex items-center gap-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => handleSizeToggle(size)}
                  />
                  <Label htmlFor={`size-${size}`} className="text-sm font-medium cursor-pointer">{size}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Colors checkboxes */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-on-surface-variant">Màu sắc hỗ trợ</Label>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {AVAILABLE_COLORS.map((color) => (
                <div key={color} className="flex items-center gap-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={selectedColors.includes(color)}
                    onCheckedChange={() => handleColorToggle(color)}
                  />
                  <Label htmlFor={`color-${color}`} className="text-sm font-medium cursor-pointer">{color}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-on-surface-variant">Mô tả sản phẩm</Label>
            <Textarea
              id="description"
              placeholder="Mô tả chất liệu, thiết kế, hướng dẫn giặt ủi..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-outline-variant rounded-lg focus-visible:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-outline-variant text-on-surface rounded-lg hover:bg-surface-container"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary-container rounded-lg font-headline text-xs font-bold uppercase tracking-wider"
            >
              {initialData ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
