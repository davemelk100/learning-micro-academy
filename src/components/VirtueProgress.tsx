import React from "react";
import { virtues } from "../data";
import { Heart, Bot, Target } from "lucide-react";

interface VirtueProgressProps {
  navigateToScreen: (_screen: number) => void;
}

export const VirtueProgress: React.FC<VirtueProgressProps> = ({
  navigateToScreen,
}) => {
  const progressData = [
    { virtue: virtues.find((v) => v.id === "community"), progress: 75 },
    { virtue: virtues.find((v) => v.id === "wisdom"), progress: 60 },
    { virtue: virtues.find((v) => v.id === "self"), progress: 90 },
  ].filter((item) => item.virtue);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-700">
          Learning Metrics
        </h3>
        <button
          onClick={() => navigateToScreen(17)}
          className="text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {progressData.map((item, index) => {
          const virtue = item.virtue!;
          const progress = item.progress;

          const testIcons = [Heart, Bot, Target];
          const IconComponent = testIcons[index] || Heart;

          const colorClasses = ["bg-blue-100", "bg-purple-100", "bg-green-100"];
          const iconColorClasses = [
            "text-blue-600",
            "text-purple-600",
            "text-green-600",
          ];
          const progressColorClasses = [
            "bg-blue-600",
            "bg-purple-600",
            "bg-green-600",
          ];

          const bgColorClass = colorClasses[index] || "bg-gray-100";
          const iconColorClass = iconColorClasses[index] || "text-gray-600";
          const progressColorClass =
            progressColorClasses[index] || "bg-gray-600";

          return (
            <div
              key={virtue.id}
              className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center space-x-3"
            >
              <div
                className={`w-10 h-10 ${bgColorClass} rounded-full flex items-center justify-center`}
              >
                <IconComponent className={`h-5 w-5 ${iconColorClass}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600">{virtue.name}</p>
                <p className="text-xl font-bold text-slate-900">{progress}%</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                  <div
                    className={`h-1.5 rounded-full ${progressColorClass}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
