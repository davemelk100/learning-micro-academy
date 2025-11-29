import React from "react";

interface YesNoToggleProps {
  value: boolean | null; // null = unselected/outlined state
  onChange: (_value: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export const YesNoToggle: React.FC<YesNoToggleProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
  label,
}) => {
  const handleYesClick = () => {
    if (!disabled) {
      onChange(true);
    }
  };

  const handleNoClick = () => {
    if (!disabled) {
      onChange(false);
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && (
        <div className="block text-sm font-medium text-slate-700">{label}</div>
      )}
      <div
        className={`relative select-none ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        role="group"
        aria-label={label || "Yes/No toggle"}
      >
        <div className="relative w-24 h-8 rounded-full overflow-hidden border-2 border-slate-300">
          {/* Yes side */}
          <div
            className={`absolute left-0 top-0 w-12 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer ${
              value === true
                ? "bg-blue-500 text-white"
                : value === false
                ? "bg-slate-100 text-slate-400"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
            onClick={handleYesClick}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !disabled) {
                e.preventDefault();
                handleYesClick();
              }
            }}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-pressed={value === true}
          >
            <span className="text-sm font-bold">Yes</span>
          </div>

          {/* No side */}
          <div
            className={`absolute right-0 top-0 w-12 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer ${
              value === false
                ? "bg-blue-500 text-white"
                : value === true
                ? "bg-slate-100 text-slate-400"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
            onClick={handleNoClick}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !disabled) {
                e.preventDefault();
                handleNoClick();
              }
            }}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-pressed={value === false}
          >
            <span className="text-sm font-bold">No</span>
          </div>
        </div>
      </div>
    </div>
  );
};
