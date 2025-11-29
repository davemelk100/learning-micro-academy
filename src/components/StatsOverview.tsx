import React from "react";
import { Target, Flame } from "lucide-react";

interface StatsOverviewProps {
  userStats: {
    currentStreak: number;
  };
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ userStats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8 border-rounded-2xl">
      <div className="bg-white p-4 object-cover shadow-md border border-slate-100 rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="h-5 w-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-600">
            Actions - Total
          </span>
        </div>
        <p className="text-2xl font-bold text-slate-900">8</p>
      </div>

      <div className="bg-white p-4 object-cover shadow-md border border-slate-100 rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium text-slate-600">Streak</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">
          {userStats.currentStreak}
        </p>
      </div>

      <div className="bg-white p-4 object-cover shadow-md border border-slate-100 rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-slate-600">
            Actions - This Week
          </span>
        </div>
        <p className="text-2xl font-bold text-slate-900">2</p>
      </div>
    </div>
  );
};
