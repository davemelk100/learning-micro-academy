import React from "react";
import { Target } from "lucide-react";
import { Goal } from "../types";
import { virtues } from "../data";

interface ActionsOverviewProps {
  goals: Goal[];
  navigateToScreen: (screen: number) => void;
  expandedCards: Set<string>;
  toggleCardExpansion: (cardId: string) => void;
  selectedAmountChange1: string | null;
  setSelectedAmountChange1: (value: string | null) => void;
}

export const ActionsOverview: React.FC<ActionsOverviewProps> = ({
  goals,
  navigateToScreen,
  expandedCards,
  toggleCardExpansion,
  selectedAmountChange1,
  setSelectedAmountChange1,
}) => {
  return (
    <div className="bg-slate-50 object-cover p-4 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateToScreen(17)}
          className="text-lg md:text-xl font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
        >
          Your Virtue Journey
        </button>
        <button
          onClick={() => navigateToScreen(11)}
          className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
        >
          Add Action
        </button>
      </div>

      <div className="space-y-3">
        {/* Sample goal - always shown when no real goals exist */}
        {goals.length === 0 && (
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-400 rounded-full overflow-hidden flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Grace
                  </h4>
                  <p className="text-xs text-slate-600">
                    Practice Daily Meditation
                  </p>
                  <p className="text-xs text-slate-500">30 Minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Action created
                </div>
                <button
                  onClick={() => toggleCardExpansion("sample-card")}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {expandedCards.has("sample-card") ? (
                    <svg
                      className="w-4 h-4"
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
                      className="w-4 h-4"
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
                </button>
              </div>
            </div>

            {expandedCards.has("sample-card") && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-sm text-slate-600 mb-3">
                  Develop a consistent meditation practice to improve
                  mindfulness and reduce stress. Start with 10 minutes daily and
                  gradually increase to 30 minutes.
                </p>

                {/* Amount of Change Timeline */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-700">
                      Amount of Change
                    </span>
                  </div>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-slate-200"></div>

                    {/* Timeline items */}
                    <div className="flex justify-between">
                      {[
                        "No Change",
                        "Slight Change",
                        "Moderate Change",
                        "Significant Change",
                        "Dramatic Change",
                      ].map((changeType) => (
                        <div
                          key={changeType}
                          className="flex flex-col items-center"
                        >
                          <div
                            className={`w-3 h-3 rounded-full border-2 z-10 transition-all ${
                              selectedAmountChange1 === changeType
                                ? "bg-blue-600 border-blue-600"
                                : "bg-white border-slate-300"
                            }`}
                          ></div>
                          <button
                            onClick={() =>
                              setSelectedAmountChange1(
                                selectedAmountChange1 === changeType
                                  ? null
                                  : changeType
                              )
                            }
                            className={`mt-2 text-xs font-medium transition-colors text-center ${
                              selectedAmountChange1 === changeType
                                ? "text-blue-600"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {changeType}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User's actual goals */}
        {goals.map((goal) => {
          const virtue = virtues.find((v) => v.id === goal.virtueId);
          const IconComponent = virtue?.icon;
          return (
            <div
              key={goal.id}
              className="bg-white p-4 rounded-2xl shadow-md border border-slate-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${
                      virtue?.color || "0"
                    } rounded-full overflow-hidden flex items-center justify-center`}
                  >
                    {IconComponent && (
                      <IconComponent className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {virtue?.name || "Unknown Virtue"}
                    </h4>
                    <p className="text-xs text-slate-600">{goal.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
