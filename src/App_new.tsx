import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

// Import types and utilities
import { Virtue, Goal, UserState, UserPreferences } from "./types";
import { virtues, sdgGoals, fontOptions } from "./data";
import {
  saveUserState,
  getUserState,
  clearGoalCreationState,
  getFontClass,
  getHeadingFontClass,
  defaultUserPreferences,
} from "./utils";

// Import components
import { FontSelector } from "./components/FontSelector";
import { HelpButton } from "./components/HelpButton";
import { AIInput } from "./components/AIInput";
import { Dashboard } from "./components/Dashboard";
import { SDGSelectionScreen } from "./components/SDGSelectionScreen";
import { VirtueSelectionScreen } from "./components/VirtueSelectionScreen";

// Main App Router Component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Main App Content Component
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Convert pathname to screen number for backward compatibility
  const getCurrentScreen = () => {
    const path = location.pathname;
    switch (path) {
      case "/":
        return 1; // Welcome screen
      case "/dashboard":
        return 0; // Dashboard screen
      case "/welcome":
        return 1;
      case "/aspects":
        return 2;
      case "/goals":
        return 3;
      case "/confirmation":
        return 4;
      case "/journey":
        return 6;
      case "/progress":
        return 7;
      case "/sdgs":
        return 8;
      case "/user-research":
        return 11;
      case "/journeys":
        return 12;
      case "/gtm-plan":
        return 13;
      case "/audits":
        return 14;
      default:
        return 1; // Default to welcome screen
    }
  };

  const currentScreen = getCurrentScreen();

  // Navigation function that updates URL
  const navigateToScreen = (screenNumber: number) => {
    const routes = {
      0: "/dashboard",
      1: "/welcome",
      2: "/aspects",
      3: "/goals",
      4: "/confirmation",
      6: "/journey",
      7: "/progress",
      8: "/sdgs",
      11: "/user-research",
      12: "/journeys",
      13: "/gtm-plan",
      14: "/audits",
    };

    const route = routes[screenNumber as keyof typeof routes];
    if (route) {
      console.log(`Navigating to screen ${screenNumber} -> ${route}`);
      navigate(route);
    } else {
      console.warn(`No route found for screen number: ${screenNumber}`);
    }
  };

  // Initialize state from localStorage
  const savedState = getUserState();

  // State management
  const [selectedVirtue, setSelectedVirtue] = useState<Virtue | null>(
    savedState.preferences.selectedVirtue
  );
  const [selectedSDGs, setSelectedSDGs] = useState<string[]>(
    savedState.preferences.selectedSDGs || []
  );
  const [currentSelectedSDG, setCurrentSelectedSDG] = useState<string>(
    savedState.preferences.currentSelectedSDG || ""
  );
  const [goals, setGoals] = useState<Goal[]>(savedState.goals);
  const [newGoal, setNewGoal] = useState(savedState.preferences.newGoal);
  const [user] = useState({ name: "Najuma", isNewUser: false });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoadingAIAssistance, setIsLoadingAIAssistance] = useState(false);
  const [selectedFont, setSelectedFont] = useState("philosopher-mulish");
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [aiConversationOpen, setAiConversationOpen] = useState<boolean>(false);
  const [aiConversationMessages, setAiConversationMessages] = useState<
    Array<{ role: "user" | "ai"; message: string }>
  >([]);
  const [aiConversationInput, setAiConversationInput] = useState<string>("");
  const conversationInputRef = useRef<HTMLInputElement>(null);
  const [animatingSDG, setAnimatingSDG] = useState<string | null>(null);

  // User stats
  const [userStats] = useState({
    totalGoals: 12,
    completedGoals: 8,
    totalPoints: 2450,
    weeklyProgress: 85,
    currentStreak: 7,
  });

  // AI Conversation handler
  const handleAIConversation = (input: string) => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [
      ...aiConversationMessages,
      { role: "user" as const, message: input },
    ];
    setAiConversationMessages(newMessages);
    setAiConversationInput("");

    // Simulate AI response
    setTimeout(() => {
      setAiConversationMessages([
        ...newMessages,
        {
          role: "ai" as const,
          message:
            "Thank you for your question! I'm here to help guide you on your virtue journey.",
        },
      ]);
    }, 1000);
  };

  // Save user state whenever relevant state changes
  useEffect(() => {
    const userState: UserState = {
      preferences: {
        name: user.name,
        selectedFont,
        selectedSDGs,
        currentSelectedSDG,
        hasCompletedSDGSetup: selectedSDGs.length > 0,
      },
      goals,
      progress: [],
      currentScreen,
    };
    saveUserState(userState);
  }, [
    user.name,
    selectedFont,
    selectedSDGs,
    currentSelectedSDG,
    goals,
    currentScreen,
  ]);

  // Render different screens based on current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 0: // Dashboard
        return (
          <Dashboard
            user={user}
            goals={goals}
            userStats={userStats}
            selectedFont={selectedFont}
            setIsLoadingAIAssistance={setIsLoadingAIAssistance}
            navigate={navigate}
            setSelectedVirtue={setSelectedVirtue}
            setSelectedSDGs={setSelectedSDGs}
            setCurrentSelectedSDG={setCurrentSelectedSDG}
            setNewGoal={setNewGoal}
            setGoals={setGoals}
            saveUserState={saveUserState}
            // Additional props for Dashboard functionality
            openEditGoalModal={() => {}}
            deleteGoal={() => {}}
            handleProgressLevelChange={() => {}}
            currentProgressLevel={1}
            showProgressDefinition={true}
            progressDefinitions={[]}
            editGoalModalOpen={false}
            selectedGoalForEdit={null}
            newGoal={newGoal}
            setEditGoalModalOpen={() => {}}
            setSelectedGoalForEdit={() => {}}
            setProgressModalOpen={() => {}}
            progressModalOpen={false}
            selectedGoalForProgress={null}
            progressUpdate={{ amount: 1, notes: "" }}
            setProgressUpdate={() => {}}
            updateGoalProgress={() => {}}
            setSelectedGoalForProgress={() => {}}
          />
        );

      case 2: // Virtue Selection
        return (
          <VirtueSelectionScreen
            selectedSDGs={selectedSDGs}
            currentSelectedSDG={currentSelectedSDG}
            selectedVirtue={selectedVirtue}
            setSelectedVirtue={setSelectedVirtue}
            navigateToScreen={navigateToScreen}
            selectedFont={selectedFont}
            aiConversationOpen={aiConversationOpen}
            conversationInputRef={conversationInputRef}
            setAiConversationOpen={setAiConversationOpen}
            setAiConversationMessages={setAiConversationMessages}
            setAiConversationInput={setAiConversationInput}
            aiConversationMessages={aiConversationMessages}
            aiConversationInput={aiConversationInput}
            handleAIConversation={handleAIConversation}
          />
        );

      case 8: // SDG Selection
        return (
          <SDGSelectionScreen
            selectedSDGs={selectedSDGs}
            setSelectedSDGs={setSelectedSDGs}
            setCurrentSelectedSDG={setCurrentSelectedSDG}
            navigateToScreen={navigateToScreen}
            selectedFont={selectedFont}
            aiConversationOpen={aiConversationOpen}
            conversationInputRef={conversationInputRef}
            animatingSDG={animatingSDG}
          />
        );

      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">
                Screen {currentScreen}
              </h1>
              <p className="text-slate-600">
                This screen is not yet implemented in the refactored version.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-warm-white ${getFontClass(selectedFont)}`}>
      {renderScreen()}
    </div>
  );
}

export default App;
