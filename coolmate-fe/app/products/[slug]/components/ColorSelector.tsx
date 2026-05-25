import React from "react";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
}

const colorMap: Record<string, string> = {
  Trắng: "#ffffff",
  Đen: "#1a1c1c",
  "Xanh Navy": "#1e3a8a",
  Xám: "#808080",
  "Xanh Rêu": "#4b5320",
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onChange,
}) => {
  if (colors.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-3 flex items-center text-label-md font-label-md text-on-surface">
        Màu sắc:
        <span className="ml-2 font-body-md font-normal">{selectedColor}</span>
      </h2>
      <div className="flex gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color;
          const colorHex = colorMap[color] || color || "#cccccc";

          return (
            <button
              key={color}
              type="button"
              className={`size-10 cursor-pointer rounded-full transition-all duration-200 ${
                isSelected
                  ? "border-2 border-primary"
                  : "border border-outline-variant hover:border-on-surface"
              }`}
              style={{ backgroundColor: colorHex }}
              onClick={() => onChange(color)}
              title={color}
              aria-label={`Chọn màu ${color}`}
              aria-pressed={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};
