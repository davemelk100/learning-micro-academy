import React from "react";
import { Sparkles, RefreshCw } from "lucide-react";

interface AIRecommendationCardProps {
  recommendation: string;
  onAccept: () => void;
  onTryAnother: () => void;
  className?: string;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onAccept,
  onTryAnother,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-slate-100 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <Sparkles className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">
            Learning Assistant Recommendation
          </h3>
        </div>
      </div>

      {/* Body text */}
      <p className="text-slate-700 text-sm leading-relaxed mb-6">
        {recommendation}
      </p>

      {/* Action buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onAccept}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex-1"
        >
          Accept
        </button>
        <button
          onClick={onTryAnother}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-medium transition-colors border border-slate-200 flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Another</span>
        </button>
      </div>
    </div>
  );
};
