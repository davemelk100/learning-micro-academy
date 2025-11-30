import { Navigation } from "./Navigation";
import { UserState } from "../types";

interface NavigationWrapperProps {
  currentScreen: string;
  navigateToScreen: (path: string) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  getUserState: () => Promise<UserState>;
  setUserState: (state: UserState) => void;
  onNavigateToCourseLibrary?: () => void;
}

export const createNavigationComponent = (props: NavigationWrapperProps) => {
  return () => <Navigation {...props} />;
};
