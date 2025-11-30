import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Database,
  Archive,
  Star,
  Calendar,
  Tag,
} from "lucide-react";
import { CompletedAction } from "../types";

interface SavedActionCardProps {
  completedAction: CompletedAction;
  onArchive?: (_id: string) => void;
  onDelete?: (_id: string) => void;
  className?: string;
}

export const SavedActionCard: React.FC<SavedActionCardProps> = ({
  completedAction,
  onArchive,
  onDelete,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderImpactStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-slate-300"
            }`}
          />
        ))}
        <span className="text-sm text-slate-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {completedAction.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {completedAction.virtueName}
                </p>
              </div>
            </div>

            <p className="text-slate-700 mb-3">{completedAction.description}</p>

            {/* Impact Rating */}
            {completedAction.impactRating && (
              <div className="mb-3">
                {renderImpactStars(completedAction.impactRating)}
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
              <span className="flex items-center space-x-1">
                <Calendar className="h-5 w-5" />
                <span>Completed {formatDate(completedAction.completedAt)}</span>
              </span>
              {completedAction.tags && completedAction.tags.length > 0 && (
                <span className="flex items-center space-x-1">
                  <Tag className="h-5 w-5" />
                  <span>{completedAction.tags.length} tags</span>
                </span>
              )}
            </div>

            {/* Tags */}
            {completedAction.tags && completedAction.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {completedAction.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500">Saved to database</span>
          </div>
          <div className="flex items-center space-x-2">
            {onArchive && (
              <button
                onClick={() => onArchive(completedAction.id)}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors flex items-center space-x-1"
              >
                <Archive className="h-5 w-5" />
                <span>Archive</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(completedAction.id)}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-slate-100">
          <div className="pt-4 space-y-4">
            {/* Completion Notes */}
            {completedAction.completionNotes && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Completion Notes:
                </h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  {completedAction.completionNotes}
                </p>
              </div>
            )}

            {/* Lessons Learned */}
            {completedAction.lessonsLearned && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Lessons Learned:
                </h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  {completedAction.lessonsLearned}
                </p>
              </div>
            )}

            {/* Next Steps */}
            {completedAction.nextSteps && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Next Steps:
                </h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  {completedAction.nextSteps}
                </p>
              </div>
            )}

            {/* Timestamps */}
            <div className="text-xs text-slate-400 space-y-1">
              <p>Created: {formatDate(completedAction.createdAt)}</p>
              <p>Last Updated: {formatDate(completedAction.updatedAt)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
