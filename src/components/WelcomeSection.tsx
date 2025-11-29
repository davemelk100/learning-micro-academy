import React from "react";
import { Sparkles } from "lucide-react";

interface WelcomeSectionProps {
  userName: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center mb-2">
        <span className="mr-3">
          <Sparkles className="h-6 w-6 text-blue-500" />
        </span>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {userName}!
        </h2>
      </div>
    </div>
  );
};
