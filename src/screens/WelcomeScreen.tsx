import { Navigation } from "../components/Navigation";
import { UserState } from "../types";
import { ROUTES } from "../routes";

interface WelcomeScreenProps {
  onStartOnboarding?: () => void;
  navigateToScreen: (path: string) => void;
  displayUser: { name: string; isNewUser: boolean };
  currentScreen: string;
  setShowAuthModal: (show: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  getUserState: () => Promise<UserState>;
  setUserState: (state: UserState) => void;
}

export const WelcomeScreen = ({
  onStartOnboarding,
  navigateToScreen,
  displayUser,
  currentScreen,
  setShowAuthModal,
  setShowProfileModal,
  getUserState,
  setUserState,
}: WelcomeScreenProps) => (
  <div className="min-h-screen flex flex-col max-w-[1200px] mx-auto">
    <header>
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigateToScreen(ROUTES.WELCOME)}
              className="hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold text-slate-900">
                MicroLearn
              </span>
            </button>
          </div>
          <Navigation
            currentScreen={currentScreen}
            navigateToScreen={navigateToScreen}
            setShowAuthModal={setShowAuthModal}
            setShowProfileModal={setShowProfileModal}
            getUserState={getUserState}
            setUserState={setUserState}
          />
        </div>
      </div>
    </header>

    <div className="flex-1 flex flex-col justify-center items-center px-6 text-center">
      <div className="bg-white/90 rounded-xl p-8 max-w-5xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Learning Micro-Academy
          </h1>
          <p className="text-lg text-slate-700 mb-6">
            Bite-sized courses for continuous learning. Explore our
            comprehensive course library.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          {displayUser.isNewUser && onStartOnboarding && (
            <button
              onClick={onStartOnboarding}
              className="w-full md:w-auto py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-lg"
            >
              Start Learning Journey
            </button>
          )}
          <button
            onClick={() => {
              navigateToScreen(ROUTES.COURSE_LIBRARY);
            }}
            className="w-full md:w-auto py-4 px-8 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-lg"
          >
            Explore Course Library
          </button>
        </div>
      </div>
    </div>

    <footer className="p-6 text-center"></footer>
  </div>
);
