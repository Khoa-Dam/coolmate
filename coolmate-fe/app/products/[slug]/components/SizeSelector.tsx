import React from "react";
import { Ruler } from "lucide-react";

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
  if (sizes.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-label-md font-label-md text-on-surface">
          Kích thước
        </h2>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 text-label-sm font-label-sm text-primary hover:underline focus:outline-none"
        >
          <Ruler className="size-4" /> Hướng dẫn chọn size
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              className={`cursor-pointer rounded-lg py-3 text-center text-label-md font-label-md transition-colors ${
                isSelected
                  ? "border-2 border-primary bg-on-surface text-white"
                  : "border border-outline-variant bg-surface text-on-surface hover:border-on-surface"
              }`}
              onClick={() => onChange(size)}
              aria-pressed={isSelected}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};
