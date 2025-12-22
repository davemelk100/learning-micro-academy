import React from "react";
import { Target, Flame, Check, BookOpen, CheckCircle2 } from "lucide-react";
import { Goal } from "../types";
import { courses } from "../data";

interface ActionsOverviewProps {
  goals: Goal[];
  navigateToScreen: (_path: string) => void;
  expandedCards: Set<string>;
  toggleCardExpansion: (_cardId: string) => void;
  onNavigateToCourse?: (_courseId: string) => void;
  completedCourses?: string[];
  courseProgress?: {
    [courseId: string]: {
      completedLessons: string[];
      lastAccessed?: string;
    };
  };
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
  courseProgress = {},
  userStats,
}) => {
  const streak = userStats?.currentStreak ?? 0;

  // Calculate course progress percentage
  const getCourseProgress = (courseId: string): number => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;

    const progress = courseProgress[courseId];
    if (!progress || !progress.completedLessons) return 0;

    const totalLessons = course.lessons.length;
    const completedLessons = progress.completedLessons.length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  // Get courses with progress (in-progress or completed)
  const getCoursesWithProgress = () => {
    return courses.filter((course) => {
      const isCompleted = completedCourses.includes(course.id);
      const progress = getCourseProgress(course.id);
      return isCompleted || progress > 0;
    });
  };

  const coursesWithProgress = getCoursesWithProgress();

  // Calculate course statistics
  const totalCourses = coursesWithProgress.length;
  const thisWeekCourses = coursesWithProgress.filter((course) => {
    const progress = courseProgress[course.id];
    if (!progress?.lastAccessed) return false;
    const lastAccessed = new Date(progress.lastAccessed);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastAccessed >= weekAgo;
  }).length;

  return (
    <div className="bg-slate-50 p-4 md:p-6 border border-slate-100 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">
          Learning Activity
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-start mb-3">
            <Target className="h-9 w-9 text-slate-600" />
          </div>
          <div className="text-base font-medium text-slate-600 mb-2 text-left">
            Courses - Total
          </div>
          <p className="text-base font-bold text-slate-900 text-left">
            {totalCourses}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-start mb-3">
            <Flame className="h-9 w-9 text-orange-500" />
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
            <Check className="h-9 w-9 text-blue-500" />
          </div>
          <div className="text-base font-medium text-slate-600 mb-2 text-left">
            Courses - This Week
          </div>
          <p className="text-base font-bold text-slate-900 text-left">
            {thisWeekCourses}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Course Cards */}
        {coursesWithProgress.length > 0 && (
          <>
            {coursesWithProgress.map((course) => {
              const progress = getCourseProgress(course.id);
              const isCompleted = completedCourses.includes(course.id);
              const cardId = `course-${course.id}`;
              const isExpanded = expandedCards.has(cardId);

              return (
                <div
                  key={course.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
                >
                  <button
                    onClick={() => toggleCardExpansion(cardId)}
                    className="w-full flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-7 w-7 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900">
                          {course.title}
                        </h4>
                        {isCompleted && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-lg text-slate-600">
                          {course.category}
                        </p>
                        <p className="text-lg text-slate-500">•</p>
                        <p className="text-lg text-slate-500">{course.level}</p>
                      </div>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-lg text-lg font-medium whitespace-nowrap ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isCompleted ? "Completed" : `${progress}% Complete`}
                      </div>
                    </div>
                    <div className="text-slate-400 ml-3 flex-shrink-0 flex items-center">
                      {isExpanded ? (
                        <svg
                          className="w-8 h-8"
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
                          className="w-8 h-8"
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
                  </button>

                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-slate-200">
                      <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                        {course.description}
                      </p>
                      {onNavigateToCourse && !isCompleted && (
                        <button
                          onClick={() => onNavigateToCourse(course.id)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-lg font-medium transition-colors text-lg mb-5"
                        >
                          Continue Course
                        </button>
                      )}

                      <div className="pt-5 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-medium text-slate-700">
                            Course Progress
                          </span>
                          <span className="text-lg font-semibold text-slate-900">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isCompleted ? "bg-green-600" : "bg-blue-600"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
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
                    <Target className="h-7 w-7 text-white" />
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
                    className={`inline-flex items-center px-2 py-1 rounded-lg text-lg font-medium whitespace-nowrap ${
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
