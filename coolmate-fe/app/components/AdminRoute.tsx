"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div className="py-16 text-center text-sm text-on-surface-variant">Đang tải...</div>;
  if (!isAuthenticated) return null;
  if (!isAdmin) {
    return (
      <div className="py-16 text-center">
        <h2 className="font-headline text-lg font-bold text-on-surface">403</h2>
        <p className="mt-2 text-sm text-on-surface-variant">Bạn không có quyền truy cập khu vực admin.</p>
      </div>
    );
  }

  return <>{children}</>;
}
