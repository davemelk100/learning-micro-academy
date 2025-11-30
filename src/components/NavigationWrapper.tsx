import { Navigation } from "./Navigation";
import { UserState } from "../types";

interface NavigationWrapperProps {
  currentScreen: number;
  navigateToScreen: (screen: number) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  getUserState: () => Promise<UserState>;
  setUserState: (state: UserState) => void;
  onNavigateToCourseLibrary?: () => void;
}

export const createNavigationComponent = (props: NavigationWrapperProps) => {
  return () => <Navigation {...props} />;
};
