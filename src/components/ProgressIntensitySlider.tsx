import React from "react";
import { Gauge } from "lucide-react";

interface ProgressIntensitySliderProps {
  value: number; // 1-10 scale
  onChange: (value: number) => void;
  className?: string;
}

export const ProgressIntensitySlider: React.FC<
  ProgressIntensitySliderProps
> = ({ value, onChange, className = "" }) => {
  const getIntensityLabel = (val: number) => {
    if (val <= 3) return "Gradual Learning";
    if (val <= 7) return "Balanced Growth";
    return "Intensive Development";
  };

  const getIntensityDescription = (val: number) => {
    if (val <= 3) return "Comfortable pace with ample review time";
    if (val <= 7)
      return "Standard learning progression with moderate challenges";
    return "Accelerated learning with maximum challenge";
  };

  const getIntensityColor = (val: number) => {
    if (val <= 3) return "bg-green-500";
    if (val <= 7) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(newValue);
  };

  return (
    <div
      className={`bg-white rounded-lg p-6 border border-slate-200 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Gauge className="w-5 h-5 text-slate-600" />
        <div>
          <h3 className="font-semibold text-slate-900">Progress Intensity</h3>
          <p className="text-sm text-slate-600">
            Adjust how aggressively you want to advance through your curriculum
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            {getIntensityLabel(value)}
          </span>
          <span className="text-sm text-slate-500">Level {value}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          style={{
            background: `linear-gradient(to right, ${getIntensityColor(
              value
            )} 0%, ${getIntensityColor(value)} ${
              (value / 10) * 100
            }%, #e2e8f0 ${(value / 10) * 100}%, #e2e8f0 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Gradual</span>
          <span>Moderate</span>
          <span>Intensive</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-700 mb-2">
          <strong>{getIntensityLabel(value)}:</strong>{" "}
          {getIntensityDescription(value)}
        </p>
        <div className="text-xs text-slate-600 space-y-1">
          {value <= 3 && (
            <>
              <p>• Smaller incremental skill increases</p>
              <p>• More time for concept reinforcement</p>
              <p>• Lower assignment frequency</p>
              <p>• Gentler difficulty progression</p>
            </>
          )}
          {value > 3 && value <= 7 && (
            <>
              <p>• Regular skill advancement</p>
              <p>• Balanced review and new content</p>
              <p>• Standard assignment schedule</p>
              <p>• Moderate difficulty increases</p>
            </>
          )}
          {value > 7 && (
            <>
              <p>• Rapid skill progression</p>
              <p>• Advanced concepts introduced quickly</p>
              <p>• Higher assignment frequency</p>
              <p>• Aggressive difficulty scaling</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
