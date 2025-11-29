import React, { useState } from "react";
import { courses, Course, CourseLesson } from "../data";
import {
  BookOpen,
  Clock,
  Users,
  ChevronRight,
  Play,
  FileText,
  Target,
  HelpCircle,
  Check,
  CheckCircle2,
} from "lucide-react";
import { UserState } from "../types";
import { saveUserState } from "../utils";

interface CourseLibraryScreenProps {
  onBack: () => void;
  selectedFont?: string;
  Navigation?: React.ComponentType;
  userState?: UserState;
  onCourseComplete?: () => void;
  initialCourseId?: string;
}

export const CourseLibraryScreen: React.FC<CourseLibraryScreenProps> = ({
  onBack,
  Navigation,
  userState,
  onCourseComplete,
  initialCourseId,
}) => {
  const completedCourses = userState?.preferences?.completedCourses || [];

  // Initialize with initialCourseId if provided
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(
    initialCourseId
      ? courses.find((c) => c.id === initialCourseId) || null
      : null
  );

  const handleToggleComplete = (courseId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent card click when clicking button
    }
    if (!userState) return;

    const isCompleted = completedCourses.includes(courseId);
    const updatedCompletedCourses = isCompleted
      ? completedCourses.filter((id: string) => id !== courseId)
      : [...completedCourses, courseId];

    const updatedState: UserState = {
      ...userState,
      preferences: {
        ...userState.preferences,
        completedCourses: updatedCompletedCourses,
      },
    };

    saveUserState(updatedState);
    if (onCourseComplete) {
      onCourseComplete();
    }
  };

  const isCourseCompleted = (courseId: string) => {
    return completedCourses.includes(courseId);
  };
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(courses.map((c) => c.category))),
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "All" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "exercise":
        return <Target className="w-4 h-4" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (selectedLesson && selectedCourse) {
    return (
      <div className="min-h-screen bg-warm-white">
        {Navigation && (
          <header>
            <div className="px-4 md:px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={onBack}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <span className="text-2xl font-bold text-slate-900">
                      MicroLearn
                    </span>
                  </button>
                </div>
                <Navigation />
              </div>
            </div>
          </header>
        )}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedLesson(null)}
            className="mb-6 flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronRight className="w-5 h-5 mr-1 rotate-180" />
            Back to Course
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <span className="text-sm text-slate-500 mb-2 block">
                {selectedCourse.title}
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                {selectedLesson.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  {getLessonIcon(selectedLesson.type)}
                  <span className="capitalize">{selectedLesson.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedLesson.duration}
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {selectedLesson.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-warm-white">
        {Navigation && (
          <header>
            <div className="px-4 md:px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={onBack}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <span className="text-2xl font-bold text-slate-900">
                      MicroLearn
                    </span>
                  </button>
                </div>
                <Navigation />
              </div>
            </div>
          </header>
        )}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-6 flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronRight className="w-5 h-5 mr-1 rotate-180" />
            Back to Library
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-sm text-slate-500 mb-2 block">
                    {selectedCourse.category}
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {selectedCourse.title}
                  </h1>
                  <p className="text-slate-700 mb-4">
                    {selectedCourse.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-4 h-4" />
                  {selectedCourse.duration}
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <Users className="w-4 h-4" />
                  {selectedCourse.level}
                </div>
                {selectedCourse.instructor && (
                  <div className="text-slate-600">
                    Instructor: {selectedCourse.instructor}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCourse.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {userState && (
                <div className="mt-6">
                  <button
                    onClick={(e) => handleToggleComplete(selectedCourse.id, e)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                      isCourseCompleted(selectedCourse.id)
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {isCourseCompleted(selectedCourse.id) ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Mark as Complete
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Course Lessons
              </h2>
              <div className="space-y-3">
                {selectedCourse.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getLessonIcon(lesson.type)}
                          <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">
                            {lesson.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {Navigation && (
        <header>
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={onBack}
                  className="hover:opacity-80 transition-opacity"
                >
                  <span className="text-2xl font-bold text-slate-900">
                    MicroLearn
                  </span>
                </button>
              </div>
              <Navigation />
            </div>
          </div>
        </header>
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronRight className="w-5 h-5 mr-1 rotate-180" />
            Back to Home
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Course Library
              </h1>
              <p className="text-slate-600">
                Explore our collection of bite-sized courses for continuous
                learning
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border border-slate-200 relative"
            >
              {isCourseCompleted(course.id) && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-green-500 text-white rounded-full p-2">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {isCourseCompleted(course.id) && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        Completed
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full">
                      {course.level}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course.lessons.length} lessons
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">
              No courses found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              className="mt-4 text-slate-900 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
