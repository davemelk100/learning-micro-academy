import React from "react";
import { Sparkles } from "lucide-react";

interface VirtueOfTheWeekProps {
  onNavigateToCourse?: (courseId: string) => void;
}

export const VirtueOfTheWeek: React.FC<VirtueOfTheWeekProps> = ({
  onNavigateToCourse,
}) => {
  const handleClick = () => {
    if (onNavigateToCourse) {
      onNavigateToCourse("intro-to-ux");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-slate-50 p-4 md:p-6 border border-slate-100 rounded-xl text-[#0f172a] ${
        onNavigateToCourse
          ? "cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all"
          : ""
      }`}
      style={{ minHeight: "200px" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <span className="mr-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
            </span>
            <h3 className="text-xl font-semibold text-slate-900">
              Featured Course
            </h3>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-[#0f172a]">
            Intro to UX
          </h3>
          <div className="relative">
            <p className="text-[#0f172a] text-md leading-relaxed text-slate-600 mb-4">
              Master the fundamentals of user experience design in this
              comprehensive course. Learn how to create intuitive interfaces,
              conduct user research, and build products that people love.
              Perfect for designers, developers, and product managers looking to
              enhance their UX skills.
            </p>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop"
              alt="Learning Environment"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
