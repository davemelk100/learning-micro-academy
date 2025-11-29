import React from "react";
import { virtues } from "../data";
import { Heart, Bot, Target } from "lucide-react";

interface VirtueProgressProps {
  navigateToScreen: (screen: number) => void;
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
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateToScreen(17)}
          className="text-xl font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
        >
           Learning Metrics
        </button>
        <button
          onClick={() => navigateToScreen(17)}
          className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
        >
          View All
        </button>
      </div>
      <p className="text-slate-600 text-sm mb-6">
        Track your progress
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {progressData.map((item, index) => {
          const virtue = item.virtue!;
          const progress = item.progress;

          // Test with hardcoded icons to verify rendering
          const testIcons = [Heart, Bot, Target];
          const IconComponent = testIcons[index] || Heart;

          // Use consistent color scheme matching the app's design system
          const colorClasses = [
            "bg-blue-100", // Community background
            "bg-purple-100", // Wisdom background
            "bg-green-100", // Self background
          ];
          const iconColorClasses = [
            "text-blue-600", // Community icon
            "text-purple-600", // Wisdom icon
            "text-green-600", // Self icon
          ];
          const progressColorClasses = [
            "bg-blue-600", // Community progress
            "bg-purple-600", // Wisdom progress
            "bg-green-600", // Self progress
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
