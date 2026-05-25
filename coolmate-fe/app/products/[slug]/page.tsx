import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { productApi } from "@/services/product.service";
import { ProductDetailClient } from "./components/product-detail-client";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await productApi.getProductBySlug(slug);
  } catch {
    notFound();
  }

  const relatedResponse = await productApi
    .getProducts({
      category: product.category,
      limit: 5,
      view: "card",
    })
    .catch(() => ({ items: [] }));

  const relatedProducts = relatedResponse.items
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      <Footer />
    </div>
  );
}
