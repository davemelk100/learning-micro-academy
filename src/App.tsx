import React, { useState, useEffect, useCallback, useRef } from "react";
import { Pagination } from "./components/Pagination";
import { HelpCard } from "./components/HelpCard";
import { AIRecommendationCard } from "./components/AIRecommendationCard";
import { HomeDashboardScreen } from "./screens/HomeDashboardScreen";
import { YesNoToggle } from "./components/YesNoToggle";
import { CourseLibraryScreen } from "./components/CourseLibraryScreen";
import { OnboardingWelcomeScreen } from "./components/OnboardingWelcomeScreen";
import { OnboardingAssessmentScreen } from "./components/OnboardingAssessmentScreen";
import { OnboardingGoalsScreen } from "./components/OnboardingGoalsScreen";
import { OnboardingDashboardScreen } from "./components/OnboardingDashboardScreen";
import {
  Award,
  Target,
  Heart,
  Brain,
  Users,
  Shield,
  Lightbulb,
  X,
  Sparkles,
  Check,
  Edit3,
  Home,
  RefreshCw,
  Flame,
  HeartHandshake,
  Palette,
  Code,
  TrendingUp,
  Globe,
} from "lucide-react";

interface LearningStyle {
  id: string;
  name: string;
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
    id: "intro-to-ux",
    name: "Intro to UX",
    icon: Palette,
    color: "bg-[#e6243c]",
    iconColor: "text-[#e6243c]",
    description: "Master the fundamentals of user experience design",
  },
  {
    id: "design-systems",
    name: "Design Systems",
    icon: Sparkles,
    color: "bg-[#dfa739]",
    iconColor: "text-[#dfa739]",
    description: "Build scalable and consistent design systems",
  },
  {
    id: "energy-efficiency",
    name: "Energy Efficiency at Home",
    icon: Home,
    color: "bg-[#4aa236]",
    iconColor: "text-[#4aa236]",
    description:
      "Reduce your carbon footprint with practical home improvements",
  },
  {
    id: "web-development",
    name: "Web Development Basics",
    icon: Code,
    color: "bg-red-400",
    iconColor: "text-red-500",
    description: "Learn modern web development fundamentals",
  },
  {
    id: "product-strategy",
    name: "Product Strategy",
    icon: Target,
    color: "bg-pink-400",
    iconColor: "text-pink-500",
    description: "Develop products that users love and businesses need",
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    icon: TrendingUp,
    color: "bg-blue-400",
    iconColor: "text-blue-500",
    description: "Turn data into actionable insights",
  },
  {
    id: "sustainability",
    name: "Sustainability Practices",
    icon: Globe,
    color: "bg-purple-400",
    iconColor: "text-purple-500",
    description: "Learn sustainable practices for modern living",
  },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [selectedLearningStyle, setSelectedLearningStyle] =
    useState<LearningStyle | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
  });
  const [user] = useState({ name: "Dave", isNewUser: true }); // Set to true for new user experience
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null); // null = not in onboarding, 1-4 = onboarding steps
  const [isLoadingGoalSuggestions, setIsLoadingGoalSuggestions] =
    useState(false);
  const [showGoalSuggestions, setShowGoalSuggestions] = useState(false);
  const [isLoadingAIAssistance, setIsLoadingAIAssistance] = useState(false);
  const [aiSelectedSDG, setAiSelectedSDG] = useState<string | null>(null);
  const [aiSelectionReason, setAiSelectionReason] = useState<string>("");
  const [aiSelectedLearningStyle, setAiSelectedLearningStyle] = useState<
    string | null
  >(null);
  const [aiLearningStyleSelectionReason, setAiLearningStyleSelectionReason] =
    useState<string>("");
  const [hasHoveredSDG, setHasHoveredSDG] = useState(false);
  const [showSDGPopover, setShowSDGPopover] = useState(false);

  // Design system action card expansion state
  const [designSystemCardExpanded, setDesignSystemCardExpanded] =
    useState(true);

  // Learning Topics data
  const sdgGoals = [
    {
      id: "sdg1",
      title: "User Experience Design",
      color: "bg-red-500",
      innerColor: "bg-red-700",
    },
    {
      id: "sdg2",
      title: "Design Systems",
      color: "bg-orange-500",
      innerColor: "bg-orange-700",
    },
    {
      id: "sdg3",
      title: "Web Development",
      color: "bg-yellow-500",
      innerColor: "bg-yellow-700",
    },
    {
      id: "sdg4",
      title: "Product Strategy",
      color: "bg-green-500",
      innerColor: "bg-green-700",
    },
    {
      id: "sdg5",
      title: "Data Analytics",
      color: "bg-teal-500",
      innerColor: "bg-teal-700",
    },
    {
      id: "sdg6",
      title: "Energy Efficiency",
      color: "bg-blue-500",
      innerColor: "bg-blue-700",
    },
    {
      id: "sdg7",
      title: "Sustainability",
      color: "bg-indigo-500",
      innerColor: "bg-indigo-700",
    },
    {
      id: "sdg8",
      title: "Business Skills",
      color: "bg-purple-500",
      innerColor: "bg-purple-700",
    },
    {
      id: "sdg9",
      title: "Innovation",
      color: "bg-pink-500",
      innerColor: "bg-pink-700",
    },
    {
      id: "sdg10",
      title: "Communication",
      color: "bg-rose-500",
      innerColor: "bg-rose-700",
    },
    {
      id: "sdg11",
      title: "Leadership",
      color: "bg-cyan-500",
      innerColor: "bg-cyan-700",
    },
    {
      id: "sdg12",
      title: "Technology",
      color: "bg-emerald-500",
      innerColor: "bg-emerald-700",
    },
    {
      id: "sdg13",
      title: "Marketing",
      color: "bg-amber-500",
      innerColor: "bg-amber-700",
    },
    {
      id: "sdg14",
      title: "Finance",
      color: "bg-violet-500",
      innerColor: "bg-violet-700",
    },
    {
      id: "sdg15",
      title: "Personal Growth",
      color: "bg-fuchsia-500",
      innerColor: "bg-fuchsia-700",
    },
    {
      id: "sdg16",
      title: "Career Development",
      color: "bg-sky-500",
      innerColor: "bg-sky-700",
    },
    {
      id: "sdg17",
      title: "Creative Skills",
      color: "bg-lime-500",
      innerColor: "bg-lime-700",
    },
  ];
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [situationToggle1, setSituationToggle1] = useState<boolean | null>(
    null
  );
  const [situationToggle2, setSituationToggle2] = useState<boolean | null>(
    null
  );
  const [situationDescription, setSituationDescription] = useState("");
  const situationTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [step5Toggle1, setStep5Toggle1] = useState<boolean | null>(null);
  const [step5Toggle2, setStep5Toggle2] = useState<boolean | null>(null);
  const [step5Description, setStep5Description] = useState("");
  const step5TextareaRef = useRef<HTMLTextAreaElement>(null);

  // Callback functions for textarea onChange handlers
  const handleSituationDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setSituationDescription(e.target.value);
    },
    []
  );

  const handleStep5DescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setStep5Description(e.target.value);
    },
    []
  );
  const [step6AmountChange, setStep6AmountChange] = useState(0);
  const [step7AmountChange, setStep7AmountChange] = useState(0);
  const [selectedSDG, setSelectedSDG] = useState<string>("");

  // AI Suggested Actions selection and editing state
  const [selectedAIAction, setSelectedAIAction] = useState<string | null>(null);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editedActionText, setEditedActionText] = useState<string>("");

  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedGoalForProgress, setSelectedGoalForProgress] =
    useState<Goal | null>(null);
  const [progressUpdate, setProgressUpdate] = useState({
    amount: 1,
    notes: "",
  });

  // Browser back button functionality
  const navigateToScreen = useCallback((screen: number) => {
    setCurrentScreen(screen);

    // Update browser history
    window.history.pushState({ screen }, "", `#screen-${screen}`);
  }, []);

  // Progress tracking functions
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

          // Check for milestone achievements
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

    // Initialize history with current screen
    window.history.replaceState(
      { screen: currentScreen },
      "",
      `#screen-${currentScreen}`
    );

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentScreen]);

  const sustainableDevelopmentGoals = sdgGoals.map((sdg) => ({
    id: sdg.id,
    title: sdg.title,
    description: `Learn about ${sdg.title.toLowerCase()} and develop your skills in this area.`,
    color: sdg.color,
    innerColor: sdg.innerColor,
  }));

  // Determine initial screen based on user status
  useEffect(() => {
    if (user.isNewUser) {
      navigateToScreen(1); // Welcome screen for new users
    } else {
      navigateToScreen(0); // Dashboard for returning users
    }
  }, [user.isNewUser, navigateToScreen]);

  // Reset to correct screen if somehow on wrong screen
  useEffect(() => {
    // Only redirect from screen 10 (ProgressSubmissionScreen) if needed
    // Screen 8 is Step7Screen and should work normally
    if (currentScreen === 10) {
      // If somehow on ProgressSubmissionScreen without proper state, redirect to Welcome
      navigateToScreen(1);
    }
  }, [currentScreen, navigateToScreen]);

  // Simulate AI loading when entering goal creation screen
  useEffect(() => {
    if (currentScreen === 3 && selectedLearningStyle) {
      setIsLoadingGoalSuggestions(true);
      setShowGoalSuggestions(false);

      const timer = setTimeout(() => {
        setIsLoadingGoalSuggestions(false);
        setShowGoalSuggestions(true);
      }, 2000); // 2 seconds loading time

      return () => clearTimeout(timer);
    }
  }, [currentScreen, selectedLearningStyle]);

  // Handle Learning Style AI assistance click
  const handleLearningStyleAIAssistanceClick = () => {
    setIsLoadingAIAssistance(true);
    setAiSelectedLearningStyle(null);
    setAiLearningStyleSelectionReason("");

    // Simulate AI processing time
    setTimeout(() => {
      // Randomly select a learning style
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
        "energy-efficiency": `${selectedLearningStyle.name} directly supports ${selectedSDGTitle} by teaching practical skills for reducing environmental impact.`,
        "web-development": `${selectedLearningStyle.name} aligns with ${selectedSDGTitle} by enabling you to build digital solutions that can scale and reach more people.`,
        "product-strategy": `${selectedLearningStyle.name} enhances ${selectedSDGTitle} by teaching strategic thinking and planning for long-term impact.`,
        "data-analytics": `${selectedLearningStyle.name} supports ${selectedSDGTitle} by providing tools to measure impact and make data-driven decisions.`,
        sustainability: `${selectedLearningStyle.name} aligns with ${selectedSDGTitle} by focusing on sustainable practices and long-term thinking.`,
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
  const handleSDGAIAssistanceClick = () => {
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
          `${selectedSDG.title} aligns with your personal values and actions.`
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

  // Navigation Component
  const Navigation = () => {
    const navItems = [
      { label: "Dashboard", action: () => navigateToScreen(0) },
      { label: "Add Action", action: () => navigateToScreen(11) },
      { label: "Learning Journey", action: () => navigateToScreen(17) },
      { label: "Design System", action: () => navigateToScreen(20) },
    ];

    return (
      <>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
              }}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Bottom Tray Menu */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 border-t border-slate-200">
          <div className="flex items-center justify-between px-6 py-3">
            {navItems.map((item, index) => {
              // Determine if this item is currently active
              const isActive =
                (item.label === "Dashboard" && currentScreen === 0) ||
                (item.label === "Add Action" && currentScreen === 8) ||
                (item.label === "Learning Journey" && currentScreen === 17) ||
                (item.label === "Design System" && currentScreen === 20);

              return (
                <button
                  key={index}
                  onClick={() => item.action()}
                  className={`flex flex-col items-center space-y-1 p-2 transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50 object-cover"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label === "Dashboard" && (
                    <Target
                      className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`}
                    />
                  )}
                  {item.label === "Add Action" && (
                    <Award
                      className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`}
                    />
                  )}
                  {item.label === "Learning Journey" && (
                    <Heart
                      className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`}
                    />
                  )}
                  {item.label === "Design System" && (
                    <Sparkles
                      className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`}
                    />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-blue-600" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  // Screen 1: Welcome
  const WelcomeScreen = ({
    onStartOnboarding,
  }: {
    onStartOnboarding?: () => void;
  }) => (
    <div className="min-h-screen flex flex-col max-w-[1200px] mx-auto">
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
            <Navigation />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 max-w-5xl w-full border border-slate-200/50 shadow-xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Learning Micro-Academy
            </h1>
            <p className="text-base text-slate-700 mb-6">
              Bite-sized courses for continuous learning. Explore our
              comprehensive course library.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
            {user.isNewUser && onStartOnboarding && (
              <button
                onClick={onStartOnboarding}
                className="w-full md:w-auto py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-lg"
              >
                Start Learning Journey
              </button>
            )}
            <button
              onClick={() => {
                navigateToScreen(21);
              }}
              className="w-full md:w-auto py-4 px-8 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 rounded-full transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-lg"
            >
              Explore Course Library
            </button>
          </div>
        </div>
      </div>

      <footer className="p-6 text-center"></footer>
    </div>
  );

  // Home Dashboard Screen - now using extracted component
  const HomeDashboardScreenComponent = () => (
    <HomeDashboardScreen
      user={user}
      goals={goals}
      userStats={userStats}
      navigateToScreen={navigateToScreen}
      Navigation={Navigation}
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
    />
  );

  // Screen 2: Learning Style Selection
  const LearningStyleSelectionScreen = () => {
    const [isListView, setIsListView] = useState(false);
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
              <Navigation />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="max-w-md mx-auto md:max-w-[calc(42rem+400px)] lg:max-w-[calc(42rem+400px)]">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <h2 className="text-2xl font-bold">Select Aspect of Life</h2>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col mb-4 lg:mb-0">
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">
                        Select Aspect of Life
                      </h3>
                      {/* AI assistance prompt on its own row */}
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-blue-500 animate-bounce transition-all duration-300 hover:scale-110 hover:drop-shadow-lg" />
                        <button
                          onClick={handleLearningStyleAIAssistanceClick}
                          className="text-base text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
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
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">
                          Learning Micro-Academy AI Recommendation
                        </h4>
                        <p className="text-sm text-blue-800 mb-3">
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
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 object-cover transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={handleLearningStyleAIAssistanceClick}
                            className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 object-cover transition-colors flex items-center space-x-1"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Try Another</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedSDG && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 object-cover">
                    <p className="text-sm text-amber-800">
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
                            } rounded-full overflow-hidden flex items-center justify-center relative shadow-md ${
                              selectedLearningStyle?.id === learningStyle.id &&
                              selectedSDG
                                ? "bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-200 ring-offset-2"
                                : aiSelectedLearningStyle === learningStyle.id
                                ? "bg-green-50 border-2 border-green-500 ring-2 ring-green-200 ring-offset-2"
                                : `bg-white border-2 ${learningStyle.color.replace(
                                    "bg-",
                                    "border-"
                                  )}`
                            }`}
                          >
                            <IconComponent
                              className={`${
                                isListView ? "h-5 w-5" : "h-12 w-12"
                              } ${learningStyle.iconColor}`}
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
                                ? "text-sm font-medium text-slate-800 text-left"
                                : "text-sm font-medium text-slate-800 leading-tight"
                            }`}
                          >
                            {learningStyle.name}
                          </p>
                          {isListView && (
                            <p className="text-xs text-slate-600 mt-1 text-left">
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
              <Navigation />
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
                {/* Suggested Actions Title */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Suggested Actions
                  </h3>
                </div>

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
                        navigateToScreen(5);
                      } else if (selectedAIAction) {
                        // If AI action is selected but no custom goal, create goal from AI action
                        const aiActionTitles = {
                          "5min": "5 Minute Action",
                          "15min": "15 Minute Action",
                          custom: "Create Your Own Goal",
                        };
                        const aiActionDescriptions = {
                          "5min":
                            "Set aside 5 minutes each morning to journal about yesterday's experiences, decisions, and how they aligned with your values",
                          "15min":
                            "Identify one important decision each week, research options for 30 minutes, then meditate for 15 minutes before making your choice",
                          custom:
                            "Create a personalized goal with specific actions, measurable outcomes, and a clear timeline that aligns with your current life circumstances",
                        };

                        const goal: Goal = {
                          id: Date.now().toString(),
                          learningStyleId: selectedLearningStyle!.id,
                          sdgIds: selectedSDG ? selectedSDG.split(",") : [],
                          title:
                            aiActionTitles[
                              selectedAIAction as keyof typeof aiActionTitles
                            ],
                          description:
                            aiActionDescriptions[
                              selectedAIAction as keyof typeof aiActionDescriptions
                            ],
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
                        navigateToScreen(5);
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
                      Learning Micro-Academy AI is generating personalized
                      suggestions
                    </p>
                  </div>
                )}

                {showGoalSuggestions && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4 text-slate-800 px-2">
                      Learning Micro-Academy AI Suggested Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* 5 Minute Action Goal */}
                      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between h-full">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-slate-900">
                                5 Minute Action
                              </h4>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    if (editingActionId === "5min") {
                                      setEditingActionId(null);
                                      setEditedActionText("");
                                    } else {
                                      setEditingActionId("5min");
                                      setEditedActionText(
                                        "Set aside 5 minutes each morning to journal about yesterday's experiences, decisions, and how they aligned with your values"
                                      );
                                    }
                                  }}
                                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (selectedAIAction === "5min") {
                                      setSelectedAIAction(null);
                                    } else {
                                      setSelectedAIAction("5min");
                                    }
                                  }}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                    selectedAIAction === "5min"
                                      ? "bg-blue-500 text-white"
                                      : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                                  }`}
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            {editingActionId === "5min" ? (
                              <textarea
                                value={editedActionText}
                                onChange={(e) =>
                                  setEditedActionText(e.target.value)
                                }
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-600 resize-none"
                                rows={3}
                                autoFocus
                                onBlur={() => {
                                  setEditingActionId(null);
                                  setEditedActionText("");
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && e.ctrlKey) {
                                    setEditingActionId(null);
                                    setEditedActionText("");
                                  }
                                }}
                              />
                            ) : (
                              <p className="text-sm text-slate-600">
                                Set aside 5 minutes each morning to journal
                                about yesterday's experiences, decisions, and
                                how they aligned with your values
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 15 Minute Action Goal */}
                      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between h-full">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-slate-900">
                                15 Minute Action
                              </h4>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    if (editingActionId === "15min") {
                                      setEditingActionId(null);
                                      setEditedActionText("");
                                    } else {
                                      setEditingActionId("15min");
                                      setEditedActionText(
                                        "Identify one important decision each week, research options for 30 minutes, then meditate for 15 minutes before making your choice"
                                      );
                                    }
                                  }}
                                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (selectedAIAction === "15min") {
                                      setSelectedAIAction(null);
                                    } else {
                                      setSelectedAIAction("15min");
                                    }
                                  }}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                    selectedAIAction === "15min"
                                      ? "bg-blue-500 text-white"
                                      : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                                  }`}
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            {editingActionId === "15min" ? (
                              <textarea
                                value={editedActionText}
                                onChange={(e) =>
                                  setEditedActionText(e.target.value)
                                }
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-600 resize-none"
                                rows={3}
                                autoFocus
                                onBlur={() => {
                                  setEditingActionId(null);
                                  setEditedActionText("");
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && e.ctrlKey) {
                                    setEditingActionId(null);
                                    setEditedActionText("");
                                  }
                                }}
                              />
                            ) : (
                              <p className="text-sm text-slate-600">
                                Identify one important decision each week,
                                research options for 30 minutes, then meditate
                                for 15 minutes before making your choice
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Create Your Own Goal */}
                      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between h-full">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-slate-900">
                                Create Your Own Goal
                              </h4>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    if (editingActionId === "custom") {
                                      setEditingActionId(null);
                                      setEditedActionText("");
                                    } else {
                                      setEditingActionId("custom");
                                      setEditedActionText(
                                        "Create a personalized goal with specific actions, measurable outcomes, and a clear timeline that aligns with your current life circumstances"
                                      );
                                    }
                                  }}
                                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (selectedAIAction === "custom") {
                                      setSelectedAIAction(null);
                                    } else {
                                      setSelectedAIAction("custom");
                                    }
                                  }}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                    selectedAIAction === "custom"
                                      ? "bg-blue-500 text-white"
                                      : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                                  }`}
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            {editingActionId === "custom" ? (
                              <textarea
                                value={editedActionText}
                                onChange={(e) =>
                                  setEditedActionText(e.target.value)
                                }
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-600 resize-none"
                                rows={3}
                                autoFocus
                                onBlur={() => {
                                  setEditingActionId(null);
                                  setEditedActionText("");
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && e.ctrlKey) {
                                    setEditingActionId(null);
                                    setEditedActionText("");
                                  }
                                }}
                              />
                            ) : (
                              <p className="text-sm text-slate-600">
                                Create a personalized goal with specific
                                actions, measurable outcomes, and a clear
                                timeline that aligns with your current life
                                circumstances
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
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

  // Screen 4: Goal Confirmation
  const GoalConfirmationScreen = () => (
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
            <Navigation />
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6">
        <div className="max-w-md mx-auto md:max-w-[calc(42rem+400px)] lg:max-w-[calc(42rem+400px)]">
          <div className="text-left mb-4">
            <p className="text-slate-600 text-base font-medium">
              Your Grace-based goal is ready
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-slate-900 p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                Goal Created Successfully!
              </h2>
            </div>

            <div className="p-6">
              {/* Circular Connection Diagram */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">
                  Your Goal Journey
                </h3>

                <div className="overflow-hidden flex items-center justify-center space-x-8">
                  {/* SDG Circle */}
                  <div className="text-center flex flex-col items-center">
                    <div className="bg-white border-2 border-slate-200 rounded-full p-4 w-28 h-28 flex flex-col items-center justify-center shadow-md">
                      {selectedSDG && (
                        <>
                          <div className="w-20 h-20 rounded-full overflow-hidden mb-2 overflow-hidden flex items-center justify-center bg-white">
                            <div
                              className={`w-12 h-12 rounded-full ${
                                sustainableDevelopmentGoals.find(
                                  (s) => s.id === selectedSDG.split(",")[0]
                                )?.innerColor || "bg-slate-700"
                              }`}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-800 leading-tight">
                            {
                              sustainableDevelopmentGoals.find(
                                (s) => s.id === selectedSDG.split(",")[0]
                              )?.title
                            }
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-xs font-medium text-slate-600  px-3 py-1 rounded-full">
                        Step 1: Global Impact
                      </span>
                    </div>
                  </div>

                  {/* Virtue Circle */}
                  <div className="text-center flex flex-col items-center">
                    <div className="bg-white border-2 border-slate-200 rounded-full p-4 w-28 h-28 flex flex-col items-center justify-center shadow-md">
                      {selectedLearningStyle && (
                        <>
                          <div className="w-20 h-20 rounded-full overflow-hidden mb-2 overflow-hidden flex items-center justify-center bg-white">
                            {React.createElement(selectedLearningStyle.icon, {
                              className: `h-12 w-12 ${selectedLearningStyle.iconColor}`,
                            })}
                          </div>
                          <span className="text-sm font-medium text-slate-800 leading-tight">
                            {selectedLearningStyle?.name}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-xs font-medium text-slate-600  px-3 py-1 rounded-full">
                        Step 2: Personal Growth
                      </span>
                    </div>
                  </div>

                  {/* Action Circle */}
                  <div className="text-center flex flex-col items-center">
                    <div className="bg-white border-2 border-slate-200 rounded-full p-4 w-28 h-28 flex flex-col items-center justify-center shadow-md">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-2 overflow-hidden flex items-center justify-center">
                        <Target className="h-10 w-10 text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-800 leading-tight">
                        {newGoal.title}
                      </span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-xs font-medium text-slate-600  px-3 py-1 rounded-full">
                        Step 3: Action Plan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connection Description */}
                <div className="mt-16 text-center">
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    Your goal connects <strong>global impact</strong> (SDG) with{" "}
                    <strong>personal growth</strong> (Virtue) to create{" "}
                    <strong>meaningful action</strong> that benefits both you
                    and the world.
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {newGoal.title}
                </h3>
                <p className="text-slate-600 mb-4">{newGoal.description}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigateToScreen(5)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  Continue to Describe a Situation
                </button>
                <button
                  onClick={() => navigateToScreen(11)}
                  className="w-full bg-white hover: text-slate-900 border-2 border-slate-200 hover:border-slate-300 py-3 px-6 rounded-full font-medium transition-all"
                >
                  Create Another Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Screen 5: Describe a Situation
  const DescribeSituationScreen = useCallback(() => {
    return (
      <div className="min-h-screen max-w-[1200px] mx-auto">
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
              <Navigation />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="max-w-md mx-auto md:max-w-[calc(42rem+400px)] lg:max-w-[calc(42rem+400px)]">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">Describe a Situation</h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Page Title */}
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                  Describe a situation where you exhibited grace.
                </h3>

                {/* Pagination */}
                <div className="mb-6">
                  <Pagination
                    currentStep={4}
                    totalSteps={7}
                    onPrevious={() => navigateToScreen(3)}
                    onNext={() => navigateToScreen(6)}
                    canGoPrevious={true}
                    canGoNext={
                      situationToggle1 !== null &&
                      situationToggle2 !== null &&
                      situationDescription.trim().length > 0
                    }
                    previousLabel="Back"
                    nextLabel="Next"
                  />
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {/* Toggle 1 - Impact on Yourself */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                    <YesNoToggle
                      label="Impact on Yourself?"
                      value={situationToggle1}
                      onChange={setSituationToggle1}
                    />
                  </div>

                  {/* Toggle 2 - Impact on Others */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                    <YesNoToggle
                      label="Impact on Others?"
                      value={situationToggle2}
                      onChange={setSituationToggle2}
                    />
                  </div>

                  {/* Textarea - Reflections and Notes */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                    <label
                      htmlFor="reflections-notes"
                      className="block text-lg font-semibold text-slate-700 mb-3"
                    >
                      Reflections and Notes
                    </label>
                    <textarea
                      ref={situationTextareaRef}
                      id="reflections-notes"
                      name="reflections-notes"
                      value={situationDescription}
                      onChange={handleSituationDescriptionChange}
                      placeholder="Start typing here..."
                      className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-slate-500">
                        Maximum 500 characters
                      </p>
                      <p className="text-sm text-slate-400">
                        Share your thoughts and reflections
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    situationDescription,
    situationToggle1,
    situationToggle2,
    handleSituationDescriptionChange,
    situationTextareaRef,
  ]);

  // Screen 6: Step 5
  const Step5Screen = useCallback(() => {
    return (
      <div className="min-h-screen max-w-[1200px] mx-auto">
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
              <Navigation />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="max-w-md mx-auto md:max-w-[calc(42rem+400px)] lg:max-w-[calc(42rem+400px)]">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">Describe an Action</h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Pagination */}
                <div className="mb-6">
                  <Pagination
                    currentStep={5}
                    totalSteps={7}
                    onPrevious={() => navigateToScreen(5)}
                    onNext={() => navigateToScreen(7)}
                    canGoPrevious={true}
                    canGoNext={
                      step5Toggle1 !== null &&
                      step5Toggle2 !== null &&
                      step5Description.trim().length > 0
                    }
                    previousLabel="Back"
                    nextLabel="Next"
                  />
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {/* Toggle 1 - Impact on Yourself */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                    <YesNoToggle
                      label="Impact on Yourself?"
                      value={step5Toggle1}
                      onChange={setStep5Toggle1}
                    />
                  </div>

                  {/* Toggle 2 - Impact on Others */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                    <YesNoToggle
                      label="Impact on Others?"
                      value={step5Toggle2}
                      onChange={setStep5Toggle2}
                    />
                  </div>

                  {/* Textarea - Reflections and Notes */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                    <label
                      htmlFor="step5-reflections-notes"
                      className="block text-lg font-semibold text-slate-700 mb-3"
                    >
                      Reflections and Notes
                    </label>
                    <textarea
                      ref={step5TextareaRef}
                      id="step5-reflections-notes"
                      name="step5-reflections-notes"
                      value={step5Description}
                      onChange={handleStep5DescriptionChange}
                      placeholder="Start typing here..."
                      className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-slate-500">
                        Maximum 500 characters
                      </p>
                      <p className="text-sm text-slate-400">
                        Share your thoughts and reflections
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    step5Description,
    step5Toggle1,
    step5Toggle2,
    handleStep5DescriptionChange,
    step5TextareaRef,
  ]);

  // Screen 7: Step 6 - Rate Amount of Change
  const Step6Screen = () => {
    const amountChangeOptions = [
      { value: 0, label: "No Change" },
      { value: 1, label: "Slight Change" },
      { value: 2, label: "Moderate Change" },
      { value: 3, label: "Significant Change" },
      { value: 4, label: "Dramatic Change" },
    ];

    return (
      <div className="min-h-screen max-w-[1200px] mx-auto">
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
              <Navigation />
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
                      Rate Amount of Change
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Pagination */}
                <div className="mb-6">
                  <Pagination
                    currentStep={6}
                    totalSteps={7}
                    onPrevious={() => navigateToScreen(6)}
                    onNext={() => navigateToScreen(8)}
                    canGoPrevious={true}
                    canGoNext={true}
                    previousLabel="Back"
                    nextLabel="Next"
                  />
                </div>

                {/* Rate Amount of Change */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                  <h3 className="text-lg font-medium text-slate-700 mb-6">
                    Amount of Change
                  </h3>

                  {/* Timeline */}
                  <div className="relative">
                    {/* Items */}
                    <div className="flex justify-between relative">
                      {amountChangeOptions.map((option, index) => (
                        <div
                          key={option.value}
                          className="flex flex-col items-center cursor-pointer"
                          onClick={() => setStep6AmountChange(option.value)}
                        >
                          {/* Dot */}
                          <div
                            className={`w-4 h-4 rounded-full border-2 transition-colors relative z-10 ${
                              step6AmountChange === option.value
                                ? "bg-blue-600 border-blue-600"
                                : "bg-white border-slate-400"
                            }`}
                          ></div>

                          {/* Label */}
                          <div className="mt-2 text-center">
                            <div
                              className={`text-xs font-medium transition-colors ${
                                step6AmountChange === option.value
                                  ? "text-blue-600"
                                  : "text-slate-600"
                              }`}
                            >
                              {option.label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Line - positioned to intersect the dots */}
                    <div className="absolute top-2 left-4 right-4 h-0.5 bg-slate-300 z-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Screen 8: Step 7 - Rate Amount of Change
  const Step7Screen = () => {
    const amountChangeOptions = [
      { value: 0, label: "No Change" },
      { value: 1, label: "Slight Change" },
      { value: 2, label: "Moderate Change" },
      { value: 3, label: "Significant Change" },
      { value: 4, label: "Dramatic Change" },
    ];

    return (
      <div className="min-h-screen max-w-[1200px] mx-auto">
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
              <Navigation />
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
                      Rate Amount of Change
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Pagination */}
                <div className="mb-6">
                  <Pagination
                    currentStep={7}
                    totalSteps={7}
                    onPrevious={() => navigateToScreen(7)}
                    onNext={() => {
                      // Navigate to dashboard
                      navigateToScreen(0);
                    }}
                    canGoPrevious={true}
                    canGoNext={true}
                    previousLabel="Back"
                    nextLabel="Complete"
                  />
                </div>

                {/* Rate Amount of Change */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                  <h3 className="text-lg font-medium text-slate-700 mb-6">
                    Amount of Change
                  </h3>

                  {/* Timeline */}
                  <div className="relative">
                    {/* Items */}
                    <div className="flex justify-between relative">
                      {amountChangeOptions.map((option, index) => (
                        <div
                          key={option.value}
                          className="flex flex-col items-center cursor-pointer"
                          onClick={() => setStep7AmountChange(option.value)}
                        >
                          {/* Dot */}
                          <div
                            className={`w-4 h-4 rounded-full border-2 transition-colors relative z-10 ${
                              step7AmountChange === option.value
                                ? "bg-blue-600 border-blue-600"
                                : "bg-white border-slate-400"
                            }`}
                          ></div>

                          {/* Label */}
                          <div className="mt-2 text-center">
                            <div
                              className={`text-xs font-medium transition-colors ${
                                step7AmountChange === option.value
                                  ? "text-blue-600"
                                  : "text-slate-600"
                              }`}
                            >
                              {option.label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Line - positioned to intersect the dots */}
                    <div className="absolute top-2 left-4 right-4 h-0.5 bg-slate-300 z-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // SDGs Screen
  const SDGsScreen = () => {
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
              <Navigation />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="max-w-md mx-auto md:max-w-[calc(42rem+400px)] lg:max-w-[calc(42rem+400px)]">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <h2 className="text-2xl font-bold">Selects</h2>
              </div>

              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex flex-col mb-4 lg:mb-0">
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">
                      Learning Profile
                    </h3>
                    {/* AI assistance prompt on its own row */}
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-blue-500 animate-bounce transition-all duration-300 hover:scale-110 hover:drop-shadow-lg" />
                      <button
                        onClick={handleSDGAIAssistanceClick}
                        className="text-base text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        Let Learning Micro-Academy help
                      </button>
                    </div>
                  </div>
                </div>

                {isLoadingAIAssistance && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
                    <p className="text-slate-600">
                      Learning Micro-Academy AI is analyzing your profile and
                      selecting the best SDG for you...
                    </p>
                  </div>
                )}

                {/* Pagination */}
                <div className="mb-6">
                  <Pagination
                    currentStep={1}
                    totalSteps={7}
                    onNext={() => {
                      if (selectedSDG) {
                        navigateToScreen(2);
                      }
                    }}
                    canGoNext={!!selectedSDG}
                    nextLabel="Next"
                  />
                </div>

                {aiSelectedSDG && aiSelectionReason && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 object-cover">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">
                          Learning Micro-Academy AI Recommendation
                        </h4>
                        <p className="text-sm text-blue-800 mb-3">
                          {aiSelectionReason}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSDG(aiSelectedSDG);
                              setAiSelectedSDG(null);
                              setAiSelectionReason("");
                            }}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 object-cover transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={handleSDGAIAssistanceClick}
                            className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 object-cover transition-colors flex items-center space-x-1"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Try Another</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                  {sdgGoals.map((sdg) => (
                    <button
                      key={sdg.id}
                      onClick={() => {
                        if (selectedSDG === sdg.id) {
                          setSelectedSDG("");
                        } else {
                          setSelectedSDG(sdg.id);
                        }
                      }}
                      onMouseEnter={() => {
                        if (!hasHoveredSDG) {
                          setHasHoveredSDG(true);
                          setShowSDGPopover(true);
                        }
                      }}
                      className={`flex flex-col items-center p-3 rounded-full transition-all duration-200 relative`}
                    >
                      <div className="mb-2 flex justify-center relative">
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md ${
                            selectedSDG === sdg.id
                              ? `${
                                  sdg.color || "bg-slate-500"
                                } border-2 border-blue-500 ring-2 ring-blue-200 ring-offset-2`
                              : aiSelectedSDG === sdg.id
                              ? `${
                                  sdg.color || "bg-slate-500"
                                } border-2 border-green-500 ring-2 ring-green-200 ring-offset-2`
                              : sdg.color || "bg-slate-500"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full ${
                              sdg.innerColor || "bg-slate-700"
                            }`}
                          />
                        </div>
                        {selectedSDG === sdg.id && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-500 rounded-full overflow-hidden flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {aiSelectedSDG === sdg.id && selectedSDG !== sdg.id && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full overflow-hidden flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* SDG Popover */}

                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-800 leading-tight">
                          {sdg.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* SDG Popover Modal */}
                {showSDGPopover && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center z-50 p-4"
                    onClick={() => {
                      setShowSDGPopover(false);
                    }}
                  >
                    <div
                      className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 w-full max-w-md mx-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900">
                              Need help choosing?
                            </h4>
                            <p className="text-sm text-slate-600">
                              Let Learning Micro-Academy help you find the
                              perfect SDG
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setShowSDGPopover(false);
                          }}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                        Our AI can analyze your goals and suggest the most
                        relevant Sustainable Development Goal to help you make a
                        meaningful impact.
                      </p>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            handleSDGAIAssistanceClick();
                            setShowSDGPopover(false);
                          }}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-full font-medium transition-colors"
                        >
                          Let Learning Micro-Academy help
                        </button>
                        <button
                          onClick={() => {
                            setShowSDGPopover(false);
                          }}
                          className="px-4 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                        >
                          I'll choose myself
                        </button>
                      </div>
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

  // User Research Screen
  const UserResearchScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
              <Navigation />
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Learning Micro-Academy User Research
              </h1>
              <p className="text-base text-slate-600">
                Comprehensive user research insights and target audience
                analysis
              </p>
            </div>

            {/* User Personas */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                User Personas
              </h2>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Persona Header */}
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
                    <div className="flex-shrink-0">
                      <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                        Individual User (Persona 1)
                      </div>
                      <div className="bg-white object-cover p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          Emily Carter
                        </h3>
                      </div>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md flex-1">
                      <blockquote className="text-lg text-slate-700 italic">
                        "I want something simple that reminds me to slow down
                        and reconnect with what really matters."
                      </blockquote>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Demographics
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>
                          <span className="font-medium">Age:</span> 29
                        </li>
                        <li>
                          <span className="font-medium">Location:</span> Austin,
                          Texas
                        </li>
                        <li>
                          <span className="font-medium">Role:</span> Marketing
                          Associate at a tech startup
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Bio
                      </h4>
                      <p className="text-slate-700">
                        Emily works in a fast-paced environment where she often
                        feels overwhelmed by deadlines and constant Slack pings.
                        She has tried meditation apps like Headspace but
                        struggles with consistency. She's looking for something
                        that feels more values-driven and personal.
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Actions
                      </h4>
                      <ol className="space-y-2 text-slate-700 list-decimal list-inside">
                        <li>Find small daily practices to reduce stress</li>
                        <li>
                          Feel more aligned with her personal values, not just
                          work goals
                        </li>
                        <li>
                          Build a sense of inner calm during chaotic workdays
                        </li>
                      </ol>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Pain Points
                      </h4>
                      <ol className="space-y-2 text-slate-700 list-decimal list-inside">
                        <li>
                          Feels guilty when she can't keep up with long
                          self-care routines
                        </li>
                        <li>Distracted easily by social media</li>
                        <li>
                          Overwhelmed by too many "self-help" apps that feel
                          generic
                        </li>
                      </ol>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Motivations
                      </h4>
                      <p className="text-slate-700">
                        Emily is motivated by personal growth and finding
                        meaning in her daily actions. She wants to feel
                        connected to something greater than just work
                        achievements and seeks tools that help her live
                        according to her values rather than just productivity
                        metrics.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emily Carter Engagement Scenarios */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    Engagement Scenarios
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Motivations in Action
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li>
                          <strong>Personal Growth:</strong> "I want to feel more
                          connected to my values during chaotic workdays"
                        </li>
                        <li>
                          <strong>Stress Relief:</strong> "I need something to
                          help me slow down and find calm between Slack
                          notifications"
                        </li>
                        <li>
                          <strong>Consistency:</strong> "I want a simple daily
                          practice that doesn't feel like another task to check
                          off"
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Triggers & Incentives
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li>
                          <strong>Progress Tracking:</strong> "Seeing my 7-day
                          streak of mindful moments gives me a sense of
                          accomplishment"
                        </li>
                        <li>
                          <strong>Positive Feedback:</strong> "The gentle
                          'You're making a difference' message after completing
                          a goal feels validating"
                        </li>
                        <li>
                          <strong>Gamification:</strong> "Unlocking new
                          reflection prompts feels like discovering new wisdom"
                        </li>
                        <li>
                          <strong>Community:</strong> "Seeing others share their
                          small wins makes me feel less alone in this journey"
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Taylor Morgan Persona */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Persona Header */}
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
                    <div className="flex-shrink-0">
                      <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                        ORG USER (B2B) (Persona 1)
                      </div>
                      <div className="bg-white object-cover p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          Taylor Morgan
                        </h3>
                      </div>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md flex-1">
                      <blockquote className="text-lg text-slate-700 italic">
                        "I just need to join my company's account and start
                        using the app."
                      </blockquote>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Demographics
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>
                          <span className="font-medium">Age:</span> 29
                        </li>
                        <li>
                          <span className="font-medium">Location:</span> Austin,
                          Texas
                        </li>
                        <li>
                          <span className="font-medium">Role:</span> Team Member
                          / Org User
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Bio
                      </h4>
                      <p className="text-slate-700">
                        Taylor is a regular employee invited to use Learning
                        Micro-Academy by their company. They don't manage the
                        platform. They just need quick access through an invite
                        link or code. Once inside, Taylor expects the app to
                        reflect their org's setup and branding, with clear
                        boundaries around what they can do. Their priority is to
                        engage with the app's features without friction,
                        distractions, or unnecessary complexity.
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Actions
                      </h4>
                      <ol className="space-y-2 text-slate-700 list-decimal list-inside">
                        <li>Join the org smoothly via invite link or code</li>
                        <li>Access the app with the right org context</li>
                        <li>Focus on using features, not managing settings</li>
                      </ol>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Pain Points
                      </h4>
                      <ol className="space-y-2 text-slate-700 list-decimal list-inside">
                        <li>
                          Confusion when the invite or login flow isn't seamless
                        </li>
                        <li>
                          Limited permissions can be unclear (what they can vs.
                          can't do)
                        </li>
                        <li>
                          Frustration if org branding/settings feel inconsistent
                        </li>
                      </ol>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Motivations
                      </h4>
                      <p className="text-slate-700">
                        Taylor is motivated by seamless integration with their
                        work environment and wants to contribute to their
                        organization's goals through the platform. They value
                        efficiency and clarity, preferring straightforward tools
                        that don't require extensive learning or configuration.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Taylor Morgan Engagement Scenarios */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    Engagement Scenarios
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Motivations in Action
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li>
                          <strong>Personal Growth:</strong> "I want to
                          contribute meaningfully to my organization's goals
                          while growing personally"
                        </li>
                        <li>
                          <strong>Stress Relief:</strong> "I need tools that
                          help me stay focused and efficient without adding
                          complexity"
                        </li>
                        <li>
                          <strong>Consistency:</strong> "I want to build habits
                          that align with my work responsibilities and team
                          goals"
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Triggers & Incentives
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li>
                          <strong>Progress Tracking:</strong> "Seeing how my
                          actions contribute to team goals makes my work feel
                          more meaningful"
                        </li>
                        <li>
                          <strong>Positive Feedback:</strong> "Getting
                          recognition from my team for living our values feels
                          rewarding"
                        </li>
                        <li>
                          <strong>Gamification:</strong> "Unlocking new team
                          challenges feels like advancing in my career
                          development"
                        </li>
                        <li>
                          <strong>Community:</strong> "Seeing my colleagues'
                          progress creates a sense of shared purpose and
                          motivation"
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alex Ramirez Persona */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Persona Header */}
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
                    <div className="flex-shrink-0">
                      <div className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                        Learning Micro-Academy ADMIN USER - INTERNAL (Persona 1)
                      </div>
                      <div className="bg-white object-cover p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          Alex Ramirez
                        </h3>
                      </div>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md flex-1">
                      <blockquote className="text-lg text-slate-700 italic">
                        "I need to keep everything running smoothly—manage
                        users, resolve issues fast, and make sure the data
                        checks out."
                      </blockquote>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Demographics
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>
                          <span className="font-medium">Age:</span> 37
                        </li>
                        <li>
                          <span className="font-medium">Location:</span> Denver,
                          Colorado
                        </li>
                        <li>
                          <span className="font-medium">Role:</span> Platform
                          Administrator / Operations Manager
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Bio
                      </h4>
                      <p className="text-slate-700">
                        Alex is an internal superuser who keeps the Learning
                        Micro-Academy platform running smoothly. They focus on
                        monitoring activity, managing access, and overseeing
                        billing through a desktop dashboard. Alex values clarity
                        and efficiency over polish, needing tools that minimize
                        clicks and speed up issue resolution.
                      </p>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Motivations
                      </h4>
                      <p className="text-slate-700">
                        Alex is motivated by maintaining platform stability and
                        ensuring smooth operations for all users. They take
                        pride in quickly resolving issues and preventing
                        downtime, valuing tools that provide clear insights and
                        efficient workflows to support the platform's success.
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Actions
                      </h4>
                      <ol className="space-y-2 text-slate-700 list-decimal list-inside">
                        <li>
                          Ensure platform stability by monitoring organizations
                          and individual usage
                        </li>
                        <li>Quickly resolve issues for Org Admins and Users</li>
                        <li>
                          Maintain accurate billing and plan assignments without
                          disruption
                        </li>
                      </ol>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Pain Points
                      </h4>
                      <ol className="space-y-2 text-slate-700 list-decimal list-inside">
                        <li>
                          Mobile apps can't handle the complex data views needed
                        </li>
                        <li>
                          Overly designed dashboards slow down clarity and speed
                        </li>
                        <li>
                          Managing many orgs and users is overwhelming without
                          streamlined tools
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alex Ramirez Engagement Scenarios */}
              <div className="bg-orange-50 object-cover p-6 mb-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-4">
                  Alex Ramirez - Engagement Scenarios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">
                      Motivations in Action
                    </h4>
                    <ul className="space-y-2 text-sm text-orange-700">
                      <li>
                        <strong>Personal Growth:</strong> "I want to master the
                        platform to provide the best support to all users"
                      </li>
                      <li>
                        <strong>Stress Relief:</strong> "I need efficient tools
                        that help me resolve issues quickly without getting
                        overwhelmed"
                      </li>
                      <li>
                        <strong>Consistency:</strong> "I want to establish
                        reliable processes that prevent problems before they
                        occur"
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">
                      Triggers & Incentives
                    </h4>
                    <ul className="space-y-2 text-sm text-orange-700">
                      <li>
                        <strong>Progress Tracking:</strong> "Seeing platform
                        stability metrics and user satisfaction scores validates
                        my work"
                      </li>
                      <li>
                        <strong>Positive Feedback:</strong> "Getting thank you
                        messages from users I've helped feels deeply rewarding"
                      </li>
                      <li>
                        <strong>Gamification:</strong> "Unlocking new admin
                        tools and features feels like leveling up my technical
                        skills"
                      </li>
                      <li>
                        <strong>Community:</strong> "Connecting with other
                        platform admins and sharing solutions builds
                        professional expertise"
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Jordan Lee Persona */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Persona Header */}
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
                    <div className="flex-shrink-0">
                      <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                        ORG ADMIN USER (B2B) (Persona 1)
                      </div>
                      <div className="bg-white object-cover p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          Jordan Lee
                        </h3>
                      </div>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md flex-1">
                      <blockquote className="text-lg text-slate-700 italic">
                        "I need to set up Learning Micro-Academy for my team
                        quickly, manage access, and keep billing simple."
                      </blockquote>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Demographics
                      </h4>
                      <ul className="space-y-2 text-slate-700">
                        <li>
                          <span className="font-medium">Age:</span> 42
                        </li>
                        <li>
                          <span className="font-medium">Location:</span>{" "}
                          Chicago, Illinois
                        </li>
                        <li>
                          <span className="font-medium">Role:</span> Operations
                          Director / Org Admin
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Bio
                      </h4>
                      <p className="text-slate-700">
                        Jordan is an operations director responsible for setting
                        up and managing Learning Micro-Academy for their
                        organization. They need to quickly onboard their team,
                        manage user access and permissions, and ensure smooth
                        billing processes. Jordan values efficiency and clarity
                        in administrative tasks, preferring straightforward
                        tools that don't require extensive training.
                      </p>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Motivations
                      </h4>
                      <p className="text-slate-700">
                        Jordan is motivated by successfully implementing
                        Learning Micro-Academy across their organization and
                        seeing their team benefit from the platform. They want
                        to demonstrate value to leadership through clear metrics
                        and smooth operations, while ensuring their team has the
                        tools they need to succeed.
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Actions
                      </h4>
                      <ol className="space-y-2 text-slate-700 list-decimal list-inside">
                        <li>
                          Set up an organization and invite members with ease
                        </li>
                        <li>
                          Manage users, roles, and permissions without confusion
                        </li>
                        <li>
                          Keep billing and subscription details clear and under
                          control
                        </li>
                      </ol>
                    </div>

                    <div className="bg-white object-cover p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        Pain Points
                      </h4>
                      <ol className="space-y-2 text-slate-700 list-decimal list-inside">
                        <li>
                          Complex setup processes that slow down team onboarding
                        </li>
                        <li>
                          Unclear permission structures that confuse team
                          members
                        </li>
                        <li>
                          Billing management that requires too many steps or
                          unclear pricing
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jordan Lee Engagement Scenarios */}
              <div className="bg-indigo-50 object-cover p-6 mb-6">
                <h3 className="text-xl font-semibold text-indigo-900 mb-4">
                  Jordan Lee - Engagement Scenarios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-indigo-800 mb-2">
                      Motivations in Action
                    </h4>
                    <ul className="space-y-2 text-sm text-indigo-700">
                      <li>
                        <strong>Personal Growth:</strong> "I want to demonstrate
                        leadership by successfully implementing values-based
                        practices"
                      </li>
                      <li>
                        <strong>Stress Relief:</strong> "I need streamlined
                        tools that make team management feel effortless, not
                        overwhelming"
                      </li>
                      <li>
                        <strong>Consistency:</strong> "I want to establish clear
                        processes that my team can easily follow and maintain"
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-800 mb-2">
                      Triggers & Incentives
                    </h4>
                    <ul className="space-y-2 text-sm text-indigo-700">
                      <li>
                        <strong>Progress Tracking:</strong> "Seeing team
                        engagement metrics and successful goal completions
                        validates my leadership"
                      </li>
                      <li>
                        <strong>Positive Feedback:</strong> "Getting positive
                        feedback from leadership about our team's progress feels
                        rewarding"
                      </li>
                      <li>
                        <strong>Gamification:</strong> "Unlocking new team
                        management features feels like advancing our
                        organizational capabilities"
                      </li>
                      <li>
                        <strong>Community:</strong> "Connecting with other org
                        admins and sharing best practices builds professional
                        relationships"
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* User Groups */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Target User Groups
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 object-cover p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">
                    Individual Users (B2C)
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Individuals who want to use Learning Micro-Academy for
                    personal growth and development
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-sm text-blue-700">
                        Religious users seeking spiritual growth
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-sm text-blue-700">
                        Agnostic users focused on virtue-based development
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 object-cover p-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-3">
                    Organization Users (B2B)
                  </h3>
                  <p className="text-green-800 mb-4">
                    Members who join Learning Micro-Academy through their
                    organization's invitation
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <span className="text-sm text-green-700">
                        Holistic wellness practices
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <span className="text-sm text-green-700">
                        Psychology practices & rehabilitation centers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Roles */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Admin Roles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 object-cover p-6">
                  <h3 className="text-xl font-semibold text-purple-900 mb-3">
                    Org Admins (External)
                  </h3>
                  <p className="text-purple-800">
                    Leaders who set up Learning Micro-Academy for their
                    organization and invite members
                  </p>
                </div>

                <div className="bg-orange-50 object-cover p-6">
                  <h3 className="text-xl font-semibold text-orange-900 mb-3">
                    Learning Micro-Academy Admins (Internal)
                  </h3>
                  <p className="text-orange-800">
                    Internal team members who manage users, organizations, and
                    oversee data
                  </p>
                </div>
              </div>
            </div>

            {/* Key Pain Points */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Key Pain Points to Solve
              </h2>
              <div className="bg-red-50 object-cover p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-200 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-red-900 mb-2">
                      Progress Dashboard
                    </h4>
                    <p className="text-sm text-red-700">
                      Clarify purpose and functionality
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-200 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-red-900 mb-2">
                      Simplified Flow
                    </h4>
                    <p className="text-sm text-red-700">
                      Streamline user journey descriptions
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-200 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-3">
                      <span className="text-red-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-red-900 mb-2">
                      Visual Connections
                    </h4>
                    <p className="text-sm text-red-700">
                      Make virtue-goal-action-SDG links clear
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Core Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Onboarding",
                  "Create Actions & Tasks",
                  "Progress Measurement",
                  "Learning Micro-Academy AI",
                  "Share Actions",
                  "Edit Actions",
                  "Virtue Tracking",
                  "SDG Alignment",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-slate-100 object-cover p-4 text-center"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitors */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Competitive Landscape
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Day One", desc: "Journaling for reflection" },
                  { name: "Headspace/Calm", desc: "Mindfulness & meditation" },
                  { name: "Habitica/Strides", desc: "Habit tracking" },
                  { name: "YouVersion", desc: "Faith-based content" },
                  { name: "Notion", desc: "Goal organization" },
                  { name: "VolunteerMatch", desc: "Community service" },
                ].map((competitor, index) => (
                  <div key={index} className="bg-slate-50 object-cover p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {competitor.name}
                    </h4>
                    <p className="text-sm text-slate-600">{competitor.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Success Metrics
              </h2>
              <div className="bg-green-50 object-cover p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      Key Performance Indicators
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-green-800">User Engagement</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-green-800">Retention Rates</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-green-800">
                          Conversion on Trials
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-green-800">Adoption Rates</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      User Motivations
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-green-800">Personal Growth</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-green-800">Stress Relief</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-green-800">
                          Community Belonging
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-green-800">
                          Purpose Alignment
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Monetization */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Monetization Strategy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 object-cover p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">
                    B2B Model
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Group subscriptions through formal onboarding and
                    relationship management
                  </p>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Seat-based pricing</li>
                    <li>• Training modules for HR</li>
                    <li>• Partnership subscriptions for large orgs</li>
                  </ul>
                </div>

                <div className="bg-purple-50 object-cover p-6">
                  <h3 className="text-xl font-semibold text-purple-900 mb-3">
                    B2C Model
                  </h3>
                  <p className="text-purple-800 mb-4">
                    Individual registration through App Store/Google Play
                  </p>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li>• Freemium application model</li>
                    <li>• In-app purchases</li>
                    <li>• Feature-based pricing tiers</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateToScreen(0);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-8 rounded-full font-medium transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Screen 9: Virtues
  const AllVirtuesScreen = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVirtues, setSelectedVirtues] = useState<string[]>([]);

    const allVirtues = [
      {
        id: "acceptance",
        name: "Acceptance",
        description: "I accept myself as a person of value.",
      },
      {
        id: "accountability",
        name: "Accountability",
        description: "I take responsibility for my choices.",
      },
      {
        id: "appreciation",
        name: "Appreciation",
        description: "I look for the good in life and in people.",
      },
      {
        id: "assertiveness",
        name: "Assertiveness",
        description: "I speak my truth with confidence.",
      },
      {
        id: "awe",
        name: "Awe",
        description: "I take time to contemplate and commune.",
      },
      {
        id: "beauty",
        name: "Beauty",
        description: "I spend time in the beauty of nature.",
      },
      {
        id: "caring",
        name: "Caring",
        description: "I take an interest in others and listen deeply.",
      },
      {
        id: "certitude",
        name: "Certitude",
        description: "I have faith in what I believe.",
      },
      {
        id: "charity",
        name: "Charity",
        description: "I look for ways to be considerate and helpful.",
      },
      {
        id: "cheerfulness",
        name: "Cheerfulness",
        description: "I keep a positive outlook.",
      },
      {
        id: "cleanliness",
        name: "Cleanliness",
        description: "I keep myself fresh and clean.",
      },
      {
        id: "commitment",
        name: "Commitment",
        description: "I give 100% to whatever I do.",
      },
      {
        id: "compassion",
        name: "Compassion",
        description: "I notice when someone is hurt or needs a friend.",
      },
      {
        id: "confidence",
        name: "Confidence",
        description: "I have the strength to face what life brings me.",
      },
      {
        id: "grace",
        name: "Grace",
        description:
          "Grace is our connection to a higher power, a sense of being cared for and supported in all situations. It involves embracing the abundance around us. Grace motivates us to offer unconditional love and kindness to others. By embodying grace and elegance, we naturally attract others and enhance our interactions. Our growth in grace is reflected in how we treat others with respect, kindness, and impeccable manners, and through our willingness to forgive. As we deepen our connection to grace, we become a source of grace for those around us.",
      },
      {
        id: "contentment",
        name: "Contentment",
        description: "I allow myself to be satisfied and grateful.",
      },
      {
        id: "cooperation",
        name: "Cooperation",
        description: "I have the humility not to do it all myself.",
      },
      {
        id: "courage",
        name: "Courage",
        description: "I reach beyond my comfort zone.",
      },
      {
        id: "courtesy",
        name: "Courtesy",
        description: "I remember my manners.",
      },
      {
        id: "creativity",
        name: "Creativity",
        description: "I treasure my imagination.",
      },
      {
        id: "decisiveness",
        name: "Decisiveness",
        description: "I have confidence in my choices.",
      },
      {
        id: "detachment",
        name: "Detachment",
        description: "I recognize my feelings without letting them control me.",
      },
      {
        id: "determination",
        name: "Determination",
        description: "I recognize my feelings without letting them control me.",
      },
      {
        id: "devotion",
        name: "Devotion",
        description: "I am willing to give my all to what I care about.",
      },
      { id: "dignity", name: "Dignity", description: "I know my own worth." },
      {
        id: "diligence",
        name: "Diligence",
        description: "I give 100% to the work I do.",
      },
      {
        id: "discernment",
        name: "Discernment",
        description: "I trust my inner vision.",
      },
      {
        id: "empathy",
        name: "Empathy",
        description: "I seek to understand others' experience.",
      },
      {
        id: "endurance",
        name: "Endurance",
        description: "I find the strength to live through adversity.",
      },
      {
        id: "enthusiasm",
        name: "Enthusiasm",
        description: "I am excited about my life.",
      },
      {
        id: "excellence",
        name: "Excellence",
        description: "I give my best to all that I do.",
      },
      {
        id: "fairness",
        name: "Fairness",
        description: "I treat others justly.",
      },
      {
        id: "faith",
        name: "Faith",
        description: "I trust that my life has meaning.",
      },
      {
        id: "faithfulness",
        name: "Faithfulness",
        description: "I use self-restraint to calm my emotions.",
      },
      {
        id: "fidelity",
        name: "Fidelity",
        description: "I use self-restraint to calm my emotions.",
      },
      {
        id: "flexibility",
        name: "Flexibility",
        description: "I use self-restraint to calm my emotions.",
      },
      {
        id: "forbearance",
        name: "Forbearance",
        description: "I use self-restraint to calm my emotions.",
      },
      {
        id: "forgiveness",
        name: "Forgiveness",
        description: "I overlook mistakes.",
      },
      {
        id: "fortitude",
        name: "Fortitude",
        description: "I have the will to survive.",
      },
      {
        id: "friendliness",
        name: "Friendliness",
        description: "I make others feel welcome.",
      },
      {
        id: "generosity",
        name: "Generosity",
        description: "I willingly share with others.",
      },
      {
        id: "gentleness",
        name: "Gentleness",
        description: "I make it safe for others to be around me.",
      },
      {
        id: "grace",
        name: "Grace",
        description: "I trust Grace to carry me through times of trouble.",
      },
      {
        id: "gratitude",
        name: "Gratitude",
        description: "I am grateful for my life.",
      },
      {
        id: "helpfulness",
        name: "Helpfulness",
        description: "I look for little ways to make life easier for others.",
      },
      {
        id: "honesty",
        name: "Honesty",
        description: "I am open and transparent.",
      },
      { id: "honor", name: "Honor", description: "I live by my principles." },
      {
        id: "hope",
        name: "Hope",
        description: "I maintain a positive attitude.",
      },
      {
        id: "humanity",
        name: "Humanity",
        description: "I feel a common bond with all people.",
      },
      {
        id: "humility",
        name: "Humility",
        description: "I value others' thoughts and feelings.",
      },
      { id: "idealism", name: "Idealism", description: "I have a dream." },
      {
        id: "independence",
        name: "Independence",
        description: "I think for myself.",
      },
      {
        id: "initiative",
        name: "Initiative",
        description: "I have the courage to be original.",
      },
      {
        id: "integrity",
        name: "Integrity",
        description: "I live by my ideals.",
      },
      {
        id: "joyfulness",
        name: "Joyfulness",
        description: "I have a deep sense that life is good.",
      },
      {
        id: "justice",
        name: "Justice",
        description: "I honor people's rights including my own.",
      },
      {
        id: "kindness",
        name: "Kindness",
        description: "I have empathy for others.",
      },
      {
        id: "love",
        name: "Love",
        description: "I allow myself to connect deeply.",
      },
      {
        id: "loyalty",
        name: "Loyalty",
        description: "I stand by my loved ones through good times and bad.",
      },
      {
        id: "mercy",
        name: "Mercy",
        description: "I am compassionate and forgiving.",
      },
      {
        id: "mindfulness",
        name: "Mindfulness",
        description: "I seek always to be awake and aware.",
      },
      {
        id: "moderation",
        name: "Moderation",
        description: "I spend my time and energy sustainably.",
      },
      {
        id: "modesty",
        name: "Modesty",
        description: "I am comfortable being who I am.",
      },
      {
        id: "nobility",
        name: "Nobility",
        description: "I know I was created noble.",
      },
      {
        id: "openness",
        name: "Openness",
        description: "I am honest with no hidden agenda.",
      },
      {
        id: "optimism",
        name: "Optimism",
        description: "We see the future for what is possible.",
      },
      {
        id: "orderliness",
        name: "Orderliness",
        description: "I am hopeful and expectant.",
      },
      {
        id: "patience",
        name: "Patience",
        description: "I am hopeful and expectant.",
      },
      {
        id: "peacefulness",
        name: "Peacefulness",
        description: "I have a tranquil spirit.",
      },
      {
        id: "perceptiveness",
        name: "Perceptiveness",
        description: "I strive to have accurate insights.",
      },
      {
        id: "perseverance",
        name: "Perseverance",
        description: "I have the will to overcome obstacles.",
      },
      {
        id: "prayerfulness",
        name: "Prayerfulness",
        description: "I spend sacred time each day.",
      },
      {
        id: "purity",
        name: "Purity",
        description: "I purify my life of negativity.",
      },
      {
        id: "purposefulness",
        name: "Purposefulness",
        description: "I create a clear vision for this time in my life.",
      },
      {
        id: "reliability",
        name: "Reliability",
        description: "Others can depend on me.",
      },
      {
        id: "resilience",
        name: "Resilience",
        description: "When trouble comes, I stay strong.",
      },
      {
        id: "respect",
        name: "Respect",
        description: "I treat myself and others with dignity.",
      },
      {
        id: "responsibility",
        name: "Responsibility",
        description: "I am accountable for what I do.",
      },
      {
        id: "reverence",
        name: "Reverence",
        description: "I take time each day to nurture my inner life.",
      },
      {
        id: "righteousness",
        name: "Righteousness",
        description: "I live by my deepest values.",
      },
      {
        id: "sacrifice",
        name: "Sacrifice",
        description: "I offer my love wholeheartedly.",
      },
      {
        id: "self-discipline",
        name: "Self-Discipline",
        description: "I have the self-control to make wise choices.",
      },
      {
        id: "serenity",
        name: "Serenity",
        description: "I have faith in the goodness of life.",
      },
      {
        id: "service",
        name: "Service",
        description: "I look for opportunities to be useful.",
      },
      {
        id: "simplicity",
        name: "Simplicity",
        description: "I am satisfied with what I have.",
      },
      {
        id: "sincerity",
        name: "Sincerity",
        description: "I have no need to exaggerate or impress.",
      },
      {
        id: "steadfastness",
        name: "Steadfastness",
        description: "I don't allow doubts or tests to blow me off course.",
      },
      {
        id: "strength",
        name: "Strength",
        description: "I have the power to endure my tests.",
      },
      {
        id: "tact",
        name: "Tact",
        description: "I tell the truth kindly and gently.",
      },
      {
        id: "thankfulness",
        name: "Thankfulness",
        description: "I count my blessings every day.",
      },
      {
        id: "thoughtfulness",
        name: "Thoughtfulness",
        description: "I care about other people's needs and feelings.",
      },
      {
        id: "tolerance",
        name: "Tolerance",
        description: "I appreciate differences.",
      },
      {
        id: "trust",
        name: "Trust",
        description: "I believe there is some good in everything that happens.",
      },
      {
        id: "trustworthiness",
        name: "Trustworthiness",
        description: "My actions match my words.",
      },
      {
        id: "truthfulness",
        name: "Truthfulness",
        description: "I speak only the truth.",
      },
      {
        id: "understanding",
        name: "Understanding",
        description: "I reflect on the meaning of ideas.",
      },
      { id: "unity", name: "Unity", description: "I am a lover of humanity." },
      {
        id: "wisdom",
        name: "Wisdom",
        description: "I listen to my better judgment.",
      },
      {
        id: "wonder",
        name: "Wonder",
        description: "I take time to contemplate beauty.",
      },
      { id: "zeal", name: "Zeal", description: "I work with joyous energy." },
    ];

    // Filter virtues based on search term
    const filteredVirtues = allVirtues.filter(
      (virtue) =>
        virtue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        virtue.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleVirtueSelection = (virtueId: string) => {
      if (selectedVirtues.includes(virtueId)) {
        setSelectedVirtues(selectedVirtues.filter((id) => id !== virtueId));
      } else {
        setSelectedVirtues([...selectedVirtues, virtueId]);
      }
    };

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
              <Navigation />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <div className="max-w-md mx-auto md:max-w-[calc(42rem+400px)] lg:max-w-[calc(42rem+400px)]">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <h2 className="text-2xl font-bold">Virtues</h2>
              </div>

              <div className="p-6">
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search virtues by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Results and Selection Info */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    {searchTerm ? (
                      <span>
                        Showing {filteredVirtues.length} of {allVirtues.length}{" "}
                        virtues
                      </span>
                    ) : (
                      <span>All {allVirtues.length} virtues</span>
                    )}
                  </div>
                  {selectedVirtues.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-blue-800">
                        Selected: {selectedVirtues.length}
                      </span>
                      <button
                        onClick={() => setSelectedVirtues([])}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVirtues.map((virtue) => (
                    <div
                      key={virtue.id}
                      onClick={() => handleVirtueSelection(virtue.id)}
                      className={`cursor-pointer p-4 border-2 rounded-md transition-all duration-200 ${
                        selectedVirtues.includes(virtue.id)
                          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-200/50 ring-2 ring-blue-200"
                          : "border-slate-200 hover:border-slate-300 hover: hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 text-sm md:text-base">
                          {virtue.name}
                        </h3>
                        {selectedVirtues.includes(virtue.id) && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full overflow-hidden flex items-center justify-center shadow-md">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {virtue.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex flex-col items-center space-y-4">
                    {selectedVirtues.length > 0 && (
                      <div className="text-center">
                        <p className="text-sm text-slate-600 mb-2">
                          You've selected {selectedVirtues.length} virtue
                          {selectedVirtues.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 max-w-md">
                          {selectedVirtues.slice(0, 5).map((virtueId) => {
                            const virtue = allVirtues.find(
                              (v) => v.id === virtueId
                            );
                            return virtue ? (
                              <span
                                key={virtueId}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {virtue.name}
                              </span>
                            ) : null;
                          })}
                          {selectedVirtues.length > 5 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                              +{selectedVirtues.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => navigateToScreen(11)}
                      disabled={selectedVirtues.length === 0}
                      className={`px-6 py-3 rounded-md font-medium transition-colors shadow-lg hover:shadow-xl ${
                        selectedVirtues.length > 0
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {selectedVirtues.length > 0
                        ? `Continue with ${
                            selectedVirtues.length
                          } Selected Virtue${
                            selectedVirtues.length !== 1 ? "s" : ""
                          }`
                        : "Continue to Goal Setting"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Placeholder screens
  const JourneyViewScreen = () => (
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
            <Navigation />
          </div>
        </div>
      </header>
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Journey View</h2>
        <p className="text-slate-600">Coming soon...</p>
      </div>
    </div>
  );

  const ProgressSubmissionScreen = () => (
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
            <Navigation />
          </div>
        </div>
      </header>
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Progress Submission
        </h2>
        <p className="text-slate-600">Coming soon...</p>
      </div>
    </div>
  );

  // Screen 17: Action Journey Archive
  const ActionJourneyScreen = () => {
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [selectedAmountChange, setSelectedAmountChange] = useState<{
      [key: string]: string | null;
    }>({});

    const toggleCardExpansion = (cardId: string) => {
      setExpandedCards((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });
    };

    return (
      <div className="min-h-screen max-w-[1200px] mx-auto bg-warm-white px-4 md:px-0">
        {/* Header */}
        <header>
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => navigateToScreen(0)}
                  className="hover:opacity-80 transition-opacity"
                >
                  <span className="text-2xl font-bold text-slate-900">
                    MicroLearn
                  </span>
                </button>
              </div>
              <Navigation />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Your Virtue Journey
              </h2>
              <p className="text-slate-600">
                Archive of all actions you've created and completed
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-600">
                    Total Actions
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {goals.length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-600">
                    In Progress
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {goals.filter((goal) => !goal.completed).length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-slate-600">
                    This Week
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900">2</p>
              </div>
            </div>

            {/* Actions Archive */}
            <div className="space-y-6">
              {goals.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No actions yet
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Start your journey by creating your first action
                  </p>
                  <button
                    onClick={() => navigateToScreen(11)}
                    className="bg-slate-900 hover:bg-slate-800 text-white py-2 px-6 rounded-full font-medium transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* In Progress Actions */}
                  {goals.filter((goal) => !goal.completed).length > 0 && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals
                          .filter((goal) => !goal.completed)
                          .map((goal) => (
                            <div
                              key={goal.id}
                              className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-slate-900 text-lg mb-2">
                                    {learningStyles.find(
                                      (v) => v.id === goal.learningStyleId
                                    )?.name || "Unknown"}
                                  </h3>
                                  <p className="text-sm text-slate-600 mb-1">
                                    {goal.title}
                                  </p>
                                  <p className="text-sm text-slate-500 mb-3">
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
                                <div className="ml-4 flex items-center space-x-2">
                                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    Action created
                                  </div>
                                  <button
                                    onClick={() => toggleCardExpansion(goal.id)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                  >
                                    {expandedCards.has(goal.id) ? (
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

                              {expandedCards.has(goal.id) && (
                                <div className="mt-4 pt-3 border-t border-slate-100">
                                  <p className="text-sm text-slate-600 mb-3">
                                    {goal.description ||
                                      "No description available."}
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
                                                selectedAmountChange[
                                                  goal.id
                                                ] === changeType
                                                  ? "bg-blue-600 border-blue-600"
                                                  : "bg-white border-slate-300"
                                              }`}
                                            ></div>
                                            <button
                                              onClick={() =>
                                                setSelectedAmountChange(
                                                  (prev) => ({
                                                    ...prev,
                                                    [goal.id]:
                                                      prev[goal.id] ===
                                                      changeType
                                                        ? null
                                                        : changeType,
                                                  })
                                                )
                                              }
                                              className={`mt-2 text-xs font-medium transition-colors text-center ${
                                                selectedAmountChange[
                                                  goal.id
                                                ] === changeType
                                                  ? "text-blue-600"
                                                  : "text-slate-500 hover:text-slate-700"
                                              }`}
                                            >
                                              {changeType}
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">
                                        Learning Style:
                                      </span>
                                      <span>
                                        {learningStyles.find(
                                          (v) => v.id === goal.learningStyleId
                                        )?.name || "Unknown"}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">SDGs:</span>
                                      <span>
                                        {goal.sdgIds
                                          .map((sdgId) => {
                                            const sdg = sdgGoals.find(
                                              (s) => s.id === sdgId
                                            );
                                            return sdg ? sdg.title : "Unknown";
                                          })
                                          .join(", ")}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">
                                        Created:
                                      </span>
                                      <span>
                                        {new Date(
                                          goal.lastUpdated
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Completed Actions grouped by Learning Style */}
                  {goals.filter((goal) => goal.completed).length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Completed Actions
                      </h3>
                      {learningStyles.map((learningStyle) => {
                        const completedGoalsForLearningStyle = goals.filter(
                          (goal) =>
                            goal.completed &&
                            goal.learningStyleId === learningStyle.id
                        );

                        if (completedGoalsForLearningStyle.length === 0)
                          return null;

                        return (
                          <div key={learningStyle.id} className="mb-6">
                            <h4 className="text-lg font-semibold text-slate-700 mb-3">
                              {learningStyle.name}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {completedGoalsForLearningStyle.map((goal) => (
                                <div
                                  key={goal.id}
                                  className="bg-white p-4 rounded-xl shadow-md border border-slate-100 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-slate-900 mb-1">
                                        {learningStyle.name}
                                      </h5>
                                      <p className="text-xs text-slate-600 mb-2">
                                        {goal.title}
                                      </p>
                                    </div>
                                    <div className="ml-2 flex items-center space-x-2">
                                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        Completed
                                      </div>
                                      <button
                                        onClick={() =>
                                          toggleCardExpansion(goal.id)
                                        }
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                      >
                                        {expandedCards.has(goal.id) ? (
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

                                  {expandedCards.has(goal.id) && (
                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                      <p className="text-sm text-slate-600 mb-3">
                                        {goal.description ||
                                          "No description available."}
                                      </p>

                                      <div className="space-y-1 text-xs text-slate-600">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium">
                                            SDGs:
                                          </span>
                                          <span>
                                            {goal.sdgIds
                                              .map((sdgId) => {
                                                const sdg = sdgGoals.find(
                                                  (s) => s.id === sdgId
                                                );
                                                return sdg
                                                  ? sdg.title
                                                  : "Unknown";
                                              })
                                              .join(", ")}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium">
                                            Completed:
                                          </span>
                                          <span>
                                            {new Date(
                                              goal.lastUpdated
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Screen 19: Describe an Action
  const DesignSystemScreen = () => {
    const [designSystemToggle, setDesignSystemToggle] = useState<
      boolean | null
    >(null);
    const [showCodeLabels, setShowCodeLabels] = useState(false);
    const [showGraceModal, setShowGraceModal] = useState(false);

    return (
      <div className="min-h-screen bg-slate-50">
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">
                    Show Code Labels
                  </span>
                  <button
                    onClick={() => setShowCodeLabels(!showCodeLabels)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      showCodeLabels ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        showCodeLabels ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <Navigation />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">
              Learning Micro-Academy Design System
            </h1>

            {/* Color Palette */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Color Palette
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Slate 900</div>
                  <div className="text-xs opacity-75">#0f172a</div>
                  <div className="text-xs opacity-60">rgb(15, 23, 42)</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Slate 800</div>
                  <div className="text-xs opacity-75">#1e293b</div>
                  <div className="text-xs opacity-60">rgb(30, 41, 59)</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Slate 700</div>
                  <div className="text-xs opacity-75">#334155</div>
                  <div className="text-xs opacity-60">rgb(51, 65, 85)</div>
                </div>
                <div className="bg-slate-600 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Slate 600</div>
                  <div className="text-xs opacity-75">#475569</div>
                  <div className="text-xs opacity-60">rgb(71, 85, 105)</div>
                </div>
                <div className="bg-slate-500 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Slate 500</div>
                  <div className="text-xs opacity-75">#64748b</div>
                  <div className="text-xs opacity-60">rgb(100, 116, 139)</div>
                </div>
                <div className="bg-slate-400 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Slate 400</div>
                  <div className="text-xs opacity-75">#94a3b8</div>
                  <div className="text-xs opacity-60">rgb(148, 163, 184)</div>
                </div>
                <div className="bg-slate-300 p-4 rounded-lg text-slate-900">
                  <div className="text-sm font-medium">Slate 300</div>
                  <div className="text-xs opacity-75">#cbd5e1</div>
                  <div className="text-xs opacity-60">rgb(203, 213, 225)</div>
                </div>
                <div className="bg-slate-200 p-4 rounded-lg text-slate-900">
                  <div className="text-sm font-medium">Slate 200</div>
                  <div className="text-xs opacity-75">#e2e8f0</div>
                  <div className="text-xs opacity-60">rgb(226, 232, 240)</div>
                </div>
                <div className="bg-slate-100 p-4 rounded-lg text-slate-900">
                  <div className="text-sm font-medium">Slate 100</div>
                  <div className="text-xs opacity-75">#f1f5f9</div>
                  <div className="text-xs opacity-60">rgb(241, 245, 249)</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg text-slate-900">
                  <div className="text-sm font-medium">Slate 50</div>
                  <div className="text-xs opacity-75">#f8fafc</div>
                  <div className="text-xs opacity-60">rgb(248, 250, 252)</div>
                </div>
                <div className="bg-blue-600 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Blue 600</div>
                  <div className="text-xs opacity-75">#2563eb</div>
                  <div className="text-xs opacity-60">rgb(37, 99, 235)</div>
                </div>
                <div className="bg-emerald-600 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Emerald 600</div>
                  <div className="text-xs opacity-75">#059669</div>
                  <div className="text-xs opacity-60">rgb(5, 150, 105)</div>
                </div>
                <div className="bg-pink-500 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Pink 500</div>
                  <div className="text-xs opacity-75">#ec4899</div>
                  <div className="text-xs opacity-60">rgb(236, 72, 153)</div>
                </div>
                <div className="bg-pink-400 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Pink 400</div>
                  <div className="text-xs opacity-75">#f472b6</div>
                  <div className="text-xs opacity-60">rgb(244, 114, 182)</div>
                </div>
                <div className="bg-emerald-500 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Emerald 500</div>
                  <div className="text-xs opacity-75">#10b981</div>
                  <div className="text-xs opacity-60">rgb(16, 185, 129)</div>
                </div>
                <div className="bg-purple-500 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Purple 500</div>
                  <div className="text-xs opacity-75">#8b5cf6</div>
                  <div className="text-xs opacity-60">rgb(139, 92, 246)</div>
                </div>
                <div className="bg-orange-500 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Orange 500</div>
                  <div className="text-xs opacity-75">#f97316</div>
                  <div className="text-xs opacity-60">rgb(249, 115, 22)</div>
                </div>
                <div className="bg-yellow-500 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Yellow 500</div>
                  <div className="text-xs opacity-75">#eab308</div>
                  <div className="text-xs opacity-60">rgb(234, 179, 8)</div>
                </div>
                <div className="bg-amber-600 p-4 rounded-lg text-white">
                  <div className="text-sm font-medium">Amber 600</div>
                  <div className="text-xs opacity-75">#d97706</div>
                  <div className="text-xs opacity-60">rgb(217, 119, 6)</div>
                </div>
              </div>
            </section>

            {/* Typography */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Typography
              </h2>
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    Heading 1 - Mulish Bold (text-4xl / 2.25rem)
                  </h1>
                  <p className="text-sm text-slate-600">
                    Used for main page titles
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Heading 2 - Mulish Bold (text-2xl / 1.5rem)
                  </h2>
                  <p className="text-sm text-slate-600">
                    Used for section headers
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Heading 3 - Mulish Semibold (text-xl / 1.25rem)
                  </h3>
                  <p className="text-sm text-slate-600">
                    Used for subsection headers
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">
                    Heading 4 - Mulish Semibold (text-lg / 1.125rem)
                  </h4>
                  <p className="text-sm text-slate-600">Used for card titles</p>
                </div>
                <div>
                  <p className="text-base text-slate-700 mb-2">
                    Body text - Mulish Regular (text-base / 1rem)
                  </p>
                  <p className="text-sm text-slate-600">
                    Used for main content
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">
                    Small text - Mulish Regular (text-sm / 0.875rem)
                  </p>
                  <p className="text-sm text-slate-600">
                    Used for captions and metadata
                  </p>
                </div>

                {/* Form Field Text Sizes */}
                <div className="border-t border-slate-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Form Field Text Sizes
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Form Label - Mulish Medium (text-sm / 0.875rem)
                      </label>
                      <p className="text-sm text-slate-600">
                        Used for form field labels and input descriptions
                      </p>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Form Input - Mulish Regular (text-sm / 0.875rem)"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        disabled
                      />
                      <p className="text-sm text-slate-600 mt-2">
                        Used for input fields, textareas, and form controls
                      </p>
                    </div>
                    <div>
                      <textarea
                        placeholder="Form Textarea - Mulish Regular (text-sm / 0.875rem)"
                        rows={2}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                        disabled
                      />
                      <p className="text-sm text-slate-600 mt-2">
                        Used for multi-line text input fields
                      </p>
                    </div>
                    <div>
                      <div className="flex space-x-2">
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-full text-sm font-bold">
                          Toggle Button - Mulish Bold (text-sm / 0.875rem)
                        </button>
                        <button className="px-6 py-3 border border-slate-300 text-slate-600 rounded-full text-sm font-bold">
                          Toggle Button - Mulish Bold (text-sm / 0.875rem)
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">
                        Used for toggle buttons and form controls
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">
                        Form Helper Text - Mulish Regular (text-xs / 0.75rem)
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Used for form validation messages and helper text
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Icons */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                <a
                  href="https://lucide.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Icons (Lucide React)
                </a>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-xs text-slate-600">Target</div>
                  <div className="text-xs text-slate-500 font-mono">Target</div>
                  <div className="text-xs text-slate-500">
                    Navigation Active
                  </div>
                  <div className="text-xs text-slate-400">#2563eb</div>
                  <div className="text-xs text-slate-400">rgb(37, 99, 235)</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-xs text-slate-600">Award</div>
                  <div className="text-xs text-slate-500 font-mono">Award</div>
                  <div className="text-xs text-slate-500">
                    Navigation Active
                  </div>
                  <div className="text-xs text-slate-400">#2563eb</div>
                  <div className="text-xs text-slate-400">rgb(37, 99, 235)</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-xs text-slate-600">Heart</div>
                  <div className="text-xs text-slate-500 font-mono">Heart</div>
                  <div className="text-xs text-slate-500">
                    Navigation Active
                  </div>
                  <div className="text-xs text-slate-400">#2563eb</div>
                  <div className="text-xs text-slate-400">rgb(37, 99, 235)</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Sparkles className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-xs text-slate-600">Sparkles</div>
                  <div className="text-xs text-slate-500 font-mono">
                    Sparkles
                  </div>
                  <div className="text-xs text-slate-500">
                    Navigation Active
                  </div>
                  <div className="text-xs text-slate-400">#2563eb</div>
                  <div className="text-xs text-slate-400">rgb(37, 99, 235)</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Sparkles className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-xs text-slate-600">Sparkles</div>
                  <div className="text-xs text-slate-500 font-mono">
                    Sparkles
                  </div>
                  <div className="text-xs text-slate-500">AI Assistance</div>
                  <div className="text-xs text-slate-400">#3b82f6</div>
                  <div className="text-xs text-slate-400">
                    rgb(59, 130, 246)
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-xs text-slate-600">Target</div>
                  <div className="text-xs text-slate-500 font-mono">Target</div>
                  <div className="text-xs text-slate-500">
                    Actions This Week
                  </div>
                  <div className="text-xs text-slate-400">#3b82f6</div>
                  <div className="text-xs text-slate-400">
                    rgb(59, 130, 246)
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Flame className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="text-xs text-slate-600">Flame</div>
                  <div className="text-xs text-slate-500 font-mono">Flame</div>
                  <div className="text-xs text-slate-500">Streak</div>
                  <div className="text-xs text-slate-400">#f97316</div>
                  <div className="text-xs text-slate-400">
                    rgb(249, 115, 22)
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Target className="h-8 w-8 text-slate-600" />
                  </div>
                  <div className="text-xs text-slate-600">Target</div>
                  <div className="text-xs text-slate-500 font-mono">Target</div>
                  <div className="text-xs text-slate-500">Actions Total</div>
                  <div className="text-xs text-slate-400">#475569</div>
                  <div className="text-xs text-slate-400">rgb(71, 85, 105)</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Award className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="text-xs text-slate-600">Award</div>
                  <div className="text-xs text-slate-500 font-mono">Award</div>
                  <div className="text-xs text-slate-500">Success Modal</div>
                  <div className="text-xs text-slate-400">#059669</div>
                  <div className="text-xs text-slate-400">rgb(5, 150, 105)</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Award className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="text-xs text-slate-600">Award</div>
                  <div className="text-xs text-slate-500 font-mono">Award</div>
                  <div className="text-xs text-slate-500">Points Tile</div>
                  <div className="text-xs text-slate-400">#d97706</div>
                  <div className="text-xs text-slate-400">rgb(217, 119, 6)</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Target className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="text-xs text-slate-600">Target</div>
                  <div className="text-xs text-slate-500 font-mono">Target</div>
                  <div className="text-xs text-slate-500">Empty State</div>
                  <div className="text-xs text-slate-400">#94a3b8</div>
                  <div className="text-xs text-slate-400">
                    rgb(148, 163, 184)
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Target className="h-8 w-8 text-pink-400" />
                  </div>
                  <div className="text-xs text-slate-600">Target</div>
                  <div className="text-xs text-slate-500 font-mono">Target</div>
                  <div className="text-xs text-slate-500">Action Card</div>
                  <div className="text-xs text-slate-400">#f472b6</div>
                  <div className="text-xs text-slate-400">
                    rgb(244, 114, 182)
                  </div>
                </div>
              </div>

              {/* Virtue Icons */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Virtue Icons
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                      <Target className="h-8 w-8 text-pink-500" />
                    </div>
                    <div className="text-xs text-slate-600">Self</div>
                    <div className="text-xs text-slate-500 font-mono">
                      Target
                    </div>
                    <div className="text-xs text-slate-400">#ec4899</div>
                    <div className="text-xs text-slate-400">
                      rgb(236, 72, 153)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="text-xs text-slate-600">Community</div>
                    <div className="text-xs text-slate-500 font-mono">
                      Users
                    </div>
                    <div className="text-xs text-slate-400">#3b82f6</div>
                    <div className="text-xs text-slate-400">
                      rgb(59, 130, 246)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                      <Brain className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div className="text-xs text-slate-600">Wisdom</div>
                    <div className="text-xs text-slate-500 font-mono">
                      Brain
                    </div>
                    <div className="text-xs text-slate-400">#10b981</div>
                    <div className="text-xs text-slate-400">
                      rgb(16, 185, 129)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                      <HeartHandshake className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="text-xs text-slate-600">Service</div>
                    <div className="text-xs text-slate-500 font-mono">
                      HeartHandshake
                    </div>
                    <div className="text-xs text-slate-400">#8b5cf6</div>
                    <div className="text-xs text-slate-400">
                      rgb(139, 92, 246)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                      <Shield className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="text-xs text-slate-600">Protection</div>
                    <div className="text-xs text-slate-500 font-mono">
                      Shield
                    </div>
                    <div className="text-xs text-slate-400">#f97316</div>
                    <div className="text-xs text-slate-400">
                      rgb(249, 115, 22)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                      <Lightbulb className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="text-xs text-slate-600">Innovation</div>
                    <div className="text-xs text-slate-500 font-mono">
                      Lightbulb
                    </div>
                    <div className="text-xs text-slate-400">#eab308</div>
                    <div className="text-xs text-slate-400">
                      rgb(234, 179, 8)
                    </div>
                  </div>
                </div>
              </div>

              {/* SDG Icons */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  SDG Icons (UN Sustainable Development Goals)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/1-no-poverty.png"
                        alt="No Poverty"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 1</div>
                    <div className="text-xs text-slate-500">No Poverty</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/15-zero-hunger.png"
                        alt="Zero Hunger"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 2</div>
                    <div className="text-xs text-slate-500">Zero Hunger</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/3-Good-Health.png"
                        alt="Good Health"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 3</div>
                    <div className="text-xs text-slate-500">Good Health</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/4-education.png"
                        alt="Quality Education"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 4</div>
                    <div className="text-xs text-slate-500">
                      Quality Education
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/5-Gender-Equality.png"
                        alt="Gender Equality"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 5</div>
                    <div className="text-xs text-slate-500">
                      Gender Equality
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/Property 1=Clean Water.png"
                        alt="Clean Water"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 6</div>
                    <div className="text-xs text-slate-500">Clean Water</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/7-Affordable-and-Clean-Energy.png"
                        alt="Clean Energy"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 7</div>
                    <div className="text-xs text-slate-500">Clean Energy</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/8-Decent-Work-and-Economic-Growth.png"
                        alt="Economic Growth"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 8</div>
                    <div className="text-xs text-slate-500">
                      Economic Growth
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/9-industry-and-innovation.png"
                        alt="Innovation"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 9</div>
                    <div className="text-xs text-slate-500">Innovation</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/Property 1=Reduced Inequalities.png"
                        alt="Reduced Inequalities"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 10</div>
                    <div className="text-xs text-slate-500">
                      Reduced Inequalities
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/11-sustainable-cities.png"
                        alt="Sustainable Cities"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 11</div>
                    <div className="text-xs text-slate-500">
                      Sustainable Cities
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/12-responsible.png"
                        alt="Responsible Consumption"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 12</div>
                    <div className="text-xs text-slate-500">
                      Responsible Consumption
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/13-Climate-Action.png"
                        alt="Climate Action"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 13</div>
                    <div className="text-xs text-slate-500">Climate Action</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/14-Life-Below-Water.png"
                        alt="Life Below Water"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 14</div>
                    <div className="text-xs text-slate-500">
                      Life Below Water
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/15-life-on-land.png"
                        alt="Life on Land"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 15</div>
                    <div className="text-xs text-slate-500">Life on Land</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/16-peace-justice.png"
                        alt="Peace and Justice"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 16</div>
                    <div className="text-xs text-slate-500">
                      Peace and Justice
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex items-center justify-center mx-auto mb-2 shadow-md">
                      <img
                        src="/17-partnership-for-the-goals.png"
                        alt="Partnerships"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="text-xs text-slate-600">Goal 17</div>
                    <div className="text-xs text-slate-500">Partnerships</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Buttons */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Buttons
              </h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <button className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-full font-medium transition-colors">
                    Primary Button
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full font-medium transition-colors">
                    Secondary Button
                  </button>
                  <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-6 rounded-full font-medium transition-colors">
                    Tertiary Button
                  </button>
                  <button className="border border-slate-300 hover:border-slate-400 text-slate-700 py-3 px-6 rounded-full font-medium transition-colors">
                    Outline Button
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors">
                    Small Button
                  </button>
                  <button className="bg-amber-100 text-amber-800 py-1 px-2 rounded-full text-xs font-medium">
                    Chip
                  </button>
                </div>
              </div>
            </section>

            {/* Cards */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Card Title
                  </h3>
                  {showCodeLabels && (
                    <div className="text-xs text-slate-500 mb-1">
                      &lt;h3&gt; - text-lg font-semibold (1.125rem)
                    </div>
                  )}
                  <p className="text-sm text-slate-600">
                    This is a basic card with shadow and border.
                  </p>
                  {showCodeLabels && (
                    <div className="text-xs text-slate-500 mt-1">
                      &lt;p&gt; - text-sm (0.875rem)
                    </div>
                  )}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Elevated Card
                  </h3>
                  {showCodeLabels && (
                    <div className="text-xs text-slate-500 mb-1">
                      &lt;h3&gt; - text-lg font-semibold (1.125rem)
                    </div>
                  )}
                  <p className="text-sm text-slate-600">
                    This card has a more prominent shadow.
                  </p>
                  {showCodeLabels && (
                    <div className="text-xs text-slate-500 mt-1">
                      &lt;p&gt; - text-sm (0.875rem)
                    </div>
                  )}
                </div>
                <div className="bg-slate-50 p-6 object-cover border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Subtle Card
                  </h3>
                  {showCodeLabels && (
                    <div className="text-xs text-slate-500 mb-1">
                      &lt;h3&gt; - text-lg font-semibold (1.125rem)
                    </div>
                  )}
                  <p className="text-sm text-slate-600">
                    This card has a subtle background.
                  </p>
                  {showCodeLabels && (
                    <div className="text-xs text-slate-500 mt-1">
                      &lt;p&gt; - text-sm (0.875rem)
                    </div>
                  )}
                </div>
              </div>

              {/* Help Card Example */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Help Card Example
                </h3>
                {showCodeLabels && (
                  <div className="text-xs text-slate-500 mb-2">
                    &lt;h3&gt; - text-lg font-semibold (1.125rem)
                  </div>
                )}
                <div className="max-w-md">
                  <HelpCard
                    onHelpClick={() => console.log("Help clicked")}
                    onChooseMyselfClick={() =>
                      console.log("Choose myself clicked")
                    }
                    onClose={() => console.log("Close clicked")}
                  />
                </div>
              </div>

              {/* AI Recommendation Card Example */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  AI Recommendation Card Example
                </h3>
                {showCodeLabels && (
                  <div className="text-xs text-slate-500 mb-2">
                    &lt;h3&gt; - text-lg font-semibold (1.125rem)
                  </div>
                )}
                <div className="max-w-md">
                  <AIRecommendationCard
                    recommendation="Affordable and Clean Energy aligns with your personal values and actions."
                    onAccept={() => console.log("Recommendation accepted")}
                    onTryAnother={() => console.log("Try another clicked")}
                  />
                </div>
              </div>

              {/* Action Card Example */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Action Card Example
                </h3>
                {showCodeLabels && (
                  <div className="text-xs text-slate-500 mb-2">
                    &lt;h3&gt; - text-lg font-semibold (1.125rem)
                  </div>
                )}
                <div className="max-w-md">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-400 rounded-full overflow-hidden flex items-center justify-center">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            Grace
                          </h4>
                          {showCodeLabels && (
                            <div className="text-xs text-slate-500 mb-1">
                              &lt;h4&gt; - text-lg font-semibold (1.125rem)
                            </div>
                          )}
                          <p className="text-xs text-slate-600">
                            Practice Daily Meditation
                          </p>
                          {showCodeLabels && (
                            <div className="text-xs text-slate-500 mb-1">
                              &lt;p&gt; - text-xs (0.75rem)
                            </div>
                          )}
                          <p className="text-xs text-slate-500">30 Minutes</p>
                          {showCodeLabels && (
                            <div className="text-xs text-slate-500">
                              &lt;p&gt; - text-xs (0.75rem)
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Action created
                        </div>
                        {showCodeLabels && (
                          <div className="text-xs text-slate-500 mt-1">
                            &lt;div&gt; - text-xs font-medium (0.75rem)
                          </div>
                        )}
                        <button
                          onClick={() =>
                            setDesignSystemCardExpanded(
                              !designSystemCardExpanded
                            )
                          }
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              designSystemCardExpanded ? "rotate-180" : ""
                            }`}
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
                        </button>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {designSystemCardExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-sm text-slate-600 mb-3">
                          Develop a consistent meditation practice to improve
                          mindfulness and reduce stress. Start with 10 minutes
                          daily and gradually increase to 30 minutes.
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
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full border-2 z-10 transition-all bg-blue-600 border-blue-600"></div>
                                <button className="mt-2 text-xs font-medium transition-colors text-center text-blue-600">
                                  No Change
                                </button>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full border-2 z-10 transition-all bg-white border-slate-300"></div>
                                <button className="mt-2 text-xs font-medium transition-colors text-center text-slate-600 hover:text-slate-900">
                                  Slight Change
                                </button>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full border-2 z-10 transition-all bg-white border-slate-300"></div>
                                <button className="mt-2 text-xs font-medium transition-colors text-center text-slate-600 hover:text-slate-900">
                                  Moderate Change
                                </button>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full border-2 z-10 transition-all bg-white border-slate-300"></div>
                                <button className="mt-2 text-xs font-medium transition-colors text-center text-slate-600 hover:text-slate-900">
                                  Significant Change
                                </button>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full border-2 z-10 transition-all bg-white border-slate-300"></div>
                                <button className="mt-2 text-xs font-medium transition-colors text-center text-slate-600 hover:text-slate-900">
                                  Dramatic Change
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Form Elements */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Form Elements
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Input Field
                  </label>
                  <input
                    type="text"
                    placeholder="Enter text here..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Textarea
                  </label>
                  <textarea
                    placeholder="Enter description here..."
                    rows={3}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <YesNoToggle
                    label="Toggle"
                    value={designSystemToggle}
                    onChange={setDesignSystemToggle}
                  />
                </div>
              </div>
            </section>

            {/* Featured Course */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Featured Course
              </h2>
              <div className="max-w-2xl">
                <div
                  className="bg-slate-50 object-cover p-4 text-[#0f172a] border border-slate-100"
                  style={{ minHeight: "500px" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <span className="mr-2">
                          <Sparkles className="h-5 w-5 text-blue-500" />
                        </span>
                        <h3 className="text-xl font-semibold text-slate-900">
                          Featured Course
                        </h3>
                        {showCodeLabels && (
                          <div className="text-xs text-slate-500 ml-2">
                            &lt;h3&gt; - text-xl font-semibold (1.25rem)
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-[#0f172a]">
                        Intro to UX
                      </h3>
                      {showCodeLabels && (
                        <div className="text-xs text-slate-500 mb-2">
                          &lt;h3&gt; - text-2xl font-bold (1.5rem)
                        </div>
                      )}
                      <div className="relative">
                        <p className="text-[#0f172a] text-sm leading-relaxed mb-4 text-slate-600">
                          Master the fundamentals of user experience design in
                          this comprehensive course. Learn how to create
                          intuitive interfaces, conduct user research, and build
                          products that people love. Perfect for designers,
                          developers, and product managers looking to enhance
                          their UX skills.
                        </p>
                        {showCodeLabels && (
                          <div className="text-xs text-slate-500 mb-2">
                            &lt;p&gt; - text-sm (0.875rem)
                          </div>
                        )}
                      </div>

                      {/* Read More Button */}
                      <div className="mt-4">
                        <button
                          onClick={() => setShowGraceModal(true)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm underline block mt-2 p-2 border border-blue-300 rounded"
                        >
                          Read more
                        </button>
                        {showCodeLabels && (
                          <div className="text-xs text-slate-500 mt-1">
                            &lt;button&gt; - text-sm font-medium (0.875rem)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Course - Dashboard Version */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Dashboard Version
                </h3>
                {showCodeLabels && (
                  <div className="text-xs text-slate-500 mb-2">
                    &lt;h3&gt; - text-lg font-semibold (1.125rem)
                  </div>
                )}
                <div className="max-w-md">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      Featured Course:{" "}
                      <span className="text-blue-600">Intro to UX</span>
                    </h3>
                    {showCodeLabels && (
                      <div className="text-xs text-slate-500 mb-2">
                        &lt;h3&gt; - text-xl font-semibold (1.25rem)
                      </div>
                    )}
                    <p className="text-slate-700 leading-relaxed mb-4">
                      Grace is our connection to a higher power, a sense of
                      being cared for and supported in all situations. It
                      involves embracing the abundance around us. Grace
                      motivates us to offer unconditional love and kindness to
                      others.
                    </p>
                    {showCodeLabels && (
                      <div className="text-xs text-slate-500 mb-2">
                        &lt;p&gt; - text-slate-700 (default)
                      </div>
                    )}
                    <button
                      onClick={() => setShowGraceModal(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                    >
                      Read more
                    </button>
                    {showCodeLabels && (
                      <div className="text-xs text-slate-500 mt-1">
                        &lt;button&gt; - text-sm font-medium (0.875rem)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Spacing */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Spacing Scale
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1 h-4 bg-slate-300 mr-4"></div>
                  <span className="text-sm">1 (4px)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-4 bg-slate-300 mr-4"></div>
                  <span className="text-sm">2 (8px)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-4 bg-slate-300 mr-4"></div>
                  <span className="text-sm">3 (12px)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-slate-300 mr-4"></div>
                  <span className="text-sm">4 (16px)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-4 bg-slate-300 mr-4"></div>
                  <span className="text-sm">6 (24px)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-4 bg-slate-300 mr-4"></div>
                  <span className="text-sm">8 (32px)</span>
                </div>
              </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-center">
              <button
                onClick={() => navigateToScreen(0)}
                className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-full font-medium transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Grace Modal for Design System */}
        {showGraceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Grace - Extended Definition
                  </h3>
                  <button
                    onClick={() => setShowGraceModal(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">
                      Grace Affirmations
                    </h4>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>I trust
                        that grace will guide me through challenges.
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>I remain
                        open to the abundance life offers.
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>I show
                        compassion and kindness to others.
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>I approach
                        life with grace and courtesy.
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>I embrace
                        forgiveness.
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>I
                        communicate and act with gentleness and respect.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-slate-700 italic mb-2">
                      "I am grateful for the gift of Grace. It supports and
                      enriches my life."
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-slate-700 italic">
                      "Grace is not part of consciousness; it is the amount of
                      light in our souls, not knowledge nor reason"
                    </p>
                    <p className="text-slate-600 text-sm mt-2">
                      ~ Pope Francis
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowGraceModal(false)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-full font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Onboarding workflow
  const handleOnboardingComplete = () => {
    setOnboardingStep(null);
    navigateToScreen(0); // Go to dashboard
  };

  const handleOnboardingNext = () => {
    if (onboardingStep === null) return;
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      handleOnboardingComplete();
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep === null || onboardingStep === 1) return;
    setOnboardingStep(onboardingStep - 1);
  };

  // Show onboarding for new users
  if (user.isNewUser && onboardingStep !== null) {
    return (
      <div className="pb-20 md:pb-0">
        {onboardingStep === 1 && (
          <OnboardingWelcomeScreen onNext={handleOnboardingNext} />
        )}
        {onboardingStep === 2 && (
          <OnboardingAssessmentScreen
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
            onComplete={(data) => {
              // Store assessment data
              console.log("Assessment data:", data);
            }}
          />
        )}
        {onboardingStep === 3 && (
          <OnboardingGoalsScreen
            onNext={handleOnboardingNext}
            onBack={handleOnboardingBack}
            onComplete={(goals) => {
              // Store goals
              console.log("Learning goals:", goals);
            }}
          />
        )}
        {onboardingStep === 4 && (
          <OnboardingDashboardScreen onComplete={handleOnboardingComplete} />
        )}
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0">
      {currentScreen === 0 && <HomeDashboardScreenComponent />}
      {currentScreen === 1 && (
        <WelcomeScreen
          onStartOnboarding={() => {
            if (user.isNewUser) {
              setOnboardingStep(1);
            }
          }}
        />
      )}
      {currentScreen === 2 && <LearningStyleSelectionScreen />}
      {currentScreen === 3 && <GoalCreationScreen />}
      {currentScreen === 4 && <GoalConfirmationScreen />}
      {currentScreen === 5 && <DescribeSituationScreen />}
      {currentScreen === 6 && <Step5Screen />}
      {currentScreen === 7 && <Step6Screen />}
      {currentScreen === 8 && <Step7Screen />}
      {currentScreen === 9 && <JourneyViewScreen />}
      {currentScreen === 10 && <ProgressSubmissionScreen />}
      {currentScreen === 11 && <SDGsScreen />}
      {currentScreen === 12 && <AllVirtuesScreen />}
      {currentScreen === 13 && <UserResearchScreen />}
      {currentScreen === 17 && <ActionJourneyScreen />}
      {currentScreen === 20 && <DesignSystemScreen />}
      {currentScreen === 21 && (
        <CourseLibraryScreen
          onBack={() => navigateToScreen(1)}
          Navigation={Navigation}
        />
      )}
    </div>
  );
}

export default App;
