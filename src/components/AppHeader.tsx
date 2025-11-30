import React from "react";
import { ROUTES } from "../routes";

interface AppHeaderProps {
  navigateToScreen: (_path: string) => void;
  Navigation: React.ComponentType;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  navigateToScreen,
  Navigation,
}) => {
  return (
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
          <Navigation />
        </div>
      </div>
    </header>
  );
};
