import { CompletedAction, DatabaseService } from "../types";

// In a real application, this would connect to a proper database
// For now, we'll use localStorage as a simple persistence layer
const COMPLETED_ACTIONS_KEY = "learning_micro_academy_completed_actions";

class LocalDatabaseService implements DatabaseService {
  private getCompletedActionsFromStorage(): CompletedAction[] {
    try {
      const stored = localStorage.getItem(COMPLETED_ACTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load completed actions:", error);
      return [];
    }
  }

  private saveCompletedActionsToStorage(actions: CompletedAction[]): void {
    try {
      localStorage.setItem(COMPLETED_ACTIONS_KEY, JSON.stringify(actions));
    } catch (error) {
      console.error("Failed to save completed actions:", error);
      throw new Error("Failed to save completed action");
    }
  }

  async saveCompletedAction(action: CompletedAction): Promise<void> {
    const actions = this.getCompletedActionsFromStorage();
    const existingIndex = actions.findIndex((a) => a.id === action.id);

    if (existingIndex >= 0) {
      actions[existingIndex] = {
        ...action,
        updatedAt: new Date().toISOString(),
      };
    } else {
      actions.push(action);
    }

    this.saveCompletedActionsToStorage(actions);
  }

  async getCompletedActions(): Promise<CompletedAction[]> {
    return this.getCompletedActionsFromStorage();
  }

  async updateCompletedAction(
    id: string,
    updates: Partial<CompletedAction>
  ): Promise<void> {
    const actions = this.getCompletedActionsFromStorage();
    const index = actions.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new Error("Completed action not found");
    }

    actions[index] = {
      ...actions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveCompletedActionsToStorage(actions);
  }

  async deleteCompletedAction(id: string): Promise<void> {
    const actions = this.getCompletedActionsFromStorage();
    const filteredActions = actions.filter((a) => a.id !== id);
    this.saveCompletedActionsToStorage(filteredActions);
  }

  async archiveCompletedAction(id: string): Promise<void> {
    await this.updateCompletedAction(id, {
      isArchived: true,
      archivedAt: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const databaseService = new LocalDatabaseService();

// Helper function to create a CompletedAction from a Goal
export const createCompletedActionFromGoal = (
  goal: any,
  virtueName: string,
  additionalData?: {
    completionNotes?: string;
    impactRating?: number;
    lessonsLearned?: string;
    nextSteps?: string;
    tags?: string[];
  }
): CompletedAction => {
  const now = new Date().toISOString();

  return {
    id: `completed_${goal.id}_${Date.now()}`,
    originalGoalId: goal.id,
    title: goal.title,
    description: goal.description,
    virtueId: goal.virtueId,
    virtueName,
    sdgIds: goal.sdgIds || [],
    completedAt: now,
    completionNotes: additionalData?.completionNotes || "",
    impactRating: additionalData?.impactRating,
    lessonsLearned: additionalData?.lessonsLearned || "",
    nextSteps: additionalData?.nextSteps || "",
    tags: additionalData?.tags || [],
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };
};
