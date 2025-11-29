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
  navigateToScreen,
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
    <div className="bg-slate-50 object-cover p-4 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateToScreen(17)}
          className="text-lg md:text-xl font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
        >
          Learning Activity
        </button>
      </div>

      <div className="mb-6">
        <VirtueProgress navigateToScreen={navigateToScreen} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="h-4 w-4 text-slate-600" />
            <span className="text-xs font-medium text-slate-600">
              Actions - Total
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900">{totalGoals}</p>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100">
          <div className="flex items-center space-x-2 mb-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-medium text-slate-600">Streak</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{streak}</p>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100">
          <div className="flex items-center space-x-2 mb-1">
            <Check className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-slate-600">
              Actions - This Week
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900">{thisWeekActions}</p>
        </div>
      </div>

      <div className="space-y-3">
        {goals.length === 0 && (
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
            <button
              onClick={() => toggleCardExpansion("sample-card")}
              className="w-full flex items-center justify-between mb-3 cursor-pointer hover:opacity-80 transition-opacity text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-400 rounded-full overflow-hidden flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Intro to UX
                  </h4>
                  <p className="text-xs text-slate-600">
                    Complete UX Fundamentals Course
                  </p>
                  <p className="text-xs text-slate-500">4 Weeks</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 whitespace-nowrap">
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
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-sm text-slate-600 mb-3">
                  Complete the UX design fundamentals course to build practical
                  skills in user research, wireframing, and prototyping.
                  Dedicate 30 minutes daily to progress through the lessons and
                  hands-on exercises.
                </p>
                {onNavigateToCourse && (
                  <button
                    onClick={() => onNavigateToCourse("intro-to-ux")}
                    className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-full font-medium transition-colors text-sm"
                  >
                    Continue Course
                  </button>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100">
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
                          <span className="text-xs font-medium text-slate-700">
                            Course Completeness
                          </span>
                          <span className="text-xs font-semibold text-slate-900">
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
              className="bg-white p-4 rounded-2xl shadow-md border border-slate-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-400 rounded-full overflow-hidden flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {goal.title}
                    </h4>
                    <p className="text-xs text-slate-600">{goal.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
