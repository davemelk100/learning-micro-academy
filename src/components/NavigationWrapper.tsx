import { Navigation } from "./Navigation";

interface NavigationWrapperProps {
  currentScreen: number;
  navigateToScreen: (screen: number) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  getUserState: () => Promise<any>;
  setUserState: (state: any) => void;
}

export const createNavigationComponent = (props: NavigationWrapperProps) => {
  return () => <Navigation {...props} />;
};

