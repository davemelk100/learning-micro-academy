import React from "react";
import { ChevronDown } from "lucide-react";
import { FontSelectorProps } from "../types";
import { fontOptions } from "../data";

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFont,
  onFontChange,
  isOpen,
  onToggle,
}) => {
  const selectedFontOption = fontOptions.find(
    (font) => font.id === selectedFont
  );

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-2 py-1 transition-all duration-200 text-slate-700 hover:text-slate-900 text-sm"
        title="Change font"
      >
        <span className={selectedFontOption?.className}>
          {selectedFontOption?.name}
        </span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          {fontOptions.map((font) => (
            <button
              key={font.id}
              onClick={() => {
                onFontChange(font.id);
                onToggle();
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                font.className
              } ${
                selectedFont === font.id
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {font.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
