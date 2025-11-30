import React from "react";
import { CheckCircle, TrendingUp, Target, BarChart3, X } from "lucide-react";

interface OnboardingDashboardScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const OnboardingDashboardScreen: React.FC<
  OnboardingDashboardScreenProps
> = ({ onComplete, onSkip }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm-white px-4 py-8 relative">
      {onSkip && (
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors p-2"
          title="Skip onboarding"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Your Learning Dashboard
          </h1>
          <p className="text-slate-700">
            Track your progress with real-time metrics and visual insights.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Key Features:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg text-slate-600">
                  Monitor your proficiency, skills mastered, and completion
                  rates
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Goal Tracking
                </h3>
                <p className="text-lg text-slate-600">
                  Set and track your learning objectives with measurable
                  milestones
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Performance Analytics
                </h3>
                <p className="text-lg text-slate-600">
                  Analyze your progress with detailed performance insights
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Progress Intensity
                </h3>
                <p className="text-lg text-slate-600">
                  Customize your learning pace and curriculum difficulty
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center flex flex-col md:flex-row items-center justify-center gap-4">
          <button
            onClick={onComplete}
            className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-lg"
          >
            Go to Dashboard
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              className="w-full md:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 rounded-lg transition-all duration-200 font-medium text-lg"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
