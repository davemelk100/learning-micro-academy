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
import { UserState } from "./types";
import { courses } from "./data";
import {
  Award,
  Target,
  Heart,
  Brain,
  Users,
  Shield,
  Lightbulb,
  Sparkles,
  Check,
  RefreshCw,
  Palette,
  Code,
  TrendingUp,
  Globe,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  color: string;
  iconColor: string;
  description: string;
}

interface Goal {
  id: string;
  learningStyleId: string;
  sdgIds: string[];
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  progressHistory: ProgressEntry[];
  milestones: Milestone[];
  lastUpdated: Date;
}

interface ProgressEntry {
  id: string;
  date: Date;
  amount: number;
  notes: string;
  type: "increment" | "milestone" | "reset";
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetProgress: number;
  achieved: boolean;
  achievedDate?: Date;
}

const learningStyles: LearningStyle[] = [
  {
    id: "visual",
    name: "Visual",
    icon: Eye,
    color: "bg-[#e6243c]",
    iconColor: "text-[#e6243c]",
    description: "Learn best through seeing and visual representations",
  },
  {
    id: "auditory",
    name: "Auditory",
    icon: Headphones,
    color: "bg-[#dfa739]",
    iconColor: "text-[#dfa739]",
    description: "Learn best through listening and verbal instruction",
  },
  {
    id: "kinesthetic",
    name: "Kinesthetic",
    icon: Activity,
    color: "bg-[#4aa236]",
    iconColor: "text-[#4aa236]",
    description: "Learn best through hands-on experience and physical activity",
  },
  {
    id: "reading-writing",
    name: "Reading/Writing",
    icon: BookOpen,
    color: "bg-red-400",
    iconColor: "text-red-500",
    description: "Learn best through reading and writing activities",
  },
  {
    id: "social",
    name: "Social",
    icon: Users,
    color: "bg-pink-400",
    iconColor: "text-pink-500",
    description: "Learn best in groups and through collaboration",
  },
  {
    id: "solitary",
    name: "Solitary",
    icon: User,
    color: "bg-blue-400",
    iconColor: "text-blue-500",
    description: "Learn best independently and through self-study",
  },
  {
    id: "logical",
    name: "Logical",
    icon: Network,
    color: "bg-purple-400",
    iconColor: "text-purple-500",
    description: "Learn best through logic, reasoning, and systems thinking",
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
      selectedSDGs: [],
      currentSelectedSDG: "",
      hasCompletedSDGSetup: false,
      hasCompletedOnboarding: false,
      newGoal: {
        title: "",
        description: "",
        target: 0,
      },
      lastUpdated: new Date().toISOString(),
      name: "Guest",
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
  const displayUser = user || { name: "Guest", isNewUser: true };
  const [, setOnboardingStep] = useState<number | null>(null); // null = not in onboarding, 1-4 = onboarding steps
  const [isLoadingGoalSuggestions, setIsLoadingGoalSuggestions] =
    useState(false);
  const [showGoalSuggestions, setShowGoalSuggestions] = useState(false);
  const [isLoadingAIAssistance, setIsLoadingAIAssistance] = useState(false);
  const [, setAiSelectedSDG] = useState<string | null>(null);
  const [aiSelectedLearningStyle, setAiSelectedLearningStyle] = useState<
    string | null
  >(null);
  const [aiLearningStyleSelectionReason, setAiLearningStyleSelectionReason] =
    useState<string>("");
  const [, setAiSelectionReason] = useState<string>("");

  const sdgGoals = [
    {
      id: "sdg1",
      title: "User Experience Design",
      color: "bg-red-500",
      innerColor: "bg-red-700",
      icon: Palette,
    },
    {
      id: "sdg2",
      title: "Design Systems",
      color: "bg-orange-500",
      innerColor: "bg-orange-700",
      icon: Sparkles,
    },
    {
      id: "sdg3",
      title: "Web Development",
      color: "bg-yellow-500",
      innerColor: "bg-yellow-700",
      icon: Code,
    },
    {
      id: "sdg4",
      title: "Product Strategy",
      color: "bg-green-500",
      innerColor: "bg-green-700",
      icon: Target,
    },
    {
      id: "sdg5",
      title: "Data Analytics",
      color: "bg-teal-500",
      innerColor: "bg-teal-700",
      icon: TrendingUp,
    },
    {
      id: "sdg7",
      title: "Energy",
      color: "bg-indigo-500",
      innerColor: "bg-indigo-700",
      icon: Globe,
    },
    {
      id: "sdg8",
      title: "Business Skills",
      color: "bg-purple-500",
      innerColor: "bg-purple-700",
      icon: Award,
    },
    {
      id: "sdg9",
      title: "Innovation",
      color: "bg-pink-500",
      innerColor: "bg-pink-700",
      icon: Lightbulb,
    },
    {
      id: "sdg10",
      title: "Communication",
      color: "bg-rose-500",
      innerColor: "bg-rose-700",
      icon: Users,
    },
    {
      id: "sdg11",
      title: "Leadership",
      color: "bg-cyan-500",
      innerColor: "bg-cyan-700",
      icon: Shield,
    },
    {
      id: "sdg12",
      title: "Technology",
      color: "bg-emerald-500",
      innerColor: "bg-emerald-700",
      icon: Brain,
    },
    {
      id: "sdg13",
      title: "Marketing",
      color: "bg-amber-500",
      innerColor: "bg-amber-700",
      icon: TrendingUp,
    },
    {
      id: "sdg14",
      title: "Finance",
      color: "bg-violet-500",
      innerColor: "bg-violet-700",
      icon: Award,
    },
    {
      id: "sdg15",
      title: "Personal Growth",
      color: "bg-fuchsia-500",
      innerColor: "bg-fuchsia-700",
      icon: Heart,
    },
    {
      id: "sdg16",
      title: "Career Development",
      color: "bg-sky-500",
      innerColor: "bg-sky-700",
      icon: Target,
    },
    {
      id: "sdg17",
      title: "Creative Skills",
      color: "bg-lime-500",
      innerColor: "bg-lime-700",
      icon: Sparkles,
    },
  ];
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [_step7AmountChange, _setStep7AmountChange] = useState(0);
  const [selectedSDG] = useState<string>("");

  // AI Suggested Courses selection state
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
    notes: string
  ) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const newProgress = Math.min(100, goal.progress + amount);
          const completed = newProgress >= 100;

          const updatedMilestones =
            goal.milestones?.map((milestone) => {
              if (
                !milestone.achieved &&
                newProgress >= milestone.targetProgress
              ) {
                return {
                  ...milestone,
                  achieved: true,
                  achievedDate: new Date(),
                };
              }
              return milestone;
            }) || [];

          const progressEntry: ProgressEntry = {
            id: Date.now().toString(),
            date: new Date(),
            amount,
            notes,
            type: "increment",
          };

          return {
            ...goal,
            progress: newProgress,
            completed,
            milestones: updatedMilestones,
            progressHistory: [...goal.progressHistory, progressEntry],
            lastUpdated: new Date(),
          };
        }
        return goal;
      })
    );
  };

  // Handle browser back/forward buttons
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

  // Determine initial screen based on user status
  useEffect(() => {
    if (displayUser.isNewUser) {
      navigateToScreen(1); // Welcome screen for new users
    } else {
      navigateToScreen(0); // Dashboard for returning users
    }
  }, [displayUser.isNewUser, navigateToScreen]);

  const getSuggestedCourses = () => {
    if (!selectedSDG || !selectedLearningStyle) {
      return courses.slice(0, 3);
    }

    const sdgToCourseMap: { [key: string]: string[] } = {
      sdg1: ["Design", "UX", "Product"],
      sdg2: ["Design", "Product", "Strategy"],
      sdg3: ["Development", "Web", "Analytics"],
      sdg4: ["Design", "UX", "Product"],
      sdg5: ["Product", "Strategy", "Analytics"],
      sdg7: ["Energy", "Environment"],
      sdg8: ["Product", "Strategy", "Analytics"], // Decent Work - business strategy
      sdg9: ["Development", "Design", "Product"], // Industry Innovation - tech innovation
      sdg10: ["Product", "Strategy", "Analytics"], // Reduced Inequalities - inclusive design
      sdg11: ["Design", "Product"], // Sustainable Cities - urban design
      sdg12: ["Environment", "Product"], // Responsible Consumption
      sdg13: ["Energy", "Environment"], // Climate Action
      sdg14: ["Environment", "Analytics"], // Life Below Water - environmental
      sdg15: ["Environment", "Analytics"], // Life on Land - environmental
      sdg16: ["Product", "Strategy", "Analytics"], // Peace and Justice - governance
      sdg17: ["Product", "Strategy", "Analytics"], // Partnerships - collaboration
    };

    const relevantTags = sdgToCourseMap[selectedSDG] || [];

    // Filter courses that match the SDG category/tags
    const matchingCourses = courses.filter((course) =>
      relevantTags.some(
        (tag) =>
          course.category.toLowerCase().includes(tag.toLowerCase()) ||
          course.tags.some((courseTag) =>
            courseTag.toLowerCase().includes(tag.toLowerCase())
          )
      )
    );

    // Return matching courses or default to first 3
    return matchingCourses.length > 0
      ? matchingCourses.slice(0, 3)
      : courses.slice(0, 3);
  };

  // Simulate AI loading when entering goal creation screen
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

      // Get the selected SDG title for context
      const selectedSDGTitle =
        sdgGoals.find((sdg) => sdg.id === selectedSDG)?.title ||
        "your selected SDG";

      // Generate a reason based on the selected learning style and SDG
      const learningStyleReasons = {
        "intro-to-ux": `${selectedLearningStyle.name} aligns with ${selectedSDGTitle} by helping you understand user needs and create solutions that address real-world challenges.`,
        "design-systems": `${selectedLearningStyle.name} complements ${selectedSDGTitle} by providing structured approaches to creating scalable and sustainable solutions.`,
        "web-development": `${selectedLearningStyle.name} aligns with ${selectedSDGTitle} by enabling you to build digital solutions that can scale and reach more people.`,
        "product-strategy": `${selectedLearningStyle.name} enhances ${selectedSDGTitle} by teaching strategic thinking and planning for long-term impact.`,
        "data-analytics": `${selectedLearningStyle.name} supports ${selectedSDGTitle} by providing tools to measure impact and make data-driven decisions.`,
      };

      setAiSelectedLearningStyle(selectedLearningStyle.id);
      setAiLearningStyleSelectionReason(
        learningStyleReasons[
          selectedLearningStyle.id as keyof typeof learningStyleReasons
        ] ||
          `${selectedLearningStyle.name} aligns with ${selectedSDGTitle} by providing the learning foundation needed for meaningful progress.`
      );
      setIsLoadingAIAssistance(false);
    }, 2000);
  };

  // Handle SDG AI assistance click
  const _handleSDGAIAssistanceClick = () => {
    setIsLoadingAIAssistance(true);
    setAiSelectedSDG(null);
    setAiSelectionReason("");

    // Simulate AI processing time
    setTimeout(() => {
      // Randomly select an SDG
      const randomIndex = Math.floor(Math.random() * sdgGoals.length);
      const selectedSDG = sdgGoals[randomIndex];

      // Generate a reason based on the selected SDG
      const reasons = {
        "1": "Based on your profile, you show strong empathy and concern for social justice, making No Poverty a natural fit for your values.",
        "2": "Your interest in sustainable living and nutrition suggests Zero Hunger aligns perfectly with your lifestyle goals.",
        "3": "Your focus on personal wellness and helping others indicates Good Health and Well-being matches your priorities.",
        "4": "Your curiosity and desire for continuous learning makes Quality Education an ideal choice for your growth journey.",
        "5": "Your commitment to equality and fairness suggests Gender Equality resonates with your core values.",
        "6": "Your environmental consciousness and concern for water conservation makes Clean Water and Sanitation a perfect match.",
        "7": "Your interest in sustainable technology and renewable energy aligns with Affordable and Clean Energy goals.",
        "8": "Your entrepreneurial spirit and focus on meaningful work connects with Decent Work and Economic Growth.",
        "9": "Your innovative mindset and interest in technology makes Industry, Innovation and Infrastructure a natural fit.",
        "10": "Your commitment to social justice and reducing inequality aligns with Reduced Inequalities goals.",
        "11": "Your interest in community building and sustainable urban living connects with Sustainable Cities and Communities.",
        "12": "Your focus on mindful consumption and environmental responsibility makes Responsible Consumption and Production ideal.",
        "13": "Your environmental awareness and concern for future generations aligns with Climate Action priorities.",
        "14": "Your love for nature and marine conservation interests connect with Life Below Water goals.",
        "15": "Your appreciation for biodiversity and environmental stewardship makes Life on Land a perfect match.",
        "16": "Your commitment to justice and building inclusive communities aligns with Peace, Justice and Strong Institutions.",
        "17": "Your collaborative nature and belief in collective action connects with Partnerships for the Goals.",
      };

      setAiSelectedSDG(selectedSDG.id);
      setAiSelectionReason(
        reasons[selectedSDG.id as keyof typeof reasons] ||
          `${selectedSDG.title} aligns with the subject matter.`
      );
      setIsLoadingAIAssistance(false);
    }, 2000);
  };

  // Mock data for dashboard
  const [userStats] = useState({
    totalGoals: 12,
    completedGoals: 8,
    currentStreak: 7,
    weeklyProgress: 85,
    monthlyProgress: 72,
    totalPoints: 2450,
  });

  // Navigation and WelcomeScreen are now imported from separate files

  // Home Dashboard Screen - now using extracted component
  const HomeDashboardScreenComponent = () => (
    <HomeDashboardScreen
      user={{
        name: displayUser.name || "Guest",
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

  // Screen 2: Learning Style Selection
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
                    MicroLearn
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
                <h2 className="text-2xl font-bold">Select Learning Style</h2>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col mb-4 lg:mb-0">
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">
                        Select Learning Style
                      </h3>
                      {/* AI assistance prompt on its own row */}
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-blue-500 animate-bounce transition-all duration-300 hover:scale-110 hover:drop-shadow-lg" />
                        <button
                          onClick={handleLearningStyleAIAssistanceClick}
                          className="text-lg text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          Let Learning Micro-Academy help
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoadingAIAssistance && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
                    <p className="text-slate-600">
                      Learning Micro-Academy AI is analyzing your SDG selection
                      and finding the perfect learning style match...
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
                          Learning Micro-Academy AI Recommendation
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
                            Accept
                          </button>
                          <button
                            onClick={handleLearningStyleAIAssistanceClick}
                            className="text-lg bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 object-cover transition-colors flex items-center space-x-1"
                          >
                            <RefreshCw className="h-5 w-5" />
                            <span>Try Another</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedSDG && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 object-cover">
                    <p className="text-lg text-amber-800">
                      Please select a Sustainable Development Goal first to
                      enable learning style selection.
                    </p>
                  </div>
                )}

                {/* Pagination */}
                <div className="mb-6">
                  <Pagination
                    currentStep={2}
                    totalSteps={7}
                    onPrevious={() => navigateToScreen(11)}
                    onNext={() => selectedLearningStyle && navigateToScreen(3)}
                    canGoPrevious={true}
                    canGoNext={!!selectedLearningStyle}
                    previousLabel="Back"
                    nextLabel="Next"
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
                        onClick={() =>
                          selectedSDG && setSelectedLearningStyle(learningStyle)
                        }
                        disabled={!selectedSDG}
                        className={`${
                          isListView
                            ? "w-full p-3 rounded-md border-2 transition-all duration-200 relative flex items-center space-x-4"
                            : "flex flex-col items-center p-3 rounded-full transition-all duration-200 relative"
                        } ${
                          !selectedSDG
                            ? "border-slate-200 bg-slate-100 cursor-not-allowed opacity-50"
                            : ""
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
                              selectedLearningStyle?.id === learningStyle.id &&
                              selectedSDG
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
                                selectedLearningStyle?.id ===
                                  learningStyle.id && selectedSDG
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
                              Click to{" "}
                              {selectedLearningStyle?.id === learningStyle.id
                                ? "deselect"
                                : "select"}{" "}
                              this learning style
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

  // Screen 3: Goal Creation
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
                    MicroLearn
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
                      Select or Create an Action
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Pagination */}
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
                          sdgIds: selectedSDG ? selectedSDG.split(",") : [],
                          title: newGoal.title,
                          description: newGoal.description,
                          progress: 0,
                          completed: false,
                          progressHistory: [],
                          milestones: [
                            {
                              id: "milestone-1",
                              title: "Getting Started",
                              description: "Begin your journey",
                              targetProgress: 10,
                              achieved: false,
                            },
                            {
                              id: "milestone-2",
                              title: "Building Momentum",
                              description: "Establish consistent habits",
                              targetProgress: 30,
                              achieved: false,
                            },
                            {
                              id: "milestone-3",
                              title: "Halfway There",
                              description: "Reach the midpoint of your goal",
                              targetProgress: 50,
                              achieved: false,
                            },
                            {
                              id: "milestone-4",
                              title: "Almost There",
                              description: "Final stretch to completion",
                              targetProgress: 80,
                              achieved: false,
                            },
                            {
                              id: "milestone-5",
                              title: "Goal Achieved",
                              description:
                                "Congratulations on completing your goal!",
                              targetProgress: 100,
                              achieved: false,
                            },
                          ],
                          lastUpdated: new Date(),
                        };
                        setGoals([...goals, goal]);
                        navigateToScreen(8);
                      } else if (selectedAIAction) {
                        // If AI course is selected but no custom goal, create goal from selected course
                        const selectedCourse = courses.find(
                          (c) => c.id === selectedAIAction
                        );

                        if (!selectedCourse) {
                          return; // Course not found, don't proceed
                        }

                        const goal: Goal = {
                          id: Date.now().toString(),
                          learningStyleId: selectedLearningStyle!.id,
                          sdgIds: selectedSDG ? selectedSDG.split(",") : [],
                          title: selectedCourse.title,
                          description: selectedCourse.description,
                          progress: 0,
                          completed: false,
                          progressHistory: [],
                          milestones: [
                            {
                              id: "milestone-1",
                              title: "Getting Started",
                              description: "Begin your journey",
                              targetProgress: 10,
                              achieved: false,
                            },
                            {
                              id: "milestone-2",
                              title: "Building Momentum",
                              description: "Establish consistent habits",
                              targetProgress: 30,
                              achieved: false,
                            },
                            {
                              id: "milestone-3",
                              title: "Halfway There",
                              description: "Reach the midpoint of your goal",
                              targetProgress: 50,
                              achieved: false,
                            },
                            {
                              id: "milestone-4",
                              title: "Almost There",
                              description: "Final stretch to completion",
                              targetProgress: 80,
                              achieved: false,
                            },
                            {
                              id: "milestone-5",
                              title: "Goal Achieved",
                              description:
                                "Congratulations on completing your goal!",
                              targetProgress: 100,
                              achieved: false,
                            },
                          ],
                          lastUpdated: new Date(),
                        };
                        setGoals([...goals, goal]);
                        navigateToScreen(8);
                      }
                    }}
                    previousLabel="Back"
                    nextLabel="Next"
                  />
                </div>

                {isLoadingGoalSuggestions && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
                    <p className="text-slate-600">
                      Learning Micro-Academy AI is finding courses that match
                      your selections
                    </p>
                  </div>
                )}

                {showGoalSuggestions && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4 text-slate-800 px-2">
                      Learning Micro-Academy AI Suggested Courses
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
      {/* Auth and Profile Modals */}
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
              setOnboardingStep(1);
            }
          }}
          navigateToScreen={navigateToScreen}
          displayUser={displayUser}
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
            />
          )}
          userState={userState}
          onCourseComplete={() => {
            // Refresh user state after course completion
            getUserState().then(setUserState).catch(console.error);
          }}
          onStateUpdate={(updatedState) => {
            // Update state immediately when quiz results or progress are saved
            setUserState(updatedState);
          }}
          initialCourseId={selectedCourseId}
        />
      )}
    </div>
  );
}

export default App;
