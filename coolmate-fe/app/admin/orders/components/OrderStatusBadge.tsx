import React from "react";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  type: "order" | "payment";
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  type,
  status,
}) => {
  if (type === "order") {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none font-medium">
            Chờ xử lý
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none font-medium">
            Đang xử lý
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-none font-medium">
            Đang giao hàng
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none font-medium">
            Đã giao hàng
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none font-medium">
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  } else {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none font-medium">
            Chưa thanh toán
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-medium">
            Đã thanh toán
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-none font-medium">
            Lỗi thanh toán
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }
};
