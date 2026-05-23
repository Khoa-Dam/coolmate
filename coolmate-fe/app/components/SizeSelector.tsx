import React from "react";
import { Button } from "@/components/ui/button";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onChange: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-headline text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        Kích thước
      </span>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <Button
              key={size}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={`h-11 min-w-[3rem] px-3 font-semibold text-sm transition-all duration-200 ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
              }`}
              onClick={() => onChange(size)}
            >
              {size}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
