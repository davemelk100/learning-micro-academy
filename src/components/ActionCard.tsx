import React, { useState } from "react";
import { ChevronDown, ChevronUp, Database } from "lucide-react";
import { Goal, Virtue, CompletedAction } from "../types";

interface ActionCardProps {
  goal: Goal;
  virtue: Virtue;
  isCompleted?: boolean;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
  onToggleComplete?: (goal: Goal) => void;
  onSaveToDatabase?: (completedAction: CompletedAction) => void;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  goal,
  virtue,
  isCompleted = false,
  onEdit,
  onDelete,
  onToggleComplete,
  onSaveToDatabase,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = virtue.icon;

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
          Completed
        </div>
      );
    }
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 whitespace-nowrap">
        In Progress
      </div>
    );
  };

  const getTimeEstimate = () => {
    if (goal.title.includes("5 Minute")) return "5 Minutes";
    if (goal.title.includes("15 Minute")) return "15 Minutes";
    if (goal.title.includes("30 Minute")) return "30 Minutes";
    if (goal.title.includes("1 Hour")) return "1 Hour";
    return "Time varies";
  };

  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-md border border-slate-100 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 ${virtue.color} rounded-full overflow-hidden flex items-center justify-center`}
          >
            <IconComponent className={`h-5 w-5 ${virtue.iconColor}`} />
          </div>
          <div>
            <h4
              className={`text-lg font-semibold text-slate-900 ${
                isCompleted ? "line-through text-slate-500" : ""
              }`}
            >
              {goal.title}
            </h4>
            <p className="text-xs text-slate-600">{virtue.name}</p>
            <p className="text-xs text-slate-500">{getTimeEstimate()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm text-slate-600 mb-3">{goal.description}</p>

          {/* Progress information */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-700">
                Progress
              </span>
              <span className="text-xs text-slate-600">
                {goal.progress} / {goal.target}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (goal.progress / goal.target) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 mt-4">
            {onToggleComplete && (
              <button
                onClick={() => onToggleComplete(goal)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isCompleted
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {isCompleted ? "Mark Incomplete" : "Mark Complete"}
              </button>
            )}
            {isCompleted && onSaveToDatabase && (
              <button
                onClick={() => {
                  // Create a basic completed action for saving
                  const completedAction: CompletedAction = {
                    id: `completed_${goal.id}_${Date.now()}`,
                    originalGoalId: goal.id,
                    title: goal.title,
                    description: goal.description,
                    virtueId: goal.virtueId,
                    virtueName: virtue.name,
                    sdgIds: goal.sdgIds || [],
                    completedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                  onSaveToDatabase(completedAction);
                }}
                className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center space-x-1"
              >
                <Database className="h-3 w-3" />
                <span>Save to DB</span>
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(goal)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(goal)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
