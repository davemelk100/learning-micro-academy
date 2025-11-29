import React from "react";
import { SavedActionCard } from "./SavedActionCard";
import { CompletedAction } from "../types";

interface SavedActionsSectionProps {
  savedCompletedActions: CompletedAction[];
  showSavedActions: boolean;
  setShowSavedActions: (_show: boolean) => void;
  selectedFont: string;
  getHeadingFontClass: (_font: string) => string;
  handleArchiveSavedAction: (_id: string) => void;
  handleDeleteSavedAction: (_id: string) => void;
}

export const SavedActionsSection: React.FC<SavedActionsSectionProps> = ({
  savedCompletedActions,
  showSavedActions,
  setShowSavedActions,
  selectedFont,
  getHeadingFontClass,
  handleArchiveSavedAction,
  handleDeleteSavedAction,
}) => {
  if (savedCompletedActions.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-lg font-semibold text-slate-900 ${getHeadingFontClass(
            selectedFont
          )}`}
        >
          Saved Actions ({savedCompletedActions.length})
        </h3>
        <button
          onClick={() => setShowSavedActions(!showSavedActions)}
          className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
        >
          {showSavedActions ? "Hide" : "Show"} Saved Actions
        </button>
      </div>

      {showSavedActions && (
        <div className="space-y-4">
          {savedCompletedActions.map((completedAction) => (
            <SavedActionCard
              key={completedAction.id}
              completedAction={completedAction}
              onArchive={handleArchiveSavedAction}
              onDelete={handleDeleteSavedAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};
