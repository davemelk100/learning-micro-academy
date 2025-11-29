import React from "react";
import { Sparkles, X } from "lucide-react";

interface HelpCardProps {
  onHelpClick: () => void;
  onChooseMyselfClick: () => void;
  onClose?: () => void;
  className?: string;
}

export const HelpCard: React.FC<HelpCardProps> = ({
  onHelpClick,
  onChooseMyselfClick,
  onClose,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 relative ${className}`}>
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-start mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <Sparkles className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Need help choosing?
          </h3>
          <p className="text-sm text-slate-600">
            Let Learning Assistant help you find the perfect course
          </p>
        </div>
      </div>

      {/* Body text */}
      <p className="text-slate-700 text-sm leading-relaxed mb-6">
        Our AI can analyze your interests and suggest the most relevant course
        to help you achieve your learning goals.
      </p>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onHelpClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Let Learning Assistant help
        </button>
        <button
          onClick={onChooseMyselfClick}
          className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          I'll choose myself
        </button>
      </div>
    </div>
  );
};
