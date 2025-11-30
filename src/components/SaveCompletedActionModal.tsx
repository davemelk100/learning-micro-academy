import React, { useState } from "react";
import { X, Star, Tag, FileText, ArrowRight } from "lucide-react";
import { CompletedAction, Goal, LearningStyle } from "../types";
import { createCompletedActionFromGoal } from "../services/databaseService";

interface SaveCompletedActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (_completedAction: CompletedAction) => void;
  goal: Goal;
  learningStyle: LearningStyle;
}

export const SaveCompletedActionModal: React.FC<
  SaveCompletedActionModalProps
> = ({ isOpen, onClose, onSave, goal, learningStyle }) => {
  const [completionNotes, setCompletionNotes] = useState("");
  const [impactRating, setImpactRating] = useState<number>(0);
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const completedAction = createCompletedActionFromGoal(goal, learningStyle.name, {
        completionNotes,
        impactRating: impactRating > 0 ? impactRating : undefined,
        lessonsLearned,
        nextSteps,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      await onSave(completedAction);
      onClose();

      // Reset form
      setCompletionNotes("");
      setImpactRating(0);
      setLessonsLearned("");
      setNextSteps("");
      setTags("");
    } catch (error) {
      console.error("Failed to save completed action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setCompletionNotes("");
    setImpactRating(0);
    setLessonsLearned("");
    setNextSteps("");
    setTags("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Save Completed Action
                </h3>
                <p className="text-sm text-slate-600">
                  Record your achievement for future reference
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Action Summary */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">{goal.title}</h4>
            <p className="text-sm text-slate-600 mb-2">{goal.description}</p>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span>Learning Style: {learningStyle.name}</span>
              <span>•</span>
              <span>Completed: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Completion Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FileText className="h-5 w-5 inline mr-1" />
                Completion Notes
              </label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="How did completing this action make you feel? What was the experience like?"
                rows={3}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
            </div>

            {/* Impact Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Star className="h-5 w-5 inline mr-1" />
                Impact Rating (1-5)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setImpactRating(rating)}
                    className={`w-10 h-10 rounded-full border-2 transition-colors ${
                      impactRating >= rating
                        ? "bg-yellow-400 border-yellow-400 text-white"
                        : "bg-white border-slate-300 text-slate-400 hover:border-yellow-300"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                How much impact did this action have on your life?
              </p>
            </div>

            {/* Lessons Learned */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FileText className="h-5 w-5 inline mr-1" />
                Lessons Learned
              </label>
              <textarea
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder="What did you learn from completing this action? What insights did you gain?"
                rows={3}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
            </div>

            {/* Next Steps */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <ArrowRight className="h-5 w-5 inline mr-1" />
                Next Steps
              </label>
              <textarea
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                placeholder="What would you like to do next? Any follow-up actions or related goals?"
                rows={3}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Tag className="h-5 w-5 inline mr-1" />
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., mindfulness, productivity, health, community"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">
                Add tags to help categorize and find this action later
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isLoading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-lg"
              }`}
            >
              {isLoading ? "Saving..." : "Save to Database"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
