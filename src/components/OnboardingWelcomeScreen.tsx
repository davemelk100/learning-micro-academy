import React from "react";
import { BookOpen, ArrowRight } from "lucide-react";

interface OnboardingWelcomeScreenProps {
  onNext: () => void;
}

export const OnboardingWelcomeScreen: React.FC<
  OnboardingWelcomeScreenProps
> = ({ onNext }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm-white px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <BookOpen className="w-16 h-16 text-slate-900 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to Active Courses
          </h1>
          <p className="text-lg text-slate-700">
            This app helps you track your educational progress and develop new
            skills systematically.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            What you'll be able to do:
          </h2>
          <ul className="text-left space-y-3 text-slate-700">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span>Set and track learning goals</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span>Monitor your skill development progress</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span>Measure performance with real-time metrics</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span>Customize your learning intensity and pace</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onNext}
          className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-2 mx-auto"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
