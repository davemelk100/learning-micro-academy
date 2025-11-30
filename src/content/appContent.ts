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

  // SDG Goals
  sdgGoals: {
    sdg1: "User Experience Design",
    sdg2: "Design Systems",
    sdg3: "Web Development",
    sdg4: "Product Strategy",
    sdg5: "Data Analytics",
    sdg7: "Energy",
    sdg8: "Business Skills",
    sdg9: "Innovation",
    sdg10: "Communication",
    sdg11: "Leadership",
    sdg12: "Technology",
    sdg13: "Marketing",
    sdg14: "Finance",
    sdg15: "Personal Growth",
    sdg16: "Career Development",
    sdg17: "Creative Skills",
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
      learningStyle:
        "Learning Micro-Academy AI is analyzing your SDG selection and finding the perfect learning style match...",
      courses:
        "Learning Micro-Academy AI is finding courses that match your selections",
    },
    suggestedCourses: {
      title: "Learning Micro-Academy AI Suggested Courses",
    },
  },

  // Messages
  messages: {
    selectSDGFirst:
      "Please select a Sustainable Development Goal first to enable learning style selection.",
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

  // Learning Style Selection
  learningStyleSelection: {
    selectSDGFirst:
      "Please select a Sustainable Development Goal first to enable learning style selection.",
  },

  // AI Recommendation Reasons (for SDG selection)
  aiReasons: {
    "1": "Based on your profile, you show strong empathy and concern for social justice, making No Poverty a natural fit for your values.",
    "2": "Your interest in sustainable living and nutrition suggests Zero Hunger aligns perfectly with your lifestyle goals.",
    "3": "Your focus on personal wellness and helping others indicates Good Health and Well-being matches your priorities.",
    "4": "Your curiosity and desire for continuous learning makes Quality Education an ideal choice for your growth journey.",
    "5": "Your commitment to equality and fairness suggests Gender Equality resonates with your core values.",
    "6": "Your environmental consciousness and concern for water conservation makes Clean Water and Sanitation a perfect match.",
    "7": "Your interest in sustainable technology and renewable energy aligns with Affordable and Clean Energy goals.",
    "8": "Your entrepreneurial spirit and focus on meaningful work connects with Decent Work and Economic Growth.",
    "9": "Your innovative mindset and interest in technology makes Industry, Innovation and Infrastructure a natural fit.",
    "10": "Your commitment to social justice and reducing inequality aligns with Reduced Inequalities goals.",
    "11": "Your interest in community building and sustainable urban living connects with Sustainable Cities and Communities.",
    "12": "Your focus on mindful consumption and environmental responsibility makes Responsible Consumption and Production ideal.",
    "13": "Your environmental awareness and concern for future generations aligns with Climate Action priorities.",
    "14": "Your love for nature and marine conservation interests connect with Life Below Water goals.",
    "15": "Your appreciation for biodiversity and environmental stewardship makes Life on Land a perfect match.",
    "16": "Your commitment to justice and building inclusive communities aligns with Peace, Justice and Strong Institutions.",
    "17": "Your collaborative nature and belief in collective action connects with Partnerships for the Goals.",
    default: "{sdgTitle} aligns with the subject matter.",
  },

  // Learning Style AI Reasons (template-based)
  learningStyleReasons: {
    introToUx:
      "{learningStyleName} aligns with {sdgTitle} by helping you understand user needs and create solutions that address real-world challenges.",
    designSystems:
      "{learningStyleName} complements {sdgTitle} by providing structured approaches to creating scalable and sustainable solutions.",
    webDevelopment:
      "{learningStyleName} aligns with {sdgTitle} by enabling you to build digital solutions that can scale and reach more people.",
    productStrategy:
      "{learningStyleName} enhances {sdgTitle} by teaching strategic thinking and planning for long-term impact.",
    dataAnalytics:
      "{learningStyleName} supports {sdgTitle} by providing tools to measure impact and make data-driven decisions.",
    default:
      "{learningStyleName} aligns with {sdgTitle} by providing the learning foundation needed for meaningful progress.",
  },

  // Default values
  defaults: {
    guestName: "Guest",
    selectedSDGPlaceholder: "your selected SDG",
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
