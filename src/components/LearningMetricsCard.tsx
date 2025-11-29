import React from "react";
import { TrendingUp, Award, Target, Calendar } from "lucide-react";
import { ProgressIntensitySlider } from "./ProgressIntensitySlider";

interface LearningMetricsCardProps {
  currentProficiency: number; // 0-100
  skillsMasteredThisMonth: number;
  activeLearningStreak: number; // days
  completionRate: number; // 0-100
  progressIntensity: number; // 1-10
  onProgressIntensityChange: (value: number) => void;
}

export const LearningMetricsCard: React.FC<LearningMetricsCardProps> = ({
  currentProficiency,
  skillsMasteredThisMonth,
  activeLearningStreak,
  completionRate,
  progressIntensity,
  onProgressIntensityChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Your Learning Metrics
        </h2>
        <p className="text-slate-600">
          Track your educational progress and skill development
        </p>
      </div>

      {/* Skills Development Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-600">
              Current Proficiency
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{currentProficiency}%</div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${currentProficiency}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-slate-600">
              Skills Mastered
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {skillsMasteredThisMonth}
          </div>
          <div className="text-xs text-slate-500 mt-1">This month</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-slate-600">
              Learning Streak
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {activeLearningStreak}
          </div>
          <div className="text-xs text-slate-500 mt-1">Days active</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-slate-600">
              Completion Rate
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{completionRate}%</div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Progress Intensity Slider */}
      <ProgressIntensitySlider
        value={progressIntensity}
        onChange={onProgressIntensityChange}
      />
    </div>
  );
};

