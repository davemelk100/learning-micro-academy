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
  navigateToScreen: (screen: number) => void;
  Navigation: React.ComponentType;
  // Additional props for modals and editing functionality
  editingGoal: Goal | null;
  setEditingGoal: (goal: Goal | null) => void;
  newGoal: any;
  setNewGoal: (goal: any) => void;
  setGoals: (goals: Goal[]) => void;
  progressModalOpen: boolean;
  setProgressModalOpen: (open: boolean) => void;
  selectedGoalForProgress: Goal | null;
  setSelectedGoalForProgress: (goal: Goal | null) => void;
  progressUpdate: { amount: number; notes: string };
  setProgressUpdate: (update: { amount: number; notes: string }) => void;
  updateGoalProgress: (goalId: string, amount: number, notes: string) => void;
  openGraceModal: () => void;
}

export const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({
  user,
  goals,
  userStats,
  navigateToScreen,
  Navigation,
  editingGoal,
  setEditingGoal,
  newGoal,
  setNewGoal,
  setGoals,
  progressModalOpen,
  setProgressModalOpen,
  selectedGoalForProgress,
  setSelectedGoalForProgress,
  progressUpdate,
  setProgressUpdate,
  updateGoalProgress,
  openGraceModal,
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

        {/* Virtue of the Week and Your Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
          <VirtueOfTheWeek openGraceModal={openGraceModal} />
          <ActionsOverview
            goals={goals}
            navigateToScreen={navigateToScreen}
            expandedCards={expandedCards}
            toggleCardExpansion={toggleCardExpansion}
            selectedAmountChange1={selectedAmountChange1}
            setSelectedAmountChange1={setSelectedAmountChange1}
          />
        </div>

        <VirtueProgress navigateToScreen={navigateToScreen} />
        <StatsOverview userStats={userStats} />
      </div>
    </div>
  );
};
