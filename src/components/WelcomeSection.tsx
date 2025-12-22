import React from "react";

interface WelcomeSectionProps {
  userName: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  return (
    <div className="mb-6 md:mb-8">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {userName}!
        </h2>
      </div>
    </div>
  );
};
