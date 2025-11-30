import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { Goal, UserState } from "./types";
import { saveUserState, getUserState, getFontClass } from "./utils";
import { Dashboard } from "./components/Dashboard";

// Main App Router Component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: 0,
  });
  const [user] = useState({ name: "Najuma", isNewUser: false });
  const [selectedFont] = useState("philosopher-mulish");

  const [userStats] = useState({
    totalGoals: 12,
    completedGoals: 8,
    totalPoints: 2450,
    weeklyProgress: 85,
    currentStreak: 7,
  });

  useEffect(() => {
    const loadState = async () => {
      const savedState = await getUserState();
      if (savedState.goals) {
        setGoals(savedState.goals);
      }
      if (savedState.preferences.newGoal) {
        setNewGoal(savedState.preferences.newGoal);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    const userState: UserState = {
      preferences: {
        theme: "light",
        notifications: true,
        emailUpdates: true,
        language: "en",
        selectedLearningStyle: null,
        name: user.name,
        selectedFont,
        hasCompletedOnboarding: false,
        newGoal,
        lastUpdated: new Date().toISOString(),
        darkMode: false,
        progressIntensity: 5,
        completedCourses: [],
      },
      goals,
      progress: [],
      currentScreen: 0,
    };
    saveUserState(userState);
  }, [user.name, selectedFont, goals, newGoal]);

  const DashboardComponent = () => (
    <Dashboard
      user={user}
      goals={goals}
      userStats={userStats}
      selectedFont={selectedFont}
      navigate={navigate}
      setNewGoal={setNewGoal}
      setGoals={setGoals}
      saveUserState={saveUserState}
      openEditGoalModal={() => {}}
      openDeleteModal={() => {}}
      handleProgressLevelChange={() => {}}
      currentProgressLevel={1}
      showProgressDefinition={true}
      progressDefinitions={[]}
    />
  );

  const NotFoundComponent = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-600">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-warm-white ${getFontClass(selectedFont)}`}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardComponent />} />
        <Route path="*" element={<NotFoundComponent />} />
      </Routes>
    </div>
  );
}

export default App;
