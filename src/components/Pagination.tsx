import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  previousLabel?: string;
  nextLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canGoPrevious = false,
  canGoNext = false,
  previousLabel = "Back",
  nextLabel = "Next",
}) => {
  return (
    <div className="sticky bottom-0 z-50 flex items-center justify-between px-4 py-3 bg-white md:px-6 md:relative md:shadow-none md:border-t-0">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          canGoPrevious
            ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            : "text-slate-400 cursor-not-allowed"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
        <span>{previousLabel}</span>
      </button>

      {/* Progress Dots and Step Indicator */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <span
              key={index}
              className={`block h-2 w-2 rounded-full transition-all duration-200 ${
                index + 1 === currentStep
                  ? "bg-blue-600 w-3 h-3 scale-110" // Current step
                  : index + 1 < currentStep
                  ? "bg-slate-400" // Completed step
                  : "bg-slate-200" // Upcoming step
              }`}
            ></span>
          ))}
        </div>
        <span className="text-xs font-medium text-slate-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          canGoNext
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        <span>{nextLabel}</span>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
