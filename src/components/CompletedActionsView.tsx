import React, { useState, useEffect } from "react";
import {
  Database,
  Archive,
  Trash2,
  Search,
  Calendar,
  Star,
  Tag,
} from "lucide-react";
import { CompletedAction } from "../types";
import { databaseService } from "../services/databaseService";

interface CompletedActionsViewProps {
  onClose: () => void;
}

export const CompletedActionsView: React.FC<CompletedActionsViewProps> = ({
  onClose,
}) => {
  const [completedActions, setCompletedActions] = useState<CompletedAction[]>(
    []
  );
  const [filteredActions, setFilteredActions] = useState<CompletedAction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVirtue, setSelectedVirtue] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "impact" | "title">("date");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompletedActions();
  }, []);

  useEffect(() => {
    filterAndSortActions();
  }, [completedActions, searchTerm, selectedVirtue, sortBy]);

  const loadCompletedActions = async () => {
    try {
      setIsLoading(true);
      const actions = await databaseService.getCompletedActions();
      setCompletedActions(actions);
    } catch (error) {
      console.error("Failed to load completed actions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortActions = () => {
    let filtered = completedActions.filter((action) => !action.isArchived);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (action) =>
          action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.lessonsLearned
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          action.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by virtue
    if (selectedVirtue !== "all") {
      filtered = filtered.filter(
        (action) => action.virtueId === selectedVirtue
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
          );
        case "impact":
          return (b.impactRating || 0) - (a.impactRating || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredActions(filtered);
  };

  const handleArchive = async (id: string) => {
    try {
      await databaseService.archiveCompletedAction(id);
      await loadCompletedActions();
    } catch (error) {
      console.error("Failed to archive action:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this completed action?")
    ) {
      try {
        await databaseService.deleteCompletedAction(id);
        await loadCompletedActions();
      } catch (error) {
        console.error("Failed to delete action:", error);
      }
    }
  };

  const getVirtueOptions = () => {
    const virtues = [
      ...new Set(completedActions.map((action) => action.virtueName)),
    ];
    return virtues.map((virtue) => ({ value: virtue, label: virtue }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderImpactStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading completed actions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Completed Actions Database
                </h1>
                <p className="text-sm text-slate-600">
                  {filteredActions.length} actions saved
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <span className="sr-only">Close</span>✕
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search actions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Learning Style Filter */}
            <select
              value={selectedVirtue}
              onChange={(e) => setSelectedVirtue(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Learning Styles</option>
              {getVirtueOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "impact" | "title")
              }
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="impact">Sort by Impact</option>
              <option value="title">Sort by Title</option>
            </select>

            {/* Refresh */}
            <button
              onClick={loadCompletedActions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Actions List */}
        <div className="space-y-4">
          {filteredActions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
              <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No completed actions found
              </h3>
              <p className="text-slate-600">
                {searchTerm || selectedVirtue !== "all"
                  ? "Try adjusting your search or filters"
                  : "Complete some actions to see them here"}
              </p>
            </div>
          ) : (
            filteredActions.map((action) => (
              <div
                key={action.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {action.title}
                      </h3>
                      {renderImpactStars(action.impactRating)}
                    </div>

                    <p className="text-slate-600 mb-3">{action.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(action.completedAt)}</span>
                      </span>
                      <span>•</span>
                      <span>{action.virtueName}</span>
                      {action.tags && action.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Tag className="h-4 w-4" />
                            <span>{action.tags.join(", ")}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {action.lessonsLearned && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-slate-700 mb-1">
                          Lessons Learned:
                        </h4>
                        <p className="text-sm text-slate-600">
                          {action.lessonsLearned}
                        </p>
                      </div>
                    )}

                    {action.nextSteps && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-slate-700 mb-1">
                          Next Steps:
                        </h4>
                        <p className="text-sm text-slate-600">
                          {action.nextSteps}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleArchive(action.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(action.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
