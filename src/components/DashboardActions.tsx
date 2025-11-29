import React from "react";
import { ActionCard } from "./ActionCard";
import { Goal } from "../types";
import { virtues } from "../data";

interface DashboardActionsProps {
  goals: Goal[];
  selectedFont: string;
  getHeadingFontClass: (_font: string) => string;
  showCompletedActions: boolean;
  setShowCompletedActions: (_show: boolean) => void;
  openEditGoalModal: (_goal: Goal) => void;
  openDeleteModal: (_goal: Goal) => void;
  setGoals: (_goals: Goal[]) => void;
  saveUserState: (_state: any) => void;
  user: { name: string };
  handleOpenSaveModal: (_goal: any, _virtue: any) => void;
}

export const DashboardActions: React.FC<DashboardActionsProps> = ({
  goals,
  selectedFont,
  getHeadingFontClass,
  showCompletedActions,
  setShowCompletedActions,
  openEditGoalModal,
  openDeleteModal,
  setGoals,
  saveUserState,
  user,
  handleOpenSaveModal,
}) => {
  return (
    <div className="space-y-3">
      {/* No Actions Yet - shown when no goals exist */}
      {goals.length === 0 && (
        <div
          className="bg-white rounded-xl border border-slate-100 flex items-center justify-center"
          style={{ minHeight: "320px" }}
        >
          <div className="text-center">
            <h3
              className={`text-xl font-semibold text-slate-900 ${getHeadingFontClass(
                selectedFont
              )}`}
            >
              No Actions Yet
            </h3>
          </div>
        </div>
      )}

      {/* In Progress Goals */}
      {goals
        .filter((goal) => !goal.completed)
        .map((goal) => {
          const virtue = virtues.find((v) => v.id === goal.virtueId);
          if (!virtue) return null;
          return (
            <ActionCard
              key={goal.id}
              goal={goal}
              virtue={virtue}
              onEdit={openEditGoalModal}
              onDelete={openDeleteModal}
              onToggleComplete={(goalToToggle) => {
                const updatedGoal = {
                  ...goalToToggle,
                  completed: !goalToToggle.completed,
                };
                setGoals(
                  goals.map((g) => (g.id === goalToToggle.id ? updatedGoal : g))
                );
                saveUserState({
                  preferences: {
                    theme: "light",
                    notifications: true,
                    emailUpdates: true,
                    language: "en",
                    selectedVirtue: null,
                    name: user.name,
                    selectedFont: selectedFont,
                    selectedSDGs: [],
                    currentSelectedSDG: "",
                    hasCompletedSDGSetup: false,
                    newGoal: {
                      title: "",
                      description: "",
                      target: 1,
                    },
                    lastUpdated: new Date().toISOString(),
                    darkMode: false,
                  },
                  goals: goals.map((g) =>
                    g.id === goalToToggle.id ? updatedGoal : g
                  ),
                  progress: [],
                  currentScreen: 0,
                });
              }}
            />
          );
        })}

      {/* Completed Actions Section */}
      {goals.filter((goal) => goal.completed).length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-semibold text-slate-900 ${getHeadingFontClass(
                selectedFont
              )}`}
            >
              Completed Actions ({goals.filter((goal) => goal.completed).length}
              )
            </h3>
            <button
              onClick={() => setShowCompletedActions(!showCompletedActions)}
              className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
            >
              {showCompletedActions ? "Hide" : "Show"} Completed
            </button>
          </div>

          {showCompletedActions && (
            <div className="space-y-4">
              {goals
                .filter((goal) => goal.completed)
                .map((goal) => {
                  const virtue = virtues.find((v) => v.id === goal.virtueId);
                  if (!virtue) return null;

                  return (
                    <ActionCard
                      key={goal.id}
                      goal={goal}
                      virtue={virtue}
                      isCompleted={true}
                      onEdit={openEditGoalModal}
                      onDelete={openDeleteModal}
                      onToggleComplete={(goalToToggle) => {
                        const updatedGoal = {
                          ...goalToToggle,
                          completed: !goalToToggle.completed,
                        };
                        setGoals(
                          goals.map((g) =>
                            g.id === goalToToggle.id ? updatedGoal : g
                          )
                        );
                        saveUserState({
                          preferences: {
                            theme: "light",
                            notifications: true,
                            emailUpdates: true,
                            language: "en",
                            selectedVirtue: null,
                            name: user.name,
                            selectedFont: selectedFont,
                            selectedSDGs: [],
                            currentSelectedSDG: "",
                            hasCompletedSDGSetup: false,
                            newGoal: {
                              title: "",
                              description: "",
                              target: 1,
                            },
                            lastUpdated: new Date().toISOString(),
                            darkMode: false,
                          },
                          goals: goals.map((g) =>
                            g.id === goalToToggle.id ? updatedGoal : g
                          ),
                          progress: [],
                          currentScreen: 0,
                        });
                      }}
                      onSaveToDatabase={() => handleOpenSaveModal(goal, virtue)}
                    />
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
