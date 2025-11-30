import React, { useState, useEffect, useCallback } from "react";
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

  // Removed LearningStyleSelectionScreen and GoalCreationScreen - replaced by onboarding workflow

  // Onboarding workflow handlers
  const handleOnboardingComplete = () => {
    setOnboardingStep(null);
    navigateToScreen(0); // Go to dashboard
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

  // Show onboarding for new users
  if (displayUser.isNewUser && onboardingStep !== null) {
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
          <OnboardingDashboardScreen onComplete={handleOnboardingComplete} />
        )}
      </div>
    );
  }

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
              setOnboardingStep(1);
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
