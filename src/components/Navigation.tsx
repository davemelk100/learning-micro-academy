import { User as UserIcon, LogOut, Target, BookOpen } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { UserState } from "../types";

interface NavigationProps {
  currentScreen: number;
  navigateToScreen: (screen: number) => void;
  setShowAuthModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  getUserState: () => Promise<UserState>;
  setUserState: (state: UserState) => void;
  onNavigateToCourseLibrary?: () => void;
}

export const Navigation = ({
  currentScreen,
  navigateToScreen,
  setShowAuthModal,
  setShowProfileModal,
  getUserState,
  setUserState,
  onNavigateToCourseLibrary,
}: NavigationProps) => {
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", action: () => navigateToScreen(0) },
    {
      label: "Course Library",
      action: () => {
        onNavigateToCourseLibrary?.();
        navigateToScreen(21);
      },
    },
  ];

  return (
    <>
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.action();
            }}
            className="text-slate-600 hover:text-slate-900 text-lg font-medium transition-colors"
          >
            {item.label}
          </button>
        ))}
        {/* Auth/Profile Buttons */}
        <div className="flex items-center gap-2 ml-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-white rounded-lg p-2 shadow-md hover:bg-slate-100 transition-colors border border-slate-200"
                title="Profile"
              >
                <UserIcon className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={() => {
                  logout();
                  getUserState().then(setUserState).catch(console.error);
                }}
                className="bg-white rounded-lg p-2 shadow-md hover:bg-slate-100 transition-colors border border-slate-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-slate-700" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-slate-900 text-white rounded-lg px-4 py-2 shadow-md hover:bg-slate-800 transition-colors text-lg font-medium"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Tray Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 border-t border-slate-200">
        <div className="flex items-center justify-between px-6 py-3">
          {navItems.map((item, index) => {
            // Determine if this item is currently active
            const isActive =
              (item.label === "Dashboard" && currentScreen === 0) ||
              (item.label === "Course Library" && currentScreen === 21);

            return (
              <button
                key={index}
                onClick={() => item.action()}
                className={`flex flex-col items-center space-y-1 p-2 transition-all duration-200 ${
                  isActive
                    ? "text-blue-600 bg-blue-50 object-cover"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label === "Dashboard" && (
                  <Target
                    className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`}
                  />
                )}
                {item.label === "Course Library" && (
                  <BookOpen
                    className={`h-5 w-5 ${isActive ? "text-blue-600" : ""}`}
                  />
                )}
                <span
                  className={`text-lg font-medium ${
                    isActive ? "text-blue-600" : ""
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
          {/* Mobile Auth Button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex flex-col items-center space-y-1 p-2 text-slate-600 hover:text-slate-900"
                title="Profile"
              >
                <UserIcon className="h-5 w-5" />
                <span className="text-lg font-medium">Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex flex-col items-center space-y-1 p-2 text-slate-600 hover:text-slate-900"
              >
                <UserIcon className="h-5 w-5" />
                <span className="text-lg font-medium">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
