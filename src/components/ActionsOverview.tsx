import React from "react";
import { Target, Flame, Check } from "lucide-react";
import { Goal } from "../types";
import { courses } from "../data";
import { VirtueProgress } from "./VirtueProgress";

interface ActionsOverviewProps {
  goals: Goal[];
  navigateToScreen: (_screen: number) => void;
  expandedCards: Set<string>;
  toggleCardExpansion: (_cardId: string) => void;
  onNavigateToCourse?: (_courseId: string) => void;
  completedCourses?: string[];
  userStats?: {
    currentStreak: number;
    totalGoals?: number;
    completedGoals?: number;
  };
}

export const ActionsOverview: React.FC<ActionsOverviewProps> = ({
  goals,
  navigateToScreen: _navigateToScreen,
  expandedCards,
  toggleCardExpansion,
  onNavigateToCourse,
  completedCourses = [],
  userStats,
}) => {
  const totalGoals = userStats?.totalGoals ?? goals.length;
  const thisWeekActions = userStats?.completedGoals ?? 2;
  const streak = userStats?.currentStreak ?? 0;

  return (
    <div className="bg-slate-50 p-4 md:p-6 border border-slate-100 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">
          Learning Activity
        </h2>
      </div>

      <div className="mb-6">
        <VirtueProgress />
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-start mb-3">
            <Target className="h-5 w-5 text-slate-600" />
          </div>
          <div className="text-base font-medium text-slate-600 mb-2 text-left">
            Actions - Total
          </div>
          <p className="text-base font-bold text-slate-900 text-left">
            {totalGoals}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-start mb-3">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-base font-medium text-slate-600 mb-2 text-left">
            Streak
          </div>
          <p className="text-base font-bold text-slate-900 text-left">
            {streak}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-start mb-3">
            <Check className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-base font-medium text-slate-600 mb-2 text-left">
            Actions - This Week
          </div>
          <p className="text-base font-bold text-slate-900 text-left">
            {thisWeekActions}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {goals.length === 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <button
              onClick={() => toggleCardExpansion("sample-card")}
              className="w-full flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity text-left"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-slate-900 mb-1">
                    Intro to UX
                  </h4>
                  <p className="text-lg text-slate-600 mb-1">
                    Complete UX Fundamentals Course
                  </p>
                  <p className="text-lg text-slate-500">4 Weeks</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-lg font-medium bg-amber-100 text-amber-800 whitespace-nowrap">
                  Action created
                </div>
                <div className="text-slate-400">
                  {expandedCards.has("sample-card") ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            {expandedCards.has("sample-card") && (
              <div className="mt-5 pt-5 border-t border-slate-200">
                <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                  Complete the UX design fundamentals course to build practical
                  skills in user research, wireframing, and prototyping.
                  Dedicate 30 minutes daily to progress through the lessons and
                  hands-on exercises.
                </p>
                {onNavigateToCourse && (
                  <button
                    onClick={() => onNavigateToCourse("intro-to-ux")}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-full font-medium transition-colors text-lg mb-5"
                  >
                    Continue Course
                  </button>
                )}

                <div className="pt-5 border-t border-slate-200">
                  {(() => {
                    const sampleCourse = courses.find(
                      (c) => c.id === "intro-to-ux"
                    );
                    const sampleCompleteness =
                      sampleCourse && completedCourses.includes(sampleCourse.id)
                        ? 100
                        : 0;
                    return (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-medium text-slate-700">
                            Course Completeness
                          </span>
                          <span className="text-lg font-semibold text-slate-900">
                            {sampleCompleteness}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${sampleCompleteness}%` }}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {goals.map((goal) => {
          return (
            <div
              key={goal.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-slate-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">
                      {goal.title}
                    </h4>
                    <p className="text-lg text-slate-600">{goal.description}</p>
                  </div>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-lg font-medium whitespace-nowrap ${
                      goal.completed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {goal.completed ? "Completed" : "Action created"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
