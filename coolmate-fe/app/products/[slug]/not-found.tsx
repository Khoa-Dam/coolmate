import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex min-h-[520px] flex-grow flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-headline text-2xl font-black text-on-surface">
          Sản phẩm không tồn tại
        </h1>
        <p className="mt-2 max-w-sm text-sm text-on-surface-variant">
          Rất tiếc, sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa khỏi
          hệ thống.
        </p>
        <Link href="/products" className="mt-6">
          <Button className="flex items-center gap-2 rounded-lg bg-primary text-white">
            <ArrowLeft className="size-4" /> Quay lại cửa hàng
          </Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
