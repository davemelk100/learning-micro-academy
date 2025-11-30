/**
 * App Content - All user-facing text from App.tsx
 * This file contains all text strings for easy CMS management
 */

export const appContent = {
  // Brand
  brand: {
    name: "MicroLearn",
  },

  // Learning Styles
  learningStyles: {
    visual: {
      name: "Visual",
      description: "Learn best through seeing and visual representations",
    },
    auditory: {
      name: "Auditory",
      description: "Learn best through listening and verbal instruction",
    },
    kinesthetic: {
      name: "Kinesthetic",
      description:
        "Learn best through hands-on experience and physical activity",
    },
    readingWriting: {
      name: "Reading/Writing",
      description: "Learn best through reading and writing activities",
    },
    social: {
      name: "Social",
      description: "Learn best in groups and through collaboration",
    },
    solitary: {
      name: "Solitary",
      description: "Learn best independently and through self-study",
    },
    logical: {
      name: "Logical",
      description: "Learn best through logic, reasoning, and systems thinking",
    },
  },

  // Screen Titles
  screens: {
    learningStyleSelection: {
      title: "Select Learning Style",
      header: "Select Learning Style",
    },
    goalCreation: {
      title: "Select or Create an Action",
    },
  },

  // AI Assistance
  ai: {
    helpButton: "Let Learning Micro-Academy help",
    recommendation: {
      title: "Learning Micro-Academy AI Recommendation",
      accept: "Accept",
      tryAnother: "Try Another",
    },
    loading: {
      courses:
        "Learning Micro-Academy AI is finding courses that match your selections",
    },
    suggestedCourses: {
      title: "Learning Micro-Academy AI Suggested Courses",
    },
  },

  // Messages
  messages: {
    courseNotFound: "Course not found, don't proceed",
  },

  // Buttons
  buttons: {
    back: "Back",
    next: "Next",
    select: "select",
    deselect: "deselect",
    clickToSelect: "Click to {action} this learning style",
  },

  // Pagination
  pagination: {
    back: "Back",
    next: "Next",
  },

  // Default values
  defaults: {
    guestName: "Guest",
  },
};

// Helper function to replace template variables
export function formatText(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
}
