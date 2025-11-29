import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Check, X, Plus } from "lucide-react";
import { Virtue } from "../types";
// virtues will be passed as props
import { getHeadingFontClass } from "../utils";

interface VirtueSelectionScreenProps {
  selectedSDGs: string[];
  currentSelectedSDG: string;
  selectedVirtue: Virtue | null;
  setSelectedVirtue: (virtue: Virtue | null) => void;
  navigateToScreen: (screen: number) => void;
  selectedFont: string;
  aiConversationOpen: boolean;
  conversationInputRef: React.RefObject<HTMLInputElement>;
  setAiConversationOpen: (open: boolean) => void;
  setAiConversationMessages: (
    messages: Array<{ role: "user" | "ai"; message: string }>
  ) => void;
  setAiConversationInput: (input: string) => void;
  aiConversationMessages: Array<{ role: "user" | "ai"; message: string }>;
  aiConversationInput: string;
  handleAIConversation: (input: string) => void;
  nextButtonPulse: boolean;
  virtues: Virtue[];
}

export const VirtueSelectionScreen: React.FC<VirtueSelectionScreenProps> = ({
  selectedSDGs,
  currentSelectedSDG,
  selectedVirtue,
  setSelectedVirtue,
  navigateToScreen,
  selectedFont,
  aiConversationOpen,
  conversationInputRef,
  setAiConversationOpen,
  setAiConversationMessages,
  setAiConversationInput,
  aiConversationMessages,
  aiConversationInput,
  handleAIConversation,
  nextButtonPulse,
  virtues,
}) => {
  const [isListView, setIsListView] = useState(false);

  // Redirect to SDGs screen if no SDG is selected
  useEffect(() => {
    if (selectedSDGs.length === 0) {
      navigateToScreen(8); // Go to SDGs screen
    }
  }, [selectedSDGs, navigateToScreen]);

  // Focus conversation input when conversation opens
  useEffect(() => {
    if (aiConversationOpen && conversationInputRef.current) {
      conversationInputRef.current.focus();
    }
  }, [aiConversationOpen, conversationInputRef]);

  // Don't render if no SDGs are selected
  if (selectedSDGs.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen  max-w-[1200px] mx-auto bg-warm-white px-4 md:px-0">
      <header>
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/"
                className="hover:opacity-80 transition-opacity flex items-center space-x-2"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 51 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ shapeRendering: "geometricPrecision" }}
                >
                  <g clipPath="url(#clip0_3153_5075)">
                    <path
                      d="M18.8926 2.5498C17.514 3.47523 16.3115 4.66469 15.4316 6.13867C13.0478 10.1315 12.8727 15.5974 15.5869 19.585L15.5967 19.5986C17.2049 21.8765 19.1905 23.6482 21.0518 25.3994L21.0566 25.4043C22.9768 27.1836 26.36 30.1312 28.3223 31.8838C30.1538 33.5746 31.6981 34.7233 32.4902 36.6045L32.6387 36.9912C33.7185 40.1042 33.0474 42.8706 32.9346 43.248L32.9199 43.2959C31.5815 47.7067 27.378 49.4408 26.7881 49.668C25.0788 50.2754 23.7083 50.3606 22.7861 50.3203L22.417 50.2969L22.0508 50.2578C21.6927 50.2127 21.3527 50.1504 20.9873 50.085C20.0489 49.9172 18.7691 49.624 17.209 49.0674L17.208 49.0664C7.7615 45.7003 1 36.6764 1 26.0742C1.00002 14.8515 8.57718 5.39941 18.8926 2.5498Z"
                      stroke="#8EA8C3"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d="M30.8906 2.85645C30.9268 2.85707 30.9551 2.85697 30.9736 2.85742C30.9828 2.85764 30.9898 2.85828 30.9941 2.8584H31.001C31.2178 2.86467 31.716 2.89111 32.3594 2.98047C32.8701 3.05147 33.779 3.18452 34.8418 3.56445V3.56543C35.0095 3.6261 35.5568 3.84216 36.7119 4.44531C37.6704 4.94713 38.5916 5.51207 39.4707 6.13281L39.8984 6.44922C45.9097 10.8949 49.8037 18.0303 49.8037 26.0791C49.8036 35.6307 44.3151 43.8996 36.3213 47.9072C40.0367 43.3219 39.8076 36.6584 36.959 31.8223L36.9521 31.8096L36.9443 31.7969C36.2809 30.7411 35.5256 29.895 34.8447 29.1611L34.8389 29.1553L34.833 29.1484L34.2432 28.543C31.2466 25.507 27.5703 22.3463 24.5498 19.5635C23.3708 18.4712 22.2329 17.4341 21.3535 16.4434L20.9932 16.0215C20.5486 15.4684 20.2779 15.0402 20.1035 14.5605L20.0986 14.5469L20.0928 14.5342L20.0127 14.3184C19.8366 13.8069 19.7288 13.2383 19.665 12.6455L19.6641 12.6348L19.6318 12.2871C19.3895 8.70406 21.9527 5.2691 25.4258 3.80762C26.7368 3.25536 28.1797 2.96166 29.6514 2.87891H29.6543C29.9917 2.85907 30.329 2.85352 30.585 2.85352C30.7122 2.85352 30.8179 2.85519 30.8906 2.85645Z"
                      stroke="#B43C00"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3153_5075">
                      <rect
                        width="50.8084"
                        height="50.6589"
                        fill="white"
                        transform="translate(0 0.669922)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-2xl font-bold text-slate-900">
                  MicroLearn
                </span>
              </Link>
            </div>
            {/* Navigation component would go here */}
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8">
        <div className="max-w-md mx-auto sm:max-w-lg md:max-w-[calc(42rem+400px)] lg:max-w-[calc(42rem+400px)]">
          {/* Virtue of the Week */}
          <div className="mb-3 text-left">
            <h1
              className={`text-2xl font-bold text-slate-900 ${getHeadingFontClass(
                selectedFont
              )}`}
            >
              Featured Course: Design Systems
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-3 md:p-6">
              <div className="mb-4 pb-2.5">
                {/* Desktop layout */}
                <div className="hidden lg:flex lg:items-center lg:justify-between">
                  <h3
                    className={`text-xl font-semibold text-card-header ${getHeadingFontClass(
                      selectedFont
                    )}`}
                  >
                    Aspects of life
                  </h3>
                  <button
                    onClick={() => selectedVirtue && navigateToScreen(3)}
                    disabled={!selectedVirtue}
                    className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                      selectedVirtue
                        ? `bg-button-dark hover:bg-slate-800 text-white shadow-lg ${
                            nextButtonPulse ? "animate-pulse" : ""
                          }`
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden">
                  {/* Title and Next button row */}
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-xl font-semibold text-card-header ${getHeadingFontClass(
                        selectedFont
                      )}`}
                    >
                      Aspects of life
                    </h3>
                    <button
                      onClick={() => selectedVirtue && navigateToScreen(3)}
                      disabled={!selectedVirtue}
                      className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                        selectedVirtue
                          ? `bg-button-dark hover:bg-slate-800 text-white shadow-lg ${
                              nextButtonPulse ? "animate-pulse" : ""
                            }`
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Conversation Interface */}
              {aiConversationOpen && (
                <div className="mb-6 bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-semibold text-slate-700">
                      Ask Haven why this was recommended
                    </h5>
                    <button
                      onClick={() => {
                        setAiConversationOpen(false);
                        setAiConversationMessages([]);
                        setAiConversationInput("");
                      }}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="max-h-80 overflow-y-auto mb-3 space-y-2">
                    {aiConversationMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-full text-sm ${
                            message.role === "user"
                              ? "bg-cream-3000 text-white"
                              : "bg-white text-slate-700 border border-slate-200"
                          }`}
                        >
                          {message.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex space-x-2">
                    <input
                      ref={conversationInputRef}
                      type="text"
                      placeholder="Ask Haven anything..."
                      value={aiConversationInput}
                      onChange={(e) => setAiConversationInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAIConversation(aiConversationInput);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => handleAIConversation(aiConversationInput)}
                      disabled={!aiConversationInput.trim()}
                      className="px-4 py-2 bg-button-dark hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-sm transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {!currentSelectedSDG && (
                <div className="mb-4 p-3 bg-white border border-slate-200 rounded-lg">
                  <p className="text-sm leading-normal">
                    Please select a Sustainable Development Goal first to enable
                    virtue selection.{" "}
                    <button
                      onClick={() => navigateToScreen(8)}
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Select
                    </button>
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-8">
                {virtues.map((virtue) => {
                  const IconComponent = virtue.icon;
                  const isSelected =
                    selectedVirtue?.id === virtue.id && currentSelectedSDG;

                  return (
                    <div
                      key={virtue.id}
                      className="w-full bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex items-center space-x-4"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${virtue.color}`}
                        >
                          <IconComponent
                            className={`h-6 w-6 ${virtue.iconColor}`}
                          />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {virtue.name}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() =>
                            currentSelectedSDG && setSelectedVirtue(virtue)
                          }
                          disabled={!currentSelectedSDG}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                          } ${
                            !currentSelectedSDG
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => navigateToScreen(8)}
                  className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => selectedVirtue && navigateToScreen(3)}
                  disabled={!selectedVirtue}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                    selectedVirtue
                      ? `bg-button-dark hover:bg-slate-800 text-white shadow-lg ${
                          nextButtonPulse ? "animate-pulse" : ""
                        }`
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
