import React, { useState, useEffect, useCallback } from "react";
import { Pagination } from "./components/Pagination";
import { HomeDashboardScreen } from "./screens/HomeDashboardScreen";
import { CourseLibraryScreen } from "./components/CourseLibraryScreen";
import { AuthModal } from "./components/Auth/AuthModal";
import { UserProfile } from "./components/Profile/UserProfile";
import { Navigation } from "./components/Navigation";
import { createNavigationComponent } from "./components/NavigationWrapper";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { useAuth } from "./contexts/AuthContext";
import { saveUserState, getUserState } from "./utils";
import { UserState, Goal } from "./types";
import { courses } from "./data";
import { appContent, formatText } from "./content/appContent";
import {
  Users,
  Sparkles,
  Check,
  RefreshCw,
  Eye,
  Headphones,
  BookOpen,
  User,
  Activity,
  Network,
} from "lucide-react";

interface LearningStyle {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  iconColor: string;
  description: string;
}

const learningStyles: LearningStyle[] = [
  {
    id: "visual",
    name: appContent.learningStyles.visual.name,
    icon: Eye,
    color: "bg-[#e6243c]",
    iconColor: "text-[#e6243c]",
    description: appContent.learningStyles.visual.description,
  },
  {
    id: "auditory",
    name: appContent.learningStyles.auditory.name,
    icon: Headphones,
    color: "bg-[#dfa739]",
    iconColor: "text-[#dfa739]",
    description: appContent.learningStyles.auditory.description,
  },
  {
    id: "kinesthetic",
    name: appContent.learningStyles.kinesthetic.name,
    icon: Activity,
    color: "bg-[#4aa236]",
    iconColor: "text-[#4aa236]",
    description: appContent.learningStyles.kinesthetic.description,
  },
  {
    id: "reading-writing",
    name: appContent.learningStyles.readingWriting.name,
    icon: BookOpen,
    color: "bg-red-400",
    iconColor: "text-red-500",
    description: appContent.learningStyles.readingWriting.description,
  },
  {
    id: "social",
    name: appContent.learningStyles.social.name,
    icon: Users,
    color: "bg-pink-400",
    iconColor: "text-pink-500",
    description: appContent.learningStyles.social.description,
  },
  {
    id: "solitary",
    name: appContent.learningStyles.solitary.name,
    icon: User,
    color: "bg-blue-400",
    iconColor: "text-blue-500",
    description: appContent.learningStyles.solitary.description,
  },
  {
    id: "logical",
    name: appContent.learningStyles.logical.name,
    icon: Network,
    color: "bg-purple-400",
    iconColor: "text-purple-500",
    description: appContent.learningStyles.logical.description,
  },
];

function App() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [userState, setUserState] = useState<UserState>({
    preferences: {
      theme: "light",
      notifications: true,
      emailUpdates: true,
      language: "en",
      selectedLearningStyle: null,
      hasCompletedOnboarding: false,
      newGoal: {
        title: "",
        description: "",
        target: 0,
      },
      lastUpdated: new Date().toISOString(),
      name: appContent.defaults.guestName,
      selectedFont: "philosopher-mulish",
      darkMode: false,
      progressIntensity: 5,
      completedCourses: [],
    },
    goals: [],
    progress: [],
    currentScreen: 0,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loadingUserState, setLoadingUserState] = useState(true);

  useEffect(() => {
    const loadUserState = async () => {
      setLoadingUserState(true);
      try {
        const state = await getUserState();
        setUserState(state);
      } catch (error) {
        console.error("Error loading user state:", error);
      } finally {
        setLoadingUserState(false);
      }
    };
    loadUserState();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!loadingUserState) {
      saveUserState(userState).catch(console.error);
    }
  }, [userState, loadingUserState]);

  const [currentScreen, setCurrentScreen] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    undefined
  );
  const [selectedLearningStyle, setSelectedLearningStyle] =
    useState<LearningStyle | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
  });
  const displayUser = user || {
    name: appContent.defaults.guestName,
    isNewUser: true,
  };
  const [isLoadingGoalSuggestions, setIsLoadingGoalSuggestions] =
    useState(false);
  const [showGoalSuggestions, setShowGoalSuggestions] = useState(false);
  const [isLoadingAIAssistance, setIsLoadingAIAssistance] = useState(false);
  const [aiSelectedLearningStyle, setAiSelectedLearningStyle] = useState<
    string | null
  >(null);
  const [aiLearningStyleSelectionReason, setAiLearningStyleSelectionReason] =
    useState<string>("");
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [_step7AmountChange, _setStep7AmountChange] = useState(0);

  const [selectedAIAction, setSelectedAIAction] = useState<string | null>(null);

  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedGoalForProgress, setSelectedGoalForProgress] =
    useState<Goal | null>(null);
  const [progressUpdate, setProgressUpdate] = useState({
    amount: 1,
    notes: "",
  });

  const navigateToScreen = useCallback((screen: number) => {
    setCurrentScreen(screen);
    window.history.pushState({ screen }, "", `#screen-${screen}`);
  }, []);

  const updateGoalProgress = (
    goalId: string,
    amount: number,
    _notes: string
  ) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const newProgress = Math.min(100, goal.progress + amount);
          const completed = newProgress >= 100;

          return {
            ...goal,
            progress: newProgress,
            completed,
          };
        }
        return goal;
      })
    );
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen !== undefined) {
        setCurrentScreen(event.state.screen);
      }
    };

    window.history.replaceState(
      { screen: currentScreen },
      "",
      `#screen-${currentScreen}`
    );

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentScreen]);

  useEffect(() => {
    if (displayUser.isNewUser) {
      navigateToScreen(1);
    } else {
      navigateToScreen(0);
    }
  }, [displayUser.isNewUser, navigateToScreen]);

  const getSuggestedCourses = () => {
    if (!selectedLearningStyle) {
      return courses.slice(0, 3);
    }
    return courses.slice(0, 3);
  };

  useEffect(() => {
    if (currentScreen === 3 && selectedLearningStyle) {
      setIsLoadingGoalSuggestions(true);
      setShowGoalSuggestions(false);

      const timer = setTimeout(() => {
        setIsLoadingGoalSuggestions(false);
        setShowGoalSuggestions(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentScreen, selectedLearningStyle]);

  const handleLearningStyleAIAssistanceClick = () => {
    setIsLoadingAIAssistance(true);
    setAiSelectedLearningStyle(null);
    setAiLearningStyleSelectionReason("");

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * learningStyles.length);
      const selectedLearningStyle = learningStyles[randomIndex];

      const learningStyleReasons: Record<string, string> = {
        "intro-to-ux": appContent.learningStyleReasons.introToUx,
        "design-systems": appContent.learningStyleReasons.designSystems,
        "web-development": appContent.learningStyleReasons.webDevelopment,
        "product-strategy": appContent.learningStyleReasons.productStrategy,
        "data-analytics": appContent.learningStyleReasons.dataAnalytics,
      };

      setAiSelectedLearningStyle(selectedLearningStyle.id);
      const reasonTemplate =
        learningStyleReasons[selectedLearningStyle.id] ||
        appContent.learningStyleReasons.default;
      setAiLearningStyleSelectionReason(
        formatText(reasonTemplate, {
          learningStyleName: selectedLearningStyle.name,
        })
      );
      setIsLoadingAIAssistance(false);
    }, 2000);
  };

  const [userStats] = useState({
    totalGoals: 12,
    completedGoals: 8,
    currentStreak: 7,
    weeklyProgress: 85,
    monthlyProgress: 72,
    totalPoints: 2450,
  });

  const HomeDashboardScreenComponent = () => (
    <HomeDashboardScreen
      user={{
        name: displayUser.name || appContent.defaults.guestName,
        isNewUser: displayUser.isNewUser ?? true,
      }}
      goals={goals}
      userStats={userStats}
      navigateToScreen={navigateToScreen}
      Navigation={createNavigationComponent({
        currentScreen,
        navigateToScreen,
        setShowAuthModal,
        setShowProfileModal,
        getUserState,
        setUserState,
        onNavigateToCourseLibrary: () => setSelectedCourseId(undefined),
      })}
      editingGoal={editingGoal}
      setEditingGoal={setEditingGoal}
      newGoal={newGoal}
      setNewGoal={setNewGoal}
      setGoals={setGoals}
      progressModalOpen={progressModalOpen}
      setProgressModalOpen={setProgressModalOpen}
      selectedGoalForProgress={selectedGoalForProgress}
      setSelectedGoalForProgress={setSelectedGoalForProgress}
      progressUpdate={progressUpdate}
      setProgressUpdate={setProgressUpdate}
      updateGoalProgress={updateGoalProgress}
      onNavigateToCourse={(courseId) => {
        setSelectedCourseId(courseId);
        navigateToScreen(21);
      }}
      completedCourses={userState?.preferences?.completedCourses || []}
      courseProgress={userState?.preferences?.courseProgress || {}}
    />
  );

  const LearningStyleSelectionScreen = () => {
    const [isListView] = useState(false);
    return (
      <div className="min-h-screen  max-w-[1200px] mx-auto">
        <header>
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => navigateToScreen(1)}
                  className="hover:opacity-80 transition-opacity"
                >
                  <span className="text-2xl font-bold text-slate-900">
                    {appContent.brand.name}
                  </span>
                </button>
              </div>
              <Navigation
                currentScreen={currentScreen}
                navigateToScreen={navigateToScreen}
                setShowAuthModal={setShowAuthModal}
                setShowProfileModal={setShowProfileModal}
                getUserState={getUserState}
                setUserState={setUserState}
              />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="max-w-md mx-auto md:max-w-[calc(42rem+400px)] lg:max-w-[calc(42rem+400px)]">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <h2 className="text-2xl font-bold">
                  {appContent.screens.learningStyleSelection.title}
                </h2>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col mb-4 lg:mb-0">
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">
                        {appContent.screens.learningStyleSelection.header}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-blue-500 animate-bounce transition-all duration-300 hover:scale-110 hover:drop-shadow-lg" />
                        <button
                          onClick={handleLearningStyleAIAssistanceClick}
                          className="text-lg text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          {appContent.ai.helpButton}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoadingAIAssistance && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
                    <p className="text-slate-600">
                      {appContent.ai.loading.learningStyle}
                    </p>
                  </div>
                )}

                {aiSelectedLearningStyle && aiLearningStyleSelectionReason && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 object-cover">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-blue-900 mb-2">
                          {appContent.ai.recommendation.title}
                        </h4>
                        <p className="text-lg text-blue-800 mb-3">
                          {aiLearningStyleSelectionReason}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const learningStyle = learningStyles.find(
                                (v) => v.id === aiSelectedLearningStyle
                              );
                              if (learningStyle) {
                                setSelectedLearningStyle(learningStyle);
                                setAiSelectedLearningStyle(null);
                                setAiLearningStyleSelectionReason("");
                              }
                            }}
                            className="text-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 object-cover transition-colors"
                          >
                            {appContent.ai.recommendation.accept}
                          </button>
                          <button
                            onClick={handleLearningStyleAIAssistanceClick}
                            className="text-lg bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 object-cover transition-colors flex items-center space-x-1"
                          >
                            <RefreshCw className="h-5 w-5" />
                            <span>
                              {appContent.ai.recommendation.tryAnother}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <Pagination
                    currentStep={2}
                    totalSteps={7}
                    onPrevious={() => navigateToScreen(11)}
                    onNext={() => selectedLearningStyle && navigateToScreen(3)}
                    canGoPrevious={true}
                    canGoNext={!!selectedLearningStyle}
                    previousLabel={appContent.pagination.back}
                    nextLabel={appContent.pagination.next}
                  />
                </div>

                <div
                  className={`${
                    isListView
                      ? "space-y-3"
                      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                  } mb-8`}
                >
                  {learningStyles.map((learningStyle) => {
                    const IconComponent = learningStyle.icon;
                    return (
                      <button
                        key={learningStyle.id}
                        onClick={() => setSelectedLearningStyle(learningStyle)}
                        className={`${
                          isListView
                            ? "w-full p-3 rounded-md border-2 transition-all duration-200 relative flex items-center space-x-4"
                            : "flex flex-col items-center p-3 rounded-full transition-all duration-200 relative"
                        }`}
                      >
                        <div
                          className={`${
                            isListView
                              ? "mb-0 flex-shrink-0"
                              : "mb-2 flex justify-center"
                          } relative`}
                        >
                          <div
                            className={`${
                              isListView ? "w-10 h-10" : "w-20 h-20"
                            } rounded-full flex items-center justify-center relative shadow-lg backdrop-blur-md ${
                              selectedLearningStyle?.id === learningStyle.id
                                ? "bg-white/30 border-2 border-blue-500 ring-2 ring-blue-200 ring-offset-2"
                                : aiSelectedLearningStyle === learningStyle.id
                                ? "bg-white/30 border-2 border-green-500 ring-2 ring-green-200 ring-offset-2"
                                : "bg-white/20 border border-white/30"
                            }`}
                          >
                            <IconComponent
                              className={`${
                                isListView ? "h-5 w-5" : "h-10 w-10"
                              } ${
                                selectedLearningStyle?.id === learningStyle.id
                                  ? "text-blue-600"
                                  : aiSelectedLearningStyle === learningStyle.id
                                  ? "text-green-600"
                                  : "text-slate-700"
                              }`}
                            />
                          </div>
                          {selectedLearningStyle?.id === learningStyle.id && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {aiSelectedLearningStyle === learningStyle.id &&
                            selectedLearningStyle?.id !== learningStyle.id && (
                              <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                            )}
                        </div>
                        <div
                          className={
                            isListView ? "flex-1 min-w-0" : "text-center"
                          }
                        >
                          <p
                            className={`${
                              isListView
                                ? "text-lg font-medium text-slate-800 text-left"
                                : "text-lg font-medium text-slate-800 leading-tight"
                            }`}
                          >
                            {learningStyle.name}
                          </p>
                          {isListView && (
                            <p className="text-lg text-slate-600 mt-1 text-left">
                              {formatText(appContent.buttons.clickToSelect, {
                                action:
                                  selectedLearningStyle?.id === learningStyle.id
                                    ? appContent.buttons.deselect
                                    : appContent.buttons.select,
                              })}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GoalCreationScreen = () => {
    return (
      <div className="min-h-screen  max-w-[1200px] mx-auto">
        <header>
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => navigateToScreen(1)}
                  className="hover:opacity-80 transition-opacity"
                >
                  <span className="text-2xl font-bold text-slate-900">
                    {appContent.brand.name}
                  </span>
                </button>
              </div>
              <Navigation
                currentScreen={currentScreen}
                navigateToScreen={navigateToScreen}
                setShowAuthModal={setShowAuthModal}
                setShowProfileModal={setShowProfileModal}
                getUserState={getUserState}
                setUserState={setUserState}
              />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="max-w-md mx-auto md:max-w-[calc(42rem+400px)] lg:max-w-[calc(42rem+400px)]">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {appContent.screens.goalCreation.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <Pagination
                    currentStep={3}
                    totalSteps={7}
                    onPrevious={() => navigateToScreen(2)}
                    canGoPrevious={true}
                    canGoNext={
                      !!(newGoal.title && newGoal.description) ||
                      !!selectedAIAction
                    }
                    onNext={() => {
                      if (newGoal.title && newGoal.description) {
                        const goal: Goal = {
                          id: Date.now().toString(),
                          learningStyleId: selectedLearningStyle!.id,
                          title: newGoal.title,
                          description: newGoal.description,
                          progress: 0,
                          target: 100,
                          completed: false,
                        };
                        setGoals([...goals, goal]);
                        navigateToScreen(0);
                      } else if (selectedAIAction) {
                        const selectedCourse = courses.find(
                          (c) => c.id === selectedAIAction
                        );

                        if (!selectedCourse) {
                          return;
                        }

                        const goal: Goal = {
                          id: Date.now().toString(),
                          learningStyleId: selectedLearningStyle!.id,
                          title: selectedCourse.title,
                          description: selectedCourse.description,
                          progress: 0,
                          target: 100,
                          completed: false,
                        };
                        setGoals([...goals, goal]);
                        navigateToScreen(0);
                      }
                    }}
                    previousLabel={appContent.pagination.back}
                    nextLabel={appContent.pagination.next}
                  />
                </div>

                {isLoadingGoalSuggestions && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
                    <p className="text-slate-600">
                      {appContent.ai.loading.courses}
                    </p>
                  </div>
                )}

                {showGoalSuggestions && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4 text-slate-800 px-2">
                      {appContent.ai.suggestedCourses.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {getSuggestedCourses().map((course) => (
                        <div
                          key={course.id}
                          className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between h-full">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-slate-900">
                                  {course.title}
                                </h4>
                                <button
                                  onClick={() => {
                                    if (selectedAIAction === course.id) {
                                      setSelectedAIAction(null);
                                    } else {
                                      setSelectedAIAction(course.id);
                                      setNewGoal({
                                        title: course.title,
                                        description: course.description,
                                      });
                                    }
                                  }}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                    selectedAIAction === course.id
                                      ? "bg-blue-500 text-white"
                                      : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                                  }`}
                                >
                                  <Check className="h-5 w-5" />
                                </button>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">
                                {course.description}
                              </p>
                              <div className="flex items-center gap-3 text-lg text-slate-500">
                                <span>{course.duration}</span>
                                <span>•</span>
                                <span>{course.level}</span>
                                {course.category && (
                                  <>
                                    <span>•</span>
                                    <span>{course.category}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20 md:pb-0">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          refreshUser();
          getUserState().then(setUserState).catch(console.error);
        }}
      />

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <UserProfile
            onClose={() => {
              setShowProfileModal(false);
              refreshUser();
              getUserState().then(setUserState).catch(console.error);
            }}
          />
        </div>
      )}

      {currentScreen === 0 && <HomeDashboardScreenComponent />}
      {currentScreen === 1 && (
        <WelcomeScreen
          onStartOnboarding={() => {
            if (displayUser.isNewUser) {
              navigateToScreen(2);
            }
          }}
          navigateToScreen={navigateToScreen}
          displayUser={{
            name: displayUser.name || appContent.defaults.guestName,
            isNewUser: displayUser.isNewUser ?? true,
          }}
          currentScreen={currentScreen}
          setShowAuthModal={setShowAuthModal}
          setShowProfileModal={setShowProfileModal}
          getUserState={getUserState}
          setUserState={setUserState}
        />
      )}
      {currentScreen === 2 && <LearningStyleSelectionScreen />}
      {currentScreen === 3 && <GoalCreationScreen />}
      {currentScreen === 21 && (
        <CourseLibraryScreen
          onBack={() => {
            setSelectedCourseId(undefined);
            navigateToScreen(1);
          }}
          Navigation={() => (
            <Navigation
              currentScreen={currentScreen}
              navigateToScreen={navigateToScreen}
              setShowAuthModal={setShowAuthModal}
              setShowProfileModal={setShowProfileModal}
              getUserState={getUserState}
              setUserState={setUserState}
              onNavigateToCourseLibrary={() => setSelectedCourseId(undefined)}
            />
          )}
          userState={userState}
          onCourseComplete={() => {
            getUserState().then(setUserState).catch(console.error);
          }}
          onStateUpdate={(updatedState) => {
            setUserState(updatedState);
          }}
          initialCourseId={selectedCourseId}
        />
      )}
    </div>
  );
}

export default App;
