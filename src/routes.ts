// Route constants for type-safe navigation
export const ROUTES = {
  DASHBOARD: "/dashboard",
  WELCOME: "/welcome",
  COURSE_LIBRARY: "/courses",
  COURSE_DETAIL: "/courses/:courseId",
} as const;

// Helper function to generate course detail route
export const getCourseRoute = (courseId: string) => `/courses/${courseId}`;

// Type for route paths
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES] | string;
