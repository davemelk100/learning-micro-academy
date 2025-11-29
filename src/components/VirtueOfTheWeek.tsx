import React from "react";
import { Sparkles } from "lucide-react";

export const VirtueOfTheWeek: React.FC = () => {
  return (
    <div
      className="bg-slate-50 object-cover p-4 text-[#0f172a] border border-slate-100"
      style={{ minHeight: "320px" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <span className="mr-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
            </span>
            <h3 className="text-xl font-semibold text-slate-900">
              Featured Course
            </h3>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-[#0f172a]">
            Intro to UX
          </h3>
          <div className="relative">
            <p className="text-[#0f172a] text-sm leading-relaxed mb-4 text-slate-600">
              Master the fundamentals of user experience design in this
              comprehensive course. Learn how to create intuitive interfaces,
              conduct user research, and build products that people love.
              Perfect for designers, developers, and product managers looking to
              enhance their UX skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
