import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { QuizQuestion } from "../data";

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionId: string]: number;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
    setShowResults(true);

    const score = questions.reduce((acc, question) => {
      const selected = selectedAnswers[question.id];
      return acc + (selected === question.correctAnswer ? 1 : 0);
    }, 0);

    if (onComplete) {
      onComplete(score, questions.length);
    }
  };

  const getScore = () => {
    return questions.reduce((acc, question) => {
      const selected = selectedAnswers[question.id];
      return acc + (selected === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const score = submitted ? getScore() : 0;
  const percentage =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {questions.map((question, questionIndex) => {
        const selectedAnswer = selectedAnswers[question.id];
        const showAnswer = submitted && showResults;

        return (
          <div
            key={question.id}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                {questionIndex + 1}
              </span>
              <h3 className="text-lg font-semibold text-slate-900 flex-1">
                {question.question}
              </h3>
            </div>

            <div className="space-y-2 ml-11">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isCorrectOption = optionIndex === question.correctAnswer;
                let className =
                  "w-full text-left p-4 rounded-lg border-2 transition-all ";

                if (showAnswer) {
                  if (isCorrectOption) {
                    className += "border-green-500 bg-green-50";
                  } else if (isSelected && !isCorrectOption) {
                    className += "border-red-500 bg-red-50";
                  } else {
                    className += "border-slate-200 bg-slate-50";
                  }
                } else {
                  className += isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 cursor-pointer";
                }

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(question.id, optionIndex)}
                    disabled={submitted}
                    className={className}
                  >
                    <div className="flex items-center gap-3">
                      {showAnswer && isCorrectOption && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                      {showAnswer && isSelected && !isCorrectOption && (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                      {!showAnswer && isSelected && (
                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-blue-500 flex-shrink-0" />
                      )}
                      {!showAnswer && !isSelected && (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                      )}
                      <span className="text-base text-slate-700">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showAnswer && question.explanation && (
              <div className="mt-4 ml-11 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    {question.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        </div>
      )}

      {showResults && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Quiz Results
            </h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {score} / {questions.length}
            </div>
            <div className="text-lg text-slate-600 mb-4">
              {percentage}% Correct
            </div>
            <div className="text-base text-slate-500">
              {percentage >= 80
                ? "🎉 Excellent work! You've mastered this material."
                : percentage >= 60
                ? "👍 Good job! Review the questions you missed."
                : "📚 Keep studying! Review the course material and try again."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
