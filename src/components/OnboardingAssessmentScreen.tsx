import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingAssessmentScreenProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (_data: {
    subjects: string[];
    proficiencyLevel: string;
  }) => void;
}

export const OnboardingAssessmentScreen: React.FC<OnboardingAssessmentScreenProps> = ({
  onNext,
  onBack,
  onComplete,
}) => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [proficiencyLevel, setProficiencyLevel] = useState<string>("");

  const subjectOptions = [
    "Web Development",
    "Data Science",
    "Design",
    "Product Management",
    "Marketing",
    "Business Strategy",
    "Programming",
    "Data Analytics",
    "User Experience",
    "Other",
  ];

  const proficiencyLevels = [
    { value: "beginner", label: "Beginner - Just starting out" },
    { value: "intermediate", label: "Intermediate - Some experience" },
    { value: "advanced", label: "Advanced - Strong foundation" },
    { value: "expert", label: "Expert - Deep knowledge" },
  ];

  const handleSubjectToggle = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleNext = () => {
    if (subjects.length > 0 && proficiencyLevel) {
      onComplete({
        subjects,
        proficiencyLevel,
      });
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm-white px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Initial Skills Assessment
          </h1>
          <p className="text-slate-700">
            Help us understand your current knowledge level and learning
            objectives.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Question 1: Subjects */}
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              What subjects or skills are you focusing on?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjectOptions.map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleSubjectToggle(subject)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                    subjects.includes(subject)
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Proficiency Level */}
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              What is your current proficiency level in these areas?
            </label>
            <div className="space-y-2">
              {proficiencyLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setProficiencyLevel(level.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    proficiencyLevel === level.value
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-slate-300 rounded-full hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              subjects.length === 0 || !proficiencyLevel
            }
            className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-medium disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

