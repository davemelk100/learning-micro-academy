import React from "react";

export const AIInput: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Ask Learning Assistant anything..."
          className="w-full px-4 py-3 pl-16 bg-transparent border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:transition-colors text-sm"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg
            className="w-5 h-5 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
};
