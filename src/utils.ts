import { UserState, UserPreferences } from "./types";

const STORAGE_KEY = "learning-micro-academy-user-state";

export const defaultUserPreferences: UserPreferences = {
  name: "Najuma",
  selectedFont: "philosopher-mulish",
  selectedSDGs: [],
  currentSelectedSDG: "",
  hasCompletedSDGSetup: false,
};

export const saveUserState = (state: UserState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save user state:", error);
  }
};

export const getUserState = (): UserState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure all required fields exist with defaults
      return {
        preferences: { ...defaultUserPreferences, ...parsed.preferences },
        goals: parsed.goals || [],
        progress: parsed.progress || [],
        currentScreen: parsed.currentScreen || 0,
      };
    }
  } catch (error) {
    console.error("Failed to load user state:", error);
  }

  // Return default state if no stored data or error
  return {
    preferences: defaultUserPreferences,
    goals: [],
    progress: [],
    currentScreen: 0,
  };
};

export const clearUserState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear user state:", error);
  }
};

// Function to clear goal creation state (for starting fresh goal creation)
export const clearGoalCreationState = (): UserPreferences => {
  return {
    ...defaultUserPreferences,
    selectedVirtue: null,
    selectedSDGs: [],
    currentSelectedSDG: "",
    newGoal: {
      title: "5 minute action",
      description:
        "Share one example of gender equality you noticed today. This could be equal division of household tasks, balanced representation in media, or fair treatment at work.",
      target: 10,
    },
  };
};

export const getFontClass = (selectedFont: string): string => {
  switch (selectedFont) {
    case "nunito-poppins":
      return "font-poppins";
    case "raleway-inter":
      return "font-inter";
    case "inter-krub":
      return "font-krub";
    case "quicksand-bold-regular":
      return "font-quicksand";
    case "sintony-roboto":
      return "font-roboto";
    case "philosopher-mulish":
      return "font-mulish";
    case "archivo-narrow-geist":
      return "font-geist";
    default:
      return "font-poppins";
  }
};

export const getHeadingFontClass = (selectedFont: string): string => {
  switch (selectedFont) {
    case "nunito-poppins":
      return "font-nunito";
    case "raleway-inter":
      return "font-raleway";
    case "inter-krub":
      return "font-inter";
    case "quicksand-bold-regular":
      return "font-quicksand font-bold";
    case "sintony-roboto":
      return "font-sintony";
    case "philosopher-mulish":
      return "font-philosopher";
    case "archivo-narrow-geist":
      return "font-archivo-narrow";
    default:
      return "font-nunito";
  }
};
