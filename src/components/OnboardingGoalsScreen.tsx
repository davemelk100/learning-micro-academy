import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Plus, X } from "lucide-react";

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
}

interface OnboardingGoalsScreenProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (_goals: LearningGoal[]) => void;
}

export const OnboardingGoalsScreen: React.FC<OnboardingGoalsScreenProps> = ({
  onNext,
  onBack,
  onComplete,
}) => {
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
  });

  const handleAddGoal = () => {
    if (newGoal.title.trim() && newGoal.description.trim() && newGoal.targetDate) {
      const goal: LearningGoal = {
        id: Date.now().toString(),
        ...newGoal,
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: "", description: "", targetDate: "" });
      setShowAddForm(false);
    }
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleNext = () => {
    if (goals.length > 0) {
      onComplete(goals);
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm-white px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Set Your Learning Goals
          </h1>
          <p className="text-slate-700">
            Define specific, measurable objectives for your educational
            development.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {goals.length === 0 && !showAddForm && (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">
                Start by adding your first learning goal
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-medium flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Learning Goal
              </button>
            </div>
          )}

          {showAddForm && (
            <div className="mb-6 p-4 border-2 border-slate-300 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  placeholder="e.g., Master React Development"
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                  placeholder="Describe what you want to achieve..."
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGoal({ title: "", description: "", targetDate: "" });
                  }}
                  className="px-4 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {goals.length > 0 && (
            <div className="space-y-4 mb-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 border-2 border-slate-200 rounded-lg flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {goal.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveGoal(goal.id)}
                    className="ml-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!showAddForm && goals.length > 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors text-slate-700 font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Goal
            </button>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-slate-300 rounded-full hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={goals.length === 0}
            className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

