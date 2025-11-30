import { UserState, UserPreferences } from "./types";
import { apiService } from "./services/apiService";

const STORAGE_KEY = "learning-micro-academy-user-state";

export const defaultUserPreferences: UserPreferences = {
  name: "Najuma",
  selectedFont: "philosopher-mulish",
};

export const saveUserState = async (state: UserState) => {
  // Always save to localStorage as backup
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save user state to localStorage:", error);
  }

  // If authenticated, also save to backend
  if (apiService.isAuthenticated()) {
    try {
      // Save preferences
      await apiService.updateUserPreferences(state.preferences);

      // Save goals
      await apiService.updateUserGoals(state.goals);
    } catch (error) {
      console.error("Failed to save user state to backend:", error);
      // Don't throw - localStorage backup is fine
    }
  }
};

export const getUserState = async (): Promise<UserState> => {
  // If authenticated, try to load from backend first
  if (apiService.isAuthenticated()) {
    try {
      const userResponse = await apiService.getCurrentUser();
      if (userResponse.data) {
        const user = userResponse.data;
        const state: UserState = {
          preferences: user.preferences || defaultUserPreferences,
          goals: user.goals || [],
          progress: user.progress || [],
          currentScreen: 0,
        };
        // Also save to localStorage as backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return state;
      }
    } catch (error) {
      console.error("Failed to load user state from backend:", error);
      // Fall through to localStorage
    }
  }

  // Fallback to localStorage
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
    console.error("Failed to load user state from localStorage:", error);
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

/**
 * Converts markdown-style text to HTML
 * Handles:
 * - Bullet lists (lines starting with `- `)
 * - Code blocks (```code```)
 * - Inline code (`code`)
 * - Paragraphs
 */
export const markdownToHtml = (text: string): string => {
  if (!text) return "";

  let html = "";
  const lines = text.split("\n");
  let inCodeBlock = false;
  let inList = false;
  let codeBlockContent = "";
  let codeBlockLanguage = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Handle code blocks
    if (trimmedLine.startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        html += `<pre><code class="language-${codeBlockLanguage}">${escapeHtml(
          codeBlockContent
        )}</code></pre>`;
        codeBlockContent = "";
        codeBlockLanguage = "";
        inCodeBlock = false;
      } else {
        // Start code block
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        codeBlockLanguage = trimmedLine.slice(3).trim() || "";
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += (codeBlockContent ? "\n" : "") + line;
      continue;
    }

    // Handle bullet lists
    if (trimmedLine.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      const listItem = trimmedLine.slice(2).trim();
      // Process inline code in list items
      const processedItem = processInlineCode(listItem);
      html += `<li>${processedItem}</li>`;
      continue;
    }

    // End list if we hit a non-list line
    if (inList && trimmedLine !== "") {
      html += "</ul>";
      inList = false;
    }

    // Handle empty lines (paragraph breaks)
    if (trimmedLine === "") {
      if (i < lines.length - 1 && lines[i + 1]?.trim() !== "") {
        html += "<br>";
      }
      continue;
    }

    // Handle regular paragraphs
    const processedLine = processInlineCode(trimmedLine);
    html += `<p>${processedLine}</p>`;
  }

  // Close any open tags
  if (inList) {
    html += "</ul>";
  }
  if (inCodeBlock) {
    html += `<pre><code class="language-${codeBlockLanguage}">${escapeHtml(
      codeBlockContent
    )}</code></pre>`;
  }

  return html;
};

/**
 * Processes inline code (`code`) in text
 */
const processInlineCode = (text: string): string => {
  // Escape HTML first
  let escaped = escapeHtml(text);
  // Replace inline code backticks
  escaped = escaped.replace(
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>'
  );
  return escaped;
};

/**
 * Escapes HTML special characters
 */
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
