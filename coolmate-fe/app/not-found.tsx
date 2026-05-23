import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-gutter-mobile py-16 text-center">
      <div className="max-w-md">
        <p className="font-headline text-xs font-bold uppercase tracking-wider text-primary">404</p>
        <h1 className="mt-3 font-headline text-2xl md:text-3xl font-black uppercase text-on-surface">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          Trang bạn đang mở không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="h-11 rounded-lg bg-primary text-primary-foreground font-headline text-xs font-bold uppercase">
              Về trang chủ
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="h-11 rounded-lg border-outline-variant font-headline text-xs font-bold uppercase">
              Xem sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
