import React from "react";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
}

// Map color names to tailwind classes or styles
const colorMap: Record<string, string> = {
  "Trắng": "#ffffff",
  "Đen": "#1a1c1c",
  "Xanh Navy": "#1e3a8a",
  "Xám": "#808080",
  "Xanh Rêu": "#4b5320",
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-headline text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        Màu sắc: <span className="text-on-surface font-sans capitalize">{selectedColor}</span>
      </span>
      <div className="flex gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color;
          const colorHex = colorMap[color] || "#cccccc";
          const isWhite = color === "Trắng";

          return (
            <button
              key={color}
              type="button"
              className={`w-9 h-9 rounded-full relative transition-all duration-200 cursor-pointer ${
                isSelected ? "ring-2 ring-offset-2 ring-primary" : "hover:scale-105"
              }`}
              style={{
                backgroundColor: colorHex,
                border: isWhite ? "1px solid #c3c5d9" : "none",
              }}
              onClick={() => onChange(color)}
              title={color}
            >
              {isSelected && (
                <span
                  className={`material-symbols-outlined text-xs absolute inset-0 flex items-center justify-center font-bold ${
                    isWhite ? "text-black" : "text-white"
                  }`}
                  style={{ fontSize: "16px" }}
                >
                  check
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
