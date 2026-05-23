import React from "react";

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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-label-md text-label-md text-on-surface">Kích thước</h3>
        <button type="button" className="text-primary font-label-sm text-label-sm hover:underline focus:outline-none flex items-center gap-1 cursor-pointer">
          <span className="material-symbols-outlined text-[16px]">straighten</span> Hướng dẫn chọn size
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              className={`py-3 rounded-lg font-label-md text-label-md transition-colors cursor-pointer text-center ${
                isSelected
                  ? "border-2 border-primary text-white bg-on-surface"
                  : "border border-outline-variant text-on-surface bg-surface hover:border-on-surface"
              }`}
              onClick={() => onChange(size)}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};
