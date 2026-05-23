import React from "react";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
}

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
    <div className="mb-6">
      <h3 className="font-label-md text-label-md text-on-surface mb-3 flex items-center">
        Màu sắc: <span className="font-body-md font-normal ml-2">{selectedColor}</span>
      </h3>
      <div className="flex gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color;
          const colorHex = colorMap[color] || color || "#cccccc";

          return (
            <button
              key={color}
              type="button"
              className={`size-10 rounded-full transition-all duration-200 cursor-pointer ${
                isSelected ? "border-2 border-primary" : "border border-outline-variant hover:border-on-surface"
              }`}
              style={{ backgroundColor: colorHex }}
              onClick={() => onChange(color)}
              title={color}
              aria-label={`Chọn màu ${color}`}
            />
          );
        })}
      </div>
    </div>
  );
};
