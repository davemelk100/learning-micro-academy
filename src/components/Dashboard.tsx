import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit3, X, Sparkles, Star } from "lucide-react";
import { Goal, UserState, UserPreferences, LearningStyle } from "../types";
import { virtues } from "../data";
import { getHeadingFontClass, clearGoalCreationState } from "../utils";
import { AIInput } from "./AIInput";
import { AddActionButton } from "./AddActionButton";
import { ActionCard } from "./ActionCard";
import { SaveCompletedActionModal } from "./SaveCompletedActionModal";
import { CompletedActionsView } from "./CompletedActionsView";
import { SavedActionCard } from "./SavedActionCard";
import { UserStats } from "./UserStats";
import { databaseService } from "../services/databaseService";
import { CompletedAction } from "../types";

interface DashboardProps {
  user: { name: string; isNewUser: boolean };
  goals: Goal[];
  userStats: {
    totalGoals: number;
    completedGoals: number;
    totalPoints: number;
    weeklyProgress: number;
    currentStreak: number;
  };
  selectedFont: string;
  navigate: (path: string) => void;
  setNewGoal: (goal: UserPreferences["newGoal"]) => void;
  setGoals: (goals: Goal[]) => void;
  saveUserState: (state: UserState) => void;
  openEditGoalModal: (goal: Goal) => void;
  openDeleteModal: (goal: Goal) => void;
  handleProgressLevelChange: (level: number) => void;
  currentProgressLevel: number;
  showProgressDefinition: boolean;
  progressDefinitions: string[];
  deleteGoal?: (goalId: string) => void;
  editGoalModalOpen?: boolean;
  selectedGoalForEdit?: Goal | null;
  setEditGoalModalOpen?: (open: boolean) => void;
  setSelectedGoalForEdit?: (goal: Goal | null) => void;
  setProgressModalOpen?: (open: boolean) => void;
  progressModalOpen?: boolean;
  selectedGoalForProgress?: Goal | null;
  progressUpdate?: { amount: number; notes: string };
  setProgressUpdate?: (update: { amount: number; notes: string }) => void;
  updateGoalProgress?: (goalId: string, amount: number, notes: string) => void;
  setSelectedGoalForProgress?: (goal: Goal | null) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  goals,
  userStats,
  selectedFont,
  navigate,
  setNewGoal,
  setGoals,
  saveUserState,
  openEditGoalModal,
  openDeleteModal,
  handleProgressLevelChange,
  currentProgressLevel,
  showProgressDefinition,
  progressDefinitions,
}) => {
  // State for collapsible completed actions
  const [showCompletedActions, setShowCompletedActions] = useState(false);

  // State for database features
  const [showCompletedActionsView, setShowCompletedActionsView] =
    useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedGoalForSave, setSelectedGoalForSave] = useState<{
    goal: Goal;
    learningStyle: LearningStyle;
  } | null>(null);
  const [savedCompletedActions, setSavedCompletedActions] = useState<
    CompletedAction[]
  >([]);
  const [showSavedActions, setShowSavedActions] = useState(false);

  // Load saved completed actions on component mount
  useEffect(() => {
    const loadSavedActions = async () => {
      try {
        const actions = await databaseService.getCompletedActions();
        setSavedCompletedActions(
          actions.filter((action) => !action.isArchived)
        );
      } catch (error) {
        console.error("Failed to load saved actions:", error);
      }
    };
    loadSavedActions();
  }, []);

  // Database functionality handlers
  const handleSaveToDatabase = async (completedAction: CompletedAction) => {
    try {
      await databaseService.saveCompletedAction(completedAction);
      console.log("Completed action saved to database:", completedAction);

      // Refresh the saved actions list
      const actions = await databaseService.getCompletedActions();
      setSavedCompletedActions(actions.filter((action) => !action.isArchived));
    } catch (error) {
      console.error("Failed to save completed action:", error);
    }
  };

  const handleOpenSaveModal = (goal: Goal, learningStyle: LearningStyle) => {
    setSelectedGoalForSave({ goal, learningStyle });
    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    setSelectedGoalForSave(null);
  };

  const handleArchiveSavedAction = async (id: string) => {
    try {
      await databaseService.archiveCompletedAction(id);
      // Refresh the saved actions list
      const actions = await databaseService.getCompletedActions();
      setSavedCompletedActions(actions.filter((action) => !action.isArchived));
    } catch (error) {
      console.error("Failed to archive saved action:", error);
    }
  };

  const handleDeleteSavedAction = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this saved action?")) {
      try {
        await databaseService.deleteCompletedAction(id);
        // Refresh the saved actions list
        const actions = await databaseService.getCompletedActions();
        setSavedCompletedActions(
          actions.filter((action) => !action.isArchived)
        );
      } catch (error) {
        console.error("Failed to delete saved action:", error);
      }
    }
  };
  return (
    <div className="min-h-screen  max-w-[1200px] mx-auto bg-warm-white px-4 md:px-0">
      {/* Header */}
      <header>
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="hover:opacity-80 transition-opacity flex items-center space-x-2"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 51 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ shapeRendering: "geometricPrecision" }}
              >
                <g clipPath="url(#clip0_3153_5075)">
                  <path
                    d="M18.8926 2.5498C17.514 3.47523 16.3115 4.66469 15.4316 6.13867C13.0478 10.1315 12.8727 15.5974 15.5869 19.585L15.5967 19.5986C17.2049 21.8765 19.1905 23.6482 21.0518 25.3994L21.0566 25.4043C22.9768 27.1836 26.36 30.1312 28.3223 31.8838C30.1538 33.5746 31.6981 34.7233 32.4902 36.6045L32.6387 36.9912C33.7185 40.1042 33.0474 42.8706 32.9346 43.248L32.9199 43.2959C31.5815 47.7067 27.378 49.4408 26.7881 49.668C25.0788 50.2754 23.7083 50.3606 22.7861 50.3203L22.417 50.2969L22.0508 50.2578C21.6927 50.2127 21.3527 50.1504 20.9873 50.085C20.0489 49.9172 18.7691 49.624 17.209 49.0674L17.208 49.0664C7.7615 45.7003 1 36.6764 1 26.0742C1.00002 14.8515 8.57718 5.39941 18.8926 2.5498Z"
                    stroke="#8EA8C3"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d="M30.8906 2.85645C30.9268 2.85707 30.9551 2.85697 30.9736 2.85742C30.9828 2.85764 30.9898 2.85828 30.9941 2.8584H31.001C31.2178 2.86467 31.716 2.89111 32.3594 2.98047C32.8701 3.05147 33.779 3.18452 34.8418 3.56445V3.56543C35.0095 3.6261 35.5568 3.84216 36.7119 4.44531C37.6704 4.94713 38.5916 5.51207 39.4707 6.13281L39.8984 6.44922C45.9097 10.8949 49.8037 18.0303 49.8037 26.0791C49.8036 35.6307 44.3151 43.8996 36.3213 47.9072C40.0367 43.3219 39.8076 36.6584 36.959 31.8223L36.9521 31.8096L36.9443 31.7969C36.2809 30.7411 35.5256 29.895 34.8447 29.1611L34.8389 29.1553L34.833 29.1484L34.2432 28.543C31.2466 25.507 27.5703 22.3463 24.5498 19.5635C23.3708 18.4712 22.2329 17.4341 21.3535 16.4434L20.9932 16.0215C20.5486 15.4684 20.2779 15.0402 20.1035 14.5605L20.0986 14.5469L20.0928 14.5342L20.0127 14.3184C19.8366 13.8069 19.7288 13.2383 19.665 12.6455L19.6641 12.6348L19.6318 12.2871C19.3895 8.70406 21.9527 5.2691 25.4258 3.80762C26.7368 3.25536 28.1797 2.96166 29.6514 2.87891H29.6543C29.9917 2.85907 30.329 2.85352 30.585 2.85352C30.7122 2.85352 30.8179 2.85519 30.8906 2.85645Z"
                    stroke="#B43C00"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3153_5075">
                    <rect
                      width="50.8084"
                      height="50.6589"
                      fill="white"
                      transform="translate(0 0.669922)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-2xl font-bold text-slate-900">
                MicroLearn
              </span>
            </Link>
            {/* Navigation component would go here */}
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center mb-2">
            <span className="mr-3">
              <Sparkles className="h-5 w-5 text-blue-500" />
            </span>
            <h2
              className={`text-2xl font-bold text-slate-900 ${getHeadingFontClass(
                selectedFont
              )}`}
            >
              Welcome back, {user.name}!
            </h2>
          </div>
        </div>

        {/* AI Input Field */}
        <AIInput />

        {/* User Stats */}
        <UserStats
          userStats={userStats}
          selectedFont={selectedFont}
          getHeadingFontClass={getHeadingFontClass}
        />

        {/* Goals Overview */}
        <div
          className="bg-white rounded-lg border border-slate-100"
          style={{ minHeight: "320px" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-semibold text-slate-900 ${getHeadingFontClass(
                selectedFont
              )}`}
            >
              My Learning Actions
            </h3>
            <AddActionButton
              onClick={() => {
                // Clear goal creation state for fresh start
                const clearedState = clearGoalCreationState();
                setNewGoal(clearedState.newGoal);
                saveUserState({
                  preferences: clearedState,
                  goals: goals,
                  progress: [],
                  currentScreen: 0,
                });
                navigate("/goal-creation");
              }}
            />
          </div>

          <div className="space-y-3">
            {/* No Actions Yet - shown when no goals exist */}
            {goals.length === 0 && (
              <div
                className="bg-white rounded-xl border border-slate-100 flex items-center justify-center"
                style={{ minHeight: "320px" }}
              >
                <div className="text-center">
                  <h3
                    className={`text-lg font-semibold text-slate-900 ${getHeadingFontClass(
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
                const learningStyle = virtues.find(
                  (v) => v.id === goal.learningStyleId
                );
                return (
                  <div
                    key={goal.id}
                    className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={goal.completed}
                            onChange={(e) => {
                              const updatedGoal = {
                                ...goal,
                                completed: e.target.checked,
                              };
                              setGoals(
                                goals.map((g) =>
                                  g.id === goal.id ? updatedGoal : g
                                )
                              );
                              saveUserState({
                                preferences: {
                                  theme: "light",
                                  notifications: true,
                                  emailUpdates: true,
                                  language: "en",
                                  selectedLearningStyle: null,
                                  name: user.name,
                                  selectedFont: selectedFont,
                                  hasCompletedOnboarding: false,
                                  newGoal: {
                                    title: "",
                                    description: "",
                                    target: 1,
                                  },
                                  lastUpdated: new Date().toISOString(),
                                  darkMode: false,
                                  progressIntensity: 5,
                                },
                                goals: goals.map((g) =>
                                  g.id === goal.id ? updatedGoal : g
                                ),
                                progress: [],
                                currentScreen: 0,
                              });
                            }}
                            className="w-4 h-4 text-selection-brown border-slate-300 rounded focus:ring-selection-brown focus:ring-2"
                          />
                          <div>
                            <h4
                              className={`font-semibold text-slate-900 text-lg ${getHeadingFontClass(
                                selectedFont
                              )} ${
                                goal.completed
                                  ? "line-through text-slate-500"
                                  : ""
                              }`}
                            >
                              {goal.title}
                            </h4>
                            <p className="text-base text-slate-600 leading-normal">
                              {learningStyle?.name || "Unknown Learning Style"}
                            </p>
                            <p className="text-base text-slate-500 leading-normal">
                              {goal.title.includes("5 Minute")
                                ? "5 Minutes"
                                : goal.title.includes("15 Minute")
                                ? "15 Minutes"
                                : goal.title.includes("30 Minute")
                                ? "30 Minutes"
                                : goal.title.includes("1 Hour")
                                ? "1 Hour"
                                : "Time varies"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditGoalModal(goal)}
                          className="text-slate-600 hover:text-slate-900 transition-colors p-1"
                          title="Edit goal"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(goal)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Delete goal"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-base text-slate-600 leading-normal mb-3">
                      {goal.description}
                    </p>

                    {/* Community Action Data */}
                    {goal.communityActionData && (
                      <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <h5 className="text-base font-medium text-slate-800 mb-2">
                          Community Action Impact
                        </h5>
                        <div className="space-y-1 text-xs text-slate-600">
                          <div>
                            <span className="font-medium">
                              Impact on Yourself:
                            </span>{" "}
                            {goal.communityActionData.impactOnYourself === true
                              ? "Yes"
                              : goal.communityActionData.impactOnYourself ===
                                false
                              ? "No"
                              : "Not specified"}
                          </div>
                          <div>
                            <span className="font-medium">
                              Impact on Others:
                            </span>{" "}
                            {goal.communityActionData.impactOnOthers === true
                              ? "Yes"
                              : goal.communityActionData.impactOnOthers ===
                                false
                              ? "No"
                              : "Not specified"}
                          </div>
                          {goal.communityActionData.communityActionNotes && (
                            <div className="mt-2">
                              <span className="font-medium">Reflections:</span>
                              <p className="text-xs text-slate-600 mt-1 italic">
                                "{goal.communityActionData.communityActionNotes}
                                "
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Community Situation Data */}
                    {goal.communitySituationData && (
                      <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <h5 className="text-base font-medium text-slate-800 mb-2">
                          Community Situation Impact
                        </h5>
                        <div className="space-y-1 text-xs text-slate-600">
                          <div>
                            <span className="font-medium">
                              Impact on Yourself:
                            </span>{" "}
                            {goal.communitySituationData
                              .situationImpactOnYourself === true
                              ? "Yes"
                              : goal.communitySituationData
                                  .situationImpactOnYourself === false
                              ? "No"
                              : "Not specified"}
                          </div>
                          <div>
                            <span className="font-medium">
                              Impact on Others:
                            </span>{" "}
                            {goal.communitySituationData
                              .situationImpactOnOthers === true
                              ? "Yes"
                              : goal.communitySituationData
                                  .situationImpactOnOthers === false
                              ? "No"
                              : "Not specified"}
                          </div>
                          {goal.communitySituationData
                            .communitySituationNotes && (
                            <div className="mt-2">
                              <span className="font-medium">Reflections:</span>
                              <p className="text-xs text-slate-600 mt-1 italic">
                                "
                                {
                                  goal.communitySituationData
                                    .communitySituationNotes
                                }
                                "
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Draggable Progress Timeline */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="mb-3">
                        <h4 className="text-base font-medium text-slate-700 mb-2">
                          Update Progress
                        </h4>
                        <p className="text-xs text-slate-500 leading-normal">
                          Click to select your current progress level
                        </p>
                      </div>

                      {/* Progress Timeline - Vertical on Mobile, Horizontal on Desktop */}

                      {/* Mobile: Vertical Timeline */}
                      <div className="md:hidden relative pl-8">
                        {/* Continuous vertical timeline line */}
                        <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                        {/* Timeline items */}
                        <div className="relative flex flex-col space-y-6">
                          {[
                            { title: "None", level: 0 },
                            { title: "Slight", level: 1 },
                            { title: "Moderate", level: 2 },
                            { title: "Significant", level: 3 },
                            { title: "Dramatic", level: 4 },
                          ].map((milestone, index) => (
                            <div
                              key={index}
                              className="flex items-center relative cursor-pointer"
                              onClick={() =>
                                handleProgressLevelChange(milestone.level)
                              }
                            >
                              {/* Milestone dot */}
                              <div
                                className={`w-5 h-5 rounded-full border-2 ${
                                  currentProgressLevel >= milestone.level
                                    ? "bg-emerald-500 border-emerald-500"
                                    : "bg-white border-slate-300 hover:border-emerald-400"
                                } absolute -left-8 z-10 transition-all duration-200`}
                              />

                              {/* Milestone label */}
                              <div
                                className={`text-base font-normal leading-normal ${
                                  currentProgressLevel >= milestone.level
                                    ? "text-emerald-600 font-medium"
                                    : "text-slate-500"
                                }`}
                              >
                                {milestone.title}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Desktop: Horizontal Timeline */}
                      <div className="hidden md:block relative">
                        {/* Continuous timeline line */}
                        <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-slate-200"></div>

                        {/* Timeline items */}
                        <div className="relative flex justify-between items-start">
                          {[
                            { title: "None", level: 0 },
                            { title: "Slight", level: 1 },
                            { title: "Moderate", level: 2 },
                            { title: "Significant", level: 3 },
                            { title: "Dramatic", level: 4 },
                          ].map((milestone, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center relative flex-1 cursor-pointer"
                              onClick={() =>
                                handleProgressLevelChange(milestone.level)
                              }
                            >
                              {/* Milestone dot */}
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  currentProgressLevel >= milestone.level
                                    ? "bg-emerald-500 border-emerald-500"
                                    : "bg-white border-slate-300 hover:border-emerald-400"
                                } relative z-10 transition-all duration-200`}
                              />

                              {/* Milestone label */}
                              <div
                                className={`text-xs font-normal leading-normal mt-2 text-center px-1 ${
                                  currentProgressLevel >= milestone.level
                                    ? "text-emerald-600 font-medium"
                                    : "text-slate-500"
                                }`}
                              >
                                {milestone.title}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress Definition Display */}
                      {showProgressDefinition && (
                        <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl">
                          <p className="text-base text-emerald-800 leading-normal">
                            {progressDefinitions[currentProgressLevel]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
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
                    Completed Actions (
                    {goals.filter((goal) => goal.completed).length})
                  </h3>
                  <button
                    onClick={() =>
                      setShowCompletedActions(!showCompletedActions)
                    }
                    className="text-slate-600 hover:text-slate-900 transition-colors text-base font-medium"
                  >
                    {showCompletedActions ? "Hide" : "Show"} Completed
                  </button>
                </div>

                {showCompletedActions && (
                  <div className="space-y-4">
                    {goals
                      .filter((goal) => goal.completed)
                      .map((goal) => {
                        const learningStyle = virtues.find(
                          (v) => v.id === goal.learningStyleId
                        );
                        if (!learningStyle) return null;

                        return (
                          <ActionCard
                            key={goal.id}
                            goal={goal}
                            virtue={learningStyle}
                            isCompleted={true}
                            onEdit={openEditGoalModal}
                            onDelete={openDeleteModal}
                            onToggleComplete={(goal) => {
                              const updatedGoal = {
                                ...goal,
                                completed: !goal.completed,
                              };
                              setGoals(
                                goals.map((g) =>
                                  g.id === goal.id ? updatedGoal : g
                                )
                              );
                              saveUserState({
                                preferences: {
                                  theme: "light",
                                  notifications: true,
                                  emailUpdates: true,
                                  language: "en",
                                  selectedLearningStyle: null,
                                  name: user.name,
                                  selectedFont: selectedFont,
                                  hasCompletedOnboarding: false,
                                  newGoal: {
                                    title: "",
                                    description: "",
                                    target: 1,
                                  },
                                  lastUpdated: new Date().toISOString(),
                                  darkMode: false,
                                  progressIntensity: 5,
                                },
                                goals: goals.map((g) =>
                                  g.id === goal.id ? updatedGoal : g
                                ),
                                progress: [],
                                currentScreen: 0,
                              });
                            }}
                            onSaveToDatabase={(_completedAction) => {
                              handleOpenSaveModal(goal, learningStyle);
                            }}
                          />
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Saved Actions from Database */}
          {savedCompletedActions.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold text-slate-900 ${getHeadingFontClass(
                    selectedFont
                  )}`}
                >
                  Saved Actions ({savedCompletedActions.length})
                </h3>
                <button
                  onClick={() => setShowSavedActions(!showSavedActions)}
                  className="text-slate-600 hover:text-slate-900 transition-colors text-base font-medium"
                >
                  {showSavedActions ? "Hide" : "Show"} Saved Actions
                </button>
              </div>

              {showSavedActions && (
                <div className="space-y-4">
                  {savedCompletedActions.map((completedAction) => (
                    <SavedActionCard
                      key={completedAction.id}
                      completedAction={completedAction}
                      onArchive={handleArchiveSavedAction}
                      onDelete={handleDeleteSavedAction}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            to="/progress"
            className="px-4 py-2 bg-button-dark hover:bg-slate-800 text-white rounded-lg text-base transition-colors"
          >
            Update Progress
          </Link>
          <Link
            to="/actions"
            className="px-6 py-2 bg-button-dark hover:bg-slate-800 text-white rounded-lg text-base transition-colors"
          >
            Save
          </Link>
          <Link
            to="/edit-actions"
            className="px-4 py-2 bg-button-dark hover:bg-slate-800 text-white rounded-lg text-base transition-colors"
          >
            Update Action
          </Link>
          <button
            onClick={() => setShowCompletedActionsView(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-base transition-colors flex items-center space-x-2"
          >
            <Star className="h-5 w-5" />
            <span>View Database</span>
          </button>
        </div>
      </div>

      {/* Modals and Views */}
      {showCompletedActionsView && (
        <CompletedActionsView
          onClose={() => setShowCompletedActionsView(false)}
        />
      )}

      {showSaveModal && selectedGoalForSave && (
        <SaveCompletedActionModal
          isOpen={showSaveModal}
          onClose={handleCloseSaveModal}
          onSave={handleSaveToDatabase}
          goal={selectedGoalForSave!.goal}
          learningStyle={selectedGoalForSave!.learningStyle}
        />
      )}
    </div>
  );
};
