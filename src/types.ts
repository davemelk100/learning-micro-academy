import React from "react";

export interface LearningStyle {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  iconColor: string;
  description: string;
}

// Virtue is an alias for LearningStyle for backward compatibility
export type Virtue = LearningStyle;

export interface Goal {
  id: string;
  learningStyleId: string;
  sdgIds: string[];
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  submitted?: boolean;
  submittedAt?: string;
  hiddenFromDashboard?: boolean;
  communityActionData?: {
    impactOnYourself: boolean | null;
    impactOnOthers: boolean | null;
    communityActionNotes: string;
  };
  communitySituationData?: {
    situationImpactOnYourself: boolean | null;
    situationImpactOnOthers: boolean | null;
    communitySituationNotes: string;
  };
}

export interface ProgressEntry {
  id: string;
  goalId: string;
  date: string;
  notes: string;
  value: number;
}

export interface UserPreferences {
  theme: string;
  notifications: boolean;
  emailUpdates: boolean;
  language: string;
  selectedLearningStyle: string | null;
  selectedSDGs: string[];
  currentSelectedSDG: string;
  hasCompletedSDGSetup: boolean;
  hasCompletedOnboarding: boolean;
  newGoal: {
    title: string;
    description: string;
    target: number;
  };
  lastUpdated: string;
  name: string;
  selectedFont: string;
  darkMode: boolean;
  progressIntensity: number; // 1-10 scale
  learningMetrics?: {
    currentProficiency: number;
    skillsMasteredThisMonth: number;
    activeLearningStreak: number;
    completionRate: number;
  };
  onboardingData?: {
    subjects?: string[];
    proficiencyLevel?: string;
    learningGoals?: string;
    onboardingGoals?: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  completedCourses?: string[]; // Array of course IDs
}

export interface UserState {
  preferences: UserPreferences;
  goals: Goal[];
  progress: ProgressEntry[];
  currentScreen: number;
}

export interface FontOption {
  id: string;
  name: string;
  className: string;
  headingClassName: string;
}

export interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface HelpButtonProps {
  onClick: () => void;
  className?: string;
}

export interface HelpCardProps {
  onHelpClick: () => void;
  onChooseMyselfClick: () => void;
  onClose?: () => void;
  className?: string;
}

export interface AIRecommendationCardProps {
  recommendation: string;
  onAccept: () => void;
  onTryAnother: () => void;
  className?: string;
}

export interface ActionCardProps {
  goal: Goal;
  learningStyle: LearningStyle;
  isCompleted?: boolean;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
  onToggleComplete?: (goal: Goal) => void;
  onSaveToDatabase?: (completedAction: CompletedAction) => void;
  className?: string;
}

export interface CompletedAction {
  id: string;
  originalGoalId: string;
  title: string;
  description: string;
  learningStyleId: string;
  learningStyleName: string;
  sdgIds: string[];
  completedAt: string;
  completionNotes?: string;
  impactRating?: number; // 1-5 scale
  lessonsLearned?: string;
  nextSteps?: string;
  tags?: string[];
  isArchived?: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseService {
  saveCompletedAction: (action: CompletedAction) => Promise<void>;
  getCompletedActions: () => Promise<CompletedAction[]>;
  updateCompletedAction: (
    id: string,
    updates: Partial<CompletedAction>
  ) => Promise<void>;
  deleteCompletedAction: (id: string) => Promise<void>;
  archiveCompletedAction: (id: string) => Promise<void>;
}
