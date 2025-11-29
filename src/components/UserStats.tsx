import React from "react";
import { Target, Check, Award, Flame } from "lucide-react";

interface UserStatsProps {
  userStats: {
    totalGoals: number;
    completedGoals: number;
    totalPoints: number;
    currentStreak: number;
  };
  selectedFont: string;
  getHeadingFontClass: (font: string) => string;
}

export const UserStats: React.FC<UserStatsProps> = ({
  userStats,
  selectedFont,
  getHeadingFontClass,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Goals */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Target className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600">Actions - Total</p>
          <p className="text-xl font-bold text-slate-900">
            {userStats.totalGoals}
          </p>
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <Flame className="h-5 w-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600">Streak</p>
          <p className="text-xl font-bold text-slate-900">
            {userStats.currentStreak}
          </p>
        </div>
      </div>

      {/* Actions This Week */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center space-x-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600">Actions - This Week</p>
          <p className="text-xl font-bold text-slate-900">
            {userStats.completedGoals}
          </p>
        </div>
      </div>

      {/* Total Points */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Award className="h-5 w-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600">Total Points</p>
          <p className="text-xl font-bold text-slate-900">
            {userStats.totalPoints}
          </p>
        </div>
      </div>
    </div>
  );
};
