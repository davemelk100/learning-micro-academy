import React, { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { WelcomeSection } from "../components/WelcomeSection";
import { VirtueOfTheWeek } from "../components/VirtueOfTheWeek";
import { ActionsOverview } from "../components/ActionsOverview";
import { VirtueProgress } from "../components/VirtueProgress";
import { StatsOverview } from "../components/StatsOverview";
import { Goal } from "../types";

interface HomeDashboardScreenProps {
  user: { name: string; isNewUser: boolean };
  goals: Goal[];
  userStats: {
    currentStreak: number;
  };
  navigateToScreen: (_screen: number) => void;
  Navigation: React.ComponentType;
  onNavigateToCourse?: (_courseId: string) => void;
  // Additional props for modals and editing functionality
  editingGoal: Goal | null;
  setEditingGoal: (_goal: Goal | null) => void;
  newGoal: any;
  setNewGoal: (_goal: any) => void;
  setGoals: (_goals: Goal[]) => void;
  progressModalOpen: boolean;
  setProgressModalOpen: (_open: boolean) => void;
  selectedGoalForProgress: Goal | null;
  setSelectedGoalForProgress: (_goal: Goal | null) => void;
  progressUpdate: { amount: number; notes: string };
  setProgressUpdate: (_update: { amount: number; notes: string }) => void;
  updateGoalProgress: (
    _goalId: string,
    _amount: number,
    _notes: string
  ) => void;
}

export const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({
  user,
  goals,
  userStats,
  navigateToScreen,
  Navigation,
  onNavigateToCourse,
}) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [selectedAmountChange1, setSelectedAmountChange1] = useState<
    string | null
  >(null);

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto">
      <AppHeader navigateToScreen={navigateToScreen} Navigation={Navigation} />

      <div className="p-4 md:p-6">
        <WelcomeSection userName={user.name} />

        {/* Featured Course and Your Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
          <VirtueOfTheWeek />
          <ActionsOverview
            goals={goals}
            navigateToScreen={navigateToScreen}
            expandedCards={expandedCards}
            toggleCardExpansion={toggleCardExpansion}
            selectedAmountChange1={selectedAmountChange1}
            setSelectedAmountChange1={setSelectedAmountChange1}
            onNavigateToCourse={onNavigateToCourse}
          />
        </div>

        <VirtueProgress navigateToScreen={navigateToScreen} />
        <StatsOverview userStats={userStats} />
      </div>
    </div>
  );
};
