import React from "react";

interface DashboardFeaturedCourseProps {
  selectedFont: string;
  getHeadingFontClass: (_font: string) => string;
}

export const DashboardFeaturedCourse: React.FC<
  DashboardFeaturedCourseProps
> = ({ selectedFont, getHeadingFontClass }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-6">
      <h3
        className={`text-xl font-semibold text-slate-900 ${getHeadingFontClass(
          selectedFont
        )} mb-4`}
      >
        Featured Course: <span className="text-blue-600">Intro to UX</span>
      </h3>
      <p className="text-xl text-slate-700 leading-relaxed mb-4">
        Master the fundamentals of user experience design. Learn how to create
        intuitive interfaces, conduct user research, and build products that
        people love.
      </p>
    </div>
  );
};
