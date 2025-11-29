import React from "react";
import { Sparkles } from "lucide-react";
import { HelpButtonProps } from "../types";

export const SoulchiHelpButton: React.FC<HelpButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors ${className}`}
    >
      <Sparkles className="h-4 w-4 text-slate-600" />
      <span className="text-sm text-slate-700">Learning Assistant</span>
    </button>
  );
};
