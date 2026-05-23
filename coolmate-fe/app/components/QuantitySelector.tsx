import React from "react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  max = 99,
}) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="font-headline text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        Số lượng
      </span>
      <div className="flex items-center border border-outline-variant rounded-lg w-fit bg-surface-container-lowest overflow-hidden">
        <Button
          type="button"
          variant="ghost"
          className="h-10 w-10 p-0 rounded-none hover:bg-surface-container-low text-on-surface"
          onClick={handleDecrement}
          disabled={quantity <= 1}
        >
          <span className="material-symbols-outlined text-sm">remove</span>
        </Button>
        <span className="w-12 text-center font-semibold text-sm text-on-surface">
          {quantity}
        </span>
        <Button
          type="button"
          variant="ghost"
          className="h-10 w-10 p-0 rounded-none hover:bg-surface-container-low text-on-surface"
          onClick={handleIncrement}
          disabled={quantity >= max}
        >
          <span className="material-symbols-outlined text-sm">add</span>
        </Button>
      </div>
    </div>
  );
};
