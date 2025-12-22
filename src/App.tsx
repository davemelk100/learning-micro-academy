import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import { HomeDashboardScreen } from "./screens/HomeDashboardScreen";
import { CourseLibraryScreen } from "./components/CourseLibraryScreen";
import { AuthModal } from "./components/Auth/AuthModal";
import { UserProfile } from "./components/Profile/UserProfile";
import { Navigation } from "./components/Navigation";
import { createNavigationComponent } from "./components/NavigationWrapper";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { OnboardingWelcomeScreen } from "./components/OnboardingWelcomeScreen";
import { OnboardingAssessmentScreen } from "./components/OnboardingAssessmentScreen";
import { OnboardingDashboardScreen } from "./components/OnboardingDashboardScreen";
import { useAuth } from "./contexts/AuthContext";
import { saveUserState, getUserState } from "./utils";
import { UserState, Goal } from "./types";
import { appContent } from "./content/appContent";
import { ROUTES, getCourseRoute } from "./routes";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    undefined
  );
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
  });
  const displayUser = user || {
    name: appContent.defaults.guestName,
    isNewUser: true,
  };
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [_step7AmountChange, _setStep7AmountChange] = useState(0);

  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedGoalForProgress, setSelectedGoalForProgress] =
    useState<Goal | null>(null);
  const [progressUpdate, setProgressUpdate] = useState({
    amount: 1,
    notes: "",
  });

  // Onboarding workflow state
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null); // null = not in onboarding, 1-4 = onboarding steps

  // Navigation helper that uses React Router
  const navigateToRoute = (path: string) => {
    navigate(path);
  };

  // Get current route path for compatibility
  const getCurrentRoute = () => {
    return location.pathname;
  };

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

  // Component to handle root path redirect
  const RootRedirect = ({
    isNewUser,
    loadingUserState,
  }: {
    isNewUser: boolean;
    loadingUserState: boolean;
  }) => {
    if (loadingUserState) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      );
    }
    return (
      <Navigate to={isNewUser ? ROUTES.WELCOME : ROUTES.DASHBOARD} replace />
    );
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
      navigateToScreen={navigateToRoute}
      Navigation={createNavigationComponent({
        currentScreen: getCurrentRoute(),
        navigateToScreen: navigateToRoute,
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
        navigate(getCourseRoute(courseId));
      }}
      completedCourses={userState?.preferences?.completedCourses || []}
      courseProgress={userState?.preferences?.courseProgress || {}}
    />
  );

  // Removed LearningStyleSelectionScreen and GoalCreationScreen - replaced by onboarding workflow

  // Onboarding workflow handlers
  const handleOnboardingComplete = () => {
    setOnboardingStep(null);
    // Mark onboarding as completed
    const updatedState: UserState = {
      ...userState,
      preferences: {
        ...userState.preferences,
        hasCompletedOnboarding: true,
      },
    };
    setUserState(updatedState);
    saveUserState(updatedState).catch(console.error);
    navigate(ROUTES.DASHBOARD); // Go to dashboard
  };

  const handleOnboardingSkip = () => {
    setOnboardingStep(null);
    // Mark onboarding as completed when skipped
    const updatedState: UserState = {
      ...userState,
      preferences: {
        ...userState.preferences,
        hasCompletedOnboarding: true,
      },
    };
    setUserState(updatedState);
    saveUserState(updatedState).catch(console.error);
    navigate(ROUTES.DASHBOARD); // Go to dashboard
  };

  const handleOnboardingNext = () => {
    if (onboardingStep === null) return;
    if (onboardingStep === 1) {
      setOnboardingStep(2);
    } else if (onboardingStep === 2) {
      setOnboardingStep(4); // Skip step 3 (goals), go directly to dashboard overview
    } else if (onboardingStep === 4) {
      handleOnboardingComplete();
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep === null || onboardingStep === 1) return;
    if (onboardingStep === 4) {
      setOnboardingStep(2); // Skip step 3 (goals), go back to step 2
    } else {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  // Wrapper component for course detail route to extract courseId from URL
  const CourseDetailWrapper = ({
    navigate,
    navigateToRoute,
    getCurrentRoute,
    setShowAuthModal,
    setShowProfileModal,
    getUserState,
    setUserState,
    userState,
  }: {
    navigate: (path: string) => void;
    navigateToRoute: (path: string) => void;
    getCurrentRoute: () => string;
    setShowAuthModal: (show: boolean) => void;
    setShowProfileModal: (show: boolean) => void;
    getUserState: () => Promise<UserState>;
    setUserState: (state: UserState) => void;
    userState: UserState;
  }) => {
    const { courseId } = useParams<{ courseId: string }>();
    return (
      <CourseLibraryScreen
        onBack={() => {
          navigate(ROUTES.COURSE_LIBRARY);
        }}
        Navigation={() => (
          <Navigation
            currentScreen={getCurrentRoute()}
            navigateToScreen={navigateToRoute}
            setShowAuthModal={setShowAuthModal}
            setShowProfileModal={setShowProfileModal}
            getUserState={getUserState}
            setUserState={setUserState}
            onNavigateToCourseLibrary={() => {}}
          />
        )}
        userState={userState}
        onCourseComplete={() => {
          getUserState().then(setUserState).catch(console.error);
        }}
        onStateUpdate={(updatedState) => {
          setUserState(updatedState);
        }}
        initialCourseId={courseId}
      />
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

      {/* Show onboarding for new users */}
      {displayUser.isNewUser && onboardingStep !== null ? (
        <div className="pb-20 md:pb-0">
          {onboardingStep === 1 && (
            <OnboardingWelcomeScreen
              onNext={handleOnboardingNext}
              onSkip={handleOnboardingSkip}
            />
          )}
          {onboardingStep === 2 && (
            <OnboardingAssessmentScreen
              onNext={handleOnboardingNext}
              onBack={handleOnboardingBack}
              onSkip={handleOnboardingSkip}
              onComplete={(data) => {
                // Save assessment data to user profile
                const updatedState: UserState = {
                  ...userState,
                  preferences: {
                    ...userState.preferences,
                    onboardingData: {
                      ...userState.preferences.onboardingData,
                      subjects: data.subjects,
                      proficiencyLevel: data.proficiencyLevel,
                    },
                  },
                };
                setUserState(updatedState);
                saveUserState(updatedState).catch(console.error);
              }}
            />
          )}
          {onboardingStep === 4 && (
            <OnboardingDashboardScreen
              onComplete={handleOnboardingComplete}
              onSkip={handleOnboardingSkip}
            />
          )}
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <RootRedirect
                isNewUser={displayUser.isNewUser ?? true}
                loadingUserState={loadingUserState}
              />
            }
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={<HomeDashboardScreenComponent />}
          />
          <Route
            path={ROUTES.WELCOME}
            element={
              <WelcomeScreen
                onStartOnboarding={() => {
                  if (displayUser.isNewUser) {
                    setOnboardingStep(1);
                  }
                }}
                navigateToScreen={navigateToRoute}
                displayUser={{
                  name: displayUser.name || appContent.defaults.guestName,
                  isNewUser: displayUser.isNewUser ?? true,
                }}
                currentScreen={getCurrentRoute()}
                setShowAuthModal={setShowAuthModal}
                setShowProfileModal={setShowProfileModal}
                getUserState={getUserState}
                setUserState={setUserState}
              />
            }
          />
          <Route
            path={ROUTES.COURSE_LIBRARY}
            element={
              <CourseLibraryScreen
                onBack={() => {
                  setSelectedCourseId(undefined);
                  navigate(ROUTES.WELCOME);
                }}
                Navigation={() => (
                  <Navigation
                    currentScreen={getCurrentRoute()}
                    navigateToScreen={navigateToRoute}
                    setShowAuthModal={setShowAuthModal}
                    setShowProfileModal={setShowProfileModal}
                    getUserState={getUserState}
                    setUserState={setUserState}
                    onNavigateToCourseLibrary={() =>
                      setSelectedCourseId(undefined)
                    }
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
            }
          />
          <Route
            path={ROUTES.COURSE_DETAIL}
            element={
              <CourseDetailWrapper
                navigate={navigate}
                navigateToRoute={navigateToRoute}
                getCurrentRoute={getCurrentRoute}
                setShowAuthModal={setShowAuthModal}
                setShowProfileModal={setShowProfileModal}
                getUserState={getUserState}
                setUserState={setUserState}
                userState={userState}
              />
            }
          />
          <Route
            path="*"
            element={<Navigate to={ROUTES.DASHBOARD} replace />}
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
